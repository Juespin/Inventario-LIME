import React, { useState, useMemo } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Wrench, Gauge, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Equipment, Site, Service, Responsible, MaintenanceEvent, MaintenanceType } from '../types';
import { generateMaintenanceEvents, sortEventsByUrgency, formatDaysRemaining } from '../utils/maintenance';
import { Breadcrumbs } from './Breadcrumbs';
import { Tooltip } from './Tooltip';

interface MaintenanceCalendarProps {
    equipments: Equipment[];
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
}

export const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({
    equipments,
    sites,
    services,
    responsibles
}) => {
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [filterType, setFilterType] = useState<MaintenanceType | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'due' | 'overdue'>('all');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Generar eventos de mantenimiento
    const allEvents = useMemo(() => {
        return generateMaintenanceEvents(equipments);
    }, [equipments]);

    // Filtrar eventos
    const filteredEvents = useMemo(() => {
        let filtered = [...allEvents];

        if (filterType !== 'all') {
            filtered = filtered.filter(e => e.type === filterType);
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(e => e.status === filterStatus);
        }

        return sortEventsByUrgency(filtered);
    }, [allEvents, filterType, filterStatus]);

    // Contadores
    const stats = useMemo(() => {
        const overdue = allEvents.filter(e => e.status === 'overdue').length;
        const due = allEvents.filter(e => e.status === 'due').length;
        const upcoming = allEvents.filter(e => e.status === 'upcoming').length;

        return { overdue, due, upcoming, total: allEvents.length };
    }, [allEvents]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'due':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'upcoming':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type: MaintenanceType) => {
        return type === 'maintenance' ? Wrench : Gauge;
    };

    const getTypeLabel = (type: MaintenanceType) => {
        return type === 'maintenance' ? 'Mantenimiento' : 'Calibración';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long'
        });
    };

    const formatDateFull = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Obtener eventos para un mes específico
    const getEventsForMonth = (year: number, month: number) => {
        return filteredEvents.filter(event => {
            const eventDate = new Date(event.nextDate);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    };

    // Obtener la semana del mes para un evento (0-3 o 0-4)
    const getWeekOfMonth = (date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDayOfWeek = firstDay.getDay();
        const dayOfMonth = date.getDate();
        return Math.floor((firstDayOfWeek + dayOfMonth - 1) / 7);
    };

    // Obtener eventos para una semana específica
    const getEventsForWeek = (year: number, month: number, week: number) => {
        return filteredEvents.filter(event => {
            const eventDate = new Date(event.nextDate);
            const eventYear = eventDate.getFullYear();
            const eventMonth = eventDate.getMonth();
            
            if (eventYear !== year || eventMonth !== month) {
                return false;
            }
            
            const eventWeek = getWeekOfMonth(eventDate);
            return eventWeek === week;
        });
    };

    // Obtener eventos para un día específico (para mostrar en toda la semana)
    const getEventsForDay = (year: number, month: number, day: number) => {
        const currentDate = new Date(year, month, day);
        const week = getWeekOfMonth(currentDate);
        const weekEvents = getEventsForWeek(year, month, week);
        
        // Si es el primer día de la semana, devolver todos los eventos de esa semana
        const firstDayOfWeek = currentDate.getDay();
        if (firstDayOfWeek === 0 || day === 1) {
            return weekEvents;
        }
        
        // Para otros días, solo mostrar eventos si es el primer día de la semana
        return [];
    };

    // Verificar si un mes tiene eventos vencidos
    const hasOverdueEventsInMonth = (year: number, month: number) => {
        const monthEvents = getEventsForMonth(year, month);
        return monthEvents.some(event => event.status === 'overdue');
    };

    // Contar eventos vencidos en un mes
    const countOverdueEventsInMonth = (year: number, month: number) => {
        const monthEvents = getEventsForMonth(year, month);
        return monthEvents.filter(event => event.status === 'overdue').length;
    };

    // Generar días del mes
    const getDaysInMonth = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Días vacíos al inicio
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentMonth);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentMonth(newDate);
    };

    return (
        <div>
            <Breadcrumbs 
                items={[
                    { label: 'Calendario de Mantenimientos', onClick: undefined }
                ]}
            />

            {/* Header con estadísticas */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Calendario de Mantenimientos</h1>
                <p className="text-gray-600 mb-4">Gestiona y visualiza los próximos mantenimientos y calibraciones</p>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-red-700">Vencidos</p>
                                <p className="text-xl sm:text-2xl font-bold text-red-900">{stats.overdue}</p>
                            </div>
                            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-amber-700">Próximos</p>
                                <p className="text-xl sm:text-2xl font-bold text-amber-900">{stats.due}</p>
                            </div>
                            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-blue-700">Programados</p>
                                <p className="text-xl sm:text-2xl font-bold text-blue-900">{stats.upcoming}</p>
                            </div>
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                {/* Filtros y vista */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                view === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            aria-label="Vista de lista"
                        >
                            Lista
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                view === 'calendar'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            aria-label="Vista de calendario"
                        >
                            Calendario
                        </button>
                    </div>

                    <div className="flex gap-2 flex-wrap flex-1">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as MaintenanceType | 'all')}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Filtrar por tipo"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="maintenance">Solo Mantenimientos</option>
                            <option value="calibration">Solo Calibraciones</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'due' | 'overdue')}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Filtrar por estado"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="overdue">Vencidos</option>
                            <option value="due">Próximos (≤30 días)</option>
                            <option value="upcoming">Programados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Contenido según vista */}
            {view === 'list' ? (
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    {filteredEvents.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {filteredEvents.map(event => {
                                const TypeIcon = getTypeIcon(event.type);
                                const site = sites.find(s => s.id === event.siteId);
                                const service = services.find(s => s.id === event.serviceId);
                                const responsible = responsibles.find(r => r.id === event.responsibleId);

                                return (
                                    <div
                                        key={event.id}
                                        className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors border-l-4 ${
                                            event.status === 'overdue' ? 'border-red-500' :
                                            event.status === 'due' ? 'border-amber-500' :
                                            'border-blue-500'
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <TypeIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-gray-900">{event.equipmentName}</h3>
                                                        <p className="text-sm text-gray-500 font-mono">{event.inventoryCode}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-8">
                                                    <span>
                                                        <strong>Tipo:</strong> {getTypeLabel(event.type)}
                                                    </span>
                                                    {event.lastDate && (
                                                        <span>
                                                            <strong>Última fecha:</strong> {formatDateFull(event.lastDate)}
                                                        </span>
                                                    )}
                                                    <span>
                                                        <strong>Frecuencia:</strong> {event.frequency} meses
                                                    </span>
                                                    {site && (
                                                        <span>
                                                            <strong>Sede:</strong> {site.name}
                                                        </span>
                                                    )}
                                                    {service && (
                                                        <span>
                                                            <strong>Servicio:</strong> {service.name}
                                                        </span>
                                                    )}
                                                    {responsible && (
                                                        <span>
                                                            <strong>Responsable:</strong> {responsible.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:items-end gap-2">
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                                                    {event.status === 'overdue' ? 'Vencido' :
                                                     event.status === 'due' ? 'Próximo' :
                                                     'Programado'}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-700">Próximo mes:</p>
                                                    <p className="text-base font-bold text-blue-600">{formatDate(event.nextDate)}</p>
                                                    <p className={`text-sm font-medium mt-1 ${
                                                        event.daysRemaining < 0 ? 'text-red-600' :
                                                        event.daysRemaining <= 30 ? 'text-amber-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                        {formatDaysRemaining(event.daysRemaining)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                            <p className="text-gray-600">No hay eventos de mantenimiento que coincidan con los filtros seleccionados.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                    {/* Navegación del calendario */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className={`relative p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                (() => {
                                    const prevDate = new Date(currentMonth);
                                    prevDate.setMonth(prevDate.getMonth() - 1);
                                    return hasOverdueEventsInMonth(prevDate.getFullYear(), prevDate.getMonth())
                                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
                                })()
                            }`}
                            aria-label="Mes anterior"
                        >
                            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                            {(() => {
                                const prevDate = new Date(currentMonth);
                                prevDate.setMonth(prevDate.getMonth() - 1);
                                const overdueCount = countOverdueEventsInMonth(prevDate.getFullYear(), prevDate.getMonth());
                                if (overdueCount > 0) {
                                    return (
                                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {overdueCount}
                                        </span>
                                    );
                                }
                                return null;
                            })()}
                        </button>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h2>
                            {(() => {
                                const currentMonthEvents = getEventsForMonth(currentMonth.getFullYear(), currentMonth.getMonth());
                                const overdueCount = currentMonthEvents.filter(e => e.status === 'overdue').length;
                                const dueCount = currentMonthEvents.filter(e => e.status === 'due').length;
                                const upcomingCount = currentMonthEvents.filter(e => e.status === 'upcoming').length;
                                
                                const parts: string[] = [];
                                if (overdueCount > 0) {
                                    parts.push(`<span class="text-red-600 font-semibold">${overdueCount} vencido${overdueCount > 1 ? 's' : ''}</span>`);
                                }
                                if (dueCount > 0) {
                                    parts.push(`<span class="text-amber-600 font-semibold">${dueCount} próximo${dueCount > 1 ? 's' : ''}</span>`);
                                }
                                if (upcomingCount > 0) {
                                    parts.push(`<span class="text-blue-600 font-semibold">${upcomingCount} programado${upcomingCount > 1 ? 's' : ''}</span>`);
                                }
                                
                                if (parts.length > 0) {
                                    return (
                                        <p 
                                            className="text-xs text-gray-600 mt-1"
                                            dangerouslySetInnerHTML={{ __html: parts.join(' • ') }}
                                        />
                                    );
                                }
                                return (
                                    <p className="text-xs text-gray-400 mt-1 italic">
                                        Sin eventos programados
                                    </p>
                                );
                            })()}
                        </div>
                        <button
                            onClick={() => navigateMonth('next')}
                            className={`relative p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                (() => {
                                    const nextDate = new Date(currentMonth);
                                    nextDate.setMonth(nextDate.getMonth() + 1);
                                    return hasOverdueEventsInMonth(nextDate.getFullYear(), nextDate.getMonth())
                                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
                                })()
                            }`}
                            aria-label="Mes siguiente"
                        >
                            <ChevronRight className="w-5 h-5" aria-hidden="true" />
                            {(() => {
                                const nextDate = new Date(currentMonth);
                                nextDate.setMonth(nextDate.getMonth() + 1);
                                const overdueCount = countOverdueEventsInMonth(nextDate.getFullYear(), nextDate.getMonth());
                                if (overdueCount > 0) {
                                    return (
                                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {overdueCount}
                                        </span>
                                    );
                                }
                                return null;
                            })()}
                        </button>
                    </div>

                    {/* Calendario */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()).map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} className="aspect-square"></div>;
                            }

                            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const week = getWeekOfMonth(currentDate);
                            const weekEvents = getEventsForWeek(currentMonth.getFullYear(), currentMonth.getMonth(), week);
                            const firstDayOfWeek = currentDate.getDay();
                            const isFirstDayOfWeek = firstDayOfWeek === 0;
                            const isToday = new Date().toDateString() === currentDate.toDateString();

                            // Determinar si esta semana tiene eventos vencidos o próximos
                            const hasOverdueInWeek = weekEvents.some(e => e.status === 'overdue');
                            const hasDueInWeek = weekEvents.some(e => e.status === 'due');

                            // Colorear toda la semana si tiene eventos vencidos o próximos
                            const weekHasEvents = weekEvents.length > 0;
                            const shouldHighlightWeek = hasOverdueInWeek || hasDueInWeek;

                            return (
                                <div
                                    key={day}
                                    className={`aspect-square border border-gray-200 rounded-lg p-1 sm:p-2 transition-colors ${
                                        isToday ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : 
                                        shouldHighlightWeek ? (
                                            hasOverdueInWeek ? 'bg-red-50 border-red-300' :
                                            'bg-amber-50 border-amber-300'
                                        ) :
                                        'bg-white'
                                    }`}
                                >
                                    <div className={`text-xs sm:text-sm font-semibold mb-1 ${
                                        isToday ? 'text-blue-600' : 'text-gray-700'
                                    }`}>
                                        {day}
                                    </div>
                                    <div className="space-y-1">
                                        {/* Mostrar eventos en toda la semana */}
                                        {weekEvents.length > 0 && (
                                            <>
                                                {weekEvents.slice(0, 2).map(event => {
                                                    const TypeIcon = getTypeIcon(event.type);
                                                    const statusLabel = event.status === 'overdue' ? 'Vencido' : 
                                                                       event.status === 'due' ? 'Próximo' : 
                                                                       'Programado';
                                                    return (
                                                        <div
                                                            key={event.id}
                                                            className={`text-xs px-1 py-0.5 rounded truncate ${
                                                                event.status === 'overdue' ? 'bg-red-100 text-red-800 border border-red-300' :
                                                                event.status === 'due' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                                                'bg-blue-100 text-blue-800 border border-blue-300'
                                                            }`}
                                                            title={`${event.equipmentName} - ${getTypeLabel(event.type)} - ${statusLabel}`}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <TypeIcon className="w-2.5 h-2.5 flex-shrink-0" aria-hidden="true" />
                                                                <span className="font-semibold text-[10px]">{statusLabel}</span>
                                                            </div>
                                                            <div className="truncate mt-0.5">{event.inventoryCode}</div>
                                                        </div>
                                                    );
                                                })}
                                                {weekEvents.length > 2 && (
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        +{weekEvents.length - 2} más
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Leyenda e información */}
                    <div className="mt-6 space-y-4">
                        <div className="flex flex-wrap gap-4 justify-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                <span className="font-medium">Vencido</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                                <span className="font-medium">Próximo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                                <span className="font-medium">Programado</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                <strong>Nota:</strong> Los mantenimientos se muestran por semana. Toda la semana se resalta cuando hay eventos vencidos o próximos.
                            </p>
                            {(() => {
                                const currentMonthEvents = getEventsForMonth(currentMonth.getFullYear(), currentMonth.getMonth());
                                if (currentMonthEvents.length === 0) {
                                    return (
                                        <p className="text-xs text-gray-400 mt-2 italic">
                                            No hay eventos de mantenimiento programados para este mes.
                                        </p>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


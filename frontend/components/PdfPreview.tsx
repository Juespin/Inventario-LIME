import React, { useRef, useEffect, useState } from 'react';
import { Equipment, Site, Service, Responsible } from '../types';
import { Download, Check, X } from 'lucide-react';
// @ts-ignore - html2pdf.js no tiene tipos TypeScript
import html2pdf from 'html2pdf.js';

interface PdfPreviewProps {
    equipment: Equipment;
    originSite: string;
    originService: string;
    destinationSite: string;
    destinationService: string;
    responsible: string;
    responsibleRole?: string;
    justification: string;
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
    onConfirm: (signature: string) => void;
    onBack: () => void;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-1.5">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
        <p className="text-sm sm:text-base font-medium text-gray-900 mt-0.5">{value || 'N/A'}</p>
    </div>
);

export const PdfPreview: React.FC<PdfPreviewProps> = ({
    equipment, originSite, originService, destinationSite, destinationService,
    responsible, responsibleRole, justification, sites, services, responsibles,
    onConfirm, onBack
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
    const pdfContentRef = useRef<HTMLDivElement>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [signatureData, setSignatureData] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const originResponsible = equipment.responsibleId ? responsibles.find(r => r.id === equipment.responsibleId) : null;
    const destinationResponsible = responsibles.find(r => r.name === responsible);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const getPos = (canvasDom: HTMLCanvasElement, event: MouseEvent | TouchEvent) => {
            const rect = canvasDom.getBoundingClientRect();
            const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };
        
        const startDrawing = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            setIsSigning(true);
            const pos = getPos(canvas, e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            if (!isSigning) return;
            const pos = getPos(canvas, e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const stopDrawing = () => {
            if (isSigning) {
                setIsSigning(false);
                ctx.closePath();
                // Check if canvas is empty before setting data
                const blank = document.createElement('canvas');
                blank.width = canvas.width;
                blank.height = canvas.height;
                if (canvas.toDataURL() !== blank.toDataURL()) {
                    setSignatureData(canvas.toDataURL('image/png'));
                } else {
                    setSignatureData('');
                }
            }
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
            
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [isSigning]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setSignatureData(dataUrl);

                // Dibuja la imagen en el canvas para la vista previa
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const img = new Image();
                        img.onload = () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            // Dibuja la imagen manteniendo la relación de aspecto
                            const aspectRatio = img.width / img.height;
                            let newWidth = canvas.width;
                            let newHeight = newWidth / aspectRatio;
                            if (newHeight > canvas.height) {
                                newHeight = canvas.height;
                                newWidth = newHeight * aspectRatio;
                            }
                            const xOffset = (canvas.width - newWidth) / 2;
                            const yOffset = (canvas.height - newHeight) / 2;
                            ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
                        };
                        img.src = dataUrl;
                    }
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecciona un archivo de imagen en formato PNG.');
            // Limpiar el valor del input para permitir seleccionar el mismo archivo de nuevo
            if(event.target) {
                event.target.value = '';
            }
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setSignatureData('');
            }
        }
        // También limpiar el input de archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleConfirm = () => {
        if(signatureData) {
            setShowConfirmation(true);
        }
    };

    const handleAccept = () => {
        if(signatureData) {
            onConfirm(signatureData);
        }
    };

    // Función para copiar la firma al PDF oculto
    const copySignatureToPdf = (): Promise<void> => {
        return new Promise((resolve) => {
            const pdfCanvas = pdfCanvasRef.current;
            if (!pdfCanvas || !signatureData) {
                resolve();
                return;
            }

            const ctx = pdfCanvas.getContext('2d');
            if (!ctx) {
                resolve();
                return;
            }

            // Limpiar el canvas primero
            ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
            
            // Copiar la firma
            const img = new Image();
            img.onload = () => {
                try {
                    ctx.drawImage(img, 0, 0, pdfCanvas.width, pdfCanvas.height);
                    resolve();
                } catch (error) {
                    console.error('Error al copiar firma:', error);
                    resolve(); // Continuar aunque falle
                }
            };
            img.onerror = () => {
                console.error('Error al cargar imagen de firma');
                resolve(); // Continuar aunque falle
            };
            img.src = signatureData;
        });
    };


    const downloadPDF = async () => {
        let element: HTMLElement | null = null;
        let originalStyles: { [key: string]: string } = {};
        
        try {
            // Primero copiar la firma al PDF oculto y esperar
            await copySignatureToPdf();
            await new Promise(resolve => setTimeout(resolve, 300));

            // Buscar el elemento en el DOM (usar ref o querySelector como fallback)
            element = pdfContentRef.current;
            if (!element) {
                // Fallback: buscar por atributo
                element = document.querySelector('[data-pdf-content]') as HTMLDivElement;
            }
            
            if (!element) {
                console.error('No se encontró el elemento del PDF');
                throw new Error('No se encontró el contenido del PDF. El elemento no está en el DOM.');
            }

            // Crear un elemento completamente nuevo y visible dentro del viewport
            // Esto evita problemas con elementos ocultos o fuera de la vista
            const tempContainer = document.createElement('div');
            tempContainer.id = 'temp-pdf-container-' + Date.now();
            tempContainer.setAttribute('data-pdf-content', '');
            
            // Clonar el contenido completo del elemento original
            const clonedHTML = element.innerHTML;
            tempContainer.innerHTML = clonedHTML;
            
            // Estilos para hacerlo visible pero fuera de la vista del usuario
            tempContainer.style.cssText = `
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 210mm !important;
                min-width: 210mm !important;
                max-width: 210mm !important;
                background: white !important;
                padding: 1.5cm !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: none !important;
                z-index: -1 !important;
                overflow: visible !important;
                margin: 0 !important;
                border: none !important;
            `;
            
            // Agregar al body
            document.body.appendChild(tempContainer);
            
            // Forzar reflow
            void tempContainer.offsetHeight;
            
            // Esperar a que se renderice completamente
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Asegurar que las imágenes estén cargadas en el nuevo elemento
            const images = tempContainer.querySelectorAll('img');
            console.log(`Encontradas ${images.length} imágenes para cargar`);
            
            await Promise.all(
                Array.from(images).map((img, index) => {
                    const htmlImg = img as HTMLImageElement;
                    console.log(`Imagen ${index + 1}: complete=${htmlImg.complete}, naturalWidth=${htmlImg.naturalWidth}, src=${htmlImg.src.substring(0, 50)}...`);
                    
                    if (htmlImg.complete && htmlImg.naturalWidth > 0) {
                        return Promise.resolve();
                    }
                    
                    return new Promise((resolve) => {
                        const timeout = setTimeout(() => {
                            console.warn(`Timeout cargando imagen ${index + 1}`);
                            resolve(void 0);
                        }, 3000);
                        
                        htmlImg.onload = () => {
                            clearTimeout(timeout);
                            console.log(`Imagen ${index + 1} cargada exitosamente`);
                            resolve(void 0);
                        };
                        
                        htmlImg.onerror = () => {
                            clearTimeout(timeout);
                            console.error(`Error cargando imagen ${index + 1}`);
                            resolve(void 0); // Continuar aunque falle
                        };
                        
                        // Si la imagen no está cargada, forzar recarga
                        if (!htmlImg.complete) {
                            const src = htmlImg.src;
                            htmlImg.src = '';
                            setTimeout(() => {
                                htmlImg.src = src;
                            }, 100);
                        }
                    });
                })
            );
            
            console.log('Todas las imágenes procesadas, procediendo a generar PDF...');
            
            // Verificar que el elemento tiene contenido y dimensiones válidas
            const elementHeight = tempContainer.offsetHeight || tempContainer.scrollHeight;
            const elementWidth = tempContainer.offsetWidth || tempContainer.scrollWidth;
            const elementHTML = tempContainer.innerHTML.substring(0, 200);
            console.log(`Elemento dimensiones: ${elementWidth}x${elementHeight}`);
            console.log(`Elemento HTML (primeros 200 chars): ${elementHTML}`);
            
            if (elementHeight === 0 || elementWidth === 0) {
                console.warn('El elemento tiene dimensiones 0, esperando más tiempo...');
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Verificar de nuevo
                const newHeight = tempContainer.offsetHeight || tempContainer.scrollHeight;
                const newWidth = tempContainer.offsetWidth || tempContainer.scrollWidth;
                console.log(`Después de esperar: ${newWidth}x${newHeight}`);
                if (newHeight === 0 || newWidth === 0) {
                    // Limpiar antes de lanzar error
                    document.body.removeChild(tempContainer);
                    throw new Error('El elemento no tiene dimensiones válidas. No se puede generar el PDF.');
                }
            }
            
            // Usar el elemento temporal para la captura
            const elementToCapture = tempContainer;

            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `Informe_Traslado_${equipment.inventoryCode}_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: true, // Permitir imágenes de otros dominios
                    logging: true, // Activar logs para debug
                    backgroundColor: '#ffffff',
                    width: elementToCapture.scrollWidth || 794,
                    height: elementToCapture.scrollHeight || 1123,
                    windowWidth: elementToCapture.scrollWidth || 794,
                    windowHeight: elementToCapture.scrollHeight || 1123,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0,
                    letterRendering: true,
                    imageTimeout: 15000,
                    removeContainer: false, // No remover, lo haremos manualmente
                    onclone: (clonedDoc: Document) => {
                        console.log('onclone ejecutado - clonando documento para html2canvas');
                        // Buscar el elemento principal con data-pdf-content
                        const clonedElement = clonedDoc.querySelector('[data-pdf-content]') as HTMLElement;
                        if (clonedElement) {
                            console.log('Elemento clonado encontrado, ajustando estilos...');
                            // Posicionar el elemento correctamente en el clon (visible y en posición normal)
                            clonedElement.style.position = 'static';
                            clonedElement.style.left = '0';
                            clonedElement.style.top = '0';
                            clonedElement.style.transform = 'none';
                            clonedElement.style.visibility = 'visible';
                            clonedElement.style.opacity = '1';
                            clonedElement.style.display = 'block';
                            clonedElement.style.zIndex = 'auto';
                            clonedElement.style.width = '210mm';
                            clonedElement.style.minWidth = '210mm';
                            clonedElement.style.maxWidth = '210mm';
                            clonedElement.style.padding = '1.5cm';
                            clonedElement.style.background = 'white';
                            clonedElement.style.overflow = 'visible';
                            clonedElement.style.margin = '0';
                            
                            // Verificar dimensiones del clon
                            const cloneHeight = clonedElement.offsetHeight || clonedElement.scrollHeight;
                            const cloneWidth = clonedElement.offsetWidth || clonedElement.scrollWidth;
                            console.log(`Clon dimensiones: ${cloneWidth}x${cloneHeight}`);
                        } else {
                            console.warn('No se encontró el elemento [data-pdf-content] en el clon');
                        }
                        
                        // Asegurar que todos los elementos hijos estén visibles
                        const allElements = clonedDoc.querySelectorAll('*');
                        let hiddenCount = 0;
                        allElements.forEach(el => {
                            const htmlEl = el as HTMLElement;
                            const computedStyle = clonedDoc.defaultView?.getComputedStyle(htmlEl);
                            if (computedStyle) {
                                if (computedStyle.display === 'none') {
                                    htmlEl.style.display = 'block';
                                    hiddenCount++;
                                }
                                if (computedStyle.visibility === 'hidden') {
                                    htmlEl.style.visibility = 'visible';
                                    hiddenCount++;
                                }
                                if (computedStyle.opacity === '0') {
                                    htmlEl.style.opacity = '1';
                                    hiddenCount++;
                                }
                            }
                        });
                        console.log(`Elementos ocultos corregidos: ${hiddenCount}`);
                    }
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Generar y descargar el PDF
            // html2pdf.js puede exportarse de diferentes formas
            let html2pdfFunction: any;
            if (typeof html2pdf === 'function') {
                html2pdfFunction = html2pdf;
            } else if (html2pdf && typeof (html2pdf as any).default === 'function') {
                html2pdfFunction = (html2pdf as any).default;
            } else if (html2pdf && typeof (html2pdf as any).html2pdf === 'function') {
                html2pdfFunction = (html2pdf as any).html2pdf;
            } else {
                // Último recurso: intentar acceder directamente
                html2pdfFunction = html2pdf;
            }
            
            if (typeof html2pdfFunction !== 'function') {
                throw new Error('html2pdf no está disponible como función');
            }
            
            try {
                console.log('Generando PDF con html2pdf...');
                console.log('Elemento a capturar:', elementToCapture);
                console.log('Dimensiones finales:', elementToCapture.offsetWidth, 'x', elementToCapture.offsetHeight);
                await html2pdfFunction().set(opt).from(elementToCapture).save();
                console.log('PDF generado exitosamente');
            } finally {
                // Limpiar: remover el elemento temporal
                if (tempContainer && tempContainer.parentNode) {
                    try {
                        document.body.removeChild(tempContainer);
                        console.log('Elemento temporal removido');
                    } catch (e) {
                        console.warn('Error removiendo elemento temporal:', e);
                    }
                }
            }

        } catch (error) {
            console.error('Error al generar PDF:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al generar PDF: ${errorMessage}`);
        }
    };

    const handleAcceptAndDownload = async () => {
        if(signatureData) {
            try {
                // Primero generar y descargar el PDF
                await downloadPDF();
                // Después de descargar, confirmar el traslado
                setTimeout(() => {
                    onConfirm(signatureData);
                }, 500);
            } catch (error) {
                console.error('Error al descargar PDF:', error);
                // Si falla la descarga, igual confirmar el traslado
                alert('El PDF no pudo generarse, pero el traslado se confirmará. Puedes intentar descargarlo más tarde desde el historial.');
                onConfirm(signatureData);
            }
        }
    };

    return (
        <>
            {/* Documento PDF completo (siempre en el DOM, oculto pero accesible) */}
            <div 
                ref={pdfContentRef}
                data-pdf-content
                style={{ 
                    position: 'absolute', 
                    left: '-9999px', 
                    top: 0, 
                    width: '210mm', 
                    background: 'white', 
                    padding: '1.5cm',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    zIndex: -1,
                    overflow: 'visible'
                }}
            >
                {/* Encabezado Institucional */}
                <header className="text-center border-b-2 border-blue-600 pb-6 mb-8">
                    <div className="flex justify-center items-center gap-6 mb-4">
                        {/* Logo VAULT */}
                        <div className="flex-shrink-0">
                            <img 
                                src="/assets/logo.png" 
                                alt="Logo VAULT" 
                                className="h-20 sm:h-24 w-auto object-contain"
                            />
                        </div>

                        {/* Logo LIME */}
                        <div className="flex justify-end flex-1">
                            <img 
                                src="/assets/lime.png" 
                                alt="Logo LIME" 
                                className="h-20 sm:h-24 w-auto object-contain"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">INFORME DE TRASLADO DE EQUIPO MÉDICO</h2>
                        <p className="text-sm text-gray-600 mt-2">Documento Oficial de Transferencia de Inventario</p>
                    </div>
                </header>

                {/* Información de la carta */}
                <div className="mb-8 text-right">
                    <p className="text-sm text-gray-700">
                        Medellín, {formattedDate}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Código de Referencia: TR-{equipment.inventoryCode}-{currentDate.getTime().toString().slice(-6)}
                    </p>
                </div>

                {/* Cuerpo de la carta */}
                <div className="mb-8 space-y-6 text-justify">
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                        Por medio de la presente, se informa que el siguiente equipo médico será trasladado de su ubicación actual 
                        a una nueva ubicación dentro de la institución, de conformidad con los procedimientos establecidos de gestión de inventario.
                    </p>

                    {/* Información del Equipo */}
                    <section className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                        <h3 className="font-bold text-lg text-blue-900 mb-4">INFORMACIÓN DEL EQUIPO</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow label="Nombre del Equipo" value={equipment.name} />
                            <InfoRow label="Código de Inventario" value={equipment.inventoryCode} />
                        <InfoRow label="Marca" value={equipment.brand} />
                        <InfoRow label="Modelo" value={equipment.model} />
                            <InfoRow label="Número de Serie" value={equipment.serial} />
                            <InfoRow label="Estado Actual" value={equipment.status} />
                    </div>
                        {equipment.generalInfo?.physicalLocation && (
                            <InfoRow label="Ubicación Física Actual" value={equipment.generalInfo.physicalLocation} />
                        )}
                </section>

                    {/* Detalles del Traslado */}
                    <section className="border border-gray-300 p-6 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">DETALLES DEL TRASLADO</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                                <h4 className="font-bold text-red-800 mb-3 text-center">📍 UBICACIÓN DE ORIGEN</h4>
                                <div className="space-y-2">
                            <InfoRow label="Sede" value={originSite} />
                                    <InfoRow label="Servicio/Unidad" value={originService} />
                                    {originResponsible && (
                                        <InfoRow label="Responsable Actual" value={`${originResponsible.name} - ${originResponsible.role}`} />
                                    )}
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                                <h4 className="font-bold text-green-800 mb-3 text-center">📍 UBICACIÓN DE DESTINO</h4>
                                <div className="space-y-2">
                                    <InfoRow label="Sede" value={destinationSite} />
                                    <InfoRow label="Servicio/Unidad" value={destinationService} />
                                    {destinationResponsible && (
                                        <InfoRow label="Responsable Asignado" value={`${destinationResponsible.name} - ${destinationResponsible.role || ''}`} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-300">
                            <InfoRow label="Fecha Programada del Traslado" value={formattedDate} />
                            <InfoRow label="Responsable del Traslado" value={responsible} />
                            {responsibleRole && (
                                <InfoRow label="Cargo" value={responsibleRole} />
                            )}
                        </div>
                    </section>

                    {/* Justificación */}
                    <section className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-900 mb-3">JUSTIFICACIÓN DEL TRASLADO</h3>
                        <div className="bg-white border border-gray-300 rounded-md p-4 min-h-[100px]">
                            <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {justification || 'No se ha proporcionado justificación.'}
                            </p>
                     </div>
                </section>

                    {/* Observaciones adicionales */}
                    {equipment.transferHistory && equipment.transferHistory.length > 0 && (
                        <section className="bg-amber-50 border border-amber-300 p-4 rounded-lg">
                            <h3 className="font-semibold text-amber-900 mb-2">Historial de Traslados Anteriores</h3>
                            <p className="text-xs text-amber-800">
                                Este equipo ha sido trasladado {equipment.transferHistory.length} ve{equipment.transferHistory.length > 1 ? 'ces' : 'z'} anteriormente.
                            </p>
                </section>
                    )}
                </div>

                {/* Firma */}
                <footer className="mt-12 border-t-2 border-gray-300 pt-8" style={{ pageBreakInside: 'avoid' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Firma del Responsable del Traslado</label>
                            <div className="border-2 border-gray-400 rounded-md bg-white min-h-[120px] touch-none relative">
                                <canvas 
                                    ref={pdfCanvasRef} 
                                    width="400" 
                                    height="120" 
                                    className="w-full rounded-md"
                                    style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                                ></canvas>
                            </div>
                            <div className="flex justify-end items-center mt-2">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-700">{responsible}</p>
                                    {responsibleRole && (
                                        <p className="text-xs text-gray-600 mt-1">{responsibleRole}</p>
                                    )}
                                </div>
                            </div>
                            <div className="border-t border-gray-400 mt-2 pt-2">
                                <p className="text-xs text-gray-500 text-center">Firma y sello</p>
                            </div>
                        </div>
                        <div className="w-full text-right">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Aprobación Institucional</p>
                            <div className="border-2 border-gray-400 rounded-md bg-white min-h-[120px] flex items-center justify-center">
                                <p className="text-xs text-gray-400 italic">Sello y firma autorizada</p>
                            </div>
                            <div className="border-t border-gray-400 mt-2 pt-2">
                                <p className="text-xs text-gray-500">Jefe de Inventario - LIME</p>
                         </div>
                         </div>
                    </div>
                    
                    {/* Pie de página */}
                    <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                        <p>Este documento es generado automáticamente por el Sistema de Gestión de Inventario LIME</p>
                        <p className="mt-1">Universidad de Antioquia - Facultad de Ingeniería</p>
                    </div>
                </footer>
            </div>

            {/* Vista simplificada - Solo campo de firma */}
            {!showConfirmation && (
                <>
                    <div className="border rounded-md p-6 sm:p-8 bg-white shadow-md">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Firma del Traslado</h3>
                            <p className="text-sm text-gray-600">
                                Por favor, firma en el campo inferior para confirmar el traslado del equipo <strong>{equipment.name}</strong> ({equipment.inventoryCode})
                            </p>
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Origen:</strong> {originSite} - {originService}
                                </p>
                                <p className="text-sm text-blue-900 mt-1">
                                    <strong>Destino:</strong> {destinationSite} - {destinationService}
                                </p>
                            </div>
                        </div>

                        {/* Campo de firma */}
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Firma del Responsable del Traslado: <span className="font-bold">{responsible}</span>
                            </label>
                            <div className="border-2 border-gray-400 rounded-md bg-white min-h-[150px] touch-none relative">
                                <canvas 
                                    ref={canvasRef} 
                                    width="600" 
                                    height="150" 
                                    className="w-full h-full rounded-md cursor-crosshair"
                                    style={{ display: 'block', maxWidth: '100%', height: '150px' }}
                                ></canvas>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-4">
                                    <button 
                                        type="button" 
                                        onClick={clearSignature} 
                                        className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                                        aria-label="Limpiar firma"
                                    >
                                        Limpiar firma
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/png"
                                        className="hidden"
                                        aria-label="Subir archivo de firma"
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerFileUpload}
                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                        aria-label="Subir firma en formato PNG"
                                    >
                                        Subir Firma (PNG)
                                    </button>
                                </div>
                                {responsibleRole && (
                                    <p className="text-xs text-gray-600">{responsibleRole}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 mt-4">
                        <button 
                            type="button" 
                            onClick={onBack}
                            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            aria-label="Volver al formulario"
                        >
                            Volver
                        </button>
                <button 
                    type="button" 
                    onClick={handleConfirm}
                    disabled={!signatureData}
                            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Continuar con la confirmación"
                        >
                            <Check className="w-5 h-5" aria-hidden="true" />
                            Continuar
                        </button>
                    </div>
                </>
            )}

            {/* Ventana de confirmación */}
            {showConfirmation && (
                <div className="space-y-6">
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 sm:p-8 text-center shadow-lg">
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 rounded-full p-4">
                                <Check className="w-12 h-12 text-green-600" aria-hidden="true" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-3">¿Confirmar el traslado del equipo?</h3>
                        <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                            <p className="text-gray-800 mb-2">
                                <strong className="text-lg">{equipment.name}</strong>
                            </p>
                            <p className="text-sm text-gray-600 font-mono mb-2">{equipment.inventoryCode}</p>
                            <p className="text-sm text-gray-700">
                                De <span className="font-semibold text-red-700">{originSite}</span> → 
                                <span className="font-semibold text-green-700"> {destinationSite}</span>
                            </p>
                        </div>
                        <p className="text-sm text-green-700 font-medium">
                            ✓ Firma registrada correctamente
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowConfirmation(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            aria-label="Cancelar traslado"
                        >
                            <X className="w-5 h-5" aria-hidden="true" />
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg"
                            aria-label="Aceptar y confirmar traslado"
                        >
                            <Check className="w-5 h-5" aria-hidden="true" />
                            Aceptar
                        </button>
                        <button
                            type="button"
                            onClick={handleAcceptAndDownload}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md hover:shadow-lg"
                            aria-label="Aceptar traslado y descargar PDF"
                        >
                            <Download className="w-5 h-5" aria-hidden="true" />
                            Aceptar y Descargar PDF
                </button>
            </div>
        </div>
            )}
        </>
    );
};

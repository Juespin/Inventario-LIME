import React, { useRef, useEffect, useState } from 'react';
import { Equipment } from '../types';

interface PdfPreviewProps {
    equipment: Equipment;
    originSite: string;
    originService: string;
    destinationSite: string;
    destinationService: string;
    responsible: string;
    justification: string;
    onConfirm: (signature: string) => void;
    onBack: () => void;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
    </div>
);

export const PdfPreview: React.FC<PdfPreviewProps> = ({
    equipment, originSite, originService, destinationSite, destinationService,
    responsible, justification, onConfirm, onBack
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [signatureData, setSignatureData] = useState<string>('');

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

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setSignatureData('');
            }
        }
    };
    
    const handleConfirm = () => {
        if(signatureData) {
            onConfirm(signatureData);
        }
    };

    return (
        <div>
            <div className="border rounded-md p-6 bg-white shadow-inner max-h-[65vh] overflow-y-auto">
                <header className="text-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold">FORMATO DE TRASLADO DE EQUIPO</h2>
                    <p className="text-sm text-gray-500">LIME - Gestión de Inventario</p>
                </header>
                <section>
                    <h3 className="font-semibold mb-2 text-lime-blue-800">1. Información del Equipo</h3>
                    <div className="grid grid-cols-2 gap-x-4">
                        <InfoRow label="Nombre" value={equipment.name} />
                        <InfoRow label="Código Inventario" value={equipment.inventoryCode} />
                        <InfoRow label="Marca" value={equipment.brand} />
                        <InfoRow label="Modelo" value={equipment.model} />
                        <InfoRow label="Serie" value={equipment.serial} />
                    </div>
                </section>
                <section className="mt-4">
                    <h3 className="font-semibold mb-2 text-lime-blue-800">2. Detalles del Traslado</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 p-3 rounded-md border border-red-200">
                            <h4 className="font-bold text-red-700">Origen</h4>
                            <InfoRow label="Sede" value={originSite} />
                            <InfoRow label="Servicio" value={originService} />
                        </div>
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                            <h4 className="font-bold text-green-700">Destino</h4>
                            <InfoRow label="Sede" value={destinationSite} />
                            <InfoRow label="Servicio" value={destinationService} />
                        </div>
                    </div>
                     <div className="mt-3">
                        <InfoRow label="Responsable del Traslado" value={responsible} />
                        <InfoRow label="Fecha del Traslado" value={new Date().toLocaleDateString('es-ES')} />
                     </div>
                </section>
                <section className="mt-4">
                     <h3 className="font-semibold mb-2 text-lime-blue-800">3. Justificación</h3>
                     <p className="text-sm p-3 bg-gray-50 rounded-md border">{justification}</p>
                </section>
                <footer className="mt-10">
                    <div className="w-full max-w-sm">
                        <label className="text-sm font-medium">Firma del Responsable</label>
                         <div className="mt-1 border-2 border-gray-300 rounded-md bg-slate-50 touch-none">
                            <canvas ref={canvasRef} width="300" height="100" className="w-full h-auto rounded-md cursor-crosshair"></canvas>
                         </div>
                         <div className="flex justify-between items-center">
                            <button type="button" onClick={clearSignature} className="text-xs text-gray-500 hover:underline mt-1">Limpiar firma</button>
                            <p className="text-xs text-gray-500 mt-2">{responsible}</p>
                         </div>
                    </div>
                </footer>
            </div>
            <div className="flex justify-end space-x-3 pt-4 mt-4">
                <button type="button" onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Volver</button>
                <button 
                    type="button" 
                    onClick={handleConfirm}
                    disabled={!signatureData}
                    className="bg-lime-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-lime-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Confirmar Traslado
                </button>
            </div>
        </div>
    );
};

"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Boleto {
    Descripcion: string;
    Valor: number;
}

const TicketsTest: React.FC = () => {
    const buttonData: Boleto[] = [{ Descripcion: "Boleto de prueba", Valor: 5 }];
    const [ultimoId, setUltimoId] = useState<number>(1000);

    const obtenerUltimoId = async (): Promise<number> => {
        const nuevoId = ultimoId + 1;
        setUltimoId(nuevoId);
        return nuevoId;
    };

    const imprimirTicket = async (boleto: Boleto) => {
        const id = await obtenerUltimoId();
        const ticketContent = `
        <html>
        <head>
            <style>
                @page { size: auto; margin: 5; }
                body { text-align: center; font-family: Arial; margin: 5; }
                .ticket { width: 200mm; margin: 0 auto; }
                h1, h2, h4, p { margin: 2px 0; }
            </style>
        </head>
        <body>
            <div class="ticket">
                <h1>Impresión NODE JS</h1>
                <h2>Precio ${boleto.Descripcion}</h2>
                <h4>Codigo: ${id}</h4>
                <h4>Fecha: ${new Date().toLocaleString()}</h4>
                <p>Consumidor Final</p>
                <p>Gracias por su compra</p>
            </div>
        </body>
        </html>
        `;

        const printWindow = window.open("", "", "width=600,height=600");
        if (printWindow) {
            printWindow.document.write(ticketContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

            setTimeout(() => {
                if (printWindow.closed === false) {
                    printWindow.close();
                }
            }, 4000);
        }
    };

    const confirmarAccion = (boleto: Boleto) => {
        toast.info(
            <div>
                <p>¿Imprimir <strong>{boleto.Descripcion}</strong>?</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            toast.dismiss();
                            imprimirTicket(boleto);
                        }}
                        className="bg-green-500 px-3 py-1 text-white rounded-md"
                    >
                        Sí
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-red-500 px-3 py-1 text-white rounded-md"
                    >
                        No
                    </button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const key = parseInt(event.key);
            if (!isNaN(key) && key >= 1 && key <= buttonData.length) {
                confirmarAccion(buttonData[key - 1]);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
            <ToastContainer />
            {buttonData.map((item, index) => (
                <button
                    key={index}
                    onClick={() => confirmarAccion(item)}
                    className="w-40 h-12 bg-blue-500 text-white rounded-md"
                >
                    [{index + 1}] {item.Descripcion} - L. {item.Valor.toFixed(2)}
                </button>                
            ))}
        </div>
    );
};

export default TicketsTest;

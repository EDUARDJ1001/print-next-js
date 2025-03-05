"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Vendedor {
    Id: number;
    Nombre: string;
    Apellido: string;
}

interface Servicio {
    Id: number;
    Nombre: string;
    Precio: number;
}

const TicketsTest: React.FC = () => {
    const [buttonData, setButtonData] = useState<Servicio[]>([]);
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState<number | null>(null);
    const [ultimoId, setUltimoId] = useState<number>(1000);
    const apiHost = process.env.NEXT_PUBLIC_API_HOST || "";

    const obtenerUltimoId = async (): Promise<number> => {
        const nuevoId = ultimoId + 1;
        setUltimoId(nuevoId);
        return nuevoId;
    };

    const fetchButtonData = async () => {
        try {
            const response = await fetch(`${apiHost}/api/servicios`);
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            const data = await response.json();
            setButtonData(
                Array.isArray(data) ? data.map((item) => ({
                    ...item,
                    Precio: parseFloat(item.Precio) || 0
                })) : []
            );
        } catch (error) {
            console.error("Error fetching data:", error);
            setButtonData([]);
        }
    };

    const fetchVendedores = async () => {
        try {
            const response = await fetch(`${apiHost}/api/vendedores`);
            if (!response.ok) {
                throw new Error("Error al obtener los vendedores");
            }
            const data = await response.json();
            setVendedores(data); // Establecemos los vendedores en el estado
        } catch (error) {
            console.error("Error fetching vendedores:", error);
        }
    };

    useEffect(() => {
        fetchButtonData();
        fetchVendedores();
    }, []);

    const selectVendedor = async () => {
        try {
            const response = await fetch(`${apiHost}/api/servicios`);
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            const data = await response.json();
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const imprimirTicket = async (boleto: Servicio) => {
        const id = await obtenerUltimoId();
        const ticketContent = `
        <html>
        <head>
                    <title>Ticket</title>
                    <style>
                        @page {
                            size: auto; 
                            margin: 5; 
                        }
                        @media print {
                            body { 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                margin: 5; 
                                padding: 0; 
                                display: flex;
                                justify-content: center;
                                align-items: flex-start;
                                height: auto;
                                overflow: hidden;
                            }
                            .ticket {
                                width: 80mm;
                                padding: 1px;
                                margin: 0 auto;
                                display: block;
                                text-align: center;
                            }
                            .ticket h2 {
                                margin: 2px 0;
                            }
                            .ticket h4 {
                                margin: 2px 0;
                            }
                            .ticket p {
                                margin: 2px 0;
                            }
                        }
                    </style>
                </head>
        <body>
            <div class="ticket">
                <h2>Impresión NODE JS</h2>
                <h2>Caja 2</h2>
                <h2>${boleto.Nombre}</h2>
                <h2>Precio ${boleto.Precio}</h2>
                <h4>Codigo: ${boleto.Id}</h4>
                <h4>Fecha: ${new Date().toLocaleString()}</h4>
                <h4>Vendedor: ${vendedorSeleccionado ? vendedores.find(v => v.Id === vendedorSeleccionado)?.Id : 'No asignado'}</h4>
                <p>Cliente Consumidor Final</p>
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

    const confirmarAccion = (boleto: Servicio) => {
        toast.info(
            <div>
                <p>¿Imprimir <strong>{boleto.Nombre}</strong>?</p>
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
        <div>
            <div className="mb-4">
                <label htmlFor="vendedor" className="mr-2">Seleccionar Vendedor:</label>
                <select
                    id="vendedor"
                    className="px-3 py-2 border rounded-md"
                    value={vendedorSeleccionado || ""}
                    onChange={(e) => setVendedorSeleccionado(Number(e.target.value))}
                >
                    <option value="">--Seleccione un vendedor--</option>
                    {vendedores.map((vendedor) => (
                        <option key={vendedor.Id} value={vendedor.Id}>
                            {vendedor.Nombre} {vendedor.Apellido}
                        </option>
                    ))}
                </select>
            </div>
            <div className="h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
                <div>
                    <a href="/pages/homepage"
                        className="w-40 h-12 bg-green-500 text-white rounded-md"
                    >
                        Volver al inicio
                    </a>
                </div>
                <div><p>Caja 2</p></div>
                <ToastContainer />
                {buttonData.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => confirmarAccion(item)}
                        className="w-40 h-12 bg-blue-500 text-white rounded-md"
                    >
                        [{index + 1}] {item.Nombre} - L. {item.Precio ? item.Precio.toFixed(2) : '0.00'}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TicketsTest;
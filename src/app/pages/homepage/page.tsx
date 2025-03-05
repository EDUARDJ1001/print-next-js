"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Select: React.FC = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCajaSelection = async (caja: number) => {
        setLoading(true);
        try {
            router.push(`/pages/caja${caja}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Hubo un error al seleccionar la caja.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
                <div className="p-4">
                    <div className="mb-4 text-gray-600">
                        <h1>Seleccione una caja</h1>
                    </div>
                    <div>
                        <h2>Seleccione una caja</h2>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {[1, 2, 3, 4].map((caja) => (
                            <button
                                key={caja}
                                onClick={() => handleCajaSelection(caja)}
                                disabled={loading}
                                className={`${caja % 2 === 0 ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"
                                    } text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label={`Seleccionar Caja ${caja}`}
                            >
                                Caja {caja}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
    );
};

export default Select;

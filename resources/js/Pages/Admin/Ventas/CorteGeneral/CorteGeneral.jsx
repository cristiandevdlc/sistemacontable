import React, { useState, useEffect } from 'react';
import { Tooltip } from "@mui/material";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Noty from 'noty'; // Importa la librería Noty si aún no lo has hecho
import request from "@/utils"; // Importa la función request si aún no lo has hecho
import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';
import TextInput from '@/components/TextInput';
import selectOptImg from '../../../../../png/camion.png';
import { Center } from 'devextreme-react/map';

const CorteGeneral = () => {
    const [zonas, setZona] = useState([]);
    const [statuscorte, setStatusCorte] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    const fetchdata = async () => {
        const responseE = await fetch(route("zonas.index"));
        const dataE = await responseE.json();
        setZona(dataE);
    };

    const today = new Date().toISOString().split('T')[0];
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const minDate = oneMonthAgo.toISOString().split('T')[0];

    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const formatoFechaSQL = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fechaHoyString = hoy.toLocaleDateString('es-ES', formatoFechaSQL).split('/').reverse().join('-');
    const fechaAyerString = ayer.toLocaleDateString('es-ES', formatoFechaSQL).split('/').reverse().join('-');
    const [data, setData] = useState({ zona: null, fchInicio: fechaAyerString.slice(0, 16), fchFin: fechaHoyString, });

    useEffect(() => {
        fetchdata();
    }, []);

    const Corte = async () => {
        try {
            setStatusCorte(true);
            const response = await fetch(route("CorteGeneral"), { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            if (blob.type === 'application/pdf') {
                const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(pdfBlob);
                setPdfUrl(url);
                showNotification('Se realizo correctamente el pdf', 'success', 'metroui', 'bottomRight', 2000);
            } else {
                showNotification('No se realizo el pdf', 'error', 'metroui', 'bottomRight', 2000);
            }
            setStatusCorte(false);
        } catch (error) {
            showNotification('Error con el pdf', 'error', 'metroui', 'bottomRight', 2000);
            setStatusCorte(false);
        }
    };

    useEffect(() => {
        if (pdfUrl) {
            const embedContainer = document.getElementById('pdfContainer');
            if (embedContainer) {
                embedContainer.innerHTML = `<embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%" />`;
            }
        }
    }, [pdfUrl]);

    const EnvioReportes = async () => {
        // setStatusCorte(true);
        // try {
        //     const response = await fetch(route('CorteDia'), {
        //         method: "POST",
        //         body: JSON.stringify({ zona: data.zona, fchFin: data.fchFin, fechainicio: data.fchInicio }),
        //         headers: { "Content-Type": "application/json" },
        //     });
        //     if (response.ok) {
        //         showNotification('Se han enviado con éxito los Reportes', 'success', 'metroui', 'bottomRight', 2000);
        //     } else {
        //         console.error("Error en la solicitud:", response.status, response.statusText);
        //     }
        // } catch (error) {
        //     console.error('Error al enviar los reportes:', error);
        // }

        // setStatusCorte(false);
    };

    return (
        <>
            <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
                <div className="flex flex-col h-[30vh] overflow-y-auto sm:max-w-[100%] md:max-w-[18%] w-full blue-scroll gap-3 px-1 pb-2">
                    <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                        <SelectComp
                            label="Zona"
                            options={zonas}
                            firstOption={true}
                            value={data.zona || 0}
                            onChangeFunc={(e) => {
                                setData({ ...data, zona: e });
                            }}
                            data="zona_descripcion"
                            valueKey="zona_idZona"
                        />


                        <TextInput
                            label="Del"
                            type="date"
                            className="block w-full"
                            style={{ padding: '15px', borderRadius: '10px' }}
                            value={data.fchInicio || ''}
                            min="1800-01-01T00:00"
                            onChange={(newDate) => {
                                setData({
                                    ...data,
                                    fchInicio: newDate.target.value,
                                });
                            }}
                        />

                        <TextInput
                            label="Al"
                            type="date"
                            className="block w-full"
                            style={{ padding: '15px', borderRadius: '10px' }}
                            value={data.fchFin || ''}
                            min="1800-01-01T00:00"
                            onChange={(newDate) => {
                                setData({ ...data, fchFin: newDate.target.value });
                            }}
                        />


                        <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-2 p-3">
                            <Tooltip title="Buscar registro">
                                <button className='bg-[#1B2654] text-white w-full rounded-lg p-3'
                                    onClick={Corte}
                                    type='button'
                                >
                                    <PlagiarismIcon />
                                </button>
                            </Tooltip>
                            <Tooltip title="Enviar Reportes">
                                <button className='bg-[#1B2654] text-white w-full rounded-lg p-3' onClick={EnvioReportes} type='button' >
                                    <MarkEmailReadIcon />
                                </button>
                            </Tooltip>
                        </div>


                    </div>
                </div>

                <div className='flex flex-col w-full gap-2 items-stretch' >
                    <div className="w-full monitor-table" >
                        <div id="pdfContainer" style={{ width: '100%', height: '1000px', background: 'white' }}>
                            {pdfUrl ? (
                                <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
                            ) : (
                                <div className='flex col-span-10 place-content-center w-full'>
                                    <div className="w-full flex justify-center">
                                        <img className='scale-80 non-selectable' src={selectOptImg} alt="" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };

export default CorteGeneral
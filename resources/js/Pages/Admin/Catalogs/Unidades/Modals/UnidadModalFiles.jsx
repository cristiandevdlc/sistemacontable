import { noty, requestBody, requestMultipart, secondaryColor } from '@/utils';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { Button } from "@mui/material"
import { useState, useRef } from 'react';

export const unidadFiles = (data, handleCloseModal = ()=>{}, getUnities = ()=>{}) => {
    const [filesData, setFilesData] = useState({});
    const btnTarjeta = useRef();
    const btnFactura = useRef();
    const btnPoliza = useRef();


    const downloadManager = async (reqData = {}) => {
        fetch(route('unidad-files'), requestBody('POST', { ...reqData, unidad: data.unidad_idUnidad }))
            .then((response) => {
                if (response.ok) {
                    noty('Archivo encontrado con exito.', 'success')
                    return response.blob();
                } else {
                    noty('Error al encontrar el archivo.', 'error')
                    throw new Error("Error al descargar el archivo");
                }
            })
            .then((blob) => {
                const urlb = URL.createObjectURL(blob);
                window.open(urlb, '_blank');
                URL.revokeObjectURL(urlb);
            })
            .catch((error) => {
                noty('Error al encontrar el archivo.', 'error')
            });
    }

    const sendFiles = async (requestFile) => {
        const formData = new FormData();
        for (const key in requestFile) {
            formData.append(key, requestFile[key]);
        }
        formData.append('unidad', data.unidad_idUnidad);
        
        await requestMultipart(
            route('unidad-upload-files'),
            'POST',
            formData
        ).then(()=>{
            getUnities()
            handleCloseModal()
        });
        
    }

    const fileHandler = {
        poliza: () => downloadManager({ tipo: 0 }),
        tarjeta: () => downloadManager({ tipo: 1 }),
        factura: () => downloadManager({ tipo: 2 }),
        sendPoliza: (e) => sendFiles({ tipo: 0, poliza: e.target.files[0] }),
        sendTarjeta: (e) => sendFiles({ tipo: 1, tarjetaCirculacion: e.target.files[0] }),
        sendFactura: (e) => sendFiles({ tipo: 2, cartaFactura: e.target.files[0] }),
    }

    return [
        {
            label: 'Poliza',
            custom: true,
            style: 'mb-2',
            customItem: ({ label }) =>
            (
                <div className="pt-5">
                    <input type="file" accept=".pdf"
                        onChange={fileHandler.sendPoliza}
                        style={{ display: 'none' }}
                        id="boton-poliza"
                        ref={btnPoliza}
                    />

                    <Button
                        variant="contained"
                        value={data.unidad_Poliza}
                        className="buttonPrimary"
                        startIcon={<AssuredWorkloadIcon />}
                        onClick={() => {
                            btnPoliza.current.click()
                        }}
                        style={{ backgroundColor: secondaryColor, width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: '85%' }}
                    >
                        {label}
                    </Button>
                </div>
            ),
        },
        {
            label: 'Ver Poliza',
            custom: true,
            style: 'mb-2',
            customItem: ({ label }) =>
            (
                <div className="pt-5">
                    <Button
                        disabled={data.unidad_Poliza ? false : true}
                        variant="contained"
                        value={data.unidad_Poliza}
                        className="buttonPrimary"
                        startIcon={<AssuredWorkloadIcon />}
                        onClick={() => fileHandler.poliza()}
                        style={{ backgroundColor: '#3F5097', width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: `${data.unidad_Poliza ? '85%' : '30%'}` }}
                    >
                        {label}
                    </Button>
                </div>
            ),
        },
        {
            label: 'Tarjeta de circulación',
            custom: true,
            style: 'mb-2',
            customItem: ({ label }) =>
            (
                <div className="pt-5">
                    <input type="file" accept=".pdf"
                        onChange={fileHandler.sendTarjeta}
                        style={{ display: 'none' }}
                        id="boton-tarjeta"
                        ref={btnTarjeta}
                    />

                    <Button
                        variant="contained"
                        value={data.unidad_TarjetaC}
                        className="buttonPrimary"
                        startIcon={<RecentActorsIcon />}
                        onClick={() => {
                            btnTarjeta.current.click()
                        }}
                        style={{ backgroundColor: secondaryColor, width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: '85%' }}
                    >
                        {label}
                    </Button>
                </div>
            ),
        },
        {
            label: 'Ver tarjeta de circulación',
            custom: true,
            style: 'mb-2',
            customItem: ({ label }) =>
            (
                <div className="pt-5">
                    <Button
                        disabled={data.unidad_TarjetaC ? false : true}
                        variant="contained"
                        value={data.unidad_TarjetaC}
                        className="buttonPrimary"
                        startIcon={<RecentActorsIcon />}
                        onClick={() => fileHandler.tarjeta()}
                        style={{ backgroundColor: '#3F5097', width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: `${data.unidad_TarjetaC ? '85%' : '30%'}` }}
                    >
                        {label}
                    </Button>
                </div>
            ),
        },
        {
            label: 'Carta factura',
            custom: true,
            style: 'mb-2',
            customItem: ({ label }) =>
            (
                <div className="pt-5">
                    <input type="file" accept=".pdf"
                        onChange={fileHandler.sendFactura}
                        style={{ display: 'none' }}
                        id="boton-factura"
                        ref={btnFactura}
                    />

                    <Button
                        variant="contained"
                        value={data.unidad_CartaFactura}
                        className="buttonPrimary"
                        startIcon={<RequestPageIcon />}
                        onClick={() => {
                            btnFactura.current.click()
                        }}
                        style={{ backgroundColor: secondaryColor, width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: '85%' }}
                    >
                        {label}
                    </Button>
                </div>
            ),
        },
        {
            label: 'Ver carta factura',
            custom: true,
            style: 'mb-2',
            customItem: ({ label }) =>
            (
                <div className="pt-5">
                    <Button
                        disabled={data.unidad_CartaFactura ? false : true}
                        variant="contained"
                        value={data.unidad_CartaFactura}
                        className="buttonPrimary"
                        startIcon={<RequestPageIcon />}
                        onClick={() => fileHandler.factura()}
                        style={{ backgroundColor: '#3F5097', width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: `${data.unidad_CartaFactura ? '85%' : '30%'}` }}
                    >
                        {label}
                    </Button>
                </div>
            ),
        },
    ]
}
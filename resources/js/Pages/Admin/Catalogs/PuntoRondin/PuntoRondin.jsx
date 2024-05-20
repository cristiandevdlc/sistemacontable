import Datatable from '@/components/Datatable'
import InputLabel from '@/components/InputLabel'
import LoadingDiv from '@/components/LoadingDiv'
import TextInput from '@/components/TextInput'
import { useForm } from '@inertiajs/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import request from '@/utils';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Dialog, DialogActions, DialogContent, MenuItem, Select, FormControl, DialogTitle, ListItemText, OutlinedInput, Tooltip } from "@mui/material";
import QRCode from "react-qr-code";
import { PDFDownloadLink } from '@react-pdf/renderer'
import QrPDF from './QrPDF'
import html2canvas from 'html2canvas';

export default function PuntoRondin() {
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [puntoSeleccionado, setpuntoSeleccionado] = useState()
    const [puntoP, setPuntoP] = useState()
    const [puntos, setRedes] = useState();
    const [url, setUrl] = useState('');
    const [showQR, setShowQR] = useState(false);
    const { data, setData } = useForm({
        Nombre: "",
    });
    const [redId, setPuntoId] = useState(0);

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };

    const fetchdata = async () => {
        try {
            getPunto();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getPunto = async () => {
        const responseE = await fetch(route("punto-rondin.index"));
        const dataE = await responseE.json();
        setRedes(dataE);
    };

    const getPuntoRondinSelected = async (paramId) => {
        const puntoId = {
            id: paramId
        }
        setUrl(route("qr-vigilancia-rondin", paramId));
        const response = await request(route("punto-seleccionado"), 'POST', { id: puntoId }, { enabled: true, error: { message: 'No se encontrarón', type: 'error' }, success: { message: "Generando QR", type: 'success' } });
        setPuntoP(response);
        return { response }
    };

    useEffect(() => {
        getMenuName()
        if (open && !puntos) {
            getPunto();
        }
    }, [open])


    useEffect(() => {
        if (!puntos) {
            getPunto();
        } else {
            setLoading(false)
        }
    }, [puntos])

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.Nombre.trim() === "") {
            newErrors.Nombre = "El nombre es requerido";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const ruta =
            action === "create"
                ? route("punto-rondin.store")
                : route("punto-rondin.update", redId);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getPunto();
            setOpen(!open);
        });
    };
    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        const fetchDataAndGenerateQR = async () => {
            if (puntoSeleccionado) {
                await getPuntoRondinSelected();
                await downloadQR();
            }
        };

        fetchDataAndGenerateQR();
    }, [puntoSeleccionado]);

    const downloadQR = async () => {
        try {
            const qrCodeDiv = document.getElementById('qr-code');

            if (!qrCodeDiv) {
                console.error('No se encontró el elemento con ID "qr-code".');
                return;
            }
            
            const canvas = await html2canvas(qrCodeDiv);
            const qrImageURL = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const a = document.createElement('a');
            a.href = qrImageURL;
            a.download = 'qr-code.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error al generar o descargar la imagen:', error);
        }
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(puntos && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData({
                                Nombre: ""

                            })
                            setOpen(!open)
                        }}
                        data={puntos}
                        columns={[
                            { header: 'Nombre', accessor: 'Nombre' },
                            {
                                header: 'Acciones', cell: eprops =>
                                    <>
                                        <button className="material-icons"
                                            onClick={() => {
                                                setAction("edit");
                                                setData({
                                                    ...eprops.item,
                                                    Nombre: eprops.item.Nombre,
                                                });
                                                setPuntoId(
                                                    eprops.item.Id
                                                );
                                                setOpen(true);
                                            }}
                                        >
                                            edit
                                        </button>
                                        <Button>
                                            <Tooltip title="Descargar QR">
                                                <span
                                                    onClick={async () => {
                                                        await getPuntoRondinSelected(eprops.item.Id);
                                                        setShowQR(true);
                                                        downloadQR();
                                                    }}
                                                    style={{ color: '#000000', marginRight: '20px', marginTop: '-10px', cursor: 'pointer' }}
                                                >
                                                    <div id="qr-code" style={{ width: '150px', height: '150px', zoom: '0.2' }}>

                                                        <QRCode value={url} size={150} />
                                                    </div>
                                                </span>
                                            </Tooltip>
                                        </Button>
                                    </>
                            }
                        ]}
                    />
                </div>
            }
            <Dialog open={open} onClose={() => setOpen(!open)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {action === 'create' ? 'Crear Punto rondin' : 'Editar Punto rondin'}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className="grid grid-cols-1 gap-3">
                            <div className='space-y-2'>
                                <InputLabel
                                    htmlFor="Nombre"

                                />
                                <TextInput
                                    label="Nombre"
                                    id="Nombre"
                                    type="text"
                                    name="Nombre"

                                    value={data.Nombre}
                                    className="block w-full mt-1 texts"
                                    autoComplete="Nombre"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            Nombre: e.target.value,
                                        })
                                    }
                                />
                                {errors.Nombre &&
                                    <span className="text-red-600">{errors.Nombre}</span>
                                }
                            </div>

                        </div>
                    </form>
                </DialogContent>
                <DialogActions className={'mt-4'}>
                    <Button color="error" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button color={(action == 'create') ? 'success' : 'warning'} onClick={submit}>{(action == 'create') ? 'Crear' : 'Actualizar'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}


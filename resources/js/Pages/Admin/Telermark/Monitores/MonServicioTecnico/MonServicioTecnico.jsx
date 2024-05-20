import Datatable from '@/components/Datatable';
import LoadingDiv from '@/components/LoadingDiv';
import request from '@/utils';
import React, { useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from '@inertiajs/react';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import MonServTecDialog from './MonServTecDialog';
import { Document, PDFDownloadLink, Page, Text, View } from '@react-pdf/renderer';
import ReportePDF from '../ServiciosTransito/ReportePDF';

// servicios-en-transito
const MonServicioTecnico = () => {
    const [state, setState] = useState({
        loading: true,
        open: false,
        action: '',
        pedidos: null,
        check: false,
        checkCambioTanque: false,
        vendedor: null,
        tipoServicio: null,
        soluciones: null,
        operadora: null,
        obs: '',
    })
    const [historial, setHistorial] = useState()
    const { data, setData } = useForm({})

    const fetchdata = async () => {
        const response = await request(route("servicios-en-transito", { estatus: [1, 4], type: 3 }), "GET");
        setState({ ...state, pedidos: response.pedidos, loading: false });
    };

    const getSelectOptions = async () => {
        const [vendedorResponse, tipoServicioResponse, operadoraResponse, servTecSolResponse] = await Promise.all([
            fetch(route("personas.index")).then(response => response.json()),
            fetch(route("tipos-servicios.index")).then(response => response.json()),
            fetch(route("usuarios.index")).then(response => response.json()),
            fetch(route("serv-tec-soluciones.index")).then(response => response.json()),
        ]);
        setState({ ...state, vendedor: vendedorResponse, tipoServicio: tipoServicioResponse, operadora: operadoraResponse, soluciones: servTecSolResponse })
    }

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#C4CCF1',
            color: 'rgba(0, 0, 0, 0.87)',
            minWidth: 400,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
            padding: 12,
            borderRadius: 12,
            boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.30)',
        },
    }));

    const handleCloseModal = () => {
        setState({ ...state, open: false, action: '', check: false, checkCambioTanque: false });
        setData({})
        // setErrors({});
    };

    const submit = async () => {
        // setData({ ...data, detalles: { ...data.detalles, servicio: data.detalles.servicio + ' ' + state.obs } })
        if (state.action === 'confServ') {
            await request(
                route('pedidos-detalle.update', data.detalles.pedidoDetallesId),
                "PUT",
                { ...data, estatus: 2, detalles: { ...data.detalles, estatus: 2, servicio: data.detalles.servicio + ' ' + state.obs + ';' } })
                .then(() => {
                    handleCloseModal()
                    fetchdata()
                })
        }
        if (state.action === 'rdg') {
            await request(
                route('pedidos-detalle.update', data.detalles.pedidoDetallesId),
                "PUT",
                { ...data, estatus: 1, detalles: { ...data.detalles, estatus: 1, servicio: data.detalles.servicio + ' ' + state.obs + ';' } })
                .then(() => {
                    handleCloseModal()
                    fetchdata()
                })
        }
    }

    const envioFunc = async () => {
        if (data.detalles.enviado.toString() === "1") {
            setState({ ...state, open: true })
        } else {
            await request(
                route('pedidos-detalle.update', data.detalles.pedidoDetallesId),
                "PUT",
                { ...data, detalles: { ...data.detalles, enviado: 1 } })
                .then(() => {
                    fetchdata()
                })
        }
    }

    const confirmar_RDG = async () => {
        if (!historial) {
            const responseE = await fetch(route("historialpedidos"), {
                method: "POST",
                body: JSON.stringify({ id: data.IdCliente, limit: 10 }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (responseE.ok) {
                const dataE = await responseE.json();
                setHistorial(dataE);
            } else {
                console.error("Error en la petición:", responseE.status);
            }
        } else {
            setState({ ...state, open: true })
        }
        // setState({ ...state, open: true })
    }

    useEffect(() => {
        if (!state.vendedor && !state.tipoServicio && !state.operadora && !state.soluciones) {
            getSelectOptions()
        }
        if (!state.pedidos) {
            fetchdata()
        }
        if (state.open === false) setHistorial(null)
        // console.log('state', state)
    }, [state])

    useEffect(() => {
        // console.log('data', data)
        if (state.action === "envio") envioFunc()
        if (state.action === "confServ") setState({ ...state, open: true })
        if (state.action === "rdg") confirmar_RDG()
    }, [data])

    useEffect(() => {
        if (historial) {
            setState({ ...state, open: true })
        }
    }, [historial])

    useEffect(() => {
        const intervalo = setInterval(fetchdata, 120000);
        return () => clearInterval(intervalo);
    }, [])

    // useEffect(() => {
    //     console.log('state', state)
    // }, [state.open])

    return (
        <>
            {state.loading && <LoadingDiv />}
            {(state.pedidos && !state.loading) &&
                <>
                    <div className='flex gap-6 pt-6'>
                        {/* <Button onClick={search}>Buscar</Button> */}
                        {data.pedidoId &&
                            <MonServTecDialog
                                open={state.open}
                                handleCloseModal={handleCloseModal}
                                action={state.action}
                                submit={submit}
                                options={state.vendedor}
                                pedido={data}
                                historial={historial}
                                check={state.check}
                                soluciones={state.soluciones}
                                checkCambioTanque={state.checkCambioTanque}
                                onChangeSolucion={(value) => setData({ ...data, detalles: { ...data.detalles, detalles: { ...data.detalles, solucionserviciotecnicoid: value } } })}
                                onChangeTecnico={(value) => setData({ ...data, detalles: { ...data.detalles, otroVendedor: value } })}
                                onChangeCheck={(e) => {
                                    setData({ ...data, check: e.target.checked })
                                    setState({ ...state, check: e.target.checked })
                                }}
                                onChangeServicio={(e) => setData({ ...data, obs: e.target.value })}
                                onChangeCantidad={(e) => setData({ ...data, detalles: { ...data.detalles, rdg: e.target.value } })}
                                onChangeCheckCambioTanque={(e) => {
                                    setData({ ...data, cambioTanque: e.target.checked })
                                    setState({ ...state, checkCambioTanque: e.target.checked })
                                }}
                            />
                        }
                    </div>
                    <Datatable
                        data={state.pedidos}
                        searcher={false}
                        rowClass={(eprops) => {
                            return eprops.item.estatusTiempos === 1
                                ? "bg-[green] text-[#E5E5E5]" // Verde
                                : eprops.item.estatusTiempos === 2
                                    ? "bg-[#FBD413]" // Amarillo
                                    : "bg-[#CE2929] text-[#E5E5E5]"; // Rojo
                        }}
                        columns={[
                            { header: "Fecha", accessor: "fecha" },
                            { header: "Teléfono", accessor: "telefono" },
                            { header: "Cliente", accessor: "cliente" },
                            { header: "Colonia", accessor: "colonia" },
                            { header: "Dirección", accessor: "direccion" },
                            { header: "Tiempo", accessor: "tiempoTranscurrido" },
                            { header: "Operadora", accessor: "operadora" },
                            {
                                header: " ", cell: eprops => (
                                    <>
                                        <div className='flex gap-3 text-black'>
                                            <div>
                                                <HtmlTooltip
                                                    arrow
                                                    placement='left'
                                                    title={
                                                        <React.Fragment>
                                                            <Typography color="inherit">Detalle del servicio</Typography>
                                                            <Divider />
                                                            <div className='grid w-full grid-cols-2 gap-3 pt-2 overflow-x-hidden overflow-y-auto'>
                                                                <div className='flex flex-col'>
                                                                    <span>Descripción:</span>
                                                                </div>
                                                                <div className='flex flex-col'>
                                                                    <span className='flex-grow'>{eprops.item.detalles.servicio}</span>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <InfoIcon />
                                                </HtmlTooltip>
                                            </div>
                                            <div>
                                                <Link to={'/clientes-pedidos'} state={{ item: eprops.item, showPedido: false }}>
                                                    <PersonIcon />
                                                </Link>
                                            </div>
                                            <div>
                                                <Link to={'/clientes-pedidos'} state={{ item: eprops.item, showPedido: true }}>
                                                    <DescriptionIcon className='rounded-full cursor-pointer' />
                                                </Link>
                                            </div>
                                            <div>
                                                <DownloadDoneIcon
                                                    className='rounded-full cursor-pointer'
                                                    onClick={() => {
                                                        setData({ ...eprops.item, tipo: 'confServ' })
                                                        setState({ ...state, action: 'confServ' })
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <PropaneTankIcon
                                                    className='rounded-full cursor-pointer'
                                                    onClick={() => {
                                                        setData({ ...eprops.item, tipo: 'rdg' })
                                                        setState({ ...state, action: 'rdg' })
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <CheckCircleOutlineIcon
                                                    onClick={() => {
                                                        setData({ ...eprops.item, tipo: 'envio' })
                                                        setState({ ...state, action: 'envio' })
                                                    }}
                                                    className={(eprops.item.detalles.enviado.toString() === '0' ? 'bg-gray-300 ' : 'bg-[green] ') + 'rounded-full cursor-pointer'} />
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        ]}
                    />
                </>
            }
        </>
    )
}

export default MonServicioTecnico
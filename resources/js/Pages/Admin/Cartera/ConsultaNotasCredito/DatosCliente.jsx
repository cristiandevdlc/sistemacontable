import { useState, useEffect } from "react"
import { intClienteDatos, intStateConsultasNCR } from './intConsultaNotasCredito';
import { Divider } from "rsuite";
import Datatable from "@/components/Datatable";
import { ButtonComp } from "@/components/ButtonComp";
import { Link, useLocation } from "react-router-dom";
import { Request } from "@/core/Request";
import camionLogo from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import request, { moneyFormat, noty } from "@/utils";
import { Dialog } from "@mui/material";
import TextInput from "@/components/TextInput";


export default function DatosCliente() {
    const [state, setState] = useState(intStateConsultasNCR)
    const [data, setData] = useState(intClienteDatos)
    const location = useLocation();
    const [facturas, setFacturas] = useState()
    const [estadocorreo, setcorreo] = useState(false);
    const [detalle, setDetalle] = useState(false)
    const [ClientEmail, setClientEmails] = useState([]);


    useEffect(() => {
        getDatosCliente();
        mapeoDatos();
        FetchClientEmails();

    }, [])

    const getDatosCliente = async () => {
        const response = await Request._post(route('clientes-ncr'), { numeroCliente: location.state.item[0].NoCliente });
        setState({
            ...state,
            DatosCliente: response
        })
    };
    const CorreoFactura = async () => {
        setState({ ...state, loading: true });
        // console.log({ Folio: location.state.item[0].idNCR, correo: data.correo, Tipo: "NotasCredito" })
        const response = await fetch(route('CorreoFactura'), { method: "POST", body: JSON.stringify({ Folio: location.state.item[0].idNCR, correo: data.correo, Tipo: "NotasCredito" }), headers: { "Content-Type": "application/json" } });
        if (response.ok) {
            setState({ ...state, loading: false });
            showNotification("El correo se envió exitosamente.", 'success', 'metroui', 'bottomRight', 2000);
            setDetalle(false);
        } else {
            showNotification("Fallo al enviar correo", 'error', 'metroui', 'bottomRight', 2000);
        }
    };

    const FetchClientEmails = async (e) => {
        const response = await request(route('correos-clientes.show', Number(location.state.item.NoCliente)));
        const filteredResponse = response.filter(item => item.correoCliente_idCliente !== '' && item.correoCliente_correo !== '');
        setClientEmails(filteredResponse);
    };


    const mapeoDatos = async () => {
        const informacion = location.state.item[0].Detalles;
        for (let i = 0; i < informacion.length; i++) {
            const detalle = informacion[i];
        }
        setFacturas(informacion)
    }
    const areButtonsEnabled = selected.length > 0;
    const Abrirmodalcorreo = async () => { setDetalle(true); }


    const cancelarNCR = async () => {
        await Request._post(route('cancelar-ncr'), { NCR: location.state.item }, {
            error: { message: 'No se ha podido cancelar el pago' },
            success: { message: "Nota de Crédito cancelada" },
        })
    };

    return (
        <div className='relative h-[100%] pb-4 px-3 -mt-4'>
            <div className='flex relative gap-3 sm:flex-col md:flex-row h-[90%]'>
                <div className='flex flex-col gap-2 pt-4 min-w-[300px]'>
                    <div className='grid grid-cols gap-4'>
                        <div className='flex !text-[12px] flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                            <Link to="/consulta-notas-de-credito" >
                                <KeyboardReturnIcon />
                            </Link>
                            <div className='flex justify-between'>
                                <span>Número de Cliente:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].noCliente}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Nombre:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].nombre}</span>

                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Calle:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].calle}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Colonia:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].colonia}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>No Exterior:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 ? state.DatosCliente[0].NoExterior || 'S/N' : 'S/N'}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>No Interior:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 ? state.DatosCliente[0].NoInterior || 'S/N' : 'S/N'}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>País:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].pais}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Estado:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].estado}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>RFC:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].cliente_rfc}</span>
                            </div>

                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Ciudad:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].cliente_localidad}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>CP:</span>
                                <span>{state.DatosCliente && state.DatosCliente.length > 0 && state.DatosCliente[0].cliente_codigoPostal}</span>
                            </div>
                            <Divider color='#5F6C91' />
                        </div>
                    </div>
                    <div className='flex !text-[12px] flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                        <div className='flex justify-between'>
                            <span>UUID:</span>
                            {/* <span>${location.state.item[0]?.Subtotal})}</span> */}
                        </div>
                        <div className='flex justify-between'>
                            <span>Subtotal:</span>
                            <span>${parseFloat(location.state.item[0]?.Subtotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>I.V.A:</span>
                            <span>${parseFloat(location.state.item[0]?.Iva).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Total:</span>
                            <span>${parseFloat(location.state.item[0]?.Total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    <ButtonComp
                        label="Enviar Nota de Crédito"
                        color="#1B2654"
                        onClick={Abrirmodalcorreo}
                        className="!mt-[0] !text-[14px]"
                    />
                    <Link to="/consulta-notas-de-credito">
                        <ButtonComp
                            label="Cancelar Nota de Crédito"
                            color="#af2828"
                            onClick={cancelarNCR}

                            className="!mt-[0] !text-[14px]"
                        />
                    </Link>

                </div>
                <div className="relative col-span-10 mx-5  mt-4">
                    {facturas ? (
                        <Datatable
                            searcher={false}
                            virtual={true}
                            height={'200%'}
                            data={facturas}
                            columns={[
                                { header: "Factura", width: '80%', cell: (eprops) => <>{eprops.item.FacturaSerie}</> },
                                { header: "UUID", width: '80%', cell: (eprops) => <>{eprops.item.UUID ? eprops.item.UUID : "no timbrada"}</> },
                                { header: "Importe", width: '80%', cell: (eprops) => `$ ${moneyFormat(eprops.item.Importe)}` },

                            ]}
                        />
                    ) : (
                        <>
                            <div className='flex flex-col relative h-full items-center overflow-hidden self-center justify-center'>
                                <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                                <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                            </div>
                        </>
                    )}
                </div>
                <Dialog open={detalle} style={{ height: '100%' }} onClose={() => { setDetalle(false); }} maxWidth="lg" >

                    <div class="mx-auto max-w-screen-xl px-4 py-10 lg:flex  lg:items-center">
                        <div class="mx-auto max-w-xl text-center">
                            <h1 class="text-3xl font-extrabold sm:text-4xl">Se ha creado la Nota de Credito Correctamente</h1>

                            <div className="relative flex" style={{ width: '100%' }}>
                                {estadocorreo == false && (<TextInput label="Correo Electronico" type="text" value={data.correo} onChange={(e) => { setData({ ...data, correo: e.target.value }); }} />)}
                                {estadocorreo == true && (
                                    <SelectComp
                                        label="Correos"
                                        options={ClientEmail}
                                        value={facturacion.correos || ''}
                                        data="correoCliente_correo"
                                        valueKey="correoCliente_correo"
                                        onChangeFunc={(newValue) => {
                                            setData({ ...data, correo: newValue });
                                        }}
                                    />
                                )}
                                {ClientEmail.length > 0 && (<Tooltip title={estadocorreo ? "Escribir correo" : "Seleccionar correo"}> <Button className="bg-transparent text-white h-8 w-8 absolute right-18 top-7 mt-1 mr-2" onClick={() => { setcorreo(!estadocorreo); }} > <KeyboardDoubleArrowRightIcon /> </Button> </Tooltip>)}
                            </div>
                            <div class="mt-8 flex flex-wrap justify-center gap-4">
                                <button class="block w-full rounded bg-[#1B2654] px-12 py-3 text-sm font-medium text-white shadow  sm:w-auto" onClick={CorreoFactura}> Enviar correo </button>
                            </div>
                        </div>
                    </div>
                </Dialog >
            </div>
        </div>
    )
    function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };

}
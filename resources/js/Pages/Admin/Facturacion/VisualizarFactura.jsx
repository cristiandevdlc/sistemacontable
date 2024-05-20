import LoadingDiv from '@/components/LoadingDiv';
import { useState, useEffect } from 'react';
import TextInput from "@/components/TextInput";
import SelectComp from '@/components/SelectComp';
import Datatable from "@/components/Datatable";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, Chip, Tooltip, Divider, Badge } from '@mui/material'
import request, { noty, regex } from '@/utils';
import { Link, useLocation } from 'react-router-dom'
import camion from "../../../../png/camion.png"
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import AssignmentIcon from '@mui/icons-material/Assignment';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MailIcon from '@mui/icons-material/Mail';
export default function FacturacionDiversas() {
    const location = useLocation()

    const [state, setState] = useState({ loading: true, consultas: true, redirectionTime: 5, exito: true })
    const [xml, setxml] = useState(true);
    const [exito, setexito] = useState(true);
    const [estadocorreo, setcorreo] = useState(false);
    const [detalle, setDetalle] = useState(false)

    const [tabla, settabla] = useState([]);
    const [ClientEmail, setClientEmails] = useState([]);
    const [cliente, setcliente] = useState({ id: "", nombre: "", rfc: "", cp: "", tipoventa: "", telefono: "", cfdi: "", cfdiname: "", DomicilioFiscalReceptor: "", RegimenFiscal: "" });

    const [direccion, setdireccion] = useState({ id: "", calle: "", colonia: "", numeroe: "", numeroi: "", pais: "", estado: "", ciudad: "", localidad: "", formapago: "", formapagoname: "", CP: "" });
    const [checkedCheckboxes, setCheckedCheckboxes] = useState({});

    const [totales, settotales] = useState({
        Folio: 0,
        Factura: 0,
        Serie: 0,
        Fecha: 0,
        TipoVenta: 0,
        Subtotal: 0,
        Descuento: 0,
        Iva: 0, Total: 0,
        Observaciones: "",
        XML: "",
        TipoFactura: "",
        Estatus: 0,
        TotalCorreo: ""
    });



    const Location = async () => {
        const responseR = await fetch(route("clientes.index"));
        const dataR = await responseR.json();
        if (location.state) {
            setexito(false);
            const { item } = location.state;
            console.log("ITEM", item)
            const clienteEncontrado = dataR.find(cliente => cliente.cliente_idCliente === Number(item.idCliente));
            if (item.idCliente) {

                setcliente({ id: item.idCliente, nombre: clienteEncontrado.cliente_nombrecomercial, rfc: clienteEncontrado.cliente_rfc, cp: clienteEncontrado.cliente_codigoPostal, telefono: clienteEncontrado.cliente_telefono, cfdi: clienteEncontrado.uso_cfdi_sat.usoCfdiSAT_clave, cfdiname: clienteEncontrado.uso_cfdi_sat.usoCfdiSAT_descripcion, DomicilioFiscalReceptor: clienteEncontrado.cliente_codigoPostal, RegimenFiscal: clienteEncontrado.regimen_fiscal.catalogoRegimenFiscalSAT_clave });
                setdireccion({ calle: clienteEncontrado.cliente_calle, colonia: clienteEncontrado.cliente_colonia, numeroe: clienteEncontrado.cliente_numeroExterior, numeroi: clienteEncontrado.cliente_numeroInterior, pais: clienteEncontrado.pais.descripcionPais, estado: clienteEncontrado.estado.descripcionEstado, ciudad: clienteEncontrado.cliente_ciudad, localidad: clienteEncontrado.cliente_localidad, CP: clienteEncontrado.cliente_codigoPostal, formapago: clienteEncontrado.forma_pago.formasPago_descripcion, formapagoname: clienteEncontrado.forma_pago.formasPago_cveFormasPago });
                setState({ ...state, loading: false });

                settotales({
                    Folio: item.Folio,
                    Factura: item.idFactura,
                    Serie: item.tipoFactura,
                    Fecha: item.Fecha,
                    TipoVenta: item.Tipo,
                    Subtotal: parseFloat(item.Importe),
                    Descuento: 0,
                    Iva: parseFloat(item.Iva),
                    Total: parseFloat(item.Total),
                    Observaciones: item.Observaciones,
                    XML: "",
                    TipoFactura: item.tipoFactura,
                    Estatus: item.Estatus,
                    TotalCorreo: "",
                });
                getDetalle(item.idFactura, item.tipoFactura);
                getclientmails(item.idCliente);
            } else {
                setState({ ...state, loading: false });
                setTimeout(() => {
                    setState({ ...state, redirectionTime: state.redirectionTime -= 1 })
                }, 1000)
            }
        }
    };
    const getclientmails = async (e) => {
        const response = await request(route('correos-clientes.show', e));
        const filteredResponse = response.filter(item => item.correoCliente_idCliente !== '' && item.correoCliente_correo !== '');
        setClientEmails(filteredResponse);
        settotales(prevTotales => ({ ...prevTotales, totalcorreo: filteredResponse.length }));
    };



    
    const XMLTIMBRADO = async () => {
        try {
            setState({ ...state, loading: true });
            const response = await fetch(route('XmlVisualizar'), { method: "POST", body: JSON.stringify({ Folio: totales.Factura,Tipo:totales.TipoFactura }), headers: { "Content-Type": "application/json" } });
            response.ok ? (setState({ ...state, consultas: false }), showNotification("Se encontro el xml timbrado.", 'success', 'metroui', 'bottomRight', 2000)) : showNotification("No se encontro el xml", 'error', 'metroui', 'bottomRight', 2000);
            const data = await response.json();
            const primerElemento = data.shift(); // Remueve y devuelve el primer elemento del array
            const xmlTimbrado = primerElemento.facturaDiversos_XMLTimbrado ?? primerElemento.factura_XMLTimbrado;
            settotales(prevTotales => ({ ...prevTotales, XML:xmlTimbrado }));

        } catch (error) {
            console.error("Error en la solicitud:", error.message);
        }
    };

    const CorreoFactura = async () => {
        try {
            setDetalle(false);
            setState({ ...state, loading: true });
            const response = await fetch(route('CorreoFactura'), { method: "POST", body: JSON.stringify({ Folio: totales.Factura, Correo: totales.correo,Tipo:totales.TipoFactura }), headers: { "Content-Type": "application/json" } });
            response.ok ? (setState({ ...state, consultas: false }), showNotification("El correo se envió exitosamente.", 'success', 'metroui', 'bottomRight', 2000)) : showNotification("Fallo al enviar correo", 'error', 'metroui', 'bottomRight', 2000);
            setState({ ...state, loading: false });

      
        } catch (error) {
            console.error("Error en la solicitud:", error.message);
        }
    };

    const getDetalle = async (e, m) => {
        setState({ ...state, loading: true });
        const response = await fetch(route('DetallesFactura'), { method: "POST", body: JSON.stringify({ Folio: Number(e), Tipo: m }), headers: { "Content-Type": "application/json" } });
        const message = response.ok ? 'Se encontro la factura' : 'No se encontro esta factura';
        settabla(response.ok ? await response.json() : null);
        setState({ ...state, loading: false });
        showNotification(message, response.ok ? 'success' : 'error', 'metroui', 'bottomRight', 2000);
    };
    const CancelarFactura = async (Folio, Tipo) => {
        setState({ ...state, loading: true });
        try {
            const response = await fetch(route('CancelarFactura'), {
                method: "POST",
                body: JSON.stringify({ Folio, Tipo }),
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            if (!blob) {
                throw new Error("No se pudo encontrar el PDF después de cancelar la factura");
            }

            const url = window.URL.createObjectURL(blob);
            const a = Object.assign(document.createElement('a'), {
                href: url,
                download: `Facturacion_Cancelada${Date.now()}.pdf`
            });

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showNotification('La factura ha sido descargada con éxito', 'success', 'metroui', 'bottomRight', 2000);
            setState({ ...state, loading: false });
        } catch (error) {
            console.error(error.message);
            showNotification('Hubo un problema al buscar el pdf cancelado', 'error', 'metroui', 'bottomRight', 2000);
            setState({ ...state, loading: false });
        }
    };


    const BuscarPdf = async (Folio, Tipo) => {
        try {
            const response = await fetch(route('BuscarDocumento'), { method: "POST", body: JSON.stringify({ Folio, Tipo }), headers: { "Content-Type": "application/json" } });
            if (!response.ok) { throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`); }
            const blob = await response.blob(), url = window.URL.createObjectURL(blob), a = Object.assign(document.createElement('a'), { href: url, download: `Facturacion_Visualizar${Date.now()}.pdf` }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
            showNotification('El archivo se ha descargado con exito', 'success', 'metroui', 'bottomRight', 2000);
        } catch (error) {
            console.error(error.message);
        }
    };

    const getAll = async () => {
        Location();
    }

    useEffect(() => {
        document.title = 'Intergas | Visualizar factura';
        getAll().then(() => setState({ loading: false }))
    }, [])

    useEffect(() => {
        if (!xml) { XMLTIMBRADO(); }
    }, [xml]);


    return (

        <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
            {state.loading &&
                <div className='flex items-center justify-center h-screen w-screen'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <>
                    {exito ? (
                        <>
                            <div className="h-full w-full">
                                <div className="flex w-full h-[75%] mt-7 justify-center">
                                    <img src={camion} />
                                </div>
                                <div className="flex w-full h-[75%] justify-center text-center">
                                    <p>Favor de selecionar una factura en&nbsp;
                                        <Link to='/Facturacion-consultas' className="text-blue-700 underline  decoration-1">
                                            facturacion consultas
                                        </Link>
                                        <br />
                                    </p>
                                </div>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="flex flex-col h-[92vh] overflow-y-auto sm:max-w-[100%] md:max-w-[18%] w-full blue-scroll gap-3 px-1 pb-2">
                                <div className='flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2'>
                                    <span style={{ fontSize: '17px' }}>DATOS DEL CLIENTE:</span>
                                    <hr />
                                    <span>Nombre: {cliente.nombre ? cliente.nombre : "NO TIENE NOMBRE"}</span>
                                    <span>Telefono: {cliente.telefono ? cliente.telefono : "NO TIENE TELEFONO"}</span>
                                    <span>RFC: {cliente.rfc ? cliente.rfc : "NO TIENE RFC"} </span>
                                    <span>Calle: {direccion.calle ? direccion.calle : "NO TIENE CALLE"}</span>
                                    {/* <span>Colonia: {direccion.colonia ? direccion.colonia : "NO TIENE COLONIA"} </span> */}
                                    <span>No Exterior: {direccion.numeroe ? direccion.numeroe : "S/N NUMERO EXTERIOR"}</span>
                                    <span>No Interior: {direccion.numeroi ? direccion.numeroi : "S/N NUMERO INTERIOR"}</span>
                                    <span>Pais:  {direccion.pais ? direccion.pais : "NO TIENE PAIS"}</span>
                                    <span>Estado: {direccion.estado ? direccion.estado : "NO TIENE ESTADO"}</span>
                                    <span>Localidad: {direccion.localidad ? direccion.localidad : "NO TIENE LOCALIDAD"}</span>
                                    <span>CP: {direccion.CP ? direccion.CP : "NO TIENE CP"}</span>
                                </div>

                                <div className='flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2'>
                                    <span style={{ fontSize: '17px' }}>FACTURACION:</span>
                                    <hr />
                                    <span>Fecha: {totales.Fecha ? totales.Fecha : "S/N FECHA"}</span>
                                    <span>Forma de pago: {direccion.formapago ? direccion.formapago : "S/N FORMA DE PAGO"}</span>
                                    <span>Tipo de venta: {totales.TipoVenta ? totales.TipoVenta : "S/N TIPO"}
                                    </span>
                                    <span>Serie: {totales.TipoFactura  === "NORMAL" ? "I" :"D"} </span>
                                    <span>N* Folio: {totales.Folio ? totales.Folio : "S/N FOLIO"}</span>
                                </div>
                                <Tooltip title={xml ? "Al dar click al boton se mostrara el XML" : "Al dar click se mostrara los Conceptos"}>

                                <div className="flex flex-col shadow-md bg-[#FC4C02] border-2 p-4 rounded-xl text-white text-[12px] gap-2" onClick={() => { setxml(!xml); }}>
                                        <span className="flex justify-between items-center">
                                            <span>{xml ? "XML" : "CONCEPTOS"}</span>
                                            <AssignmentIcon />
                                        </span>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Se abrira una pantalla donde se seleccionar el correo para enviar la factura">
                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2"
                                        onClick={() => setDetalle(true)}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2c3a78'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#1B2654'}>
                                        <span className="flex justify-between items-center">
                                            <span >ENVIAR FACTURA</span>
                                            <Badge badgeContent={totales.TotalCorreo || ""} color="primary">
                                                <MailIcon />
                                            </Badge>
                                        </span>
                                    </div>
                                </Tooltip>

                                <Tooltip title="Al dar click se imprimira el documento">

                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2"
                                        onClick={(e) => { totales.Estatus == "1" ? BuscarPdf(totales.Factura, totales.TipoFactura) : CancelarFactura(totales.Factura, totales.TipoFactura); }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2c3a78'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#1B2654'}>
                                        <span className="flex justify-between items-center">
                                            <span >IMPRIMIR</span> <LocalPrintshopIcon />
                                        </span>
                                    </div>
                                </Tooltip>
                            </div>



                            <div className='flex flex-col w-full gap-4 items-stretch' >
                                <div className="w-full pt-3 monitor-table" >
                                    {xml && (
                                        <Datatable
                                            data={tabla}
                                            searcher={false}
                                            columns={[
                                                {
                                                    header: "Concepto",
                                                    cell: (row) => {
                                                        const Concepto = row.item.NombreFacturacion;
                                                        return Concepto;
                                                    }
                                                },


                                                {
                                                    header: "Descripción",
                                                    cell: (row) => {
                                                        const Descripción = row.item.Descripcion;
                                                        return Descripción;
                                                    }
                                                },
                                                {
                                                    header: "Unidad Medida",
                                                    cell: (row) => {
                                                        const Descripción = row.item.unidadMedida;
                                                        return Descripción;
                                                    }
                                                },
                                                {
                                                    header: "Precio",
                                                    cell: (row) => {
                                                        const precio = row.item.PrecioUnitario;
                                                        return parseFloat(precio).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                    }
                                                },
                                                {
                                                    header: "Cantidad",
                                                    cell: (row) => {
                                                        const cantidad = row.item.CantidadKiloLitro;
                                                        return parseFloat(cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                    }
                                                },

                                                {
                                                    header: "Descuento",
                                                    cell: (row) => {
                                                        const descuento = row.item.Bonificacion;
                                                        return parseFloat(descuento).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                    }
                                                },

                                                {
                                                    header: "Importe",
                                                    cell: (row) => {
                                                        const importe = row.item.Importe;
                                                        return parseFloat(importe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                    }
                                                },



                                                {
                                                    header: "IVA",
                                                    cell: (row) => {
                                                        const iva = parseFloat(row.item.iva);
                                                        const importe = parseFloat(row.item.Importe);
                                                        const descuento = parseFloat(row.item.Bonificacion);

                                                        const totalSinDescuento = importe - descuento;
                                                        const totalConIVA = totalSinDescuento * iva;

                                                        return totalConIVA.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                    }
                                                },

                                                {
                                                    header: "Impuesto",
                                                    accessor: "Impuesto",
                                                    width: '50%',
                                                    cell: (eprops) => (
                                                        <>
                                                            <Checkbox
                                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                                                checked={checkedCheckboxes[eprops.item.id] || true}
                                                            />
                                                        </>
                                                    ),
                                                },

                                            ]}
                                        />
                                    )}
                                    {!xml && (<textarea id="OrderNotes" className="w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm md:min-w-[30%]" style={{ height: '670px', textAlign: 'left' }} rows="5" placeholder={totales.XML || "POR EL MOMENTO NO HA SIDO TIMBRADO EL XML"} disabled={true}  ></textarea>)}
                                </div>

                                <div className="flex gap-4">
                                    <textarea id="OrderNotes" className="w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm md:min-w-[30%]" rows="5" placeholder={totales.observaciones || "SIN OBSERVACIONES"} disabled={true} ></textarea>
                                    <div className="flex flex-col w-full justify-center shadow-md bg-[#1B2654] border-2 px-4 rounded-xl text-white text-[12px] gap-2">
                                        <div className='flex w-full justify-between'>
                                            <span>Subtotal:</span>
                                            <span>$ {totales.Subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                        </div>

                                        <div className='flex w-full justify-between'>
                                            <span>Descuento:</span>
                                            <span>$ {totales.Descuento.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                        </div>
                                        <div className='flex w-full justify-between'>
                                            <span>IVA:</span>
                                            <span>$ {totales.Iva.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>

                                        </div>
                                        <div className='flex w-full justify-between'>
                                            <span>Total:</span>
                                            <span>$ {totales.Total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            }
            <Dialog open={detalle} style={{ height: '100%' }} onClose={() => { setDetalle(false); }} maxWidth="lg" >

                <div class="mx-auto max-w-screen-xl px-4 py-10 lg:flex  lg:items-center">
                    <div class="mx-auto max-w-xl text-center">
                        <h1 class="text-3xl font-extrabold sm:text-2xl"> Selecciona o escribe el correo que deseas mandar la factura.</h1>

                        <div className="relative flex" style={{ width: '100%' }}>
                            {estadocorreo == false && (<TextInput label="Correo Electronico" type="text" value={totales.correo || ''} onChange={(e) => { settotales({ ...totales, correo: e.target.value }); }} />)}
                            {estadocorreo == true && (
                                <SelectComp
                                    label="Correos"
                                    options={ClientEmail}
                                    value={totales.correo || ''}
                                    data="correoCliente_correo"
                                    valueKey="correoCliente_correo"
                                    onChangeFunc={(newValue) => {
                                        settotales({ ...totales, correo: newValue });
                                    }}
                                />
                            )}
                            {ClientEmail.length > 0 && (<Tooltip title={estadocorreo ? "Escribir correo" : "Seleccionar correo"}> <Button className="bg-transparent text-white h-8 w-8 absolute right-18 top-7 mt-1 mr-2" onClick={() => { setcorreo(!estadocorreo); }} > <KeyboardDoubleArrowRightIcon /> </Button> </Tooltip>)}
                        </div>
                        <div class="mt-8 flex flex-wrap justify-center gap-4">
                            <button class="block w-full rounded bg-orange-600 px-12 py-3 text-sm font-medium text-white shadow  sm:w-auto" onClick={CorreoFactura}> Enviar correo </button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div >


    )
    function showNotification(text, type, theme, layout, timeout) {
        new Noty({
            text: text,
            type: type,
            theme: theme,
            layout: layout,
            timeout: timeout
        }).show();
    };


}


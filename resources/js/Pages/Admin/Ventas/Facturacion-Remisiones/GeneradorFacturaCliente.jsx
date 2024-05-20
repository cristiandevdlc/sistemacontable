import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';

import React, { useEffect, useState } from 'react'
import request from "@/utils";
import TextInput from '@/components/TextInput';
import { Button, Dialog, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email';
import Datatable from '@/components/Datatable'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import PrintIcon from '@mui/icons-material/Print';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import Imagen from './../../Facturacion/Factura.gif'
import Email from './../../Facturacion/Email'; // Asegúrate de importar correctamente el componente InformacionFactura desde su ubicación real

export default function GeneradorFacturaCliente() {
    const [impuestos, setImpuestos] = useState([]);
    const fechaHoy = new Date();
    const fechaFormateada = `${fechaHoy.getFullYear()}-${(fechaHoy.getMonth() + 1).toString().padStart(2, '0')}-${fechaHoy.getDate().toString().padStart(2, '0')}`;
    const [state, setState] = useState({ loading: true })
    const [data, setData] = useState({ impuesto: 0, Folio: null, fecha: fechaFormateada, MetodoPago: 0, calle: "", colonia: "", N_Exterior: "", N_Interior: 0, Telefono: '(000)000-0000', idEmpresa: 0, localidad: "", observaciones: "", FormaPago: 0 });
    const [empresas, setEmpresas] = useState([]);
    const [folios, setfolios] = useState([]);
    const [cliente, setcliente] = useState({ id: "" });
    const location = useLocation();
    const [exito, setexito] = useState(false);
    const [detalle, setDetalle] = useState(false)
    const [facturacion, setfacturacion] = useState({ iva: 0, fecha: fechaFormateada, folio: 0, observaciones: "", imprimir: false, correo: false, correos: "", location: "", tipos: "NORMAL" });
    const [informacionGral, setinformacionGral] = useState([]);
    const [totalesfinales, settotalesfinales] = useState({ descuento: 0, iva: 0, total: 0, subtotal: 0 });
    const [idFactura, setIdFactura] = useState(0);
    const [formaspago, setformaspago] = useState()
    const [metodosPago, setMetodosPago] = useState();
    const [stateBancarizado, setStateBancarizado] = useState({ bancarizado: 0 })


    const MetodosPagos = async () => {
        const response = await fetch(route("sat/metodo-pago.index"));
        const dataq = await response.json();
        setMetodosPago(dataq);
        const Metodo = Number(location.state.item.informacion[0].factura_idMetodoPago);


        setData(prevState => ({ ...prevState, MetodoPago: Metodo }));
    };

    const FormaPagos = async () => {
        const response = await fetch(route("formas-pago.index"));
        const data = await response.json();
        setformaspago(data);
    };

    const GetEmpresas = async () => {
        const empresaData = JSON.parse(localStorage.getItem('empresaData'));
        const response = await fetch(route("empresas.index"));
        const data = await response.json();
        setEmpresas(data);
        setData(prevState => ({ ...prevState, idEmpresa: empresaData.id }));
    };

    const Folios = async () => {
        const response = await fetch(route("FoliosRemisiones"));
        const data = await response.json();
        setfolios(data);
        if (data.length > 0) { setData(prevState => ({ ...prevState, Folio: data[0].folios_idFolios })); }
    };

    const Getimpuestos = async () => {
        const response = await fetch(route('sat/impuestos.index'))
        const dataE = await response.json();
        const impuestosFiltrados = dataE.filter(impuesto => impuesto.catalogoImpuestoSAT_descripcion === "IVA 16%");
        setImpuestos(impuestosFiltrados);
        setData(prevState => ({ ...prevState, impuesto: impuestosFiltrados[0].catalogoImpuestoSAT_id }));
    };

    const Totales = async (item) => {
        // console.log("item", item)
        //const subtotal = item.reduce((acumulador, objeto) => acumulador + (parseFloat(objeto.importe) || 0), 0);

        const subtotal = item.reduce((acumulador, objeto) => acumulador + (parseFloat(objeto.precios) * parseFloat(objeto.Cantidad) || 0), 0);
        const descuento = item.reduce((acumulador, objeto) => acumulador + (parseFloat(objeto.descuento) || 0), 0);
        const IvaTotal = item.reduce((acumulador, objeto) => acumulador + (parseFloat(objeto.iva) || 0), 0);;
        // const IvaTotal = item.reduce((acumulador, objeto) => acumulador + (parseFloat(objeto.IVAValor) || 0), 0);
        const total = subtotal - descuento + IvaTotal;

        settotalesfinales({ subtotal: subtotal, descuento: descuento, iva: IvaTotal, total: total })
    };



    const renderTotalItem = (label, value) => { return (<div className='flex w-full justify-between' style={{ paddingBottom: '10px' }}> <span>{label}:</span> <span>$ {value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span> </div>); };



    const Abrirmodalcorreo = async () => { setDetalle(true); }


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


    const EnviarFacturas = async (e) => {
        console.log("Informacion", informacionGral);
        if (location.state.item.forma === 3) {
            informacionGral.forEach(async info => {
                // console.log(info);
                GuardarDatos([info], e);
            });
        } else {
            GuardarDatos(informacionGral, e);
        }
    }

    const GuardarDatos = async (valores, m) => {
        setState({ ...state, loading: true });

        // LimpiarRow();
        // setMetodo(false);
        // setexito(true);
        const FolioSeleccionado = folios.find(foliosSelec => foliosSelec.folios_idFolios === data.Folio)


        if (FolioSeleccionado) {
            const informacion = {
                ClienteId: informacionGral[0].idCliente,
                MetodoPagoId: Number(informacionGral[0].factura_idMetodoPago),
                FormaPagoId: data.FormaPago,
                Folio: informacionGral[0].Folio,
                Fecha: data.fecha,
                Subtotal: totalesfinales.subtotal,
                IVA: totalesfinales.iva,
                Total: totalesfinales.total,
                Descuento: totalesfinales.descuento,
                Serie: FolioSeleccionado.folios_serie,
                Observaciones: data.observaciones,
                TipoRemision: facturacion.location,
                FormaMetodo: m,
                Vendedor: Number(informacionGral[0].vendedor),
                ImpuestoId: data.impuesto,
                ProductoFacturaDescripcion: informacionGral[0].productoFactura_descripcion,
                remision: informacionGral[0].remision,
                EstacionPCRE: informacionGral[0].Estacion_PCRE,
                CantidadLitros: informacionGral[0],
                IdEmpresa : data.idEmpresa
            }


            const response = await fetch(route('GenerarArchivosRemisiones'), { method: "POST", body: JSON.stringify({ Facturaciones: informacion, Conceptos: valores }), headers: { "Content-Type": "application/json" } });
            if (response.ok) {

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Facturacion${Date.now()}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                const datosAdicionales = response.headers.get('X-Datos-Adicionales');
                console.log("response", response);
                if (datosAdicionales) {
                    const datos = JSON.parse(datosAdicionales);
                    console.log(datos);
                    const facturaId = datos.factura_idFactura;
                    setIdFactura(facturaId)
                    setState({ ...state, loading: false });
                    showNotification('Se descargo el comprobante', 'success', 'metroui', 'bottomRight', 2000);
                    setexito(false);
                    // setfacturacion({ ...facturacion, folio: facturaId })
                    setfacturacion({ ...facturacion, folio: datos.facturacion.factura_idFactura, RutaXml: datos.rutaArchivoXml });

                }
                setDetalle(true);

            } else {
                setState({ ...state, loading: false });
                showNotification('Fallo el timbrado, ir a Facturacion Consultas', 'error', 'metroui', 'bottomRight', 2000);

                // setTimeout(() => {
                //     window.location.href = "/Facturacion-consultas";
                // }, 2000);
            }
        } else {
            showNotification('Verifica los Campos', 'error', 'metroui', 'bottomRight', 2000);
        }
    }



    const getData = async () => {
        await Promise.all([
            Location(),
            MetodosPagos(),
            FormaPagos(),
            GetEmpresas(),
            Folios(),
            Getimpuestos()
        ]);
    }
    const Location = async () => {
        if (location.state) {
            const { item } = location.state;
            console.log("Informacion", item);
            setinformacionGral(item.informacion);

            Totales(location.state.item.informacion);
            // console.log("location.state.item.informacion", location.state.item.informacion);
            setfacturacion({ ...facturacion, location: location.state.item.forma });
            // setfacturacion(prevState => ({ ...facturacion, location: location.state.item.forma }));
            setcliente({ id: item.informacion[0].idCliente });
        } else {
            setState({ ...state, loading: false });
            setexito(true);
        }
    };

    // useEffect(() => {
    //     // Aquí actualizamos el valor de MetodoPago en base al tipo de venta
    //     if (!data.MetodoPago && location.state) {
    //         // console.log('aver', location.state.item.informacion[0].TipoVenta)
    //         // setData({ ...data, MetodoPago: location.state.item.informacion[0].factura_idMetodoPago });
    //         Location();
    //     }
    //     // if (data.MetodoPago) setState({ ...state, loading: false });
    // }, [data]);


    useEffect(() => {
        document.title = 'Intergas | Generador factura';
        getData();
        console.log(data.idEmpresa);
    }, []);

    useEffect(() => {
        data.MetodoPago !== 0 && setState({ ...state, loading: false })
    }, [data.MetodoPago])


    // useEffect(() => {
    //     console.log('data', data)
    //     console.log('MetodosPagos', metodosPago)
    // }, [data, MetodosPagos])

    return (
        <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
            {state.loading && <div className='flex items-center justify-center h-screen w-screen'><LoadingDiv /></div>}

            {!state.loading && (
                <>
                    {exito ? (
                        <div className="h-full w-full">
                            <div className="flex w-full h-[75%] mt-7 justify-center">
                                <img src={Imagen} />
                            </div>
                            <div className="flex w-full h-[75%] justify-center text-center">
                                <p>Para ver facturas click en:&nbsp;
                                    <Link to='/Facturacion-consultas' className="text-blue-700 underline decoration-1">
                                        facturacion consultas
                                    </Link>
                                    <br />
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='relative h-[100%] overflow-auto sm:pb-28 md:pb-0'>
                            <div className='flex relative gap-6 sm:flex-col md:flex-row h-[90%]'>
                                <div className='flex flex-col gap-2 min-w-[20%]'>
                                    <div className='flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2'>
                                        <Tooltip title="Al dar click se regresara a factura remisiones">
                                            <Link to="/Facturacion-Remisiones" >
                                                <KeyboardReturnIcon />
                                            </Link>
                                        </Tooltip>
                                        {idFactura !== 0 && <div className='flex justify-between'> <span>Id Factura: </span> {idFactura}</div>}
                                        <div className='flex justify-between'> <span>Cliente: </span> {informacionGral.length > 0 && informacionGral[0].Cliente ? informacionGral[0].Cliente : "S/N Cliente"}</div>
                                        <div className='flex justify-between'> <span>RFC: </span> {informacionGral.length > 0 && informacionGral[0].RFC ? informacionGral[0].RFC : "S/N RFC"}</div>
                                        <div className='flex justify-between'> <span>Calle: </span>{informacionGral.length > 0 && informacionGral[0].calle ? informacionGral[0].calle : "S/N CALLE"} </div>
                                        <div className='flex justify-between'> <span>No Exterior: </span># {informacionGral.length > 0 && informacionGral[0].NExterior ? informacionGral[0].NExterior : "S/N N° EXTERIOR"}</div>
                                        <div className='flex justify-between'> <span>No Interior: </span># {informacionGral.length > 0 && informacionGral[0].NExterior ? informacionGral[0].NExterior : "S/N N° EXTERIOR"} </div>
                                        <div className='flex justify-between'> <span>Pais: </span> {informacionGral.length > 0 && informacionGral[0].pais ? informacionGral[0].pais : "S/N PAIS"} </div>
                                        <div className='flex justify-between'> <span>Estado: </span>{informacionGral[0]?.Estado ? informacionGral[0].Estado : "."} </div>
                                        <div className='flex justify-between'> <span>Tipo de Remision: </span>{facturacion.location} </div>
                                        <div className='flex justify-between'> <span>CP: </span>{informacionGral[0]?.codigoPostal ? informacionGral[0].codigoPostal : "."} </div>
                                    </div>
                                    <div className='flex flex-col rounded-lg gap-2'>
                                        <div className='flex flex-col shadow-md px-3  pb-4 border-2  rounded-xl'>



                                            <div class="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-2">
                                                <SelectComp
                                                    label="No. Serie"
                                                    options={folios}
                                                    value={data.Folio}
                                                    onChangeFunc={(newValue) => setData({ ...data, Folio: newValue, })}
                                                    data="folios_serie"
                                                    valueKey="folios_idFolios"
                                                />
                                                <TextInput
                                                    label="Fecha"
                                                    type="date"
                                                    className="block w-full texts"
                                                    value={data.fecha || new Date().toISOString().split('T')[0]}
                                                    min="2012-01-01T00:00"
                                                    onChange={(e) => { setData({ ...data, fecha: e.target.value }) }}
                                                />
                                            </div>
                                            {/* <SelectComp
                                                label="IVA"
                                                options={impuestos}
                                                value={data.iva || ''}
                                                data="catalogoImpuestoSAT_descripcion"
                                                valueKey="catalogoImpuestoSAT_id"
                                                onChangeFunc={(newValue) => { setData({ ...data, iva: newValue }); }}
                                                disabled={true}
                                            /> */}

                                            <SelectComp
                                                label="Tipo de venta"
                                                options={metodosPago}
                                                value={data.MetodoPago}
                                                onChangeFunc={(newValue) => setData({ ...data, MetodoPago: newValue })}
                                                data="catalogoMetodoPagoSAT_descripcion"
                                                valueKey="catalogoMetodoPagoSAT_id"
                                                disabled={data.MetodoPago !== 0}
                                            />
                                            {/* 
                                            <SelectComp
                                                label="Forma de pago"
                                                options={formaspago}
                                                value={data.FormaPago}
                                                onChangeFunc={(newValue) =>
                                                    setData({
                                                        ...data,
                                                        FormaPago: newValue, // Convierte el valor a cadena utilizando toString()
                                                    })
                                                }
                                                data="formasPago_descripcion"
                                                valueKey="formasPago_idFormasPago"
                                            /> */}

                                            <SelectComp
                                                label="Forma de pago"
                                                options={formaspago}
                                                value={data.FormaPago}
                                                onChangeFunc={(newValue) => {
                                                    // Encuentra la forma de pago seleccionada en el estado
                                                    const formaPagoSeleccionada = formaspago.find(formaPago => formaPago.formasPago_idFormasPago === newValue);
                                                    console.log("formaPagoSeleccionada", formaPagoSeleccionada)

                                                    // Si se encuentra la forma de pago seleccionada, actualiza el estado con la información relevante
                                                    if (formaPagoSeleccionada) {
                                                        setStateBancarizado({ ...stateBancarizado, bancarizado: formaPagoSeleccionada.bancarizado == 1 });
                                                        setData({
                                                            ...data,
                                                            FormaPago: newValue.toString(), // Convierte el valor a cadena utilizando toString()
                                                        });
                                                    }
                                                }}
                                                data="formasPago_descripcion"
                                                valueKey="formasPago_idFormasPago"
                                            />


                                            <SelectComp
                                                label="Empresa"
                                                options={empresas}
                                                value={data.idEmpresa}
                                                onChangeFunc={(newValue) => {
                                                    setData({ ...data, idEmpresa: newValue });
                                                    console.log("Nuevo valor de ID de empresa:", newValue); // Agregamos el console.log aquí
                                                }}
                                                data="empresa_razonComercial"
                                                valueKey="empresa_idEmpresa"
                                            />

                                        </div>
                                    </div>


                                    {idFactura !== 0 && (
                                        <>
                                            <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2"
                                                onClick={Abrirmodalcorreo}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2c3a78'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#1B2654'}>
                                                <span className="flex justify-between items-center">
                                                    <span >Enviar facturas</span> <EmailIcon />
                                                </span>
                                            </div>
                                            <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2"
                                                onClick={(e) => { BuscarPdf(idFactura, "NORMAL") }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2c3a78'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#1B2654'}>
                                                <span className="flex justify-between items-center">
                                                    <span >Imprimir</span> <EmailIcon />
                                                </span>
                                            </div>
                                            <div className="flex flex-col shadow-md bg-[#FC4C02] border-2 p-4 rounded-xl text-white text-[12px] gap-2"
                                                onClick={() => { BuscarPdf(idFactura, "NORMAL"); Abrirmodalcorreo(); }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(252,76,2,0.8)'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#FC4C02'}>
                                                <span className="flex justify-between items-center">
                                                    <span>Imprimir y enviar facturas</span>
                                                    <EmailIcon />
                                                </span>
                                            </div>
                                        </>
                                    )}



                                </div>
                                <div className='relative flex flex-col h-[100%] gap-3'>
                                    <div className="col-span-1 lg:col-span-2 w-full  monitor-table virtualTable" >

                                        <Datatable
                                            data={informacionGral}
                                            virtual={true}
                                            searcher={false}
                                            columns={[
                                                { header: "Remision", accessor: "remision" },
                                                { header: "Cliente", accessor: "Cliente" },
                                                { header: "Estacion_PCRE", accessor: "Estacion_PCRE" },
                                                { header: "Tipo Venta", accessor: "TipoVenta" },
                                                { header: "Forma Pago", accessor: "FormaPago" },
                                                { header: "Precio", cell: (row) => parseFloat(row.item.precios).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                                { header: "Cantidad", cell: (row) => parseFloat(row.item.Cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                                { header: "Bonificacion", cell: (row) => parseFloat(row.item.descuento).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                                {
                                                    header: "IVA",
                                                    cell: (row) => {
                                                        // Verificar si la propiedad 'forma' es igual a 3
                                                        if (location.state.item.forma === 3) {
                                                            // Si 'forma' es igual a 3, leer la propiedad 'ivaRemisionDividida'
                                                            return parseFloat(row.item.ivaRemisionDividida).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                        } else {
                                                            // Si 'forma' no es igual a 3, leer la propiedad 'iva'
                                                            return parseFloat(row.item.iva).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                        }
                                                    }
                                                },
                                                { header: "Importe", cell: (row) => parseFloat(row.item.precios * row.item.Cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                                location.state.item.forma === 3 && {
                                                    header: "Subtotal",
                                                    cell: (row) => {
                                                        const subtotal = row.item.precios * row.item.Cantidad;
                                                        return parseFloat(subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                    }
                                                },
                                                location.state.item.forma === 3 && {
                                                    header: "Total",
                                                    cell: (row) => parseFloat(row.item.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                },

                                            ].filter(Boolean)}


                                        />
                                    </div>

                                    <div className="flex relative h-[15%] gap-3 sm:flex-col md:flex-row">
                                        <textarea id="OrderNotes" className=" w-full h-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm md:min-w-[35%]" rows="7" placeholder="Observaciones" value={data.observaciones} onChange={(event) => setData({ ...data, observaciones: event.target.value })} ></textarea>


                                        <button className={`flex flex-col justify-center items-center shadow-md bg-[#1B2654] border-2 p-7 rounded-xl text-white text-[17px] gap-2`} onClick={() => { EnviarFacturas(1); Abrirmodalcorreo(); }} style={{ backgroundColor: idFactura === 0 ? 'rgb(255, 140, 0)' : 'gray' }}
                                            disabled={idFactura !== 0}
                                        >
                                            GUARDAR
                                        </button>
                                        <button className={`flex flex-col justify-center items-center shadow-md  border-2 p-7 rounded-xl text-white text-[17px] gap-2`} onClick={() => { EnviarFacturas(2); }} style={{ backgroundColor: idFactura === 0 ? '#1B2654' : 'gray' }}
                                        //disabled={idFactura !== 0}
                                        >

                                            TIMBRAR
                                        </button>

                                        {location.state.item.forma !== 3 && (
                                            <div className="flex flex-col w-full justify-center shadow-md bg-[#1B2654] border-2 px-4 rounded-xl text-white text-[12px] gap-1">
                                                <br />
                                                {renderTotalItem('Subtotal', totalesfinales.subtotal)}
                                                {renderTotalItem('Descuento', totalesfinales.descuento)}
                                                {renderTotalItem('IVA', totalesfinales.iva)}
                                                {renderTotalItem('Total', totalesfinales.total)}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Dialog open={detalle} style={{ height: '100%' }} onClose={() => { setDetalle(false); }} maxWidth="lg" >
                        <Email facturacion={facturacion} cliente={cliente} />

                    </Dialog >
                </>
            )
            }
        </div >
    );
    function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };
}

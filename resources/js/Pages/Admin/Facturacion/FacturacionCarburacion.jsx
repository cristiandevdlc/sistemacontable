import LoadingDiv from '@/components/LoadingDiv';
import { useState, useEffect } from 'react';
import TextInput from "@/components/TextInput";
import SelectComp from '@/components/SelectComp';
import Datatable from "@/components/Datatable";
import { Button, Dialog, Tooltip } from '@mui/material'
import { EditNote, DeleteSweep, Add, Description, Email, Print } from '@mui/icons-material';
import request, { noty, regex } from '@/utils';
import InformacionFactura from './InformacionFactura'; // Asegúrate de importar correctamente el componente InformacionFactura desde su ubicación real
import DialogEmail from './Email'; // Asegúrate de importar correctamente el componente InformacionFactura desde su ubicación real
import { fetchClientes, fetchProductos, fetchFolioCarburacion, fetchEstaciones, fetchFormaPago, fetchImpuestos, fetchMetodoPago, fetchZonas } from "./petions.js";

export default function FacturacionCarburacion() {
    const renderTotalItem = (label, value) => { return (<div className='flex w-full justify-between' style={{ paddingBottom: '10px' }}> <span>{label}:</span> <span>$ {value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span> </div>); };

    const [state, setState] = useState({ loading: true, state2: false, metodo: false, detalle: false, permiso: false, exito: false })
    const [requests, setRequests] = useState({ Impuestos: [], Zonas: [], Estaciones: [], FormaPago: [], MetodoPago: [], Productos: [], Clientes: [], Folios: [] })
    const [idCounter, setIdCounter] = useState(1);
    const [tabla, settabla] = useState([]);
    const [cliente, setcliente] = useState({ id: "", nombre: "", rfc: "", cp: "", tipoventa: "", telefono: "", cfdi: "", cfdiname: "", DomicilioFiscalReceptor: "", RegimenFiscal: "", cfdid: "", RegimenFiscal_Clave: "", descuento: 0, id: "", calle: "", colonia: "", numeroe: "", numeroi: "", pais: "", estado: "", ciudad: "", localidad: "", formapago: "", formapagoname: "", CP: "" });
    const [conceptos, setconceptos] = useState({ Id: "", Remision: "",Producto_Id: "",ProductoCodigo: "",ProductoNombre: "",Precio: 0,PrecioLitro: 0,Cantidad: 1,Descuento: 0,UnidadClave: "",UnidadNombre: "",Estacion_Id: "",Estacion_Nombre: "", IVA: 0,Importe: 0, ImporteL: 0});

    const fechaHoy = new Date();
    const fechaFormateada = `${fechaHoy.getFullYear()}-${(fechaHoy.getMonth() + 1).toString().padStart(2, '0')}-${fechaHoy.getDate().toString().padStart(2, '0')}`;
    const [totalesfinales, settotalesfinales] = useState({ descuento: 0, iva: 0, total: 0, subtotal: 0, subtotalitros: 0 });
    const [options, setoptions] = useState({ metodopago: 2, formapago: 0, iva: 0, fecha: fechaFormateada, folio: 0, observaciones: "S/N OBSERVACIONES", correos: [], zona: "", tipos: "NORMAL", RutaXml: "", serie: 0 });


    const Correo = async () => {
        setState({ ...state, loading: true, detalle: false });
        try { const respuesta = await CorreoFactura(options, "NORMAL"); setState({ ...state, loading: false }); showNotification(respuesta, 'success', 'metroui', 'bottomRight', 2000); } catch (error) { setState({ ...state, loading: false }); showNotification('Fallo al enviar correo', 'error', 'metroui', 'bottomRight', 2000); }
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

    const GenerarYEnviarXML = async () => {
        LimpiarRow();
        setState({ ...state, metodo: false, loading: true });
        const Facturaciones = {
            ClienteId: cliente.id,
            MetodoPagoId: options.metodopago,
            FormaPagoId: options.formapago,
            Folio: options.folio,
            Fecha: options.fecha,
            Observaciones: options.observaciones,
            ImpuestoId: options.iva,
            Subtotal: totalesfinales.subtotalitros,
            IVA: totalesfinales.iva,
            Total: totalesfinales.total,
            Descuento: totalesfinales.descuento,
            Serie: options.serie,
        };

        const response = await fetch(route('GenerarFacturacionCarburacion'), { method: "POST", body: JSON.stringify({ Facturaciones: Facturaciones, Conceptos: tabla }), headers: { "Content-Type": "application/json" } });
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        const isPDF = contentDispositionHeader && contentDispositionHeader.includes('pdf');
        if (isPDF) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = Object.assign(document.createElement('a'), { href: url, download: `Factura_${Date.now()}.pdf` });
            document.body.appendChild(a).click(), setTimeout(() => document.body.removeChild(a), 1000);
            const datosAdicionales = response.headers.get('X-Datos-Adicionales');
            if (datosAdicionales) {
                const datos = JSON.parse(datosAdicionales);
                setoptions({ ...options, folio: datos.facturacion.factura_idFactura, RutaXml: datos.rutaArchivoXml });
            }
            setState({ ...state, detalle: true, loading: false });

        } else {
            const dataMun = await response.text(); // Obtener el JSON de la respuesta
            new Noty({ text: dataMun, type: "error", theme: "metroui", layout: "bottomRight", timeout: 50000 }).show();
            setState({ ...state, loading: false });
        }

    };



    const LimpiarTabla = () => {
        settabla([]);
        settotalesfinales({ descuento: 0, iva: 0, total: 0, subtotal: 0, subtotalitros: 0 });
        LimpiarRow();
        setoptions({ metodopago: options.metodopago, formapago: options.formapago, iva: options.iva, fecha: fechaFormateada, folio: 0, observaciones: "S/N OBSERVACIONES", correos: [], zona: options.zona, tipos: "NORMAL", RutaXml: "", serie: options.serie });
        showNotification('Se ha limpiado la tabla de conceptos', 'success', 'metroui', 'bottomRight', 2000);
    };


    const LimpiarRow = () => {
        setconceptos({
            Id: "",
            Remision: "",
            Producto_Id: "",
            ProductoCodigo: "",
            ProductoNombre: "",
            Precio: 0,
            PrecioLitro: 0,
            Cantidad: 1,
            Descuento: 0,

            UnidadClave: "",
            UnidadNombre: "",
            Estacion_Id: conceptos.Estacion_Id,
            Estacion_Nombre: conceptos.Estacion_Nombre,
            IVA: 0,
            Importe: 0,
        })
    };

    const ProductoDetalle = async (e) => {
        const productoEncontrada = requests.Productos.find(producto => producto.producto_idProducto === conceptos.Producto_Id);
        try {
            const response = await fetch(route('ConvertirLitros'), { method: "POST", body: JSON.stringify({ Fecha: options.fecha, Zona: Number(options.zona), Producto: Number(conceptos.Producto_Id), Cantidad: Number(conceptos.Cantidad), Descuento: Number(cliente.descuento * conceptos.Cantidad) }), headers: { "Content-Type": "application/json" } });
            if (response.ok) {
                const data = await response.json();
                setconceptos({
                    ...conceptos,
                    Id: conceptos.Id,
                    Remision: conceptos.Remision,
                    ProductoCodigo: data.productoFactura_codigo,
                    ProductoNombre: data.producto_nombre,
                    ClaveProd: productoEncontrada.conceptos.conceptosProductosSAT_clave,
                    Precio: data.preciounitario,
                    PrecioLitro: data.preciounitario,
                    CantidadLitro: data.cantidad,
                    Descuento: data.descuentosiniva,
                    UnidadClave: data.unidadMedida_clave,
                    UnidadNombre: data.unidadMedida_nombre,
                    Unidad_Id: data.unidadMedida_idUnidadMedida,
                    Estacion_Id: conceptos.Estacion_Id,
                    Estacion_Nombre: conceptos.Estacion_Nombre,
                    IVA: data.IVA,
                    ImporteL: data.preciounitario * data.cantidad,
                    Importe: data.preciounitario * conceptos.Cantidad,
                });
            } else {
                showNotification("Fallo la peticion", 'error', 'metroui', 'bottomRight', 2000);
            }
        } catch (error) {
            console.error(error.message);
        }
    };



    const SeleccionarRow = (row) => {
        const rowencontrado = tabla.find(tabla => tabla.Id === row);
        setconceptos({
            Id: rowencontrado.Id,
            Remision: rowencontrado.Remision,
            Producto_Id: rowencontrado.Producto_Id,
            ProductoCodigo: rowencontrado.ProductoCodigo,
            ProductoNombre: rowencontrado.ProductoNombre,
            Precio: rowencontrado.Precio,
            PrecioLitro: rowencontrado.PrecioLitro,
            Cantidad: rowencontrado.Cantidad,
            Descuento: rowencontrado.Descuento,
            CantidadLitro: rowencontrado.CantidadLitro,
            ClaveProd: rowencontrado.ClaveProd,
            UnidadClave: rowencontrado.UnidadClave,
            UnidadNombre: rowencontrado.UnidadNombre,
            Unidad_Id: rowencontrado.Unidad_Id,
            Estacion_Id: rowencontrado.Estacion_Id,
            Estacion_Nombre: "",
            IVA: rowencontrado.IVA,
            Importe: rowencontrado.Importe,
            ImporteL: rowencontrado.ImporteL,
        });
        setState({ ...state, metodo: true });
    };


    const AgregarConcepto = () => {

        const estacionEncontrada = requests.Estaciones.find(estacion => estacion.estacion_idEstacion === conceptos.Estacion_Id);
        if (estacionEncontrada) {

            const newConcepto = {
                Id: idCounter,
                Remision: conceptos.Remision,
                Producto_Id: conceptos.Producto_Id,
                ProductoCodigo: conceptos.ProductoCodigo,
                ProductoNombre: conceptos.ProductoNombre,
                Precio: parseFloat(conceptos.Precio),
                PrecioLitro: parseFloat(conceptos.PrecioLitro),
                Cantidad: conceptos.Cantidad,
                CantidadLitro: conceptos.CantidadLitro,
                ClaveProd: conceptos.ClaveProd,
                Descuento: parseFloat(conceptos.Descuento),
                Unidad_Id: conceptos.Unidad_Id,
                UnidadClave: conceptos.UnidadClave,
                UnidadNombre: conceptos.UnidadNombre,
                Estacion_Id: conceptos.Estacion_Id,
                Estacion_Nombre: estacionEncontrada.estacion_nombre,
                IVA: parseFloat(conceptos.IVA),
                Importe: parseFloat(conceptos.Importe),
                ImporteL: parseFloat(conceptos.ImporteL),

            };


            settabla((prevTabla) => [...prevTabla, newConcepto]);
            const subtotal = totalesfinales.subtotal + newConcepto.Importe;
            const subtotalL = totalesfinales.subtotal + newConcepto.ImporteL;
            const descuento = totalesfinales.descuento + parseFloat(newConcepto.Descuento);
            const iva = totalesfinales.iva + newConcepto.IVA;
            const total = (subtotal - descuento) + iva;
            const nuevosTotales = { descuento: descuento, iva: iva, total: total, subtotal: subtotal, subtotalitros: subtotalL };
            settotalesfinales(nuevosTotales);
            LimpiarRow();
            setIdCounter(idCounter + 1);
            showNotification('Se ha agregado con exito', 'success', 'metroui', 'bottomRight', 2000);
        } else {
            showNotification('Faltaron campos de rellenar', 'error', 'metroui', 'bottomRight', 2000);
        }
    };


    const EditarConcepto = () => {


        const datoEncontrado = tabla.find(item => item.Id === conceptos.Id);
        if (datoEncontrado) {
            const estacionEncontrada = requests.Estaciones.find(estacion => estacion.estacion_idEstacion === conceptos.Estacion_Id);
            const conceptoEditado = {
                Id: conceptos.Id,
                Remision: conceptos.Remision,
                Producto_Id: conceptos.Producto_Id,
                ProductoCodigo: conceptos.ProductoCodigo,
                ProductoNombre: conceptos.ProductoNombre,
                Precio: parseFloat(conceptos.Precio),
                PrecioLitro: parseFloat(conceptos.PrecioLitro),
                Cantidad: conceptos.Cantidad,
                CantidadLitro: conceptos.CantidadLitro,
                ClaveProd: conceptos.ClaveProd,
                Descuento: parseFloat(conceptos.Descuento),
                Unidad_Id: conceptos.Unidad_Id,
                UnidadClave: conceptos.UnidadClave,
                UnidadNombre: conceptos.UnidadNombre,
                Estacion_Id: conceptos.Estacion_Id,
                Estacion_Nombre: estacionEncontrada.estacion_nombre,
                IVA: parseFloat(conceptos.IVA),
                Importe: parseFloat(conceptos.Importe),
            };
            const indiceConceptoEditado = tabla.findIndex(item => item.Id === conceptos.Id);
            const nuevaTabla = [...tabla];
            nuevaTabla[indiceConceptoEditado] = conceptoEditado;
            settabla(nuevaTabla);
            const subtotal = nuevaTabla.reduce((acumulador, objeto) => acumulador + (objeto.Importe || 0), 0);
            const descuento = nuevaTabla.reduce((acumulador, objeto) => acumulador + (objeto.Descuento || 0), 0);
            const IvaTotal = nuevaTabla.reduce((acumulador, objeto) => acumulador + (objeto.IVA || 0), 0);
            const total = subtotal - descuento + IvaTotal;
            const nuevosTotales = { ...totalesfinales, subtotal: subtotal, descuento: descuento, total: total, iva: IvaTotal };
            settotalesfinales(nuevosTotales);
            LimpiarRow();
            setState({ ...state, metodo: false });
            showNotification('Se edito con exito el concepto', 'info', 'metroui', 'bottomRight', 2000);
        } else {
            showNotification('No se pudo editar el concepto', 'error', 'metroui', 'bottomRight', 2000);
        }
    };

    const EliminarConcepto = (idToRemove) => {
        const conceptoToRemove = tabla.find(concepto => concepto.Id === idToRemove);
        const subtotal = totalesfinales.subtotal - conceptoToRemove.Importe;
        const descuento = totalesfinales.descuento - conceptoToRemove.Descuento;
        const iva = totalesfinales.iva - conceptoToRemove.IVA;
        const total = subtotal + iva;
        const nuevosTotales = { descuento: descuento, iva: iva, total: total, subtotal: subtotal };
        settotalesfinales(nuevosTotales);
        showNotification('Se elimino con exito', 'success', 'metroui', 'bottomRight', 2000);

        settabla((prevTabla) => prevTabla.filter(concepto => concepto.Id !== idToRemove));
        if (tabla && typeof tabla === 'object' && Object.keys(tabla).length == 1) {
            console.log("Tabla tiene al menos un objeto. Llamando a LimpiarRow...");
            LimpiarRow();
            setState({ ...state, metodo: false });
        } else {
            console.log("Tabla está vacía o no es un objeto.");
        }
    };



    const Busquedacliente = async (e) => {
        setState({ ...state, loading: true });
        const clienteEncontrado = requests.Clientes.find(cliente => cliente.cliente_idCliente === Number(e));
        if (clienteEncontrado) {
            setState({ ...state, loading: false });
            const { cliente_nombrecomercial, cliente_rfc, cliente_codigoPostal, cliente_telefono, uso_cfdi_sat, cliente_calle, cliente_colonia, cliente_numeroExterior, cliente_numeroInterior, pais, estado, cliente_ciudad, cliente_localidad, forma_pago, cliente_tieneCredito, regimen_fiscal, cliente_descuento, cliente } = clienteEncontrado;
            setcliente({ id: e, nombre: cliente_nombrecomercial, rfc: cliente_rfc, cp: cliente_codigoPostal, telefono: cliente_telefono, cfdi: uso_cfdi_sat.usoCfdiSAT_clave, descuento: cliente_descuento, cfdid: uso_cfdi_sat.usoCfdiSAT_id, cfdiname: uso_cfdi_sat.usoCfdiSAT_descripcion, DomicilioFiscalReceptor: cliente_codigoPostal, RegimenFiscal_Clave: regimen_fiscal.catalogoRegimenFiscalSAT_clave, RegimenFiscal: regimen_fiscal.catalogoRegimenFiscalSAT_id, calle: cliente_calle, colonia: clienteEncontrado.colonia[0].Colonia_Nombre, numeroe: cliente_numeroExterior, numeroi: cliente_numeroInterior, pais: pais.descripcionPais, estado: estado.descripcionEstado, ciudad: cliente_ciudad, localidad: cliente_localidad, CP: cliente_codigoPostal, formapago: forma_pago.formasPago_idFormasPago, formapagoname: forma_pago.formasPago_descripcion });

            if (cliente_tieneCredito == 1) {
                setoptions({ ...options, metodopago: 1, formapago: forma_pago.formasPago_idFormasPago });
                setState({ ...state, permiso: true });
            } else {
                setoptions({ ...options, metodopago: "2", formapago: forma_pago.formasPago_idFormasPago });
                setState({ ...state, permiso: false });
            }
        } else {
            setState({ ...state, loading: false });
        }
    };




    const getAll = async () => {
        const clientesData = await fetchClientes();
        const productosData = await fetchProductos();
        const foliosData = await fetchFolioCarburacion();
        const estacionesData = await fetchEstaciones();
        const formaPagoData = await fetchFormaPago();
        const ImpuestosData = await fetchImpuestos();
        const MetodosData = await fetchMetodoPago();
        const ZonasData = await fetchZonas();


        const impuestosFiltrados = ImpuestosData.filter(impuesto => impuesto.catalogoImpuestoSAT_descripcion === "IVA 16%");
        setoptions(prevState => ({ ...prevState, iva: impuestosFiltrados[0].catalogoImpuestoSAT_id, zona: ZonasData[0].zona_idZona,serie: foliosData.folios_idFolios}));
        setRequests({ ...requests, Impuestos: ImpuestosData,  Clientes: clientesData, Productos: productosData,  Folios: foliosData, Estaciones: estacionesData,FormaPago: formaPagoData,MetodoPago: MetodosData, Zonas: ZonasData});
    };

    const CambioPrecio = async (e) => {
        const nuevaTabla = [...tabla];
        for (const elemento of nuevaTabla) {



            const response = await fetch(route('ConvertirLitros'), { method: "POST", body: JSON.stringify({ Fecha: options.fecha, Zona: Number(options.zona), Producto: Number(elemento.Producto_Id), Cantidad: Number(elemento.Cantidad), Descuento: Number(cliente.descuento * elemento.Cantidad) }), headers: { "Content-Type": "application/json" } });
            if (response.ok) {

                const dataMun = await response.json();
                elemento.Precio = parseFloat(dataMun.preciounitario);
                elemento.PrecioLitro = parseFloat(dataMun.preciounitario);
                elemento.CantidadLitro = parseFloat(dataMun.cantidad);
                elemento.Descuento = parseFloat(dataMun.importedescuento);
                elemento.Importe = parseFloat(dataMun.importe);
                elemento.IVA = parseFloat(dataMun.IVA);
            } else {
                showNotification("Error en cambiar precios en la tabla por zona", 'error', 'metroui', 'bottomRight', 2000);
            }
        }
        const subtotal = nuevaTabla.reduce((acumulador, objeto) => acumulador + (objeto.Importe || 0), 0);
        const descuento = nuevaTabla.reduce((acumulador, objeto) => acumulador + (objeto.Descuento || 0), 0);
        const IvaTotal = nuevaTabla.reduce((acumulador, objeto) => acumulador + (objeto.IVA || 0), 0);
        const total = subtotal - descuento + IvaTotal;
        const nuevosTotales = { ...totalesfinales, subtotal: subtotal, descuento: descuento, total: total, iva: IvaTotal };
        settotalesfinales(nuevosTotales);
        settabla(nuevaTabla);
    }



    useEffect(() => {
        document.title = 'Intergas | Facturacion Carburacion';
        getAll().then(() => setState({ loading: false }))
    }, [])

    useEffect(() => {
        ProductoDetalle();
    }, [conceptos.Cantidad, conceptos.Producto_Id]);


    const stylebuttons = { textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', paddingLeft: '10px', paddingRight: '10px', color: 'white', textTransform: 'none', };

    useEffect(() => {
        CambioPrecio();
    }, [options.zona]);


    return (

        <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
            {state.loading && <div className='flex items-center justify-center h-screen w-screen'> <LoadingDiv /> </div>}
            {!state.loading &&
                <>

                    <div className="flex flex-col h-[92vh] overflow-y-auto sm:max-w-[100%] md:max-w-[18%] w-full blue-scroll gap-3 px-1 pb-2">
                        <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                            <SelectComp
                                label="Nombre del cliente"
                                options={requests.Clientes}
                                value={cliente.id}
                                onChangeFunc={(newValue) => { setcliente({ ...cliente, id: newValue }); Busquedacliente(newValue); }}
                                data="cliente_razonsocial"
                                valueKey="cliente_idCliente"
                                disabled={options.folio !== 0}

                            />
                        </div>

                        <InformacionFactura facturacion={options} cliente={cliente} />

                        <div className='flex flex-col shadow-md px-3 pt-1 pb-4 border-2  rounded-xl'>
                            <SelectComp
                                label="Zona"
                                options={requests.Zonas}
                                value={options.zona || ""}
                                onChangeFunc={(e) => { setoptions({ ...options, zona: e }); }}
                                data="zona_descripcion"
                                valueKey="zona_idZona"
                                disabled={options.folio !== 0}

                            />
                            <div class="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-2">
                                <TextInput
                                    label="No. Serie"
                                    type="text"
                                    value="C"
                                    disabled={true}
                                />
                                <TextInput
                                    label="N* Folio"
                                    type="text"
                                    value={options.serie}
                                    disabled={true}
                                />
                            </div>

                            <TextInput
                                label="Fecha"
                                type="date"
                                className="block w-full texts"
                                value={options.fecha || fechaFormateada}
                                min="2012-01-01" // Puedes establecer un mínimo si es necesario
                                onChange={(e) => { setoptions({ ...options, fecha: e.target.value }) }}
                                disabled={options.folio !== 0}
                            />
                            <SelectComp
                                label="Impuesto"
                                options={requests.Impuestos}
                                value={options.iva}
                                onChangeFunc={(newValue) => { setoptions({ ...options, iva: newValue }); }}
                                data="catalogoImpuestoSAT_descripcion"
                                valueKey="catalogoImpuestoSAT_id"
                                disabled={true}

                            />
                            <SelectComp
                                label="Forma de pago"
                                options={requests.FormaPago}
                                value={options.formapago}
                                onChangeFunc={(newValue) => { setoptions({ ...options, formapago: newValue }); }}
                                data="formasPago_descripcion"
                                valueKey="formasPago_idFormasPago"
                                disabled={options.folio !== 0}

                            />

                            <SelectComp
                                label="Tipo de venta"
                                options={requests.MetodoPago}
                                value={options.metodopago || ""}
                                onChangeFunc={(newValue) => { setoptions({ ...options, metodopago: newValue }); }}
                                data="catalogoMetodoPagoSAT_descripcion"
                                valueKey="catalogoMetodoPagoSAT_id"
                                disabled={!state.permiso}
                            />
                        </div>
                    </div>

                    {options.folio == 0 && (
                        <div className="max-w-[18%] w-full">

                            <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                                <TextInput
                                    label="Remision"
                                    type="text"
                                    value={conceptos.Remision}
                                    onChange={(e) => !isNaN(parseFloat(e.target.value)) && e.target.value >= 0 && setconceptos({ ...conceptos, Remision: parseFloat(e.target.value) })}
                                />
                                <SelectComp
                                    label="Productos"
                                    options={requests.Productos}
                                    value={conceptos.Producto_Id || ''}
                                    data="producto_nombre"
                                    valueKey="producto_idProducto"
                                    onChangeFunc={(e) => { setconceptos({ ...conceptos, Producto_Id: e }); }}
                                />


                                <TextInput
                                    label="Cantidad"
                                    type="decimal"
                                    value={conceptos.Cantidad}
                                    onChange={(e) => !isNaN(parseFloat(e.target.value)) && e.target.value >= 0 && setconceptos({ ...conceptos, Cantidad: parseFloat(e.target.value) })}
                                />

                                <TextInput
                                    label="Precio Unitario"
                                    type="decimal"
                                    value={conceptos.Precio || 0}
                                    onChange={(e) => !isNaN(parseFloat(e.target.value)) && e.target.value >= 0 && setconceptos({ ...conceptos, Precio: parseFloat(e.target.value) })}
                                    disabled={true}
                                />



                                <TextInput
                                    label="Descuento"
                                    type="decimal"
                                    value={cliente.descuento}
                                    onChange={(e) => !isNaN(parseFloat(e.target.value)) && e.target.value >= 0 && setcliente({ ...cliente, descuento: parseFloat(e.target.value) })}
                                    disabled={true}
                                />

                                <TextInput
                                    label="Importe"
                                    type="decimal"
                                    value={conceptos.Importe || 0}
                                    onChange={(e) => !isNaN(parseFloat(e.target.value)) && e.target.value >= 0 && setconceptos({ ...conceptos, Importe: parseFloat(e.target.value) })}
                                    disabled={true}
                                />

                                <SelectComp
                                    label="Estacion"
                                    options={requests.Estaciones}
                                    value={conceptos.Estacion_Id || ""}
                                    onChangeFunc={(e) => { setconceptos({ ...conceptos, Estacion_Id: e }); }}
                                    data="estacion_nombre"
                                    valueKey="estacion_idEstacion"
                                />

                                <div className='flex flex-col text-white gap-2 pt-4'>
                                    <Button endIcon={state.metodo ? <EditNote /> : <Add />} style={{ ...stylebuttons, backgroundColor: '#FC4C02' }} onClick={(e) => { state.metodo ? EditarConcepto() : AgregarConcepto(); }} disabled={options.folio !== 0} >
                                        {state.metodo ? 'Editar' : 'Agregar concepto'}
                                    </Button>

                                    <Button style={{ ...stylebuttons, backgroundColor: '#036cf5' }} endIcon={<DeleteSweep />} onClick={(e) => { LimpiarRow(); setState({ ...state, metodo: false }); }} >
                                        Limpiar
                                    </Button>

                                    <Button endIcon={<Description />} style={{ ...stylebuttons, backgroundColor: options.folio !== 0 || Object.keys(tabla).length === 0 ? 'gray' : '#1B2654' }} onClick={(e) => { GenerarYEnviarXML() }} disabled={!tabla || Object.keys(tabla).length === 0 || options.folio !== 0}>
                                        Facturar conceptos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}


                    <div className='flex flex-col w-full gap-4 items-stretch'>
                        <div className="w-full flex justify-end gap-4">
                            {options.folio !== 0 && (
                                <>
                                    <Button variant="contained" endIcon={<Email />} style={{ fontWeight: 'bold', backgroundColor: '#1B2654', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }} onClick={() => setState({ ...state, detalle: true })} >Enviar factura</Button>
                                    <Button variant="contained"  endIcon={<Print />} style={{ fontWeight: 'bold', backgroundColor: 'red', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }} onClick={(e) => { BuscarPdf(options.folio, "NORMAL") }} >Imprimir</Button>
                                </>
                            )}
                            {tabla.length > 0 && (
                                <Button variant="contained" endIcon={<DeleteSweep />} style={{fontWeight: 'bold', backgroundColor: '#036cf5', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }} onClick={(e) => { LimpiarTabla() }} >LIMPIAR TABLA</Button>
                            )}
                        </div>
                        <div className="w-full  monitor-table" >

                            <Datatable
                                data={tabla}
                                searcher={false}
                                columns={[
                                    {
                                        header: "Conceptos de carburacion",
                                        accessor: "Estatus",
                                        width: '50%',
                                        cell: (eprops) => (
                                            <>
                                                <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-2">
                                                    <div class="h-35 rounded-lg bg-white-200 lg:col-span-3" style={{ background: '#1B2654', color: 'white' }}>
                                                        <div className="grid grid-cols-2 gap-2 lg:grid-cols-6" style={{ padding: '2%', textAlign: 'left', position: 'relative' }}>
                                                            <InfoItem label="Remision" value={eprops.item.Remision ? eprops.item.Remision : "S/N Remision"} />
                                                            <InfoItem label="Producto" value={eprops.item.ProductoNombre ? eprops.item.ProductoNombre : "S/N Concepto"} />

                                                            <InfoItem label="Unidad de medida" value={eprops.item.UnidadNombre} />
                                                            <InfoItem label="Estacion" value={eprops.item.Estacion_Nombre} />
                                                            <InfoItem label="Descuento" value={eprops.item.Descuento ? `$ ${parseFloat(eprops.item.Descuento).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "0.00"} />
                                                            <InfoItem label="Precio" value={eprops.item.Precio ? `$ ${parseFloat(eprops.item.Precio).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "0.00"} />
                                                            <InfoItem label="Cantidad" value={eprops.item.Cantidad ? `$ ${parseFloat(eprops.item.Cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "0.00"} />
                                                            <InfoItem label="Cantidad Lts" value={eprops.item.CantidadLitro} />
                                                            <InfoItem label="Importe" value={eprops.item.Importe} />
                                                            <InfoItem label="Importe Lts" value={eprops.item.ImporteL} />
                                                            <InfoItem label="IVA " value={eprops.item.IVA ? `$ ${parseFloat(eprops.item.IVA).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N IVA Valor"} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ),
                                    },
                                    
                                    {
                                        header: "Acciones",
                                        accessor: "Acciones",
                                        width: '50%',
                                        cell: (eprops) => (
                                            <>
                                                <div className='grid grid-cols-2 gap-2 p-4'>
                                                    <Tooltip title={options.folio !== 0 ? "No se puede editar un concepto de una factura creada" : "Editar"}>
                                                        <span>
                                                            <button onClick={() => SeleccionarRow(eprops.item.Id)} style={{ color: '#ff0000', cursor: 'pointer' }} disabled={options.folio !== 0}><EditNote /> </button>
                                                        </span>
                                                    </Tooltip>

                                                    <Tooltip title={options.folio !== 0 ? "No se puede eliminar un concepto de una factura creada" : "Eliminar"}>
                                                        <span>
                                                            <button onClick={() => EliminarConcepto(eprops.item.Id)} disabled={options.folio !== 0}> <DeleteSweep /> </button>
                                                        </span>
                                                    </Tooltip>
                                                </div>

                                            </>
                                        ),
                                    },
                                ]}
                            />
                        </div>

                        <div className="flex gap-4">
                            <textarea
                                id="OrderNotes"
                                className="w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm md:min-w-[30%]"
                                rows="5"
                                value={options.observaciones || ""}
                                onChange={(e) => { setoptions({ ...options, observaciones: e.target.value }); }}
                            ></textarea>
                            <div className="flex flex-col w-full justify-center shadow-md bg-[#1B2654] border-2 px-4 rounded-xl text-white text-[12px] gap-1">
                                <br />
                                {renderTotalItem('Subtotal', totalesfinales.subtotal)}
                                {renderTotalItem('Descuento', totalesfinales.descuento)}
                                {renderTotalItem('IVA', totalesfinales.iva)}
                                {renderTotalItem('Total', totalesfinales.total)}
                            </div>
                        </div>
                    </div>
                </>
            }

            <Dialog open={state.detalle} style={{ height: '100%' }} onClose={() => { setState({ ...state, detalle: false }) }} maxWidth="lg" >
                <DialogEmail facturacion={options} cliente={cliente} />
            </Dialog >
        </div >
    )
    function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };
}

const InfoItem = ({ label, value }) => { return (<div> {label}: {value} </div>); };

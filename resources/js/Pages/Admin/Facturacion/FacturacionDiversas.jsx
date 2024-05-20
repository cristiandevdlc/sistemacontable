import LoadingDiv from '@/components/LoadingDiv';
import { useState, useEffect } from 'react';
import TextInput from "@/components/TextInput";
import SelectComp from '@/components/SelectComp';
import Datatable from "@/components/Datatable";
import { Button, Dialog, Checkbox, Chip, Tooltip, Divider } from '@mui/material'
import Imagen from './Factura.gif'
import request, { noty, regex } from '@/utils';
import InformacionFactura from './InformacionFactura'; // Asegúrate de importar correctamente el componente InformacionFactura desde su ubicación real
import DialogEmail from './Email'; // Asegúrate de importar correctamente el componente InformacionFactura desde su ubicación real
import { fetchClientes, fetchFolioDiversos, fetchFormaPago, fetchImpuestos, fetchMetodoPago, fetchunidades, fetchClaves } from "./petions.js";
import { EditNote, DeleteSweep, Add, Description, Email, Print } from '@mui/icons-material';
import { Options } from 'devextreme-react/autocomplete';

export default function FacturacionDiversas() {
    const [state, setState] = useState({ loading: true, state2: false, metodo: false, detalle: false, permiso: false, exito: false })
    const [requests, setRequests] = useState({ Impuestos: [], Unidades: [], Claves: [], FormaPago: [], MetodoPago: [], Clientes: [], Folios: [] })
    const [idCounter, setIdCounter] = useState(1);

    const [tabla, settabla] = useState([]);
    const [cliente, setcliente] = useState({ id: "", nombre: "", rfc: "", cp: "", tipoventa: "", telefono: "", cfdi: "", cfdiname: "", DomicilioFiscalReceptor: "", RegimenFiscal: "" });
    const [conceptos, setconceptos] = useState({ id: "", concepto: "", cantidad: 1, precio: 0, unidad: "", importe: 0, iva: 0, descripcion: "", descuento: 0, });
    const [totalesfinales, settotalesfinales] = useState({ descuento: 0, iva: 0, total: 0, subtotal: 0 });
    const [checkedCheckboxes, setCheckedCheckboxes] = useState({});
    const fechaHoy = new Date();
    const fechaFormateada = `${fechaHoy.getFullYear()}-${(fechaHoy.getMonth() + 1).toString().padStart(2, '0')}-${fechaHoy.getDate().toString().padStart(2, '0')}`;

    const [options, setoptions] = useState({ metodopago: 2, formapago: 0, iva: 0, fecha: fechaFormateada, folio: 0, observaciones: "S/N OBSERVACIONES", correos: [], tipos: "DIVERSO", RutaXml: "", serie: 0 });

    const [rowConcepto, setrowConcepto] = useState({ iva: 0, total: 0 });

    const stylebuttons = { textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', paddingLeft: '10px', paddingRight: '10px', color: 'white', textTransform: 'none', };

    const handleCheckboxChange = (itemId, isChecked) => { setCheckedCheckboxes((prevState) => ({ ...prevState, [itemId]: isChecked, })); };

    const handleRowClick = (row) => {
        const rowencontrado = tabla.find(tabla => tabla.id === row);
        setconceptos({ id: rowencontrado.id, concepto: rowencontrado.Concepto, cantidad: rowencontrado.Cantidad, precio: rowencontrado.Precio, unidad: rowencontrado.Unidad, importe: rowencontrado.Importe, iva: rowencontrado.IVAid, descripcion: rowencontrado.Descripcion, descuento: rowencontrado.Descuento, cfdi: rowencontrado?.uso_cfdi_sat?.usoCfdiSAT_clave ?? "" });
        setMetodo(true);
    };

    const GenerarYEnviarXML = async () => {
        if (options.formapago === undefined && options.formapago === 0) {
            showNotification("No esta seleccionado el Forma de pago", 'error', 'metroui', 'bottomRight', 5000); // Mostrar el mensaje de error en la interfaz de usuario

        }
        else if (options.metodopago === undefined && options.metodopago === 0) {
            showNotification("No esta seleccionado el Metodo de pago", 'error', 'metroui', 'bottomRight', 5000); // Mostrar el mensaje de error en la interfaz de usuario

        } else {
            LimpiarRow();
            setState({ ...state, loading: true });

            const Facturaciones = {
                ClienteId: cliente.id,
                MetodoPagoId: options.metodopago,
                FormaPagoId: options.formapago,
                Folio: options.folio,
                Fecha: options.fecha,
                Serie: options.serie,
                Observaciones: options.observaciones,
                ImpuestoId: options.iva,
                Subtotal: totalesfinales.subtotal,
                IVA: totalesfinales.iva,
                Total: totalesfinales.total,
                Descuento: totalesfinales.descuento,

            };

            try {
                const response = await fetch(route('GenerarArchivos'), {
                    method: "POST",
                    body: JSON.stringify({ Facturaciones: Facturaciones, Conceptos: tabla }),
                    headers: { "Content-Type": "application/json" }
                });

                const contentDispositionHeader = response.headers.get('Content-Disposition');
                const isPDF = contentDispositionHeader && contentDispositionHeader.includes('pdf');

                if (isPDF) {
                    // Procesar el archivo PDF si es una respuesta PDF
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = Object.assign(document.createElement('a'), { href: url, download: `Factura_${Date.now()}.pdf` });
                    document.body.appendChild(a).click(), setTimeout(() => document.body.removeChild(a), 1000);

                    const datosAdicionales = response.headers.get('X-Datos-Adicionales');
                    if (datosAdicionales) {
                        const datos = JSON.parse(datosAdicionales);
                        setoptions({ ...options, folio: datos.facturacion.facturaDiversos_idFacturaDiversos, RutaXml: datos.rutaArchivoXml });
                    }
                    setState({ ...state, loading: false, detalle: true });

                } else {
                    const data = await response.json(); // Obtener el JSON de la respuesta
                    showNotification(data.message, 'error', 'metroui', 'bottomRight', 2000); // Mostrar el mensaje de error en la interfaz de usuario
                }

            } catch (error) {
                console.error(error);
            }
        }
    };



    const LimpiarTabla = () => {
        settabla([]);
        settotalesfinales({ descuento: 0, iva: 0, total: 0, subtotal: 0 });
        LimpiarRow();
        setoptions({ metodopago: options.metodopago, formapago: options.formapago, iva: options.iva, fecha: fechaFormateada, folio: 0, observaciones: "S/N OBSERVACIONES", correos: [], tipos: "NORMAL", RutaXml: "", serie: options.serie });
        showNotification('Se ha limpiado la tabla de conceptos', 'success', 'metroui', 'bottomRight', 2000);
    };


    const LimpiarRow = () => {
        setconceptos({ id: "", concepto: "", cantidad: 1, precio: 0, unidad: "", importe: 0, iva: conceptos.iva, descripcion: "", descuento: 0 });
        setrowConcepto({ iva: 0, total: 0 });
    };

    const showErrorNotification = () => {
        showNotification('Faltan campos de rellenar', 'error', 'metroui', 'bottomRight', 2000);
    };






    const AgregarConcepto = () => {
        const sub = conceptos.cantidad * conceptos.precio;
        if (sub <= conceptos.descuento) {
            showNotification('El descuento no debe ser mayor al precio por la cantidad', 'info', 'metroui', 'bottomRight', 2000);
        } else {

            if (!(conceptos.cantidad && conceptos.descuento && conceptos.precio && conceptos.descripcion && conceptos.concepto && conceptos.unidad && options.iva)) {
                if (!conceptos.cantidad) showNotification('Falta rellenar el campo cantidad', 'info', 'metroui', 'bottomRight', 2000);
                // if (conceptos.descuento conceptos.precio * conceptos.cantidad) showNotification('El descuento no debe ser mayor al precio por la cantidad', 'info', 'metroui', 'bottomRight', 2000);
                if (!conceptos.descuento) showNotification('Falta rellenar el campo descuento', 'info', 'metroui', 'bottomRight', 2000);
                if (!conceptos.precio) showNotification('Falta rellenar el campo precio', 'info', 'metroui', 'bottomRight', 2000);
                if (!conceptos.descripcion) showNotification('Falta rellenar el campo descripción', 'info', 'metroui', 'bottomRight', 2000);
                if (!conceptos.concepto) showNotification('Falta rellenar el concepto', 'info', 'metroui', 'bottomRight', 2000);
                if (!conceptos.unidad) showNotification('Falta rellenar el campo unidad', 'info', 'metroui', 'bottomRight', 2000);
                if (!options.iva) showNotification('Falta rellenar el campo iva', 'info', 'metroui', 'bottomRight', 2000);
                return; // Detiene la ejecución si faltan campos por rellenar
            } else {
                const conceptoencontrado = requests.Claves.find(clave => clave.ClavesSatMostrar_idClavesSatMostrar === conceptos.concepto);
                const unidadencontrado = requests.Unidades.find(unidad => unidad.unidadMedida_idUnidadMedida === conceptos.unidad);
                const ivaencontrado = requests.Impuestos.find(impuesto => impuesto.catalogoImpuestoSAT_id === options.iva);
                if (!conceptoencontrado || !unidadencontrado || !ivaencontrado) { showErrorNotification(); return; }


                const newConcepto = {
                    id: idCounter,
                    Concepto: conceptos.concepto,
                    ConceptoNombre: conceptoencontrado.conceptosProductosSAT_descripcion,
                    ClaveProd: conceptoencontrado.conceptosProductosSAT_clave,
                    NOidentificacion: conceptoencontrado.conceptosProductosSAT_clave,
                    Descripcion: conceptos.descripcion,
                    Unidad: conceptos.unidad,
                    UnidadClave: unidadencontrado.unidadMedida_clave,
                    UnidadNombre: unidadencontrado.unidadMedida_nombre,
                    Precio: conceptos.precio,
                    Cantidad: conceptos.cantidad,
                    Descuento: conceptos.descuento,
                    Importe: conceptos.precio * conceptos.cantidad,
                    IVA: (parseFloat(conceptos.precio) * parseFloat(conceptos.cantidad) - conceptos.descuento) * parseFloat(ivaencontrado.catalogoImpuestoSAT_valor),
                    IVAid: ivaencontrado.catalogoImpuestoSAT_id,
                    ClaveImpuesto: ivaencontrado.catalogoImpuestoSAT_clave,
                    IVAValor: ivaencontrado.catalogoImpuestoSAT_valor,
                    Impuesto: ""
                };
                settabla((prevTabla) => [...prevTabla, newConcepto]);

                const subtotal = totalesfinales.subtotal + newConcepto.Importe;
                const descuento = totalesfinales.descuento + parseFloat(newConcepto.Descuento);
                const iva = totalesfinales.iva + newConcepto.IVA;
                const total = (subtotal - descuento) + iva;
                const nuevosTotales = { descuento: descuento, iva: iva, total: total, subtotal: subtotal, };
                settotalesfinales(nuevosTotales);
                setconceptos({ id: "", concepto: "", cantidad: 1, precio: 0, unidad: "", importe: 0, iva: conceptos.iva, descripcion: "", descuento: 0 });
                showNotification('Se ha agregado con exito', 'success', 'metroui', 'bottomRight', 2000);
                setIdCounter(idCounter + 1);
            }
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

    const EditarConcepto = () => {
        const conceptoencontrado = requests.Claves.find(clave => clave.ClavesSatMostrar_idClavesSatMostrar === conceptos.concepto);
        const unidadencontrado = requests.Unidades.find(unidad => unidad.unidadMedida_idUnidadMedida === conceptos.unidad);
        const ivaencontrado = requests.Impuestos.find(impuesto => impuesto.catalogoImpuestoSAT_id === conceptos.iva);

        if (!conceptoencontrado || !unidadencontrado || !ivaencontrado) {
            showErrorNotification();
            return; // Exit the function if any of the fields is not found
        }

        const objetoPersonalizado = {
            id: idCounter,
            Concepto: conceptos.concepto,
            ConceptoNombre: conceptoencontrado.conceptosProductosSAT_descripcion,
            ClaveProd: conceptoencontrado.conceptosProductosSAT_clave,
            NOidentificacion: conceptoencontrado.conceptosProductosSAT_clave,
            Descripcion: conceptos.descripcion,
            Unidad: conceptos.unidad,
            UnidadClave: unidadencontrado.unidadMedida_clave,
            UnidadNombre: unidadencontrado.unidadMedida_nombre,
            Precio: conceptos.precio,
            Cantidad: conceptos.cantidad,
            Descuento: conceptos.descuento,
            Importe: conceptos.precio * conceptos.cantidad,
            IVA: (parseFloat(conceptos.precio) * parseFloat(conceptos.cantidad) - conceptos.descuento) * parseFloat(ivaencontrado.catalogoImpuestoSAT_valor),
            IVAid: ivaencontrado.catalogoImpuestoSAT_id,
            ClaveImpuesto: ivaencontrado.catalogoImpuestoSAT_clave,
            IVAValor: ivaencontrado.catalogoImpuestoSAT_valor,
            Impuesto: ""
        };

        const nuevoConcepto = tabla.map((objeto) => {
            if (objeto.id === conceptos.id) {
                return objetoPersonalizado;
            }
            return objeto;
        });
        settabla(nuevoConcepto);
        const subtotal = nuevoConcepto.reduce((acumulador, objeto) => acumulador + (objeto.Importe || 0), 0);
        const descuento = nuevoConcepto.reduce((acumulador, objeto) => acumulador + (objeto.Descuento || 0), 0);
        const IvaTotal = nuevoConcepto.reduce((acumulador, objeto) => acumulador + (objeto.IVA || 0), 0);
        const total = subtotal - descuento + IvaTotal;
        const nuevosTotales = { ...totalesfinales, subtotal: subtotal, descuento: descuento, total: total, iva: IvaTotal };
        settotalesfinales(nuevosTotales);
        setconceptos({ id: "", concepto: "", cantidad: 1, precio: 0, unidad: "", importe: 0, iva: 0, descripcion: "", descuento: "" })
        setMetodo(false);
        showNotification('Se ha actualizado con exito', 'information', 'metroui', 'bottomRight', 2000);

    };

    const EliminarConcepto = (idToRemove) => {
        const conceptoToRemove = tabla.find(concepto => concepto.id === idToRemove);
        const subtotal = totalesfinales.subtotal - conceptoToRemove.Importe;
        const descuento = totalesfinales.descuento - conceptoToRemove.Descuento;
        const iva = totalesfinales.iva - conceptoToRemove.IVA;
        const total = subtotal + iva;
        const nuevosTotales = { descuento: descuento, iva: iva, total: total, subtotal: subtotal };
        settotalesfinales(nuevosTotales);
        settabla((prevTabla) => prevTabla.filter(concepto => concepto.id !== idToRemove));
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




    const renderTotalItem = (label, value) => { return (<div className='flex w-full justify-between' style={{ paddingBottom: '10px' }}> <span>{label}:</span> <span>$ {value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span> </div>); };

    useEffect(() => {
        document.title = 'Intergas | Facturacion Diversos';
        getAll().then(() => setState({ loading: false }))
    }, [])

    const getAll = async () => {
        const clientesData = await fetchClientes();
        const foliosData = await fetchFolioDiversos();
        const formaPagoData = await fetchFormaPago();
        const ImpuestosData = await fetchImpuestos();
        const MetodosData = await fetchMetodoPago();
        const UnidadesData = await fetchunidades();
        const ClavesData = await fetchClaves();


        const impuestosFiltrados = ImpuestosData.filter(impuesto => impuesto.catalogoImpuestoSAT_descripcion === "IVA 16%");
        setoptions(prevState => ({ ...prevState, iva: impuestosFiltrados[0].catalogoImpuestoSAT_id, serie: foliosData.folios_idFolios }));
        setRequests({ ...requests, Impuestos: ImpuestosData, Clientes: clientesData, Folios: foliosData, Claves: ClavesData, FormaPago: formaPagoData, MetodoPago: MetodosData, Unidades: UnidadesData });
    };

    return (

        <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
            {state.loading &&
                <div className='flex items-center justify-center h-screen w-screen'> <LoadingDiv /> </div>
            }
            {!state.loading &&
                <>
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
                            {/* Informacion del cliente */}
                            <InformacionFactura facturacion={Options} cliente={cliente} />

                            <div className='flex flex-col shadow-md px-3  pb-4 border-2  rounded-xl'>
                                <div class="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-2">
                                    <TextInput
                                        label="No. Serie"
                                        type="text"
                                        value="D"
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
                                    <SelectComp
                                        label="Concepto"
                                        options={requests.Claves}
                                        value={conceptos.concepto || ''}
                                        onChangeFunc={(newValue) => { setconceptos({ ...conceptos, concepto: newValue }); }}
                                        data="conceptosProductosSAT_descripcion"
                                        valueKey="ClavesSatMostrar_idClavesSatMostrar"
                                    />
                                    <TextInput
                                        label="Descripción"
                                        type="text"
                                        value={conceptos.descripcion || ''}
                                        onChange={(e) => { setconceptos({ ...conceptos, descripcion: e.target.value }); }}
                                    />
                                    <SelectComp
                                        label="Unidad de medida"
                                        options={requests.Unidades}
                                        value={conceptos.unidad || ''}
                                        onChangeFunc={(newValue) => { setconceptos({ ...conceptos, unidad: newValue }); }}
                                        data="unidadMedida_nombre"
                                        valueKey="unidadMedida_idUnidadMedida"
                                    />
                                    <TextInput
                                        label="Precio"
                                        type="decimal"
                                        value={conceptos.precio || ''}
                                        onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setconceptos({ ...conceptos, precio: e.target.value })}
                                    />
                                    <TextInput
                                        label="Cantidad"
                                        type="number"
                                        value={conceptos.cantidad || 1}
                                        onChange={(e) => !isNaN(parseFloat(e.target.value)) && e.target.value >= 0 && setconceptos({ ...conceptos, cantidad: parseFloat(e.target.value) })}
                                    />

                                    <TextInput
                                        label="Descuento"
                                        type="decimal"
                                        value={conceptos.descuento || ''}
                                        onChange={(e) => !isNaN(parseFloat(e.target.value)) && e.target.value >= 0 && setconceptos({ ...conceptos, descuento: parseFloat(e.target.value) })}
                                    />



                                    <div className='flex flex-col text-white gap-3 pt-4'>

                                        <Button endIcon={state.metodo ? <EditNote /> : <Add />} style={{ ...stylebuttons, backgroundColor: state.metodo ? '#1B2654' : '#FC4C02', }} disabled={options.folio !== 0} onClick={(e) => { state.metodo ? EditarConcepto() : AgregarConcepto(); }}  >
                                            {state.metodo ? 'Editar' : 'Agregar concepto'}
                                        </Button>

                                        <Button style={{ ...stylebuttons, backgroundColor: '#036cf5' }} endIcon={<DeleteSweep />} onClick={(e) => { LimpiarRow(); setState({ ...state, metodo: false }); }} >
                                            Limpiar
                                        </Button>

                                    </div>
                                </div>
                                <br />

                                <div className="flex gap-4 ">
                                    <div className="flex flex-col w-full justify-center shadow-md bg-[#1B2654] border-2 px-2 rounded-xl text-white text-[12px] gap-2 pt-2">
                                        {renderTotalItem('Precio', conceptos.precio)}
                                        {renderTotalItem('Descuento', parseFloat(conceptos.descuento))}
                                        {renderTotalItem('Subtotal', ((conceptos.precio * conceptos.cantidad) - conceptos.descuento))}
                                    </div>
                                </div>

                                <div className='flex flex-col text-white gap-2'>
                                    <Button endIcon={<Description />} style={{ ...stylebuttons, backgroundColor: options.folio !== 0 || Object.keys(tabla).length === 0 ? 'gray' : '#1B2654', fontWeight: 'bold', color: 'white', }} onClick={(e) => { GenerarYEnviarXML() }} disabled={!tabla || Object.keys(tabla).length === 0 || options.folio !== 0} >
                                        Facturar conceptos
                                    </Button>
                                </div>

                            </div>
                        )}
                        <div className='flex flex-col w-full gap-4 items-stretch' >
                            <div className="w-full flex justify-end gap-4 ">

                                {options.folio !== 0 && (
                                    <>
                                        <Button variant="contained" endIcon={<Email />} style={{ fontWeight: 'bold', backgroundColor: '#1B2654', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }} onClick={() => setState({ ...state, detalle: true })} >Enviar factura</Button>
                                        <Button variant="contained" endIcon={<Print />} style={{ fontWeight: 'bold', backgroundColor: 'red', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }} onClick={(e) => { BuscarPdf(options.folio, "DIVERSO") }} >Imprimir</Button>
                                    </>
                                )}
                                {tabla.length > 0 && (
                                    <Button variant="contained" endIcon={<DeleteSweep />} style={{ fontWeight: 'bold', backgroundColor: '#036cf5', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }} onClick={(e) => { LimpiarTabla() }} >LIMPIAR TABLA</Button>
                                )}
                            </div>
                            <div className="w-full pt-3 monitor-table" >
                                <Datatable
                                    data={tabla}
                                    searcher={false}
                                    columns={[
                                        { header: "Concepto", accessor: "ConceptoNombre" },
                                        { header: "Descripción", accessor: "Descripcion" },
                                        { header: "Unidad", accessor: "UnidadNombre" },
                                        { header: "Precio", cell: (row) => row.item.Precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                        { header: "Cantidad", cell: (row) => row.item.Cantidad.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                        { header: "Descuento", cell: (row) => row.item.Descuento.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                        { header: "Importe", cell: (row) => row.item.Importe.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                        { header: "IVA", cell: (row) => row.item.IVA.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                                        {
                                            header: "Impuesto", accessor: "Impuesto", width: '50%',
                                            cell: (eprops) => (
                                                <>
                                                    <Checkbox
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                                        checked={true} // Mantener siempre marcado
                                                        disabled={true} // Deshabilitar cambios
                                                    />
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
                                                            <span> {/* Envoltura que no está deshabilitada */}
                                                                <button onClick={() => handleRowClick(eprops.item.id)} style={{ color: '#ff0000', cursor: 'pointer' }} disabled={options.folio !== 0}><EditNote /> </button>
                                                            </span>
                                                        </Tooltip>

                                                        <Tooltip title={options.folio !== 0 ? "No se puede eliminar un concepto de una factura creada" : "Eliminar"}>
                                                            <span> {/* Envoltura que no está deshabilitada */}
                                                                <button onClick={() => EliminarConcepto(eprops.item.id)} disabled={options.folio !== 0}> <DeleteSweep /> </button>
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
                                <textarea id="OrderNotes" className="w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm md:min-w-[30%]" rows="5" placeholder="Observaciones"></textarea>
                                <div className="flex flex-col w-full justify-center shadow-md bg-[#1B2654] border-2 px-4 rounded-xl text-white text-[12px] gap-2">
                                    <br />
                                    {renderTotalItem('Subtotal', totalesfinales.subtotal)}
                                    {renderTotalItem('Descuento', totalesfinales.descuento)}
                                    {renderTotalItem('IVA', totalesfinales.iva)}
                                    {renderTotalItem('Total', totalesfinales.total)}
                                </div>

                            </div>

                        </div>
                    </>

                </>
            }
            <Dialog open={state.detalle} style={{ height: '100%' }} onClose={() => { setState({ ...state, detalle: false }) }} maxWidth="lg" >
                <DialogEmail facturacion={options} cliente={cliente} />
            </Dialog >

        </div >
    )
    function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };
}


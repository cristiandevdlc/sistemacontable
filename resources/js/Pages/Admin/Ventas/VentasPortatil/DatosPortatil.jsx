import '@/utils';
import Datatable from '@/components/Datatable';
import TextInput from '@/components/TextInput';
import { ButtonComp } from '@/components/ButtonComp';
import { Edit, Add, Delete } from '@mui/icons-material';
import { useEffect, useState, React, useRef } from 'react';
import request, { ServiceTypes, moneyFormat, noty, validateInputs } from '@/utils';
import { IntRemissionTotals, remissionRules } from './IntVentasPortatil';

const saleType = { credito: 1, contado: 2 }
const actions = { delete: 0, edit: 1 }
const NO_CONSULTA_REMISION = 0
const defaultPayment = '01'

export const PRODUCTS_IDS = {
    "Cilindro de montacarga": 1031,
    "Kilo extra": 8,
    "Portatil 10KG": 1009,
    "Portatil 20KG": 1026,
    "Portatil 30KG": 1027,
    "Portatil 45KG": 1028,
    "Recarga": 7,

    // "Cilindro de montacarga": 10,
    // "Kilo extra": 2,
    // "Portatil 10KG": 5,
    // "Portatil 20KG": 6,
    // "Portatil 30KG": 7,
    // "Portatil 45KG": 8,
    // "Recarga": 7,
}

export const PRODUCTS_QUANTITY = {
    1031: 1,    /// "Cilindro de montacarga"
    8: 1,       /// "Kilo extra"
    1009: 10,   /// "Portatil 10KG"
    1026: 20,   /// "Portatil 20KG"
    1027: 30,   /// "Portatil 30KG"
    1028: 45,   /// "Portatil 45KG"
    7: 1,       /// "Recarga"
    // 10: 1,    /// "Cilindro de montacarga"
    // 8: 1,       /// "Kilo extra"
    // 5: 10,   /// "Portatil 10KG"
    // 6: 20,   /// "Portatil 20KG"
    // 7: 30,   /// "Portatil 30KG"
    // 8: 45,   /// "Portatil 45KG"
    // 7: 1,       /// "Recarga"
}

export default function DatosPortatil(data, empresa, states, totales, setTotales, remisionsData, setRemisionsData, setErrors) {
    const [selects, setSelects] = useState({})
    const [selectedRows, setSelectedRows] = useState([]);
    // const [remisionsData, setRemisionsData] = useState([]);
    const [remisionsTable, setRemisionsTable] = useState([]);
    const [currentRemision, setCurrentRemision] = useState({});
    const [remisionToValidate, setRemisionToValidate] = useState({});
    const remisionInput = useRef()
    const [reposicion, setreposicion] = useState(false);

    useEffect(() => {
        setSelects({})
        setSelectedRows([])
        setRemisionsData([])
        setRemisionsTable([])
        setCurrentRemision({})
    }, [data.unidad]);

    useEffect(() => {
        if (states.dialogRemision) {
            const keyDownHandler = event => {
                if (event.key === 'Enter' || event.key == 'Tab') {
                    event.preventDefault();
                    onFocusInput();

                    const matchingInputs = document.querySelectorAll('.dialogRemission input:not([type="hidden"]):not([disabled]):not(.search-input):not(#search-input-leftmenu)');
                    const matchfilled = document.querySelectorAll('.dialogRemission input[wasFocused="true"]');

                    if (matchingInputs.length == matchfilled.length)
                        addNewRemission();
                }
            };

            document.addEventListener('keydown', keyDownHandler);
            return () => {
                document.removeEventListener('keydown', keyDownHandler);
            };
        }
    }, [states.dialogRemision, currentRemision, remisionToValidate]);

    const onFocusInput = () => {
        // const matchingInputs = document.querySelectorAll('input:not(.search-input):not(#search-input-leftmenu)');
        const matchingInputs = document.querySelectorAll('.dialogRemission input:not([wasFocused="true"]):not([type="hidden"]):not([disabled]):not(.search-input):not(#search-input-leftmenu)');
        let initial = false;
        matchingInputs.forEach((element, index) => {
            if (!element.disabled && !initial) {
                element.setAttribute('wasFocused', true)
                if (index < matchingInputs.length)
                    matchingInputs[index].focus()

                initial = true;
            }
        });
    }

    const fetchData = async () => {
        const [
            // clientesResponse,
            productosResponse,
            formasPagoResponse,
            tipoVenta,
            estacionesResponse,
            pedidosResponse,
        ] = await Promise.all([
            // fetch(route("clientes.index")).then(res => res.json()),
            request(route("productos-historico.remision"), 'POST', { zona: data.zona, tipoServicio: 'PORTATIL' }, { enabled: true }),
            fetch(route("formas-pago.index")).then(res => res.json()),
            fetch(route("sat/metodo-pago.index")).then(res => res.json()),
            fetch(route("estacion.activa")).then(res => res.json()),
            request(route('remisiones.unidad'), 'POST', { ...data, tipoServicio: ServiceTypes.PORTATIL }, { enabled: true }),
        ]);

        setSelects((prev) => ({
            ...prev,
            // clientes: clientesResponse,
            productos: productosResponse,
            formasPago: formasPagoResponse,
            tipoVentas: tipoVenta,
            estaciones: estacionesResponse,
            pedidos: pedidosResponse
        }))
    }

    const addNewRemission = () => {
        let message = null
        if (!currentRemision.detalles?.remision)
            message = 'Remision requerida'
        if (currentRemision.detalles?.Cantidad == 0)
            message = 'Ingresa una cantidad valida'
        const exist = remisionsData.find(r => r.detalles?.remision === currentRemision.detalles?.remision)
        if (exist)
            message = 'Esta remisión ya fue registradoa'
        const result = validateInputs(remissionRules, remisionToValidate)
        if (!result.isValid) {

            // setErrors(result.errors)
            return
        }
        if (message) {
            noty(message, 'error')
            return
        }

        if (Object.keys(currentRemision).length > 0) {
            setRemisionsData([...remisionsData, currentRemision])
            resetData()
            addRemisionToTable([...remisionsData, currentRemision])
            getRemissionsTotals([...remisionsData, currentRemision])
            setSelects({
                ...selects,
                pedidos: selects.pedidos.filter(p => p.remision !== currentRemision.remision)
            })
            const matchingInputs = document.querySelectorAll('.dialogRemission input[wasFocused="true"]:not([type="hidden"]):not([disabled]):not(.search-input):not(#search-input-leftmenu)');
            matchingInputs.forEach((element, index) => {
                element.setAttribute('wasFocused', false)
            });

            setErrors({})
            remisionInput.current.focus()
        } else
            noty('Selecciona un pedido', 'error')
    }

    const resetData = () => {

        const { descuento, total } = calculateDiscount(1, currentRemision.direccion?.cliente_facturacion, currentRemision.detalles?.historico);

        // currentRemision.detalles?.remision
        setCurrentRemision({
            // facturar: 0,
            // tipoVenta: 2,
            // estacionId: selects.estaciones[0].estacion_idEstacion,
            ...currentRemision,
            pedidoId: '',
            detalles: {
                ...currentRemision.detalles,
                Cantidad: '1',
                remision: ""
                // productoId: currentRemision.detalles?.productos.producto_idProducto,
                // productos: currentRemision.detalles?.productos,
                // historico: currentRemision.detalles?.historico
            },
            total: total,
            descuento: descuento
            // direccion: {
            //     idCliente: selects.clientes[0]?.cliente_idCliente,
            //     cliente_facturacion: selects.clientes[0]
            // },
            // PaymentMethodId: selects.formasPago[0].formasPago_idFormasPago
        })
    }

    const addRemisionToTable = (remissions = []) => {
        const total = remissions.map(r => {
            return {
                folio: r.pedidoId,
                remision: r.detalles?.remision,
                tipoVenta: selects.tipoVentas.find(tv => tv.catalogoMetodoPagoSAT_id == r.tipoVenta)?.catalogoMetodoPagoSAT_descripcion,
                cliente: r.direccion?.cliente_facturacion?.cliente_razonsocial ?? 'VENTA AL PUBLICO GENERAL',
                producto: r.detalles?.productos?.producto_nombre,
                facturar: (r.facturar == 0) ? 'NO' : 'SI',
                formaPago: selects.formasPago.find(fp => fp.formasPago_idFormasPago == r.PaymentMethodId)?.formasPago_descripcion,
                cantidad: moneyFormat(r.detalles?.Cantidad),
                precio: `$ ${String(moneyFormat(r.detalles?.historico?.historico_precio ?? 0))}`,
                bonificacion: `$ ${String(moneyFormat((r.detalles?.historico?.historico_precio * r.detalles?.Cantidad) - r.total ?? 0))}`,
                total: `$ ${String(moneyFormat(r.total ?? 0))}`
            }
        })
        setRemisionsTable(total)
    }

    const remissionsActions = (action) => {
        if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION) {
            const remisPedidos = selectedRows.map(p => p.remision)
            setRemisionsTable(remisionsTable.filter(r => !remisPedidos.includes(r.remision)))
            setSelectedRows([])
            setRemisionsData(remisionsData.filter(r => !remisPedidos.includes(r.detalles?.remision)))

            const remissionTotal = [...remisionsData.filter(r => !remisPedidos.includes(r.detalles?.remision))].reduce((prev, next) => {
                let t20 = parseFloat(prev.prod.t20),
                    t10 = parseFloat(prev.prod.t10),
                    t30 = parseFloat(prev.prod.t30),
                    t45 = parseFloat(prev.prod.t45),
                    r = parseFloat(prev.prod.rec),
                    kg = parseFloat(prev.prod.tanques);

                let kgsCredito = 0, kgsContado = 0;
                if (next.tipoVenta == saleType.contado) {
                    kgsCredito = parseFloat(prev.lts.credito)
                    kgsContado = parseFloat(prev.lts.contado ?? 0) + parseFloat(next.detalles?.Cantidad * next.detalles?.historico?.historico_capacidad)
                }
                else if (next.tipoVenta == saleType.credito) {
                    kgsContado = parseFloat(prev.lts.contado)
                    kgsCredito = parseFloat(prev.lts.credito ?? 0) + parseFloat(next.detalles?.Cantidad * next.detalles?.historico?.historico_capacidad)
                }
                else {
                    kgsContado = parseFloat(prev.lts.contado)
                    kgsCredito = parseFloat(prev.lts.credito)
                }

                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 10KG"]) {
                    t10 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 20KG"]) {
                    t20 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 30KG"]) {
                    t30 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 45KG"]) {
                    t45 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Recarga"]) r += parseFloat(next.detalles?.Cantidad);


                prev.lts = {
                    contado: kgsContado,
                    credito: kgsCredito,
                    total: parseFloat(kgsContado) + parseFloat(kgsCredito)
                }
                prev.price = {
                    contado: next.tipoVenta == saleType.contado ? (parseFloat(prev.price.contado ?? 0) + parseFloat(next.total)) : parseFloat(prev.price.contado),
                    credito: next.tipoVenta == saleType.credito ? (parseFloat(prev.price.credito ?? 0) + parseFloat(next.total)) : parseFloat(prev.price.credito),
                    total: parseFloat(prev.price.contado) + parseFloat(prev.price.credito) + parseFloat(next.total)
                }
                prev.prod = {
                    t10: t10,
                    t20: t20,
                    t30: t30,
                    t45: t45,
                    rec: r,
                    tanques: kg,
                }
                prev.remisiones = prev.remisiones + 1
                return prev;
            }, { ...IntRemissionTotals })

            setTotales(remissionTotal)

            if (action === actions.edit)
                setCurrentRemision(remisionsData.find(p => p.detalles?.remision == selectedRows[0].remision))
        } else {
            const idPedidos = selectedRows.map(p => p.remision)
            setRemisionsTable(remisionsTable.filter(r => !idPedidos.includes(r.remision)))
            setSelectedRows([])
            setSelects({
                ...selects,
                pedidos: selects.pedidos.concat(
                    remisionsData.filter(r => idPedidos.includes(r.remision))
                ).sort((a, b) => a.remision - b.remision)
            })
            setRemisionsData(remisionsData.filter(r => !idPedidos.includes(r.remision)))

            const remissionTotal = [...remisionsData.filter(r => !idPedidos.includes(r.remision))].reduce((prev, next) => {
                let t20 = parseFloat(prev.prod.t20),
                    t10 = parseFloat(prev.prod.t10),
                    t30 = parseFloat(prev.prod.t30),
                    t45 = parseFloat(prev.prod.t45),
                    r = parseFloat(prev.prod.rec),
                    kg = parseFloat(prev.prod.tanques);

                let kgsCredito = 0, kgsContado = 0;

                if (next.tipoVenta == saleType.contado) {
                    kgsCredito = parseFloat(prev.lts.credito)
                    kgsContado = parseFloat(prev.lts.contado ?? 0) + parseFloat(next.detalles?.Cantidad * next.detalles?.historico?.historico_capacidad)
                }
                else if (next.tipoVenta == saleType.credito) {
                    kgsContado = parseFloat(prev.lts.contado)
                    kgsCredito = parseFloat(prev.lts.credito ?? 0) + parseFloat(next.detalles?.Cantidad * next.detalles?.historico?.historico_capacidad)
                }
                else {
                    kgsContado = parseFloat(prev.lts.contado)
                    kgsCredito = parseFloat(prev.lts.credito)
                }

                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 10KG"]) {
                    t10 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 20KG"]) {
                    t20 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 30KG"]) {
                    t30 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 45KG"]) {
                    t45 += parseFloat(next.detalles?.Cantidad)
                    kg += parseFloat(next.detalles?.Cantidad)
                };
                if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Recarga"]) r += parseFloat(next.detalles?.Cantidad);

                prev.lts = {
                    contado: kgsContado,
                    credito: kgsCredito,
                    total: parseFloat(kgsContado) + parseFloat(kgsCredito)
                }
                prev.price = {
                    contado: next.tipoVenta == saleType.contado ? (parseFloat(prev.price.contado ?? 0) + parseFloat(next.total)) : parseFloat(prev.price.contado),
                    credito: next.tipoVenta == saleType.credito ? (parseFloat(prev.price.credito ?? 0) + parseFloat(next.total)) : parseFloat(prev.price.credito),
                    total: parseFloat(prev.price.contado) + parseFloat(prev.price.credito) + parseFloat(next.total)
                }
                prev.prod = {
                    t10: t10,
                    t20: t20,
                    t30: t30,
                    t45: t45,
                    rec: r,
                    tanques: kg,
                }
                prev.remisiones = prev.remisiones + 1
                return prev;
            }, { ...IntRemissionTotals })

            setTotales(remissionTotal)

            if (action === actions.edit)
                setCurrentRemision(remisionsData.find(p => p.remision == selectedRows[0].remision))
        }
    }

    const getRemissionsTotals = (remissions = []) => {
        const remissionTotal = remissions.reduce((prev, next) => {
            let t20 = parseFloat(prev.prod.t20),
                t10 = parseFloat(prev.prod.t10),
                t30 = parseFloat(prev.prod.t30),
                t45 = parseFloat(prev.prod.t45),
                r = parseFloat(prev.prod.rec),
                kg = parseFloat(prev.prod.tanques);

            let kgsCredito = 0, kgsContado = 0;

            if (next.tipoVenta == saleType.contado) {
                kgsCredito = parseFloat(prev.lts.credito)
                kgsContado = parseFloat(prev.lts.contado ?? 0) + parseFloat(next.detalles?.Cantidad * next.detalles?.historico?.historico_capacidad)
            }
            else if (next.tipoVenta == saleType.credito) {
                kgsContado = parseFloat(prev.lts.contado)
                kgsCredito = parseFloat(prev.lts.credito ?? 0) + parseFloat(next.detalles?.Cantidad * next.detalles?.historico?.historico_capacidad)
            }
            else {
                kgsContado = parseFloat(prev.lts.contado)
                kgsCredito = parseFloat(prev.lts.credito)
            }

            if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 10KG"]) {
                t10 += parseFloat(next.detalles?.Cantidad)
                kg += parseFloat(next.detalles?.Cantidad)
            };
            if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 20KG"]) {
                t20 += parseFloat(next.detalles?.Cantidad)
                kg += parseFloat(next.detalles?.Cantidad)
            };
            if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 30KG"]) {
                t30 += parseFloat(next.detalles?.Cantidad)
                kg += parseFloat(next.detalles?.Cantidad)
            };
            if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Portatil 45KG"]) {
                t45 += parseFloat(next.detalles?.Cantidad)
                kg += parseFloat(next.detalles?.Cantidad)
            };
            if (next.detalles?.historico?.historico_idProducto == PRODUCTS_IDS["Recarga"]) r += parseFloat(next.detalles?.Cantidad);

            prev.lts = {
                contado: kgsContado,
                credito: kgsCredito,
                total: parseFloat(kgsContado) + parseFloat(kgsCredito)
            }
            prev.price = {
                contado: next.tipoVenta == saleType.contado ? (parseFloat(prev.price.contado ?? 0) + parseFloat(next.total)) : parseFloat(prev.price.contado),
                credito: next.tipoVenta == saleType.credito ? (parseFloat(prev.price.credito ?? 0) + parseFloat(next.total)) : parseFloat(prev.price.credito),
                total: parseFloat(prev.price.contado) + parseFloat(prev.price.credito) + parseFloat(next.total)
            }
            prev.prod = {
                t10: t10,
                t20: t20,
                t30: t30,
                t45: t45,
                rec: r,
                tanques: kg,
            }
            prev.remisiones = prev.remisiones + 1
            return prev;
        }, { ...IntRemissionTotals })

        setTotales(remissionTotal)
    }

    const getTotalFromCurrent = (precio = 0, cantidad = 0, bono = 0) => ((precio - bono) * cantidad)
    const getDiscount = (precio = 0, cantidad = 0, bono = 0) => ((precio - bono) * cantidad)

    const calculateDiscount = (cantidad = 1, cliente = null, historico = null) => {
        const prices = { descuento: 0, total: 0, bonificacion: 0 }
        if (cantidad && cliente && historico) {
            prices.descuento = cliente.cliente_descuentoTanque

            if (cliente.cliente_dscportanque == 1) { ///es cuando el descuento se hace por tanque
                prices.total = getTotalFromCurrent(historico.historico_precio ?? 0, cantidad ?? 0, prices.descuento)
            } else { /// Es cuando el descuento se hace por cada kilo
                prices.total = getTotalFromCurrent(historico.historico_precio ?? 0, cantidad ?? 0, prices.descuento * historico.historico_capacidad)
                // if (historico.historico_idProducto == PRODUCTS_IDS['Portatil 10KG']) prices.total = getTotalFromCurrent(historico.historico_precio ?? 0, cantidad ?? 0, prices.descuento * 10)
                // else if (historico.historico_idProducto == PRODUCTS_IDS['Portatil 20KG']) prices.total = getTotalFromCurrent(historico.historico_precio ?? 0, cantidad ?? 0, prices.descuento * 20)
                // else if (historico.historico_idProducto == PRODUCTS_IDS['Portatil 30KG']) prices.total = getTotalFromCurrent(historico.historico_precio ?? 0, cantidad ?? 0, prices.descuento * 30)
                // else if (historico.historico_idProducto == PRODUCTS_IDS['Portatil 45KG']) prices.total = getTotalFromCurrent(historico.historico_precio ?? 0, cantidad ?? 0, prices.descuento * 45)
                // else prices.total = getTotalFromCurrent(historico.historico_precio, cantidad, prices.descuento)
            }
        }
        if (!cliente && historico)
            prices.total = getTotalFromCurrent(historico.historico_precio, cantidad, prices.descuento)
        if (!historico)
            prices.total = getTotalFromCurrent(0, cantidad, prices.descuento)
        return prices
    }

    useEffect(() => {
        if (data.unidad && data.zona && data.operador)
            fetchData()
    }, [data.unidad, data.zona, data.operador]);

    useEffect(() => {
        if (data.unidad && data.zona)
            request(route("clientes.index")).then(res => setSelects((prev) => ({
                ...prev,
                clientes: res
            })))
    }, [states.dialogRemision]);

    return [
        {
            label: "# Pedidos",
            input: true,
            type: "text",
            style: 'col-span-6 lg:col-span-2',
            value: (selects.pedidos && (selects.pedidos.length.toString())) ?? '0',
            disabled: true
        },
        {
            label: "Zona",
            select: true,
            options: states.zonas,
            data: 'zona_descripcion',
            valueKey: "zona_idZona",
            style: 'col-span-6 lg:col-span-2',
            value: data.zona,
            disabled: true
        },
        {
            label: "Fecha",
            input: true,
            type: "text",
            style: 'col-span-12 lg:col-span-2',
            value: (currentRemision.fechaPedido ? new Date(currentRemision.fechaPedido) : new Date()).formatMXNoTime(),
            disabled: true
        },
        {
            label: "Other",
            custom: true,
            style: 'hidden lg:flex lg:col-span-6 row-[span_16_/_span_16]',
            customItem: ({ label }) => (<>
                <div style={{ zoom: 0.6 }}>
                    <Datatable
                        title="dasdasd"
                        data={remisionsTable}
                        selection='multiple'
                        virtual={true}
                        searcher={false}
                        selectedData={selectedRows}
                        selectionFunc={({ selectedRowKeys }) => setSelectedRows(selectedRowKeys)}
                        columns={[
                            { header: 'Folio', accessor: 'folio' },
                            { header: 'Remisión', accessor: 'remision' },
                            { header: 'TipoVenta', accessor: 'tipoVenta' },
                            { header: 'Cliente', accessor: 'cliente' },
                            { header: 'Producto', accessor: 'producto' },
                            { header: 'Facturar', accessor: 'facturar' },
                            { header: 'FormaPago', accessor: 'formaPago' },
                            { header: 'Cantidad', accessor: 'cantidad' },
                            { header: 'Precio', accessor: 'precio' },
                            { header: 'Bonificación', accessor: 'bonificacion' },
                            { header: 'Total', accessor: 'total' },
                        ]}
                    />
                </div>
            </>)
        },
        {
            label: "Pedido",
            select: true,
            type: "text",
            options: selects.pedidos,
            disabled: (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION),
            onChangeFunc: (e, o) => {
                console.log(selects.productos);
                const producto = selects.productos.find(p => p.producto_idProducto == o.detalles?.productoId)
                const { descuento, total } = calculateDiscount(o.detalles?.Cantidad ?? 1, o.direccion?.cliente_facturacion, producto.historico);

                setRemisionToValidate({
                    ...remisionToValidate,
                    remision: o.detalles?.remision || 0,
                    cantidad: o.detalles?.Cantidad || 1,
                    facturar: 0,
                    tipoVenta: 2,
                    clienteId: o.direccion?.idCliente,
                    vale: o.detalles?.IdVale,
                    producto: 1,
                    formaPago: selects.formasPago.find(fp => fp.formasPago_cveFormasPago == defaultPayment).formasPago_idFormasPago,
                    estacionId: selects.estaciones[0]?.estacion_idEstacion,
                    producto: o.detalles?.productoId
                })
                setCurrentRemision({
                    ...o,
                    facturar: 0,
                    tipoVenta: saleType.contado,
                    estacionId: selects.estaciones[0]?.estacion_idEstacion,
                    total: total,
                    descuento: descuento,
                    detalles: {
                        ...o.detalles,
                        Cantidad: o.detalles?.Cantidad || 1,
                        historico: producto.historico
                    }
                })
            },
            valueKey: 'pedidoId',
            value: currentRemision.pedidoId,
            data: 'remision',
            style: 'col-span-6 lg:col-span-3',
        },
        {
            label: {
                add: 'Añadir remisión',
                edit: 'Editar remisión',
                delete: 'Eliminar remisión',
            },
            custom: true,
            style: 'col-span-6 lg:col-span-3',
            customItem: ({ label }) => (
                <div className='grid grid-cols-3 gap-2 mt-2 p-2'>
                    <ButtonComp
                        tooltip={label.add}
                        onClick={() => addNewRemission()}
                        className={`!h-[45px] !w-[100%] !mt-[10px]`}
                        disabled={(Object.keys(currentRemision)) ? false : true}
                        color='#FC4C02'
                        label={<> <Add /> </>}
                    />
                    <ButtonComp
                        tooltip={label.edit}
                        onClick={() => remissionsActions(actions.edit)}
                        className={`!h-[45px] !w-[100%] !mt-[10px]`}
                        color='#FC4C02'
                        disabled={(selectedRows.length == 1) ? false : true}
                        label={<> <Edit /> </>}
                    />
                    <ButtonComp
                        tooltip={label.delete}
                        onClick={() => remissionsActions(actions.delete)}
                        className={`!h-[45px] !w-[100%] !mt-[10px]`}
                        color='#FC4C02'
                        disabled={(selectedRows.length > 0) ? false : true}
                        label={<> <Delete /> </>}
                    />
                </div>
            )
        },
        {
            label: "Folio",
            input: true,
            type: "text",
            style: 'col-span-4 lg:col-span-2',
            value: currentRemision.detalles?.pedidoId,
            disabled: true
        },
        {
            label: "Remision",
            fieldKey: 'remision',
            input: true,
            type: "text",
            style: 'col-span-4 lg:col-span-2',
            value: currentRemision.detalles?.remision,
            disabled: (empresa.empresa_ConsultaRemision != NO_CONSULTA_REMISION && data.rutaTlmk != NO_CONSULTA_REMISION),
            onChangeFunc: (e) => {
                setCurrentRemision({
                    ...currentRemision,
                    facturar: currentRemision.facturar ?? 0,
                    tipoVenta: currentRemision.tipoVenta ?? 2,
                    detalles: {
                        ...currentRemision.detalles,
                        remision: e.target.value,
                        Cantidad: currentRemision.detalles?.Cantidad || 1
                    },
                    PaymentMethodId: selects.formasPago.find(fp => fp.formasPago_cveFormasPago == defaultPayment).formasPago_idFormasPago
                })
                setRemisionToValidate({
                    ...remisionToValidate,
                    remision: e.target.value,
                    cantidad: 1,
                    facturar: currentRemision.facturar ?? 0,
                    tipoVenta: currentRemision.tipoVenta ?? 2,
                    formaPago: selects.formasPago.find(fp => fp.formasPago_cveFormasPago == defaultPayment).formasPago_idFormasPago
                })
            },
            ref: remisionInput
        },
        {
            label: "Vale",
            fieldKey: 'vale',
            input: true,
            type: "text",
            style: 'col-span-4 lg:col-span-2',
            value: currentRemision.detalles?.IdVale,
            disabled: true,
            // disabled: (empresa.empresa_ConsultaRemision != NO_CONSULTA_REMISION),
            onChangeFunc: (e) => {
                setCurrentRemision({ ...currentRemision, detalles: { ...currentRemision.detalles, IdVale: e.target.value } })
                setRemisionToValidate({ ...remisionToValidate, vale: e.target.value })
            }
        },
        {
            label: "Razón social",
            fieldKey: 'clienteId',
            select: true,
            style: 'col-span-9 lg:col-span-4',
            value: currentRemision.direccion?.idCliente,
            options: selects.clientes,
            data: 'cliente_razonsocial',
            valueKey: "cliente_idCliente",
            onChangeFunc: (e, o) => {
                const cliente_estatusReposicion = o.cliente_estatusReposicion;
                setreposicion(cliente_estatusReposicion);
                if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION)
                    setRemisionToValidate({
                        ...remisionToValidate,
                        clienteId: e,
                        facturar: 0,
                        tipoVenta: 2,
                    })
                const { descuento, total } = calculateDiscount(currentRemision.detalles?.Cantidad ?? 1, o, currentRemision.detalles?.historico);
                setCurrentRemision({
                    ...currentRemision,
                    facturar: 0,
                    tipoVenta: 2,
                    reposicion: "0",
                    direccion: {
                        ...currentRemision.direccion,
                        idCliente: e,
                        cliente_facturacion: o
                    },
                    total: total,
                    descuento: descuento,
                    descuentocliente: descuento
                })
            },

        },
        {
            label: "Reposición",
            check: true,
            value: currentRemision.reposicion,
            fieldKey: 'reposicion',
            checked: currentRemision.reposicion,
            disabled: reposicion == "1" ? false : true,
            style: 'justify-center mt-5',
            onChangeFunc: (e) => {
                setCurrentRemision({
                    ...currentRemision,
                    reposicion: e.target.checked ? "1" : "0",
                    total: currentRemision.reposicion == 1 ? 0 : parseFloat(currentRemision.detalles.Cantidad) * parseFloat(currentRemision.detalles?.historico?.historico_precio),
                    descuento: currentRemision.reposicion == 1 ? parseFloat(currentRemision.detalles.Cantidad) * parseFloat(currentRemision.detalles?.historico?.historico_precio) : currentRemision.descuentocliente
                });
            }
        },
        {
            label: "Producto",
            fieldKey: 'producto',
            select: true,
            style: 'col-span-12 md:col-span-8  lg:col-span-4',
            options: selects.productos,
            value: currentRemision.detalles?.productoId,
            onChangeFunc: (e, o) => {
                if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION)
                    setRemisionToValidate({ ...remisionToValidate, producto: e })

                const { descuento, total } = calculateDiscount(currentRemision.detalles?.Cantidad, currentRemision.direccion?.cliente_facturacion, o.historico ?? null);
                // if (currentRemision.direccion?.cliente_facturacion) {
                //     if (currentRemision.direccion?.cliente_facturacion?.cliente_cienLitros == 0)
                //         descuento = currentRemision.direccion?.cliente_facturacion?.cliente_dscportanque
                //     else
                //         descuento = parseFloat(currentRemision.detalles?.Cantidad) < 100 ? '0.0000' : currentRemision.direccion?.cliente_facturacion?.cliente_dscportanque


                // }
                // descuento =
                setCurrentRemision({
                    ...currentRemision,
                    detalles: {
                        ...currentRemision.detalles,
                        productoId: e,
                        productos: o,
                        historico: o.historico,
                        Cantidad: 1
                    },
                    total: currentRemision.reposicion == 1 ? 0 : total,
                    descuento: currentRemision.reposicion == 1 ? parseFloat(currentRemision.cantidad) * parseFloat(o.historico) : descuento
                });
            },
            data: 'producto_nombre',
            valueKey: "producto_idProducto",
        },
        {
            label: "Cantidad",
            fieldKey: 'cantidad',
            input: true,
            type: 'decimal',
            style: 'col-span-12 md:col-span-4 lg:col-span-2',
            value: String(currentRemision.detalles?.Cantidad || '1'),
            overwrite: true,
            onChangeFunc: (e) => {
                const inValue = e.target.value !== "" ? e.target.value : 1

                if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION)
                    setRemisionToValidate({ ...remisionToValidate, cantidad: inValue })
                const { descuento, total } = calculateDiscount(inValue, currentRemision.direccion?.cliente_facturacion, currentRemision.detalles?.historico);

                setCurrentRemision({
                    ...currentRemision,
                    detalles: {
                        ...currentRemision.detalles,
                        Cantidad: inValue
                    },
                    total: currentRemision.reposicion == 1 ? 0 : total,
                    descuento: currentRemision.reposicion == 1 ? parseFloat(inValue) * parseFloat(currentRemision.detalles?.historico?.historico_precio) : descuento,
                });
            },
        },
        {
            label: "Bonificación",
            input: true,
            type: "decimal",
            style: 'col-span-4 lg:col-span-2',
            value: currentRemision.descuento || '0.0000',
            disabled: true
        },
        {
            label: "Precio",
            input: true,
            type: "decimal",
            customIcon: 'attach_money',
            style: 'col-span-4 lg:col-span-2',
            value: currentRemision.detalles?.historico?.historico_precio ?? '0.00',
            disabled: true
        },
        {
            label: "Total",
            input: true,
            type: "decimal",
            customIcon: 'attach_money',
            style: 'col-span-4 lg:col-span-2',
            value: parseFloat(currentRemision.total ?? 0),
            disabled: true
        },
        {
            label: "Estacion",
            fieldKey: 'estacionId',
            select: true,
            style: 'col-span-12 md:col-span-8  lg:col-span-4',
            value: currentRemision.estacionId,
            options: selects.estaciones,
            data: 'estacion_nombre',
            valueKey: "estacion_idEstacion",
            onChangeFunc: (e) => {
                if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION)
                    setRemisionToValidate({ ...remisionToValidate, estacionId: e })
                setCurrentRemision({
                    ...currentRemision,
                    estacionId: e
                })
            },
        },
        {
            label: "Tipo de venta",
            fieldKey: 'tipoVenta',
            select: true,
            style: 'col-span-12 md:col-span-4  lg:col-span-2',
            value: currentRemision.tipoVenta,
            options: selects.tipoVentas,
            onChangeFunc: (e) => {
                if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION)
                    setRemisionToValidate({ ...remisionToValidate, tipoVenta: e })
                setCurrentRemision({
                    ...currentRemision,
                    tipoVenta: e
                })
            },
            disabled: (currentRemision.direccion && currentRemision.direccion?.cliente_facturacion) ? (
                (currentRemision.direccion?.cliente_facturacion?.cliente_CreditoAutorizado == 0) ? true : false
            ) : true,
            data: 'catalogoMetodoPagoSAT_descripcion',
            valueKey: "catalogoMetodoPagoSAT_id",
        },
        {
            label: "Forma de pago",
            fieldKey: 'formaPago',
            select: true,
            style: 'col-span-12 md:col-span-8  lg:col-span-4',
            value: currentRemision.PaymentMethodId,
            options: selects.formasPago,
            onChangeFunc: (e) => {
                if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION)
                    setRemisionToValidate({ ...remisionToValidate, formaPago: e })
                setCurrentRemision({
                    ...currentRemision,
                    PaymentMethodId: e
                })
            },
            data: 'formasPago_descripcion',
            valueKey: "formasPago_idFormasPago",
        },
        {
            label: "Facturar",
            fieldKey: 'facturar',
            select: true,
            style: 'col-span-12 md:col-span-4  lg:col-span-2',
            options: [{ id: 1, value: 'NO' }, { id: 2, value: 'SI' }],
            value: currentRemision.facturar + 1,
            onChangeFunc: (e) => {
                if (empresa.empresa_ConsultaRemision == NO_CONSULTA_REMISION || data.rutaTlmk == NO_CONSULTA_REMISION)
                    setRemisionToValidate({ ...remisionToValidate, facturar: e })
                setCurrentRemision({
                    ...currentRemision,
                    facturar: e - 1
                })
            },
            data: 'value',
            valueKey: "id",

        },
        {
            label: "contado",
            custom: true,
            style: 'col-span-12 lg:col-span-2',
            customItem: ({ label }) => (
                <div className='grid grid-cols-2 lg:grid-cols-1 gap-2'>
                    <TextInput
                        label={`Kgs ${label}`}
                        type='decimal'
                        value={String(totales.lts.contado)}
                        disabled={true}
                    />
                    <TextInput
                        label={`Total ${label}`}
                        value={String(totales.price.contado)}
                        disabled={true}
                        type='decimal'
                        customIcon='attach_money'
                    />
                </div>
            )
        },
        {
            label: "credito",
            custom: true,
            style: 'col-span-12 lg:col-span-2',
            customItem: ({ label }) => (
                <div className='grid grid-cols-2 lg:grid-cols-1 gap-2'>
                    <TextInput
                        label={`Kgs ${label}`}
                        type='decimal'
                        value={String(totales.lts.credito)}
                        disabled={true}
                    />
                    <TextInput
                        label={`Total ${label}`}
                        type='decimal'
                        value={String(totales.price.credito)}
                        disabled={true}
                        customIcon='attach_money'
                    />
                </div>
            )
        },
        {
            label: "total",
            custom: true,
            style: 'col-span-12 lg:col-span-2',
            customItem: ({ label }) => (
                <div className='grid grid-cols-2 lg:grid-cols-1 gap-2'>
                    <TextInput
                        label={`Total kgs`}
                        type='decimal'
                        value={String(totales.lts.total)}
                        disabled={true}
                    />
                    <TextInput
                        label={`Total`}
                        type='decimal'
                        value={String(totales.price.total)}
                        disabled={true}
                        customIcon='attach_money'
                    />
                </div>
            )
        },
        {
            label: "Other",
            custom: true,
            style: 'flex lg:hidden col-span-12',
            customItem: ({ label }) => (<>
                <div style={{ zoom: 0.6 }}>
                    <Datatable
                        title="dasdasd"
                        data={remisionsTable}
                        selection='multiple'
                        virtual={true}
                        searcher={false}
                        selectedData={selectedRows}
                        selectionFunc={({ selectedRowKeys }) => setSelectedRows(selectedRowKeys)}
                        columns={[
                            { header: 'Folio', accessor: 'folio' },
                            { header: 'Remisión', accessor: 'remision' },
                            { header: 'TipoVenta', accessor: 'tipoVenta' },
                            { header: 'Cliente', accessor: 'cliente' },
                            { header: 'Producto', accessor: 'producto' },
                            { header: 'Facturar', accessor: 'facturar' },
                            { header: 'FormaPago', accessor: 'formaPago' },
                            { header: 'Cantidad', accessor: 'cantidad' },
                            { header: 'Precio', accessor: 'precio' },
                            { header: 'Bonificación', accessor: 'bonificacion' },
                            { header: 'Total', accessor: 'total' },
                        ]}
                    />
                </div>
            </>)
        },
    ]
};
import camionLogo from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';
import DialogComp, { FieldDrawer } from "@/components/DialogComp";
import CheckMenuPermission from "@/core/CheckMenuPermission";
import UserMenusContext from "@/Context/UserMenusContext";
import Datatable from "../../../../components/Datatable";
import { ButtonComp } from "@/components/ButtonComp";
import React, { useState, useEffect } from "react";
import { intPagoData, intPagoState, intPagoTotales } from './intPagoCartera';
import { moneyFormat, noty } from "@/utils";
import { Request } from "@/core/Request";
import { Divider } from '@mui/material';
import { useContext } from "react";
import moment from "moment";


export default function PagosCartera() {
    const { userMenus } = useContext(UserMenusContext);
    const [totales, setTotales] = useState(intPagoTotales)
    const [changedTax, setChangedTax] = useState([])
    const [state, setState] = useState(intPagoState)
    const [data, setData] = useState(intPagoData)

    const resetData = () => {
        setTotales(intPagoTotales)
        setChangedTax([])
        setState(intPagoState)
        setData(intPagoData)
        getCatalogs()
    }

    const getCatalogs = async () => {
        const [clienteRes, formasPagoRes, cuentaEmpresaRes] = await Promise.all([
            Request._get(route('clientes.index')),
            Request._get(route('formas-pago.index')),
            Request._get(route('banco-empresa-cuenta.index')),
        ]);
        setState(prev => ({
            ...prev,
            cuentasEmpresa: cuentaEmpresaRes,
            formasPago: formasPagoRes,
            clientes: clienteRes,
        }))
    }

    const handleResetTabe = (e) => {
        const newData = { ...e.oldData, ...e.newData };
        const indexTax = state.facturas.findIndex(f => f.idMovimientoCartera == newData.idMovimientoCartera)
        const copyTaxes = state.facturas
        setTotales(prev => ({
            ...prev,
            porAcreditar: prev.porAcreditar,
        }))
        copyTaxes[indexTax] = { ...e.oldData, desc: copyTaxes[indexTax].desc ?? 0 }

        setState({ ...state, facturas: copyTaxes })
    }

    const updateTable = (e) => {
        if (e.newData) {
            const newData = { ...e.oldData, ...e.newData };
            const currentTotal = totales.acreditados[newData.idMovimientoCartera] ?? 0;
            const nuevoValorAcreditar = parseFloat(newData.desc);
            const saldo = parseFloat(newData.saldo);

            if (nuevoValorAcreditar > saldo) {
                noty('El valor excede el saldo disponible.', 'error');
                handleResetTabe(e);
                return
            }
            if (Number.isNaN(nuevoValorAcreditar)) {
                noty('El valor tiene que ser un numero', 'error')
                handleResetTabe(e);
                return
            }

            const newTotales = {
                ...totales.acreditados,
                [newData.idMovimientoCartera]: nuevoValorAcreditar
            }
            const sumTutales = Object.values(newTotales).reduce((total, valor) => total + valor, 0);

            const nuevoAcreditar = data.importe - sumTutales;

            console.log(newTotales)
            if (nuevoAcreditar < 0) {
                noty('Monto por acreditar superado.', 'error');
                handleResetTabe(e);
                return
            }

            setTotales({
                ...totales,
                sumaAcreditados: sumTutales,
                porAcreditar: nuevoAcreditar,
                acreditados: {
                    ...totales.acreditados,
                    ...newTotales,
                }
            })

            setChangedTax([
                ...changedTax.filter(tax => tax.id != newData.idMovimientoCartera),
                {
                    id: newData.idMovimientoCartera,
                    nuevoValorAcreditar,
                    pagoDetalle_folio: newData?.factura_folio,
                    pagoDetalle_serie: newData?.factura_serie,
                    pagoDetalle_UUID: newData?.factura_folioFiscal,
                    pagoDetalle_importepagado: parseFloat(newData.desc),
                    pagoDetalle_partida: 1,
                    pagoDetalle_SaldoAnterior: parseFloat(newData.saldo),
                    pagoDetalle_SaldoPendiente: parseFloat(newData.saldo - newData.desc),
                    pagoDetalle_idMovimientoCarteraDetalle: newData.idMovimientoCartera
                }
            ])
        }
    }

    const submit = async () => {
        if (data.importe < changedTax.reduce((a, b) => a + b.pagoDetalle_importepagado, 0)) {
            noty('El importe no puede ser menor a la cantidad acreditada', 'error')
            return
        }
        const requestData = {
            pago_idCliente: data.pago_idCliente,
            pago_idAnticipo: parseInt(totales.porAcreditar),
            pago_idFormasPago: data.pago_idFormasPago,
            pago_documentoPago: data.documentoPago,
            pago_fecha: data.fechaMovimiento,
            pago_importe: data.importe,
            pago_total: totales.sumaAcreditados,
            pago_estatus: 1,
            pago_observaciones: data.observaciones,
            pago_idCuentaBancoCliente: data.pago_idCuentaBancoCliente,
            pago_idCuentaBancoEmpresa: data.pago_idCuentaBancoEmpresa,
            pago_cuentaCliente: data.pago_cuentaCliente,
            pago_cuentaEmpresa: data.pago_cuentaEmpresa,
            saldoDecrementar: changedTax,
        };
        const res = await Request._post(route("pago-cartera.store"), requestData, { enabled: true, error: { message: 'Error al aplicar el pago', type: 'error' }, success: { message: "Pago Aplicado", type: 'success' } })
        res.status && resetData()
    }

    const liquidarPorAntiguedad = () => {
        setTotales(intPagoTotales)
        let importeRestante = parseFloat(data.importe);
        let sumaLiquidada = 0;

        const saldosPendientes = [...state.facturas];
        saldosPendientes.sort((a, b) => new Date(a.FechaCreacion) - new Date(b.FechaCreacion));

        let cambios = []
        saldosPendientes.forEach(saldo => {
            const saldoAPagar = Math.min(importeRestante, saldo.saldo);
            saldo.desc = saldoAPagar;
            importeRestante -= saldoAPagar;
            sumaLiquidada += saldoAPagar;

            if (saldoAPagar > 0) {
                const cambioAutomatico = {
                    id: saldo.idMovimientoCartera,
                    nuevoValorAcreditar: saldoAPagar,
                    pagoDetalle_folio: saldo.factura_folio,
                    pagoDetalle_serie: saldo.factura_serie,
                    pagoDetalle_UUID: saldo.factura_folioFiscal,
                    pagoDetalle_importepagado: saldoAPagar,
                    pagoDetalle_partida: 1,
                    pagoDetalle_SaldoAnterior: parseFloat(saldo.saldo),
                    pagoDetalle_SaldoPendiente: parseFloat(saldo.saldo - saldoAPagar),
                    pagoDetalle_idMovimientoCarteraDetalle: saldo.idMovimientoCartera
                };

                cambios = [
                    ...cambios.filter(tax => tax.id != saldo.idMovimientoCartera),
                    cambioAutomatico
                ]
            }
        });

        setChangedTax(cambios);
        setTotales(prev => ({
            ...prev,
            porAcreditar: data.importe - cambios.reduce((a, b) => a + b.pagoDetalle_importepagado, 0)
        }))
    };

    const handleChangeCliente = async (val) => {
        await getCuentasCliente(val)
        await getFacturasCliente(val)
    }

    const getCuentasCliente = async (value) => {
        const cuentas = await Request._post(route("cuenta-cliente"), { id: value })
        setState((prev) => ({
            ...prev,
            cuentasCliente: cuentas
        }))
    }
    const getFacturasCliente = async (value) => {
        const facturas = (await Request._post(
            route("numero-cliente"),
            { numeroCliente: value }
        )).map(f => ({ ...f, desc: 0 }))

        setState((prev) => ({ ...prev, facturas: facturas }))
        setData(prev => ({
            ...prev,
            saldoTotal: facturas.map(f => parseFloat(f.saldo)).reduce((a, b) => a + b, 0)
        }))
    }

    useEffect(() => {
        getCatalogs()
    }, []);

    return (<>
        <div className='relative h-[100%] pb-4 px-3 -mt-4'>
            <div className='flex relative gap-3 sm:flex-col md:flex-row h-[90%]'>
                <div className='flex flex-col gap-2 pt-4 min-w-[300px]'>
                    {/* inputs */}
                    <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 '>
                        <FieldDrawer
                            fields={[
                                {
                                    label: 'Fecha movimiento',
                                    input: true,
                                    type: 'datetime-local',
                                    min: CheckMenuPermission(userMenus).special && moment()
                                        .subtract(3, 'days')
                                        .format('YYYY-MM-DDThh:mm'),
                                    value: data.fechaMovimiento,
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        fechaMovimiento: e.target.value
                                    })
                                },
                                {
                                    label: 'Cliente',
                                    select: true,
                                    fieldKey: 'Cliente',
                                    value: data.pago_idCliente,
                                    options: state.clientes.map(c => ({
                                        ...c,
                                        cliente_nombrecomercial: `${c.cliente_idCliente} - ${c.cliente_nombrecomercial}`
                                    })),
                                    data: 'cliente_nombrecomercial',
                                    valueKey: 'cliente_idCliente',
                                    onChangeFunc: (e, o) => {
                                        e && handleChangeCliente(e)
                                        setData(prev => ({
                                            ...prev,
                                            pago_idCliente: e,
                                            pago_idFormasPago: '',
                                            pago_cuentaCliente: '',
                                            pago_idCuentaBancoCliente: '',
                                            clienteObjeto: o,
                                            noCliente: e
                                        }))
                                    }
                                },
                                {
                                    label: 'Metodo de pago',
                                    select: true,
                                    fieldKey: 'pago',
                                    value: data.pago_idFormasPago,
                                    options: state.formasPago,
                                    data: 'formasPago_descripcion',
                                    valueKey: 'formasPago_idFormasPago',
                                    onChangeFunc: (e, o) => {
                                        setState({ ...state, showAccounts: o.formasPago_bancarizado == 1 })
                                        setData({ ...data, pago_idFormasPago: e })
                                    }
                                },
                                {
                                    label: 'Importe',
                                    input: true,
                                    type: 'decimal',
                                    maxLength: "20",
                                    customIcon: 'attach_money',
                                    fieldKey: 'Movimiento',
                                    value: data.importe,
                                    onChangeFunc: (e) => {
                                        const val = parseFloat(e.target.value)
                                        setData({ ...data, importe: val })
                                        setTotales({ ...totales, porAcreditar: val - totales.sumaAcreditados })
                                    }
                                },
                                {
                                    label: 'Doc. de pago',
                                    input: true,
                                    type: 'text',
                                    fieldKey: 'Movimiento',
                                    value: data.documentoPago,
                                    onChangeFunc: (e) => setData({ ...data, documentoPago: e.target.value })
                                },
                                {
                                    label: 'Anticipo',
                                    type: 'decimal',
                                    input: true,
                                    customIcon: 'attach_money',
                                    fieldKey: 'Movimiento',
                                    disabled: true,
                                    value: data.anticipo,
                                    onChangeFunc: (e) => setData({ ...data, anticipo: e })
                                },
                                {
                                    select: true,
                                    label: "Número de cuenta",
                                    value: data.pago_cuentaCliente,
                                    options: state.cuentasCliente,
                                    _conditional: () => state.showAccounts,
                                    onChangeFunc: (e, o) => setData({
                                        ...data,
                                        pago_cuentaCliente: o.cuentasBancoCliente_idCuentasBancoCliente,
                                        pago_idCuentaBancoCliente: e
                                    }),
                                    data: "cuentasBancoCliente_cuentaBancaria",
                                    valueKey: "cuentasBancoCliente_idCuentasBancoCliente",
                                }
                            ]}
                        />

                        <textarea
                            id="OrderNotes"
                            className="mt-4 w-full rounded-lg border-gray-300 align-top shadow-sm sm:text-sm max-h-[70px]"
                            rows="4"
                            maxLength="250"
                            placeholder="Observaciones"
                            value={data.observaciones}
                            onChange={(e) => setData({ ...data, observaciones: e.target.value })}>
                        </textarea>
                    </div>
                    {/* saldos */}
                    <div className='flex !text-[12px] flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                        <div className='flex justify-between'>
                            <span>Saldo del Cliente:</span>
                            <span>$ {moneyFormat(data.saldoTotal)}</span>
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Crédito:</span>
                            <span>$ {moneyFormat(data.importe)}</span>
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Por Acreditar:</span>
                            <span>$ {moneyFormat(totales.porAcreditar)}</span>
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <ButtonComp
                                color="#4e5b90"
                                onClick={liquidarPorAntiguedad}
                                label="Liquidar por antigüedad"
                                className="!mt-[0] !text-[12px]"
                            />
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <ButtonComp
                                color="#4e5b90"
                                onClick={resetData}
                                label="Inicializar"
                                className="!mt-[0] !text-[12px]"
                            />
                        </div>
                    </div>
                </div>
                <div className="relative col-span-10 mx-5 w-full mt-4">
                    <div className='block-flex justify-end mb-4'>
                        <ButtonComp
                            label='Guardar pago'
                            className="!w-[30%] !mt-2 !bg-excel-color"
                            onClick={() => {
                                const selectedOption = state.formasPago
                                    .find(fp => fp.formasPago_idFormasPago === data.pago_idFormasPago);

                                if (selectedOption &&
                                    selectedOption.formasPago_bancarizado == 1) setState({ ...state, open: true });
                                else submit();

                            }}
                        />
                    </div>
                    {data.pago_idCliente ? (
                        <Datatable
                            searcher={false}
                            virtual={true}
                            data={state.facturas}
                            handleRowUpdating={updateTable}
                            editingMode={{ mode: "cell", allowUpdating: true }}
                            columns={[
                                { width: '10%', header: "Facturas", cell: ({ item }) => <>{item?.Facturado_idFactura}</> },
                                { width: '12%', header: "Remisiones", cell: ({ item }) => <>{item?.detalle_venta?.ventaDetalle_remision}</> },
                                { width: '13%', header: "Fecha", cell: ({ item }) => <>{new Date(item?.FechaCreacion).formatMXNoTime()}</> },
                                { width: '18%', header: "Fecha Vencimiento", cell: ({ item }) => <>{new Date(item?.FechaHora).formatMXNoTime()}</> },
                                { width: '19%', header: 'Importe', cell: ({ item }) => `$ ${moneyFormat(item.importe)}` },
                                { width: '19%', header: 'Saldo', cell: ({ item }) => `$ ${moneyFormat(item.saldo)}` },
                                { width: '19%', header: "Acreditar", accessor: 'desc' }
                            ]}
                        />
                    ) : (
                        <>
                            <div className='mt-[-50px] flex  flex-col relative h-full items-center overflow-hidden self-center justify-center'>
                                <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                                <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div >
        <DialogComp
            dialogProps={{
                model: 'Cuentas Bancarias',
                width: 'sm',
                openState: state.open,
                actionState: '',
                customTitle: true,
                openStateHandler: () => setState({
                    ...state,
                    open: false
                }),
                onSubmitState: () => submit
            }}
            fields={[
                {
                    label: 'Banco',
                    select: true,
                    fieldKey: 'Banco',
                    value: data.pago_idCuentaBancoEmpresa,
                    options: state.cuentasEmpresa,
                    data: 'CuentasBancoEmpresa_Descripcion',
                    valueKey: 'CuentasBancoEmpresa_idBancoEmpresa',
                    onChangeFunc: (e, o) => setData({
                        ...data,
                        pago_idCuentaBancoEmpresa: e,
                        pago_cuentaEmpresa: o.CuentasBancoEmpresa_Cuenta ?? null
                    })
                },
            ]} />
    </>)
}
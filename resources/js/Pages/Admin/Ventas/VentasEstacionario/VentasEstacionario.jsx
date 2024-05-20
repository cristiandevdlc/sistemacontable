import { IntPdfEstData, IntRemissionTotals, IntStateVentas, IntVentaEstacionario, IntVentaFinalData } from './IntVentaEstacionario';
import request, { ServiceTypes, fileDownloader, noty } from "@/utils";
import { Save, FiberNew, Add, Edit, Error } from '@mui/icons-material';
import { ButtonComp } from '@/components/ButtonComp';
import DatosEstacionario from './DatosEstacionario';
import React, { useEffect, useState } from 'react';
import DialogComp from '@/components/DialogComp';
import SelectComp from '@/components/SelectComp';
import TextInput from '@/components/TextInput';
import { Request } from '@/core/Request';
import { Button } from '@mui/material';
import moment from 'moment';
import PDFVisualizer from '@/components/PDFVisualizer';
import PDFVentaEstacionario from './PDFVentaEstacionario';

export default function VentasEstacionario({ }) {
    const [alert, setAlert] = useState("");
    const [data, setData] = useState(IntVentaEstacionario);
    const [states, setStates] = useState(IntStateVentas)
    const [totales, setTotales] = useState(IntRemissionTotals)
    const [remisionsData, setRemisionsData] = useState([])
    const [empresa, setEmpresa] = useState({})
    const [errors, setErrors] = useState({})
    const [ventaReqData, setVentaReqData] = useState(IntVentaFinalData)
    const [pdfData, setPdfData] = useState(IntPdfEstData)

    const wipeData = () => {
        setData(IntVentaEstacionario)
        setVentaReqData(IntVentaFinalData)
        setStates({ ...states, motivo: '', enableEditExit: false, onlyPrint: false })
        setTotales(IntRemissionTotals)
        setRemisionsData([])
        setPdfData(IntPdfEstData)
    };

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    useEffect(() => {
        fetchData();
        getMenuName();
    }, []);

    const fetchData = async () => {
        const [
            zonasResponse,
            lecturaResponse,
            turnosResponse,
            unidadesResponse,
            vendedoresResponse,
            supervisoresResponse,
            empresaData,
            motivosCambios
        ] = await Promise.all([
            fetch(route("zonas.index")).then(res => res.json()),
            fetch(route("LecturaActivada")).then(res => res.json()),
            fetch(route('turno.index')).then(res => res.json()),
            fetch(route("unidades-ventas-estacionarias")).then(res => res.json()),
            fetch(route("persona.vendedores")).then(res => res.json()),
            fetch(route("persona.supervisores")).then(res => res.json()).then(res => res.map(supervisor => {
                return { ...supervisor, NombreCompleto: `${supervisor.Nombres} ${supervisor.ApePat} ${supervisor.ApeMat}` };
            })),
            fetch(route('empresas-loggeada')).then(res => res.json()),
            fetch(route('CambioLectura.index')).then(res => res.json()),
        ]);

        setEmpresa(empresaData)
        setStates({
            ...IntStateVentas,
            zonas: zonasResponse,
            lectura: lecturaResponse,
            turnos: turnosResponse,
            unidades: unidadesResponse,
            vendedores: vendedoresResponse,
            supervisores: supervisoresResponse,
            motivosCambios: motivosCambios
        })
    }

    const remision = async (e) => {
        const validacion = await request(route('validar-remision-unidad'), 'POST', data, { enabled: true });

        if (!validacion.status) {
            // console.log({
            //     ...data,
            //     extras: {
            //         ...data.extras,
            //         quienConQuien: validacion.quienConQuien?.quienConQuien_idQuienConQuien,
            //         preCorte: validacion.quienConQuien?.pre_corte?.preCorte_idPreCorte
            //     }
            // })
            setAlert("No existe esta relación en quien con quien.")
            return
        }
        if (!data.supervisor) setAlert("La propiedad 'supervisor' está nula.")
        else if (!data.ayudante1) setAlert("La propiedad Ayudante 1 está nula.")
        else if (!data.zona) setAlert("La propiedad Zona está nula.")
        else if (!data.unidad) setAlert("La propiedad Unidad está nula.")
        else if (parseFloat(data.regresoCon) < parseFloat(data.salioCon)) setAlert("Ingresa un valor mas alto de salida.")
        else {
            setData({
                ...data,
                extras: {
                    ...data.extras,
                    quienConQuien: validacion.quienConQuien?.quienConQuien_idQuienConQuien,
                    preCorte: validacion.quienConQuien?.pre_corte?.preCorte_idPreCorte
                }
            })
            setStates({ ...states, dialogRemision: !states.dialogRemision }); setAlert('')
        };

    };

    useEffect(() => {
        setTotales(IntRemissionTotals)
    }, [data.unidad]);

    const datosGenerales = async (u = data.unidad, f = data.fecha) => {
        if (u) {
            const response = await Request._post(route('datos-generales-ventas'), { id: u, fecha: f });
            if (response.data) {
                setData({
                    ...IntVentaEstacionario,
                    ...data,
                    unidad: u,
                    fecha: f,
                    rutaTlmk: response.data?.ruta?.ruta_liquidarTelemark,
                    supervisor: response.data?.supervisor?.IdPersona || 0,
                    zona: response.data?.zona?.zona_idZona || 0,
                    turno: response.data?.ruta?.ruta_idTurno || 0,
                    operador: response.data?.vendedor?.IdPersona || 0,
                    ayudante1: response.data?.ayudante?.IdPersona || 0,
                    ayudante2: response.data?.ayudante2?.nombre_completo || 0,
                    tanques: 0,
                    red: response.data?.red?.red_numero || 0,
                    regresoCon: response.lastEntry?.lectura || '0.0000',
                    salioCon: response.lastReg?.lectura || '0.0000',
                    vendidos: 0, contado: 0, credito: 0,
                    extras: {
                        quienConQuien: response.data?.quienConQuien_idQuienConQuien || 0,
                        tipoServicio: response.data?.unidad?.unidad_idTipoServicio || 0,
                        preCorte: response.data?.pre_corte?.preCorte_idPreCorte || 0,
                        lastReg: response.lastReg
                    }
                });

                (response.lastEntry?.lectura == null) && noty('Esta unidad aun no ha marcado entrada', 'error')

                setStates({ ...states, motivo: '', enableEditExit: false })
            }
            else {
                setData({
                    ...IntVentaEstacionario,
                    unidad: u,
                    fecha: f,
                });
            }
        } else {
            setData({
                ...IntVentaEstacionario,
                ...data,
                unidad: u,
                fecha: f,
            })
        }
    };

    useEffect(() => {
        setData({
            ...data,
            vendidos: data.regresoCon - data.salioCon,
            diferencia: data.regresoCon - data.salioCon
        })
    }, [data.regresoCon, data.salioCon]);

    const addRemission = async (e) => {
        if (!states.onlyPrint) {
            const ventaDetalle = remisionsData.map((v) => {
                return {
                    ventaDetalle_idProducto: v.detalles?.productos?.producto_idProducto,
                    ventaDetalle_idCliente: v.direccion?.idCliente,
                    ventaDetalle_idMetodoPago: v.tipoVenta,
                    ventaDetalle_idEstacion: v.estacionId,
                    ventaDetalle_OrderDetailId: v.detalles?.pedidoDetallesId,
                    ventaDetalle_idFormasPago: v.PaymentMethodId,
                    ventaDetalle_PrecioProducto: v.detalles?.historico?.historico_precio,
                    ventaDetalle_bonificacion: (v.detalles?.historico?.historico_precio * v.detalles?.Cantidad) - v.total ?? 0,
                    // ventaDetalle_bonificacion: v.direccion?.cliente_facturacion?.cliente_descuento ?? 0,
                    ventaDetalle_remision: v.detalles?.remision ?? 0,
                    ventaDetalle_cantidad: v.detalles?.Cantidad,
                    ventaDetalle_facturar: v.facturar,
                    ventaDetalle_totalKiloLitro: v.detalles?.Cantidad,
                    ventaDetalle_IVA: (v.total / 1.16) * 0.16,
                    ventaDetalle_total: v.total,
                    direccionId: v.direccionPedidosId ?? null
                }
            })

            const dataVenta = await request(route('venta-estacionario'), 'POST', {
                ventaEncabezado_idZona: data.zona,
                ventaEncabezado_idTurno: data.turno,
                ventaEncabezado_idQuienConQuien: data.extras?.quienConQuien,
                ventaEncabezado_idTipoServicio: ServiceTypes.ESTACIONARIO,
                ventaEncabezado_idPreCorte: data.extras?.preCorte,
                ventaEncabezado_totalVentaImporteCredito: totales.price.credito,
                ventaEncabezado_totalVentaImporteContado: totales.price.contado,
                ventaEncabezado_lecturaEstacionSalida: data.salioCon,
                ventaEncabezado_lecturaEstacionEntrada: data.regresoCon,
                remisionesData: ventaDetalle,
                fechaVenta: data.fecha,
                lecturaAnterior: data.lecturaAnterior,
                idMotivo: states.motivo
            });


            setVentaReqData({ ventaDetalle: ventaDetalle, dataVenta: dataVenta })
            dataVenta.status && setStates({ ...states, onlyPrint: !states.onlyPrint })

            const newDate = new Date(data.fecha)

            setPdfData({
                fecha: data.fecha,
                operador: states.vendedores.find(v => v.IdPersona === data.operador)?.nombre_completo,
                unidad: states.unidades.find(u => u.unidad_idUnidad === data.unidad)?.unidad_numeroComercial,
                contado: totales.lts.contado,
                credito: totales.lts.credito,
                total: totales.lts.total,
                totalcredito: totales.price.credito,
                totalpago: totales.price.contado,
                folio: dataVenta.ventaEncabezado.ventaEncabezado_idVentaEncabezado,
                print: true
            })
        }
        setStates(prev => ({ ...prev, openPrint: !states.openPrint }))
    };

    const handleLecturaDialog = async () => {
        setStates({ ...states, enableEditExit: true, dialogLectura: !states.dialogLectura })
        setData({ ...data, lecturaAnterior: data.salioCon })
    }

    const enableSaveSale = () => {
        const enable = { button: true, color: false }
        const diff = parseFloat((data.diferencia - totales.lts.total).toFixed(3));

        enable.button = remisionsData.length === 0 || diff !== 0
        enable.color = remisionsData.length !== 0 && diff === 0

        // 0.0004000000000132786
        // console.log("DIFERENCIA: ", Math.abs(diff, 0))
        // // console.log("DIFERENCIA: ", diff.toFixed(3) )
        // console.log("DESACTIVADO: ",enable.button)
        return enable
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className='flex overflow-y-auto h-[100%] md:items-center blue-scroll'>
                <div className="flex gap-6 sm:flex-col md:flex-row w-full">
                    <div className='border-2 w-full shadow-md px-4 p-5 rounded-xl'>
                        <h2 className="text-2xl font-bold sm:text-2xl">Ventas Estacionario</h2>

                        <TextInput
                            label="Fecha"
                            type="datetime-local"
                            value={data.fecha}
                            max={moment().add(1, 'day').format('YYYY-MM-DDThh:mm')}
                            style={{ width: '100%' }}
                            disabled={(remisionsData.length !== 0)}
                            onChange={(e) => datosGenerales(data.unidad, e.target.value)}
                        />
                        <div className='grid grid-cols-2 md-3 gap-x-2 '>

                            <SelectComp
                                label="Unidad"
                                value={data.unidad || ""}
                                onChangeFunc={(newValue) => datosGenerales(newValue, data.fecha)}
                                options={states.unidades}
                                disabled={(remisionsData.length !== 0)}
                                data="unidad_numeroComercial"
                                valueKey="unidad_idUnidad"
                            />
                            <SelectComp
                                label="Turno"
                                value={data.turno || ""}
                                onChangeFunc={(newValue) => setData({ ...data, turno: newValue })}
                                options={states.turnos}
                                disabled={(remisionsData.length !== 0)}
                                data={'turno_nombreTurno'}
                                valueKey="turno_idTurno"
                            />
                            <SelectComp
                                label="Zonas"
                                value={data.zona || ""}
                                onChangeFunc={(newValue) => setData({ ...data, zona: newValue })}
                                options={states.zonas}
                                disabled={(remisionsData.length !== 0)}
                                data={'zona_descripcion'}
                                valueKey="zona_idZona"
                            />
                            <TextInput
                                label="Red"
                                type="text"
                                value={data.red}
                                style={{ width: '100%' }}
                                disabled={(remisionsData.length !== 0)}
                                autoComplete="red"
                                readOnly
                                onChange={(e) => setData({ ...data, red: e.target.value })}
                            />
                        </div>
                        <div className='flex justify-center gap-2'>
                            <SelectComp
                                label="Operador"
                                value={data.operador || ""}
                                onChangeFunc={(newValue) => setData({ ...data, operador: newValue })}
                                disabled={(!states.editOperador || (remisionsData.length !== 0))}
                                options={states.vendedores}
                                data='nombre_completo'
                                valueKey="IdPersona"
                            />
                            <ButtonComp
                                label={<><Add /></>}
                                className={`!w-[25px] ${(remisionsData.length !== 0) ? '!bg-[#f78b5e]' : '!bg-[#FC4C02]'}`}
                                disabled={(remisionsData.length !== 0)}
                                onClick={() => setStates({ ...states, editOperador: !states.editOperador })}
                            />
                        </div>
                        <div className='flex justify-center  gap-2'>
                            <SelectComp
                                label="Ayudante 1"
                                value={data.ayudante1 || ""}
                                onChangeFunc={(newValue) => setData({ ...data, ayudante1: newValue })}
                                options={states.vendedores}
                                disabled={(!states.editAyudante || (remisionsData.length !== 0))}
                                data='nombre_completo'
                                valueKey="IdPersona"
                            />
                            <ButtonComp
                                label={<><Add /></>}
                                className={`!w-[25px] ${(remisionsData.length !== 0) ? '!bg-[#f78b5e]' : '!bg-[#FC4C02]'}`}
                                disabled={(remisionsData.length !== 0)}
                                onClick={() => setStates({ ...states, editAyudante: !states.editAyudante })}
                            />
                        </div>

                        <TextInput
                            label="Ayudante 2"
                            type="text"
                            value={data.ayudante2 || "SIN AYUDANTE"}
                            autoComplete="ayudante2"
                            disabled={remisionsData.length !== 0}
                            onChange={(e) => setData({ ...data, ayudante2: e.target.value })}
                        />

                        <div className='flex justify-center gap-2'>
                            <SelectComp
                                label="Supervisor"
                                value={data.supervisor || ""}
                                onChangeFunc={(newValue) => setData({ ...data, supervisor: newValue })}
                                disabled={(!states.editSupervisor || (remisionsData.length !== 0))}
                                options={states.supervisores}
                                data='NombreCompleto'
                                valueKey="IdPersona"
                            />

                            <ButtonComp
                                label={<><Add /></>}
                                className={`!w-[25px] ${(remisionsData.length !== 0) ? '!bg-[#f78b5e]' : '!bg-[#FC4C02]'}`}
                                disabled={(remisionsData.length !== 0)}
                                onClick={() => setStates({ ...states, editSupervisor: !states.editSupervisor })}
                            />
                        </div>

                        <div className='flex justify-center gap-2'>

                            <TextInput
                                label="Lectura inicial"
                                type="decimal"
                                // value={data.salioCon.toString()}
                                value={(data.salioCon ?? 0).toString()}
                                onChange={(e) => setData({ ...data, salioCon: e.target.value })}
                                disabled={!states.enableEditExit}
                            />

                            <ButtonComp
                                label={<><Edit /></>}
                                className={`!w-[25px] !bg-[#FC4C02]`}
                                onClick={() => { setStates({ ...states, dialogLectura: !states.dialogLectura }) }}
                            />
                        </div>

                        <div className='grid grid-cols-3 md-2 gap-x-2 '>
                            <TextInput
                                label="Lectura final"
                                type="decimal"
                                value={(data.regresoCon ?? 0).toString()}
                                // disabled={true}
                                onChange={(e) => setData({ ...data, regresoCon: e.target.value })}
                            />


                            <TextInput
                                label="Vendidos"
                                type="decimal"
                                disabled={true}
                                value={(data.vendidos ?? 0).toString()}
                                onChange={() => { }}
                            />

                            <TextInput
                                label="Diferencia"
                                type="decimal"
                                disabled={true}
                                value={((data.diferencia - totales.lts.total ?? 0)).toString()}
                                onChange={() => { }}
                            />

                        </div>

                        <div className='grid grid-cols-2 md-2 gap-x-4'>
                            <ButtonComp
                                label={<>{states.onlyPrint ? "Imprimir venta" : 'Guardar venta'} <FiberNew className='ms-2' /> </>}
                                disabled={enableSaveSale().button}
                                onClick={addRemission}
                            />
                            <ButtonComp
                                label={<>{states.onlyPrint ? 'Nueva venta' : 'Limpiar campos'} <FiberNew className='ms-2' /> </>}
                                onClick={wipeData}
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-4 justify-between'>
                        <div className="flex flex-col border-2 w-full justify-center shadow-md px-4 pb-3 rounded-xl">
                            <div className="w-full">
                                <div className='grid grid-cols-1 md-2 gap-x-2 '>


                                    <TextInput
                                        label="Remisiones"
                                        type="number"
                                        // className='col-span-2'
                                        value={totales.remisiones.toString()}
                                        disabled={true}
                                    />
                                    <TextInput
                                        label="Lts de Contado"
                                        type="decimal"
                                        value={totales.lts.contado.toString()}
                                        disabled={true}
                                    />
                                    <TextInput
                                        label="Lts de Credito"
                                        type="decimal"
                                        value={totales.lts.credito.toString()}
                                        disabled={true}
                                    />
                                    <TextInput
                                        label="Litros"
                                        type="decimal"
                                        value={totales.lts.total.toString()}
                                        disabled={true}
                                    />

                                    <TextInput
                                        label="Credito"
                                        type="decimal"
                                        customIcon='attach_money'
                                        value={totales.price.credito.toString()}
                                        disabled={true}
                                    />
                                    <TextInput
                                        label="Contado"
                                        type="decimal"
                                        customIcon='attach_money'
                                        value={totales.price.contado.toString()}
                                        disabled={true}
                                    />
                                    <TextInput
                                        type="decimal"
                                        label="Total"
                                        customIcon='attach_money'
                                        value={totales.price.total.toString()}
                                        disabled={true}
                                    />
                                    <ButtonComp
                                        label={<>Añadir remision <Save className='ms-2' /> </>}
                                        disabled={!(data.supervisor && data.ayudante1 && data.zona && data.unidad && (parseFloat(data.regresoCon) >= parseFloat(data.salioCon)) && !states.onlyPrint)}
                                        onClick={remision}
                                    />
                                </div>

                            </div>
                        </div>
                        {alert && (
                            <div role="alert" className="rounded border-s-4 border-red-500 bg-red-50 p-4">
                                <div className="flex items-center gap-2 text-red-800">
                                    <Error />
                                    <strong className="block font-medium"> Error en el campo </strong>
                                </div>
                                <p className="mt-2 text-sm text-red-700">{alert}</p>
                            </div>
                        )}
                    </div>
                </div>
                <DialogComp
                    dialogProps={{
                        model: `Remisiones de ${states.vendedores.find(v => v.IdPersona === data.operador)?.nombre_completo}, Unidad ${states.unidades.find(u => u.unidad_idUnidad === data.unidad)?.unidad_numeroComercial}`,
                        width: '2xl',
                        openState: states.dialogRemision,
                        customTitle: true,
                        openStateHandler: () => setStates({ ...states, dialogRemision: !states.dialogRemision }),
                        style: 'grid grid-cols-12 gap-x-3 dialogRemission',
                        onSubmitState: () => { },
                        customAction: () => <><Button color="success" onClick={() => setStates({ ...states, dialogRemision: !states.dialogRemision })}>Guardar</Button></>
                    }}
                    fields={DatosEstacionario(data, empresa, states, totales, setTotales, remisionsData, setRemisionsData, setErrors)}
                    errors={errors}
                />
                <DialogComp
                    dialogProps={{
                        model: `Motivo de cambio de lectura`,
                        width: 'sm',
                        enableOnClose: false,
                        openState: states.dialogLectura,
                        customTitle: true,
                        openStateHandler: () => setStates({ ...states, dialogLectura: !states.dialogLectura }),
                        onSubmitState: () => handleLecturaDialog,
                        actionState: 'create'
                    }}
                    fields={[
                        {
                            select: true,
                            label: "Motivo",
                            options: states.motivosCambios,
                            value: states.motivo,
                            onChangeFunc: (newValue) => setStates({ ...states, motivo: newValue }),
                            data: 'descripcion',
                            valueKey: "idmotivocambiolectura",
                        }
                    ]}
                    errors={errors}
                />
                <PDFVisualizer
                    dialogProps={{
                        model: `Venta estacionaria`,
                        openState: states.openPrint,
                        customTitle: true,
                        openStateHandler: () => setStates({ ...states, openPrint: !states.openPrint }),
                        onSubmitState: () => { },
                        actionState: 'create'
                    }}
                    PDFView={(<PDFVentaEstacionario data={pdfData} />)}
                />
            </div>
        </div>
    );
}
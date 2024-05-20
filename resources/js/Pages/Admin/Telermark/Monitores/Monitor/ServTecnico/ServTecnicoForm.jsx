import SelectComp from '@/components/SelectComp'
import TextInput from '@/components/TextInput'
import { Checkbox, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel } from '@mui/material'
import { PDFDownloadLink } from '@react-pdf/renderer'
import React from 'react'
import { useState } from 'react'
import ReportePDF from './ReportePDF'
import request from '@/utils'
import { useEffect } from 'react'
import { useContext } from 'react'
import UserMenusContext from '@/Context/UserMenusContext'
import CheckMenuPermission from '@/core/CheckMenuPermission'

const ServTecnicoForm = ({
    estado,
    pedido,
    action,
    check,
    historial,
    soluciones,
    onChangeCheck,
    onChangeSolucion,
    onChangeServicio,
    onChangeCantidad,
    checkCambioTanque,
    onChangeCheckCambioTanque,
    onChangeTecnico,
    handleCloseModal,
    RefreshAfterAction
}) => {
    const [compState, setCompState] = useState({ solucion: null, vendedor: null, tecnico: '' })
    const [denied, setDenied] = useState(false)
    const { state } = useContext(UserMenusContext)
    const historialArray = historial?.pedidos
    const fechaActual = new Intl.DateTimeFormat('es-MX').format(new Date)

    const submit = async () => {
        // setData({ ...data, detalles: { ...data.detalles, servicio: data.detalles.servicio + ' ' + compState.obs } })
        if (action === 'confServ') {
            await request(
                route('pedidos-detalle.update', pedido.detalles.pedidoDetallesId),
                "PUT",
                { ...pedido, estatus: 2, detalles: { ...pedido.detalles, estatus: 2, servicio: pedido.detalles.servicio + ' ' + estado.obs + ';' } })
                .then(() => {
                    RefreshAfterAction()
                    handleCloseModal()
                    // fetchdata()
                })
        }
        if (action === 'rdg') {
            await Promise.all([
                request(
                    route('pedidos-detalle.update', pedido.detalles.pedidoDetallesId),
                    "PUT",
                    { ...pedido, tipo: action, estatus: 1, detalles: { ...pedido.detalles, estatus: 1, servicio: pedido.detalles.servicio + ' ' + estado.obs + ';' } }),
                request(
                    route('reposicion-serv-tec.store'),
                    "POST",
                    { ...pedido, comentarios: estado.obs }
                )
            ])
                .then(() => {
                    RefreshAfterAction()
                    handleCloseModal()
                    // fetchdata()
                })
        }
        if (action === "envio") {
            if (CheckMenuPermission(state.userMenus).special) {
                await request(
                    route('pedidos-detalle.update', pedido.detalles.pedidoDetallesId),
                    "PUT",
                    { ...pedido })
                    .then(() => {
                        RefreshAfterAction()
                        handleCloseModal()
                    })
            } else {
                setDenied(true)
            }
        }
    }

    useEffect(() => {
        setCompState({ solucion: null, vendedor: null, tecnico: '' })
    }, [])

    return (
        <>
            <div className='grid grid-rows-6 h-full'>
                <div className='flex flex-col gap-5 row-span-5 pt-2 mx-3'>
                    <div className='flex justify-between'>
                        {action !== "envio" &&
                            <span>
                                Folio
                            </span>
                        }
                        {pedido &&
                            action === "envio" ? "Telemark" : (action === "surtir" ? `#${pedido.pedidoId}` : `#${pedido.pedidoId}`)
                        }
                    </div>
                    <form className='' id="register-form" onSubmit={e => e.preventDefault()}>
                        <div className="flex flex-col mt-0 gap-1">
                            {action === "confServ" &&
                                <SelectComp
                                    className={"h-12"}
                                    label="Solución"
                                    disabled={false}
                                    options={soluciones}
                                    value={pedido.detalles.otroVendedor || ''}
                                    data="descripcion"
                                    valueKey="idsoluciones"
                                    onChangeFunc={onChangeSolucion}
                                />
                            }
                            {action === "rdg" &&
                                <div className='flex'>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                                                checked={checkCambioTanque || false}
                                                onChange={onChangeCheckCambioTanque}
                                            />
                                        }
                                        label="Cambio de tanque"
                                    />
                                    <TextInput
                                        label="Cantidad a reponer (kg)"
                                        id="kg"
                                        // type="number"
                                        name="kg"
                                        value={pedido.detalles.rdg}
                                        className="block w-full mt-1 texts"
                                        // autoComplete="kg"
                                        isFocused={false}
                                        onChange={onChangeCantidad}
                                    />
                                </div>
                            }
                            {action === "envio" &&
                                <div className='pt-[2vh]'>Técnico al que se pasa el servicio</div>
                            }
                            <div className=''>
                                {action === "rdg" ? (
                                    <SelectComp
                                        className={"h-12"}
                                        label={"Vendedor"}
                                        disabled={action !== "envio" ? !check : false}
                                        options={estado.vendedoresRDG}
                                        value={pedido.IdVendedor ?? ''}
                                        data="nombre_completo"
                                        valueKey="IdPersona"
                                        onChangeFunc={onChangeTecnico}
                                    />
                                ) : (
                                    <SelectComp
                                        className={"h-12"}
                                        label={"Técnico"}
                                        disabled={action !== "envio" ? !check : false}
                                        options={estado.tecnicos}
                                        // firstLabel={''}
                                        // firstOption={true}
                                        value={estado.vendedor ?? ''}
                                        data="nombre_completo"
                                        valueKey="IdPersona"
                                        onChangeFunc={onChangeTecnico}
                                    />
                                )
                                }
                                {action !== "envio" &&
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                                                checked={check || false}
                                                onChange={onChangeCheck}
                                            />
                                        }
                                        label={action === "rdg" ? "Vendedor a cobrar" : "Solucionó otro técnico"}
                                        className='pt-[2vh]'
                                    />
                                }
                            </div>
                            <TextInput
                                label={action === "rdg" ? "Observaciones *" : "Otro"}
                                id="servicio"
                                type="text"
                                name="servicio"
                                value={estado.obs}
                                className="block w-full mt-1 texts"
                                autoComplete="servicio"
                                isFocused={false}
                                onChange={onChangeServicio}
                            />
                        </div>
                    </form>
                </div>
                <div className='grid row-span-1 content-end'>
                    {
                        (estado.obs === '') ? (
                            <button className='text-center w-full h-[50px] bg-[#37ae00] rounded-lg text-white' style={{ opacity: '55%' }} disabled={estado.obs === ''} onClick={submit}>
                                Reporte
                            </button>
                        ) : (
                            <button className='text-center w-full h-[50px] bg-[#37ae00] rounded-lg text-white' disabled={estado.obs === ''} onClick={submit}>
                                {action === "rdg" ? (
                                    <PDFDownloadLink document={<ReportePDF data={pedido} estado={estado} historial={historialArray} />} fileName={`Reposición_${pedido.cliente}_${fechaActual}.pdf`}>
                                        {({ blob, url, loading, error }) =>
                                            loading ? 'Generando PDF...' : 'Reporte'
                                        }
                                    </PDFDownloadLink>
                                ) : (
                                    "Guardar"
                                )
                                }
                            </button>
                        )
                    }
                </div>
            </div>
            <Dialog open={denied} onClose={() => setDenied(false)} maxWidth={'xs'}>
                <DialogTitle>
                    Lo sentimos
                </DialogTitle>
                <div className='flex justify-center'>
                    <Divider className='w-[95%]' />
                </div>
                <DialogContent>
                    <div className='flex flex-col p-0 gap-4'>
                        <span>
                            No tienes permiso para realizar esta acción, consulta con tu supervisor.
                        </span>
                        <div className='text-center'>
                            <button className='text-center px-8 h-[40px] bg-[#2e3d81] rounded-lg text-white' onClick={() => setDenied(false)}>Aceptar</button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ServTecnicoForm
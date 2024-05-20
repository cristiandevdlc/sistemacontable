import UserMenusContext from '@/Context/UserMenusContext';
import SelectComp from '@/components/SelectComp';
import TextInput from '@/components/TextInput';
import CheckMenuPermission from '@/core/CheckMenuPermission';
import request, { noty } from '@/utils';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel } from '@mui/material';
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const ServTransitoForm = ({
    monitor,
    estado,
    action,
    pedido,
    onChangeCheck,
    check,
    motivosCancelacion,
    onChangeRemision,
    onChangeMotivoCanId,
    onChangeCantidadVenta,
    // onChangeClaveSup,
    onChangeMotivoCanDes,
    onChangeServicio,
    onChangeVendedor,
    RefreshAfterAction,
    handleCloseModal
}) => {
    const [compState, setCompState] = useState({ remision: '', Cantidad: pedido.detalles.Cantidad })
    const [denied, setDenied] = useState(false)
    const { state } = useContext(UserMenusContext)

    const submit = async () => {
        if (action === 'surtir') {
            if (!compState.remision) {
                noty("La remision es requerida", "error")
                return
            }
            await request(
                route('pedidos-detalle.update', pedido.detalles.pedidoDetallesId),
                "PUT",
                { ...pedido, estatus: 2, detalles: { ...pedido.detalles, remision: compState.remision, Cantidad: compState.Cantidad, estatus: 2, servicio: pedido.detalles.servicio + ' ' + estado.obs + ';' } })
                .then(() => {
                    RefreshAfterAction()
                    handleCloseModal()
                    // fetchdata()
                })
        }
        if (action === 'cancelar') {
            if (CheckMenuPermission(state.userMenus).special) {
                await request(
                    route('pedidos-detalle.update', pedido.detalles.pedidoDetallesId),
                    "PUT",
                    { ...pedido, estatus: 3, detalles: { ...pedido.detalles, estatus: 3, servicio: pedido.detalles.servicio + ' ' + estado.obs + ';' } })
                    .then(() => {
                        RefreshAfterAction()
                        handleCloseModal()
                        // fetchdata()
                    })
            } else {
                setDenied(true)
            }
        }
        if (action === 'envio') {
            if (CheckMenuPermission(state.userMenus).special) {
                await request(
                    route('pedidos-detalle.update', pedido.detalles.pedidoDetallesId),
                    "PUT",
                    { ...pedido, tipo: action, detalles: { ...pedido.detalles, servicio: pedido.detalles.servicio + ' ' + estado.obs + ';', reasignar: true } })
                    .then(() => {
                        RefreshAfterAction()
                        handleCloseModal()
                        // fetchdata()
                    })
            } else {
                setDenied(true)
            }
        }
    }

    return (
        <>
            <div className='grid grid-rows-6 h-full'>
                <div className='flex flex-col gap-5 row-span-5 pt-3 mx-3'>
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
                    <form id="register-form" onSubmit={e => e.preventDefault()}>
                        <div className="flex flex-col mt-0 gap-1">
                            {action !== 'envio' &&
                                <div className='grid grid-flow-col text-center gap-4'>
                                    <span>
                                        Producto: {pedido.detalles.productoNombre ?? "-"}
                                    </span>
                                    {/* <span>
                                        Vendedor: {pedido.detalles.nombresVendedor ?? "-"}
                                    </span> */}
                                </div>
                            }
                            {action === 'cancelar' &&
                                <SelectComp
                                    disabled={monitor === 4 ? true : false}
                                    className={"h-12"}
                                    label="Motivo cancelación"
                                    options={motivosCancelacion}
                                    value={pedido.detalles.motivocancelacionid || ''}
                                    data="motivo"
                                    valueKey="idmotivocancelacion"
                                    onChangeFunc={onChangeMotivoCanId}
                                />
                            }
                            <div className='flex'>
                                {estado.vendedoresTransito && <SelectComp
                                    className={"h-12"}
                                    label="Vendedor"
                                    disabled={!check}
                                    options={estado.vendedoresTransito}
                                    value={pedido.IdVendedor || ''}
                                    data="vendedor"
                                    valueKey="vendedorId"
                                    onChangeFunc={onChangeVendedor}
                                />}
                            </div>
                            {action === 'envio' &&
                                <TextInput
                                    label="Comentarios"
                                    id="servicio"
                                    type="text"
                                    name="servicio"
                                    value={estado.obs}
                                    className="block w-full mt-1 texts"
                                    autoComplete="servicio"
                                    isFocused={false}
                                    onChange={onChangeServicio}
                                    disabled={monitor === 4 ? true : false}
                                />
                            }
                            {action === 'cancelar' &&
                                <TextInput
                                    label="Comentarios"
                                    id="descripcionCan"
                                    type="text"
                                    name="descripcionCan"
                                    value={pedido.detalles.descripcionCancelacion}
                                    className="block w-full mt-1 texts"
                                    autoComplete="descripcionCan"
                                    isFocused={false}
                                    onChange={onChangeMotivoCanDes}
                                    disabled={monitor === 4 ? true : false}
                                />
                            }
                            {/* {action === 'cancelar' &&
                                <TextInput
                                    label="Clave supervisor"
                                    id="clave"
                                    type="text"
                                    name="clave"
                                    // value={pedido.detalles.}
                                    defaultValue={""}
                                    className="block w-full mt-1 texts"
                                    autoComplete="clave"
                                    isFocused={false}
                                    onChange={onChangeClaveSup}
                                />
                            } */}
                            {/* {pedido.productoNombre === 'Estacionario' && action === 'surtir' &&
                                <TextInput
                                    label="Litros"
                                    id="litros"
                                    type="text"
                                    name="litros"
                                    // value={filters.litros}
                                    className="block w-full mt-1 texts"
                                    autoComplete="litros"
                                    isFocused={false}
                                // onChange={(e) =>
                                // 	setData({
                                // 		...data,
                                // 		litros: e.target.value,
                                // 	})
                                // }
                                />
                                } */}
                            {action === 'surtir' &&
                                <>
                                    <TextInput
                                        label="Cantidad"
                                        id="cantidad"
                                        type="decimal"
                                        name="cantidad"
                                        // maxLength="6"
                                        value={compState.Cantidad}
                                        className="block w-full mt-1 texts"
                                        autoComplete="cantidad"
                                        isFocused={true}
                                        onChange={e => {
                                            setCompState({ ...compState, Cantidad: e.target.value })
                                            onChangeCantidadVenta
                                        }}
                                        disabled={monitor === 4 ? true : false}
                                    />
                                    <TextInput
                                        label="Remision"
                                        id="remision"
                                        type="text"
                                        name="remision"
                                        maxLength="6"
                                        value={compState.remision}
                                        className="block w-full mt-1 texts"
                                        autoComplete="remision"
                                        isFocused={true}
                                        onChange={e => {
                                            setCompState({ ...compState, remision: e.target.value })
                                            onChangeRemision
                                        }}
                                        disabled={monitor === 4 ? true : false}
                                    />
                                </>
                            }
                            {/* {action !== 'surtir' && */}
                            <div>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                            checked={check || false}
                                            onChange={onChangeCheck}
                                            disabled={(monitor === 4 || !CheckMenuPermission(state.userMenus).special) ? true : false}
                                        />
                                    }
                                    label="Surtió otro vendedor" />
                            </div>
                            {/* // } */}
                        </div>
                    </form>
                </div>
                <div className='grid row-span-1 content-end'>
                    <button className='text-center w-full h-[50px] bg-[#37ae00] rounded-lg text-white' onClick={submit}>
                        Aceptar
                    </button>
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

export default ServTransitoForm
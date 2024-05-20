import SelectComp from '@/components/SelectComp';
import TextInput from '@/components/TextInput';
import request from '@/utils';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const ServiciosTransitoDialog = ({ open,
    handleCloseModal,
    action,
    submit,
    pedido,
    onChangeCheck,
    check,
    motivosCancelacion,
    onChangeRemision,
    onChangeMotivoCanId,
    // onChangeClaveSup,
    onChangeMotivoCanDes,
    onChangeServicio,
    onChangeVendedor
}) => {
    const [state, setState] = useState({ check: false, vendedor: null, motivoCan: null, vendedores: null })

    const fetchData = async () => {
        const response = await fetch(route('vendedor-quienconquien'), {
            method: "POST",
            body: JSON.stringify({ tipoServicioId: pedido.IdServicio }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (!response.ok) {
                new Noty({
                    text: "Ocurrió un error al obtener los vendedores.",
                    type: "error",
                    theme: "metroui",
                    layout: "bottomRight",
                    timeout: 2000
                }).show();
            }
            return response.json();
        })
        setState({ ...state, vendedores: response });
    };

    useEffect(() => {
        if (!state.vendedores) fetchData()
    }, [open, state.vendedores])

    return (
        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>
                {pedido &&
                    action === "envio" ? "Telemark" : (action === "surtir" ? `Surtir servicio ${pedido.pedidoId}` : `Cancelar servicio ${pedido.pedidoId}`)
                }
            </DialogTitle>
            <Divider />
            <DialogContent>
                <form id="register-form" onSubmit={e => e.preventDefault()}>
                    <div className="flex flex-col mt-2 gap-4">
                        {action !== 'envio' &&
                            <div className='grid grid-flow-col text-center gap-4'>
                                <span>
                                    Producto: {pedido.detalles.productoNombre ?? "-"}
                                </span>
                                <span>
                                    Vendedor: {pedido.detalles.nombresVendedor ?? "-"}
                                </span>
                            </div>
                        }
                        {action === 'cancelar' &&
                            <SelectComp
                                className={"h-12"}
                                label="Motivo cancelación"
                                options={motivosCancelacion}
                                value={state.motivoCan || ''}
                                data="motivo"
                                valueKey="idmotivocancelacion"
                                onChangeFunc={onChangeMotivoCanId}
                            />
                        }
                        <div className='flex'>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                        checked={check || false}
                                        onChange={onChangeCheck}
                                    />
                                }
                                label="Surtió otro vendedor" />
                            <SelectComp
                                className={"h-12"}
                                label="Vendedor"
                                disabled={!check}
                                options={state.vendedores}
                                value={state.vendedor || ''}
                                data="vendedor"
                                valueKey="quienConQuien_idQuienConQuien"
                                onChangeFunc={onChangeVendedor}
                            />
                        </div>
                        {action === 'envio' &&
                            <TextInput
                                label=""
                                id="servicio"
                                type="text"
                                name="servicio"
                                // value={filters.servicio}
                                className="block w-full mt-1 texts"
                                autoComplete="servicio"
                                isFocused={false}
                                onChange={onChangeServicio}
                            />
                        }
                        {action === 'cancelar' &&
                            <TextInput
                                label=""
                                id="descripcionCan"
                                type="text"
                                name="descripcionCan"
                                // value={filters.descripcionCan}
                                className="block w-full mt-1 texts"
                                autoComplete="descripcionCan"
                                isFocused={false}
                                onChange={onChangeMotivoCanDes}
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
                        {pedido.productoNombre === 'Estacionario' && action === 'surtir' &&
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
                        }
                        {action === 'surtir' &&
                            <TextInput
                                label="Remision"
                                id="remision"
                                type="text"
                                name="remision"
                                maxLength="6"
                                value={pedido.detalles.remision || ''}
                                className="block w-full mt-1 texts"
                                autoComplete="remision"
                                isFocused={true}
                                onChange={onChangeRemision}
                            />
                        }
                    </div>
                </form>
                <DialogActions className={'mt-4'}>
                    <Button
                        color="error"
                        onClick={() => {
                            handleCloseModal();
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button color={'success'} onClick={submit}>Guardar</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

export default ServiciosTransitoDialog
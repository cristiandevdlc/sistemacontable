import { cdActions, requestTypes } from "../IntCreditoDescuento";
import CloseIcon from '@mui/icons-material/Close';
import DialogComp from "@/components/DialogComp";
import { Button } from "@mui/material";
import { moneyFormat } from "@/utils";

export default function SolicitudCreditoDescuento({ data, states, newData, setNewData, handleOpenModal, handleCloseModal, submitRequest }) {
    return <>
        <DialogComp
            dialogProps={{
                model: <>
                    {`Actualizar ${states.tipo === requestTypes.creditos ? "credito" : "descuento"}`}
                    <div><CloseIcon className='cursor-pointer' onClick={handleOpenModal} /></div>
                </>,
                width: 'md',
                customTitle: true,
                openState: states.open,
                style: 'grid grid-cols-8 gap-x-4 ',
                actionState: "",
                openStateHandler: () => handleCloseModal(),
                customAction: () => <></>
            }}
            fields={[
                {
                    label: "Detalles de solicitud",
                    custom: true,
                    style: 'col-span-3 row-span-6 ' /* row-span-4 */,
                    customItem: () => {
                        return <>
                            <div className='monitor-dialog-details sm:col-span-5 md:col-span-2 sm:mb-4 md:mb-0 sm:h-[70%] md:h-full  p-3'>
                                <div className='grid sm:grid-cols-2 md:grid-cols-1 w-full h-full gap-2 p-3  gap-y-8'>
                                    <div className='flex flex-col'>
                                        <span>Fecha de solicitud</span>
                                        <span className='text-[14px] mt-1 text-[#D1D1D1]'>{(new Date(data.solicituddescuentoportatil_fechasolicitud ?? data.solicituddescuento_fechaSolicitud ?? data.solicitudCredito_fechaSolicitud)).formatMX()}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Usuario que solicitó</span>
                                        <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data.usuario_solicitud?.usuario_nombre}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Nombre comercial</span>
                                        <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data.cliente?.cliente_razonsocial}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Razón social</span>
                                        <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data.cliente?.cliente_nombrecomercial}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>{`${data.requestType === requestTypes.creditos ? "Credito" : "Descuento"}`} actual</span>
                                        <span className='text-[14px] mt-1 text-[#D1D1D1]'>
                                            $
                                            { ///DESCUENTO PORTATIL
                                                (data.requestType === requestTypes.portatil) &&
                                                `${moneyFormat(data.cliente?.cliente_descuentoTanque)}
                                                    ${data.cliente?.cliente_dscportanque == 0 ? "por kilo" : "por tanque"}`
                                            }
                                            { ///DESCUENTO ESTACIONARIO
                                                (data.requestType === requestTypes.estacionario) &&
                                                `${moneyFormat(data.cliente?.cliente_descuento)}
                                                    ${data.cliente?.cliente_cienLitros == 0 ? "por litro" : "a partir de 100 litros"}`
                                            }
                                            { ///CREDITO
                                                (data.requestType === requestTypes.creditos) &&
                                                `${moneyFormat(data.cliente?.cliente_limiteCredito)}
                                                    de limite por ${data.cliente?.cliente_diasCredito} dias`
                                            }
                                        </span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>{`${data.requestType === requestTypes.creditos ? "Credito" : "Descuento"}`} solicitado</span>
                                        <span className='text-[14px] mt-1 text-[#D1D1D1]'>
                                            $
                                            { ///DESCUENTO PORTATIL
                                                (data.requestType === requestTypes.portatil) &&
                                                `${moneyFormat(data.solicituddescuentoportatil_cantidad)}
                                                    ${data.solicituddescuentoportatil_tanque == 0 ? "por kilo" : "por tanque"}`
                                            }
                                            { ///DESCUENTO ESTACIONARIO
                                                (data.requestType === requestTypes.estacionario) &&
                                                `${moneyFormat(data.solicituddescuento_descuento)}
                                                    ${data.solicituddescuento_cienlts == 0 ? "por litro" : "a partir de 100 litros"}`
                                            }
                                            { ///CREDITO
                                                (data.requestType === requestTypes.creditos) &&
                                                `${moneyFormat(data.solicitudCredito_monto)}
                                                    de limite por ${data.solicitudCredito_dias} dias`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                },
                {
                    label: null,
                    custom: true,
                    style: 'col-span-5 col-start-4 py-16',
                    customItem: ({ label }) => {
                        return <>
                            <div className="flex justify-between me-10 h-full">
                                <div>
                                    Tipo de solicitud: {`${states.tipo === requestTypes.creditos ? "credito" :
                                        states.tipo === requestTypes.estacionario ? "descuento estacionario" : "descuento portatil"}`}

                                </div>
                                <div>
                                    Folio: #{data.solicituddescuento_idsolicitud ?? data.solicitudCredito_id ?? data.solicituddescuentoportatil_id}
                                </div>
                            </div>
                        </>
                    }
                },
                {
                    input: true,
                    label: 'Monto autorizado',
                    type: 'decimal',
                    style: 'col-span-5 col-start-4 row-start-2',
                    value: newData.solicituddescuento_descuentoAutorizado ?? newData.solicitudCredito_montoAutorizado ?? newData.solicituddescuentoportatil_cantidadAutorizada,
                    customIcon: 'attach_money',
                    onChangeFunc: (e) => {
                        if (newData.solicituddescuentoportatil_cantidad) setNewData({ ...newData, solicituddescuentoportatil_cantidadAutorizada: e.target.value })
                        if (newData.solicituddescuento_descuento) setNewData({ ...newData, solicituddescuento_descuentoAutorizado: e.target.value })
                        if (newData.solicitudCredito_monto) setNewData({ ...newData, solicitudCredito_montoAutorizado: e.target.value })
                    }
                },
                {
                    input: true,
                    label: 'Dias autorizados',
                    type: 'number',
                    style: 'col-span-5 col-start-4  row-start-3',
                    value: newData.solicitudCredito_dias,
                    _conditional: () => states.tipo === requestTypes.creditos,
                    onChangeFunc: (e) => setNewData({ ...newData, solicitudCredito_dias: e.target.value })
                },
                {
                    label: { reject: `Rechazar solicitud`, accept: `Autorizar solicitud` },
                    custom: true,
                    style: 'col-span-5 col-start-4  row-start-4',
                    customItem: ({ label }) => {
                        return <>
                            <div className="flex gap-3">

                                <Button
                                    variant="contained"
                                    value={''}
                                    color="error"
                                    startIcon={<span className="material-icons mx-2">cancel</span>}
                                    onClick={() => submitRequest(cdActions.reject)}
                                    style={{ backgroundColor: '#af2828', marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%' }}
                                >
                                    {label.reject}
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<span className="material-icons mx-2">check_circle</span>}
                                    onClick={() => submitRequest(cdActions.accept)}
                                    style={{ backgroundColor: '#1b5e20', marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%' }}
                                >{label.accept}</Button>

                            </div>
                        </>
                    }
                }

            ]}
        />
    </>
}
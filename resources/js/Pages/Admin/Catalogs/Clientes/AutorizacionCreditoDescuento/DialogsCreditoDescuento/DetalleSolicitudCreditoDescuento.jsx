import { cdActions, requestTypes } from "../IntCreditoDescuento";
import CloseIcon from '@mui/icons-material/Close';
import DialogComp from "@/components/DialogComp";
import { Button } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { moneyFormat } from "@/utils";

export default function DetalleSolicitudCreditoDescuento({ data, states, handleOpenModal, handleCloseModal }) {
    const [stateRequest, setStateRequest] = useState(false)

    const setLabels = () => {
        setStateRequest(
            (
                data.solicituddescuento_estatusPeticion |
                data.solicituddescuentoportatil_estatus |
                data.solicitudCredito_estatusPeticion
            ) === cdActions.accept)
    }

    useEffect(() => {
        if (states.details) setLabels()
    }, [states.details]);
    return <>
        <DialogComp
            dialogProps={{
                model: <>
                    {`Detalles ${states.tipo === requestTypes.creditos ? "credito" : "descuento"}`}
                    <div><CloseIcon className='cursor-pointer' onClick={() => handleOpenModal()} /></div>
                </>,
                width: 'md',
                customTitle: true,
                openState: states.details,
                style: 'grid gap-x-4',
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
                                <div className='grid sm:grid-cols-2 md:grid-cols-2 w-full h-full p-3'>
                                    <div>
                                        <div className="text-2xl mb-5"> Detalles de solicitud </div>
                                        <div className="grid grid-cols-1 gap-y-8">
                                            <div className='flex flex-col'>
                                                <span>Fecha de solicitud</span>
                                                <span className='text-[14px] mt-1 text-[#D1D1D1]'>
                                                    {
                                                        (data.solicituddescuento_fechaConfirmacion ||
                                                            data.solicituddescuentoportatil_fechaAutorizacion ||
                                                            data.solicitudCredito_fechaConfirmacion) ?
                                                            (new Date(data.solicituddescuento_fechaConfirmacion
                                                                ?? data.solicituddescuentoportatil_fechaAutorizacion
                                                                ?? data.solicitudCredito_fechaConfirmacion)).formatMX().replaceAll('/', '-') : '-'
                                                    }
                                                    {/* {data.solicituddescuentoportatil_fechasolicitud ?? data.solicituddescuento_fechaSolicitud ?? data.solicitudCredito_fechaSolicitud} */}
                                                </span>
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
                                    <div>
                                        <div className="text-2xl mb-5"> Detalles de {`${stateRequest ? "autorización" : "revocación"}`}</div>
                                        <div className="grid grid-cols-1 gap-y-8">
                                            <div className='flex flex-col'>
                                                <span>Fecha de {`${stateRequest ? "autorización" : "revocación"}`}</span>
                                                <span className='text-[14px] mt-1 text-[#D1D1D1]'>
                                                    {
                                                        (data.solicituddescuento_fechaConfirmacion ||
                                                            data.solicituddescuentoportatil_fechaAutorizacion ||
                                                            data.solicitudCredito_fechaConfirmacion) ?
                                                            (new Date(data.solicituddescuento_fechaConfirmacion
                                                                ?? data.solicituddescuentoportatil_fechaAutorizacion
                                                                ?? data.solicitudCredito_fechaConfirmacion)).formatMX().replaceAll('/', '-') : '-'
                                                    }
                                                    {/* {data.solicituddescuentoportatil_fechasolicitud ?? data.solicituddescuento_fechaSolicitud ?? data.solicitudCredito_fechaSolicitud} */}
                                                </span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span>Usuario que {`${stateRequest ? "autorizó" : "revocó"}`}</span>
                                                <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data.usuario_autorizacion?.usuario_nombre}</span>
                                            </div>
                                            {
                                                stateRequest ? (

                                                    <div className='flex flex-col'>
                                                        <span>{`${data.requestType === requestTypes.creditos ? "Credito" : "Descuento"}`} autorizado</span>
                                                        <span className='text-[14px] mt-1 text-[#D1D1D1]'>
                                                            $
                                                            { ///DESCUENTO PORTATIL
                                                                (data.requestType === requestTypes.portatil) &&
                                                                `${moneyFormat(data.solicituddescuentoportatil_cantidadAutorizada)}
                                                                ${data.solicituddescuentoportatil_tanque == 0 ? "por kilo" : "por tanque"}`
                                                            }
                                                            { ///DESCUENTO ESTACIONARIO
                                                                (data.requestType === requestTypes.estacionario) &&
                                                                `${moneyFormat(data.solicituddescuento_descuentoAutorizado)}
                                                                ${data.solicituddescuento_cienlts == 0 ? "por litro" : "a partir de 100 litros"}`
                                                            }
                                                            { ///CREDITO
                                                                (data.requestType === requestTypes.creditos) &&
                                                                `${moneyFormat(data.solicitudCredito_montoAuatorizado)}
                                                                de limite por ${data.solicitudCredito_diasAutorizados} dias`
                                                            }
                                                        </span>
                                                    </div>

                                                ) : (
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
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                },

            ]}
        />
    </>
}
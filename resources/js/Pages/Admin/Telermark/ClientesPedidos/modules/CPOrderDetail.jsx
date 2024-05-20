import { ServiceTypes, disabledColor, getCurrDateInput, moneyFormat, noty, primaryColor } from '@/utils';
import { intAddressData, intOrderData, intStateModule } from '../intClientePedidos';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import DialogComp, { FieldDrawer } from "@/components/DialogComp";
import '../../../../../../sass/ClientePedidos/_tableStyles.scss';
import '../../../../../../sass/_detallesDialogSyle.scss';
import { ButtonComp } from '@/components/ButtonComp';
import TextInput from '@/components/TextInput';
import { useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { Request } from '@/core/Request';


export default function CPOrderDetail({ state = intStateModule, setState = () => { }, data = intOrderData, setData = () => { }, addressData = intAddressData, refresh = async () => { } }) {
    const [loadingOrder, setLoadingOrder] = useState(false)
    const [open, setOpen] = useState(false)

    const resetWhoData = () => {
        setData({
            ...data,
            orderDetails:
            {
                ...data.orderDetails,
                // historico: 0,
                // Subtotal: 0,
                who: {},
                quienconquienId: '',
            }
        })
    }

    const getWhoByWho = async (dataWho = { IdDireccion: null, IdProducto: null, fechaEntrega: null }) => {
        const quien = await Request._post(route('quienconquien-para-cliente'), dataWho)
        if (quien.status) {
            setData({
                ...data,
                orderDetails:
                {
                    ...data.orderDetails,
                    who: quien,
                    quienconquienId: quien.quienConQuien_idQuienConQuien,
                    historico: quien.historico,
                    Subtotal: data.orderDetails?.Cantidad * (quien.historico ? quien.historico?.historico_precio : 0),
                }
            })

            if (data.orderDetails?.productoObjecto?.producto_idTipoServicio == ServiceTypes.STECNICO) handeDialogDetail(true, true)
        } else resetWhoData()
        setState({ ...state, loadingWho: false })
    }

    const finishOrder = async () => {
        const reqData = { ...data, direccionPedidosId: addressData.direccionPedidosId }
        const response = await Request._post(route('pedidos.store'), reqData)

        setLoadingOrder(false)
        !response.status && noty('Error al realizar pedido', 'error')
        response.status && setState({ ...state, orderFinished: true })

        await refresh()
    }

    const handeDialogDetail = (openState = !open, reset = false) => {
        setOpen(openState)


    }


    useEffect(() => {
        if (loadingOrder) finishOrder()
    }, [loadingOrder]);

    useEffect(() => {
        if (data.orderDetails?.productoId && addressData.direccionPedidosId) setState({ ...state, loadingWho: true })
        else resetWhoData()
    }, [data.orderDetails?.productoId, addressData.direccionPedidosId, data.fechaPedido]);

    useEffect(() => {
        if (state.loadingWho) getWhoByWho({
            IdDireccion: addressData.direccionPedidosId,
            IdProducto: data.orderDetails?.productoId,
            fechaEntrega: data.fechaPedido
        })
    }, [state.loadingWho]);

    return (<>
        <div className="grid grid-cols-6 w-full gap-x-2 pt-2">
            <div className="col-span-full flex justify-between">
                <div className="ms-1 flex flex-col">
                    <span className="text-2xl mt-3 mb-3">{`Pedido detalles`}</span>

                </div>
                <div>
                    <ButtonComp
                        onClick={() => setLoadingOrder(true)}
                        tooltip={'Hacer pedido'}
                        color={(!loadingOrder && data.orderDetails.quienconquienId && !state.loadingWho)
                            ? primaryColor : disabledColor}
                        disabled={loadingOrder || (!data.orderDetails.quienconquienId || state.loadingWho)}
                        label={<Add />}
                    />
                </div>
            </div>
            <FieldDrawer
                fields={[
                    {
                        select: true,
                        label: 'Producto',
                        value: data.orderDetails?.productoId || '',
                        options: state.products,
                        data: 'producto_nombre',
                        valueKey: 'producto_idProducto',
                        style: 'col-span-4',
                        onChangeFunc: (e, o) => {
                            const prod = o;
                            setData({
                                ...data,
                                orderDetails: {
                                    ...data.orderDetails,
                                    productoId: e,
                                    productoObjecto: prod,
                                    // historico: prod ? prod.historico : {},
                                    // Subtotal: data.orderDetails?.Cantidad * (prod ? prod.historico?.historico_precio : 0)
                                }
                            })
                        }
                    },
                    {
                        input: true,
                        label: 'Cantidad',
                        value: data.orderDetails?.Cantidad || '',
                        style: 'col-span-2',
                        onChangeFunc: (e) => {
                            const cantidad = e.target.value.replace(/\D/g, "").slice(0, 10)
                            const historico = data.orderDetails?.historico
                            setData({
                                ...data,
                                orderDetails: {
                                    ...data.orderDetails,
                                    Cantidad: cantidad,
                                    Subtotal: cantidad * (historico ? historico.historico_precio : 0)
                                }
                            })
                        }
                    },
                    {
                        input: true,
                        label: 'Fecha',
                        type: 'date',
                        value: data.fechaPedido,
                        min: getCurrDateInput().split('T')[0],
                        style: 'col-span-3',
                        onChangeFunc: (e) => setData({ ...data, fechaPedido: e.target.value })
                    },
                    {
                        select: true,
                        label: 'Metodo pago',
                        value: data.PaymentMethodId,
                        options: state.paymentMethods,
                        data: 'formasPago_descripcion',
                        valueKey: 'formasPago_idFormasPago',
                        style: 'col-span-3',
                        onChangeFunc: (e) => setData({ ...data, PaymentMethodId: e })
                    },
                ]}
            />
            <hr className="col-span-full mx-3 my-4" />

            <div className='col-span-full '>
                <div className={`monitor-dialog-details`}>
                    <div className='grid grid-cols-2 w-full h-full gap-2 p-3  '>
                        <TextDetail className='!flex-row gap-3' dc='text-base' tc='text-xl' label='Total: ' data={`$${moneyFormat(data.orderDetails?.Subtotal ?? 0)}`} />
                        <TextDetail className='!flex-row gap-3' dc='text-base' tc='text-xl' label='Precio: ' data={`$${moneyFormat(data.orderDetails?.historico?.historico_precio ?? 0)}`} />
                        <hr className="col-span-full" />
                        {(state.loadingWho) && <TextDetail
                            label='Cargando . . .'
                            className={'col-span-full !flex-row p-10 justify-center'}
                        />}
                        {
                            (!state.loadingWho) && <>
                                {(!data.orderDetails?.quienconquienId && (data.orderDetails?.productoId && addressData.direccionPedidosId)) && (
                                    <TextDetail
                                        label='No hay servicios para esta ruta'
                                        className={'col-span-full !flex-row p-10 justify-center'}
                                    />
                                )}
                                {(!data.orderDetails?.quienconquienId && !addressData.direccionPedidosId && data.orderDetails?.productoId) && <TextDetail
                                    label='Necesita una dirección'
                                    className={'col-span-full !flex-row p-10 justify-center'}
                                />}
                                {(!data.orderDetails?.quienconquienId && !data.orderDetails?.productoId && addressData.direccionPedidosId) && <TextDetail
                                    label='Selecciona un producto'
                                    className={'col-span-full !flex-row p-10 justify-center'}
                                />}
                                {(!data.orderDetails?.quienconquienId && !data.orderDetails?.productoId && !addressData.direccionPedidosId) && <TextDetail
                                    label='Falta dirección y producto'
                                    className={'col-span-full !flex-row p-10 justify-center'}
                                />}
                            </>
                        }

                        {(!state.loadingWho && data.orderDetails?.quienconquienId) && (<>
                            <TextDetail label='Vendedor' data={data.orderDetails?.who?.vendedor} />
                            <TextDetail label='Red' data={data.orderDetails?.who?.red} />
                            <TextDetail label='Ruta' data={data.orderDetails?.who?.ruta} />
                            <TextDetail label='Pedidos pendientes' data={data.orderDetails?.who?.pedidosPendientes} />
                        </>)}
                    </div>
                </div>
            </div>
        </div >

        <DialogComp
            dialogProps={{
                openState: open,
                model: 'Detalles de servicio tecnico',
                width: 'sm',
                customTitle: true,
                fullWidth: true,
                actionState: "create",
                openStateHandler: () => handeDialogDetail(),
                onSubmitState: () => { },
                customAction: () => <>
                    <ButtonComp
                        label='Cancelar'
                        className='!mt-[-1vh] !bg-[#af2828]'
                        onClick={() => handeDialogDetail(!open, true)}
                    />
                    <ButtonComp
                        label='Confirmar servicio'
                        disabled={!data.orderDetails?.solucionserviciotecnicoid ||
                            !data.orderDetails?.motivoserviciotecnicoid ||
                            !data.orderDetails?.servicio}
                        className={`!mt-[-1vh] ${(data.orderDetails?.solucionserviciotecnicoid &&
                            data.orderDetails?.motivoserviciotecnicoid &&
                            data.orderDetails?.servicio) ? '!bg-[#1b5e20]' : '!bg-[#7c7c7c]'}`}
                        onClick={() => handeDialogDetail()}
                    />
                </>,
                style: `grid gap-2`
            }}
            fields={[
                {
                    custom: true,
                    customItem: () => {
                        return (
                            <div className='grid'>
                                <div >
                                    <div>Solucion servicio</div>
                                    <RadioGroup
                                        aria-labelledby="solucionserviciotecnicoid"
                                        name="solucionserviciotecnicoid"
                                        value={data.orderDetails?.solucionserviciotecnicoid || ""}
                                        onChange={(e) => setData({
                                            ...data,
                                            orderDetails: {
                                                ...data.orderDetails,
                                                solucionserviciotecnicoid: e.target.value,
                                            }
                                        })}
                                    >
                                        <div className='grid grid-cols-2'>
                                            <FormControlLabel value="0" control={<Radio />} label="Cilindro" />
                                            <FormControlLabel value="1" control={<Radio />} label="Estacionario" />
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <div>Motivo servicio</div>
                                    <RadioGroup
                                        aria-labelledby="motivoserviciotecnicoid"
                                        name="motivoserviciotecnicoid"
                                        value={data.orderDetails?.motivoserviciotecnicoid || ""}
                                        onChange={(e) => setData({
                                            ...data,
                                            orderDetails: {
                                                ...data.orderDetails,
                                                motivoserviciotecnicoid: e.target.value,
                                            }
                                        })}
                                    >
                                        <div className='grid grid-cols-2'>
                                            {state.stecnico.map((item) => (
                                                <FormControlLabel
                                                    key={item.idproblema}
                                                    value={item.idproblema.toString()}
                                                    control={<Radio />}
                                                    label={item.descripcion}
                                                />
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>

                                <TextInput
                                    label="Comentarios"
                                    type="text"
                                    value={data.orderDetails?.servicio || ""}
                                    onChange={(e) => setData({
                                        ...data,
                                        orderDetails: {
                                            ...data.orderDetails,
                                            servicio: e.target.value,
                                        }
                                    })}
                                />

                            </div>
                        )
                    }
                }
            ]}
        />
    </>)
}

const TextDetail = ({ label, data, className, dc, tc }) => {
    return <>
        <p className={`flex flex-col ` + className}>
            <span className={`` + tc}>{label}</span>
            <span className={`text-wrap text-[12px] mt-1 text-[#D1D1D1] ` + dc}>{data}</span>
        </p>
    </>
}
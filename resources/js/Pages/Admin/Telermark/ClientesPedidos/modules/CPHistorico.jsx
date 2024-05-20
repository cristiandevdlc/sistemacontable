import Datatable from "@/components/Datatable";
import { intStateModule } from "../intClientePedidos";
import { getCurrDateInput, moneyFormat, numberFormat } from "@/utils";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import DialogComp, { FieldDrawer } from "@/components/DialogComp";
import { Request } from "@/core/Request";
import { ButtonComp } from "@/components/ButtonComp";
import { Close } from "@mui/icons-material";
import moment from "moment";

const statusKey = {
    CANCELADO: 3,
    SURTIDO: 2,
    ENVIADO: 1,
}
const status = {
    3: 'CANCELADO',
    2: 'CONFIRMADO',
    1: 'PENDIENTE',
}
const statusColors = {
    3: 'bg-[#FF0000]',
    2: 'bg-[#46DC00]',
    1: 'bg-[#FFE601]',
}

export default function CPHistorico({ state = intStateModule, defaultDetail, refresh = () => { } }) {
    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState({})
    const [orderMod, setOrderMod] = useState({ fecha: moment().format('YYYY-MM-DDThh:mm'), producto: '', cantidad: 1 })

    const reprogramOrder = async () => {
        const requestBody = { ...orderMod, id: order.pid };
        // const requestBody = { ...orderMod, id: order.pedidoId };
        const res = Request._post(route('actualizarFechaPedido'), requestBody,
            { success: { type: 'success', message: "Fecha actualizada" } })
        refresh()
        handeDialogDetail()
    }

    const handeDialogDetail = (orderItem = {}) => {
        setOpen(!open)
        setOrder(orderItem)
        setOrderMod({ fecha: moment().format('YYYY-MM-DDThh:mm'), producto: '', cantidad: 1 })
    }

    useEffect(() => {
        if (defaultDetail.pedidoId) {
            setOpen(true)
            setOrder(state.historic.find(ped => ped.pedidoId == defaultDetail.pedidoId))
        }
    }, [defaultDetail, state.historic]);

    return (
        <>
            <div>
                <div>
                    <div className="ms-1 flex flex-col">
                        <span className="text-2xl mb-2">{`Pedido detalles`}</span>

                    </div>
                </div>
                <div id='addressTable' className="mb-5">
                    <Datatable
                        data={state.historic}
                        searcher={false}
                        virtual={true}
                        tableClassName={'max-h-[260px]'}
                        columns={[
                            {
                                width: '6%', header: '', cell: ({ item }) => (

                                    <div className='relative w-[12px] h-[24px]'>
                                        <div className={`${statusColors[item.estatus]} absolute rounded-full h-[100%] w-[9px] top-0 left-2`}>
                                        </div>
                                    </div>
                                )
                            },
                            { width: '16%', header: 'Fecha reg', cell: ({ item }) => <div className="text-wrap">{(new Date(item.fechaPedido)).formatMX()}</div> },
                            { width: '22%', header: 'Operadora', accessor: 'operadora' },
                            { width: '16%', header: 'Producto', accessor: 'producto' },
                            { width: '13%', header: 'Cantidad', cell: ({ item }) => numberFormat(item.cantidad) },
                            {
                                width: '16%', header: 'Fecha serv', cell: ({ item }) =>
                                    <div className="text-wrap">{item.fechaSurtido ? (new Date(item.fechaSurtido)).formatMX() : ''}</div>
                            },
                            {
                                width: '12%', header: 'Acciones',
                                custom: ({ item }) => (
                                    <div className="h-[22px] grid content-center">
                                        <Tooltip title='Ver detalles'>
                                            <button onClick={() => handeDialogDetail(item)} className="material-icons">description</button>
                                        </Tooltip>
                                    </div>
                                )
                            },
                        ]}
                    />
                </div>
            </div>
            <DialogComp
                dialogProps={{
                    openState: open,
                    model: <>
                        <>Detalles del pedido</><div onClick={handeDialogDetail}><Close className='cursor-pointer' /></div>
                    </>,
                    width: 'sm',
                    customTitle: true,
                    fullWidth: true,
                    actionState: "create",
                    openStateHandler: () => handeDialogDetail(),
                    onSubmitState: () => { },
                    customAction: () => <></>,
                    style: `grid grid-cols-2 gap-4 monitor-dialog-details p-8`
                }}
                fields={[
                    {
                        custom: true,
                        style: 'col-span-2',
                        customItem: () => {
                            return (
                                <div className={`sm:col-span-5 md:col-span-2 sm:mb-4 md:mb-0 sm:h-[70%] md:h-full `}>
                                    <div className='grid sm:grid-cols-2 md:grid-cols-2 w-full h-full gap-2   gap-y-5'>
                                        <TextDetail label='Folio' data={order?.folio} />
                                        <TextDetail label='Fecha surtido' data={order?.fechaSurtido ? (new Date(order?.fechaSurtido)).formatMX() : 'Aún no se surte'} />
                                        <TextDetail label='Tipo de pedido (producto)' data={order?.tipoServicio} />
                                        <TextDetail label='Servicio' data={order?.servicio} />
                                        <TextDetail label='Metodo de pago' data={order?.metodoPago} />
                                        <TextDetail label='Origen' data={order?.origen} />
                                        <TextDetail label='Cantidad' data={numberFormat(order?.cantidad)} />
                                        <TextDetail label='Precio' data={`$${moneyFormat(order?.precio)}`} />
                                        <hr className="col-span-full" />
                                        <TextDetail label='Estatus' data={<>
                                            <div className={`absolute text-black px-5 rounded-full ${statusColors[order?.estatus]}`} >
                                                {status[order?.estatus]}
                                            </div>
                                        </>} />
                                        <TextDetail label='Total' data={`$${moneyFormat(order?.total)}`} />
                                    </div>
                                </div>
                            )
                        }
                    },
                    {
                        custom: true,
                        style: 'col-span-2',
                        _conditional: () => (order?.estatus == statusKey.ENVIADO),
                        customItem: () => <div className={`sm:col-span-5 md:col-span-2 sm:mb-4 md:mb-0 sm:h-[70%] md:h-full mt-8 pb-5`}>
                            <div className='grid w-full h-full gap-2   gap-y-5'>
                                <TextDetail label='Reprogramacion de pedido' data={''} />
                            </div>
                        </div>
                    },
                    {
                        label: 'Producto',
                        select: true,
                        _conditional: () => (order?.estatus == statusKey.ENVIADO),
                        style: 'mt-[-3vh] text-black',
                        valueKey: 'producto_idProducto',
                        data: 'producto_nombre',
                        options: state.products,
                        value: orderMod.producto,
                        onChangeFunc: (target) => setOrderMod({ ...orderMod, producto: target })
                    },
                    {
                        label: 'Cantidad',
                        input: true,
                        _conditional: () => (order?.estatus == statusKey.ENVIADO),
                        type: 'decimal',
                        style: 'mt-[-3vh] text-black',
                        value: orderMod.cantidad,
                        onChangeFunc: ({ target }) => setOrderMod({ ...orderMod, cantidad: target.value })
                    },
                    {
                        label: 'Fecha',
                        input: true,
                        _conditional: () => (order?.estatus == statusKey.ENVIADO),
                        type: 'datetime-local',
                        min: moment().format('YYYY-MM-DDThh:mm'),
                        style: 'text-black !mt-[-1vh]',
                        value: orderMod.fecha,
                        onChangeFunc: ({ target }) => setOrderMod({ ...orderMod, fecha: target.value })
                    },
                    {
                        custom: true,
                        _conditional: () => (order?.estatus == statusKey.ENVIADO),
                        customItem: () => <ButtonComp
                            className="!mt-[1vh]"
                            color={'red'}
                            label={'Actualiza pedido'}
                            onClick={reprogramOrder}
                        />
                    }
                ]}
            />
        </>
    )
}

const TextDetail = ({ label, data }) => {
    return <>
        <div className='flex flex-col'>
            <span>{label}</span>
            <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data}</span>
        </div>
    </>
}
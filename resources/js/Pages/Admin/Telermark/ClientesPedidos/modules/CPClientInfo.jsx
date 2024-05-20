import { AddIcCall, EditNote, Add } from '@mui/icons-material';
import { intClienteData } from '../intClientePedidos';
import { FieldDrawer } from "@/components/DialogComp";
import { ButtonComp } from "@/components/ButtonComp";
import { primaryColor, secondaryColor } from '@/utils';
import { Request } from '@/core/Request';


export default function CPClientInfo({ data = intClienteData, setData = () => { } }) {
    const answerCall = async () => {
        const response = await Request._get(route("obtenerCallerId"));
        setData({ ...data, telefono: response.callerid })
    };

    const saveClient = async () => {
        const response = await Request._post(route('clientes-pedidos.store'), data, {
            success: { message: 'Cliente creado exitosamente' },
            error: { message: 'Error al crear cliente' }
        })
        response.cliente && setData({ ...data, ...response.cliente, saved: true })
    }

    const editClient = async () => {
        await Request._put(route('clientes-pedidos.update', data.clientePedidosId), data, {
            success: { message: 'Cliente actualizado exitosamente' },
            error: { message: 'Error al editar cliente' }
        })
    }

    return (
        <>
            <div className="grid grid-cols-6 p-2 w-full gap-x-2">
                <div className="ms-1 col-span-full flex justify-between ">
                    <div className="flex flex-col">
                        <span className="text-2xl">Datos generales</span>
                        <span className="text-gray-800" >No. cliente: {data.clientePedidosId}</span>

                    </div>
                    <div className='flex gap-2'>
                        {data.saved && <ButtonComp
                            onClick={editClient}
                            tooltip={'Editar'}
                            color={secondaryColor}
                            label={<EditNote />}
                        />}
                        <ButtonComp onClick={answerCall} tooltip={'Llamada entrante'} color='#036cf5' label={<AddIcCall />} />
                    </div>
                </div>
                <FieldDrawer
                    fields={[
                        {
                            input: true,
                            label: 'Telefono',
                            value: data.telefono || '',
                            autoComplete: 'mainIntergasPhone',
                            style: 'col-span-6',
                            onChangeFunc: (e) => setData({ ...data, telefono: e.target.value.replace(/\D/g, "").slice(0, 10) })
                        },
                        {
                            input: true,
                            label: 'Nombre',
                            value: data.Nombre || '',
                            style: 'col-span-2',
                            onChangeFunc: (e) => setData({ ...data, Nombre: e.target.value.replace(/\d/g, '') })
                        },
                        {
                            input: true,
                            label: 'A.Paterno',
                            value: data.Apellido1 || '',
                            style: 'col-span-2',
                            onChangeFunc: (e) => setData({ ...data, Apellido1: e.target.value.replace(/\d/g, '') })
                        },
                        {
                            input: true,
                            label: 'A.Materno',
                            value: data.Apellido2 || '',
                            style: 'col-span-2',
                            onChangeFunc: (e) => setData({ ...data, Apellido2: e.target.value.replace(/\d/g, '') })
                        },
                        {
                            input: true,
                            label: 'Otro tel.',
                            value: data.telefono2 || '',
                            style: 'col-span-3',
                            onChangeFunc: (e) => setData({ ...data, telefono2: e.target.value.replace(/\D/g, "").slice(0, 10) })
                        },
                        {
                            check: true,
                            label: 'Postventa',
                            checked: data.Posventa,
                            style: 'col-span-3 h-full flex justify-center',
                            onChangeFunc: (e) => setData({ ...data, Posventa: e.target.checked ? "1" : "0", })
                        },
                    ]}
                />
            </div>
        </>
    )
}
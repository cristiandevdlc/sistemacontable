import LoadingDiv from '@/components/LoadingDiv'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp'

export default function AsignarValvula({ handleCloseModal, selectedRowToAction, open }) {
    const valveAsignTankValidations = { idValvula: ['required'], fechaInstalacion: ['required'] }

    const [loading, setLoading] = useState(true)
    const [availableValvesToTankAsign, setAvailableValvesToTankAsign] = useState([])
    const { data, setData } = useForm({ id: '', idTanque: selectedRowToAction?.idTanque || '', idValvula: '', fechaInstalacion: '', activo: 1, nombreValvula: '', nombreTanque: selectedRowToAction?.serie || '' })
    const [errors, setErrors] = useState({})

    const fetchAvailableValvesToTankAsign = async () => {
        console.log(data.idTanque);
        const response = await request(route('valvulas.activas', data.idTanque))
        setAvailableValvesToTankAsign(response)
        setLoading(false)
    }

    useEffect(() => {
        fetchAvailableValvesToTankAsign()
    }, [])

    const submit = async () => {

        const result = validateInputs(valveAsignTankValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        await request(route('tanques-valvulas.store'), 'POST', data)
        setData({ id: '', idTanque: selectedRowToAction?.idTanque || '', idValvula: '', fechaInstalacion: '', activo: 1, nombreValvula: '', nombreTanque: selectedRowToAction?.serie || '' })
        fetchAvailableValvesToTankAsign()
        setErrors({})
    }

    return (
        <>
            <DialogComp dialogProps={{
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit,
                actionState: 'create',
                openState: open.addValve,
                model: 'asignación de valvula a tanque',
                width: 'sm',
                style: 'grid grid-cols-1 gap-y-2',
            }}
                fields={[
                    {
                        label: "Tanque",
                        input: true,
                        type: 'text',
                        fieldKey: 'nombreTanque',
                        disabled: true,
                        value: data.nombreTanque || '',
                        onChangeFunc: (e) => setData({ ...data, nombreTanque: e.target.value })
                    },
                    {
                        label: "Valvula",
                        input: true,
                        type: 'text',
                        fieldKey: 'idValvula',
                        disabled: true,
                        value: data.nombreValvula || '',
                        onChangeFunc: (e) => setData({ ...data, nombreValvula: e.target.value })
                    },
                    {
                        label: "Fecha de instalacion",
                        input: true,
                        type: 'date',
                        fieldKey: 'fechaInstalacion',
                        value: data.fechaInstalacion || '',
                        onChangeFunc: (e) => setData({ ...data, fechaInstalacion: e.target.value })
                    },
                    {
                        label: "",
                        custom: true,
                        value: '',
                        style: 'justify-center col-span-1',
                        customItem: () =>
                        (
                            <div>
                                {
                                    loading ? (<div className='min-h-[12rem] flex justify-center items-center'><LoadingDiv /></div>) : (
                                        <div className="flex w-full py-5 gap-6">
                                            <div className="text-center w-full h-full">
                                                <h4 className='w-full text-2xl font-semibold mb-4'>Selecciona una valvula</h4>
                                                <div className='rounded-md border max-h-48 min-h-[12rem] overflow-y-auto ' >
                                                    <table className='w-full '>
                                                        <thead className=' bg-[#2B3F75] sticky top-0  w-full '>
                                                            <td className='text-white py-1 rounded-tl-md border-r '>Nombre de valvula</td>
                                                        </thead>
                                                        <tbody>
                                                            {availableValvesToTankAsign.length > 0 ? availableValvesToTankAsign.map((valve) => {
                                                                return (
                                                                    <tr onClick={() => setData({ ...data, nombreValvula: valve.nombre, idValvula: valve.idValvula })} key={valve.idValvula} className={`table-hover hover:bg-[#E0DFF3] border-b`}>
                                                                        <td className='py-1 '>{valve.nombre}</td>
                                                                    </tr>
                                                                )
                                                            }) : (
                                                                <tr><td colSpan={2} className='w-full '>No se encontraron registros.</td></tr>
                                                            )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        ),
                        onChangeFunc: null,
                    },

                ]}
                errors={errors}
            />
        </>
    )
}
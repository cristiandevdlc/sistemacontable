import LoadingDiv from '@/components/LoadingDiv'
import { useForm } from '@inertiajs/react'
import React from 'react'
import { useEffect, useState } from 'react'
import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp'

export default function TipoTanque({ handleCloseModal, open }) {
    const tankTypeValidations = { nombre: ['required'] }


    const [loading, setLoading] = useState(true)
    const [action, setAction] = useState('create')
    const [errors, setErrors] = useState({})
    const [tankTypes, setTankTypes] = useState([])
    const { data, setData } = useForm({ idTipoTanque: '', nombre: '', activo: 1 })



    const fetchTankTypes = async () => {
        const response = await request(route('tipos-tanques.index'))
        setTankTypes(response)
        setLoading(false)
    }

    useEffect(() => {
        fetchTankTypes()
    }, [])
    useEffect(() => {
        console.log(action)
    }, [action])


    useEffect(() => {
        if (data.nombre === '') {
            setData({ idTipoTanque: '', nombre: '', activo: 1 })
            setAction('create')
        }
    }, [data.nombre])

    const submit = async () => {
        const result = validateInputs(tankTypeValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        if (action === 'create') {
            await request(route('tipos-tanques.store'), 'POST', data)
            fetchTankTypes()
        } else if (action === 'edit') {
            await request(route('tipos-tanques.update', data.idTipoTanque), 'PUT', data)
            fetchTankTypes()
        }
        setData({ idTipoTanque: '', nombre: '', activo: 1 })
        setAction('create')
        setErrors({})
    }

    return (
        <>
            {loading &&
                <LoadingDiv />
            }
            <DialogComp dialogProps={{
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit,
                actionState: action || 'create',
                openState: open.tankType,
                model: 'Tipo de tanque',
                width: 'sm',
                style: 'grid grid-cols-1 ',
            }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: 'text',
                        fieldKey: 'nombre',
                        value: data.nombre || '',
                        onChangeFunc: (e) => setData({ ...data, nombre: e.target.value })
                    },
                    {
                        label: "Activo",
                        select: true,
                        options: action === 'create' ? [{ id: 1, value: 'Activo' }] : [{ id: 1, value: 'Activo' }, { id: 0, value: 'Inactivo' }],
                        value: data.activo || '',
                        onChangeFunc: (e) => setData({ ...data, activo: e }),
                        data: 'value',
                        valueKey: 'id',
                    },
                    {
                        label: "",
                        custom: true,
                        value: '',
                        style: 'justify-center',
                        customItem: () =>
                        (
                            <div>
                                {
                                    loading ? (<div className='min-h-[12rem] flex justify-center items-center'><LoadingDiv /></div>) : (
                                        <div className="flex w-full py-5 gap-6">
                                            <div className="text-center w-full h-full">
                                                <h4 className='w-full text-2xl font-semibold mb-4'>Lista de Tipos</h4>
                                                <div className='rounded-md border max-h-48 min-h-[12rem] overflow-y-auto ' >
                                                    <table className='w-full '>
                                                        <thead className=' bg-[#2B3F75] sticky top-0 w-full '>
                                                            <tr>
                                                                <th className='text-white py-1 rounded-tl-md border-r w-1/2'>Tipo</th>
                                                                <th className='text-white py-1 rounded-tr-md w-1/2'>Estatus</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tankTypes.length > 0 ? tankTypes.map((type) => {
                                                                return (
                                                                    <tr onClick={() => { setData({ ...type }); setAction('edit') }} key={type.idTipoTanque} className={`table-hover hover:bg-[#E0DFF3] border-b`}>
                                                                        <td className='py-1 '>{type.nombre}</td>
                                                                        <td className='py-1 border-l'>
                                                                            <div className='flex w-full items-center justify-center'>
                                                                                {Number(type.activo) ? (<div className='bg-[#2E7D32] text-white w-1/2 rounded-xl'>Activo</div>) : (<div className='bg-red-500 text-white w-1/2 rounded-xl'>Inactivo</div>)}
                                                                            </div>
                                                                        </td>
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
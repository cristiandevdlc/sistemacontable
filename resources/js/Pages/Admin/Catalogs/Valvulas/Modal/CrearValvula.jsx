import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp'

export default function CrearValvula({ handleCloseModal, fetchValves, selectedRowToAction, action, open }) {
    const valveValidations = { nombre: ['required'], idTipoValvula: ['required'], descripcion: ['required'], marca: ['required'], modelo: ['required'], tiempoVida: ['required'], fechaRegistro: ['required'], fechaValvula: ['required'], activo: ['required'], numSerie: ['required'], }

    const [avaliableValvesTypes, setAvaliableValvesTypes] = useState([])
    const { data, setData } = useForm({ idValvula: selectedRowToAction?.idValvula || '', nombre: selectedRowToAction?.nombre || '', descripcion: selectedRowToAction?.descripcion || '', marca: selectedRowToAction?.marca || '', modelo: selectedRowToAction?.modelo || '', tiempoVida: selectedRowToAction?.tiempoVida || '', fechaRegistro: selectedRowToAction?.fechaRegistro || '', activo: selectedRowToAction?.activo || 1, numSerie: selectedRowToAction?.numSerie || '', idTipoValvula: selectedRowToAction?.idTipoValvula || '', fechaValvula: selectedRowToAction?.fechaRegistro || '' })
    const [errors, setErrors] = useState({})

    const fetchAvaliableValvesTypes = async () => {
        const response = await request(route('tipos-valvulas.activas'))
        setAvaliableValvesTypes(response)
    }
    useEffect(() => {
        console.log(data)
        fetchAvaliableValvesTypes()
    }, [])

    const submit = async () => {
        const result = validateInputs(valveValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        if (action === 'create') {
            await request(route('valvulas.store'), 'POST', data)
            fetchValves()
            setData({ idValvula: '', nombre: '', descripcion: '', marca: '', modelo: '', tiempoVida: '', fechaRegistro: '', activo: 1, numSerie: '', idTipoValvula: '', fechaValvula: '' })
        } else if (action === 'edit') {
            await request(route('valvulas.update', data.idValvula), 'PUT', data)
            fetchValves()
        }
        handleCloseModal()
        setErrors({})
    }

    return (
        <>
            <DialogComp dialogProps={{
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit,
                actionState: action,
                openState: open.valve,
                model: 'Valvula',
                width: 'sm',
                style: 'grid grid-cols-2 gap-4 ',
            }}
                fields={[
                    {
                        label: "Tipo de valvula",
                        select: true,
                        options: avaliableValvesTypes || [],
                        value: data.idTipoValvula,
                        onChangeFunc: (e) => setData({ ...data, idTipoValvula: e }),
                        data: 'nombre',
                        fieldKey: 'idTipoValvula',
                        valueKey: 'idTipoValvula',
                    },
                    {
                        label: "Nombre",
                        input: true,
                        type: 'text',
                        fieldKey: 'nombre',
                        value: data.nombre || '',
                        onChangeFunc: (e) => setData({ ...data, nombre: e.target.value })
                    },
                    {
                        label: "Descripcón",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcion',
                        value: data.descripcion || '',
                        onChangeFunc: (e) => setData({ ...data, descripcion: e.target.value })
                    },
                    {
                        label: "Marca",
                        input: true,
                        type: 'text',
                        fieldKey: 'marca',
                        value: data.marca || '',
                        onChangeFunc: (e) => setData({ ...data, marca: e.target.value })
                    },
                    {
                        label: "Modelo",
                        input: true,
                        type: 'text',
                        fieldKey: 'modelo',
                        value: data.modelo || '',
                        onChangeFunc: (e) => setData({ ...data, modelo: e.target.value })
                    },
                    {
                        label: "Tiempo de vida en años",
                        input: true,
                        type: 'text',
                        fieldKey: 'tiempoVida',
                        value: data.tiempoVida || '',
                        onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 3); setData({ ...data, tiempoVida: input }); }

                    },
                    {
                        label: "Activo",
                        select: true,
                        fieldKey: 'activo',
                        options: action === 'create' ? [{ id: 1, value: 'Activo' }] : [{ id: 1, value: 'Activo' }, { id: 0, value: 'Inactivo' }],
                        value: data.activo || '',
                        onChangeFunc: (e) => setData({ ...data, activo: e }),
                        data: 'value',
                        valueKey: 'id',
                    },
                    {
                        label: "No. Serie",
                        input: true,
                        type: 'text',
                        fieldKey: 'numSerie',
                        value: data.numSerie || '',
                        onChangeFunc: (e) => setData({ ...data, numSerie: e.target.value })
                    },
                    {
                        label: "Fecha de registro",
                        input: true,
                        type: 'date',
                        fieldKey: 'fechaRegistro',
                        value: data.fechaRegistro || '',
                        onChangeFunc: (e) => setData({ ...data, fechaRegistro: e.target.value })
                    },
                    {
                        label: "Fecha de la valvula",
                        input: true,
                        type: 'date',
                        fieldKey: 'fechaValvula',
                        value: data.fechaValvula || '',
                        onChangeFunc: (e) => setData({ ...data, fechaValvula: e.target.value })
                    },
                ]}
                errors={errors}
            />
        </>
    )
}
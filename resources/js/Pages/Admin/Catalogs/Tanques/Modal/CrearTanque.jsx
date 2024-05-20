import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp'

export default function CrearTanque({ handleCloseModal, fetchTanks, action, selectedRowToAction, setRowData, open }) {


    useEffect(() => {
        setRowData({ idTanque: '', idTipoTanque: "", capacidad: '', serie: '', ubicacion: '', fecha: '', activo: 1, marca: '', precio: '', idUnidadMedida: "" })
    }, [])
    const tankValidation = { idTipoTanque: ['required'], activo: ['required'], capacidad: ['required'], serie: ['required'], ubicacion: ['required'], fecha: ['required'], marca: ['required'], precio: ['required'], idUnidadMedida: ['required'] }

    const [avaliableTankTypes, setAvaliableTankTypes] = useState([])
    const [measurementUnits, setMeasurementUnits] = useState([])
    const { data, setData } = useForm({ idTanque: action === 'edit' ? selectedRowToAction?.idTanque  : '', idTipoTanque: action === 'edit' ? selectedRowToAction?.idTipoTanque : '', capacidad: action === 'edit' ? selectedRowToAction?.capacidad : '', serie: action === 'edit' ? selectedRowToAction?.serie : '', ubicacion: action === 'edit' ? selectedRowToAction?.ubicacion : '', fecha: action === 'edit' ? selectedRowToAction?.fecha : '', activo: action === 'edit' ? selectedRowToAction?.activo : selectedRowToAction?.activo ? 1 : 1, marca: action === 'edit' ? selectedRowToAction?.marca : '', precio: action === 'edit' ? selectedRowToAction?.precio : '', idUnidadMedida: action === 'edit' ?  selectedRowToAction?.idUnidadMedida : '' })
    const [errors, setErrors] = useState({})

    const fetchAvaliableTankTypes = async () => {
        const response = await request(route('tipos-tanques.activos'))
        setAvaliableTankTypes(response)
    }
    const fetchMeasurementUnits = async () => {
        const response = await request(route('unidades-de-medida.index'))
        setMeasurementUnits(response)
    }

    useEffect(() => {
        fetchAvaliableTankTypes()
        fetchMeasurementUnits()
    }, [])

    const submit = async () => {

        const result = validateInputs(tankValidation, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        if (action === 'create') {
            await request(route('tanques.store'), 'POST', data)
            fetchTanks()
        } else if (action === 'edit') {
            await request(route('tanques.update', data.idTanque), 'PUT', data)
            fetchTanks()
            handleCloseModal()
        }
        setData({ idTanque: '', idTipoTanque: "", capacidad: '', serie: '', ubicacion: '', fecha: '', activo: 1, marca: '', precio: '', idUnidadMedida: "" })
        setErrors({})
    }

    return (
        <>
            <DialogComp dialogProps={{
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit,
                actionState: action,
                openState: open.tank,
                model: 'Tanque',
                width: 'sm',
                style: 'grid grid-cols-2 gap-4 ',
            }}
                fields={[
                    {
                        label: "Tipo de tanque",
                        fieldKey: 'idTipoTanque',
                        select: true,
                        options: avaliableTankTypes || [],
                        value: data.idTipoTanque || "",
                        onChangeFunc: (e) => setData({ ...data, idTipoTanque: e }),
                        data: 'nombre',
                        valueKey: 'idTipoTanque',
                    },
                    {
                        label: "Unidad de medida",
                        fieldKey: 'idUnidadMedida',
                        select: true,
                        options: measurementUnits || [],
                        value: data.idUnidadMedida || "",
                        onChangeFunc: (e) => setData({ ...data, idUnidadMedida: e }),
                        data: 'unidadMedida_nombre',
                        valueKey: 'unidadMedida_idUnidadMedida',
                    },
                    {
                        label: "No. Serie",
                        input: true,
                        type: 'text',
                        fieldKey: 'serie',
                        value: data.serie || '',
                        onChangeFunc: (e) => setData({ ...data, serie: e.target.value })
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
                        label: "Capacidad",
                        input: true,
                        type: 'text',
                        fieldKey: 'capacidad',
                        value: data.capacidad || '',
                        onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 15); setData({ ...data, capacidad: input }); }

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
                        label: "Precio",
                        input: true,
                        type: 'text',
                        fieldKey: 'precio',
                        value: data.precio || '',
                        onChangeFunc: (e) => { const input = e.target.value; if (/^\d*\.?\d*$/.test(input)) { setData({ ...data, precio: input }) } }
                    },
                    {
                        label: "Fecha de Fabricación",
                        input: true,
                        type: 'date',
                        fieldKey: 'fecha',
                        value: data.fecha || '',
                        onChangeFunc: (e) => setData({ ...data, fecha: e.target.value })
                    },
                    {
                        label: "Comentarios",
                        input: true,
                        style: 'col-span-2',
                        type: 'text',
                        fieldKey: 'ubicacion',
                        value: data.ubicacion || '',
                        onChangeFunc: (e) => setData({ ...data, ubicacion: e.target.value })
                    },
                ]}
                errors={errors}
            />
        </>
    )
}
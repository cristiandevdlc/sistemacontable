import Datatable from '@/components/Datatable'
import DialogComp from '@/components/DialogComp'
import LoadingDiv from '@/components/LoadingDiv';
import request, { validateInputs } from '@/utils';
import { useForm } from '@inertiajs/react'
import { Chip, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'

const ConfiguracionAutotransporte = () => {
    const { data, setData } = useForm({ idConfigAutotransporte: '', claveConfigAutotransporte: '', descripcionConfigAutotransporte: '', ejesConfigAutotransporte: '', llantasConfigAutotransporte: '', remolqueConfigAutotransporte: '' })
    const [action, setAction] = useState('create')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [configuracionAutotransporte, setConfiguracionAutotransporte] = useState()

    //validaciones //
    const AutotransporteValidations = {
        claveConfigAutotransporte: 'required',
        descripcionConfigAutotransporte: 'required',
        ejesConfigAutotransporte: 'required',
        llantasConfigAutotransporte: 'required',
        remolqueConfigAutotransporte: 'required'
    }

    const fetchConfiguracionAutotransporte = async () => {
        const response = await request(route('configuracion-autotransporte.index'))
        setConfiguracionAutotransporte(response)
    }

    useEffect(() => {
        fetchConfiguracionAutotransporte()
    }, [])

    useEffect(() => {
        if (configuracionAutotransporte) setLoading(false)
    }, [configuracionAutotransporte])

    const resetData = () => {
        setData({ idConfigAutotransporte: '', claveConfigAutotransporte: '', descripcionConfigAutotransporte: '', ejesConfigAutotransporte: '', llantasConfigAutotransporte: '', remolqueConfigAutotransporte: '' })
    }

    const submit = async () => {
        const result = validateInputs(AutotransporteValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        if (action === 'create') {
            await request(route('configuracion-autotransporte.store'), 'POST', data)
            fetchConfiguracionAutotransporte()
            resetData()
            setOpen(false)
        } else if (action === 'edit') {
            await request(route('configuracion-autotransporte.update', data.idConfigAutotransporte), 'PUT', data)
            fetchConfiguracionAutotransporte()
            resetData()
            setOpen(false)
        }
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => { setAction('create'); setOpen(true); }}
                        data={configuracionAutotransporte}
                        virtual={true}
                        columns={[
                            { header: 'Clave', accessor: 'claveConfigAutotransporte', width: '10%' },
                            { header: 'Descripción', accessor: 'descripcionConfigAutotransporte' },
                            { header: "Ejes", accessor: 'ejesConfigAutotransporte', width: '5%' },
                            { header: 'Llantas', accessor: 'llantasConfigAutotransporte', width: '6%' },
                            {
                                header: "Doble remolque",
                                accessor: "remolqueConfigAutotransporte",
                                cell: (eprops) => Number(eprops.item.remolqueConfigAutotransporte) === 1 ? (<Chip label="Si" color="success" />) : (<Chip label="No" color="error" />),
                            },
                            {
                                header: 'Acciones', cell: eprops =>
                                    <Tooltip title="Editar">
                                        <button onClick={() => { setAction('edit'); setOpen(true); setData({ idConfigAutotransporte: eprops.item.idConfigAutotransporte, claveConfigAutotransporte: eprops.item.claveConfigAutotransporte, descripcionConfigAutotransporte: eprops.item.descripcionConfigAutotransporte, ejesConfigAutotransporte: eprops.item.ejesConfigAutotransporte, llantasConfigAutotransporte: eprops.item.llantasConfigAutotransporte, remolqueConfigAutotransporte: eprops.item.remolqueConfigAutotransporte }); }} className="material-icons">edit</button>
                                    </Tooltip>
                            }
                        ]}
                    />
                    <DialogComp dialogProps={{
                        model: 'configuracion de autotransporte',
                        width: 'sm',
                        openState: open,
                        style: 'grid grid-cols-2 gap-4',
                        actionState: action,
                        openStateHandler: () => { setOpen(false); resetData() },
                        onSubmitState: () => submit
                    }}
                        fields={[
                            {
                                label: "Clave de configuracion",
                                input: true,
                                type: 'text',
                                fieldKey: 'claveConfigAutotransporte',
                                value: data.claveConfigAutotransporte || '',
                                onChangeFunc: (e) => { setData({ ...data, claveConfigAutotransporte: e.target.value }) }
                            },
                            {
                                label: "Doble remolque",
                                select: true,
                                options: [{ id: 1, value: 'Si' }, { id: 0, value: 'No' }],
                                value: data.remolqueConfigAutotransporte || '',
                                onChangeFunc: (e) => setData({ ...data, remolqueConfigAutotransporte: e }),
                                data: 'value',
                                valueKey: 'id',
                            },
                            {
                                label: "Descripción",
                                input: true,
                                type: 'text',
                                style: 'col-span-2',
                                fieldKey: 'descripcionConfigAutotransporte',
                                value: data.descripcionConfigAutotransporte || '',
                                onChangeFunc: (e) => { setData({ ...data, descripcionConfigAutotransporte: e.target.value }) }
                            },
                            {
                                label: "Ejes",
                                input: true,
                                type: 'text',
                                fieldKey: 'ejesConfigAutotransporte',
                                value: data.ejesConfigAutotransporte || '',
                                onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 2); setData({ ...data, ejesConfigAutotransporte: input }) }
                            },
                            {
                                label: "Llantas",
                                input: true,
                                type: 'text',
                                fieldKey: 'llantasConfigAutotransporte',
                                value: data.llantasConfigAutotransporte || '',
                                onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 2); setData({ ...data, llantasConfigAutotransporte: input }) }
                            },

                        ]}
                    />
                </div>
            }
        </div>
    )
}

export default ConfiguracionAutotransporte
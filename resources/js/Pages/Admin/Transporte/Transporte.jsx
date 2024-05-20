import Datatable from '@/components/Datatable'
import DialogComp from '@/components/DialogComp'
import request, { validateInputs } from "@/utils";
import { useForm } from '@inertiajs/react'
import { Chip, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import Imagen from './../Telermark/ClientesPedidos/img/camion.png'
import LoadingDiv from '@/components/LoadingDiv';

const Transporte = () => {
    const { data, setData } = useForm({ idOperador: '', Nombre: '', ApellidoPaterno: '', ApellidoMaterno: '', Licencia: '', RFC: '', estatus: '', idPersona: '' })//idPersona es un helper
    const [action, setAction] = useState('create')
    const [open, setOpen] = useState({ existente: false, fuera: false, choose: false })
    const [loading, setLoading] = useState(true)
    const [operadores, setOperadores] = useState([])
    const [operadoresTractoSelect, setOperadoresTractoSelect] = useState([])
    const [errors, setErrors] = useState({});

    const fetchOperadores = async () => {
        const response = await request(route('transporte-operadores.index'))
        setOperadores(response)
    }

    const fetchOperadoresTracto = async () => {
        const response = await request(route('transporte-operadores-tracto'))
        setOperadoresTractoSelect(response)
    }

    const stecValidations = {
        Nombre: "required",
        ApellidoPaterno: "required",
        ApellidoMaterno: "required",
        Licencia: "required",
        RFC: "required",
        // estatus: "required",
    }

    useEffect(() => {
        if (data.idPersona !== '' && action === 'create') {
            const result = operadoresTractoSelect.filter(persona => persona.idPersona === data.idPersona)
            console.log(result);
            setData({ ...data, Nombre: result[0].Nombres, ApellidoPaterno: result[0].ApePat, ApellidoMaterno: result[0].ApeMat, RFC: result[0].RFC, estatus: result[0].Estatus })
        }
    }, [data.idPersona])

    useEffect(() => {
        fetchOperadores()
        fetchOperadoresTracto()
    }, [])

    useEffect(() => {
        if (operadores && operadoresTractoSelect) setLoading(false)
    }, [operadores, operadoresTractoSelect])

    const resetData = () => {
        setData({ idOperador: '', Nombre: '', ApellidoPaterno: '', ApellidoMaterno: '', Licencia: '', RFC: '', estatus: '', idPersona: '' })
    }

    const submit = async () => {
        if (action === 'create') {
            setErrors({})
            const result = validateInputs(stecValidations, data)
            if (!result.isValid) {
                setErrors(result.errors)
                return;
            }

            await request(route('transporte-operadores.store'), 'POST', data)
            fetchOperadores()
            resetData()
            fetchOperadoresTracto()
            setOpen({ existente: false, fuera: false, choose: false })
        } else if (action === 'edit') {
            await request(route('transporte-operadores.update', data.idOperador), 'PUT', data)
            fetchOperadores()
            resetData()
            fetchOperadoresTracto()
            setOpen({ existente: false, fuera: false, choose: false })
        }
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setOpen(prev => ({ ...prev, choose: !prev.choose }))
                        }}
                        data={operadores}
                        virtual={true}
                        columns={[
                            { header: 'Nombre', accessor: 'Nombre' },
                            { header: 'Apellido Paterno', accessor: 'ApellidoPaterno' },
                            { header: 'Apellido Materno', accessor: 'ApellidoMaterno' },
                            { header: 'Licencia', accessor: 'Licencia' },
                            { header: 'RFC', accessor: 'RFC' },
                            {
                                header: "Activo",
                                accessor: "estatus",
                                cell: (eprops) => Number(eprops.item.estatus) === 1 ? (<Chip label="Activo" color="success" />) : (<Chip label="Inactivo" color="error" />),
                            },
                            {
                                header: 'Acciones', cell: eprops =>
                                    <>
                                        <Tooltip title="Editar">
                                            <button className="material-icons"
                                                onClick={() => { setAction('edit'); setData(eprops.item); setOpen(prev => ({ ...prev, fuera: !prev.fuera })) }}>
                                                edit
                                            </button>
                                        </Tooltip>
                                    </>
                            }
                        ]}
                    />
                    <DialogComp dialogProps={{

                        openStateHandler: () => setOpen(prev => ({ ...prev, choose: !prev.choose })),
                        onSubmitState: () => { },
                        actionState: 'x',
                        openState: open.choose,
                        model: 'x',
                        width: 'xl',
                        style: '',
                    }}
                        fields={[
                            {
                                label: "",
                                custom: true,
                                value: '',
                                style: '',
                                customItem: () =>
                                (
                                    <>
                                        <section className="overflow-hidden  sm:grid sm:grid-cols-2">
                                            <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                                                <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                                                    <a
                                                        href="#"
                                                        className="group relative block "
                                                        onClick={() => {
                                                            setAction('create');
                                                            setOpen((prev) => ({ ...prev, choose: !prev.choose, fuera: !prev.fuera }));
                                                        }}
                                                    >

                                                        <img src={Imagen} alt=""
                                                            className="absolute inset-0 h-full w-full object-cover  transition-opacity " />

                                                        <div className="relative p-4 sm:p-6 lg:p-8">
                                                            <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                                                                Crear
                                                            </p>

                                                            <p className="text-xl font-bold text-white sm:text-2xl">operador</p>

                                                            <div className="mt-32 sm:mt-48 lg:mt-64">
                                                                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                                                <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                                                    <a href="#" className="group relative block"
                                                        onClick={() => { setAction('create'); setOpen(prev => ({ ...prev, choose: !prev.choose, existente: !prev.existente })); }} >
                                                        <img src={Imagen} alt=""
                                                            className="absolute inset-0 h-full w-full object-cover  transition-opacity " />
                                                        <div className="relative p-4 sm:p-6 lg:p-8">
                                                            <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                                                                Operador
                                                            </p>

                                                            <p className="text-xl font-bold text-white sm:text-2xl">existente</p>
                                                            <div className="mt-32 sm:mt-48 lg:mt-64">
                                                                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                ),
                                onChangeFunc: null,
                            },
                        ]}
                    />
                    <DialogComp dialogProps={{
                        model: open.existente ? 'licencia de operador' : 'operador',
                        width: 'sm',
                        openState: open.existente ? open.existente : open.fuera,
                        style: 'grid grid-cols-2 gap-4',
                        actionState: action,
                        openStateHandler: () => { setOpen({ existente: false, fuera: false }); resetData() },
                        onSubmitState: () => submit
                    }}
                        fields={[
                            open.existente ? {
                                label: "Seleccionar operador",
                                select: true,
                                options: operadoresTractoSelect || [],
                                value: data.idPersona || '',
                                onChangeFunc: (e) => setData({ ...data, idPersona: e }),
                                data: 'Nombres',
                                valueKey: 'idPersona',
                            } : {
                                label: "Nombres",
                                input: true,
                                type: 'text',
                                fieldKey: 'Nombre',
                                disabled: open.existente ? true : false,
                                value: data.Nombre || [],
                                onChangeFunc: (e) => { setData({ ...data, Nombre: e.target.value }) }
                            },
                            ,
                            {
                                label: "Apellido Paterno",
                                input: true,
                                type: 'text',
                                fieldKey: 'ApellidoPaterno',
                                disabled: open.existente ? true : false,
                                value: data.ApellidoPaterno || [],
                                onChangeFunc: (e) => { setData({ ...data, ApellidoPaterno: e.target.value }) }
                            },

                            {
                                label: "Apellido Materno",
                                input: true,
                                type: 'text',
                                fieldKey: 'ApellidoMaterno',
                                disabled: open.existente ? true : false,
                                value: data.ApellidoMaterno || '',
                                onChangeFunc: (e) => { setData({ ...data, ApellidoMaterno: e.target.value }) }
                            },
                            {
                                label: "Licencia",
                                input: true,
                                type: 'text',
                                fieldKey: 'Licencia',
                                value: data.Licencia || '',
                                onChangeFunc: (e) => { setData({ ...data, Licencia: e.target.value }) }
                            },
                            {
                                label: "RFC",
                                input: true,
                                type: 'text',
                                fieldKey: 'descripcion',
                                disabled: open.existente ? true : false,
                                value: data.RFC || '',
                                onChangeFunc: (e) => {
                                    const inputValue = e.target.value;
                                    if (inputValue.length <= 13) {
                                        setData({ ...data, RFC: inputValue });
                                    }
                                }
                            },
                            {
                                label: "Activo",
                                select: true,
                                options: action === 'create' ? [{ id: 1, value: 'Activo' }] : [{ id: 1, value: 'Activo' }, { id: 0, value: 'Inactivo' }],
                                disabled: open.existente ? true : false,
                                value: data.estatus || '',
                                onChangeFunc: (e) => setData({ ...data, estatus: e }),
                                data: 'value',
                                valueKey: 'id',
                            },
                        ]}
                        errors={errors}
                    />
                </div>
            }
        </div>
    )
}

export default Transporte
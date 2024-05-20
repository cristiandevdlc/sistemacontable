import request, { getEnterpriseData, noty, validateInputs } from '@/utils';
import { IntRedData, IntRedRules, IntRedStates } from './IntRed';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';
import { Chip, Tooltip } from '@mui/material';

const actions = {
    create: 0,
    update: 1,
}

export default function Red() {
    const [states, setStates] = useState(IntRedStates)
    const [data, setData] = useState(IntRedData)

    const getAllData = async () => {
        const [
            redes,
            personas,
            proveedores,
        ] = await Promise.all([
            request(route("red.index")),
            request(route('getAllEmployees')),
            request(route("proveedor.index")),
        ])

        setStates({
            // ...states,
            historico: [],
            redes: redes,
            personas: personas,
            proveedores: proveedores,
        })
    }

    const handleModal = (action = actions.create) => setStates({
        ...states,
        open: !states.open,
        errors: {},
        action: action
    });

    const handleHistorico = (historico = []) => setStates({ ...states, openHistorico: !states.openHistorico, historico: historico });

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const onSubmit = async () => {
        // console.log(data)
        // return
        const validator = validateInputs(IntRedRules, data)

        if (!validator.isValid) {
            setStates({ ...states, errors: validator.errors })
            return
        }
        const ruta = states.action ? route("red.update", data.red_idRed) : route("red.store")
        const method = states.action ? "PUT" : "POST"

        await request(ruta, method, data, {
            enabled: true,
            error: { type: 'error', message: 'Esta red ya está creada' },
            success: { type: 'success', message: 'Red guardada exitosamente.' }
        })
        const redes = await request(route("red.index"));
        setData(IntRedData)
        setStates({
            ...states,
            redes: redes,
            loading: false,
            errors: {},
            open: false
        })
    }

    const validateNetwork = async (id) => {
        await request(route("comprobar-red", id));
        const redes = await request(route("red.index"), 'GET', {}, {
            enabled: true,
            error: { type: 'error', message: 'Hubo un error al comprobar la red' },
            success: { type: 'success', message: 'Red comprobada exitosamente.' }
        });
        setStates({
            ...states,
            redes: redes
        })
    }

    const getHistorico = async (id) => {
        const response = await request(route('historico-red', id));
        if (!response)
            noty("Esta red no tiene historico", "error")
        else
            handleHistorico(response)
    }

    useEffect(() => {
        getAllData()
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {states.loading && <LoadingDiv />}
            {(!states.loading) && (
                <>
                    <div>
                        <Datatable
                            add={() => {
                                setData(IntRedData)
                                handleModal()
                            }}
                            data={states.redes}
                            columns={[
                                { header: 'Número', accessor: 'red_numero', width: '10%' },
                                // { header: 'Departamento', cell: ({ item }) => item.asignacion ? item.asignacion?.persona?.departamento?.nombre : "-", width: '16%' },
                                { header: 'Proveedor', cell: ({ item }) => item.proveedor ? item.proveedor?.proveedor_nombrecomercial : "-", width: '16%' },
                                { header: 'Asignado a', cell: ({ item }) => item.asignacion ? item.asignacion?.persona?.nombre_completo : "-", width: '16%' },
                                { header: 'Asignado por', cell: ({ item }) => item.asignacion ? item.asignacion?.user?.usuario_nombre : "-", width: '16%' },
                                { header: 'F. Asignacion', cell: ({ item }) => item.asignacion ? (new Date(item.asignacion?.FechaAsignacion)).formatMXNoTime() : "-", width: '16%' },
                                { header: 'F. Comprobación', cell: ({ item }) => item.asignacion ? (new Date(item.asignacion?.FechaComprobacion)).formatMXNoTime() : "-", width: '16%' },
                                {
                                    header: 'Estatus', cell: ({ item }) => item.asignacion ? (
                                        <>
                                            {item.asignacion?.estatus == 1 && (<Chip label="Activa" color="success" size="small" />)}
                                            {item.asignacion?.estatus == 0 && (<Chip label="Inactivo" color="warning" size="small" />)}
                                        </>
                                    ) : <Chip label="Sin asignar" color="error" size="small" />,
                                    width: '16%'
                                },
                                {
                                    header: "Acciones",
                                    edit: ({ item }) => {
                                        handleModal(actions.update)
                                        setData(item)
                                    },
                                    cell: ({ item }) => (
                                        <Tooltip title="Ver historico">
                                            <button
                                                onClick={() => {
                                                    setData(item)
                                                    getHistorico(item.red_idRed)
                                                }}
                                                className="material-icons"
                                            >
                                                list
                                            </button>
                                        </Tooltip>
                                    ),
                                    custom: ({ item }) => (
                                        item.asignacion && <Tooltip title="Comprobar">
                                            <button
                                                onClick={() => validateNetwork(item.asignacion.idAsignacionLinea)}
                                                className="material-icons"
                                            >
                                                file_download_done
                                            </button>
                                        </Tooltip>
                                    ),
                                    width: '10%'
                                }
                            ]}
                        />
                    </div>

                    <DialogComp
                        dialogProps={{
                            openStateHandler: handleModal,
                            onSubmitState: () => onSubmit,
                            actionState: states.action ? 'edit' : 'create',
                            openState: states.open,
                            model: 'red',
                            width: 'sm',
                            style: 'grid grid-cols-1',

                        }}
                        fields={[
                            {
                                label: "Numero Red *",
                                input: true,
                                type: 'text',
                                fieldKey: 'red_numero',
                                value: data.red_numero || '',
                                onChangeFunc: (e) => setData({ ...data, red_numero: e.target.value.replace(/\D/g, "").slice(0, 10)})
                            },
                            {
                                label: "Proveedor *",
                                select: true,
                                options: states.proveedores,
                                data: 'proveedor_nombrecomercial',
                                fieldKey: 'red_idProveedor',
                                valueKey: 'proveedor_id',
                                value: data.red_idProveedor || "",
                                onChangeFunc: (newValue) => setData({ ...data, red_idProveedor: newValue }),
                            },
                            {
                                label: "Responsable",
                                select: true,
                                options: states.personas.filter(p => data.red_idEmpresa ? (p.IdCentroCostos == data.red_idEmpresa) : true),
                                data: 'nombre_completo',
                                fieldKey: 'IdPersona',
                                valueKey: 'IdPersona',
                                value: data.asignacion?.IdPersona || "",
                                onChangeFunc: (newValue, o) => setData({
                                    ...data,
                                    asignacion: {
                                        ...data.asignacion,
                                        IdPersona: newValue,
                                        estatus: '1'
                                    },
                                    red_idEmpresa: data.red_idEmpresa ? data.red_idEmpresa : o ? o.IdCentroCostos : null
                                }),
                            },
                            {
                                label: "Activa",
                                check: true,
                                fieldKey: 'estatus',
                                checked: data.asignacion?.estatus,
                                _conditional: () => states.action,
                                style: 'justify-center mt-5',
                                onChangeFunc: (e) => setData({
                                    ...data,
                                    asignacion: { ...data.asignacion, estatus: e.target.checked ? "1" : "0" },
                                }),
                            }

                        ]}
                        errors={states.errors}
                    />

                    <DialogComp
                        dialogProps={{
                            openStateHandler: () => handleHistorico(states.historico),
                            onSubmitState: () => onSubmit,
                            customTitle: true,
                            openState: states.openHistorico,
                            model: `Historico de red: ${data.red_numero}`,
                            width: 'lg',
                            style: 'grid grid-cols-1',

                        }}
                        fields={[
                            {
                                custom: true,
                                customItem: () =>
                                (
                                    <Datatable
                                        data={states.historico}
                                        searcher={false}
                                        virtual={true}
                                        columns={[
                                            { header: 'Departamento', cell: ({ item }) => item ? item.persona?.departamento?.nombre : "-", width: '16%' },
                                            { header: 'Asignado a', cell: ({ item }) => item ? item.persona?.nombre_completo : "-", width: '16%' },
                                            { header: 'Asignado por', cell: ({ item }) => item ? item.user?.usuario_nombre : "-", width: '16%' },
                                            { header: 'F. Asignacion', cell: ({ item }) => item ? (new Date(item.FechaAsignacion)).formatMXNoTime() : "-", width: '16%' },
                                            { header: 'F. Comprobación', cell: ({ item }) => item ? (new Date(item.FechaComprobacion)).formatMXNoTime() : "-", width: '16%' },
                                            {
                                                header: 'Estatus', cell: ({ item }) => (
                                                    <>
                                                        {item.estatus == 2 && (<Chip label="Sin asignación" color="error" size="small" />)}
                                                        {item.estatus == 1 && (<Chip label="Activa" color="success" size="small" />)}
                                                        {item.estatus == 0 && (<Chip label="Inactivo" color="warning" size="small" />)}
                                                    </>
                                                ),
                                                width: '16%'
                                            },
                                        ]}
                                    />
                                )
                            }
                        ]}
                        errors={states.errors}
                    />
                </>
            )}
        </div>
    )
}

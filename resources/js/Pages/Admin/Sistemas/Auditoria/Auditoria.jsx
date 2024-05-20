import { IntDataAuditoria, IntStateAuditoria } from "./IntAuditoria";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import request from "@/utils";

const actions = {
    create: 0,
    update: 1,
}

export default function Auditoria() {
    const [states, setStates] = useState(IntStateAuditoria);
    const [modifiedList, setModifiedList] = useState([])
    const [data, setData] = useState(IntDataAuditoria);

    const getAllData = async () => {
        const [
            listaAuditoria,
            personas,
            departamentos
        ] = await Promise.all([
            request(route('auditoria.index')),
            request(route('getAllEmployees')),
            request(route('departamento.index'))
        ]);

        setStates({
            ...states,
            listaAuditoria: listaAuditoria,
            departamentos: departamentos,
            personas: personas,
            loading: false
        })
    }

    const handleModal = async (action = actions.create, auditoria = null) => {
        const stateBody = {
            ...states,
            open: !states.open,
            errors: {},
            action: action,
            detalles: []
        }

        setModifiedList([])

        if (!states.open) {
            if (action === actions.create) setStates({
                ...stateBody,
                detalles: await request(route('auditoria-detalles.index'))
            })
            if (action === actions.update) setStates({
                ...stateBody,
                detalles: await request(route('auditoria-detalles.show', auditoria.idInventarioEquipos))
            })
        }

        states.open && setStates(stateBody)
    }

    const updateEmail = async (e) => {
        if (e.newData) setModifiedList([
            ...modifiedList.filter(reg => reg.idConceptoRevision != e.oldData.idConceptoRevision),
            e.oldData
        ])

    };

    const submit = async () => {
        const idsConceptos = modifiedList.map(reg => reg.idConceptoRevision)
        const detalles = [
            ...states.detalles.filter(reg => !idsConceptos.includes(reg.idConceptoRevision)),
            ...modifiedList
        ]

        const url = states.action === actions.create ?
            route('auditoria-detalles.store') :
            route('auditoria-detalles.update', data.idInventarioEquipos)
        const method = states.action === actions.create ? 'POST' : 'PUT'

        await request(url, method, {
            ...data,
            detalles: detalles,
        }, {
            enabled: true,
            error: { message: 'Error al guardar la auditoria' },
            success: {
                message: states.action ? 'Auditoria actualizada' : 'Auditoria guardada',
                type: states.action ? 'warning' : 'success'
            }
        })
    }

    useEffect(() => {
        getAllData();
    }, []);

    return <>
        {states.loading && <LoadingDiv />}
        {
            !states.loading && <Datatable
                add={() => {
                    setData(IntDataAuditoria)
                    handleModal()
                }}
                data={states.listaAuditoria}
                virtual={true}
                columns={[
                    { header: 'Persona', cell: ({ item }) => item.persona?.nombre_completo, width: '35%' },
                    { header: 'Departamento', cell: ({ item }) => item.persona?.departamento?.nombre, width: '25%' },
                    { header: 'Módelo de Equipo', cell: ({ item }) => item.descripcionEquipo, width: '25%' },
                    {
                        header: "Acciones",
                        edit: ({ item }) => {
                            handleModal(actions.update, item)
                            setData(item)
                        },
                        width: '15%'
                    },
                ]}
            />
        }

        <DialogComp
            dialogProps={{
                openStateHandler: () => handleModal(),
                onSubmitState: () => submit,
                customTitle: true,
                openState: states.open,
                actionState: states.action === actions.create ? 'create' : 'edit',
                model: states.action === actions.create ?
                    'Añadir nueva auditoria' :
                    `Editar auditoria ${data.idInventarioEquipos} - fecha: ${(new Date(data.fechaCaptura)).formatMXNoTime()}`,
                width: 'lg',
                style: 'grid grid-cols-3 gap-3',
            }}
            fields={[
                {
                    label: 'Departamento',
                    select: true,
                    options: states.departamentos,
                    valueKey: 'IdDepartamento',
                    data: 'nombre',
                    value: data.idDepartamento,
                    disabled: states.action === actions.update,
                    onChangeFunc: (newData) => setData({ ...data, idDepartamento: newData })
                },
                {
                    label: 'Empleado',
                    select: true,
                    options: states.action === actions.update ?
                        states.personas :
                        states.personas.filter(p => p.IdDepto == data.idDepartamento),
                    valueKey: 'IdPersona',
                    data: 'nombre_completo',
                    value: data.idpersona,
                    disabled: states.action === actions.update,
                    onChangeFunc: (newData) => setData({ ...data, idpersona: newData })
                },
                {
                    table: true,
                    style: 'col-span-full',
                    data: states.detalles,
                    virtual: true,
                    id: 'dialogTable',
                    handleRowUpdating: updateEmail,
                    editingMode: { mode: "cell", allowUpdating: true },
                    columns: [
                        { header: 'A revisar', cell: ({ item }) => item.DescripcionRevision, width: '60%' },
                        { header: 'Comentarios', accessor: 'comentarios', width: '40%' },
                    ]

                }
            ]}
        />
    </>
}
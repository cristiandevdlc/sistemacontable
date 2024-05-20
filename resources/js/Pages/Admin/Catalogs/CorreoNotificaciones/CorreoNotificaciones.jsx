import DialogComp from '@/components/DialogComp'
import LoadingDiv from '@/components/LoadingDiv'
import Datatable from '@/components/Datatable'
import { useEffect, useState } from 'react'
import { Tooltip } from '@mui/material'
import request, { validateInputs } from "@/utils";
import validationRules from '@/core/Validator'

const correoValidations = { correoNotificaciones_correo: ['required', 'email'] };
const asuntoValidations = { asunto_descripcion: ['required', 'max:50'] };
const IntCorreo = { correoNotificaciones_correo: '' };
const IntAsunto = { asunto_descripcion: '' };
const dialogTitles = ['asunto', 'correo'];
const dialogActDict = ['create', 'edit'];
const actions = { update: 1, create: 0 };
const dialogTypes = {
    asunto: 0,
    correo: 1
}

const CorreoNotificaciones = () => {
    const [dataAsunto, setDataAsunto] = useState(IntAsunto)
    const [dataCorreo, setDataCorreo] = useState(IntCorreo)
    const [errors, setErrors] = useState({})
    const [states, setStates] = useState({
        dialogType: dialogTypes.asunto,
        action: actions.create,
        selectedAsunto: [],
        submit: () => { },
        loadData: true,
        loading: true,
        correos: [],
        asuntos: [],
    })

    const getAllData = async () => {
        const [
            correos,
            asuntos
        ] = await Promise.all([
            request(route("correo-notificaciones.index")),
            request(route("asuntos.index"))
        ])
        setStates({
            ...states,
            correos: correos,
            asuntos: asuntos,
            loadData: false,
            loading: false
        })
    }

    useEffect(() => {
        if (states.loadData)
            getAllData()
    }, [states.loadData]);

    const handleModal = (action = states.action, type = states.dialogType, submit = () => { }, loadData = false) => setStates({
        ...states,
        open: !states.open,
        action: action,
        dialogType: type,
        submit: submit,
        loadData: loadData
    })

    useEffect(() => {
        let submit = () => { }
        dialogTypes.correo == states.dialogType && (submit = submitCorreo)
        dialogTypes.asunto == states.dialogType && (submit = submitAsunto)
        setStates({ ...states, submit })
    }, [dataAsunto, dataCorreo]);


    const onSelect = ({ selectedRowKeys }) => setStates({ ...states, selectedAsunto: selectedRowKeys })

    const submitCorreo = async () => {
        setErrors({})
        const result = validateInputs(correoValidations, dataCorreo)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = !states.action ? route("correo-notificaciones.store") : route("correo-notificaciones.update", dataCorreo.correoNotificaciones_idCorreo);
        const method = !states.action ? "POST" : 'PUT';

        await request(ruta, method, { ...dataCorreo, correoNotificaciones_idAsunto: states.selectedAsunto[0]?.asunto_idAsunto });
        handleModal(states.action, states.dialogType, states.submit, true)
    }

    const submitAsunto = async () => {
        setErrors({})
        const result = validateInputs(asuntoValidations, dataAsunto)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = !states.action ? route("asuntos.store") : route("asuntos.update", dataAsunto.asunto_idAsunto)
        const method = !states.action ? "POST" : "PUT";
        await request(ruta, method, dataAsunto).then(() => {
            handleModal(states.action, states.dialogType, states.submit, true)
        });
    }

    return (
        <div className='relative h-[100%] pb-12 px-3 overflow-auto blue-scroll'>
            {states.loading && <LoadingDiv />}
            {!states.loading &&
                <div className="grid grid-cols-10 gap-10">
                    <div className="col-span-5 text-center">
                        <h4>Asuntos</h4>
                        <Datatable
                            virtual={true}
                            data={states.asuntos}
                            add={() => {
                                setDataAsunto(IntAsunto)
                                handleModal(actions.create, dialogTypes.asunto, submitAsunto)
                            }}
                            selection={'single'}
                            selectedData={states.selectedAsunto}
                            selectionFunc={onSelect}
                            columns={[
                                { header: 'Asunto', accessor: 'asunto_descripcion' },
                                {
                                    header: "Acciones",
                                    edit: ({ item }) => {
                                        setDataAsunto(item)
                                        handleModal(actions.update, dialogTypes.asunto, submitAsunto)
                                    },
                                },
                            ]}
                        />
                    </div >
                    <div className="col-span-5 text-center">
                        <h4>Correos</h4>
                        <Datatable
                            virtual={true}
                            data={states.correos.filter(m => m.correoNotificaciones_idAsunto == states.selectedAsunto[0]?.asunto_idAsunto)}
                            add={states.selectedAsunto.length > 0 ? () => {
                                setDataCorreo(IntCorreo)
                                handleModal(actions.create, dialogTypes.correo, submitCorreo)
                            } : false}
                            columns={[
                                { header: 'Correo', accessor: 'correoNotificaciones_correo' },
                                {
                                    header: "Acciones", width: '33%',
                                    cell: ({ item }) => (
                                        <div>
                                            <Tooltip title="Editar">
                                                <button onClick={() => {
                                                    setDataCorreo(item)
                                                    handleModal(actions.update, dialogTypes.correo, submitCorreo)
                                                }} className="material-icons ">edit</button>
                                            </Tooltip>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
            }

            <DialogComp
                dialogProps={{
                    model: dialogTitles[states.dialogType],
                    width: 'sm',
                    openState: states.open,
                    style: 'grid grid-cols-1 ',
                    actionState: dialogActDict[states.action],
                    openStateHandler: () => handleModal(states.action, states.dialogType, states.submit),
                    onSubmitState: () => states.submit
                }}
                fields={[
                    (states.dialogType == dialogTypes.asunto) && {
                        label: "Asunto",
                        input: true,
                        type: 'text',
                        fieldKey: 'asunto_descripcion',
                        value: dataAsunto.asunto_descripcion,
                        onChangeFunc: (e) => setDataAsunto({ ...dataAsunto, asunto_descripcion: e.target.value })
                    },
                    (states.dialogType == dialogTypes.correo) && {
                        label: "Correo",
                        input: true,
                        type: 'text',
                        fieldKey: 'correoNotificaciones_correo',
                        onlyUppercase: false,
                        value: dataCorreo.correoNotificaciones_correo || '',
                        onChangeFunc: (e) => setDataCorreo({ ...dataCorreo, correoNotificaciones_correo: e.target.value })
                    }
                ]}
                errors={errors}
            />
        </div>
    )
}

export default CorreoNotificaciones
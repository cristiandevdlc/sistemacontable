import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";

const intParteUnidad = {
    id_parte: "",
    idtipoServicio: "",
    nombrePieza: "",
}
const parteUnidadRules = {
    idtipoServicio: "required",
    nombrePieza: "required",
}

const actions = {
    create: 0,
    update: 1,
}

const PartesUnidad = () => {
    const [data, setData] = useState(intParteUnidad);
    const [states, setStates] = useState({
        action: actions.create,
        tipoServicios: [],
        partesUnidad: [],
        loading: true,
        open: false,
        errors: {},
    })

    const getAllData = async (newState = {}) => {
        const [
            partesUnidad,
            tipoServicios
        ] = await Promise.all([
            request(route('partes-unidad.index')),
            request(route('tipos-servicios.index'))
        ])

        setStates({
            ...states,
            ...newState,
            partesUnidad: partesUnidad,
            tipoServicios: tipoServicios,
            loading: false
        })
    }

    const handleOpen = (action = actions.create) => setStates({ ...states, open: !states.open, action: action });

    const submit = async () => {
        const validator = validateInputs(parteUnidadRules, data)

        if (!validator.isValid) {
            setStates({ ...states, errors: validator.errors })
            return
        }
        const ruta = states.action ? route("partes-unidad.update", data.id_parte) : route("partes-unidad.store")
        const method = states.action ? "PUT" : "POST"

        await request(ruta, method, data)
        setData(intParteUnidad)
        getAllData({ open: !states.open, errors: {} })
    }

    useEffect(() => {
        getAllData()
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {states.loading && <LoadingDiv />}
            {!states.loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setData(intParteUnidad)
                            handleOpen()
                        }}
                        data={states.partesUnidad}
                        columns={[
                            { header: "Nombre pieza", accessor: "nombrePieza" },
                            { header: "Nombre de Servicio", cell: ({ item }) => item.tipo_servicio?.tipoServicio_descripcion },
                            {
                                header: "Acciones",
                                edit: ({ item }) => {
                                    setData(item)
                                    handleOpen(actions.update)
                                }
                            },
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'parte de unidad',
                    width: 'sm',
                    openState: states.open,
                    actionState: states.action ? 'edit' : 'create',
                    openStateHandler: () => handleOpen(states.action),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre de pieza",
                        input: true,
                        type: "text",
                        fieldKey: "nombrePieza",
                        value: data.nombrePieza,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                nombrePieza: e.target.value,
                            }),
                    },
                    {
                        label: "Tipo Servicio",
                        select: true,
                        fieldKey: "idtipoServicio",
                        value: data.idtipoServicio,
                        options: states.tipoServicios,
                        valueKey: 'tipoServicio_idTipoServicio',
                        data: 'tipoServicio_descripcion',
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                idtipoServicio: e,
                            }),
                    },
                ]}
                errors={states.errors}
            />
        </div>
    );
};
export default PartesUnidad;
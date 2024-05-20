import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import SelectComp from "@/components/SelectComp";

const intListaVerificacion = {
    idListaVerificacion: "",
    idtipoServicio: "",
    descripcion: "",
    estatus: '1',
}
const ListaVerificacionRules = {
    idTipoServicio: "required",
    descripcion: "required",
}

const actions = {
    create: 0,
    update: 1,
}

const ListaVerificacion = () => {
    const [data, setData] = useState(intListaVerificacion);
    const [listafiltrada, setListaFiltrada] = useState([]);

    const [states, setStates] = useState({
        action: actions.create,
        tipoServicios: [],
        listaVerificacion: [],
        loading: true,
        open: false,
        errors: {},
    })

    const getAllData = async (newState = {}) => {
        const [
            listaVerificacion,
            tipoServicios
        ] = await Promise.all([
            request(route('lista-verificacion.index')),
            request(route('tipos-servicios.index'))
        ])

        setStates({
            ...states,
            ...newState,
            listaVerificacion: listaVerificacion,
            tipoServicios: tipoServicios,
            loading: false
        })
    }

    const handleOpen = (action = actions.create) => setStates({ ...states, open: !states.open, action: action });

    const submit = async () => {
        const validator = validateInputs(ListaVerificacionRules, data)

        if (!validator.isValid) {
            setStates({ ...states, errors: validator.errors })
            return
        }
        const ruta = states.action ? route("lista-verificacion.update", data.idListaVerificacion) : route("lista-verificacion.store")
        const method = states.action ? "PUT" : "POST"

        await request(ruta, method, data)
        setData(intListaVerificacion)
        getAllData({ open: !states.open, errors: {} })
    }

    useEffect(() => {
        getAllData()
    }, []);

    const filterServicio = async (value) => {

        const dataApi = { idtipoServicio: value };
        const requestData = await request(route('index-filter'), 'POST', dataApi, { enabled: true, error: { message: 'No hay registros', type: 'error' }, success: { message: "Se encontraron registros", type: 'success' } });


        setListaFiltrada(requestData)
    };
    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">

            {states.loading && <LoadingDiv />}
            {!states.loading && (
                <div className='flex'>
                    <div className='border-2 w-[20%] h-[50%] shadow-md px-4 pb-3 rounded-xl mr-4'>
                        <SelectComp
                            label="Tipos Servicios"
                            options={states.tipoServicios}
                            data="tipoServicio_descripcion"
                            valueKey="tipoServicio_idTipoServicio"
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    idtipoServicio: newValue,
                                },
                                    filterServicio(newValue)
                                )
                            }
                            value={data.idtipoServicio}
                        />
                    </div>
                    <div className='flex-grow sm:h-[97%] md:h-[95%]'>
                        <Datatable
                            add={() => {
                                setData(intListaVerificacion)
                                handleOpen()
                            }}
                            data={listafiltrada}
                            columns={[
                                { header: "Descripción", accessor: "descripcion" },
                                { header: "Nombre de servicio", cell: ({ item }) => item.tipo_servicios?.tipoServicio_descripcion },
                                {
                                    header: 'Activo',
                                    cell: (eprops) => <>{eprops.item.estatus == 1 ? (<Chip label="SI" color="success" size="small" />) : (<Chip label="NO" color="error" size="small" />)}</>
                                },
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
                </div>

            )}

            <DialogComp
                dialogProps={{
                    model: 'lista de verificación',
                    width: 'sm',
                    openState: states.open,
                    actionState: states.action ? 'edit' : 'create',
                    openStateHandler: () => handleOpen(states.action),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Descripcion",
                        input: true,
                        type: "text",
                        fieldKey: "descripcion",
                        value: data.descripcion,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                descripcion: e.target.value,
                            }),
                    },
                    {
                        label: "Tipo Servicio",
                        select: true,
                        fieldKey: "idTipoServicio",
                        value: data.idTipoServicio,
                        options: states.tipoServicios,
                        valueKey: 'tipoServicio_idTipoServicio',
                        data: 'tipoServicio_descripcion',
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                idTipoServicio: e,
                            }),
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={states.errors}
            />
        </div>
    );
};
export default ListaVerificacion;
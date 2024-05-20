import unidadData, { unidadFields, unidadValidations } from "./IntUnidad";
import { UnidadModalStatus } from "./Modals/UnidadModalStatus";
import { unidadFiles } from "./Modals/UnidadModalFiles";
import { unidadCRUD } from "./Modals/UnidadModalCRUD";
import request, { numberFormat, validateInputs } from "@/utils";
import DialogComp, { FieldDrawer } from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import { Button, Tooltip } from "@mui/material";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import Chip from "@mui/material/Chip";
import SearchIcon from '@mui/icons-material/Search';

export default function Unidades() {
    const [tiposServicio, setTiposServicio] = useState([])
    const [dataDou, setDataDou] = useState(unidadData);
    const [action, setAction] = useState("create");
    const { data, setData } = useForm(unidadData);
    const [loading, setLoading] = useState(true);
    const [openD, setOpenD] = useState(false);
    const [openF, setOpenF] = useState(false);
    const [unities, setUnities] = useState();
    const [errors, setErrors] = useState({});
    const [marcas, setMarcas] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [open, setOpen] = useState(false);
    const [areas, setAreas] = useState();
    const [filtro, setFiltro] = useState({ numeroComercial: "", Marca: "", Modelo: "", Año: "", tipoServicio: "", estatus: "3" });
    const [UnidadesFiltradas, setUnidadesFiltradas] = useState();
    let existValid = false;

    const fetchdata = async () => {
        getUnities();
        getAreasFuncionales();
        fetchTipoServicio()
        getMarcas()
        getModelo()
    };

    const getMarcas = async () => {
        const response = await fetch(route("marca-carros.index"));
        const data = await response.json();
        setMarcas(data);
    };
    const getModelo = async () => {
        const response = await fetch(route("modelo-carro.index"));
        const data = await response.json();
        setModelo(data);
    };

    const getAreasFuncionales = async () => {
        const response = await fetch(route("areas-funcionales.index"));
        const data = await response.json();
        setAreas(data);
    };

    const getUnities = async () => {
        const responseE = await fetch(route("unidades.index"));
        const dataE = await responseE.json();
        setUnities(dataE);
        setUnidadesFiltradas(dataE)
    };

    const fetchTipoServicio = async () => {
        const response = await request(route("tipos-servicio-sinfiltros"));
        setTiposServicio(response);
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(unidadValidations, data, unidadFields)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        if (action === "create") {
            const exist = valdiateIfExist();
            if (exist) {
                if (!existValid) {
                    setDataDou(exist)
                    setOpenD(true)
                    return
                }
                data.existentUnity = exist.unidad_idUnidad;
            }
        }
        const ruta = action === "create" ? route("unidades.store") : route("unidades.update", data.unidad_idUnidad);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
            setExistValid(false)
        })
    };

    const filteredData = () => {
        const filtered = unities.filter(unity => {
            let match = true;
            const NumeroComercial = unity.unidad_idUnidad;
            const Marca = unity.modelo?.marca?.marca?.idMarca;
            const Modelos = unity.modelo?.marca?.idModelo;
            const Año = unity.modelo?.año;
            const TipoServicios = unity.tipo_servicio?.tipoServicio_idTipoServicio;
            const Estatus = unity.unidad_estatus;

            console.log('unity', unity)
            if (filtro.numeroComercial && NumeroComercial !== filtro.numeroComercial) {
                match = false;
            }
            if (filtro.Marca && Marca !== filtro.Marca) {
                match = false;
            }
            if (filtro.Modelo && Modelos !== filtro.Modelo) {
                match = false;
            }
            if (filtro.tipoServicio && TipoServicios !== filtro.tipoServicio) {
                match = false;
            }
            if (filtro.estatus != null && filtro.estatus !== "3" && Estatus !== filtro.estatus) {
                match = false;
            }
            if (filtro.Año && Año !== filtro.Año) {
                match = false;
            }
            return match;
        });
        setUnidadesFiltradas(filtered);
    };

    const confirmDisabled = (e) => {
        setOpenD(false)
        setExistValid(true)
        submit(e)
    }

    const setExistValid = (s) => {
        existValid = s
    }

    const handleCloseModal = () => {
        setOpen(!open);
        setErrors({});
    };

    const handleCloseFModal = () => {
        setOpenF(!openF);
        setErrors({});
    };

    useEffect(() => {
        if (!unities) fetchdata();
        else setLoading(false)
    }, [unities]);

    const valdiateIfExist = () => {
        const found = unities.find((unidad) => { return unidad.unidad_numeroComercial == data.unidad_numeroComercial })
        return found
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 -mt-4">
            {loading && <LoadingDiv />}
            <div className="flex relative gap-3 sm:flex-col md:flex-row h-[90%]">
                <div className="flex flex-col gap-2 pt-4 min-w-[300px]">
                    <div className="flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 ">
                        <h1>Buscar por:</h1>
                        <FieldDrawer
                            fields={[
                                {
                                    label: "N.Comercial",
                                    select: true,
                                    options: unities,
                                    fieldKey: "unidad_numeroComercial",
                                    value: filtro.numeroComercial,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            numeroComercial: e,
                                        }),
                                    data: 'unidad_numeroComercial',
                                    valueKey: 'unidad_idUnidad',
                                },
                                {
                                    label: "Marca",
                                    select: true,
                                    options: marcas,
                                    fieldKey: "unidad_marca",
                                    value: filtro.Marca,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            Marca: e
                                        }),
                                    data: 'Descripcion',
                                    valueKey: 'idMarca',
                                },
                                {
                                    label: "Modelo",
                                    select: true,
                                    options: modelo,
                                    fieldKey: "unidad_modelo",
                                    value: filtro.Modelo,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            Modelo: e,
                                        }),
                                    data: 'descripcion',
                                    valueKey: 'idModelo',
                                },
                                {
                                    label: "Tipo de servicio",
                                    select: true,
                                    options: tiposServicio,
                                    fieldKey: "tipoServicio",
                                    value: filtro.tipoServicio,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            tipoServicio: e,
                                        }),
                                    data: 'tipoServicio_descripcion',
                                    valueKey: 'tipoServicio_idTipoServicio',
                                },
                                {
                                    label: "Estatus",
                                    select: true,
                                    options: [
                                        {
                                            label: "Activo",
                                            value: "1",
                                        },
                                        {
                                            label: "Inactivo",
                                            value: "0",
                                        },
                                    ],
                                    fieldKey: "estatus",
                                    value: filtro.estatus,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            estatus: e,
                                        }),
                                    data: 'label',
                                    valueKey: 'value',
                                },
                                {
                                    label: "Año",
                                    input: true,
                                    fieldKey: "unidad_año",
                                    value: filtro.Año,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            Año: e.target.value,
                                        }),
                                },
                            ]}
                        />
                        <button className="flex items-center justify-between shadow-md mt-4 bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-3 transition duration-300 hover:bg-[#2c3a78] active:bg-[#344c82]"
                            onClick={(e) => { filteredData(filtro) }}
                        >
                            <span>Buscar</span>
                            <SearchIcon />
                        </button>
                    </div>
                </div>
                
                <div className="relative col-span-10 mx-5 w-full mt-4">
                    <Datatable
                        add={() => {
                            setAction("create");
                            setOpen(!open);
                            setData(unidadData)
                        }}
                        data={UnidadesFiltradas}
                        virtual={true}
                        searcher={false}
                        columns={[
                            { header: "N. Comercial", accessor: "unidad_numeroComercial", width: '9%' },
                            { header: "Marca", accessor: "unidad_marca", cell: ({ item }) => item.modelo?.marca?.marca?.Descripcion, width: '12%' },
                            { header: "Modelo", accessor: "unidad_idModeloVehiculo", cell: ({ item }) => item.modelo?.marca?.descripcion, width: '8%' },
                            { header: "Año", accessor: "unidad_idModeloVehiculo", cell: ({ item }) => item.modelo?.año, width: '7%' },
                            // { header: "Cil. Motor", accessor: "unidad_idModeloVehiculo", cell: ({ item }) => item.modelo?.cilindrosMotor, width: '5%' },
                            { header: "Placa", accessor: "unidad_placa", width: '12%' },
                            { header: "Litros", cell: ({ item }) => numberFormat(item.unidad_capacidad), width: '8%' },
                            { header: "Tipo servicio", cell: (eprops) => (<>{eprops.item?.tipo_servicio?.tipoServicio_descripcion}</>), width: '10%' },
                            { header: "Area funcional", cell: (eprops) => (<>{eprops.item?.areas?.AF_Nombre}</>), width: '10%' },
                            { header: "Permiso CRE", cell: (eprops) => (<>{eprops.item?.unidad_permisoCRE}</>), width: '11%' },
                            {
                                header: "Activo",
                                cell: (eprops) => (
                                    <>
                                        {eprops.item.unidad_estatus === "1" ? (<Chip label="Activo" color="success" />) : (<Chip label="Inactivo" color="error" />)}
                                    </>
                                ),
                                width: '8%'
                            },
                            {
                                header: "Acciones",
                                width: '7%',
                                edit: (eprops) => {
                                    setAction("edit");
                                    fetchdata()
                                    setData({ ...eprops.item });
                                    setOpen(!open);
                                },
                                custom: (eprops) =>
                                (
                                    <>
                                        <Tooltip title="Archivos">
                                            <button
                                                className="material-icons"
                                                onClick={() => {
                                                    setAction("files");
                                                    setData({ ...eprops.item });
                                                    setOpenF(!openF);
                                                }}
                                            >
                                                description
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Ver detalles">
                                            <button
                                                className="material-icons"
                                                onClick={() => {
                                                    setAction("show");
                                                    setData(eprops.item, console.log('item', eprops.item));
                                                    setOpen(!open);
                                                }}
                                            >
                                                visibility
                                            </button>
                                        </Tooltip>
                                    </>
                                ),
                                width: '8%'
                            },
                        ]}
                    />
                </div>
                <DialogComp
                    dialogProps={{
                        model: 'unidad',
                        width: 'md',
                        openState: open,
                        style: `grid gap-x-4 ${action !== 'show' ? 'grid-cols-6' : 'grid-cols-2'}`,
                        actionState: action,
                        openStateHandler: () => handleCloseModal(),
                        onSubmitState: () => submit
                    }}
                    fields={unidadCRUD(data, setData, action, tiposServicio, areas, marcas)}
                    errors={errors}
                />
                <DialogComp
                    dialogProps={{
                        model: 'Subir documentos de unidad',
                        width: 'md',
                        customTitle: true,
                        openState: openF,
                        customAction: () => {
                            return (<Button color="error" onClick={() => { handleCloseFModal() }} > Cancelar </Button>)
                        },
                        style: 'grid grid-cols-2 gap-x-4',
                        actionState: action,
                        openStateHandler: () => setOpenF(!openF),
                        onSubmitState: () => submit
                    }}
                    fields={unidadFiles(data, handleCloseFModal, fetchdata)}
                    errors={errors}
                />
                <DialogComp
                    dialogProps={{
                        model: 'Confirmación',
                        width: 'sm',
                        customTitle: true,
                        openState: openD,
                        style: 'grid justify-center gap-x-4',
                        actionState: action,
                        customAction: () => {
                            return (
                                <>
                                    <Button color="error" onClick={() => { setOpenD(!openD) }} > Cancelar </Button>
                                    <Button color="success" onClick={(e) => { confirmDisabled(e) }} > Confirmar </Button>
                                </>
                            )
                        },
                        openStateHandler: () => setOpenD(!openD),
                        onSubmitState: () => confirmDisabled
                    }}
                    fields={UnidadModalStatus(dataDou)}
                    errors={errors}
                />
            </div>
            {/* )} */}
        </div>
    );


}

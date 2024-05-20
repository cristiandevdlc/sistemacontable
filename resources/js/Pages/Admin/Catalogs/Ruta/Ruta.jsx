import request, { firstObj, validateInputs } from "@/utils";
import DialogComp, { FieldDrawer } from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import Chip from "@mui/material/Chip";
import React from "react";
import SelectComp from "@/components/SelectComp";
import SearchIcon from '@mui/icons-material/Search';
import { ButtonComp } from "@/components/ButtonComp";

const rutaData = {
    ruta_idTurno: "",
    ruta_idTipoServicio: "",
    ruta_nombre: "",
    ruta_tipo: "A",
    ruta_estatus: '1',
    ruta_liquidarTelemark: '0',
    ruta_idZona: "",
    ruta_vigilancia: "0",
}
const rutaValidations = {
    ruta_idTurno: "required",
    ruta_idTipoServicio: "required",
    ruta_nombre: "required",
    ruta_tipo: "required",
    ruta_estatus: 'required',
    ruta_liquidarTelemark: 'required',
    ruta_idZona: 'required',
}

export default function Ruta() {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [action, setAction] = useState("create");
    const [rutas, setRutas] = useState();
    const [zonas, setZonas] = useState();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(rutaData);
    const [tipoSer, setTipoSer] = useState('')
    const [filtro, setFiltro] = useState({ RutaNombre: "", TipoServicio: "", Turno: "", Zona: "", Estatus: "" });
    const [RutasFiltradas, setRutasFiltradas] = useState();

    const getMenuName = async () => {
        try {
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getRutas = async () => {
        const responseR = await fetch(route("rutas.index"));
        const dataR = await responseR.json();
        setRutas(dataR);
        setRutasFiltradas(dataR)
    };

    const getZonas = async () => {
        const responseR = await fetch(route("zonas.index"));
        const dataR = await responseR.json();
        setZonas(dataR);
    };

    const getEmpresas = async () => {
        const responseE = await fetch(route("empresas.index"));
        const dataE = await responseE.json();
        setEmpresas(dataE);
    };
    const getServicios = async () => {
        const responseTs = await fetch(route("tipos-servicios.index"));
        const dataTs = await responseTs.json();
        setServicios(dataTs);
    };

    const getTurno = async () => {
        const responseT = await fetch(route("turno.index"));
        const dataT = await responseT.json();
        setTurnos(dataT);
    };

    useEffect(() => {
        if (!rutas) {
            getEmpresas();
            getRutas();
            getServicios();
            getTurno();
            getMenuName();
            getZonas();
        } else {
            setLoading(false);
        }
    }, [rutas]);

    const filteredData = () => {
        const filtered = rutas.filter(ruta => {
            let match = true;
            const nombre = ruta.ruta_idruta;
            const servicios = ruta.servicio.tipoServicio_idTipoServicio;
            const turnos = ruta.turno.turno_idTurno;
            const zonas = ruta.zona.zona_idZona;
            const estatus = ruta.ruta_estatus;

            if (filtro.RutaNombre && nombre !== filtro.RutaNombre) {
                match = false;
            }
            if (filtro.TipoServicio && servicios !== filtro.TipoServicio) {
                match = false;
            }
            if (filtro.Turno && turnos !== filtro.Turno) {
                match = false;
            }
            if (filtro.Zona && zonas !== filtro.Zona) {
                match = false;
            }
            if (filtro.Estatus != null && filtro.Estatus !== "3" && estatus !== filtro.Estatus) {
                match = false;
            }
            return match;
        });
        setRutasFiltradas(filtered);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(rutaValidations, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("rutas.store") : route("rutas.update", data.ruta_idruta);
        const method = action === "create" ? "POST" : "PUT";

        await request(ruta, method, data).then(() => {
            getRutas();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setErrors({});
        setOpen(!open);
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
                                    label: "Tipo de Servicio",
                                    select: true,
                                    options: servicios,
                                    fieldKey: "TipoServicio",
                                    value: filtro.TipoServicio,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            TipoServicio: e
                                        }),
                                    data: 'tipoServicio_descripcion',
                                    valueKey: 'tipoServicio_idTipoServicio',
                                },
                                {
                                    label: "Turno",
                                    select: true,
                                    options: turnos,
                                    fieldKey: "Turnos",
                                    value: filtro.Turno,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            Turno: e
                                        }),
                                    data: 'turno_nombreTurno',
                                    valueKey: 'turno_idTurno',
                                },
                                {
                                    label: "Zona",
                                    select: true,
                                    options: zonas,
                                    fieldKey: "Zonas",
                                    value: filtro.Zona,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            Zona: e
                                        }),
                                    data: 'zona_descripcion',
                                    valueKey: 'zona_idZona',
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
                                    value: filtro.Estatus,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            Estatus: e,
                                        }),
                                    data: 'label',
                                    valueKey: 'value',
                                },
                            ]}
                        />
                        <ButtonComp
                            onClick={filteredData}
                            label="Buscar"
                        />
                    </div>
                </div>
                <div className="relative col-span-10 mx-5 w-full mt-4">
                    {RutasFiltradas && !loading && (
                        <Datatable
                            virtual={true}

                            add={() => {
                                setAction("create");
                                setData(rutaData);
                                setOpen(!open);
                            }}
                            data={RutasFiltradas}
                            columns={[
                                { header: "Nombre", width: '24.5%', accessor: "ruta_nombre" },
                                { header: 'Turno', width: '10%', accessor: 'turno.turno_nombreTurno' },
                                { header: 'Servicio', width: '15%', accessor: 'servicio.tipoServicio_descripcion' },
                                { header: "Zona", width: '24.5%', accessor: "zona.zona_descripcion" },
                                { header: "Nombre", width: '24.5%', accessor: "ruta_nombre" },
                                // { header: "Supervisor", width: '24.5%',accessor: "Supervisor", cell: (eprops) => (<span> {`${eprops.item.supervisor.Nombres} ${eprops.item.supervisor.ApePat} ${eprops.item.supervisor.ApeMat}`}</span>), },
                                { header: "Telemark", width: '7%', cell: (eprops) => (<>{eprops.item.ruta_liquidarTelemark == "1" ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>), },
                                { header: "Activo", width: '7%', cell: (eprops) => (<>{eprops.item.ruta_estatus == "1" ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)} </>), },
                                {
                                    header: "Acciones",
                                    width: '7%',
                                    edit: (eprops) => {
                                        setAction("edit");
                                        setData({ ...eprops.item });
                                        setOpen(!open);
                                    },
                                    custom: (eprops) => (
                                        <>
                                            <Tooltip title="Detalles">
                                                <button
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setAction("show");
                                                        setData({ ...eprops.item });
                                                        setOpen(!open);
                                                    }}
                                                >
                                                    visibility
                                                </button>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            ]}
                        />
                    )}
                </div>
                <DialogComp
                    dialogProps={{
                        model: 'ruta',
                        width: 'sm',
                        openState: open,
                        actionState: action,
                        style: 'grid grid-cols-2 gap-x-5',
                        openStateHandler: () => handleCloseModal(),
                        onSubmitState: () => submit
                    }}
                    fields={[
                        {
                            label: "Nombre",
                            fieldKey: 'ruta_nombre',
                            style: 'col-span-full',
                            input: true,
                            type: "text",
                            value: data.ruta_nombre,
                            onChangeFunc: (e) => {
                                if (e.target.value.length < 30) {
                                    setData({
                                        ...data,
                                        ruta_nombre: e.target.value,
                                    })
                                }
                            }
                        },
                        {
                            label: "Tipos de servicio",
                            options: servicios,
                            select: true,
                            fieldKey: 'ruta_idTipoServicio',
                            value: data.ruta_idTipoServicio || "",
                            onChangeFunc: (newValue) =>
                                setData({
                                    ...data,
                                    ruta_idTipoServicio: newValue,
                                }),
                            data: "tipoServicio_descripcion",
                            valueKey: "tipoServicio_idTipoServicio",
                        },
                        {
                            label: "Turno",
                            options: turnos,
                            select: true,
                            fieldKey: 'ruta_idTurno',
                            value: data.ruta_idTurno || "",
                            onChangeFunc: (newValue) =>
                                setData({
                                    ...data,
                                    ruta_idTurno: newValue,
                                }),
                            data: "turno_nombreTurno",
                            valueKey: "turno_idTurno",
                        },
                        {
                            label: "Zona",
                            options: zonas,
                            select: true,
                            fieldKey: 'ruta_idZona',
                            value: data.ruta_idZona || "",
                            onChangeFunc: (newValue) =>
                                setData({
                                    ...data,
                                    ruta_idZona: newValue,
                                }),
                            data: "zona_descripcion",
                            valueKey: "zona_idZona",
                        },
                        {
                            label: "Tipo",
                            options: [
                                { id: 'Comercial', value: 'Comercial' },
                                { id: 'Domestico', value: 'Domestico' },
                                { id: 'Industrial', value: 'Industrial' },
                            ],
                            select: true,
                            fieldKey: 'ruta_tipo',
                            value: data.ruta_tipo || "",
                            onChangeFunc: (newValue) =>
                                setData({
                                    ...data,
                                    ruta_tipo: newValue,
                                }),
                            data: "value",
                            valueKey: "id",
                        },
                        {
                            style: 'col-span-full grid grid-cols-3',
                            childs: [
                                {
                                    label: "Activo",
                                    check: true,
                                    fieldKey: 'ruta_estatus',
                                    checked: data.ruta_estatus,
                                    style: 'justify-center mt-5',
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        ruta_estatus: e.target.checked ? "1" : "0",
                                    }),
                                },
                                {
                                    label: "Liquidar con Telemark",
                                    check: true,
                                    fieldKey: 'ruta_liquidarTelemark',
                                    checked: data.ruta_liquidarTelemark,
                                    style: 'justify-center mt-5',
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        ruta_liquidarTelemark: e.target.checked ? "1" : "0",
                                    }),
                                },
                                {
                                    label: "Salida Vigilancia",
                                    check: true,
                                    fieldKey: 'ruta_SalidaVigilancia',
                                    checked: data.ruta_vigilancia,
                                    style: 'justify-center mt-5',
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        ruta_vigilancia: e.target.checked ? "1" : "0",
                                    }),
                                },
                            ]
                        }
                    ]}
                    errors={errors}
                />
            </div>
        </div>
    );
}

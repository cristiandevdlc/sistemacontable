import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import React from "react";

const stationData = {
    estacion_idEstacion: 0,
    // estacion_idEmpresa: '',
    estacion_nombre: '',
    estacion_direccion: '',
    estacion_estatus: '1',
    estacion_Ciudad: '',
    estacion_idEstado: '',
    estacion_independiente: '0',
    estacion_PCRE: '',
    estacion_PSE: '',
}

const stationValidations = {
    // estacion_idEmpresa: 'required',
    estacion_nombre: 'required',
    estacion_direccion: 'required',
    estacion_Ciudad: 'required',
    estacion_idEstado: 'required',
    estacion_PCRE: 'required',
    estacion_PSE: 'required',
}

const Estacion = () => {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [empresas, setEmpresas] = useState();
    const [stations, setStation] = useState();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(stationData);

    const [estados, setEstados] = useState();


    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getStations = async () => {
        const response = await fetch(route("estacion.index"));
        const data = await response.json();
        setStation(data);
    };

    const getEstados = async () => {
        const response = await fetch(route("sat/estados.index"));
        const data = await response.json();
        setEstados(data);
    };

    const getEmpresas = async () => {
        const response = await fetch(route("empresas.index"));
        const data = await response.json();
        setEmpresas(data);
    };

    const submit = async (e) => {
        e.preventDefault();        
        setErrors({})
        const result = validateInputs(stationValidations, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("estacion.store") : route("estacion.update", data.estacion_idEstacion)
        const method = action === "create" ? "POST" : action === "edit" ? "PUT" : "DELETE";

        await request(ruta, method, data).then(() => getStations(), setOpen(false));
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        getMenuName();
        if (!stations) {
            getStations();
            getEstados();
            getEmpresas();
        } else {
            setLoading(false);
        }
    }, [stations]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {stations && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={stations}
                        add={() => {
                            setAction("create");
                            setData(stationData);
                            setOpen(!open);
                        }}
                        columns={[
                            { header: "Nombre", accessor: "estacion_nombre" },
                            {
                                header: "Dirección",
                                accessor: "estacion_direccion",
                            },
                            { header: "PSE", accessor: "estacion_PSE" },
                            { header: "Ciudad", accessor: "estacion_Ciudad" },
                            { header: "PCRE", accessor: "estacion_PCRE" },
                            {
                                header: "Independiente",
                                accessor: "estacion_independiente",
                                cell: (eprops) =>
                                    eprops.item.estacion_independiente == 1 ? (
                                        <Chip label="Activo" color="success" />
                                    ) : (
                                        <Chip label="Pendiente" color="warning" />
                                    ),
                            },
                            {
                                header: "Activo",
                                accessor: "estacion_estatus",
                                cell: (eprops) =>
                                    eprops.item.estacion_estatus == 1 ? (
                                        <Chip label="Activo" color="success" />
                                    ) : (
                                        <Chip label="Inactivo" color="error" />
                                    ),
                            },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setOpen(!open);
                                },
                            },
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'estación',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-2 gap-x-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        input: true,
                        type: 'text',
                        label: "Nombre",
                        value: data.estacion_nombre || '',
                        style: 'col-span-2',
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                estacion_nombre: e.target.value,
                            })
                        },
                        fieldKey: "estacion_nombre"
                    },
                    {
                        select: true,
                        label: "Estado",
                        options: estados,
                        value: data.estacion_idEstado || '',
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                estacion_idEstado: newValue,
                            }),
                        data: "descripcionEstado",
                        valueKey: "idEstado",
                        fieldKey: "estacion_idEstado"
                    },
                    {
                        input: true,
                        type: 'text',
                        label: "Ciudad",
                        value: data.estacion_Ciudad || '',
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                estacion_Ciudad: e.target.value,
                            })
                        },
                        fieldKey: "estacion_Ciudad"
                    },
                    {
                        input: true,
                        type: 'text',
                        label: "Dirección",
                        style: 'col-span-2',
                        value: data.estacion_direccion || '',
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                estacion_direccion: e.target.value,
                            })
                        },
                        fieldKey: "estacion_direccion"
                    },
                    {
                        input: true,
                        type: 'text',
                        label: "PCRE",
                        value: data.estacion_PCRE || '',
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                estacion_PCRE: e.target.value,
                            })
                        },
                        fieldKey: "estacion_PCRE"
                    },
                    {
                        input: true,
                        type: 'text',
                        label: "PSE",
                        value: data.estacion_PSE || '',
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                estacion_PSE: e.target.value,
                            })
                        },
                        fieldKey: "estacion_PSE"
                    },
                    {
                        label: "Independiente",
                        check: true,
                        fieldKey: 'estacion_independiente',
                        checked: data.estacion_independiente,
                        style: 'justify-center mt-6',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estacion_independiente: e.target.checked ? "1" : "0",
                        })
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estacion_estatus',
                        checked: data.estacion_estatus,
                        style: 'justify-center mt-6',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estacion_estatus: e.target.checked ? "1" : "0",
                        })
                    },
                ]}
                errors={errors}
            />
        </div>
    );
};

export default Estacion;

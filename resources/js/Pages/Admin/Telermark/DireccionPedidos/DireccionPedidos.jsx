import Datatable from "@/components/Datatable";
import InputLabel from "@/components/InputLabel";
import LoadingDiv from "@/components/LoadingDiv";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import request from "@/utils";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    MenuItem,
    Select,
    FormControl,
    DialogTitle,
    ListItemText,
    OutlinedInput,
} from "@mui/material";

export default function DireccionPedidos() {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");

    const [DireccionPedidos, setDireccionPedidos] = useState();
    const [colonias, setColonias] = useState();
    //LA CONSTANTE DE ABAJO DEBE DE TENER CORCHETES PORQUE ES UN ARRAY DE OBJETOS
    const { data, setData } = useForm({
        clientePedidosId: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        Referencias: "",
        entrecalle1: "",
        entrecalle2: "",
        Email: "",
        nombreNegocio: "",
        ColoniaId: "",
        latitud: "",
        longitud: "",
        promedioconsumo: "",
        idCliente: "",
    });
    const [errors, setErrors] = useState({});
    //consumimos peticiones
    const getDireccionPedidos = async () => {
        const responseE = await fetch(route("direccion-pedidos.index"));
        const dataE = await responseE.json();

        //imprimimos para que muestre los datos
        setDireccionPedidos(dataE);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.clientePedidosId === "") {
            newErrors.clientePedidosId = "Escribe un cliente ";
            isValid = false;
        }
        if (data.calle === "") {
            newErrors.calle = "Escribe una calle ";
            isValid = false;
        }
        if (data.numeroExterior === "") {
            newErrors.numeroExterior = "Escribe una numero Exterior ";
            isValid = false;
        }
        if (data.numeroInterior === "") {
            newErrors.numeroInterior = "Escribe una Numero Interior ";
            isValid = false;
        }
        if (data.Referencias === "") {
            newErrors.Referencias = "Escribe una Referencia ";
            isValid = false;
        }
        if (data.entrecalle1 === "") {
            newErrors.entrecalle1 = "Escribe entre que calle  ";
            isValid = false;
        }
        if (data.entrecalle2 === "") {
            newErrors.entrecalle2 = "Escribe nombre de calle 2  ";
            isValid = false;
        }
        if (data.Email === "") {
            newErrors.Email = "Escribe Email   ";
            isValid = false;
        }
        if (data.nombreNegocio === "") {
            newErrors.nombreNegocio = "Escribe nombre Negocio  ";
            isValid = false;
        }
        if (data.ColoniaId === "") {
            newErrors.ColoniaId = "Escribe nombre colonia  ";
            isValid = false;
        }
        if (data.latitud === "") {
            newErrors.latitud = "Escribe nombre latitud  ";
            isValid = false;
        }
        if (data.longitud === "") {
            newErrors.longitud = "Escribe nombre longitud  ";
            isValid = false;
        }
        if (data.promedioconsumo === "") {
            newErrors.promedioconsumo = "Escribe nombre promedio consumo  ";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    //consumimos peticiones
    // DESCOMENTAR SOLO CUANDO  queremos mostrar mas datos de otra tabla
    const getColonia = async () => {
        const response = await fetch(route("colonias.index"));
        const data = await response.json();
        setColonias(data);
    };
    //agregamos la peticion a front-end
    useEffect(() => {
        if (!DireccionPedidos) {
            getDireccionPedidos();
            getColonia();
            // getProblemas();
        } else {
            setLoading(false);
        }
    }, [DireccionPedidos]);

    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const ruta =
            action === "create"
                ? route("direccion-pedidos.store")
                : route("direccion-pedidos.update", data.direccionPedidosId);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getDireccionPedidos();
            //SE GENERA UNA PETICION INDEX DE STENICO
            //getProblemas();
            getColonia();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    return (
        <>
            {loading && <LoadingDiv />}
            {DireccionPedidos && !loading && (
                <>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData({
                                clientePedidosId: "",
                                calle: "",
                                numeroExterior: "",
                                numeroInterior: "",
                                Referencias: "",
                                entrecalle1: "",
                                entrecalle2: "",
                                Email: "",
                                nombreNegocio: "",
                                ColoniaId: "",
                                latitud: "",
                                longitud: "",
                                promedioconsumo: "",
                            });
                            setOpen(!open);
                        }}
                        data={DireccionPedidos}
                        columns={[
                            // { header: 'Densidades', accessor: 'Densidad_densidad' },
                            {
                                header: "clientePedidosId",
                                accessor: "clientePedidosId",
                            },
                            { header: "calle", accessor: "calle" },
                            {
                                header: "num Exterior",
                                accessor: "numeroExterior",
                            },
                            {
                                header: "num Interior",
                                accessor: "numeroInterior",
                            },
                            { header: "Referencias", accessor: "Referencias" },
                            { header: "entrecalle1", accessor: "entrecalle1" },
                            { header: "entrecalle2", accessor: "entrecalle2" },
                            { header: "Email", accessor: "Email" },
                            {
                                header: "nombreNegocio",
                                accessor: "nombreNegocio",
                            },
                            { header: "ColoniaId", accessor: "ColoniaId" },
                            { header: "latitud", accessor: "latitud" },
                            { header: "longitud", accessor: "longitud" },
                            {
                                header: "promedioconsumo",
                                accessor: "promedioconsumo",
                            },
                            { header: "idCliente", accessor: "idCliente" },
                            {
                                header: "Acciones",
                                cell: (eprops) => (
                                    <>
                                        <button
                                            className="material-icons"
                                            onClick={() => {
                                                setAction("edit");
                                                setData({
                                                    ...eprops.item,
                                                });
                                                setOpen(true);
                                            }}
                                        >
                                            edit
                                        </button>
                                    </>
                                ),
                            },
                        ]}
                    />
                </>
            )}

            <Dialog open={open} onClose={() => {
                    setErrors({});
                    setOpen(!open);
                }}>
                <DialogTitle>
                    {action === "create"
                        ? "Agregar Direccion de pedidos"
                        : "Editar"}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className="grid grid-cols-3 gap-5 mt-4 ">
                            <FormControl
                                sx={{
                                    width: "100%",
                                    background: "white",
                                    borderColor: "black",
                                    color: "#4d4d4d",
                                    fontSize: "0.9em",
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "50px",
                                    },
                                }}
                            >
                                <InputLabel>Cliente</InputLabel>
                                <Select
                                    sx={{
                                        background: "white",
                                        borderColor: "black",
                                        color: "#4d4d4d",
                                        fontSize: "0.9em",
                                    }}
                                    value={data.clientePedidosId || ""}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            clientePedidosId: e.target.value,
                                        })
                                    }
                                >
                                    {colonias &&
                                    colonias.map((Colonia, index) => (
                                        <MenuItem
                                            key={index}
                                            value={colonias.clientePedidosId}
                                        >
                                            {colonias.Colonia_Nombre}
                                        </MenuItem>
                                    ))
                                    }
                                </Select>
                                {errors.clientePedidosId && (
                                    <span className="text-red-600">
                                        {errors.clientePedidosId}
                                    </span>
                                )}
                            </FormControl>
                            {/* <div>
                                <InputLabel
                                    htmlFor="clientePedidosId"
                                    value="ClientePedidosId"
                                    
                                    />
                                <TextInput
                                    id="clientePedidosId"
                                    type="text"
                                    value={data.clientePedidosId}
                                    className="block w-full mt-2 texts"
                                    autoComplete="descripcion"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            clientePedidosId: e.target.value,
                                        })
                                    }
                                    
                                />
                                {errors.clientePedidosId && 
                                        <span className="text-red-600">{errors.clientePedidosId}</span>
                                    }
                            </div> */}
                            <div>
                                <InputLabel htmlFor="calle" value="Calle" />
                                <TextInput
                                    id="calle"
                                    type="text"
                                    value={data.calle}
                                    className="block w-full mt-2 texts"
                                    autoComplete="calle"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            calle: e.target.value,
                                        })
                                    }
                                />
                                {errors.calle && (
                                    <span className="text-red-600">
                                        {errors.calle}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="numeroExterior"
                                    value="numero exterior"
                                />
                                <TextInput
                                    id="numeroExterior"
                                    type="text"
                                    value={data.numeroExterior}
                                    className="block w-full mt-2 texts"
                                    autoComplete="numeroExterior"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            numeroExterior: e.target.value,
                                        })
                                    }
                                />
                                {errors.numeroExterior && (
                                    <span className="text-red-600">
                                        {errors.numeroExterior}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="numeroInterior"
                                    value="numero interior"
                                />
                                <TextInput
                                    id="numeroInterior"
                                    type="text"
                                    value={data.numeroInterior}
                                    className="block w-full mt-2 texts"
                                    autoComplete="numeroInterior"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            numeroInterior: e.target.value,
                                        })
                                    }
                                />
                                {errors.numeroInterior && (
                                    <span className="text-red-600">
                                        {errors.numeroInterior}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="Referencias"
                                    value="Referencias"
                                />
                                <TextInput
                                    id="Referencias"
                                    type="text"
                                    maxleght="9"
                                    value={data.Referencias}
                                    className="block w-full mt-2 texts"
                                    autoComplete="Referencias"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            Referencias: e.target.value,
                                        })
                                    }
                                />
                                {errors.Referencias && (
                                    <span className="text-red-600">
                                        {errors.Referencias}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="entrecalle1"
                                    value="Calle #1"
                                />
                                <TextInput
                                    id="entrecalle1"
                                    type="text"
                                    maxleght="9"
                                    value={data.entrecalle1}
                                    className="block w-full mt-2 texts"
                                    autoComplete="entrecalle1"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            entrecalle1: e.target.value,
                                        })
                                    }
                                />
                                {errors.entrecalle1 && (
                                    <span className="text-red-600">
                                        {errors.entrecalle1}
                                    </span>
                                )}
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="entrecalle2"
                                    value="Calle #2"
                                />
                                <TextInput
                                    id="entrecalle2"
                                    type="text"
                                    maxleght="9"
                                    value={data.entrecalle2}
                                    className="block w-full mt-2 texts"
                                    autoComplete="entrecalle2"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            entrecalle2: e.target.value,
                                        })
                                    }
                                />
                                {errors.entrecalle2 && (
                                    <span className="text-red-600">
                                        {errors.entrecalle2}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel htmlFor="Email" value="Email" />
                                <TextInput
                                    id="Email"
                                    type="Email"
                                    value={data.Email}
                                    className="block w-full mt-2 texts"
                                    autoComplete="Email"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            Email: e.target.value,
                                        })
                                    }
                                />
                                {errors.Email && (
                                    <span className="text-red-600">
                                        {errors.Email}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="nombreNegocio"
                                    value="nombre negocio"
                                />
                                <TextInput
                                    id="nombreNegocio"
                                    type="text"
                                    value={data.nombreNegocio}
                                    className="block w-full mt-2 texts"
                                    autoComplete="nombreNegocio"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            nombreNegocio: e.target.value,
                                        })
                                    }
                                />
                                {errors.nombreNegocio && (
                                    <span className="text-red-600">
                                        {errors.nombreNegocio}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ColoniaId"
                                    value="ColoniaId"
                                />
                                <TextInput
                                    id="ColoniaId"
                                    type="text"
                                    value={data.ColoniaId}
                                    className="block w-full mt-2 texts"
                                    autoComplete="ColoniaId"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            ColoniaId: e.target.value,
                                        })
                                    }
                                />
                                {errors.ColoniaId && (
                                    <span className="text-red-600">
                                        {errors.ColoniaId}
                                    </span>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="latitud" value="Latitud" />
                                <TextInput
                                    id="latitud"
                                    type="text"
                                    value={data.latitud}
                                    className="block w-full mt-2 texts"
                                    autoComplete="latitud"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            latitud: e.target.value,
                                        })
                                    }
                                />
                                {errors.latitud && (
                                    <span className="text-red-600">
                                        {errors.latitud}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="longitud"
                                    value="Longitud"
                                />
                                <TextInput
                                    id="longitud"
                                    type="text"
                                    value={data.longitud}
                                    className="block w-full mt-2 texts"
                                    autoComplete="longitud"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            longitud: e.target.value,
                                        })
                                    }
                                />
                                {errors.longitud && (
                                    <span className="text-red-600">
                                        {errors.longitud}
                                    </span>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="promedioconsumo"
                                    value="Promedio Consumo"
                                />
                                <TextInput
                                    id="promedioconsumo"
                                    type="text"
                                    value={data.promedioconsumo}
                                    className="block w-full mt-2 texts"
                                    autoComplete="promedioconsumo"
                                    autoFocus
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            promedioconsumo: e.target.value,
                                        })
                                    }
                                />
                                {errors.promedioconsumo && (
                                    <span className="text-red-600">
                                        {errors.promedioconsumo}
                                    </span>
                                )}
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions className={"mt-4"}>
                    <Button
                        color="error"
                        onClick={() => {
                            setOpen(false);
                            handleCloseModal();
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color={action == "create" ? "success" : "warning"}
                        onClick={submit}
                    >
                        {action == "create" ? "Crear" : "Actualizar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

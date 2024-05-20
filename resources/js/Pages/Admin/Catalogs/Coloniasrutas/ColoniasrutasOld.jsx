import Datatable from "@/components/Datatable";
import InputLabel from "@/components/InputLabel";
import LoadingDiv from "@/components/LoadingDiv";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import request from "@/utils";

export default function Coloniasrutas() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [colrutas, setCol] = useState();
    const [colonias, setColonias] = useState([""]);
    const [rutas, setRutas] = useState([""]);
    const [servicios, setServicios] = useState([""]);

    const [cedisId, setCedisId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [zonas, setZona] = useState([""]);
    const [errors, setErrors] = useState({});

    const { data, setData } = useForm({
        tipodeservicioid: "",
        rutaid: "",
        coloniaid: "",
    });

    const fetchdata = async () => {
        GetColoniaruta();
        GetColonias();
        GetRutas();
        GetServicios();
    };

    const GetColoniaruta = async () => {
        const responseR = await fetch(route("colonia-rutas.index"));
        const dataR = await responseR.json();
        setCol(dataR);
    };

    const GetColonias = async () => {
        const responseE = await fetch(route("colonias.index"));
        const dataE = await responseE.json();
        setColonias(dataE);
    };

    const GetServicios = async () => {
        const responseTs = await fetch(route("tipos-servicios.index"));
        const dataTs = await responseTs.json();
        setServicios(dataTs);
    };

    const GetRutas = async () => {
        const responseTs = await fetch(route("rutas.index"));
        const dataTs = await responseTs.json();
        setRutas(dataTs);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // if (data.nombre.trim() === "") {
        //     newErrors.nombre = "El campo Nombre es requerido";
        //     isValid = false;
        // } else if (data.nombre.length > 30) {
        //     newErrors.nombre = "El campo Clave debe tener como máximo 30 caracteres";
        //     isValid = false;
        // }

        if (data.tipodeservicioid === "") {
            newErrors.tipodeservicioid = "Selecciona el tipo de servicio";
            isValid = false;
        }

        if (data.rutaid === "") {
            newErrors.rutaid = "Selecciona la ruta";
            isValid = false;
        }
        if (data.coloniaid === "") {
            newErrors.coloniaid = "Selecciona la colonia";
            isValid = false;
        }

        // tipodeservicioid: "",
        // rutaid: "",
        // coloniaid: ""

        setErrors(newErrors);
        return isValid;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const ruta =
            action === "create"
                ? route("colonia-rutas.store")
                : route("colonia-rutas.update", cedisId);
        const method = action === "create" ? "POST" : "PUT";

        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        if (open && !colrutas) {
            GetColoniaruta();
            GetColonias();
            GetRutas();
            GetServicios();
        }
    }, [open]);

    useEffect(() => {
        if (!colrutas) {
            GetColoniaruta();
            GetColonias();
            GetRutas();
            GetServicios();
        } else {
            setLoading(false);
        }
    }, [colrutas]);

    return (
        <>
            {loading && <LoadingDiv />}
            {colrutas && !loading && (
                <>
                    <Datatable
                        data={colrutas}
                        add={() => {
                            setAction("create");
                            setData({
                                tipodeservicioid: "",
                                rutaid: "",
                                coloniaid: "",
                            });
                            setOpen(!open);
                        }}
                        columns={[
                            {
                                header: "Colonia Nombre",
                                accessor: "estado",
                                cell: (eprops) => (
                                    <span>
                                        {eprops.item.colonias.Colonia_Nombre}
                                    </span>
                                ),
                            },
                            {
                                header: "Ruta Nombre",
                                accessor: "zona",
                                cell: (eprops) => (
                                    <span>{eprops.item.rutas.ruta_nombre}</span>
                                ),
                            },
                            {
                                header: "Servicios",
                                accessor: "zona",
                                cell: (eprops) => (
                                    <span>
                                        {
                                            eprops.item.servicios
                                                .tipoServicio_descripcion
                                        }
                                    </span>
                                ),
                            },

                            {
                                header: "Acciones",
                                cell: (eprops) => (
                                    <>
                                        <button
                                            className="material-icons"
                                            onClick={() => {
                                                setAction("edit");
                                                setData({ ...eprops.item });
                                                setCedisId(
                                                    eprops.item.coloniarutaid
                                                );
                                                setOpen(!open);
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

            <Dialog
                open={open}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setErrors({});
                    setOpen(!open);
                }}
            >
                <DialogTitle>
                    {action === "create" ? "Crear Cedis" : "Editar Cedis"}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
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
                                    <InputLabel>Rutas</InputLabel>
                                    <Select
                                        sx={{
                                            background: "white",
                                            borderColor: "black",
                                            color: "#4d4d4d",
                                            fontSize: "0.9em",
                                        }}
                                        value={data.rutaid}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                rutaid: e.target.value,
                                            })
                                        }
                                    >
                                        {rutas.map((ruta, index) => (
                                            <MenuItem
                                                key={index}
                                                value={ruta.ruta_idruta}
                                            >
                                                {ruta.ruta_nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.rutaid && (
                                        <span className="text-red-500">
                                            {errors.rutaid}
                                        </span>
                                    )}
                                </FormControl>
                            </div>
                            <div>
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
                                    <InputLabel>Colonias</InputLabel>
                                    <Select
                                        sx={{
                                            background: "white",
                                            borderColor: "black",
                                            color: "#4d4d4d",
                                            fontSize: "0.9em",
                                        }}
                                        value={data.coloniaid}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                coloniaid: e.target.value,
                                            })
                                        }
                                    >
                                        {colonias.map((colonia, index) => (
                                            <MenuItem
                                                key={index}
                                                value={colonia.Colonia_Id}
                                            >
                                                {colonia.Colonia_Nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {errors.coloniaid && (
                                        <span className="text-red-500">
                                            {errors.coloniaid}
                                        </span>
                                    )}
                                </FormControl>
                            </div>

                            <div>
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
                                    <InputLabel>Tipo de servicio</InputLabel>
                                    <Select
                                        sx={{
                                            background: "white",
                                            borderColor: "black",
                                            color: "#4d4d4d",
                                            fontSize: "0.9em",
                                        }}
                                        value={data.tipodeservicioid}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                tipodeservicioid:
                                                    e.target.value,
                                            })
                                        }
                                    >
                                        {servicios.map((servicio, index) => (
                                            <MenuItem
                                                key={index}
                                                value={
                                                    servicio.tipoServicio_idTipoServicio
                                                }
                                            >
                                                {
                                                    servicio.tipoServicio_descripcion
                                                }
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {errors.tipodeservicioid && (
                                        <span className="text-red-500">
                                            {errors.tipodeservicioid}
                                        </span>
                                    )}
                                </FormControl>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
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

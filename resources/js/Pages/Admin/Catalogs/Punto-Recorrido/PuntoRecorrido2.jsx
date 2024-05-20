import Datatable from "@/components/Datatable";
import InputLabel from "@/components/InputLabel";
import LoadingDiv from "@/components/LoadingDiv";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import DialogComp from '@/components/DialogComp'
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
import SelectComp from "@/components/SelectComp";

export default function PuntoRecorrido() {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [action, setAction] = useState(["edit"]);
    const [recorridoP, setrecorridoP] = useState();
    const [loading, setLoading] = useState(true);
    const [rondin, setrondin] = useState(0);
    const [recorridos, setrecorridos] = useState([]);
    const [rondines, setrondines] = useState([]);
    const [errors, setErrors] = useState({});
    const { data, setData } = useForm({
        IdRecorrido: "",
        IdPuntoRondin: "",
        Id: 0,
        Nombre: "",
        Frecuencia: "",
        Hora_Comienzo: "",
        Numero_Repeticiones: ""
    });


    const getP = async () => {
        const responseP = await fetch(route("recorridos-puntos.index"));
        const dataP = await responseP.json();
        setrecorridoP(dataP);
    };

    const getR = async () => {
        const responseR = await fetch(route("punto-rondin.index"));
        const dataR = await responseR.json();
        setrondines(dataR);
    };

    const getRe = async () => {
        const responseRe = await fetch(route("recorridos.index"));
        const dataRe = await responseRe.json();
        setrecorridos(dataRe);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.IdRecorrido === "") {
            newErrors.IdRecorrido = "El campo Recorrido es requerido";
            isValid = false;
        }

        if (data.IdPuntoRondin === "") {
            newErrors.IdPuntoRondin = "El campo Rondin es requerido";
            isValid = false;
        }

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
                ? route("recorridos-puntos.store")
                : route("recorridos-puntos.update", rondin);
        const method = action === "create" ? "POST" : "PUT";

        await request(ruta, method, data).then(() => {
            getP();
            setOpen(!open);
        });
    };

    const submit2 = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setData({ ...data, Hora_Comienzo: formatDateInput(data.Hora_Comienzo) })
        const ruta =
            action === "create"
                ? route("recorridos.store")
                : route("recorridos.update", data.Id);

        const method = action === "create" ? "POST" : "PUT";
 
        await request(ruta, method, data).then(()=>{
            fetchdata();
            setOpen2(!open2);
        });
    };

    useEffect(() => {
        if (open && !recorridoP) {
            getP();
            getR();
            getRe();
        }
    }, [open]);

    const handleCloseModal = () => {
        setOpen(false);
        setOpen2(false);
        setErrors({});
    };

    useEffect(() => {
        if (!recorridoP) {
            getP();
            getR();
            getRe();
        } else {
            setLoading(false);
        }
    }, [recorridoP]);

    return (
        <>

            {loading && <LoadingDiv />}

            <section className=" sm:grid sm:grid-cols-2">
                <div className="h-56 w-full object-cover sm:h-full">
                    <div className="mx-auto max-w-xl text-center">
                        <h4 style={{ paddingTop: '5%' }}>Punto Recorrido</h4>
                        {recorridoP && !loading && (
                            <Datatable
                                data={recorridoP}
                                add={() => {
                                    setAction("create");
                                    setData({
                                        IdRecorrido: "",
                                        IdPuntoRondin: "",
                                    });
                                    setOpen(!open);
                                }}
                                columns={[
                                    {
                                        header: "Rondines",
                                        accessor: "punto_rondin",
                                        cell: (eprops) => (
                                            <span>
                                                {eprops.item.punto_rondin.Nombre}
                                            </span>
                                        ),
                                    },
                                    {
                                        header: "Recorrido",
                                        accessor: "recorrido",
                                        cell: (eprops) => (
                                            eprops.item.recorrido.Nombre
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
                                                        setrondin(eprops.item.Id);
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
                        )}
                    </div>
                </div>

                <div className="h-56 w-full object-cover sm:h-full " >
                    <div className="mx-auto max-w-xl text-center">
                        <h4 style={{ paddingTop: '5%' }}>Recorrido</h4>
                        {recorridos && !loading && (
                            <Datatable
                                data={recorridos}
                                add={() => {
                                    setAction('create')
                                    setData({
                                        Id: 0,
                                        Nombre: "",
                                        Frecuencia: "",
                                        Hora_Comienzo: "",
                                        Numero_Repeticiones: ""
                                    })
                                    setOpen2(!open2)
                                }}
                                columns={[
                                    { header: 'Nombre', accessor: 'Nombre' },
                                    { header: 'Frecuencia', accessor: 'Frecuencia' },
                                    { header: 'Hr. comienzo', accessor: 'Hora_Comienzo' },
                                    { header: 'No. Repeticiones', accessor: 'Numero_Repeticiones' },
                                    {
                                        header: 'Acciones', cell: eprops =>
                                            <>
                                                <button className="material-icons"
                                                    onClick={() => {
                                                        setAction('edit')
                                                        setData({ ...eprops.item })

                                                        setOpen2(!open2)
                                                    }}
                                                >
                                                    edit
                                                </button>
                                            </>
                                    }
                                ]}
                            />
                        )}
                    </div>
                </div>
            </section>

            <Dialog
                open={open}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    handleCloseModal();
                    setOpen(!open);
                }}
            >
                <DialogTitle>
                    {action === "create"
                        ? "Crear Punto Recorrido"
                        : "Editar Punto Recorrido"}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div>
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

                                    <SelectComp
                                        label="Recorrido"
                                        options={recorridos}
                                        value={data.IdRecorrido}
                                        onChangeFunc={(newValue) =>
                                            setData({
                                                ...data,
                                                IdRecorrido: newValue,
                                            })
                                        }
                                        data="Nombre"
                                        valueKey="Id"
                                    />
                                    {errors.IdRecorrido && (
                                        <span className="text-red-500">
                                            {errors.IdRecorrido}
                                        </span>
                                    )}
                                </FormControl>
                            </div>

                            <div className="mt-3">
                                <SelectComp
                                    label="Rondines"
                                    options={rondines}
                                    value={data.IdPuntoRondin}
                                    onChangeFunc={(newValue) =>
                                        setData({
                                            ...data,
                                            IdPuntoRondin: newValue,
                                        })
                                    }
                                    data={"Nombre"}
                                    valueKey={"Id"}
                                />

                                {errors.IdPuntoRondin && (
                                    <span className="text-red-500">
                                        {errors.IdPuntoRondin}
                                    </span>
                                )}
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions className={"mt-4"}>
                    <Button color="error" onClick={() => setOpen(!open)}>
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

            <DialogComp
                dialogProps={{
                    model: '',
                    width: 'sm',
                    openState: open2,
                    actionState: action,
                    openStateHandler: () => setOpen2(!open2),
                    onSubmitState: () => submit2
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: "text",
                        name: "Nombre",
                        value: data.Nombre,
                         className: "block w-full mt-1 texts",
                         isFocused: true,
                         onChangeFunc: (e) =>
                         setData({
                                 ...data,
                                 Nombre: e.target.value,
                             }),
                    },

                    {
                        label: "Frecuencia",
                        input: true,
                        type: "text",
                        name: "Frecuencia",
                        value:data.Frecuencia,
                         className: "block w-full mt-1 texts",
                         isFocused: true,
                         onChangeFunc: (e) =>
                         setData({
                                 ...data,
                                 Frecuencia: e.target.value,
                             }),
                    },
                    {
                        label: "Hora Comienzo",
                        input: true,
                        type: "datetime-local",
                        name: "Frecuencia",
                        value:data.Hora_Comienzo,
                         className: "block w-full mt-1 texts",
                         isFocused: true,
                         onChangeFunc: (e) =>
                         setData({
                                 ...data,
                                 Hora_Comienzo: e.target.value,
                             }),
                    },
                    {
                        label: "Numero Repeticiones",
                        input: true,
                        type: "text",
                        name: "Numero Repeticiones",
                        value:data.Numero_Repeticiones,
                         className: "block w-full mt-1 texts",
                         isFocused: true,
                         onChangeFunc: (e) =>
                         setData({
                                 ...data,
                                 Numero_Repeticiones: e.target.value,
                             }),
                    }
                ]}
                errors={errors}
            />
        </>
    );
}

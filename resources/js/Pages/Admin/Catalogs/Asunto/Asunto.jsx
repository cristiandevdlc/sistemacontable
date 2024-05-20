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
import request from "@/utils";

const Asunto = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState("create");
    const [subjects, setSubjects] = useState();
    const [departments, setDepartments] = useState();
    const { data, setData } = useForm({
        asunto_idAsunto: "",
        asunto_descripcion: "",
    });

    const [errors, setErrors] = useState({});
    const getSubjects = async () => {
        const response = await fetch(route("asuntos.index"));
        const data = await response.json();
        setSubjects(data);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.asunto_descripcion.trim() === "") {
            newErrors.asunto_descripcion = "El asunto es requerido";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const ruta =
            action === "create"
                ? route("asuntos.store")
                : route("asuntos.update", data.asunto_idAsunto);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getSubjects();
            setOpen(!open);
        });
    };

    useEffect(() => {
        if (!subjects) {
            getSubjects();
        } else {
            setLoading(false);
        }
    }, [subjects]);

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };
    return (
        <>
            {loading && <LoadingDiv />}
            {subjects && !loading && (
                <>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData({
                                asunto_idAsunto: "",
                                asunto_descripcion: "",
                            });
                            setOpen(!open);
                        }}
                        data={subjects}
                        columns={[
                            {
                                header: "Descripción",
                                accessor: "asunto_descripcion",
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
                onClose={() => {
                    setErrors({});
                    setOpen(!open);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {action === "create" ? "Crear Asunto" : "Editar Asunto"}
                </DialogTitle>
                <DialogContent>
                    <form >         
                            <div>
                                <InputLabel  />
                                <TextInput
                                    label="Descripción"
                                    className="block w-full mt-1 texts"
                                    type="text"
                                    name="asunto_descripcion"
                                    value={data.asunto_descripcion}
                                    isFocused={true}
                                    onChange={(e) => {
                                        setData({ ...data, asunto_descripcion: e.target.value })
                                    }}
                                />

                            {errors.asunto_descripcion && (
                                <span className="text-red-600">
                                    {errors.asunto_descripcion}
                                </span>
                            )}
                        </div>
                    </form>
                </DialogContent>
                <DialogActions className={"mt-4"}>
                    <Button
                        color="error"
                        onClick={() => {
                            handleCloseModal();
                            setOpen(false);
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
};
export default Asunto;

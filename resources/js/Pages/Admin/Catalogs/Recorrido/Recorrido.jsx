import React from "react";
import { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, Select, FormControl, DialogTitle } from "@mui/material";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Component } from "react";
import "../../../../../sass/TablesComponent/_tablesStyle.scss"
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import request from '@/utils';

export default function Recorrido() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true)
    const [action, setAction] = useState("create");
    const [recorridos, setRecortridos] = useState();
    const { data, setData } = useForm({
        Id: 0,
        Nombre: "",
        Frecuencia: "",
        Hora_Comienzo: "",
        Numero_Repeticiones: ""
    });
    const [errors, setErrors] = useState({});

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const fetchdata = async () => {
        const response = await fetch(route("recorridos.index"));
        const data = await response.json();
        setRecortridos(data);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.Nombre.trim() === "") {
            newErrors.Nombre = "El campo Nombre es requerido.";
            isValid = false;
        } else if (data.Nombre.length > 100) {
            newErrors.Nombre = "El campo Nombre debe tener como máximo 100 caracteres.";
            isValid = false;
        }

        if (data.Frecuencia.trim() === "") {
            newErrors.Frecuencia = "El campo Frecuencia es requerido";
            isValid = false;
        } else if (!Number.isInteger(Number(data.Frecuencia))) {
            newErrors.Frecuencia = "El campo Frecuencia debe ser un número entero.";
            isValid = false;
        } else if (data.Frecuencia > 4) {
            newErrors.Frecuencia = "El campo Frecuencia no debe ser mayor a 4.";
            isValid = false;
        }

        if (data.Numero_Repeticiones.trim() === "") {
            newErrors.Numero_Repeticiones = "El campo Numero Repeticiones es requerido.";
            isValid = false;
        } else if (!Number.isInteger(Number(data.Numero_Repeticiones))) {
            newErrors.Numero_Repeticiones = "El campo Numero Repeticiones debe ser un número entero.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    const submit = async (e) => {
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

        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    function formatDateInput(dateString) {
        // const date = new Date(dateString);
        // const year = date.getUTCFullYear();
        // const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
        // const day = ("0" + date.getUTCDate()).slice(-2);
        // return `${year}-${month}-${day}`;

        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
        const day = ("0" + date.getUTCDate()).slice(-2);
        const hour = ("0" + date.getHours()).slice(-2);
        const minute = ("0" + date.getMinutes()).slice(-2);
        const second = ("0" + date.getSeconds()).slice(-2);
        const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}.000`;
        return formattedDate
    }

    useEffect(() => {
        getMenuName();
    }, [])

    useEffect(() => {
        if (!recorridos) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [recorridos]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(recorridos && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
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
                            setOpen(!open)
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
                                                setOpen(!open)
                                            }}
                                        >
                                            edit
                                        </button>
                                    </>
                            }
                        ]}
                    />
                </div>
            }
            <Dialog
                open={open}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {action === "create" ? "Crear Recorrido" : "Editar Recorrido"}
                </DialogTitle>
                <DialogContent>
                    <form id="register-form">
                        <div className="space-y-4">
                            <InputLabel htmlFor="Nombre" />
                            <TextInput
                                label="Nombre"
                                id="Nombre"
                                type="text"
                                name="Nombre"
                                value={data.Nombre}
                                className="block w-full mt-1 texts"
                                autoComplete="Nombre"
                                isFocused={true}
                                onChange={(e) => setData({ ...data, Nombre: e.target.value })}
                            />
                            {errors.Nombre &&
                                <span className="text-red-600">{errors.Nombre}</span>
                            }
                        </div>
                        <div className="space-y-4">
                            <InputLabel htmlFor="Frecuencia" className="mt-3" />
                            <TextInput
                                label="Frecuencia"
                                id="Frecuencia"
                                type="text"
                                name="Frecuencia"
                                value={data.Frecuencia}
                                className="block w-full mt-1 texts"
                                autoComplete="Frecuencia"
                                onChange={(e) => setData({ ...data, Frecuencia: e.target.value })}
                            />
                            {errors.Frecuencia &&
                                <span className="text-red-600">{errors.Frecuencia}</span>
                            }
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="Hora Comienzo" className="mt-3" />
                            <TextInput
                                id="Hora_Comienzo"
                                type="datetime-local"
                                name="Hora_Comienzo"
                                value={data.Hora_Comienzo}
                                className="block w-full mt-1 texts"
                                autoComplete="Hora_Comienzo"
                                pattern="\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}"
                                placeholder={data.Hora_Comienzo}
                                onChange={(e) => setData({ ...data, Hora_Comienzo: formatDateInput(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-4">
                            <InputLabel htmlFor="Numero_Repeticiones" className="mt-3" />
                            <TextInput
                                label="Numero Repeticiones"
                                id="Numero_Repeticiones"
                                type="text"
                                name="Numero_Repeticiones"
                                value={data.Numero_Repeticiones}
                                className="block w-full mt-1 texts"
                                autoComplete="Numero_Repeticiones"
                                onChange={(e) => setData({ ...data, Numero_Repeticiones: e.target.value })}
                            />
                            {errors.Numero_Repeticiones && (
                                <div className="text-red-600">{errors.Numero_Repeticiones}</div>
                            )}
                        </div>
                    </form>
                    <DialogActions className={'mt-4'}>
                        <Button
                            color="error"
                            onClick={() => {
                                handleCloseModal();
                                setOpen(false)
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color={(action == 'create')
                                ? 'success'
                                : 'warning'
                            }
                            onClick={submit}
                        >
                            {(action == 'create') ? 'Crear' : 'Actualizar'}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}

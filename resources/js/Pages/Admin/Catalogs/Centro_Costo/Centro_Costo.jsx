import React from "react";
import { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle,Tooltip } from "@mui/material";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import LoadingDiv from '@/components/LoadingDiv'
import Datatable from '@/components/Datatable'
import request from '@/utils';

export default function CentroCostos() {
    const [action, setAction] = useState(["edit"]);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const [centros, setcentro] = useState();
    const [loading, setLoading] = useState(true)

    const { data, setData } = useForm({
        CC_Nombre: "",
        CC_Clave: "",
    });

    const fetchdata = async () => {
        const response = await fetch(route("centroscostos.index"));
        const data = await response.json();
        setcentro(data);
    };

    useEffect(() => {
        fetchdata();
    }, []);

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.CC_Nombre.trim() === "") {
            newErrors.CC_Nombre = "El nombre del centro de costo es requerido";
            isValid = false;
        }

        if (data.CC_Clave.trim() === "") {
            newErrors.CC_Clave = "La clave es requerida";
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

        const ruta = action === "create"
            ? route("centroscostos.store")
            : action === "edit"
                ? route("centroscostos.update", data.CC_id)
                : route("centroscostos.destroy", data.CC_id);
        const method = action === "create" ? "POST" : action === "edit" ? "PUT" : "DELETE";
        await request(ruta, method, data).then(()=>{
            fetchdata();
            setOpen(!open);
        });
    };

    useEffect(() => {
        if (!centros) {
            fetchdata()
        } else {
            setLoading(false)
        }
    }, [centros])

    return (
        <>
            {loading &&
                <LoadingDiv />
            }
            {(centros && !loading) &&
                <>
                    <Datatable
                        data={centros}
                        add={() => {
                            setAction('create')
                            setData({
                                CC_id: "",
                                CC_Nombre: "",
                                CC_Clave: "",
                            })
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Nombre', accessor: 'CC_Nombre' },
                            { header: 'Clave', accessor: 'CC_Clave' },
                            {
                                header: 'Acciones', cell: eprops =>
                                    <>
                                    <Tooltip title="Editar">

                                        <button className="material-icons"
                                            onClick={() => {
                                                setAction('edit')
                                                setData({ ...eprops.item })
                                                setOpen(!open)
                                            }}
                                            >
                                            edit
                                        </button>
                                            </Tooltip>
                                    </>
                            }
                        ]}
                    />
                </>
            }

            <Dialog open={open}
                 onClose={() => {
                    handleCloseModal()
                }}
                maxWidth="sm" fullWidth>
                <DialogTitle>
                    {action === "create" ? "Crear Centro-Costo" : "Editar Centro-Costo"}
                </DialogTitle>
                <DialogContent>
                    <form id="register-form">
                        <div className="mt-4">
                            <InputLabel htmlFor="Nombre"  />
                            <TextInput
                                label="Nombre"
                                id="Nombre"
                                type="text"
                                maxLength="30"
                                name="Nombre"
                                value={data.CC_Nombre}
                                className="block w-full mt-1 texts"
                                autoComplete="Nombre"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        CC_Nombre
                                            : e.target.value,
                                    })
                                }
                            />
                            {errors.CC_Nombre &&
                                <span className="text-red-600">{errors.CC_Nombre}</span>
                            }
                        </div>

                        <div className="space-y-5">
                            <InputLabel htmlFor="Clave"  />
                            <TextInput
                                label="Clave"
                                id="Clave"
                                type="text"
                                name="Clave"
                                maxLength="6"
                                value={data.CC_Clave}
                                className="block w-full mt-1 texts"
                                autoComplete="Clave"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        CC_Clave
                                            : e.target.value,
                                    })

                                }
                            />
                            {errors.CC_Clave &&
                                <span className="text-red-600">{errors.CC_Clave}</span>
                            }
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
                        <Button color={(action == 'create') ? 'success' : 'warning'} onClick={submit}>{(action == 'create') ? 'Crear' : 'Actualizar'}</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
}
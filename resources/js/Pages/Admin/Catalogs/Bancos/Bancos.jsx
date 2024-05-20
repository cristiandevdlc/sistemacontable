import React from "react";
import { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import "../../../../../sass/TablesComponent/_tablesStyle.scss";
import Datatable from '@/components/Datatable'
import LoadingDiv from '@/components/LoadingDiv'
import request from '@/utils';
import DialogComp from "@/components/DialogComp";

export default function Bancos() {
    const [action, setAction] = useState("create");
    // const [bancoId, setBancoId] = useState(0);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const { data, setData } = useForm({
        banco_idBanco: "",
        banco_nombreBanco: "",
        banco_rfcBanco: "",
        banco_Descripcion: ""
    });

    const [bancos, setbancos] = useState();
    const [loading, setLoading] = useState(true)

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
        const response = await fetch(route("bancos.index"));
        const data = await response.json();
        setbancos(data);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.banco_nombreBanco.trim() === "") {
            newErrors.banco_nombreBanco = "El nombre del Banco es requerido";
            isValid = false;
        }
        if (data.banco_rfcBanco.trim() === "") {
            newErrors.banco_rfcBanco = "El RFC es requerido";
            isValid = false;
        } else if (data.banco_rfcBanco.trim().length < 12) {
            newErrors.banco_rfcBanco = "El RFC debe tener al menos 12 caracteres";
            isValid = false;
        }


        if (data.banco_Descripcion.trim() === "") {
            newErrors.banco_Descripcion = "La Descripcion es requerida";
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
        const ruta = action === "create" ? route("bancos.store") : route("bancos.update", data.banco_idBanco);
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
        if (!bancos) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [bancos])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(bancos && !loading) &&
                <div className="relative h-[90%]">
                    <Datatable
                        data={bancos}
                        add={() => {
                            setAction('create')
                            setData({
                                banco_idBanco: "",
                                banco_nombreBanco: "",
                                banco_rfcBanco: "",
                                banco_Descripcion: ""
                            })
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Nombre', accessor: 'banco_nombreBanco' },
                            { header: 'RFC', accessor: 'banco_rfcBanco' },
                            { header: 'Descripción', accessor: 'banco_Descripcion' },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    setOpen(!open)
                                },
                            },
                        ]}
                    />
                </div>
            }
            <Dialog open={open}
                onClose={() => {
                    handleCloseModal()
                }}
                maxWidth="sm" fullWidth>
                <DialogTitle>
                    {action === "create" ? "Crear banco" : "Editar banco"}
                </DialogTitle>
                <DialogContent>
                    <form id="register-form">
                        <div className="space-y-4">
                            <InputLabel htmlFor="banco_nombreBanco" />
                            <TextInput
                                label="Nombre"
                                id="banco_nombreBanco"
                                type="text"
                                name="banco_nombreBanco"
                                maxLength="30"
                                value={data.banco_nombreBanco}
                                className="block w-full mt-1 texts"
                                autoComplete="banco_nombreBanco"
                                isFocused={true}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        banco_nombreBanco: e.target.value,
                                    })
                                }
                            />
                            {errors.banco_nombreBanco &&
                                <span className="text-red-600">{errors.banco_nombreBanco}</span>
                            }
                        </div>
                        <div className="space-y-7">
                            <InputLabel htmlFor="banco_rfcBanco" />
                            <TextInput
                                label="RFC"
                                id="banco_rfcBanco"
                                type="text"
                                name="banco_rfcBanco"
                                maxLength="13"
                                value={data.banco_rfcBanco}
                                className="block w-full mt-1 texts"
                                autoComplete="banco_rfcBanco"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        banco_rfcBanco: e.target.value,
                                    })
                                }
                            />
                            {errors.banco_rfcBanco &&
                                <span className="text-red-600">{errors.banco_rfcBanco}</span>
                            }
                        </div>
                        <div className="space-y-7">
                            <InputLabel htmlFor="banco_Descripcion" />
                            <TextInput
                                label="Descripción"
                                id="banco_Descripcion"
                                type="text"
                                name="banco_Descripcion"
                                value={data.banco_Descripcion}
                                className="block w-full mt-1 texts"
                                autoComplete="banco_Descripcion"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        banco_Descripcion: e.target.value,
                                    })
                                }
                            />
                            {errors.banco_Descripcion &&
                                <span className="text-red-600">{errors.banco_Descripcion}</span>
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
        </div>
    );
}

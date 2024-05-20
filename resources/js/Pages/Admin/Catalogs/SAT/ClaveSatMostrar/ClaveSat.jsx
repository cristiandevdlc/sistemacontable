import Datatable from '@/components/Datatable'
import InputLabel from '@/components/InputLabel'
import LoadingDiv from '@/components/LoadingDiv'
import TextInput from '@/components/TextInput'
import { useForm } from '@inertiajs/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import request from '@/utils';
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
    FormControlLabel,
    Checkbox
} from "@mui/material";



export default function ClaveSat() {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(["create"]);
    const [productos, setProductos] = useState([]);
    const [errors, setErrors] = useState({});
    const [claves, setClaves] = useState();
    const [data, setData] = useState({
        ClavesSatMostrar_ids: [],
    });
    const selectedValues = [];

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (selectedValues == []) {
            newErrors.selectedValues = "Debes seleccionar minimo un producto";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const fetchdata = async () => {
        const response = await fetch(route("conceptos-productos.sin-clave"));
        const data = await response.json();
        setProductos(data);
    };

    const fetchdataClave = async () => {
        const response = await fetch(route("claves-mostrar.index"));
        const data = await response.json();
        setClaves(data);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        fetchdata();
        fetchdataClave();
    }, []);


    
    useEffect(() => {

        if (open && !claves) {
            fetchdataClave();
        }
    }, [open])


    useEffect(() => {
        if (!claves) {
            fetchdataClave();
        } else {
            setLoading(false)
        }
    }, [claves])

    const submit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        const ruta = action === "create" ? route("claves-mostrar.store") : route("");
        const method = action === "create" ? "POST" : "UPDATE";
        const response = await fetch(ruta, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        })
            .then((res) => {
                fetchdata();
                // setOpen(!open);
                new Noty({
                    text: "Registro guardado.",
                    type: "success",
                    theme: "metroui",
                    layout: "bottomRight",
                    timeout: 2000,
                }).show();
            })
            .catch((error) => {
                new Noty({
                    text: "No se pudo guardar el registro.",
                    type: "error",
                    theme: "metroui",
                    layout: "bottomRight",
                    timeout: 2000,
                }).show();
            });
    };

    return (
        <>
            {loading &&
                <LoadingDiv />
            }
            {(claves && !loading) &&
                <>


                    <Datatable
                        add={() => {
                            setAction('create')
                            setData({
                                IdPuesto: "",
                                IdDepartamento: "",
                                nombre: "",
                                estatus: "",
                                TieneHorasExtra: "",
                            })
                            setOpen(!open)
                        }}
                        data={claves}
                        columns={[

                            { 
                                header: 'Nombre', 
                                cell: (eprops)=>(
                                    <span>
                                        {eprops.item.conceptos_producto.conceptosProductosSAT_descripcion}
                                    </span>
                                )
                            },
                        ]}
                    />
                </>
            }



            <Dialog
                open={open}
                maxWidth="lg"
                fullWidth
                onClose={() => setOpen(!open)}
            >
                <DialogTitle>{"Añadir conpectos productos"}</DialogTitle>
                <DialogContent>
                    <form id="register-form">
                        <div className="grid grid-cols-3 gap-3">
                            {productos && productos.map((producto, index) => {
                                return (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        selectedValues.push(
                                                            producto.conceptosProductosSAT_id
                                                        );
                                                        setData({
                                                            ClavesSatMostrar_ids: selectedValues,
                                                        });
                                                    } else {
                                                        const index =
                                                            selectedValues.indexOf(
                                                                producto.conceptosProductosSAT_id
                                                            );
                                                        if (index > -1) {
                                                            selectedValues.splice(
                                                                index,
                                                                1
                                                            );
                                                            setData({
                                                                ClavesSatMostrar_ids: selectedValues,
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                        }
                                        label={
                                            producto.conceptosProductosSAT_descripcion
                                        }

                                    />
                                );
                            })}
                        </div>
                    </form>
                    {errors.banco_nombreBanco && (
                        <span className="text-red-600">
                            {errors.banco_nombreBanco}
                        </span>
                    )}
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
                </DialogContent>
            </Dialog>
        </>
    )
}



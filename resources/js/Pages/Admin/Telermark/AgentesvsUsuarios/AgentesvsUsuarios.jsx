import React, { useEffect, useState } from "react";
import Datatable from "@/components/Datatable";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,

} from "@mui/material";
import { useForm } from "@inertiajs/react";
import LoadingDiv from "@/components/LoadingDiv";
import SelectComp from "@/components/SelectComp";
import TextInput from "@/components/TextInput";
import request from "@/utils";

const Agentesvsusuarios = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState("create");
    const [agentesvsusuarios, setAgentesvsUsuarios] = useState();
    const [idAgentesvsUsuarios, setIdAgentesvsUsuarios] = useState(0);
    //agregamos la otra bd para el select
    const [operadora, setOperadora] = useState();
    const [operadoraOptions, setOperadoraOptions] = useState()

    const [errors, setErrors] = useState({});
    const { data, setData, reset } = useForm({
        // id:"",
        agente: "",
        usuarioid: "",
    });


    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true })
        } catch (error) { }
    };



    const GetOperadora = async () => {
        const response = await fetch(route("usuarios.index"));
        const data = await response.json();
        setOperadora(data);
    };
    const getAgentesvsusuarios = async () => {
        const response = await fetch(route("agentesvsusuarios.index"));
        const data = await response.json();
        setAgentesvsUsuarios(data);
        setLoading(false);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const ruta =
            action === "create"
                ? route("agentesvsusuarios.store")
                : route("agentesvsusuarios.update", data.id);

        const method = action === "create" ? "POST" : "PUT";

        await request(ruta, method, data).then(() => {
            getAgentesvsusuarios();
            GetOperadora();

            handleCloseModal();
            setOpen(!open);
        });
    };

    const handleEdit = (item) => {
        setAction("edit");
        setData({
            id: item.id,
            agente: item.agente,
            usuarioid: item.usuarioid,
        });
        setIdAgentesvsUsuarios(item.usuarioid);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
        reset();
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (data.usuarioid === 0 || !data.usuarioid) {
            newErrors.usuarioid = "La operadora es requerida";
            isValid = false;
        }
        if (data.agente.trim() === "") {
            newErrors.agente = "El agente es requerido";
            isValid = false;
        }
        if (data.agente.toString() === '0') {
            newErrors.agente = "Debes ingresar un agente válido";
            isValid = false;
        }
        agentesvsusuarios.forEach((agente) => {
            if (agente.agente.toString() === data.agente.toString()) {
                newErrors.agente = "El agente ya existe";
                isValid = false
            }
        })
        setErrors(newErrors);

        return isValid;
    };

    const filterOperadora = () => {
        const filtered = operadora.filter((item) => {
            return !agentesvsusuarios.some((agente) => {
                return item.usuario_idUsuario.toString() === agente.usuarioid.toString();
            });
        });

        const sortedOptions = [...filtered].sort((a, b) => {
            return a.usuario_nombre.localeCompare(b.usuario_nombre);
        });

        setOperadoraOptions(sortedOptions);
    };


    useEffect(() => {
        if (!agentesvsusuarios) {
            getAgentesvsusuarios();
            getMenuName();

        }
        if (!operadora) {
            GetOperadora();
        }
        if (agentesvsusuarios && operadora) {
            filterOperadora()
        }
    }, [agentesvsusuarios, operadora]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {agentesvsusuarios && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setOpen(true);
                        }}
                        data={agentesvsusuarios}
                        columns={[
                            { header: 'Operadora', accessor: 'Operadora', cell: eprops => <span>{eprops.item.usuarios.usuario_nombre}</span> },
                            { header: "Agente", accessor: "agente" },
                            {
                                header: "Acciones",
                                edit: (eprops) => handleEdit(eprops.item),
                            },
                        ]}
                    />
                </div>
            )}
            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>
                    {action === "create"
                        ? "Usuarios VS Agentes"
                        : "Editar Agente"}
                </DialogTitle>
                <DialogContent>
                    <form className=" w-96" onSubmit={submit}>
                        <div>
                            {action === "create" &&
                                <div className="">
                                    <SelectComp
                                        label="Operadora"
                                        options={operadoraOptions}
                                        value={data.usuarioid || ''}
                                        onChangeFunc={(newValue) =>
                                            setData({
                                                ...data,
                                                usuarioid: newValue,
                                            })
                                        }
                                        data="usuario_nombre"
                                        valueKey="usuario_idUsuario"
                                    />
                                    {errors.usuarioid && (
                                        <span className="text-red-600">
                                            {errors.usuarioid}
                                        </span>
                                    )}
                                </div>
                            }
                            <div className="mt-4">
                                <TextInput
                                    label="Agente"
                                    className="block w-full mt-1 texts"
                                    id="agente"
                                    type="text"
                                    value={data.agente}
                                    autoComplete="off"
                                    autoFocus
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const validInput = inputValue.replace(/\D/g, '');
                                        setData({
                                            ...data,
                                            agente: validInput,
                                        });
                                    }}
                                />

                                {errors.agente && (
                                    <span className="text-red-600">{errors.agente}</span>
                                )}
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions className="">
                    <Button color="error" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button
                        color={action === "create" ? "success" : "warning"}
                        onClick={submit}
                    >
                        {action === "create" ? "Crear" : "Actualizar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Agentesvsusuarios;

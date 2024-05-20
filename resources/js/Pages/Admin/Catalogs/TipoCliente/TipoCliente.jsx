import React from "react";
import request, { validateInputs } from '@/utils';
import { useState } from "react";
import { useEffect } from "react";
import { Tooltip } from "@mui/material";
import { useForm } from "@inertiajs/react";
import Datatable from '@/components/Datatable'
import LoadingDiv from '@/components/LoadingDiv'
import DialogComp from "@/components/DialogComp";
import "../../../../../sass/TablesComponent/_tablesStyle.scss";

export default function TipoCliente() {

    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const { data, setData } = useForm({
        tipoCliente_idTipoCliente: '',
        tipoCliente_tipo: '',
    });

    const [TipoCliente, setTipoCliente] = useState();
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
        const response = await fetch(route("tipo-clientes.index"));
        const data = await response.json();
        setTipoCliente(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs({ tipoCliente_tipo: 'required' }, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("tipo-clientes.store") : route("tipo-clientes.update", data.tipoCliente_idTipoCliente)
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
        if (!TipoCliente) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [TipoCliente])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(TipoCliente && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={TipoCliente}
                        add={() => {
                            setAction('create')
                            setData({
                                tipoCliente_idTipoCliente: "",
                                tipoCliente_tipo: "",
                            })
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Nombre', accessor: 'tipoCliente_tipo' },

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

            <DialogComp
                dialogProps={{
                    model: 'sector comercial',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: 'text',
                        fieldKey: 'tipoCliente_tipo',
                        style: 'col-span-2',
                        value: data.tipoCliente_tipo,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                tipoCliente_tipo: e.target.value,
                            });
                        },
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

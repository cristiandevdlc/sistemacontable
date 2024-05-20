import React from "react";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import "../../../../../sass/TablesComponent/_tablesStyle.scss";
import Datatable from '@/components/Datatable'
import LoadingDiv from '@/components/LoadingDiv'
import request, { validateInputs } from '@/utils';
import AreaFuncionalDialog from "./components/Dialog";
import { Tooltip } from "@mui/material";
import DialogComp from "@/components/DialogComp";

const afValidations = {
    AF_Clave: ['required', 'max:20'],
    AF_Nombre: ['required', 'max:50'],
    // AF_idCC: 'required',
}

const afData = {
    AF_id:'',
    AF_Clave: '',
    AF_Nombre: '',
    AF_Doble: '',
    // AF_idCC: '',
}

export default function AreasFuncionales(props) {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [empresas, setEmpresas] = useState();
    const { data, setData } = useForm(afData);

    const [AreaFuncional, setTipoCliente] = useState();
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
        const response = await fetch(route("areas-funcionales.index"));
        const data = await response.json();
        setTipoCliente(data);

        const responseE = await fetch(route("empresas.index"));
        const dataE = await responseE.json();
        setEmpresas(dataE);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(afValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("areas-funcionales.store") : route("areas-funcionales.update", data.AF_id);
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
        if (!AreaFuncional) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [AreaFuncional])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(AreaFuncional && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={AreaFuncional}
                        add={() => {
                            setAction('create')
                            setData(afData)
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Clave', accessor: 'AF_Clave' },
                            { header: 'Nombre', accessor: 'AF_Nombre' },
                            { header: 'Empresa', cell: (eprops) => (<>{eprops.item.empresa.empresa_razonComercial}</>) },
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
                </div>
            }

            <DialogComp
                dialogProps={{
                    model: 'área funcional',
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
                        type: "text",
                        fieldKey: "AF_Nombre",
                        value: data.AF_Nombre,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                AF_Nombre: e.target.value,
                            }),
                    },
                    {
                        label: "Clave",
                        input: true,
                        type: "text",
                        fieldKey: "AF_Clave",
                        value: data.AF_Clave,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                AF_Clave: e.target.value,
                            }),
                    },
                    // {
                    //     label: "Empresas",
                    //     input: false,
                    //     select: true,
                    //     options: empresas,
                    //     value: data.AF_idCC,
                    //     fieldKey: 'AF_idCC',
                    //     onChangeFunc: (newValue) =>
                    //         setData({
                    //             ...data,
                    //             AF_idCC: newValue,
                    //         }),
                    //     data: "empresa_razonComercial",
                    //     valueKey: "empresa_idEmpresa",
                    // },
                ]}
                errors={errors}
            />
            {/* {(AreasFuncionales && empresas) &&
                <AreaFuncionalDialog
                    open={open}
                    setOpen={setOpen}
                    action={action}
                    data={data}
                    props={props}
                    errors={errors}
                    setData={setData}
                    empresas={empresas}
                    setEmpresas={setEmpresas}
                    handleCloseModal={handleCloseModal}
                    submit={submit}
                />
            } */}
        </div>
    );
}

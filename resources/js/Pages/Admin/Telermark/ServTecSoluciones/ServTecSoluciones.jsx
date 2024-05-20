import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import Imagen from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';

const servTecData = {
    idsoluciones: "",
    idproblema: "",
    descripcion: "",
}

const servTecValidations = {
    idproblema: "required",
    descripcion: "required",
}

const stecValidations = {
    descripcion: "required",
    tiemporespuesta: "required",
    tiempourgencia: "required",
}

export default function ServTecSoluciones() {
    const [action, setAction] = useState("create");
    const [data, setData] = useState(servTecData);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [open, setOpen] = useState(false);
    const [openProblemas, setOpenProblemas] = useState(false);

    const [ServTecSoluciones, setServTecSoluciones] = useState();
    const [problemaSeleccionado, setProblemaSeleccionado] = useState('');
    const [problemas, setProblemas] = useState({
        idproblema: "",
        descripcion: "",
        tiemporespuesta: "",
        tiempourgencia: "",
    });


    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getServTecnicoSoluciones = async () => {
        const responseE = await fetch(route("serv-tec-soluciones.index"));
        const dataE = await responseE.json();

        setServTecSoluciones(dataE);
    };

    const getProblemas = async () => {
        const responseA = await fetch(route("stecnico.index"));
        const dataA = await responseA.json();
        setProblemas(dataA);
    };

    const getproblemasBysoluciones = async () => {
        const response = await fetch(route("problemas-por-soluciones", problemaSeleccionado));
        const data = await response.json();
        setServTecSoluciones(data);
    }

    // useEffect(() => {
    //     getproblemasBysoluciones()
    // }, [problemaSeleccionado])

    useEffect(() => {
        if (problemaSeleccionado) {
            getproblemasBysoluciones()
        }
    }, [problemaSeleccionado]);

    useEffect(() => {
        if (!ServTecSoluciones) {
            getServTecnicoSoluciones()
            getMenuName();
            getProblemas();
        } else {
            setLoading(false)
        }
    }, [ServTecSoluciones])


    const submitProblemas = async (e) => {
        e.preventDefault();
        const result = validateInputs(stecValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("stecnico.store") : route("stecnico.update", data.idproblema);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getProblemas();
            handleModal();
        });
    };

    const submit2 = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(servTecValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("serv-tec-soluciones.store") : route("serv-tec-soluciones.update", data.idsoluciones);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getServTecnicoSoluciones();
            handleModal();
        });
    };
    const handleModal = () => {
        setOpen(false);
        setOpenProblemas(false);
        setErrors({});
    };

    const handleClick = (eprops) => {
        const problemaId = eprops.item.idproblema;
        if (problemaSeleccionado === problemaId) {
            setProblemaSeleccionado('');
        } else {
            setProblemaSeleccionado(problemaId);
        }
    };


    return (
        <div className="relative h-[100%] overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            <div className="overflow-hidden px-3 pb-4 bg-white-50 gap-6 sm:grid sm:grid-cols-2">
                <div className=" text-center ltr:sm:text-left rtl:sm:text-right">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        Servicio Técnico
                    </h2>
                    {problemas && (
                        <div className='sm:h-[97%] md:h-[90%]'>
                            <Datatable
                                data={problemas}
                                add={() => {
                                    setAction("create");
                                    setData(problemas);
                                    setOpenProblemas(!openProblemas);
                                }}
                                columns={[
                                    {
                                        header: "Problema", accessor: "descripcion",
                                        cell: eprops => (
                                            <button style={{ width: "100%" }} onClick={() => handleClick(eprops)}>
                                                {eprops.item.descripcion}
                                            </button>
                                        ),
                                    },
                                    {
                                        header: "Tiempo Respuesta", accessor: "tiemporespuesta",
                                        cell: eprops => (
                                            <button style={{ width: "100%" }} onClick={() => handleClick(eprops)}>
                                                {eprops.item.tiemporespuesta}
                                            </button>
                                        ),
                                    },
                                    {
                                        header: "Tiempo Urgencia", accessor: "tiempourgencia",
                                        cell: eprops => (
                                            <button style={{ width: "100%" }} onClick={() => handleClick(eprops)}>
                                                {eprops.item.tiempourgencia}
                                            </button>
                                        ),
                                    },
                                    {
                                        header: "Acciones",
                                        edit: (eprops) => {
                                            setAction("edit");
                                            setData({ ...eprops.item });
                                            setOpenProblemas(true);
                                        },
                                    },
                                ]}
                            />
                        </div>
                    )}
                </div>
                <div className="text-center ltr:sm:text-left rtl:sm:text-right">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        Servicio Técnico Soluciones
                    </h2>
                    {problemaSeleccionado !== '' ? (
                        <div className='sm:h-[97%] md:h-[90%]'>
                            <Datatable
                                data={ServTecSoluciones}
                                add={() => {
                                    setAction("create");
                                    setData(ServTecSoluciones);
                                    setOpen(!open);
                                }}
                                columns={[
                                    { header: 'Solución', accessor: 'descripcion' },
                                    {
                                        header: 'Acciones', cell: eprops => (
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
                                        ),
                                    }
                                ]}
                            />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={Imagen} alt="" style={{ textAlign: 'center', width: '60%', height: 'auto', marginTop: '100px', marginRight: '45px' }} className="h-56 w-full object-cover sm:h-full" />
                            </div>
                            <h2 style={{ fontSize: '21px', padding: '10px', marginLeft: '0%' }}>Seleccione una problema para ver la solución</h2>
                        </>
                    )}
                </div>
            </div>
            <DialogComp
                dialogProps={{
                    model: 'Servicio Técnico Soluciones',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => setOpen(!open),
                    onSubmitState: () => submit2
                }}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcion',
                        value: data.descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcion: e.target.value }) }
                    },
                    {
                        label: "Problemas",
                        options: problemas,
                        value: data.idproblema,
                        onChangeFunc: (newValue) => {
                            setData({
                                ...data,
                                idproblema: newValue
                            })
                        },
                        data: "descripcion",
                        valueKey: "idproblema",
                        fieldKey: "idproblema",
                        select: true,
                    },
                ]}
                errors={errors}
            />
            <DialogComp
                dialogProps={{
                    model: 'Servicio Técnico',
                    width: 'sm',
                    openState: openProblemas,
                    actionState: action,
                    openStateHandler: () => setOpenProblemas(!openProblemas),
                    onSubmitState: () => submitProblemas
                }}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcion',
                        value: data.descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcion: e.target.value }) }
                    },
                    {
                        label: "Tiempo respuesta",
                        input: true,
                        type: 'number',
                        fieldKey: 'tiemporespuesta',
                        value: data.tiemporespuesta || '',
                        onChangeFunc: (e) => { setData({ ...data, tiemporespuesta: e.target.value }) }
                    },
                    {
                        label: "Tiempo urgencia",
                        input: true,
                        type: 'number',
                        fieldKey: 'tiempourgencia',
                        value: data.tiempourgencia || '',
                        onChangeFunc: (e) => { setData({ ...data, tiempourgencia: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    )

}

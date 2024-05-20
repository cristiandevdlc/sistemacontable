import { useState, useEffect } from "react";
import Datatable from "@/components/Datatable"
import Imagen from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';
import DialogComp from '@/components/DialogComp'
import request, { fileDownloader, requestMultipart, validateInputs, } from "@/utils";
import { Tooltip } from "@mui/material";

const PuntosVerificacion = () => {
    const [openRecorrido, setOpenRecorrido] = useState(false);
    const [openPuntoRondin, setOpenPuntoRondin] = useState(false);
    const [errors, setErrors] = useState({})
    const [action, setAction] = useState('create')
    const [state, setState] = useState({ loading: false, puntoRondin: '', recorrido: '', puntoRecorrido: '' })
    const [data, setData] = useState({
        IdRecorrido: "",
        IdPuntoRondin: "",
        Id: 0,
        Nombre: "",
        Frecuencia: "",
        Hora_Comienzo: "",
        Numero_Repeticiones: "",
        NombrePuntoRondin: ""
    });
    const [notifications, setNotifications] = useState()
    const [rondinSeleccionado, setRondinSeleccionado] = useState()
    const [rondines, setRondines] = useState()
    const [RecorridoResponse, setRecorridoResponse] = useState()

    const getFetchData = async () => {
        const [RondinResponse, RecorridoResponse, PuntoRecorridoResponse] = await Promise.all([
            fetch(route("punto-rondin.index")).then(res => res.json()),
            fetch(route("recorridos.index")).then(res => res.json()),
            fetch(route("recorridos-puntos.index")).then(res => res.json()),
        ]);
        setRecorridoResponse(RecorridoResponse)
        return { RondinResponse, RecorridoResponse, PuntoRecorridoResponse };
    }

    const getRecorridosByPunto = async () => {

        const response = await fetch(route('rondin-recorrido'), { method: "POST", body: JSON.stringify({ id: rondinSeleccionado }), headers: { "Content-Type": "application/json" } });
        const data = await response.json();
        setRondines(data)
    }
    const sendRecorridoNotifications = async (paramId) => {
        const notifications = {
            id: paramId
        }
        const response = await fetch(route('rondin-recorrido'), { method: "POST", body: JSON.stringify({ id: notifications }), headers: { "Content-Type": "application/json" } });
        const data = await response.json();
        setNotifications(data)
    }
    const handleCloseModal = () => {
        setOpenRecorrido(false);
        setOpenPuntoRondin(false);
        setErrors({});
    };

    const submitRecorrido = async (e) => {
        e.preventDefault()
        setErrors({})

        const ruta = action === "create" ? route("recorridos.store") : route("recorridos.update", data.Id);
        const method = "POST";
        const formData = new FormData();
        for (const key in data) formData.append(key, data[key]);
        if (action !== "create") formData.append('_method', 'PUT')
        await requestMultipart(ruta, method, formData).then(() => {
            getFetchData();
            handleCloseModal();
            setErrors({})

        })
    };

    const submitPuntoRondin = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        formData.append('IdRecorrido', rondinSeleccionado);

        const ruta = action === "create" ? route("recorridos-puntos.store") : route("recorridos-puntos.update", data.IdPuntoRondin);
        const method = "POST";

        if (action !== "create") {
            formData.append('_method', 'PUT');
        }
        await requestMultipart(ruta, method, formData).then(() => {
            getRecorridosByPunto();
            handleCloseModal();
            setErrors({});

        });
    };

    useEffect(() => {
        getRecorridosByPunto()
    }, [rondinSeleccionado])

    useEffect(() => {
        getFetchData()
            .then((res) => {
                setState({
                    ...state,
                    puntoRondin: res.RondinResponse,
                    recorrido: res.RecorridoResponse,
                    puntoRecorrido: res.PuntoRecorridoResponse,
                    loading: false
                });
            });
    }, []);


    const handleClick = (eprops) => {
        const rondinId = eprops.item.Id;
        if (rondinSeleccionado === rondinId) {
            setRondinSeleccionado('');
        } else {
            setRondinSeleccionado(rondinId);
        }
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />}
            <div className="overflow-hidden bg-white-50 sm:grid sm:grid-cols-2 -mt-[20px]">
                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className=" text-center ltr:sm:text-left rtl:sm:text-right">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Recorridos
                        </h2>
                        {RecorridoResponse && (
                            <div className='sm:h-[97%] md:h-[90%]'>
                                <Datatable
                                    add={() => {
                                        setAction('create')
                                        setData(RecorridoResponse)
                                        setOpenRecorrido(!openRecorrido)
                                    }}
                                    data={RecorridoResponse}
                                    columns={[
                                        {
                                            header: 'Recorrido', accessor: 'Nombre', cell: eprops =>
                                            (
                                                <button style={{ width: "100%" }} onClick={() => handleClick(eprops)}>
                                                    {eprops.item.Nombre}
                                                </button>
                                            )
                                        },
                                        {
                                            header: 'Repeticiones', accessor: 'Numero_Repeticiones', cell: eprops =>
                                            (
                                                <button style={{ width: "100%", }} onClick={() => handleClick(eprops)}>
                                                    {eprops.item.Numero_Repeticiones}
                                                </button>
                                            )
                                        },
                                        {
                                            header: 'Hora de Comienzo', accessor: 'Hora_Comienzo', cell: eprops =>
                                            (
                                                <button style={{ width: "100%", }} onClick={() => handleClick(eprops)}>
                                                    {(new Date(eprops.item.Hora_Comienzo)).formatMX()}
                                                </button>
                                            )
                                        },
                                        {
                                            header: 'Frecuencia', accessor: 'Frecuencia', cell: eprops =>
                                            (
                                                <button style={{ width: "100%", }} onClick={() => handleClick(eprops)}>
                                                    {eprops.item.Frecuencia}
                                                </button>
                                            )
                                        },
                                        {
                                            header: "Acciones",
                                            cell: (eprops) => (
                                                <div>
                                                    <Tooltip title="Editar">
                                                        <button onClick={() => { setAction('edit'); setOpenRecorrido(!openRecorrido); setData(eprops.item) }} className="material-icons ">edit</button>
                                                    </Tooltip>


                                                </div>
                                            ),
                                        },

                                        // {
                                        //     header: "Acciones",
                                        //     cell: (eprops) => (
                                        //         <>
                                        //             <button
                                        //                 className="material-icons"
                                        //                 onClick={() => {
                                        //                     setAction('edit')
                                        //                     setData({...eprops.item})
                                        //                     setOpenRecorrido(!openRecorrido)
                                        //                 }}
                                        //             >
                                        //                 edit
                                        //             </button>
                                        //         </>
                                        //     ),
                                        // },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Punto Rondin
                        </h2>
                        <div className="mt-4 md:mt-8">
                            {rondinSeleccionado && rondines ? (
                                <div className='sm:h-[97%] md:h-[90%]'>
                                    <Datatable
                                        add={() => {
                                            setAction('create')
                                            setData(rondines)
                                            handleCloseModal()
                                            setOpenPuntoRondin(!openPuntoRondin);
                                        }}
    
                                        data={rondines}
                                        columns={[
                                            { header: 'Nombre', accessor: 'Nombre', cell: eprops => eprops.item.punto_rondin.Nombre },
                                            {
                                                header: "Acciones",
                                                edit: (eprops) => {
                                                    setAction('edit')
                                                    setData(eprops.item, console.log('eprops.item', eprops.item.punto_rondin.Nombre))
                                                    setOpenPuntoRondin(!openPuntoRondin);
                                                },
                                            }
                                        ]}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={Imagen} alt="" style={{ textAlign: 'center', width: '60%', height: 'auto', marginTop: '100px', marginRight: '45px' }} className="h-56 w-full object-cover sm:h-full" />
                                    </div>
                                    <h2 style={{ fontSize: '21px', padding: '10px', marginLeft: '0%' }}>Seleccione un recorrido</h2>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DialogComp
                dialogProps={{
                    model: 'Recorrido',
                    width: 'sm',
                    openState: openRecorrido,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submitRecorrido
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
                        label: "Frecuencia/Minutos",
                        input: true,
                        type: "text",
                        name: "Frecuencia",
                        value: data.Frecuencia,
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
                        value: data.Hora_Comienzo,
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
                        value: data.Numero_Repeticiones,
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
            <DialogComp
                dialogProps={{
                    model: 'Punto Rondin',
                    width: 'sm',
                    openState: openPuntoRondin,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submitPuntoRondin
                }}
                fields={[
                    // {
                    //     label: "Nombre Punto Rondin",
                    //     input: true,
                    //     type: 'text',
                    //     fieldKey: 'Nombre',
                    //     value: data.Nombre,
                    //     onChangeFunc: (e) => {
                    //         setData({ ...data, Nombre: e.target.value });
                    //     }
                    // },
                    {
                        label: "Nombre Punto Rondin",
                        select: true,
                        options: state.puntoRondin,
                        valueKey: "Id",
                        data: "Nombre",
                        value: data.IdPuntoRondin,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                IdPuntoRondin: e,
                            }),
                    },
                ]}
            />
        </div>
    );
}

export default PuntosVerificacion;
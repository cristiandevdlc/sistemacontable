import Datatable from "@/components/Datatable"
import DialogComp from "@/components/DialogComp"
import { Chip } from "@mui/material"
import { useState, useEffect } from "react"
import proveedorData, { proveedorValidations } from "./IntProveedor";
import almacenData, { almacenValidations } from "./IntAlmacen";
import request, { fileDownloader, requestMultipart, validateInputs, } from "@/utils";
import Imagen from '../../Admin/Telermark/ClientesPedidos/img/camion.png';
import LoadingDiv from "@/components/LoadingDiv";
import SelectComp from "@/components/SelectComp";

const AsignarArticulos = () => {
    const [action, setAction] = useState('create')
    const [state, setState] = useState({ loading: false, proveedorArticulos: null, Articulos: null, open: false, open2: false, usuarioAlmacen: null })
    const [provArticuloResponse, setProvArticuloResponse] = useState()
    const [almArticuloResponse, SetAlmArticuloResponse] = useState()
    const [errors, setErrors] = useState({})
    const [data, setData] = useState(proveedorData, almacenData)
    const [articuloSeleccionado, setArticuloSeleccionado] = useState()
    const [almacenSelected, setalmacenSelected] = useState()
    const [articulo, setArticulo] = useState()

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getFetchData = async () => {
        const [articulosResponse, almacenResponse, proveedorResponse,] = await Promise.all([
            fetch(route("articulos.index")).then(res => res.json()),
            fetch(route("almacen-usuario")).then(res => res.json()),
            fetch(route("proveedor.index")).then(res => res.json()),
        ]);
        return { articulosResponse, almacenResponse, proveedorResponse };
    }

    const getAlmArticulo = async () => {
        const response = await fetch(route("almacen-articulo.index"));
        const data = await response.json();
        SetAlmArticuloResponse(data);
    };

    const getProvArticulo = async () => {
        const response = await fetch(route("proveedor-articulo.index"));
        const data = await response.json();
        setProvArticuloResponse(data);
    };

    const getArticulosProveedores = async () => {
        const response = await fetch(route('proveedor-por-articulo', { id: articuloSeleccionado, idArticulo: articulo }), { method: "POST", body: JSON.stringify({ id: articuloSeleccionado, idArticulo: articulo }), headers: { "Content-Type": "application/json" } });
        const data = await response.json();
        setProvArticuloResponse(data);
    }
    const artitulosXalmacenId = async () => {
        const response = await request(route("arqueo-inv"), 'POST', { almacen_id: almacenSelected }, { enabled: true });
        setState(response);
        return { response }
    };

    const submitProveedor = async (e) => {
        e.preventDefault();
        setErrors({});
        const result = validateInputs(proveedorValidations, data);

        if (!result.isValid) {
            console.log(result);
            setErrors(result.errors);
            return;
        }
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        formData.append('proveedorArticulo_idAlmacenArticulo', articuloSeleccionado);
        formData.append('proveedorArticulo_idArticulo', articulo);
        const ruta = action === "create" ? route("proveedor-articulo.store") : route("proveedor-articulo.update", data.proveedorArticulo_id);
        const method = "POST";

        if (action !== "create") {
            formData.append('_method', 'PUT');
        }
        await requestMultipart(ruta, method, formData).then(() => {

            getArticulosProveedores()
            handleCloseModal();
            setErrors({});
            setState({ ...state, open: !state.open });
        });
    };

    const submitAlmacen = async (e) => {
        e.preventDefault()
        setErrors({})
        const result = validateInputs(almacenValidations, data)
        if (!result.isValid) {
            console.log(result)
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("almacen-articulo.store") : route("almacen-articulo.update", data.almacenArticulo_id);
        const method = "POST";
        const formData = new FormData();
        for (const key in data) formData.append(key, data[key]);
        if (action !== "create") formData.append('_method', 'PUT')
        await requestMultipart(ruta, method, formData).then(() => {
            getAlmArticulo()
            handleCloseModal()
            setErrors({})
            setState({ ...state, open2: !state.open2 });
        })
    };

    const handleCloseModal = () => {
        setState({ ...state, open: !state.open });
        setData(proveedorData);
    };
    const handleCloseModal2 = () => {
        setState({ ...state, open2: !state.open2 });
        setData(almacenData);
    };

    useEffect(() => {
        if (almacenSelected) {
            artitulosXalmacenId()
        }
    }, [almacenSelected]);

    useEffect(() => {
        getFetchData()
        getMenuName()
            .then((res) => {
                setState({
                    ...state,
                    proveedorArticulos: res.proveedorResponse,
                    usuarioAlmacen: res.almacenResponse,
                    Articulos: res.articulosResponse,
                    loading: false
                });
                // console.log('almacenResponse', almacenResponse)
            });
    }, []);

    useEffect(() => {
        getAlmArticulo()
        getProvArticulo()
    }, [])

    useEffect(() => {
        getArticulosProveedores()
    }, [articuloSeleccionado])


    const handleArticuloClick = (eprops) => {
        const articuloId = eprops.item.almacenArticulo_id;
        if (articuloSeleccionado === articuloId) {
            setArticuloSeleccionado('');
            setArticulo('')
        } else {
            setArticuloSeleccionado(articuloId);
        }
        const almacenArticulo = eprops.item.almacenArticulo_idArticulo;
        if (articulo === almacenArticulo) {
            setArticulo('')
        }
        else {
            setArticulo(almacenArticulo);
        }
    };



    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            <div className="lg:grid lg:grid-cols-2">
                <div className="">
                    {almArticuloResponse && (
                        <div className="mx-auto max-w-xl">
                            <h1 className="mt-4 text-lg font-medium text-gray-900 text-center">Almácen de Artículos</h1>
                            <Datatable
                                add={() => {
                                    setAction('create')
                                    setData(almArticuloResponse)
                                    handleCloseModal2()
                                }}
                                data={almArticuloResponse}
                                columns={[
                                    {
                                        header: 'Almacen', accessor: 'almacen_nombre', cell: eprops => (
                                            <button style={{ width: "125%" }} onClick={() => handleArticuloClick(eprops)}>
                                                {eprops.item.almacen.almacen_nombre}
                                            </button>
                                        ),
                                    },
                                    {
                                        header: 'Articulo', accessor: 'articulo_nombre',
                                        cell: eprops => (
                                            <button style={{ width: "125%" }} onClick={() => handleArticuloClick(eprops)}>
                                                {eprops.item.articulo.articulo_nombre}
                                            </button>
                                        ),
                                    },
                                    {
                                        header: 'Precio Venta', accessor: 'almacenArticulo_precioventa', cell: eprops => (
                                            <button style={{ width: "125%" }} onClick={() => handleArticuloClick(eprops)}>
                                                ${Math.round(eprops.item.almacenArticulo_precioventa).toFixed(2)}
                                            </button>
                                        )

                                    },
                                    {
                                        header: 'Existencia', accessor: 'almacenArticulo_existencia', cell: eprops => (
                                            <button style={{ width: "125%" }} onClick={() => handleArticuloClick(eprops)}>
                                                {Math.round(eprops.item.almacenArticulo_existencia).toFixed(0)}
                                            </button>
                                        )
                                    },
                                    {
                                        header: "Acciones",
                                        edit: (eprops) => {
                                            setAction('edit')
                                            setData(eprops.item)
                                            setState({ ...state, open2: true })
                                        },
                                    }
                                ]}
                            />

                        </div>
                    )}
                </div>
                <div className="">
                    {articuloSeleccionado && provArticuloResponse ? (
                        <div className="mx-auto max-w-xl">
                            <h1 className="mt-4 text-lg font-medium text-gray-900 text-center">Proveedor de Artículos</h1>
                            <Datatable
                                add={() => {
                                    setAction('create')
                                    setData(proveedorData)
                                    handleCloseModal()
                                }}
                                data={provArticuloResponse}
                                columns={[
                                    { header: 'Proveedor', accessor: 'proveedor_nombrecomercial', cell: eprops => eprops.item.proveedor.proveedor_nombrecomercial },
                                    { header: 'Costo', accessor: 'proveedorArticulo_costo', cell: eprops => `$${Math.round(eprops.item.proveedorArticulo_costo).toFixed(2)}` },
                                    { header: 'Estatus', accessor: 'proveedorArticulo_estatus', cell: eprops => eprops.item.proveedorArticulo_estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />) },
                                    {
                                        header: "Acciones",
                                        edit: (eprops) => {
                                            setAction('edit')
                                            setData(eprops.item)
                                            setState({ ...state, open: true })
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
                            <h2 style={{ fontSize: '21px', padding: '10px', marginLeft: '0%' }}>Seleccione un articulo para ver sus proveedores</h2>
                        </>
                    )}
                </div>

                <DialogComp
                    dialogProps={{
                        model: 'Proveedor Articulos',
                        width: 'sm',
                        openState: state.open,
                        style: 'grid grid-cols-1 gap-4',
                        actionState: action,
                        openStateHandler: () => handleCloseModal(),
                        onSubmitState: () => submitProveedor
                    }}
                    fields={[

                        {
                            label: "Proveedor",
                            input: false,
                            select: true,
                            options: state.proveedorArticulos,
                            value: data.proveedorArticulo_idProveedor,
                            onChangeFunc: (newValue) =>
                                setData({ ...data, proveedorArticulo_idProveedor: newValue }),
                            data: "proveedor_razonsocial",
                            valueKey: "proveedor_id",
                        },
                        {
                            label: "Costo",
                            input: true,
                            type: 'text',
                            fieldKey: 'proveedorArticulo_costo',
                            value: data.proveedorArticulo_costo || '',
                            onChangeFunc: (e) => {
                                setData({ ...data, proveedorArticulo_costo: e.target.value });
                            }
                        },
                        {
                            label: "Activo",
                            check: true,
                            fieldKey: 'estatus',
                            checked: data.proveedorArticulo_estatus,
                            labelPlacement: 'end',
                            style: 'justify-center mt-5',
                            onChangeFunc: (e) => setData({
                                ...data,
                                proveedorArticulo_estatus: e.target.checked ? "1" : "0",
                            }),
                        },
                    ]}

                />

                <DialogComp
                    dialogProps={{
                        model: 'Almácen Articulos',
                        width: 'sm',
                        openState: state.open2,
                        style: 'grid grid-cols-1 gap-4',
                        actionState: action,
                        openStateHandler: () => handleCloseModal2(),
                        onSubmitState: () => submitAlmacen
                    }}
                    fields={[

                        {
                            label: "Almacen",
                            input: false,
                            select: true,
                            options: [state.usuarioAlmacen],
                            value: data.almacenArticulo_idAlmacen,
                            onChangeFunc: (newValue) =>
                                setData({
                                    ...data,
                                    almacenArticulo_idAlmacen: newValue,
                                }),
                            data: "almacen_nombre",
                            valueKey: "almacen_id",
                        },
                        {
                            label: "Articulos",
                            input: false,
                            select: true,
                            options: state.Articulos,
                            value: data.almacenArticulo_idArticulo,
                            onChangeFunc: async (newValue) => {
                                setData({
                                    ...data,
                                    almacenArticulo_idArticulo: newValue,
                                });
                            },
                            data: "articulo_nombre",
                            valueKey: "articulo_id",
                        },

                        {
                            label: "Precio Venta",
                            input: true,
                            type: 'text',
                            fieldKey: 'almacenArticulo_precioventa',
                            value: data.almacenArticulo_precioventa || '',
                            onChangeFunc: (e) => { setData({ ...data, almacenArticulo_precioventa: e.target.value }) }
                        },
                        {
                            label: "Articulo Existencia",
                            input: true,
                            type: 'text',
                            disabled: action ? 'create' : 'edit',
                            fieldKey: 'almacenArticulo_existencia',
                            value: data.almacenArticulo_existencia || '',
                            onChangeFunc: (e) => { setData({ ...data, almacenArticulo_existencia: e.target.value }) }
                        },

                    ]}
                    errors={errors}
                />


            </div>
        </div>
    )
}

export default AsignarArticulos

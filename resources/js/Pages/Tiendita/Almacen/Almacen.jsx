import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import DialogComp from '@/components/DialogComp';
import request, { validateInputs } from "@/utils";
import { Chip, Tooltip } from '@mui/material';
import LoadingDiv from '@/components/LoadingDiv';

const Almacen = () => {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [openAjuste, setOpenAjuste] = useState()
    const [state, setState] = useState({ loading: true, open: false, inicio: null, almacen: null, articulo: null, motivo: null, cantidad: null });
    const [filters, setFilters] = useState({ idArticulo: 0, idAlmacen: null })
    const { data, setData } = useForm({ almacen_id: null, almacen_nombre: null, almacen_idempresa: null, almacen_estatus: null, almacen_mercancia: null, AjusteInventario_id: '', AjusteInventario_cantidadAjustada: null, AjusteInvantario_motivo: null })
    const [empresaResponse, setEmpresaResponse] = useState([]);
    const [almacenResponse, setAlmacenResponse] = useState([]);
    const [almacenSelected, setAlmacenSelected] = useState('')
    const [articulosResponse, setArticulosResponse] = useState('');
    const [selectedArticuloDetails, setSelectedArticuloDetails] = useState('');


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
        const [empresaResponse, almacenResponse] = await Promise.all([
            fetch(route("empresas.index")).then(res => res.json()),
            fetch(route("almacen.index")).then(res => res.json()),
        ]);
        setAlmacenResponse(almacenResponse);
        setEmpresaResponse(empresaResponse);
        return { empresaResponse, almacenResponse };
    }

    const artitulosXalmacenId = async () => {
        const response = await request(route("ajuste-inventarios"), 'POST', { almacen_id: almacenSelected }, { enabled: true });
        setArticulosResponse(response);
        return { response }
    };
    const handleAlmacenSelection = (almacenId) => {
        setAlmacenSelected(almacenId);
    };

    const AlmacenValidaciones = {
        almacen_nombre: "required",
        // almacen_idempresa: "required",
        almacen_mercancia: "required",
        productoEstatus: "boolean",
    }

    const submit = async (e) => {
        const result = validateInputs(AlmacenValidaciones, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        e.preventDefault();
        const ruta = action === "create" ? route("almacen.store", 'POST', { enabled: true, success: { type: 'success', message: "Registrado en Almacén Correctamente" } }) : route("almacen.update", data.almacen_id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getFetchData();
            setState({ ...state, open: !state.open, openAjusteInv: !state.openAjusteInv });
        });
    };
    
    const submitAjusteInv = async (e) => {
        e.preventDefault();
        if (!selectedArticuloDetails) {
            console.error("Debes seleccionar un artículo antes de enviar el formulario.");
            return;
        }
        const requestData = {
            AjusteInventario_idArticuloAlmacen: almacenSelected,
            AjusteInventario_cantidadAjustada: state.cantidad,
            AjusteInventario_cantidadActual: selectedArticuloDetails.almacenArticulo_existencia,
            AjusteInvantario_motivo: state.motivo
        };

        const ruta = action === "create" ? route("ajustes.store") : route("ajustes.update", data.AjusteInventario_id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, requestData).then(() => {
            getFetchData();
        });

        setState({
            ...state,
            almacen: '',
            articulo: '',
            motivo: '',
            cantidad: '',
        });
    };

    const handleCloseModal = () => {
        setState({ ...state, open: false, action: '' });
        setOpenAjuste(false)
        setArticulosResponse('')
        setAlmacenSelected('')
        setData({ almacen_id: null, almacen_nombre: null, almacen_idempresa: null, almacen_estatus: null, almacen_mercancia: null })
    }
    useEffect(() => {
        getMenuName();
        getFetchData()
            .then((res) => {
                setData(res.almacenResponse);
                setState({
                    ...state,
                    loading: false,
                    almacen: res.almacenResponse,
                });
            });
    }, []);

    useEffect(() => {
        if (almacenSelected !== '') {
            artitulosXalmacenId()
        }
    }, [almacenSelected]);

    useEffect(() => {
        if (articulosResponse !== '') {
            console.log(articulosResponse)
            setOpenAjuste(true)
        }
    }, [articulosResponse]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            {almacenResponse && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(almacenResponse)
                            handleCloseModal()
                        }}
                        data={almacenResponse}
                        columns={[
                            { header: 'Almacén', accessor: 'almacen_nombre' },
                            { header: 'Empresa', accessor: 'almacen_idempresa', cell: eprops => eprops.item.empresa.empresa_razonComercial },
                            { header: 'Activo', accessor: 'almacen_estatus', cell: eprops => eprops.item.almacen_estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />) },
                            { header: 'Mercancía', accessor: 'almacen_mercancia', cell: eprops => `$${Math.round(eprops.item.almacen_mercancia).toFixed(2)}` },
                            {
                                header: "Acciones",
                                cell: (eprops) => (
                                    <div>
                                        <Tooltip title="Editar">
                                            <button onClick={() => { setAction("edit"); setState({ ...state, open: true }); setData(eprops.item) }} className="material-icons ">edit</button>
                                        </Tooltip>
                                        <span style={{ margin: '0 8px' }}></span>
                                        {/* <Tooltip title="Ajuste Inventarios">
                                            <button onClick={() => { setAlmacenSelected(eprops.item.almacen_id) }} className="material-icons">settings</button>
                                        </Tooltip> */}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            )}
            {articulosResponse !== '' &&
                <DialogComp
                    dialogProps={{
                        model: 'Ajuste de inventarios',
                        width: 'sm',
                        openState: openAjuste,
                        style: 'grid grid-cols-1 gap-4',
                        actionState: action,
                        openStateHandler: () => handleCloseModal(),
                        onSubmitState: () => submitAjusteInv
                    }}
                    fields={[
                        {
                            label: "Almacén",
                            input: false,
                            select: true,
                            options: state.almacen,
                            value: filters.idAlmacen,
                            onChangeFunc: (newValue) => {
                                setFilters({ ...filters, idAlmacen: newValue }),
                                    handleAlmacenSelection(newValue);
                            },
                            data: "almacen_nombre",
                            valueKey: "almacen_id",
                        },
                        {
                            label: "Articulos",
                            input: false,
                            select: true,
                            options: articulosResponse,
                            // value: filters.idArticulo,
                            onChangeFunc: (newValue) => {
                                console.log(newValue)
                                // setFilters({ ...filters, idArticulo: newValue });
                                // const selectedArticulo = articulosResponse.find((item) => item.almacenArticulo_id === newValue);
                                // setSelectedArticuloDetails(selectedArticulo);
                            },
                            // value: ,
                            data: "articulo_nombre",
                            valueKey: "articulo_id",
                        },
                        {
                            label: "Cantidad",
                            input: true,
                            type: 'text',
                            maxLength: "30",
                            fieldKey: 'cantidad',
                            value: state.cantidad || '',
                            onChangeFunc: (e) => { setData({ ...state, cantidad: e.target.value }) }
                        },
                    ]}
                    errors={errors}
                />
            }
            <DialogComp
                dialogProps={{
                    model: 'Almacén',
                    width: 'sm',
                    openState: state.open,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: 'text',
                        fieldKey: 'almacen_nombre',
                        value: data.almacen_nombre || '',
                        onChangeFunc: (e) => { setData({ ...data, almacen_nombre: e.target.value }) }
                    },
                    // {
                    //     label: "Empresa",
                    //     input: false,
                    //     select: true,
                    //     options: empresaResponse,
                    //     value: data.almacen_idempresa,
                    //     onChangeFunc: (newValue) =>
                    //         setData({
                    //             ...data,
                    //             almacen_idempresa: newValue,
                    //         }),
                    //     data: "empresa_razonComercial",
                    //     valueKey: "empresa_idEmpresa",
                    // },
                    {
                        label: "Almacen Mercancía",
                        input: true,
                        Number: true,
                        type: 'text',
                        fieldKey: 'almacen_mercancia',
                        value: data.almacen_mercancia || '',
                        onChangeFunc: (e) => { setData({ ...data, almacen_mercancia: e.target.value }) }
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.almacen_estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            almacen_estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}
export default Almacen
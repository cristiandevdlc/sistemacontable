import Datatable from '@/components/Datatable';
import { useState, useEffect, useRef } from "react";
import { useForm } from '@inertiajs/react';
import FormData from 'form-data'
import DialogComp from '@/components/DialogComp';
import { Button, Chip } from "@mui/material";
import request, { fileDownloader, requestMultipart, validateInputs } from "@/utils";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ImageIcon from '@mui/icons-material/Image';
import LoadingDiv from '@/components/LoadingDiv';

const Articulos = () => {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [imagen, setImage] = useState('')
    const [state, setState] = useState({ loading: true, open: false, check: false });
    const { data, setData } = useForm({ articulo_id: null, articulo_nombre: '', articulo_precioventa: null, articulo_almacen: null, articulo_estatus: false, articulo_existencia: null, articulo_imagen: null, articulo_codigo: null })
    const btnImageR = useRef()
    const [articulosResponse, setArticulosResponse] = useState([]);
    const [almacenResponse, setAlmacenResponse] = useState([]);
    const [almacenSelected, setalmacenSelected] = useState()

    const getFetchData = async () => {
        const [articulosResponse, almacenResponse] = await Promise.all([
            fetch(route("articulos.index")).then(res => res.json()),
            fetch(route("almacen.index")).then(res => res.json()),
        ]);
        setAlmacenResponse(almacenResponse);
        setArticulosResponse(articulosResponse);
        return { articulosResponse, almacenResponse };
    }

    const articulosValidaciones = {
        articulo_nombre: "required",
        articulo_precioventa: "required",
        articulo_almacen: "required",
        articulo_estatus: "boolean",
        articulo_existencia: "required",
        articulo_imagen: "required",
        articulo_codigo: ""
    }

    const submit = async (e) => {
        const result = validateInputs(articulosValidaciones, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        e.preventDefault();

        const ruta = action === "create" ? route("articulos.store") : route("articulos.update", data.articulo_id);
        const method = "POST";
        const formData = new FormData();
        for (const key in data) formData.append(key, data[key]);
        if (action !== "create") formData.append('_method', 'PUT')
        await requestMultipart(ruta, method, formData).then(() => {
            getFetchData();
            setState(!state.open);
        })
    };

    const imageHandler = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const imagenSeleccionada = file.name;
            setData({ ...data, articulo_imagen: file });
            setImage(imagenSeleccionada);
        };
        reader.readAsDataURL(file);
    };


    const handleCloseModal = () => {
        setState({ ...state, open: !state.open, action: '' });
        setData({ articulo_id: null, articulo_nombre: '', articulo_precioventa: 0, articulo_almacen: 0, articulo_estatus: false, articulo_existencia: 0, articulo_imagen: '', articulo_codigo: '' });
        updateImageName(null);
    };

    const updateImageName = (file) => {
        const imagenSeleccionada = file ? file.name : '';
        setImage(imagenSeleccionada);
    };
    const handleAlmacenSelection = (almacenId) => {
        setalmacenSelected(almacenId);
    };
    const artitulosXalmacenId = async () => {
        const response = await request(route("arqueo-inv"), 'POST', { almacen_id: almacenSelected }, { enabled: false, error: { message: 'No hay artículos en el almácen', type: 'error' }, success: { message: "artículos encontrados", type: 'success' } });
        setArticulosResponse(response);
        return { response }
    };

    useEffect(() => {
        if (almacenSelected) {
            artitulosXalmacenId()
        }
    }, [almacenSelected]);


    useEffect(() => {
        getFetchData()
            .then((res) => {
                setData(res.articulosResponse);
                setState({ ...state, loading: false });
            });
    }, []);

    return (
        <>
            {state.loading &&
                <LoadingDiv />
            }

            {/* {articulosResponse && (
                <Datatable
                    add={() => {
                        setAction('create')
                        setData(articulosResponse)
                        handleCloseModal()
                    }}
                    data={articulosResponse}
                    columns={[
                        { header: 'Articulo', accessor: 'articulo_nombre' },
                        { header: 'Precio Venta', accessor: 'articulo_precioventa', cell: eprops => `$${Math.round(eprops.item.articulo_precioventa).toFixed(2)}` },
                        { header: 'Almacén', accessor: 'articulo_almacen', cell: eprops => eprops.item.almacen.almacen_nombre },
                        { header: 'Estatus', accessor: 'articulo_estatus', cell: eprops => eprops.item.articulo_estatus === '1' ? (<Chip label='Disponible' color='success' size='small' />) : (<Chip label='No disponible' color='error' size='small' />) },
                        { header: 'Existencia', accessor: 'articulo_existencia', cell: eprops => `${eprops.item.articulo_existencia} pzas` },
                        { header: 'Código de barras', accessor: 'articulo_codigo', cell: eprops => `${eprops.item.articulo_codigo}` },
                        {
                            header: "Acciones", edit: (eprops) => {
                                setAction('edit')
                                setData(eprops.item)
                                setState({ ...state, open: true })
                            },
                        }
                    ]}
                />
            )} */}
                        <section >
                <div className="p-8 md:p-5 lg:px-16 lg:py-10">
                    <div className="grid grid-cols-3 gap-4">
                        <SelectComp
                            label="Almácen"
                            options={almacenResponse}
                            value={state.almacen}
                            data="almacen_nombre"
                            valueKey="almacen_id"
                            onChangeFunc={(value) => {
                                setState({ ...state, almacen: value });
                                handleAlmacenSelection(value);
                            }}
                        ></SelectComp>

                        {almacenSelected ? (
                            <>
                                <button
                                    onClick={() => {
                                        getFetchData().then((ventasData) => {
                                            setDownloadPDFEnabled(true);
                                            setGeneratingPDF(true);
                                            artitulosXalmacenId().then((pdfData) => {
                                                setReportePDF(pdfData.response);
                                                setGeneratingPDF(false);
                                            });
                                        });
                                    }}
                                >
                                    <Tooltip title="Generar PDF">
                                        <span style={{ fontSize: '20px', color: '#093F8D', marginTop: "10px" }} className="material-icons">
                                            <AutoModeIcon style={{ fontSize: '45px' }} />
                                            <span> generar pdf...</span>
                                        </span>
                                    </Tooltip>
                                </button>
                            </>
                        ) : null}

                        {reportePDF ? (
                            <button className="mt-2 mr-[100px]" onClick={() => {
                                artitulosXalmacenId().then(res => {
                                    setReportePDF(res.response);
                                    setReportePDF(false);
                                });
                            }}>
                                <PDFDownloadLink document={<ReporteArqueoPDF data={reportePDF} almacenSelected={almacenSelected} />} fileName='reporte-arqueo.pdf'>
                                    {({ blob, url, loading, error }) =>
                                        loading ? '' : (
                                            <Tooltip title="Descargar PDF">
                                                <span style={{ color: '#29C97B' }}>
                                                    <DownloadingIcon style={{ fontSize: '50px' }} />
                                                </span>
                                            </Tooltip>
                                        )
                                    }
                                </PDFDownloadLink>
                            </button>
                        ) : null}
                    </div>

                    {almacenSelected && articulosResponse ? (
                        <Datatable
                            add={() => {
                                setAction('create')
                                setData(articulosResponse)
                                handleCloseModal()
                            }}
                            data={articulosResponse}
                            columns={[
                                { header: 'Articulo', accessor: 'articulo_nombre' },
                                { header: 'Precio Venta', accessor: 'articulo_precioventa', cell: eprops => `$${Math.round(eprops.item.articulo_precioventa).toFixed(2)}` },
                                // { header: 'Almacén', accessor: 'articulo_almacen', cell: eprops => eprops.item.almacen.almacen_nombre },
                                { header: 'Estatus', accessor: 'articulo_estatus', cell: eprops => eprops.item.articulo_estatus === '1' ? (<Chip label='Disponible' color='success' size='small' />) : (<Chip label='No disponible' color='error' size='small' />) },
                                { header: 'Existencia', accessor: 'articulo_existencia', cell: eprops => `${eprops.item.articulo_existencia} pzas` },
                                { header: 'Código de barras', accessor: 'articulo_codigo', cell: eprops => `${eprops.item.articulo_codigo}` },
                                {
                                    header: "Acciones", edit: (eprops) => {
                                        setAction('edit')
                                        setData(eprops.item)
                                        setState({ ...state, open: true })
                                    },
                                }
                            ]}
                        />
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={Imagen} alt="" style={{ textAlign: 'center', width: '50%', height: 'auto' }} className="h-56 w-full object-cover sm:h-full" />
                            </div>
                            <h2 style={{ fontSize: '24px', padding: '10px', marginLeft: '20%' }}>Seleccione un almácen para ver sus productos.</h2>
                        </>
                    )}
                </div>
            </section>

            <DialogComp
                dialogProps={{
                    model: 'Artículos',
                    width: 'sm',
                    openState: state.open,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre Artículo",
                        input: true,
                        type: 'text',
                        maxLength: "30",
                        fieldKey: 'articulo_nombre',
                        value: data.articulo_nombre || '',
                        onChangeFunc: (e) => { setData({ ...data, articulo_nombre: e.target.value }) }
                    },
                    {
                        label: "Precio de Venta",
                        input: true,
                        type: 'text',
                        maxLength: "6",
                        fieldKey: 'articulo_precioventa',

                        value: data.articulo_precioventa || '',
                        onChangeFunc: (e) => { setData({ ...data, articulo_precioventa: e.target.value }) }
                    },
                    // {
                    //     label: "Almacén",
                    //     select: true,
                    //     options: almacenResponse,
                    //     value: data.articulo_almacen,
                    //     onChangeFunc: (newValue) =>
                    //         setData({
                    //             ...data,
                    //             articulo_almacen: newValue,
                    //         }),
                    //     data: "almacen_nombre",
                    //     valueKey: "almacen_id",
                    // },
                    {
                        label: "En existencia",
                        input: true,
                        type: 'text',
                        maxLength: "4",
                        fieldKey: 'articulo_existencia',
                        value: data.articulo_existencia || '',
                        onChangeFunc: (e) => { setData({ ...data, articulo_existencia: e.target.value }) }
                    },
                    {
                        label: "Código de barras",
                        input: true,
                        type: 'text',
                        maxLength: "13",
                        fieldKey: 'articulo_codigo',
                        value: data.articulo_codigo || '',
                        onChangeFunc: (e) => { setData({ ...data, articulo_codigo: e.target.value }) }
                    },
                    {
                        label: "Imagen Producto",
                        custom: true,
                        style: 'col-span-1 pt-2 pb-5 justify-center',
                        customItem: ({ label }) => (
                            <>
                                <input
                                    type="file"
                                    accept="image/.jpg,.png"
                                    onChange={(e) => {
                                        imageHandler(e);
                                    }}
                                    style={{ display: 'none' }}
                                    id="boton-imagen"
                                    ref={btnImageR}
                                />

                                <Button
                                    variant="contained"
                                    value={data.fotoProducto}
                                    className="buttonPrimary"
                                    startIcon={<ImageIcon />}
                                    onClick={() => {
                                        btnImageR.current.click();
                                        updateImageName(null);
                                    }}
                                    style={{ backgroundColor: '#1B2654', color: 'white', borderRadius: '10px', opacity: '100%' }}
                                >
                                    {label}
                                </Button>

                                {/* Aquí mostramos la descripción de la imagen seleccionada */}
                                <div className='mt-2'>{imagen ? ` ${imagen}` : ''}</div>
                            </>
                        ),
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'articulo_estatus',
                        checked: data.articulo_estatus,
                        labelPlacement: 'start',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            articulo_estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </>
    )
}
export default Articulos










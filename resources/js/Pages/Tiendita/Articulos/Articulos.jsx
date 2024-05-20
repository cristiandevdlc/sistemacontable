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
import SelectComp from '@/components/SelectComp';
import Tooltip from '@mui/material/Tooltip/Tooltip'
import AutoModeIcon from '@mui/icons-material/AutoMode';
import Imagen from '../../../../png/snacks/snacks.png';


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
    const [reportePDF, setReportePDF] = useState()


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
        const [ almacenResponse] = await Promise.all([
            // fetch(route("articulos.index")).then(res => res.json()),
            fetch(route("almacen.index")).then(res => res.json()),
        ]);
        setAlmacenResponse(almacenResponse);
        // setArticulosResponse(articulosResponse);
        return {  almacenResponse };
    }

    const getArticuloResponse = async () => {
        const response = await fetch(route("articulos.index"));
        const data = await response.json();
        setArticulosResponse(data);
      };

    const submit = async (e) => {
        const ruta = action === "create" ? route("articulos.store") : route("articulos.update", data.articulo_id);
        const method = "POST";
        const formData = new FormData();
        for (const key in data) formData.append(key, data[key]);
        if (action !== "create") formData.append('_method', 'PUT')
        await requestMultipart(ruta, method, formData).then(() => {
            getFetchData();
            artitulosXalmacenId()
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
        setData({articulo_nombre: '', articulo_precioventa: 0, articulo_almacen: 0, articulo_estatus: false, articulo_existencia: 0, articulo_imagen: '', articulo_codigo: '' });
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
        const response = await request(route("arqueo-inv"), 'POST', { almacen_id: almacenSelected }, { enabled: true });
        setArticulosResponse(response);
        return { response }
    };

    useEffect(() => {
        if (almacenSelected) {
            artitulosXalmacenId()
        }
    }, [almacenSelected]);
    
    
    useEffect(() => {
        getMenuName();
        getFetchData()
        getArticuloResponse()
            .then((res) => {
                // setData(res.articulosResponse);
                setState({ ...state, loading: false });
            });
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }

            <section >
                <div className="">
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

                    {almacenSelected  ? (
                        <Datatable
                            add={() => {
                                setAction('create')
                                setData(articulosResponse)
                                handleCloseModal()
                            }}
                            data={articulosResponse}
                            columns={[
                                { header: 'Articulo', accessor: 'articulo_nombre', cell: eprops =>  eprops.item.articulo?.articulo_nombre},
                                 { header: 'Activo', accessor: 'articulo_estatus', cell: eprops => eprops.item.articulo?.articulo_estatus === '1' ? (<Chip label='Disponible' color='success' size='small' />) : (<Chip label='No disponible' color='error' size='small' />) },
                                 { header: 'Código de barras', accessor: 'articulo_codigo', cell: eprops =>  eprops.item.articulo?.articulo_codigo},
                                {
                                    header: "Acciones", edit: (eprops) => {
                                        setAction('edit')
                                        setData(eprops.item.articulo)
                                        setState({ ...state, open: true })
                                    },
                                }
                            ]}
                        />
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={Imagen} alt="" style={{ textAlign: 'center', width: '40%', height: 'auto', marginTop:'80px' }} className="h-56 w-full object-cover sm:h-full" />
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
        </div>
    )
}
export default Articulos










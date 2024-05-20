import { useEffect, useState } from 'react';
import DialogComp from '@/components/DialogComp';
import request from "@/utils";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import SelectComp from '@/components/SelectComp';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingDiv from '@/components/LoadingDiv';
import Snacks from '../../../../png/snacks/snacks.png';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import Slide from '@mui/material/Slide';
import aprobado from "../../../../img/aprobado.gif";
import rechazado from "../../../../img/error.gif";
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import React from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReporteCortesPDF from "./ReporteCortesPDF";
import Tooltip from '@mui/material/Tooltip/Tooltip'

const TiendaSnacks = () => {
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ loading: true, open: true, inicio: null, action: 'create', clientes: null, articulos: null, metPagos: null, almacen: null, idAlmacenTiendita: null, idCorte: null });
    const [data, setData] = useState({ limiteCredito: null, creditoUsado: null, precio: null, existencia: null, cantidad: null, montoInicial: '', montoFinal: '', IdAlmacen: 0 })
    const [filters, setFilters] = useState({ IdPersona: 0, IdProducto: 0, IdMetodoPago: 0, })
    const [selectedImage, setSelectedImage] = useState('');
    const [SelectedCliente, setSelectedCliente] = useState(null)
    const [selectedArticulo, setSelectedArticulo] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
    const [total, setTotal] = useState(0);
    const precio = selectedArticulo ? selectedArticulo.articulo_precioventa : '';
    const precioSinDecimales = parseFloat(precio).toFixed(0);
    const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
    const [rejectedImage, setRejectedImage] = useState('');
    const storedAlmacen = JSON.parse(localStorage.getItem('almacenSeleccionado')) || null;
    const [SelectedAlmacen, setSelectedAlmacen] = useState(storedAlmacen);
    const [efectivoRecibido, setEfectivoRecibido] = useState('');
    const [cambio, setCambio] = useState(0);
    const [rescreditoUsado, setRescreditoUsado] = useState(0);
    const [downloadPDFEnabled, setDownloadPDFEnabled] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [reporteCortes, setReporteCortes] = useState()




    const getFetchData = async () => {
        const [clientesResponse, metPagoResponse /*, articulosByAlmacen*/, ventaEncabezadoResponse, ventaDetalleResponse, creditosResponse, cortesResponse, almacenResponse] = await Promise.all([
            fetch(route("nombreClientes")).then(res => res.json()),
            fetch(route("sat/metodo-pago.index")).then(res => res.json()),
            /* fetch(route("articulosAlmacen")).then(res => res.json()), */
            fetch(route("venta-encabezado.index")).then(res => res.json()),
            fetch(route("venta-detalle.index")).then(res => res.json()),
            fetch(route("administrar-creditos.index")).then(res => res.json()),
            fetch(route("cortes.index")).then(res => res.json()),
            fetch(route("almacen-empresa")).then(res => res.json()),
        ])
        setState({
            ...state,
            clientes: clientesResponse,
            metPagos: metPagoResponse,
            almacen: almacenResponse,
            cortes: cortesResponse,
        })
    }
    const getCreditosUsados = async () => {
        const response = await request(route("clientes-compras"), 'POST', { id: SelectedCliente }, { enabled: true });
        return response
    };
    const getCreditosLimite = async () => {
        const response = await request(route("clientes-creditoslimite"), 'POST', { id: SelectedCliente }, { enabled: true });
        setData(response)
    }
    const getArticulos = async (sex) => {
        let articulosResponse = null;
        let almacenId = Number(sex);

        if (almacenId)
            articulosResponse = await request(route("articulos.index"), 'POST', { almacenId })
        else
            articulosResponse = await request(route("articulosAlmacen"))

        setState({
            ...state,
            articulos: articulosResponse,
            loading: false
        })
    }
    const getArticulosByAlmacen = async (almacenId) => {
        try {
            const response = await request(route("articulos-por-almacen"), 'POST', { almacenId }, { enabled: true });
            setSelectedArticulo(null);
            setFilters({ ...filters, IdProducto: 0 });
            setState((prevState) => ({
                ...prevState,
                articulos: response,
            }));
        } catch (error) {
        }
    };

    const getCortesPDF = async () => {
        const response = await fetch(route("reporte-cortes-pdf"));
        const dataCortes = await response.json();
        setReporteCortes(dataCortes);
    };

    const handleCompra = async () => {
        const rescreditoUsado = await getCreditosUsados();
        setRescreditoUsado(parseFloat(rescreditoUsado) || 0);
        await getCreditosLimite();
        const creditoUsado = parseFloat(rescreditoUsado) || 0;
        const limiteCredito = parseFloat(data.limiteCredito) || 0;
        const totalCompra = parseFloat(total.toFixed(2));
        const efectivo = parseFloat(efectivoRecibido);
        const metodoPagoCredito = 1;
        const metodoPagoContado = 2;
        const cambioCalculado = efectivo - totalCompra;

        if (filters.IdMetodoPago === metodoPagoCredito) {
            if (creditoUsado + totalCompra > limiteCredito) {
                setRejectedImage(rechazado);
                setIsRejectedModalOpen(true);
                setIsPaidModalOpen(false);
                return;
            } else {
                pagado();
                openPaidModal();
                clearSelectedItems();

            }
        } else if (filters.IdMetodoPago === metodoPagoContado) {
            if (isNaN(efectivo) || efectivo < totalCompra) {
                return;
            }
            setCambio(cambioCalculado);
            clearSelectedItems();
            pagado();
            openPaidModal();
        }
    };

    const pagado = async (e) => {
        const formData = {
            total: total,
            idPersona: filters.IdPersona,
            idMetodoPago: filters.IdMetodoPago,
            idAlmacenTiendita: state.articulos[0].articulo_almacen,
            IdCorte: state.idCorte,
        };
        try {
            const encabezadoResponse = await fetch(route("venta-encabezado.store"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (encabezadoResponse.ok) {
                const encabezadoData = await encabezadoResponse.json();
                const idVentaencabezado = encabezadoData.tiendita ? encabezadoData.tiendita.idVentaEncabezadoTiendita : undefined;
                if (idVentaencabezado !== undefined) {
                    const detalleFormData = {
                        idVentaencabezado: idVentaencabezado,
                        listaproductos: selectedProducts.map(item => ({
                            articulo_id: item.articulo_id,
                            Cantidad: item.cantidad,
                            articulo_precioventa: item.articulo_precioventa,
                        })),
                    };
                    const detalleResponse = await fetch(route("venta-detalle.store"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(detalleFormData),
                    });
                    if (detalleResponse.ok) {
                    }
                }
            }
        } catch (error) {
        }
    };
    const handleCloseModal = () => {
        setState({ ...state, open: false, action: '' })
    }
    const handleSearchChange = (event, newValue) => {
        setFilters({ ...filters, IdProducto: newValue ? newValue.articulo_id : '' });
        if (newValue) {
            const foundArticulo = state.articulos.find((articulo) => articulo.articulo_id === newValue.articulo_id);
            if (foundArticulo) {
                setSelectedArticulo(foundArticulo);
                setSelectedImage(foundArticulo.imagen_codificada);
            } else {
                setSelectedArticulo(null);
                setSelectedImage('');
            }
        } else {
            setSelectedArticulo(null);
            setSelectedImage('');

        }
    };

    const handleAgregarProducto = (producto) => {
        if (producto) {
            const existingProductIndex = selectedProducts.findIndex((p) => p.articulo_id === producto.articulo_id);
            if (existingProductIndex !== -1) {
                const updatedProducts = [...selectedProducts];
                updatedProducts[existingProductIndex].cantidad += 1;
                setSelectedProducts(updatedProducts);
            } else {
                setSelectedProducts([...selectedProducts, { ...producto, cantidad: 1 }]);
            }
        }
    };
    const handleRemoveProduct = (productId) => {
        const updatedProducts = selectedProducts.filter((product) => product.articulo_id !== productId);
        setSelectedProducts(updatedProducts);
    };
    const handleDecreaseQuantity = (productId) => {
        const updatedProducts = selectedProducts.map((product) => {
            if (product.articulo_id === productId) {
                const newQuantity = product.cantidad - 1;
                if (newQuantity >= 1) {
                    return { ...product, cantidad: newQuantity };
                } else {
                    return null;
                }
            }
            return product;
        });

        const filteredProducts = updatedProducts.filter((product) => product !== null);
        setSelectedProducts(filteredProducts);
    };
    const clearSelectedItems = () => {
        setSelectedProducts([]);
        setSelectedImage('');
        setEfectivoRecibido('')
    };
    const openPaidModal = () => {
        setIsPaidModalOpen(true);
        setTimeout(() => {
            setIsPaidModalOpen(false);
        }, 30000);
    };
    const handleChangeAlmacen = (newValue) => {
        setSelectedAlmacen(newValue);
        setState((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                IdAlmacen: newValue,
            },
        }));
    };

    const iniciarCorte = async (e) => {
        const formData = {
            montoInicial: parseFloat(data.montoInicial),
            idAlmacen: state.articulos[0].articulo_almacen,
        };
        try {
            const response = await request(route("iniciar-corte"), "POST", formData);
            setState({ ...state, open: false, idCorte: response.corte.id });
            const newIdAlmacen = response.corte.idAlmacen;
            handleChangeAlmacen(newIdAlmacen);
            getArticulosByAlmacen(newIdAlmacen);
        } catch (error) {
        }
    };

    const finalizarCorte = async () => {
        const response = await request(route('finalizar-corte'), 'POST', { enabled: true, error: { message: 'No se ha terminado el corte', type: 'error' }, success: { message: "Corte Finalizado", type: 'success' } })
        localStorage.removeItem(SelectedAlmacen);
    }
    const handleClienteSelection = (selectedId) => {
        setSelectedCliente(selectedId);
    };
    useEffect(() => {
        getFetchData()
    }, []);

    useEffect(() => {
        const newTotal = selectedProducts.reduce((accumulator, product) => {
            const productPrice = parseFloat(product.articulo_precioventa);
            const productQuantity = product.cantidad;
            return accumulator + productPrice * productQuantity;
        }, 0);

        setTotal(newTotal);
    }, [selectedProducts]);

    useEffect(() => {
        if (!state.articulos && state.clientes && state.metPagos && state.loading)
            getArticulos(SelectedAlmacen)
    }, [state])

    useEffect(() => {
    }, [reporteCortes]);


    return (
        <>
            {state.loading &&
                <LoadingDiv />
            }
            {(!state.loading) &&
                <section className="overflow-hidden  sm:grid sm:grid-cols-2">
                    <div className="p-8 md:p-5 lg:px-16 lg:py-10">
                        <h1 className="mt-8 text-2xl font-bold text-gray-900 sm:text-3x1 md:text-4xl"></h1>
                        <div >
                            <div>
                                <SelectComp
                                    label="Clientes"
                                    options={state.clientes}
                                    value={filters.IdPersona || ''}
                                    data="nombre_completo"
                                    valueKey="IdPersona"
                                    onChangeFunc={(value) => {
                                        setFilters({ ...filters, IdPersona: value });
                                        handleClienteSelection(value);
                                    }}
                                    onClick={() => {
                                        const totalId = eprops.item.IdPersona;
                                        if (SelectedCliente === totalId) {
                                            setSelectedCliente('');
                                        } else {
                                            setSelectedCliente(totalId);
                                            handleClienteSelection(totalId);
                                        }
                                    }}
                                />
                            </div>
                            <div className=''>
                                <SelectComp
                                    label="Métodos de Pago"
                                    options={state.metPagos}
                                    value={filters.IdMetodoPago || ''}
                                    data="catalogoMetodoPagoSAT_descripcion"
                                    valueKey="catalogoMetodoPagoSAT_id"
                                    onChangeFunc={(value) => setFilters({ ...filters, IdMetodoPago: value })}
                                />
                            </div>
                            <Autocomplete
                                className='mt-5 font-italic'
                                options={state.articulos}
                                getOptionLabel={(option) => option.articulo_nombre}
                                value={state.articulos.find((articulo) => articulo.articulo_id === filters.IdProducto) || state.articulos.find((articulo) => articulo.articulo_codigo === filters.IdProducto)}
                                onChange={handleSearchChange}
                                renderInput={(params) => <TextField {...params} label="Buscar Artículo" />}
                            />

                            <div className='mt-5'>
                                {selectedImage ? (
                                    <div className="group relative block overflow-hidden">
                                        <button
                                            type='button'
                                            onClick={() => handleAgregarProducto(selectedArticulo)}
                                            className="block w-full rounded bg-blue-800 p-4 text-sm font-medium transition hover:scale-105 text-white"
                                        >
                                            Agregar Producto
                                        </button>
                                        <img src={`data:image/png;base64,${selectedImage}`} alt="Producto" className="w-35 h-auto mx-auto object-center object-cover transition duration-500 group-hover:scale-105 sm:max-h-72 mt-2" />
                                        <div className="relative">
                                            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{selectedArticulo ? selectedArticulo.articulo_nombre : ''}</h3>
                                            <p className="mt-1.5 text-lg text-gray-900 ml-[2%]">Precio:<span style={{ color: 'green' }}> $</span> <span style={{ color: 'green' }}>{precioSinDecimales}</span><span style={{ color: 'green' }}> mxn</span> </p>
                                            <p className="mt-1.5 text-sm inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700" style={{ color: 'blue' }}>Existencia: {selectedArticulo ? selectedArticulo.articulo_existencia : ''} piezas </p>
                                            <form className="mt-4">

                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-35 h-auto mx-auto bg-white-200">
                                        <h1 className='text-center'>Productos</h1>
                                        <img src={Snacks} alt="Imagen por defecto" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <section className="">
                        <div className="mx-auto max-w-screen-x1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                            <header className="text-center sticky top-0 bg-white">
                                <h1 className="text-x1 font-bold text-gray-800 sm:text-2xl">Lista de Productos</h1>
                            </header>
                            <div className="max-h-[480px] overflow-y-scroll blue-scroll">
                                <div className="mt-6">
                                    <ul className="space-y-4">
                                        {selectedProducts.slice(0, 200).map((product, index) => (
                                            <li key={index} className="flex items-center gap-4">
                                                <img
                                                    src={`data:image/png;base64,${product.imagen_codificada}`}
                                                    alt={product.articulo_nombre}
                                                    className="h-20 w-16 mx-auto rounded object-center object-cover"
                                                />
                                                <div>
                                                    <h3 className="text-sm text-gray-900">{product.articulo_nombre}</h3>
                                                    <p className="mt-0.5 text-sm text-gray-700 ml-[2%]" style={{ color: 'green' }}>
                                                        ${parseFloat(product.articulo_precioventa).toFixed(0)}
                                                    </p>
                                                </div>
                                                <div className="flex flex-1 items-center justify-end gap-2">
                                                    <button
                                                        className="text-gray-600 transition hover:text-red-600"
                                                        onClick={() => handleDecreaseQuantity(product.articulo_id)}
                                                    >
                                                        <RemoveIcon />
                                                    </button>
                                                    <form>
                                                        <label htmlFor={`Line${index + 1}Qty`} className="sr-only">
                                                            Quantity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="12"
                                                            value={product.cantidad}
                                                            onChange={(e) => handleQuantityChange(product.articulo_id, e.target.value)}
                                                            id={`Line${index + 1}Qty`}
                                                            className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                                        />
                                                    </form>
                                                    <button
                                                        className="text-gray-600 transition hover:text-red-600"
                                                        onClick={() => handleRemoveProduct(product.articulo_id)}
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-end border-t border-gray-100 pt-8">
                                <div className="w-screen max-w-lg space-y-5">
                                    <dl className="mr-[100%] text-lg text-gray-700">
                                        <article
                                            className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 mt-[5%]" >
                                            <span className="rounded-full bg-blue-100 p-3 text-blue-600">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                            </span>

                                            <div>
                                                <p className="text-2xl font-medium text-gray-900">${total.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">TOTAL</p>

                                            </div>
                                            <div className="-mt-2">
                                                {filters.IdMetodoPago !== 1 && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            id="efectivoRecibido"
                                                            name="efectivoRecibido"
                                                            value={efectivoRecibido}
                                                            onChange={(e) => setEfectivoRecibido(e.target.value)}
                                                            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 block w-full shadow-sm sm:text-sm"
                                                        />
                                                        <p className="text-sm text-gray-500">EFECTIVO</p>
                                                    </>
                                                )}
                                            </div>
                                        </article>
                                        <article
                                            className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 mt-[5%]" >
                                            <button
                                                type='button'
                                                className="md-[5%] block rounded bg-blue-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-green-600"
                                                onClick={handleCompra}
                                            >
                                                Pagado
                                            </button>
                                            <button
                                                type='button'
                                                className="mr-[5%] block rounded bg-red-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-red-600"
                                                onClick={clearSelectedItems}
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                type='button'
                                                className="mr-[5%] block rounded bg-yellow-600 px-5 py-3 text-sm text-gray-100 transition hover:bg-yellow-700"
                                                onClick={() => {
                                                    finalizarCorte().then((data) => {
                                                        setDownloadPDFEnabled(true);
                                                        setGeneratingPDF(true);
                                                        getCortesPDF().then((pdfData) => {
                                                            setReporteCortes(pdfData.dataCortes);
                                                            setGeneratingPDF(false);
                                                        });
                                                    });
                                                }}
                                            >
                                                Corte
                                            </button>
                                           
                                            <button onClick={() => getCortesPDF().then(res => setReporteCortes(reporteCortes))}>
                                                 {downloadPDFEnabled && (  
                                                <PDFDownloadLink document={<ReporteCortesPDF data={reporteCortes} />} fileName='reporte-cortes.pdf'>
                                                    {({ blob, url, loading, error }) =>
                                                        loading ? '' : (
                                                            <Tooltip title="Descargar PDF Cortes">
                                                                <span style={{ fontSize: '90px', color: '#29C97B' }}>
                                                                    <ReceiptLongOutlinedIcon style={{ fontSize: '55px' }} />
                                                                </span>
                                                            </Tooltip>
                                                        )
                                                    }
                                                </PDFDownloadLink>
                                                 )}  
                                            </button>
                                        </article>
                                    </dl>
                                </div>
                            </div>
                            <Dialog
                                open={isRejectedModalOpen}
                                TransitionComponent={Slide}
                                TransitionProps={{ direction: 'down' }}
                                keepMounted
                                onClose={() => setIsRejectedModalOpen(false)}
                                PaperProps={{
                                    style: {
                                        backgroundColor: '#F7F7F7',
                                    },
                                }}
                            >
                                <DialogTitle style={{ color: '#E6200F', fontSize: '28px' }}>Compra Rechazada</DialogTitle>
                                <DialogContent>
                                    <p style={{ color: '', fontSize: '20px' }}>Lo sentimos, la compra ha sido rechazada.</p>
                                    <p style={{ color: '#E57B2E', fontSize: '20px' }}>Excediste el limite de tu crédito o no tienes crédito asignado</p>
                                    <p style={{ color: '', fontSize: '20px' }}>Tu Límite de Crédito es: ${(data.limiteCredito)}</p>
                                    <p style={{ color: '', fontSize: '20px' }}>Tu Crédito Usado es: ${rescreditoUsado}</p>
                                    <img src={rejectedImage} alt="rechazado" />
                                </DialogContent>
                                <DialogActions>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={isPaidModalOpen}
                                TransitionComponent={Slide}
                                TransitionProps={{ direction: 'up' }}
                                keepMounted
                                onClose={() => setIsPaidModalOpen(false)}
                                PaperProps={{
                                    style: {
                                        backgroundColor: '#F7F7F7',
                                    },
                                }}
                            >
                                <DialogTitle style={{ color: '#25CB25', fontSize: '28px' }}>Producto Pagado!</DialogTitle>
                                <DialogContent>
                                    <p style={{ color: '#2E8FE5', fontSize: '20px' }}>¡Gracias por su compra!</p>
                                    {filters.IdMetodoPago !== 1 && (
                                        <p style={{ color: '#F95734', fontSize: '20px' }}>Cambio: ${cambio.toFixed(2)}</p>
                                    )}
                                    <img src={aprobado} alt="aprobado" />
                                </DialogContent>
                                <DialogActions>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </section>

                    {(!state.loading && state.cortes && state.cortes.length > 0 && state.cortes[state.cortes.length - 1].fecha_fin !== null) && (
                        <DialogComp
                            dialogProps={{
                                model: 'Monto Inicial',
                                width: 'sm',
                                customTitle: true,
                                openState: state.open,
                                actionState: state.action,
                                openStateHandler: () => handleCloseModal(),
                                onSubmitState: () => iniciarCorte
                            }}
                            fields={[
                                {
                                    label: "Efectivo",
                                    fieldKey: '',
                                    input: true,
                                    type: "text",
                                    value: data.montoInicial,
                                    onChangeFunc: (e) => {
                                        const inputValue = e.target.value;
                                        if (inputValue.length < 14) {
                                            setData((prevData) => ({
                                                ...prevData,
                                                montoInicial: inputValue,
                                            }));
                                        }
                                    }
                                },
                                // {
                                //     label: "Almacen",
                                //     select: true,
                                //     options: state.almacen,
                                //     value: data.IdAlmacen,
                                //     onChangeFunc: (newValue) => {
                                //         setState((prevState) => ({
                                //             ...prevState,
                                //             data: {
                                //                 ...prevState.data,
                                //                 IdAlmacen: newValue,
                                //             },
                                //         }));

                                //         getArticulosByAlmacen(newValue);
                                //     },
                                //     data: "almacen_nombre",
                                //     valueKey: "almacen_id",
                                // }
                            ]}
                            errors={errors}
                        />
                    )}
                </section>
            }
        </>
    );
}
export default TiendaSnacks

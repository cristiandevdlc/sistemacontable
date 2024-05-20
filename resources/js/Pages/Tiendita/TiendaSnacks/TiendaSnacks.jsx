import { useEffect, useState } from 'react';
import DialogComp from '@/components/DialogComp';
import request from "@/utils";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import SelectComp from '@/components/SelectComp';
import LoadingDiv from '@/components/LoadingDiv';
import Snacks from '../../../../png/snacks/snacks.png';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import Slide from '@mui/material/Slide';
import aprobado from "../../../../img/aprobado.gif";
import rechazado from "../../../../img/error.gif";
import productoAgotado from "../../../../img/agotado.png"
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import React from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReporteCortesPDF from "./ReporteCortesPDF";
import Tooltip from '@mui/material/Tooltip/Tooltip'
import selectOptImg from '../../../../png/camion.png'

const TiendaSnacks = () => {
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ loading: true, open: true, open2: false, inicio: null, action: 'create', clientes: null, articulos: null, metPagos: null, almacen: null, idAlmacenTiendita: null, idCorte: '', cortes: null, });
    const [data, setData] = useState({ limiteCredito: null, creditoUsado: null, precio: null, existencia: null, cantidad: null, montoInicial: '', montoFinal: '', efectivoencaja: '' })
    const [filters, setFilters] = useState({ IdPersona: 0, IdProducto: 0, IdMetodoPago: 0, IdAlmacen: 0 })
    const [selectedImage, setSelectedImage] = useState('');
    const [SelectedCliente, setSelectedCliente] = useState(null)
    const [selectedArticulo, setSelectedArticulo] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
    const [total, setTotal] = useState(0);
    const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
    const [rejectedImage, setRejectedImage] = useState('');
    const [efectivoRecibido, setEfectivoRecibido] = useState('');
    const [cambio, setCambio] = useState(0);
    const [rescreditoUsado, setRescreditoUsado] = useState(0);
    const [downloadPDFEnabled, setDownloadPDFEnabled] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [reporteCortes, setReporteCortes] = useState()
    const [precioVenta, setPrecioVenta] = useState()
    const [existencia, setExistencia] = useState()
    const [mostrarDialogo, setMostrarDialogo] = useState(false);

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
        const [clientesResponse, metPagoResponse, cortesResponse, articulosResponse] = await Promise.all([
            fetch(route("nombreClientes")).then(res => res.json()),
            fetch(route("sat/metodo-pago.index")).then(res => res.json()),
            fetch(route("cortes.index")).then(res => res.json()),
            fetch(route("usuario-articulos")).then(res => res.json()),
        ])
        return { clientesResponse, metPagoResponse, cortesResponse, articulosResponse };
    }
    const getCreditosUsados = async () => {
        const response = await request(route("clientes-compras"), 'POST', { id: SelectedCliente }, { enabled: true });
        return response
    };
    const getCreditosLimite = async () => {
        const response = await request(route("clientes-creditoslimite"), 'POST', { id: SelectedCliente }, { enabled: true });
        setData(response)
    }
    const getCortesPDF = async () => {
        const response = await fetch(route("reporte-cortes-pdf"));
        const dataCortes = await response.json();
        setReporteCortes(dataCortes);
    };
    const pagado = async (e) => {
        const formData = {
            total: total,
            idPersona: filters.IdPersona,
            idMetodoPago: filters.IdMetodoPago,
            idAlmacenTiendita: state.articulos[0].almacen.almacen_id,
            IdCorte: obtenerIdCorteDesdeEstado(),
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
                            articulo_precioventa: item.almacenArticulo_precioventa
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
        setState({ ...state, open: false, action: '', open2: false });
        setData({ efectivoencaja: '' })

    }
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

        setFilters({ ...filters, IdProducto: null, IdPersona: null, IdMetodoPago: null })
        try {
            const response = await fetch(route("usuario-articulos", { id: filters.IdProducto }));
            const productoActualizado = await response.json();
            setExistencia(productoActualizado.almacenArticulo_existencia);
        } catch (error) {
            console.error("Error al obtener la información del producto:", error);
        }
    };
    const handleSearchChange = (selectedValue) => {
        if (selectedValue) {
            const foundArticulo = state.articulos.find((articulo) => articulo.almacenArticulo_id === selectedValue.value);
            if (foundArticulo) {
                setFilters({ ...filters, IdProducto: foundArticulo.almacenArticulo_id });
                setSelectedArticulo(foundArticulo.articulo);
                setSelectedImage(foundArticulo.articulo.imagen_codificada);
                setPrecioVenta(foundArticulo.almacenArticulo_precioventa);
                setExistencia(foundArticulo.almacenArticulo_existencia);
            } else {
                setFilters({ ...filters, IdProducto: '' });
                setSelectedArticulo(null);
                setSelectedImage('');
            }
        } else {
            setFilters({ ...filters, IdProducto: '' });
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
                setSelectedProducts([...selectedProducts, { ...producto, cantidad: 1, precioVenta: producto.almacenArticulo_precioventa }]);
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
    const guardarIdCorte = (idCorte) => {
        localStorage.setItem('IdCorte', idCorte.toString());
    };
    const obtenerIdCorte = () => {
        const idCorte = localStorage.getItem('IdCorte');
        return idCorte ? parseInt(idCorte, 10) : null;
    };
    const guardarIdCorteEnEstado = (idCorte) => {
        setState((prev) => ({ ...prev, idCorte }));
        guardarIdCorte(idCorte);
    };
    const obtenerIdCorteDesdeEstado = () => {
        return state.idCorte || obtenerIdCorte();
    };
    const iniciarCorte = async (e) => {
        const formData = {
            montoInicial: parseFloat(data.montoInicial),
            idAlmacen: state.articulos[0].almacen.almacen_id,
        };
        try {
            const response = await request(route("iniciar-corte"), "POST", formData);
            const nuevoIdCorte = response.corte.id;
            setState({ ...state, open: false, idCorte: nuevoIdCorte });
            guardarIdCorteEnEstado(nuevoIdCorte);
        } catch (error) {
        }
    };
    const finalizarCorte = async () => {
        const response = await request(route('finalizar-corte'), 'POST', { enabled: true, error: { message: 'No se ha terminado el corte', type: 'error' }, success: { message: "Corte Finalizado", type: 'success' } })
    }
    const enviarEfectivoCaja = async () => {
        const formData = {
            efectivoencaja: parseFloat(data.efectivoencaja),
            idCorte: obtenerIdCorteDesdeEstado(),
        };

        try {
            const response = await request(route('efectivo-caja'), 'POST', formData, {
                enabled: true,
                error: { message: 'No se ha terminado de guardar el efectivo en caja', type: 'error' },
                success: { message: "Efectivo en caja guardado", type: 'success' }
            });

            console.log(response);

            setMostrarDialogo(false);
            setData({ efectivoencaja: '' });
        } catch (error) {
            console.error(error);
        }
    }

    const handleClienteSelection = (selectedId) => {
        setSelectedCliente(selectedId);
    };

    useEffect(() => {
        getMenuName()
        getFetchData()
            .then((res) => {
                setState({
                    ...state,
                    clientes: res.clientesResponse,
                    metPagos: res.metPagoResponse,
                    articulos: res.articulosResponse,
                    cortes: res.cortesResponse,
                    loading: false
                });
            });
    }, []);

    // useEffect(() => {
    //     console.log(state.cortes)
    // }, [state.cortes])

    useEffect(() => {
        const newTotal = selectedProducts.reduce((accumulator, product) => {
            const productPrice = parseFloat(product.almacenArticulo_precioventa);
            const productQuantity = product.cantidad;
            return accumulator + productPrice * productQuantity;
        }, 0);

        setTotal(newTotal);
    }, [selectedProducts])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            {(!state.loading) &&
                <div className="flex sm:flex-col md:flex-row gap-4 h-full">
                    <div className="flex flex-col w-full gap-4">
                        <div className='border-2 rounded-lg pb-3 px-4'>
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
                            <SelectComp
                                label="Métodos de Pago"
                                options={state.metPagos}
                                value={filters.IdMetodoPago || ''}
                                data="catalogoMetodoPagoSAT_descripcion"
                                valueKey="catalogoMetodoPagoSAT_id"
                                onChangeFunc={(value) => setFilters({ ...filters, IdMetodoPago: value })}
                            />
                            {/* <SelectComp
                                label="Articulos"
                                options={state.articulos ? state.articulos.map((item) => ({
                                    value: item.almacenArticulo_id,
                                    data: `${item.articulo.articulo_codigo} - ${item.articulo.articulo_nombre} `
                                })) : []}
                                value={filters.IdProducto || ''}
                                data="data"
                                valueKey="value"
                                onChangeFunc={(event, value) => {
                                    setFilters({ ...filters, IdProducto: value });
                                    handleSearchChange(value);
                                }}
                            /> */}
                            <SelectComp
                                label="Articulos"
                                options={state.articulos && Array.isArray(state.articulos) ? state.articulos.map((item) => ({
                                    value: item.almacenArticulo_id,
                                    data: `${item.articulo.articulo_codigo} - ${item.articulo.articulo_nombre} `
                                })) : []}
                                value={filters.IdProducto || ''}
                                data="data"
                                valueKey="value"
                                onChangeFunc={(event, value) => {
                                    setFilters({ ...filters, IdProducto: value });
                                    handleSearchChange(value);
                                }}
                            />
                            <div className='pt-3 mt-2 text-center'>
                                <button
                                    type='button'
                                    onClick={() => handleAgregarProducto(selectedArticulo)}
                                    className={`block w-full rounded ${(existencia <= 0 || !selectedArticulo) ? 'bg-gray-400' : 'bg-[#1B2654]'} p-3 text-white`}
                                    disabled={existencia <= 0 || !selectedArticulo}
                                >
                                    {existencia <= 0 ? 'Producto Agotado' : 'Agregar Producto'}
                                </button>
                            </div>
                        </div>
                        {selectedImage ? (
                            <div className="flex flex-col gap-5 h-[100%] relative overflow-hidden">
                                <img src={`data:image/png;base64,${selectedImage}`} alt="Producto" className="w-35 non-selectable h-auto mx-auto object-center object-cover transition duration-500 group-hover:scale-105 sm:max-h-72 mt-9" />
                                <div className="relative">
                                    <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{selectedArticulo ? selectedArticulo.articulo_nombre : ''}</h3>
                                    <p className="text-lg text-gray-900 ml-[2%]">
                                        Precio:<span style={{ color: 'green' }}> $</span>
                                        <span style={{ color: 'green' }}>{parseFloat(selectedArticulo.almacenArticulo_precioventa).toFixed(2)}</span>
                                        <span style={{ color: 'green' }}> mxn</span>
                                    </p>
                                    <p className="text-sm inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-white" style={{ backgroundColor: existencia <= 0 ? 'red' : 'blue' }}>
                                        Existencia: {existencia <= 0 ? 'Agotado' : `${existencia} piezas`}
                                    </p>
                                    <form className="mt-4">
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 h-[100%] relative overflow-hidden items-center justify-center">
                                {/* <h1 className='text-center'>Productos</h1> */}
                                <div className='h-[100%] max-w-[85%]'>
                                    <img src={Snacks} alt="Imagen por defecto" className="object-scale-down h-full w-full non-selectable" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 w-full justify-between mt-1">
                        <div className="sm:max-h-[480px] md:h-[480px]"> {/* border-2 rounded-lg */}
                            <header className="text-center py-2">
                                <h1 className="text-x1 font-bold text-gray-800 sm:text-2xl">Lista de Productos</h1>
                            </header>
                            {(selectedProducts && selectedProducts.length !== 0) ? (
                                <div>
                                    <div className='px-5 mb-4'>
                                        <Divider />
                                    </div>
                                    <div className='relative max-h-[480px] overflow-auto blue-scroll p-3 '>
                                        <ul className="space-y-4">
                                            {selectedProducts.slice(0, 200).map((product, index) => (
                                                <li key={index} className="flex items-center gap-4">
                                                    <img
                                                        src={`data:image/png;base64,${product.imagen_codificada}`}
                                                        alt={product.articulo_nombre}
                                                        className="h-20 w-16 mx-auto rounded object-center object-cover non-selectable"
                                                    />
                                                    <div>
                                                        <h3 className="text-sm text-gray-900">{product.articulo_nombre}</h3>
                                                        <p className="mt-0.5 text-sm text-gray-700 ml-[2%]" style={{ color: 'green' }}>
                                                            ${parseFloat(product.almacenArticulo_precioventa).toFixed(0)}
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
                                    <div className='px-5 mt-4'>
                                        <Divider />
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col relative h-[480px] items-center overflow-hidden'>
                                    <img className='object-scale-down w-96 non-selectable' src={selectOptImg} alt="" />
                                    <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col relative gap-4 justify-end border-2 rounded-lg shadow-sm px-6 py-4">
                            <div className="flex sm:flex-col md:flex-row items-center justify-between gap-4 text-lg text-gray-700">
                                <div className='flex items-center gap-4'>
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
                                </div>
                                <div>
                                    {filters.IdMetodoPago !== 1 && (
                                        <>
                                            <input
                                                type="text"
                                                id="efectivoRecibido"
                                                name="efectivoRecibido"
                                                value={efectivoRecibido}
                                                onChange={(e) => setEfectivoRecibido(e.target.value)}
                                                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#6366F1] block w-full shadow-sm sm:text-sm"
                                            />
                                            <p className="text-sm text-gray-500">EFECTIVO</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex sm:flex-col md:flex-row items-center justify-between gap-4 rounded-lg">
                                <button
                                    type='button'
                                    className="block rounded w-full bg-blue-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-green-600"
                                    onClick={handleCompra}
                                >
                                    Pagado
                                </button>
                                <button
                                    type='button'
                                    className="block rounded w-full bg-red-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-red-600"
                                    onClick={clearSelectedItems}

                                >
                                    Limpiar
                                </button>
                                <button
                                    type='button'
                                    className="block rounded w-full bg-yellow-600 px-5 py-3 text-sm text-gray-100 transition hover:bg-yellow-700"
                                    onClick={() => {
                                        finalizarCorte().then((data) => {
                                            setMostrarDialogo(true);
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
                                <button
                                    className={`block rounded w-full ${!downloadPDFEnabled ? 'bg-gray-400' : 'bg-yellow-600'} px-5 py-3 text-sm text-gray-100`}
                                    disabled={!downloadPDFEnabled}
                                    onClick={() => getCortesPDF().then(res => setReporteCortes(reporteCortes))}
                                >
                                    {downloadPDFEnabled && (
                                        <PDFDownloadLink document={<ReporteCortesPDF data={reporteCortes} />} fileName='reporte-cortes.pdf'>
                                            {({ blob, url, loading, error }) =>
                                                loading ? '' : (
                                                    <Tooltip title="Descargar PDF Cortes">
                                                        {/* <span style={{ fontSize: '90px', color: '#29C97B' }}>
                                                            <ReceiptLongOutlinedIcon style={{ fontSize: '55px' }} />
                                                        </span> */}
                                                    </Tooltip>
                                                )
                                            }
                                        </PDFDownloadLink>
                                    )}
                                    PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {(!state.loading && (!state.cortes || state.cortes.length === 0 || /* state.cortes[state.cortes.length - 1].fecha_fin !== '' || */ state.cortes[state.cortes.length - 1].fecha_fin)) && (
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
                            ]}
                            errors={errors}
                        />
                    )}
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
                    <DialogComp
                        dialogProps={{
                            model: 'Efectivo en Caja',
                            width: 'sm',
                            customTitle: true,
                            openState: mostrarDialogo,
                            actionState: state.action,
                            openStateHandler: () => handleCloseModal(),
                            onSubmitState: () => enviarEfectivoCaja,
                        }}
                        fields={[
                            {
                                label: "Efectivo en caja",
                                fieldKey: '',
                                input: true,
                                type: "text",
                                value: data.efectivoencaja,
                                onChangeFunc: (e) => {
                                    const inputValue = e.target.value;
                                    if (inputValue.length < 14) {
                                        setData((prevData) => ({
                                            ...prevData,
                                            efectivoencaja: inputValue,
                                        }));
                                    }
                                },
                            },
                        ]}
                        errors={errors}
                    />
                </div>
            }
        </div>
    );
}
export default TiendaSnacks

import { useState, useEffect, useRef } from "react";
import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from "@/components/SelectComp";
import TextInput from "@/components/TextInput";
import request, { validateInputs } from '@/utils';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const Compra = () => {
    const [state, setState] = useState({ proveedor: null, loading: true, open: false, idProveedorArticulo: null, idAlmacenArticulo: null, precio: '', cantidad: '', fecha: null, precio_unitario: 0, documento: "", observaciones: "" });
    const [filters, setFilters] = useState({ idCompra: null, idArticulo: 0, idAlmacen: null, idProveedor: 0 })
    const [action, setAction] = useState("create");
    const [selectedArticulo, setSelectedArticulo] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [proveedor, setProveedor] = useState()
    const [proveedorOptions, setProveedorOptions] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoadingProveedores, setIsLoadingProveedores] = useState(false);
    const [proveedorSelectEnabled, setProveedorSelectEnabled] = useState(false);
    const [almacenArticuloId, setAlmacenArticuloId] = useState(null);
    const [proveedorArticuloId, setProveedorArticuloId] = useState(null);


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
        const [articulosResponse, almacenResponse, proveedorResponse] = await Promise.all([
            fetch(route("articulos.index")).then(res => res.json()),
            fetch(route("almacen.index")).then(res => res.json()),
            fetch(route("proveedor.index")).then(res => res.json()),
        ]);
        return { articulosResponse, almacenResponse, proveedorResponse };
    }

    const calculatePriceUnit = () => {
        const precio = parseFloat(state.precio);
        const cantidad = parseFloat(state.cantidad);
        if (!isNaN(precio) && !isNaN(cantidad) && cantidad !== 0) {
            const precioUnitario = precio * cantidad;
            setState({ ...state, precio_unitario: precioUnitario });
        } else {
            setState({ ...state, precio_unitario: 0 });
        }
    };

    const submit = async (e) => {
        const requestData = {
            listaproductos: selectedProducts.map((product) => ({
                idProveedorArticulo: proveedorArticuloId,
                cantidad: product.cantidad,
                precio_unitario: product.precio,
                documento: state.documento,
                observaciones: state.observaciones,
                idAlmacenArticulo: almacenArticuloId,
            })),
        };

        const ruta = action === "create" ? route("compra.store") : route("compra.update", filters.idCompra);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, requestData).then(() => {
            getFetchData();
        });
        setState({
            ...state,
            cantidad: '',
            precio: '',
            precio_unitario: 0,
            documento: '',
            observaciones: '',
            idProveedorArticulo: ''
        });
        clearSelectedItems();
    };

    const handleAgregarProducto = (producto) => {
        if (producto) {
            const precio = parseFloat(state.precio);
            const cantidad = parseFloat(state.cantidad);

            if (!isNaN(precio) && !isNaN(cantidad) && cantidad > 0) {
                const precioUnitario = precio / cantidad;

                const nuevoProducto = {
                    ...producto,
                    cantidad: cantidad,
                    precio: precio,
                    precio_unitario: precioUnitario,
                };

                const existingProductIndex = selectedProducts.findIndex((p) => p.articulo_id === producto.articulo_id);

                if (existingProductIndex !== -1) {
                    // Verificar si el producto pertenece al mismo proveedor
                    if (selectedProducts[existingProductIndex].idProveedorArticulo === state.idProveedorArticulo) {
                        // Actualizar el precio si el proveedor es el mismo
                        const updatedProducts = [...selectedProducts];
                        updatedProducts[existingProductIndex] = nuevoProducto;
                        setSelectedProducts(updatedProducts);
                    } else {
                        // Agregar como un nuevo producto si el proveedor es diferente
                        setSelectedProducts([...selectedProducts, nuevoProducto]);
                    }
                } else {
                    // Agregar como un nuevo producto si no existe en la lista
                    setSelectedProducts([...selectedProducts, nuevoProducto]);
                }

                setState({
                    ...state,
                    cantidad: '',
                    precio: '',
                    precio_unitario: 0,
                });

                const selectedArticulo = state.idProveedorArticulo.find((articulo) => articulo.articulo_id === filters.IdProducto);
                setSelectedArticulo(selectedArticulo);
            } else {
                // Lógica para manejar caso de precios o cantidades no válidos
            }
        }
    };

    const handleSearchChange = (event, newValue) => {
        setFilters({ ...filters, idArticulo: newValue ? newValue.articulo_id : '' });

        if (newValue) {
            const foundArticulo = proveedor.find((p) => p.articulo.articulo_id === newValue.articulo_id);

            if (foundArticulo) {
                setSelectedArticulo(foundArticulo.articulo);
                const precio = parseFloat(foundArticulo.proveedorArticulo_costo);
                setState({
                    ...state,
                    precio: precio.toString(),
                    precio_unitario: precio,
                });
            } else {
                setSelectedArticulo(null);
                setState({
                    ...state,
                    precio: '',
                    precio_unitario: 0,
                });
            }
        } else {
            setSelectedArticulo(null);
            setState({
                ...state,
                precio: '',
                precio_unitario: 0,
            });
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
    };

    const obtenerProveedoresDelAlmacen = async (almacenId) => {
        try {
            const response = await request(route("almacen-prov"), 'POST', { almacen_id: almacenId }, { enabled: true, error: { message: 'No se encontrarón proveedores en este almácen', type: 'error' } });

            setFilters((prevFilters) => ({
                ...prevFilters,
                idAlmacen: almacenId
            }));

            if (response && response.proveedores) {
                setProveedorOptions(response.proveedores);
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    idProveedor: ''
                }));
                setProveedorSelectEnabled(true);
                setAlmacenArticuloId(response.almacenArticulo_id);
            } else {
                setProveedorOptions([]);
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    idProveedor: ''
                }));
                setProveedorSelectEnabled(false);
            }
            return { response };
        } catch (error) {
            console.error('Error al obtener los proveedores del almacén', error);
        }
    };

    const articulosDelProveedor = async (proveedorId, almacenId) => {
        try {
            const response = await request(route("articulos-prov"), 'POST', { proveedor_id: proveedorId, almacen_id: almacenId }, { enabled: true });
            if (response && response.articulos) {
                setProveedor(response.articulos);
                setFilters((prevFilters) => ({ ...prevFilters, idArticulo: '' }));
            } else {
                setProveedor([]);
                setFilters((prevFilters) => ({ ...prevFilters, idArticulo: '' }));
            }
            return { response };
        } catch (error) {
        }
    };

    const handleProveedorChange = (value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            idProveedor: value,
        }));

        setState({
            ...state,
            precio: '',
            precio_unitario: 0,
        });
    };

    useEffect(() => {
        if (filters.idProveedor && filters.idAlmacen) {
            articulosDelProveedor(filters.idProveedor, filters.idAlmacen);
        }
    }, [filters.idProveedor, filters.idAlmacen]);

    const handleArticuloChange = (value) => {
        setFilters({ ...filters, idArticulo: value, idProveedorArticulo: value.proveedorArticulo_id });

        const foundArticulo = proveedor.find((p) => p.articulo.articulo_id === value);

        if (foundArticulo) {
            setProveedorArticuloId(foundArticulo.proveedorArticulo_id);
            setSelectedArticulo(foundArticulo.articulo);
            setState({
                ...state,
                idProveedorArticulo: foundArticulo.proveedorArticulo_id,
                precio: foundArticulo.proveedorArticulo_costo.toString(),
                precio_unitario: parseFloat(foundArticulo.proveedorArticulo_costo),
            });
        } else {
            setProveedorArticuloId(null);
            setSelectedArticulo(null);
            setState({
                ...state,
                idProveedorArticulo: null,
                precio: '',
                precio_unitario: 0,
            });
        }
    };

    useEffect(() => {
        getMenuName()
        getFetchData()
            .then((res) => {
                setState({
                    ...state,
                    idProveedorArticulo: res.articulosResponse,
                    idAlmacenArticulo: res.almacenResponse,
                    proveedor: res.proveedorResponse,
                    loading: false
                })
            })
    }, []);

    useEffect(() => {
        calculatePriceUnit();
    }, [state.precio, state.cantidad])

    useEffect(() => {
        const newTotal = selectedProducts.reduce((accumulator, product) => {
            const productPrice = parseFloat(product.precio);
            const productQuantity = parseFloat(product.cantidad);

            if (!isNaN(productPrice) && !isNaN(productQuantity) && productQuantity > 0) {
                return accumulator + productPrice * productQuantity;
            } else {
                return accumulator;
            }
        }, 0);
        setTotal(newTotal);
    }, [selectedProducts]);

    useEffect(() => {
        const obtenerProveedores = async () => {
            try {
                setIsLoadingProveedores(true);
                const response = await obtenerProveedoresDelAlmacen(filters.idAlmacen);

                if (response && response.proveedores) {
                    setProveedorOptions(response.proveedores);
                } else {
                    setProveedorOptions([]);
                }
            } finally {
                setIsLoadingProveedores(false);
            }
        };
        if (!proveedorOptions && filters.idAlmacen && !isLoadingProveedores) {
            obtenerProveedores();
        }
    }, [filters.idAlmacen, proveedorOptions, isLoadingProveedores]);

    useEffect(() => {
        setProveedorOptions(state.proveedor);
        setFilters({ ...filters, idProveedor: '' });
    }, [state.proveedor]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            {!state.loading &&
                <section className="overflow-hidden  sm:grid sm:grid-cols-2">
                    <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                        <SelectComp
                            label="Almacén"
                            options={state.idAlmacenArticulo}
                            value={filters.idAlmacen || ''}
                            data="almacen_nombre"
                            valueKey="almacen_id"
                            onChangeFunc={(value) => {
                                setFilters({ ...filters, idAlmacen: value });
                                obtenerProveedoresDelAlmacen(value);
                            }}
                        />

                        <SelectComp
                            label="Proveedor"
                            options={proveedorOptions}
                            value={filters.idProveedor || ''}
                            data="proveedor_nombrecomercial"
                            valueKey="proveedor_id"
                            onChangeFunc={(value) => {
                                handleProveedorChange(value);
                            }}
                            disabled={!proveedorSelectEnabled}
                        />

                        <SelectComp
                            label="Articulo"
                            options={proveedor ? proveedor.map(p => p.articulo) : []}
                            value={filters.idArticulo || ''}
                            data="articulo_nombre"
                            valueKey="articulo_id"
                            onChangeFunc={handleArticuloChange}
                        />

                        <TextInput
                            label="Precio"
                            type="text"
                            name="Precio"
                            value={state.precio}
                            isFocused={true}
                            maxLength="50"
                            onChange={(e) => {
                                const precio = parseFloat(e.target.value);
                                setState({ ...state, precio: e.target.value, precio_unitario: precio });
                            }}
                        />

                        <TextInput
                            label="Cantidad"
                            type="text"
                            name="Cantidad"
                            value={state.cantidad}
                            isFocused={true}
                            maxLength="50"
                            onChange={(e) => {
                                setState({ ...state, cantidad: e.target.value })
                            }}
                        />

                        <TextInput
                            label="Documento"
                            type="text"
                            name="Documento"
                            value={state.documento}
                            isFocused={true}
                            maxLength="50"
                            onChange={(e) => {
                                setState({ ...state, documento: e.target.value })
                            }}
                        />

                        <div>
                            <div
                                className="mt-9 overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                <textarea
                                    id="OrderNotes"
                                    className="w-full resize-none border-none align-top focus:ring-0 sm:text-md"
                                    rows="4"
                                    placeholder="Comentarios..."
                                    maxLength="500"
                                    value={state.observaciones}
                                    onChange={(e) => {
                                        setState({ ...state, observaciones: e.target.value })
                                    }}
                                >
                                </textarea>
                                <div className="flex items-center justify-end gap-2 bg-white p-3">
                                </div>
                            </div>

                            <article
                                value={state.precio_unitario}
                                onChange={(e) => {
                                    setState({ ...state, precio_unitario: e.target.value })
                                }}
                                className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 mt-[5%]" >
                                {/* <span className="rounded-full bg-blue-100 p-3 text-blue-600">
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
                            </span> */}
                                {/* <div>
                                <p className="text-2xl font-medium text-gray-900">${state.precio_unitario.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Precio Unitario</p>
                            </div> */}
                                <button
                                    onClick={() => handleAgregarProducto(selectedArticulo)}
                                    type="button"
                                    className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 ml-[130px]">
                                    Agregar Producto a Lista de Compras
                                </button>
                            </article>

                        </div>
                    </div>

                    <section>
                        <div className="mx-auto max-w-screen-x1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                            <div className="mx-auto max-w-3xl">
                                <header className="text-center sticky top-0 bg-white">
                                    <h1 className="text-x1 font-bold text-gray-800 sm:text-2xl">Lista de Productos</h1>
                                </header>
                                <div className="max-h-[550px] overflow-y-scroll blue-scroll" >
                                    <div className="mt-2">
                                        <ul className="space-y-4">
                                            {selectedProducts.slice(0, 200).map((product, index) => (
                                                <li key={index} className="flex items-center gap-4">
                                                    <div>
                                                        <h3 className="text-sm text-gray-900">{product.articulo_nombre}</h3>
                                                        <p className="mt-0.5 text-sm text-gray-700 ml-[2%]" style={{ color: 'green' }}>
                                                            ${parseFloat(product.precio).toFixed(0)}
                                                        </p>
                                                        <p className="mt-0.5 text-sm text-gray-700 ml-[2%]">
                                                            Precio Unitario: ${parseFloat(product.precio).toFixed(2)}
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
                                                                min="1"
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
                                <div className="flex justify-end border-t border-gray-100 mt-[-20px]">
                                    <div className="w-screen max-w-lg space-y-5">
                                        <dl className="ml-[10%] text-lg text-gray-700">
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
                                            </article>
                                        </dl>
                                        <div className="flex justify-end">
                                            <button
                                                type='button'
                                                className="mr-[5%] block rounded bg-red-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-red-600"
                                                onClick={clearSelectedItems}
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                onClick={submit}
                                                type="button"
                                                className="rounded bg-indigo-600 px-3 py-1.5 text-md font-medium text-white hover:bg-indigo-700">
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            }
        </div>
    )
}
export default Compra
import React from "react";
import { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import TextInput from "@/components/TextInput";
import { useState } from "react";
import request, { noty } from '@/utils';
import SelectComp from "@/components/SelectComp";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import camion from "../../../../../png/camion.png"
import { useRef } from 'react';

export default function PedidosRuta() {
    const [state, setState] = useState({ loading: true, showTable: false, showButton: false, dataUser: true, redirectionTime: 5 })
    const [selectOpt, setSelectOpt] = useState({ productos: null, vendedores: null, metPagos: null })
    const [addedRows, setAddedRows] = useState([]);
    const [action, setAction] = useState("create");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const [selectedItemKeys, setSelectedItemKeys] = useState([]);
    const [cargas, setCargas] = useState()
    const [productoSeleccionado, SetProductoSeleccionado] = useState('');
    const [data, setData] = useState({}); // tabla!
    const [pedidod, setPedidod] = useState({ remision: "", cantidad: "", idCliente: "", productoId: "", producto_nombre: "", direccion: "", vendedor: "", metodo_pago: 0, pedidoId: 0 });//datos
    const initialPedidoId = location.state?.item?.clientePedidosId || 0;
    const [pedidoId, setPedidoId] = useState([]);
    const remisionRef = useRef(null);

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const handleCantidad = async (e) => {
        const inputValue = e.target.value.replace(/\D/g, '').slice(0, 10);
        setPedidod({
            ...pedidod,
            cantidad: inputValue,
        });
        if (e.key === 'Enter') {
            remisionRef.current.focus();
        }
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const renderEmptyCell = (data) => {
        const handleClearClick = () => {
            if (typeof data.rowIndex !== 'undefined') {
                const newAddedRows = [...addedRows];
                newAddedRows.splice(data.rowIndex, 1);
                setAddedRows(newAddedRows);
            }
        };
        if (!data.value) {
            return (
                <span
                    style={{ fontSize: '20px', cursor: 'pointer' }}
                    className="material-icons"
                    onClick={handleClearClick}
                >
                    clear
                </span>
            );
        }
        return <span>diste click</span>;
    };

    const handleVendedor = (selectedVendedorId) => {
        const inputValue = selectedVendedorId;
        setPedidod({
            ...pedidod,
            vendedor: inputValue,
        });
    };

    const getProductosTipoServicio = async (e) => {
        const requestBody = { id: e };
        const requestData = await request(route("getproductbypropiotipo"), 'POST', requestBody, { enabled: true });
        return requestData
    };

    const getSelectOpt = async () => {
        const [vendedoresResponse, metPagoResponse, productosResponse] = await Promise.all([
            fetch(route("persona.vendedores")).then(res => res.json()),
            fetch(route("FormaTelemark")).then(res => res.json()),
            fetch(route("productos.index")).then(res => res.json()),
        ])
        return { vendedoresResponse, metPagoResponse, productosResponse }
    }

    const selectionChanged = (data) => {
        setSelectedItemKeys(data.selectedRowKeys);
    };

    const submit = async (e) => {
        const requestid = { pedidos: addedRows, vendedor: pedidod.vendedor };
        console.log();
        if(addedRows.some(reg => reg.remision == '')){
            noty('Favor de ingresar las remisiones correctamente', 'error')
            return
        }

        const responseE = await request(route("PedidoOrigenRuta"), 'POST', requestid, { enabled: true, success: { message: 'orden creada' } });

        setPedidoId(responseE.message ?? [])
        setOpen(true);
        // if (state.redirectionTime > 0)
        //     navigate('/buscar-cliente');

    };

    const fetchCargas = async () => {
        const response = await fetch(route("getProductsByCargas", { id: productoSeleccionado }));
        const data = await response.json();
        return data
    };

    useEffect(() => {
        if (location.state !== null) {
            getSelectOpt()
                .then((res) => {
                    setSelectOpt({
                        productos: res.productosResponse,
                        vendedores: res.vendedoresResponse,
                        metPagos: res.metPagoResponse,
                    });
                    setState({ ...state, loading: false, dataUser: true });
                });
        } else {
            setState({ ...state, dataUser: false, loading: false, });
        }
    }, []);

    useEffect(() => {
        getMenuName();
    }, [])

    useEffect(() => {
        fetchCargas()
            .then((res) => {
                setCargas(res)
            })
    }, [productoSeleccionado])

    useEffect(() => {
        if (!state.dataUser)
            changeRedirectionTime()
    }, [state.dataUser]);

    useEffect(() => {
        if (state.redirectionTime < 5 && state.redirectionTime > 0)
            changeRedirectionTime()
        else if (state.redirectionTime <= 0) {
            redir()
            navigate('/buscar-cliente');
        }
    }, [state.redirectionTime]);

    const redir = () => {
        return
    }

    const changeRedirectionTime = () => {
        setTimeout(() => {
            setState({ ...state, redirectionTime: state.redirectionTime -= 1 })
        }, 1000)
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading && <LoadingDiv />}
            {!state.loading && state.dataUser ?
                <div className='flex gap-6 sm:flex-col md:flex-row'>
                    <div className='flex flex-col min-w-[30vh] gap-4'>
                        <div className='border-2 w-full shadow-md px-4 pb-3 rounded-xl'>
                            <SelectComp
                                id="metodo de pago"
                                label="Metodo de pago"
                                options={selectOpt.metPagos}
                                value={pedidod.metodo_pago || ""}
                                onChangeFunc={(newValue) => {
                                    setPedidod({ ...pedidod, metodo_pago: newValue });
                                }}
                                data="formasPago_telemark"
                                valueKey="formasPago_idFormasPago"
                            />
                            <SelectComp
                                label="Productos"
                                options={selectOpt.productos}
                                value={pedidod.productoId || ''}
                                data="producto_nombre"
                                valueKey="producto_idProducto"
                                onChangeFunc={(e) => {
                                    const inputValue = e;
                                    setPedidod({
                                        ...pedidod,
                                        productoId: inputValue,
                                    });
                                }}
                            />
                            <SelectComp
                                label="Vendedores"
                                options={selectOpt.vendedores}
                                value={pedidod.vendedor || ''}
                                onChangeFunc={handleVendedor}
                                data="nombre_completo"
                                valueKey="IdPersona"
                            />
                            <div className="pt-4">
                                <button
                                    className="bg-[#1B2654] rounded-lg text-white w-full h-[48px]"
                                    onClick={() => { // Set showTable to true when button is clicked
                                        setState({ ...state, showButton: true })
                                        const selectedProduct = selectOpt.productos.find(
                                            (product) => product.producto_idProducto === pedidod.productoId
                                        );
                                        if (selectedProduct.producto_nombre !== "undefined") {
                                            setAddedRows((prevAddedRows) => [
                                                ...prevAddedRows,
                                                {
                                                    productoId: pedidod.productoId,
                                                    producto_nombre: selectedProduct.producto_nombre,
                                                    cantidad: 0,
                                                    remision: '',
                                                    idCliente: location.state.item.clientePedidosId,
                                                    metodo_pago: pedidod.metodo_pago
                                                }
                                            ]);
                                        }
                                        getProductosTipoServicio(pedidod.productoId)
                                    }}
                                >
                                    Agregar
                                </button>
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        className={`${(addedRows.length > 0 && state.showButton) ? 'bg-[#1B2654]' : 'bg-[#b0b0b0]'}  rounded-lg text-white w-full h-[48px]`}
                                        disabled={!(addedRows.length > 0 && state.showButton) ?? false}
                                        onClick={submit}
                                    >
                                        Crear orden
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {data && location.state?.item?.direccionPedidosId !== null ? (
                        <div className="">
                            <div className='virtualTable blue-scroll max-h-[92%] monitor-table'>
                                <DataGrid
                                    dataSource={[...Object.values(data), ...addedRows]}
                                    className='sm:min-w-[10px]'
                                    showColumnLines={true}
                                    elementAttr={{ class: 'data-table' }}
                                    showBorders={true}
                                    columnAutoWidth={false}
                                    selectionChanged={selectionChanged}
                                >
                                    <Editing
                                        mode="cell"
                                        allowUpdating={true}
                                    />
                                    <Column dataField="producto_nombre" caption="Producto" allowEditing={false} valueExpr="producto_nombre" displayExpr="producto_nombre"
                                        cellRender={eprops => (
                                            <button
                                                onClick={() => {
                                                    const productoId = eprops.data.productoId;
                                                    if (productoSeleccionado === productoId) {
                                                        SetProductoSeleccionado('');
                                                    } else {
                                                        SetProductoSeleccionado(productoId);
                                                    }
                                                }}
                                            >
                                                {eprops.data.producto_nombre}
                                            </button>
                                        )}
                                    />
                                    <Column dataField="cantidad">
                                        <TextInput
                                            type="number"
                                            value={pedidod.cantidad}
                                            isFocused={true}
                                            autoFocus
                                            // onChange={handleCantidad}
                                            onkeydown={e => {
                                                if (e.key === 'Enter') {
                                                    // Realiza la lógica que deseas al presionar Enter
                                                }
                                            }}
                                        />
                                    </Column>
                                    <Column dataField="remision">
                                        <TextInput
                                            type="text"
                                            value={pedidod.remision}
                                            isFocused={true}
                                            autoFocus
                                            ref={remisionRef} // Establece la referencia al segundo campo
                                            onChange={(e) => {
                                                const inputValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setPedidod({
                                                    ...pedidod,
                                                    remision: inputValue,
                                                });
                                            }}
                                        />
                                    </Column>
                                    <Column alignment='center' cellRender={renderEmptyCell} allowEditing={false} />
                                </DataGrid>
                            </div>
                            <Dialog open={open}
                                onClose={() => {
                                    // handleCloseModal()
                                }}
                                maxWidth="sm" fullWidth>
                                <DialogTitle>
                                    {/* {action === "create" ? "Crear Centro-Costo" : "Editar Centro-Costo"} */}
                                </DialogTitle>

                                <DialogContent>
                                    <div style={{ fontSize: "23px", textAlign: "center" }}>
                                        <h1>Folios</h1>
                                        <br />
                                        {pedidoId.map((f, index) => <h2 key={index}>Pedido: {f.pedido ?? ''}, Folio: {f.folio ?? ''}</h2>)}
                                    </div>
                                    <DialogActions className={'mt-4'}>
                                        <Button
                                            color="error"
                                            onClick={() => {
                                                handleCloseModal();
                                                setOpen(false)
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button color={(action == 'create') ? 'success' : 'warning'} onClick={() => {
                                            navigate('/buscar-cliente');
                                        }}>{(action == 'create') ? 'Aceptar' : 'Cancelar'}</Button>
                                    </DialogActions>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ) : (
                        <>
                            <div className='mt-[10px]'>
                                <h2 style={{ textAlign: 'center', fontSize: '20px', color: 'gray' }}>Por el momento no se ha agregado productos.</h2>
                            </div>
                        </>
                    )
                    }
                </div> :
                <>
                    <div className="h-full w-full">
                        <div className="flex w-full h-[75%] mt-7 justify-center">
                            <img src={camion} />
                        </div>
                        <div className="flex w-full h-[75%] justify-center text-center">
                            <p>Favor de selecionar un cliente en&nbsp;
                                <Link
                                    to='/buscar-cliente'
                                    className="text-blue-700 underline  decoration-1"
                                >
                                    buscar cliente
                                </Link>
                                <br />
                                {`(Serás redireccionado en ${state.redirectionTime})`}
                            </p>
                        </div>
                    </div>
                </>

            }
        </div>
    )
}
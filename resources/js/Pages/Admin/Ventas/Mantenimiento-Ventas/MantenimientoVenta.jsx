import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';
import React, { useEffect, useState } from 'react'
import request from "@/utils";
import TextInput from '@/components/TextInput';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import Imagen from '../../../../../png/camion.png'
import Datatable from '@/components/Datatable';
import { ButtonComp } from '@/components/ButtonComp';
import { Request } from "@/core/Request";
import { Navigation, Info, List, Search, WrongLocation, EditNote, Add, DeleteSweep  } from '@mui/icons-material';

export default function MantenimientoVentas() {
    const [state, setState] = useState({ loading: true, table: false, permission: false, invoice: false, dialog: false, dialogCancelacion: false })
    const [servicio, setTipoServicio] = useState([]);
    const [FormaPagos, setPayForms] = useState([]);
    const [Estaciones, setEstaciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [servicios, setTiposervicios] = useState([])
    const [Pagos, setMetodosPago] = useState([])
    const [filteredServicio, setFilteredServicio] = useState([]);
    const [TableDetail, setTableDetail] = useState([])

    const [data, setData] = useState({
        ventaDetalle_idVentaDetalle: 0,
        catalogoMetodoPagoSAT_descripcion: "",
        cliente_nombrecomercial: "",
        producto_nombre: "",
        ventaEncabezado_idVentaEncabezado: 0,
        ventaDetalle_PrecioProducto: 0,
        ventaDetalle_idMetodoPago: 0,
        ventaDetalle_remision: 0,
        ventaDetalle_total: 0,
        ventaDetalle_idFormasPago: 0,
        formasPago_idFormasPago: "",
        ventaDetalle_idEstacion: "",
        Folio: 0,
        FolioDetalle: 0,
        Cantidad: 0,
        tipoServicio: 0
    });

    const [detalle, setDetalle] = useState({ ImporteCredito: 0, ImporteContado: 0, });
    const getMenuName = async () => {
        const rutaCompleta = location.pathname;
        const nombreModulo = rutaCompleta.split('/').pop();
        await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
    };

    const Opciones = async (item) => {
        setDetalle({ ImporteCredito: item.ventaEncabezado_totalVentaImporteCredito, ImporteContado: item.ventaEncabezado_totalVentaImporteContado });
        setState(prevState => ({ ...prevState, table: true }));
        const info = { id: item.ventaEncabezado_idVentaEncabezado };
        const SaleDetail = await Request._post(route('GetbydVentaEncabezadoVenta'), info, { error: { message: 'No se encontraron detalles de esta venta' } })
        if (SaleDetail) { setTableDetail(SaleDetail) }
    };

    const getRequest = async (e) => {
        getProductos();
        getPayMethods();
        getFormaPago();
        getEstaciones();
        getServicio();
    }

    const getServicio = async () => {
        const response = await fetch(route("tipos-servicios.index"));
        const data = await response.json();
        setTiposervicios(data);
    };
    const getProductos = async () => {
        const responseE = await fetch(route("productos.index"));
        const dataE = await responseE.json();
        setProductos(dataE);
    };

    const getPayMethods = async () => {
        const response = await fetch(route("sat/metodo-pago.index"));
        const data = await response.json();
        setMetodosPago(data);
    };
    const getFormaPago = async () => {
        const response = await fetch(route("formas-pago.index"));
        const data = await response.json();
        setPayForms(data);
    };

    const getEstaciones = async () => {
        const responseE = await fetch(route("estacion.index"));
        const dataE = await responseE.json();
        setEstaciones(dataE);
    };


    const Buscar = async () => {
        const requestData = await request(route("mantenimientoVenta"), 'POST', { id: data.tipoServicio }, { enabled: true, error: { message: 'No se logro la peticion', type: 'error' }, success: { message: "Datos encontrados", type: 'success' } })
        setTipoServicio(requestData)
        setFilteredServicio(requestData)
        setState(prevState => ({ ...prevState, invoice: requestData.length === 0 ? false : true }));
    }


    useEffect(() => {
        const filteredData = servicio.filter((item) => item.ventaEncabezado_idVentaEncabezado && item.ventaEncabezado_idVentaEncabezado.includes(data.Folio));
        setTipoServicio(filteredData);
    }, [data.Folio]);



    const CancelarVenta = async (event) => {
        try {

            console.log("event", event);

            const idventa = { id: event.ventaEncabezado_idVentaEncabezado }
            await request(route("cancelarVenta"), 'POST', { id: idventa.id }, { enabled: true, error: { message: 'No se logro la peticion', type: 'error' }, success: { message: "Venta Cancelada", type: 'success' } })
            setState(prevState => ({ ...prevState, dialogCancelacion: false }));
        } catch (error) {
            console.error("Error al cancelar la venta:", error);
        }
    };






    const handleRowClick = (rowData) => {
        console.log("rowdata", rowData)
        setData(
            {

                cliente_nombrecomercial: rowData.cliente_nombrecomercial,
                ventaDetalle_cantidad: rowData.ventaDetalle_cantidad,
                ventaDetalle_idProducto: rowData.producto_idProducto,
                ventaDetalle_remision: rowData.ventaDetalle_remision,
                ventaDetalle_PrecioProducto: rowData.ventaDetalle_PrecioProducto,
                catalogoMetodoPagoSAT_descripcion: rowData.catalogoMetodoPagoSAT_id,
                ventaDetalle_idEstacion: rowData.ventaDetalle_idEstacion,
                Folio: rowData.ventaDetalle_idVentaDetalle,
                tipoServicio: data.tipoServicio,
                producto_nombre: rowData.producto_idProducto,
                ventaDetalle_idFormasPago: rowData.ventaDetalle_idFormasPago,
                Cantidad: rowData.ventaDetalle_cantidad,
                ventaDetalle_idMetodoPago: rowData.ventaDetalle_idMetodoPago,
                ventaEncabezado_idVentaEncabezado: rowData.ventaEncabezado_idVentaEncabezado
            }
        )
    };

    const ActualizarVenta = async (e) => {
        const requestBody = {
            ventaDetalle_cantidad: data.Cantidad,
            ventaDetalle_idProducto: data.producto_nombre,
            ventaDetalle_remision: data.ventaDetalle_remision,
            ventaDetalle_PrecioProducto: data.ventaDetalle_PrecioProducto,
            ventaDetalle_idEstacion: data.ventaDetalle_idEstacion,
            ventaDetalle_idMetodoPago: data.ventaDetalle_idMetodoPago,
            ventaDetalle_total: data.Cantidad * data.ventaDetalle_PrecioProducto,
            ventaDetalle_idFormasPago: data.ventaDetalle_idFormasPago,
            Folio: data.Folio,
        };
        const response = await request(route('mantenimientoVentaActualizar', data.Folio), 'POST', { ...requestBody }, { enabled: true, success: { type: 'info', message: "Actualizado correctamente" } })


    };

    useEffect(() => {
        getMenuName()
        getRequest()
    }, []);

    useEffect(() => {
        if (servicios) setState(prevState => ({ ...prevState, loading: false }));
    }, [servicios]);

    return (
        <div className="relative h-[100%] pb-6 px-3 overflow-auto blue-scroll ">
            <section className='gap-6 flex-col sm:w-full md:w-[275px] sm:float-none md:float-left border-2 rounded-xl relative px-4 pb-4'>
                <SelectComp
                    id="Tipo de servicio"
                    label="Tipo de servicio"
                    options={servicios}
                    value={data.tipoServicio || ""}
                    onChangeFunc={(e) => setData({ ...data, tipoServicio: e })}
                    data="tipoServicio_descripcion"
                    valueKey="tipoServicio_idTipoServicio"
                />
                <TextInput
                    label="Folio"
                    id="Folio"
                    type="text"
                    name="Folio"
                    value={data.Folio || ""}
                    onChange={(e) => setData({ ...data, Folio: e.target.value })}
                    className="block w-full mt-1 texts"
                    autoComplete="Folio"
                    disabled={!state.invoice}
                />


                <ButtonComp label={'Buscar'} onClick={Buscar} />
            </section>
            <section className='relative flex flex-col h-full items-stretch sm:pl-0 md:pl-4 sm:mt-4 md:mt-0'>
                {servicio ? (
                    <div className="w-full monitor-table" >
                        <Datatable
                            data={servicio}
                            virtual={true}
                            searcher={false}
                            columns={[
                                { header: "Folio", accessor: "ventaEncabezado_idVentaEncabezado" },
                                { header: "Unidad", accessor: "unidad_numeroComercial" },
                                { header: "Vendedor", accessor: "vendedor" },
                                { header: "Turno", accessor: "turno_nombreTurno" },
                                { header: "Capturador", accessor: "usuario_nombre" },
                                { header: "Fecha Venta", accessor: "ventaEncabezado_fechaVenta", cell: ({ item }) => (new Date(item.ventaEncabezado_fechaVenta)).formatMX() },
                                { header: "Importe Contado", accessor: "ventaEncabezado_totalVentaImporteContado" },
                                { header: "Importe Credito", accessor: "ventaEncabezado_totalVentaImporteCredito" },
                                { header: "Opciones", cell: ({ item }) => <button onClick={() => Opciones(item)}><Info /></button> },

                                {
                                    header: "Cancelar Venta",
                                    cell: ({ item }) => (
                                        <button onClick={() => setState({ ...state, dialogCancelacion: true, item: item })}>
                                            <DeleteSweep />
                                        </button>
                                    )
                                }
                            ]}
                        />
                    </div>

                ) : (
                    <div className='flex flex-col relative h-full items-center overflow-hidden self-center justify-center' >
                        <img className='object-scale-down w-96 non-selectable' src={Imagen} alt="" />
                        <span className='text-gray-600 non-selectable'>Selecciona un tipo de servicio.</span>
                    </div>
                )}
            </section>
            <Dialog open={state.table} onClose={() => setState(prevState => ({ ...prevState, table: false }))} maxWidth="xl" maxHeight="lg">
                <DialogContent>
                    <div className='flex gap-7 h-[60%] flex-row'>
                        <div className='flex flex-col h-[60%] w-[20%]'>
                            <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                                <div className='mt-4 gap-4' >
                                    <h2>Detalle de la venta</h2>
                                    <hr />
                                </div>
                                <TextInput
                                    label="N° Control"
                                    id="Control"
                                    type="text"
                                    name="Control"
                                    disabled={!state.invoice}
                                    value={data.ventaEncabezado_idVentaEncabezado}
                                    autoComplete="Control"
                                    isFocused={true}
                                    onChange={(e) => setData({ ...data, ventaEncabezado_idVentaEncabezado: e.target.value })}
                                />
                                <TextInput
                                    label="FolioDetalle"
                                    id="FolioDetalle"
                                    type="text"
                                    name="Folio"
                                    disabled={!state.invoice}
                                    value={data.Folio}
                                    autoComplete="Control"
                                    isFocused={true}
                                    onChange={(e) => setData({ ...data, FolioDetalle: e.target.value })}
                                />
                                <TextInput
                                    label="Cliente"
                                    id="Cliente"
                                    type="text"
                                    name="Cliente"
                                    value={data.cliente_nombrecomercial}
                                    autoComplete="Cliente"
                                    disabled={!state.permission}
                                    isFocused={true}
                                    onChange={(e) => setData({ ...data, cliente_nombrecomercial: e.target.value })}
                                />

                                <SelectComp
                                    id="producto_nombre "
                                    label="Producto"
                                    options={productos}
                                    value={data.producto_nombre || ""}
                                    data="producto_nombre"
                                    disabled={!state.permission}
                                    valueKey="producto_idProducto"
                                    onChangeFunc={(e) => setData({ ...data, producto_nombre: e })}

                                />
                                <TextInput
                                    label="Remision"
                                    id="Remision"
                                    type="text"
                                    name="Remision"
                                    value={data.ventaDetalle_remision}
                                    autoComplete="Remision"
                                    isFocused={true}
                                    disabled={!state.permission}
                                    onChangeFunc={(e) => setData({ ...data, ventaDetalle_remision: e })}
                                />
                                <TextInput
                                    label="Precio"
                                    id="Precio"
                                    type="text"
                                    name="Precio"
                                    value={data.ventaDetalle_PrecioProducto}
                                    autoComplete="Precio"
                                    disabled={!state.permission}
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            ventaDetalle_PrecioProducto: e.target.value,
                                        })
                                    }

                                />
                                <TextInput
                                    label="Cantidad"
                                    id="Cantidad"
                                    type="text"
                                    name="Cantidad"
                                    value={data.Cantidad}
                                    autoComplete="Cantidad"
                                    disabled={!state.permission}
                                    isFocused={true}
                                    onChange={(e) => setData({ ...data, Cantidad: e.target.value })}
                                />
                                <SelectComp
                                    id="Estacion"
                                    label="Estacion"
                                    options={Estaciones}
                                    value={data.ventaDetalle_idEstacion || ""}
                                    data="estacion_nombre"
                                    valueKey="estacion_idEstacion"
                                    disabled={!state.permission}
                                    onChangeFunc={(e) => { setData({ ...data, ventaDetalle_idEstacion: e }); }}

                                />
                                <SelectComp
                                    id="Tipo venta"
                                    label="Tipo venta"
                                    options={Pagos}
                                    value={data.ventaDetalle_idMetodoPago || ""}
                                    data="catalogoMetodoPagoSAT_descripcion"
                                    valueKey="catalogoMetodoPagoSAT_id"
                                    disabled={!state.permission}
                                    onChangeFunc={(e) => { setData({ ...data, ventaDetalle_idMetodoPago: e }); }}
                                />

                                <SelectComp
                                    id="Forma Pago"
                                    label="Forma Pago"
                                    options={FormaPagos}
                                    value={data.ventaDetalle_idFormasPago || ""}
                                    data="formasPago_descripcion"
                                    valueKey="formasPago_idFormasPago"
                                    disabled={!state.permission}
                                    onChangeFunc={(e) => { setData({ ...data, ventaDetalle_idFormasPago: e }); }}
                                />
                            </div>
                        </div>

                        <div className='flex flex-col w-full'>
                            <div className='virtualTable blue-scroll flex-grow-0' >
                                {TableDetail && (
                                    <Datatable
                                        data={TableDetail}
                                        virtual={true}
                                        searcher={false}
                                        columns={[
                                            { header: "Folio", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.ventaDetalle_idVentaDetalle} </button> },
                                            { header: "Producto", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.producto_nombre} </button> },
                                            { header: "Remision", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.ventaDetalle_remision} </button> },
                                            { header: "Cliente", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.cliente_razonsocial} </button> },
                                            { header: "Tipo Venta", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.catalogoMetodoPagoSAT_descripcion} </button> },
                                            { header: "Cantidad", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.ventaDetalle_cantidad} </button> },
                                            { header: "Precio", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.ventaDetalle_PrecioProducto} </button> },
                                            { header: "Total", cell: ({ item }) => <button onClick={() => handleRowClick(item)}> {item.ventaDetalle_total} </button> },
                                        ]}
                                    />
                                )}
                            </div>
                            <br />
                            <div className="flex flex-col w-full justify-center shadow-md bg-[#1B2654] border-2 px-4 rounded-xl text-white text-[12px] gap-4" style={{ height: '10%' }} >
                                <div className='flex w-full justify-between'> <span>Importe Contado:</span> <span>$ {parseFloat(detalle.ImporteContado).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} </span></div>
                                <div className='flex w-full justify-between'> <span>Importe Credito:</span> <span>$ {parseFloat(detalle.ImporteCredito).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-2 ">
                        <ButtonComp
                            tooltip={"Editar"}
                            onClick={() => setState(prevState => ({ ...prevState, permission: true }))}
                            className={`!h-[45px] !w-[100%] !mt-[10px]`}
                            color='#FC4C02'
                            label={<> <EditNote /> </>}
                        />

                        <ButtonComp
                            tooltip={"Guardar"}
                            onClick={ActualizarVenta}
                            className={`!h-[45px] !w-[100%] !mt-[10px]`}
                            color='green'
                            label={<> <Add /> </>}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={state.dialogCancelacion} onClose={() => setState(prevState => ({ ...prevState, dialogCancelacion: false }))} maxWidth="xl" maxHeight="lg">
                <DialogContent>
                    <div className='flex gap-7 h-[60%] flex-row w-full'>
                        <span>{`¿Estás seguro de que deseas cancelar la venta`} <br /></span>
                        {/* Aquí puedes mostrar el contenido de item */}
                        {/* {console.log(state.item)} */}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: 'red' }} onClick={() => setState(prevState => ({ ...prevState, dialogCancelacion: false }))}>Cancelar</Button>
                    <Button onClick={() => CancelarVenta(state.item)}>Aceptar</Button>
                </DialogActions>
            </Dialog>

        </div >
    );

}
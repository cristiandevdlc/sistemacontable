import { useState, useEffect } from "react";
import Datatable from '@/components/Datatable';
import LoadingDiv from '@/components/LoadingDiv';
import TextInput from "@/components/TextInput";
import SelectComp from "@/components/SelectComp";
import Tooltip from '@mui/material/Tooltip/Tooltip'
import DownloadingIcon from '@mui/icons-material/Downloading';
import ReporteClientePDF from "./ReporteClientePDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Imagen from '../../Admin/Telermark/ClientesPedidos/img/camion.png'


const VentaDetalle = () => {
    const [state, setState] = useState({ loading: true, open: false, metPagos: [], ready: false })
    const [data, setData] = useState({ idVentadetalleTiendita: null, idVentaencabezado: null, idArticulo: null, Precio: 0, Cantidad: 0, fechaCompra: null, total: 0 })
    const [ventaDetalleResponse, setVentaDetalleResponse] = useState([])
    const [ventaEncabezadoResponse, setVentaEncabezadoResponse] = useState([])
    const [SelectedCliente, setSelectedCliente] = useState(null)
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);
    const [startDate, setStartDate] = useState(''); // Estado para la fecha de inicio
    const [endDate, setEndDate] = useState(''); // Estado para la fecha de final
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [reporteCliente, setReporteCliente] = useState('')
    const [reporteVenta, setReporteVentasTotal] = useState('')
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [downloadPDFEnabled, setDownloadPDFEnabled] = useState(false);

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
        const [clientesResponse, metPagoResponse, articulosResponse, ventaDetalleResponse] = await Promise.all([
            fetch(route("nombreClientes")).then(res => res.json()),
            fetch(route("sat/metodo-pago.index")).then(res => res.json()),
            fetch(route("articulos.index")).then(res => res.json()),
            fetch(route("venta-detalle.index")).then(res => res.json()),
        ])
        setVentaDetalleResponse(ventaDetalleResponse)
        setVentaEncabezadoResponse(ventaEncabezadoResponse)
        return { clientesResponse, metPagoResponse, articulosResponse, ventaDetalleResponse, }
    }

    const getVentas = async () => {
        const response = await fetch(route('detalles-venta'), {
            method: "POST",
            body: JSON.stringify({
                id: SelectedCliente,
                startDate: startDate,
                endDate: endDate,
                purchaseType: selectedPaymentMethod
            }),
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            const sumaCompras = await response.json();
            setData({
                ...data,
                total: sumaCompras
            });
            setVentaEncabezadoResponse(sumaCompras);
        }
    }
    const getDetalleCompra = async () => {
        const response = await fetch(route('compra-productos'), {
            method: "POST",
            body: JSON.stringify({
                id: compraSeleccionada,
                idArticulo: ventaDetalleResponse.idArticulo,
                Precio: ventaDetalleResponse.Precio,
                Cantidad: ventaDetalleResponse.Cantidad

            }),
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            const productosComprados = await response.json();
            setVentaDetalleResponse(productosComprados);
        }
    }

    const getReporteClientePDF = async () => {
        const response = await fetch(route('reporte-clientes-pdf'), {
            method: "POST",
            body: JSON.stringify({
                id: SelectedCliente,
                startDate: startDate,
                endDate: endDate,
                purchaseType: selectedPaymentMethod,
            }),
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            const productosComprados = await response.json();
            return { productosComprados }

        }
    }

    useEffect(() => {
        getDetalleCompra()
    }, [compraSeleccionada, SelectedCliente]);

    useEffect(() => {
    }, [reporteCliente, reporteVenta]);

    useEffect(() => {
        getMenuName()
        getFetchData()
            .then((res) => {
                setState({
                    ...state,
                    clientes: res.clientesResponse,
                    metPagos: res.metPagoResponse,
                    articulos: res.articulosResponse,
                    VentaEncabezado: res.ventaEncabezadoResponse,
                    VentaDetalle: res.ventaDetalleResponse,
                    loading: false
                })
            })
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            <section className="overflow-hidden  sm:grid sm:grid-cols-2 bg-white">
                <div className="">
                    <div >
                        <div className="grid grid-cols-1 gap-4">
                            <SelectComp
                                label="Clientes"
                                options={state.clientes}
                                value={SelectedCliente}
                                data="nombre_completo"
                                valueKey="IdPersona"
                                onChangeFunc={(value) => setSelectedCliente(value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                            <TextInput
                                label='Fecha inicio'
                                className="block w-full mt-1 texts h-32"
                                type='date'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <TextInput
                                label='Fecha final'
                                className="block w-full mt-1 texts h-32"
                                type='date'
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                            <SelectComp
                                label="Método Pago"
                                options={[
                                    { catalogoMetodoPagoSAT_id: "todo", catalogoMetodoPagoSAT_descripcion: "TODO" }, 
                                    ...state.metPagos
                                ]}
                                value={selectedPaymentMethod}
                                data="catalogoMetodoPagoSAT_descripcion"
                                valueKey="catalogoMetodoPagoSAT_id"
                                onChangeFunc={(value) => setSelectedPaymentMethod(value)}
                            />
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 -mt-[30px] ml-[40px]">
                                <button
                                    onClick={() => {
                                        getVentas().then((ventasData) => {
                                            setDownloadPDFEnabled(true);
                                            setGeneratingPDF(true);
                                            getReporteClientePDF().then((pdfData) => {
                                                setReporteCliente(pdfData.productosComprados);
                                                setGeneratingPDF(false);
                                            });
                                        });
                                    }}
                                >
                                    <Tooltip title="Buscar Datos">
                                        <span style={{ fontSize: '50px', color: '#093F8D', marginTop: "25px" }} className="material-icons">
                                            search
                                        </span>
                                    </Tooltip>
                                </button>
                                <button onClick={() => getReporteClientePDF().then(res => setReporteCliente(res.productosComprados))}>
                                    {downloadPDFEnabled && (
                                        <PDFDownloadLink document={<ReporteClientePDF data={reporteCliente} startDate={startDate} endDate={endDate} selectedPaymentMethod={selectedPaymentMethod} SelectedCliente={SelectedCliente} />} fileName='reporte-cliente.pdf'>
                                            {({ blob, url, loading, error }) =>
                                                loading ? '' : (
                                                    <Tooltip title="Descargar PDF">
                                                        <span style={{ fontSize: '90px', color: '#29C97B' }}>
                                                            <DownloadingIcon style={{ fontSize: '50px' }} />
                                                        </span>
                                                    </Tooltip>
                                                )
                                            }
                                        </PDFDownloadLink>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>

                    {ventaEncabezadoResponse && (
                        <Datatable
                            searcher={false}
                            data={ventaEncabezadoResponse}
                            columns={[
                                {
                                    header: 'Total', accessor: 'total', cell: eprops => (
                                        <button
                                            onClick={() => {
                                                const compraId = eprops.item.idVentaEncabezadoTiendita;
                                                if (compraSeleccionada === compraId) {
                                                    setCompraSeleccionada('');
                                                } else {
                                                    setCompraSeleccionada(compraId);
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        >
                                            ${Math.round(eprops.item.total).toFixed(2)}
                                        </button>
                                    )
                                },
                                {
                                    header: 'Fecha',
                                    accessor: 'fechaCompra',
                                    cell: eprops => {
                                        const fecha = new Date(eprops.item.fechaCompra);
                                        return fecha.toLocaleDateString();
                                    },
                                },
                            ]}
                        />
                    )}
                </div>
                <div className="h-56 w-full object-cover sm:h-full mt-[60px] " >
                    <div className="col-span-5 mt-3 text-center">
                        {compraSeleccionada !== null ? (
                            <Datatable
                                searcher={false}
                                data={ventaDetalleResponse}
                                columns={[
                                    { header: 'Producto', accessor: 'idArticulo', cell: eprops => eprops.item.articulos.articulo_nombre },
                                    { header: 'Cantidad', accessor: 'Cantidad', cell: eprops => `${Math.round(eprops.item.Cantidad).toFixed(0)}` },
                                    { header: 'Precio Venta', accessor: 'Precio', cell: eprops => `$${Math.round(eprops.item.Precio).toFixed(2)}` },
                                ]}
                            />
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={Imagen} alt="" style={{ width: '50%', marginTop: '20%', marginRight: '15%' }} className="h-56 w-full object-cover sm:h-full" />
                                </div>
                                <h2 style={{ fontSize: '24px', padding: '10px', marginRight: '10%' }}>Seleccione un total para ver los detalles.</h2>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VentaDetalle;
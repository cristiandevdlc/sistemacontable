import { useState, useEffect } from "react";
import Datatable from '@/components/Datatable';
import LoadingDiv from '@/components/LoadingDiv';
import TextInput from "@/components/TextInput";
import SelectComp from "@/components/SelectComp";
import Tooltip from '@mui/material/Tooltip/Tooltip'
import RequestPageIcon from '@mui/icons-material/RequestPage';
import Imagen from '../../Admin/Telermark/ClientesPedidos/img/camion.png'
import ReporteVentasTotalPDF from "./ReporteVentasTotalPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DownloadingIcon from '@mui/icons-material/Downloading';


const ReporteDeVentaTiendita = () => {
    const [state, setState] = useState({ loading: true, open: false, metPagos: [], ready: false })
    const [data, setData] = useState({ idVentadetalleTiendita: null, idVentaencabezado: null, idArticulo: null, Precio: 0, Cantidad: 0, fechaCompra: null, total: 0 })
    const [ventaDetalleResponse, setVentaDetalleResponse] = useState([])
    const [ventaEncabezadoResponse, setVentaEncabezadoResponse] = useState([])
    const [SelectedCliente, setSelectedCliente] = useState(null)
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [reporteCliente, setReporteCliente] = useState('')
    const [reporteVenta, setReporteVentasTotal] = useState()
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
        const [clientesResponse, metPagoResponse, articulosResponse, ventaDetalleResponse,] = await Promise.all([
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

    const getReporteVentasTotalPDF = async () => {
        const response = await fetch(route('reporte-ventas-total-pdf'), {
            method: "POST",
            body: JSON.stringify({
                startDate: startDate,
                endDate: endDate,
                purchaseType: selectedPaymentMethod,
            }),
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            const productosComprados = await response.json();
            setReporteVentasTotal(productosComprados);
        }
    }


    useEffect(() => {
        getDetalleCompra()
    }, [compraSeleccionada, SelectedCliente]);

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
            {state.loading && <LoadingDiv />}
            {!state.loading &&
                <section className="sm:grid sm:grid-cols-1 bg-white">
                    <div className="">
                        <div >

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
                                        { catalogoMetodoPagoSAT_id: "todo", catalogoMetodoPagoSAT_descripcion: "TODO" }, // Usar "todo" como valor
                                        ...state.metPagos
                                    ]}
                                    value={selectedPaymentMethod}
                                    data="catalogoMetodoPagoSAT_descripcion"
                                    valueKey="catalogoMetodoPagoSAT_id"
                                    onChangeFunc={(value) => setSelectedPaymentMethod(value)}
                                />
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 -mt-[10px] ml-[40px]">
                                    <button
                                        onClick={() => {
                                            getVentas().then((ventasData) => {
                                                setDownloadPDFEnabled(true);
                                                setGeneratingPDF(true);
                                                getReporteVentasTotalPDF().then((pdfData) => {
                                                    setReporteVentasTotal(pdfData.productosComprados);
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
                                    <button onClick={() => getReporteVentasTotalPDF().then(res => setReporteVentasTotal(res.productosComprados))}>

                                        <PDFDownloadLink document={<ReporteVentasTotalPDF data={reporteVenta} startDate={startDate} endDate={endDate} selectedPaymentMethod={selectedPaymentMethod} SelectedCliente={SelectedCliente} />} fileName='reporte-general.pdf'>
                                            {({ blob, url, loading, error }) =>
                                                loading ? '' : (
                                                    <Tooltip title="Descargar PDF">
                                                        <span style={{ fontSize: '90px', color: '#255255' }}>
                                                            <DownloadingIcon style={{ fontSize: '50px' }} />
                                                        </span>
                                                    </Tooltip>
                                                )
                                            }
                                        </PDFDownloadLink>

                                    </button>
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>

                        <div className="">
                            {reporteVenta ? (
                                <Datatable
                                    searcher={false}
                                    data={reporteVenta}
                                    columns={[
                                        { header: 'Nombre', accessor: 'idPersona', cell: eprops => eprops.item.nombreCompleto },
                                        { header: 'Total Contado', accessor: 'totalContado', cell: eprops => `$${Math.round(eprops.item.totalContado).toFixed(2)}` },
                                        { header: 'Total Crédito', accessor: 'totalCredito', cell: eprops => `$${Math.round(eprops.item.totalCredito).toFixed(2)}` },
                                    ]}
                                />
                            ) : (
                                <div className="h-full w-full">
                                    <div className="flex w-full h-[75%] mt-7 justify-center">
                                        <img src={Imagen} />
                                    </div>
                                    <div className="flex w-full h-[75%] justify-center text-center">
                                        <p>{`(Seleccione un rango de fechas y un método de pago.)`}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>
            }
        </div>
    );
}

export default ReporteDeVentaTiendita;
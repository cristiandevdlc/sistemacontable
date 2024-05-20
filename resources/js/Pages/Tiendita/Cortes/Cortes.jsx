import Datatable from '@/components/Datatable';
import { useState, useEffect } from "react";
import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';
import request from "@/utils";
import Imagen from '../../Admin/Telermark/ClientesPedidos/img/camion.png'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CortePDF from "./CortePDF";

const Cortes = () => {
    const [state, setState] = useState({ loading: true, open: false });
    const [open, setOpen] = useState(false);
    const [cortesResponse, setCortesResponse] = useState([]);
    const [almacenResponse, setAlmacenResponse] = useState()
    const [almacenSelected, setalmacenSelected] = useState()
    const [corteDetalle, setCorteDetalle] = useState()
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
        try {
            const cortesData = await fetch(route("cortes.index")).then(res => res.json());
            const cortesDataSorted = cortesData.sort((a, b) => b.id - a.id);
            setCortesResponse(cortesDataSorted);
            setState({ ...state, loading: false });
        } catch (error) {
            console.error("Error al obtener o procesar los datos:", error);
            setState({ ...state, loading: false });
        }
    }

    const FetchAlmacen = async () => {
        const [almacenResponse] = await Promise.all([
            fetch(route("almacen.index")).then(res => res.json()),
        ]);
        setAlmacenResponse(almacenResponse);
        return { almacenResponse }
    }

    const handleAlmacenSelection = (almacenId) => {
        setalmacenSelected(almacenId);
    };

    const cortesXalmacenId = async () => {
        try {
            const response = await request(route("cortes-almacen"), 'POST', { almacen_id: almacenSelected }, { enabled: true });
            const sortedCortes = response.sort((a, b) => b.id - a.id);
            setCortesResponse(sortedCortes);
            return { response };
        } catch (error) {
            console.error("Error al obtener o procesar los datos:", error);
            return { error };
        }
    };

    const CorteDetalle = async (paramId) => {
        const corteId = {
            corteId: paramId
        }
        const response = await request(route("cortes-detalle"), 'POST', { corteId: corteId }, { enabled: true, error: { message: 'No se encontrarón detalles del corte', type: 'error' }, success: { message: "Detalle de corte encontrado", type: 'success' } });
        setCorteDetalle(response);
        return { response }
    };
    const handleCloseModal = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (almacenSelected) {
            cortesXalmacenId()
        }
    }, [almacenSelected]);

    console.log('cortesResponse', cortesResponse)


    useEffect(() => {
        getFetchData()
        FetchAlmacen()
        getMenuName()
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading && <LoadingDiv />}
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
                    >
                    </SelectComp>
                </div>
                <div className='mt-12'>
                    {almacenSelected && cortesResponse ? (
                        <Datatable
                            data={cortesResponse}
                            searcher={false}
                            columns={[
                                { header: 'Folio', accessor: 'id', cell: eprops => eprops.item.id },
                                {
                                    header: 'Fecha Inicio', accessor: 'fecha_inicio', cell: eprops => {
                                        const fecha = new Date(eprops.item.fecha_inicio);
                                        return fecha.toLocaleDateString();
                                    },
                                },
                                { header: 'Usuario', accessor: 'usuario_apertura', cell: eprops => eprops.item.usuario_apertura },
                                { header: 'Efectivo Inicial', accessor: 'montoInicial', cell: eprops => `$${Math.round(eprops.item.montoInicial).toFixed(2)}` },
                                { header: 'Venta a Contado', accessor: 'montoContado', cell: eprops => `$${Math.round(eprops.item.montoContado).toFixed(2)}` },
                                { header: 'Venta a Crédito', accessor: 'montoCredito', cell: eprops => `$${Math.round(eprops.item.montoCredito).toFixed(2)}` },
                                { header: 'Total de Venta', accessor: 'montoFinal', cell: eprops => `$${Math.round(eprops.item.montoFinal).toFixed(2)}` },
                                {
                                    header: 'Acciones',
                                    cell: (eprops) => (
                                        <div>

                                            <Button onClick={() => {
                                                CorteDetalle(eprops.item.id)
                                                setOpen(true);
                                            }}>

                                                <Tooltip title="Ver Detalles de Corte">
                                                    <span style={{ color: '#255', marginRight: '8px', cursor: 'pointer' }}>
                                                        <VisibilityIcon style={{ fontSize: '30px' }} />
                                                    </span>
                                                </Tooltip>

                                            </Button>
                                            <Button onClick={() => { CorteDetalle(eprops.item.id) }}>
                                                <PDFDownloadLink document={<CortePDF data={corteDetalle} />} fileName='corte-detalle.pdf'>
                                                    {({ blob, url, loading, error }) =>
                                                        loading ? '' : (
                                                            <Tooltip title="Descargar PDF">
                                                                <span style={{ color: 'red', marginRight: '8px', cursor: 'pointer' }}>
                                                                    <PictureAsPdfIcon style={{ fontSize: '35px' }} />
                                                                </span>
                                                            </Tooltip>
                                                        )
                                                    }
                                                </PDFDownloadLink>
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}

                        />
                    ) : (
                        <>
                            <div className="h-full w-full">
                                <div className="flex w-full h-[75%] mt-7 justify-center">
                                    <img src={Imagen} />
                                </div>
                                <div className="flex w-full h-[75%] justify-center text-center">
                                    <p>{`(Seleccione un almácen para ver los cortes.)`}</p>
                                </div>
                            </div>
                        </>
                    )}
                    <Dialog open={open}
                        onClose={() => {
                            handleCloseModal()
                        }}
                        maxWidth="lg" fullWidth>
                        <DialogTitle>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#297ECD' }}>Folio:</span>
                                    {corteDetalle && corteDetalle.length > 0 && (
                                        <span>{corteDetalle[0].Folio}</span>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#297ECD' }}>Fecha Inicio:</span>
                                    {corteDetalle && corteDetalle.length > 0 && (
                                        <span>{corteDetalle[0].fecha_inicio}</span>
                                    )}
                                </div>
                            </div>
                            <br />

                            <Datatable
                                searcher={false}
                                data={corteDetalle}
                                columns={[
                                    {
                                        header: 'Articulo',
                                        accessor: 'nombreArticulo',
                                        cell: eprops => {
                                            const detallesVenta = eprops.item.detallesVenta;
                                            if (detallesVenta && detallesVenta.length > 0) {
                                                const detallesArticulos = detallesVenta.map((detalle, index) => (
                                                    <div key={index}>
                                                        {detalle.nombreArticulo}
                                                    </div>
                                                ));

                                                return detallesArticulos;
                                            }
                                            return 'No hay detalles de venta';
                                        }
                                    },
                                    {
                                        header: 'Precio',
                                        accessor: 'Precio',
                                        cell: eprops => {
                                            const detallesVenta = eprops.item.detallesVenta;
                                            if (detallesVenta && detallesVenta.length > 0) {
                                                const detallesPrecios = detallesVenta.map((detalle, index) => (
                                                    <div key={index}>
                                                        {`$${detalle.Precio}`}
                                                    </div>
                                                ));

                                                return detallesPrecios;
                                            }
                                            return 'No hay detalles de venta';
                                        }
                                    },
                                    {
                                        header: 'Cantidad',
                                        accessor: 'Cantidad',
                                        cell: eprops => {
                                            const detallesVenta = eprops.item.detallesVenta;
                                            if (detallesVenta && detallesVenta.length > 0) {
                                                const detallesCantidades = detallesVenta.map((detalle, index) => (
                                                    <div key={index}>
                                                        {detalle.Cantidad}
                                                    </div>
                                                ));

                                                return detallesCantidades;
                                            }
                                            return 'No hay detalles de venta';
                                        }
                                    },

                                    { header: 'Método de Pago', accessor: 'idMetodoPago' },
                                    { header: 'Fecha Compra', accessor: 'fechaCompra' },
                                    {
                                        header: 'Total',
                                        accessor: 'total',
                                        cell: eprops => (
                                            <div>
                                                {`$${eprops.item.total}`}
                                            </div>
                                        )
                                    },
                                ]}
                            />
                            {corteDetalle && corteDetalle.length > 0 && (
                                <div className='mt-8'>
                                    <span style={{ fontWeight: 'bold', marginLeft: '905px', color: '#297ECD' }}>Monto Final: </span>
                                    <span>{`$${corteDetalle[0].montoFinal}`}</span>
                                </div>
                            )}
                        </DialogTitle>
                        <DialogContent>
                            <DialogActions className={'mt-4'}>
                                <Button
                                    color="error"
                                    onClick={() => {
                                        handleCloseModal();
                                        setOpen(false)
                                    }}
                                >
                                    Cerrar Detalle
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Cortes;

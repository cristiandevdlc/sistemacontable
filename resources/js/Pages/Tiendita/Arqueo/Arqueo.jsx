import LoadingDiv from "@/components/LoadingDiv";
import SelectComp from "@/components/SelectComp";
import Datatable from "@/components/Datatable";
import { useState, useEffect } from "react";
import DialogComp from "@/components/DialogComp";
import request from "@/utils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Tooltip from '@mui/material/Tooltip/Tooltip'
import DownloadingIcon from '@mui/icons-material/Downloading';
import ReporteArqueoPDF from "./ReporteArqueoPDF";
import Imagen from '../../Admin/Telermark/ClientesPedidos/img/camion.png';
import AutoModeIcon from '@mui/icons-material/AutoMode';


const Arqueo = () => {
    const [articulosResponse, setArticulosResponse] = useState()
    const [almacenResponse, setAlmacenResponse] = useState()
    const [almacenSelected, setalmacenSelected] = useState()
    const [reportePDF, setReportePDF] = useState()
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [downloadPDFEnabled, setDownloadPDFEnabled] = useState(false);
    const [state, setState] = useState({
        loading: false,
        almacen: null,
        articulos: null,
        existenciaArt: null,
        compration: null,
        create: 'create',
        open: false,
        errors: [],
    });

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
        const [almacenResponse, compraResponse,] = await Promise.all([
            fetch(route("almacen.index")).then(res => res.json()),
            fetch(route("compra.index")).then(res => res.json()),

        ]);
        setArticulosResponse(articulosResponse);
        setAlmacenResponse(almacenResponse);
        return { almacenResponse, compraResponse, }
    }

    const handleAlmacenSelection = (almacenId) => {
        setalmacenSelected(almacenId);
    };

    const artitulosXalmacenId = async () => {
        const response = await request(route("arqueo-inv"), 'POST', { almacen_id: almacenSelected }, { enabled: true });
        setArticulosResponse(response);
        return { response }
    };

    const submit = () => {
        setState({ ...state, open: !state.open });
    }

    const handleCloseModal = () => {
        setState({ ...state, open: !state.open, action: '' });
    }

    useEffect(() => {
        getMenuName()
        getFetchData().then(
            (res) => {
                setState({
                    ...state,
                    compra: res.compraResponse,
                    loading: false,
                });
                setState({ ...state, loading: false });
            }
        )
    }, [])

    useEffect(() => {
        if (almacenSelected) {
            artitulosXalmacenId()
        }
    }, [almacenSelected]);

    useEffect(() => {
    }, [reportePDF]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading && <LoadingDiv />}
            <section >
                <div className="">
                    <div className="grid grid-cols-3 gap-8">
                        <SelectComp
                            label="Almácen"
                            options={almacenResponse}
                            value={state.almacen}
                            data="almacen_nombre"
                            valueKey="almacen_id"
                            onChangeFunc={(value) => {
                                setState({ ...state, almacen: value });
                                handleAlmacenSelection(value);
                            }}>
                        </SelectComp>
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
                            searcher={false}
                            data={articulosResponse}
                            columns={[
                                { header: 'Articulo', accessor: 'articulo_nombre', cell: eprops => eprops.item.articulo?.articulo_nombre },
                                { header: 'Existencia', accessor: 'articulo_existencia', cell: eprops => eprops.item.almacenArticulo_existencia },
                                // {
                                //     header: "Acciones",
                                //     edit: (eprops) => {
                                //         setState(eprops.item)
                                //         setState({ ...state, open: true, create: 'edit' })
                                //     },
                                // }
                            ]}
                        />
                    ) : (
                        <div className="h-full w-full">
                            <div className="flex w-full h-[75%] mt-7 justify-center">
                                <img src={Imagen} />
                            </div>
                            <div className="flex w-full h-[75%] justify-center text-center">
                                <p>{`(Seleccione un almácen para ver sus productos.)`}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <DialogComp
                dialogProps={{
                    model: 'Arqueo',
                    width: 'sm',
                    openState: state.open,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: state.action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Articulos",
                        select: true,
                        style: 'col-span-2',
                        options: articulosResponse,
                        value: state.articulos,
                        disabled: state.action === 'edit',
                        onChangeFunc: (e) => setState({ ...state, articulos: e }),
                        data: 'articulo_nombre',
                        valueKey: 'articulo_id',
                    },
                    {
                        label: "Existencia",
                        input: true,
                        type: 'text',
                        fieldKey: 'articulo_existencia',
                        value: state.articulos,
                        onChangeFunc: (e) => setState({ ...state, existenciaArt: e.target.value })
                    },
                ]}
                state={state.errors}
            />
        </div>
    );
}
export default Arqueo;
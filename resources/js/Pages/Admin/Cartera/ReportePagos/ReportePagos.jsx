import { useState, useEffect } from "react";
import { FieldDrawer } from "@/components/DialogComp";
import request, { camionLogo, moneyFormat, noty } from "@/utils";
import { intReportePagos, intReporteState } from "./intReportePagos";
import { Request } from "@/core/Request";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import ReportePagosPDF from "./ReportePagosPDF";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import { excelTemplate } from "./ExcelTemplate";

export default function ReportePagos() {
    const [data, setData] = useState(intReportePagos);
    const [state, setState] = useState(intReporteState);
    const [pagosCanceladosCheck, setPagosCanceladosCheck] = useState(false);
    const [showPDF, setShowPDF] = useState(false);

    const getClients = async () =>
        setState({
            ...state,
            clientes: await Request._get(route("clientes.index")),
            loading: false,
        });

    const handleChangePagosCancelados = () => {
        setPagosCanceladosCheck((prevState) => !prevState);
    };

    const getPagos = async () => {
        setState({
            ...state,
            pagos: await Request._post(
                route("reporte-pagos", {
                    success: { message: "Registros obtenidos." },
                }),
                data
            ),
        });
    };

    const getPagosCancelados = async () => {
        try {
            const response = await Request._post(
                route("reporte-pagos-cancelados", {
                    enabled: true,
                    success: { message: "Registros obtenidos." },
                }),
                data
            );
            setState({ ...state, pagos: response });
        } catch (error) {
            console.error("Error al obtener los pagos cancelados:", error);
        }
    };

    const getPagosTodos = async () =>
        setState({
            ...state,
            pagos: await Request._post(
                route("pagos-todos", {
                    enabled: true,
                    success: { message: "Registros obtenidos." },
                }),
                data
            ),
        });

    const getPagosTodosCancelados = async () =>
        setState({
            ...state,
            pagos: await Request._post(
                route("pagos-todos-cancelados", {
                    enabled: true,
                    success: { message: "Registros obtenidos." },
                }),
                data
            ),
        });

    const getExcel = () => {
        const excelDatos = state.pagos.map((item) => ({
            pago_fecha: item.pago_fecha,
            pago_idPago: item.pago_idPago,
            cliente_nombrecomercial: item.cliente.cliente_nombrecomercial,
            formasPago_descripcion: item.forma_pago.formasPago_descripcion,
            pagoDetalle_importepagado: item.pago_detalle.pagoDetalle_importepagado,
        }));
        excelTemplate(
            excelDatos,
            excelColumns,
            excelName(),
            data.FechaFinal,
            data.FechaInicio,
            pagosCanceladosCheck,
            state.pagos
        );
    };

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat("es-mx").format(new Date()).replaceAll("/", "_");
        return `Reporte Pagos$${fechaActual}`;
    };

    const clienteColumns = [
        { width: "16.6%", header: "Fecha", accessor: "pago_fecha", cell: ({ item }) => <>{new Date(item?.pago_fecha).formatMXNoTime()}</> },
        { width: "16.6%", header: "Folio", accessor: "pago_idPago" },
        { width: "16.6%", header: "NombreCliente", accessor: "cliente.cliente_nombrecomercial" },
        { width: "16.6%", header: "Forma de Pago", accessor: "forma_pago.formasPago_descripcion" },
        { width: "16.6%", header: "Importe", accessor: "pago_detalle.pagoDetalle_importepagado", cell: ({ item }) => `$${moneyFormat(item.pago_detalle.pagoDetalle_importepagado)}` },
        { width: "16.6%", header: "Saldo", accessor: "pago_detalle.pagoDetalle_SaldoPendiente", cell: ({ item }) => `$${moneyFormat(item.pago_detalle.pagoDetalle_SaldoPendiente)}` },
    ];

    const excelColumns = [
        { header: "Fecha", accessor: "pago_fecha", type: "date" },
        { header: "Folio", accessor: "pago_idPago", type: "text" },
        { header: "NombreCliente", accessor: "cliente_nombrecomercial", type: "text" },
        { header: "Forma de Pago", accessor: "formasPago_descripcion", type: "text" },
        { header: "Importe", accessor: "pagoDetalle_importepagado", type: "number" },
    ];

    useEffect(() => {
        if (data.Cliente) {
            if (pagosCanceladosCheck) {
                getPagosCancelados();
                return;
            }
            getPagos();
        } else {
            if (pagosCanceladosCheck) {
                getPagosTodosCancelados();
                return;
            }
            getPagosTodos();
        }
    }, [data.FechaFinal, data.FechaInicio, data.Cliente, pagosCanceladosCheck]);

    useEffect(() => {
        getClients();
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 -mt-4">
            <div className="flex relative gap-3 sm:flex-col md:flex-row h-[90%]">
                <div className="flex flex-col gap-2 pt-4 min-w-[300px]">
                    <div className="flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 ">
                        <FieldDrawer
                            fields={[
                                {
                                    label: "Cliente",
                                    select: true,
                                    fieldKey: "Cliente",
                                    value: data.Cliente,
                                    options: state?.clientes?.map((reg) => ({
                                        ...reg,
                                        cliente_nombrecomercial: `${reg.cliente_idCliente} - ${reg.cliente_nombrecomercial}`,
                                    })),
                                    data: "cliente_nombrecomercial",
                                    valueKey: "cliente_idCliente",
                                    onChangeFunc: (e) =>
                                        setData({
                                            ...data,
                                            Cliente: e,
                                        }),
                                },
                                {
                                    label: "Fecha Inicio",
                                    input: true,
                                    type: "date",
                                    value: data.FechaInicio,
                                    onChangeFunc: (e) =>
                                        setData({
                                            ...data,
                                            FechaInicio: e.target.value,
                                        }),
                                },
                                {
                                    label: "Fecha Final",
                                    input: true,
                                    type: "date",
                                    value: data.FechaFinal,
                                    onChangeFunc: (e) =>
                                        setData({
                                            ...data,
                                            FechaFinal: e.target.value,
                                        }),
                                },
                            ]}
                        />
                        <div className="flex items-center">
                            <Checkbox
                                label="Pagos Cancelados"
                                fieldKey="pagosCancelados"
                                checked={pagosCanceladosCheck}
                                onChange={handleChangePagosCancelados}
                            />
                            <span>Pagos Cancelados</span>
                        </div>
                        <button
                            className={`grid h-[48px] w-full bg-pdf-color text-white rounded-lg text-center content-center cursor-pointer non-selectable mt-4`}
                            onClick={() => setShowPDF(!showPDF)}
                        >
                            {showPDF ? 'Ocultar PDF' : 'Visualizar PDF'}
                        </button>
                        <button
                            className={`h-[48px] w-full mt-4 ${state.pagos ? `bg-excel-color` : "bg-disabled-color"
                                } text-white rounded-lg`}
                            disabled={state.pagos ? false : true}
                            onClick={() => getExcel()}
                        >
                            Exportar excel
                        </button>
                    </div>
                </div>
                <div className="relative col-span-10 mx-5 w-full mt-4">
                    {showPDF && (
                        <PDFViewer width="100%" height="800px">
                            <ReportePagosPDF
                                data={state.pagos}
                                state={data}
                                pagosCanceladosCheck={pagosCanceladosCheck}
                            />
                        </PDFViewer>
                    )}
                    {!showPDF && state.pagos ? (
                        <Datatable searcher={false} virtual={true} data={state.pagos} columns={clienteColumns} />
                    ) : (
                        <>
                            {/* <div className="mt-[-50px] flex  flex-col relative h-full items-center overflow-hidden self-center justify-center">
                                <img className="object-scale-down w-96 non-selectable" src={camionLogo} alt="" />
                                <span className="text-gray-600 non-selectable">La lista se encuentra vacía.</span>
                            </div> */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

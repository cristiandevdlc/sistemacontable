import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useState, useEffect, useRef } from "react";
import SelectComp from "@/components/SelectComp";
import Datatable from "@/components/Datatable";
import MonthsList from '@/core/MonthsList'
import { Chart } from 'primereact/chart';
import { Button } from "@mui/material";
import request, { yearsList } from "@/utils";
import { exportExcel } from './ExcelDiarioOperadoras'
import { OptDiariosOperadoras } from './OptDiariosOperadoras'
import LoadingDiv from '@/components/LoadingDiv';
import { excelTemplate } from "./ExcelTemplate";

const ReporteDiarioOperadoras = () => {
    const years = yearsList();
    const [state, setState] = useState({ loading: true });
    const [compList, setCompList] = useState({ webData: [] });
    const [origenPedido, setOrigenPedido] = useState()
    const [data, setData] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        origen: 0
    });
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const chart = useRef()

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const drawGraph = () => {
        const { dataSet, options } = OptDiariosOperadoras(compList.webData)
        setChartData(dataSet);
        setChartOptions(options);
    }

    const getData = async () => {
        const req = await request(route('reporte-pedidos-operadora'), 'POST', { year: data.year, month: data.month, origen:data.origen }, { enabled: state.loading ? true : false })
        setCompList({ ...data, ...req })
    }
    const getOrigen = async () => {
        const req = await request(route('origen-pedidos.index'), 'GET')
        setOrigenPedido(req)
    }

    useEffect(() => {
        drawGraph();
    }, [compList]);

    useEffect(() => {
        getMenuName();
        getOrigen();
    }, []);

    useEffect(() => {
        // if (data) {
        //     getData().then(() => setState({ ...state, loading: false }));
        // }
    }, [data]);

    
    const excelColumns = [
        { header: "Fecha", accessor: "d", type: "date" },
        { header: "LLenos", accessor: "estacionario", type: "text" },
        { header: "Estacionario", accessor: "llenos", type: "text" },
        { header: "Recargas", accessor: "recargas", type: "text" },
        { header: "Total", accessor: "total_diario", type: "number" },
    ];


    const getExcel = () => {
        const datatableData = compList.totales;
        // console.log(compList)
        // const datatableColumns = compList.filter(column => column.visible);
        excelTemplate(
            datatableData,
            // datatableColumns,
            excelColumns,
            excelName()
        );
    };

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat("es-mx").format(new Date()).replaceAll("/", "_");
        return `Reportes datoss$${fechaActual}`;
    };

    return (
        <div className="relative h-[100%] pb-4 overflow-auto blue-scroll">
            {/* {state.loading && <LoadingDiv />} */}
            {
                <div className='flex gap-4 sm:flex-col md:flex-row'>
                    <div className='flex flex-col min-w-[30vh] gap-4 px-3'>
                        <div className="border-2 w-full shadow-md px-4 pb-3 rounded-xl ">
                            <SelectComp
                                label={"Año"}
                                value={data.year}
                                onChangeFunc={(newValue) => {
                                    setData({ ...data, year: newValue })
                                }}
                                options={years}
                                data={'value'}
                                valueKey={'value'}
                            />
                            <SelectComp
                                label={"Mes"}
                                value={data.month}
                                onChangeFunc={(newValue) => {
                                    setData({ ...data, month: newValue })
                                }}
                                options={MonthsList}
                                data={'value'}
                                valueKey={'id'}
                            />
                            <SelectComp
                                label={"Origen"}
                                value={data.origen}
                                onChangeFunc={(newValue) => {
                                    setData({ ...data, origen: newValue })
                                }}
                                options={origenPedido}
                                data={'descripcion'}
                                valueKey={'idorigen'}
                            />
                            <Button 
                                variant="contained"
                                className="!bg-excel-color"
                                startIcon={<span className="material-icons">calculate</span>}
                                onClick={() => {
                                    getExcel()
                                    // exportExcel({ data: compList, graph: chart.current.getBase64Image() })
                                }}
                                style={{ marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%' }}
                            >
                                Exportar a excel
                            </Button>
                            <Button 
                                variant="contained"
                                className="!bg-primary-color"
                                // startIcon={<span className="material-icons">calculate</span>}
                                onClick={getData}
                                style={{ marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%' }}
                            >
                               Buscar
                            </Button>
                        </div>
                        <Datatable
                            className="sm:max-h-[480px] md:h-[565px] mt-1"
                            data={compList.webData}
                            searcher={false}
                            rowClass={(eprops) => {
                                return (!isNaN(eprops.item.d)) ? null : 'bg-gray-200'
                            }}
                            columns={[
                                {
                                    header: 'Operadora',
                                    accessor: 'nombre'
                                },
                                {
                                    header: 'Total pedidos',
                                    accessor: 'cantidad'
                                },
                            ]}
                        />
                    </div>
                    <div className='border-2 mx-3 max-[1080px]:w-full w-full h-[90vh] shadow-md px-4 rounded-xl'>
                        <Chart className="h-[100%] w-[99%] min-[1080px]:h-[100%]" ref={chart} type="bar" data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
                    </div>
                </div>
            }
        </div>
    )
}

export default ReporteDiarioOperadoras;
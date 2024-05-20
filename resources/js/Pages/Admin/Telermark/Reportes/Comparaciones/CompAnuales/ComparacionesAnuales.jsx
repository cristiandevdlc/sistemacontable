import { exportExcel } from "./ExcelComparacionesAnuales";
import { OptComparaciones } from "./OptComparacionAnual";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useState, useEffect, useRef } from "react";
import SelectComp from "@/components/SelectComp";
import Datatable from "@/components/Datatable";
import MonthsList from '@/core/MonthsList'
import { Chart } from 'primereact/chart';
import { Button } from "@mui/material";
import request, { yearsList } from "@/utils";
import GetAppIcon from '@mui/icons-material/GetApp';

export default function ComparacionesAnuales() {
    const years = yearsList();
    const [compList, setCompList] = useState({ allData: [] });
    const [origenes, setOrigenes] = useState();
    const [data, setData] = useState({
        firstYear: new Date().getFullYear() - 1,
        lastYear: new Date().getFullYear(),
        origen: null,
        month: new Date().getMonth() + 1,
    });
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const chart = useRef()

    const drawGraph = () => {
        const dayLabels = compList.allData.map((reg) => {
            if (!isNaN(reg.d)) {
                return `${MonthsList.find((month) => month.id === data.month).att}-${reg.d}`
            }
        }).filter((label) => label !== undefined);

        const { dataSet, options } = OptComparaciones(dayLabels, data, compList)
        setChartData(dataSet);
        setChartOptions(options);
    }

    const getData = async () => {
        const response = await request(route('reporteServiciosAnuales'), 'POST', data, { enabled: true });
        setCompList(response);
    }

    const getOrigenes = async () => {
        const response = await request(route('origen-pedidos.index'), 'GET', { enabled: true });
        setOrigenes([{ descripcion: 'Todos', idorigen: '' }, ...response]);
    }

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    useEffect(() => {
        drawGraph();
    }, [compList]);

    useEffect(() => {
        getData();
    }, [data]);

    useEffect(() => {
        getMenuName();
        getOrigenes();
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="flex sm:flex-col md:flex-row gap-3 mb-4 border-2 w-full shadow-md px-4 pb-3 rounded-xl">
                <SelectComp
                    label={"Primer año"}
                    value={data.firstYear}
                    onChangeFunc={(newValue) => {
                        // console.log(newValue)
                        newValue && setData({ ...data, firstYear: newValue })
                        !newValue && setData({ ...data, firstYear: new Date().getFullYear() - 1 })
                    }}
                    options={years}
                    data={'value'}
                    valueKey={'value'}
                />
                <SelectComp
                    label={"Segundo año"}
                    value={data.lastYear}
                    onChangeFunc={(newValue) => {
                        // console.log(newValue)
                        newValue && setData({ ...data, lastYear: newValue })
                        !newValue && setData({ ...data, lastYear: new Date().getFullYear() })
                    }}
                    options={years}
                    data={'value'}
                    valueKey={'value'}
                />
                {origenes && <SelectComp
                    label={"Origen"}
                    value={data.origen}
                    onChangeFunc={(newValue) => {
                        setData({ ...data, origen: newValue })
                    }}
                    options={origenes}
                    data={'descripcion'}
                    valueKey={'idorigen'}
                />}
                <SelectComp
                    label={"Mes"}
                    value={data.month}
                    onChangeFunc={(newValue) => {
                        newValue && setData({ ...data, month: newValue })
                        !newValue && setData({ ...data, month: new Date().getMonth() + 1 })
                    }}
                    options={MonthsList}
                    data={'value'}
                    valueKey={'id'}
                />
                <Button
                    variant="contained"
                    // value={data.fotoEmpleado}
                    // color="success"
                    className="!bg-excel-color"
                    startIcon={<GetAppIcon />}
                    onClick={() => {
                        exportExcel({ compList, data, origenes }, chart.current.getBase64Image())
                    }}
                    style={{ marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%' }}
                >
                    Exportar a excel
                </Button>
            </div>
            <div className="flex sm:flex-col md:flex-row gap-4 w-[100%] h-[88%]">
                <div className="max-[1080px]:col-span-full relative h-[100%] md:w-[30%] sm:w-[100%]">
                    <Datatable
                        data={compList.allData}
                        searcher={false}
                        rowClass={(eprops) => {
                            return (!isNaN(eprops.item.d)) ? null : 'bg-gray-200'
                        }}
                        columns={[
                            {
                                header: 'Fecha',
                                cell: (eprops) => {
                                    return (!isNaN(eprops.item.d)) ? `${MonthsList.find((month) => month.id === data.month).att}-${eprops.item.d}` : eprops.item.d
                                },
                                colClass: (eprops) => {
                                    return (!isNaN(eprops.item.d)) ? null : 'bg-orange-300'
                                }
                            },
                            { header: `${MonthsList.find((month) => month.id === data.month).value} ${data.firstYear}`, accessor: 'y1' },
                            { header: `${MonthsList.find((month) => month.id === data.month).value} ${data.lastYear}`, accessor: 'y2' },
                            { header: 'Diferencia', accessor: 'dif' },
                        ]}
                    />
                </div>
                <div className="max-[1080px]:h-[100%] min-[1080px]:h-[100%] md:w-[70%] sm:w-[100%] border-2 shadow-md px-4 pb-3 rounded-xl">
                    <Chart className="h-[100%]" ref={chart} type="line" data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
                </div>
            </div>
        </div>
    )
}
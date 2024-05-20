import { OptComparaciones } from "./OptComparacionOrigenes";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { exportExcel } from "./ExcelComparacionOrigen";
import { useState, useEffect, useRef } from "react";
import SelectComp from "@/components/SelectComp";
import Datatable from "@/components/Datatable";
import MonthsList from '@/core/MonthsList';
import { Chart } from 'primereact/chart';
import { Button } from "@mui/material";
import request, { yearsList } from "@/utils";
import GetAppIcon from '@mui/icons-material/GetApp';

export default function ComparacionesOrigines() {
    const years = yearsList();
    const [compList, setCompList] = useState({ allData: [] });
    const [origenes, setOrigenes] = useState();
    const [data, setData] = useState({
        year: new Date().getFullYear(),
        origen1: null,
        origen2: null,
        month: new Date().getMonth() + 1,
    });
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const chart = useRef()

    const drawGraph = (origenData = origenes, o1 = data.origen1, o2 = data.origen2) => {
        const dayLabels = compList.allData.map((reg) => {
            if (!isNaN(reg.d)) {
                return `${MonthsList.find((month) => month.id === data.month).att}-${reg.d}`
            }
        }).filter((label) => label !== undefined);

        const { dataSet, options } = OptComparaciones(dayLabels,
            {
                ...data,
                origen1: origenData ? origenData.find((origen) => origen.idorigen === o1)?.descripcion : '',
                origen2: origenData ? origenData.find((origen) => origen.idorigen === o2)?.descripcion : ''
            },
            compList)

        setChartData(dataSet);
        setChartOptions(options);
    }

    const getData = async () => {
        const response = await request(route('reporteComparacionServicios'), 'POST', data, { enabled: true });
        setCompList(response);
    }

    const getOrigenes = async () => {
        const response = await request(route('origen-pedidos.index'), 'GET', { enabled: true });
        setOrigenes(response);
        (!data.origen && response) && setData({ ...data, origen1: response[0].idorigen ?? 1, origen2: response[1].idorigen ?? 2 })
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
        if (data.origen1 && data.origen2) getData();
    }, [data]);

    useEffect(() => {
        getMenuName();
        getOrigenes();
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="flex sm:flex-col md:flex-row gap-3 mb-4 border-2 w-full shadow-md px-4 pb-3 rounded-xl">
                {origenes && <SelectComp
                    label={"Origen 1"}
                    value={data.origen1}
                    onChangeFunc={(newValue) => {
                        setData({ ...data, origen1: newValue })
                    }}
                    options={origenes.filter((origen) => origen.idorigen !== data.origen2)}
                    data={'descripcion'}
                    valueKey={'idorigen'}
                />}
                {origenes && <SelectComp
                    label={"Origen 2"}
                    value={data.origen2}
                    onChangeFunc={(newValue) => {
                        setData({ ...data, origen2: newValue })
                    }}
                    options={origenes.filter((origen) => origen.idorigen !== data.origen1)}
                    data={'descripcion'}
                    valueKey={'idorigen'}
                />}
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
                <Button
                    variant="contained"
                    // value={data.fotoEmpleado}
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
                            { header: `${origenes && origenes.find((origen) => origen.idorigen === data.origen1)?.descripcion}`, accessor: 'y1' },
                            { header: `${origenes && origenes.find((origen) => origen.idorigen === data.origen2)?.descripcion}`, accessor: 'y2' },
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
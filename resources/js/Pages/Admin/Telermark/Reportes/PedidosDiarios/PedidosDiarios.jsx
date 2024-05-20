import '../../../../../../sass/TabsEncuesta/_tabs.scss';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { exportExcel } from "./ExcelPedidosDiarios";
import { useState, useEffect, useRef } from "react";
import { OptPedidos } from "./OptPedidosDiarios";
import SelectComp from "@/components/SelectComp";
import Datatable from "@/components/Datatable";
import { Box, Button } from "@mui/material";
import MonthsList from '@/core/MonthsList';
import { Chart } from 'primereact/chart';
import request, { yearsList } from "@/utils";
import LoadingDiv from '@/components/LoadingDiv';

const optTurnoData = {
    matutino: 0,
    vespertino: 1,
    total: 2,
    acomulado: 3,
    0: 'matutino',
    1: 'vespertino',
    2: 'total',
    3: 'acomulado',
}
export default function PedidosDiarios() {
    const years = yearsList();
    const [compList, setCompList] = useState({
        matutino: [],
        vespertino: [],
        diario: [],
        acomulado: [],
    });
    const [data, setData] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const [chartData, setChartData] = useState({
        matutino: { ref: useRef() },
        vespertino: { ref: useRef() },
        total: { ref: useRef() },
        acomulado: { ref: useRef() },
    });
    const [hasData, setHasData] = useState(false)
    const [state, setState] = useState(0)
    const [gDraw, setGDraw] = useState(false)
    const [loading, setLoading] = useState(true)

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const drawGraphs = () => {
        const dayLabels = compList[optTurnoData[state]].map((reg) => {
            if (!isNaN(reg.d)) {
                return `${MonthsList.find((month) => month.id === data.month).att}-${reg.d}`
            }
        }).filter((label) => label !== undefined);

        const cData = {}
        for (const property in compList) {
            if (property !== 'rowsData')
                cData[property] = { ...chartData[property], ...OptPedidos(dayLabels, compList[property], optTurnoData[state]) }
        }
        setChartData(cData);
        setGDraw(true)
    }

    const getData = async () => {
        const response = await request(route('reporte-pedidos-diarios'), 'POST', data, { enabled: true });
        setCompList(response);
        setHasData(true)
    }

    const handleChange = (event) => {
        setState(event.target.value);
    };

    const controlProps = (item) => ({
        onChange: handleChange,
        value: item,
        name: "id",
    });

    useEffect(() => {
        if (hasData)
            drawGraphs();
        if (gDraw)
            chartData[optTurnoData[state]].options.plugins.title.text = String(optTurnoData[state]).toUpperCase()
    }, [compList, state]);

    useEffect(() => {
        getData().then(() => setLoading(false));
    }, [data]);

    useEffect(() => {
        getMenuName();
    }, [])

    return (
        <div className='relative h-[100%] pb-4 px-3 overflow-auto blue-scroll'>
            {loading && <LoadingDiv />}
            {!loading &&
                <>
                    <div className="grid grid-cols-9 gap-x-4 mt-3 mb-6 border-2 w-full shadow-md px-4 pb-3 rounded-xl">
                        <div className='col-span-3 max-[1080px]:col-span-5'>
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
                        </div>
                        <div className='col-span-3 max-[1080px]:col-span-5'>
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
                        </div>
                        <div className='col-span-3 max-[1080px]:col-span-10'>
                            <Button
                                variant="contained"
                                className="!bg-excel-color"
                                // disabled={state != optTurnoData.acomulado}
                                startIcon={<span className="material-icons">calculate</span>}
                                onClick={() => {
                                    exportExcel({ compList, data, chartData, state })
                                }}
                                style={{
                                    marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%'
                                }}
                            >
                                Exportar a excel
                            </Button>
                        </div>
                    </div>
                    <div className='border-2 shadow-md pb-3 rounded-xl'>
                        <Box sx={{ display: 'flex', p: '8px', flexDirection: 'column', width: '100%', textAlign: 'center', gap: 2, zoom: 0.8 }}>
                            <div className='container-encuesta'>
                                <div className="tabs-encuesta">
                                    <input type="radio" {...controlProps(optTurnoData.matutino)} id="radio-1" defaultChecked={true} name="tabs" />
                                    <label className="tab" htmlFor="radio-1"><span style={{ fontSize: '30px', marginRight: '10px' }} className=" material-icons">light_mode</span> <span className="md:flex hidden">Matutino</span></label>
                                    <span className="gliderDailyOrders"></span>

                                    <input type="radio" {...controlProps(optTurnoData.vespertino)} id="radio-2" name="tabs" />
                                    <label className="tab" htmlFor="radio-2"><span style={{ fontSize: '30px', marginRight: '10px' }} className=" material-icons">nightlight</span> <span className="md:flex hidden">Vespertino</span> </label>
                                    <span className="gliderDailyOrders"></span>

                                    <input type="radio" {...controlProps(optTurnoData.total)} id="radio-3" name="tabs" />
                                    <label className="tab" htmlFor="radio-3"><span style={{ fontSize: '30px', marginRight: '10px' }} className=" material-icons">apps</span> <span className="md:flex hidden">Total</span> </label>
                                    <span className="gliderDailyOrders"></span>

                                    <input type="radio" {...controlProps(optTurnoData.acomulado)} id="radio-4" name="tabs" />
                                    <label className="tab" htmlFor="radio-4"><span style={{ fontSize: '30px', marginRight: '10px' }} className=" material-icons">trending_up</span> <span className="md:flex hidden">Acumulado</span> </label>
                                    <span className="gliderDailyOrders"></span>
                                </div>
                            </div>
                        </Box>
                        <div className="grid grid-cols-12 h-[100%] pt-4 px-4 gap-4">
                            <div className="max-[1080px]:col-span-full  col-span-4">
                                <Datatable
                                    data={compList[optTurnoData[state]]}
                                    searcher={false}
                                    rowClass={(eprops) => {
                                        return (!isNaN(eprops.item.d)) ? null : 'bg-gray-200'
                                    }}
                                    columns={[
                                        {
                                            header: `${MonthsList.find((month) => month.id === data.month).value}`,
                                            cell: (eprops) => {
                                                return (!isNaN(eprops.item.d)) ? `${MonthsList.find((month) => month.id === data.month).att}-${eprops.item.d}` : eprops.item.d
                                            },
                                            colClass: (eprops) => {
                                                return (!isNaN(eprops.item.d)) ? null : 'bg-orange-300'
                                            }
                                        },
                                        {
                                            header: `Llenos`, accessor: 'llenos'
                                        },
                                        {
                                            header: `Estacionario`, accessor: 'estacionario'
                                        },
                                        {
                                            header: `Recargas`, accessor: 'recargas'
                                        },
                                        {
                                            header: `Total`, accessor: 'total_diario'
                                        },
                                    ]}
                                />
                            </div>
                            <div className="max-[1080px]:col-span-full border-[1px] rounded-md col-span-8 h-[75%] min-[1080px]:h-[100%] p-8">
                                {state == optTurnoData.matutino && <Chart key='matutino' className="h-[75%] min-[1080px]:h-[100%]" type="line" ref={chartData.matutino.ref} data={chartData.matutino.dataSet} options={chartData.matutino.options} plugins={[ChartDataLabels]} />}
                                {state == optTurnoData.vespertino && <Chart key='vespertino' className="h-[75%] min-[1080px]:h-[100%]" type="line" ref={chartData.vespertino.ref} data={chartData.vespertino.dataSet} options={chartData.vespertino.options} plugins={[ChartDataLabels]} />}
                                {state == optTurnoData.total && <Chart key='total' className="h-[75%] min-[1080px]:h-[100%]" type="line" ref={chartData.total.ref} data={chartData.total.dataSet} options={chartData.total.options} plugins={[ChartDataLabels]} />}
                                {state == optTurnoData.acomulado && <Chart key='acomulado' className="h-[75%] min-[1080px]:h-[100%]" type="line" ref={chartData.acomulado.ref} data={chartData.acomulado.dataSet} options={chartData.acomulado.options} plugins={[ChartDataLabels]} />}
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
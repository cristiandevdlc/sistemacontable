import { useState, useRef, useEffect } from "react";
import { OptGenEnRuta } from "./OptGenEnRuta";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'primereact/chart';
import request from "@/utils";
import TextInput from "@/components/TextInput";
import { Divider } from "@mui/material";

export default function ServiciosGenEnRuta() {
    const [compList, setCompList] = useState();
    const [filters, setFilters] = useState({});
    // const [chartOptions, setChartOptions] = useState({});

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const chart = useRef()

    const getData = async () => {
        const req = await request(route('desglosado-rutas'), 'POST', { fecha: '2023-06-01 14:30:00' }, { enabled: true })
        setCompList(req.data)
    }

    useEffect(() => {
        getData();
        getMenuName();
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className='flex gap-6 sm:flex-col md:flex-row h-full'>
                <div className="flex flex-col min-w-[30vh] gap-4">
                    <div className="border-2 py-1 w-full shadow-md px-4 pb-4 rounded-xl">
                        <TextInput
                            type="date"
                            label="fecha"
                            className="block w-full"
                            min="1800-01-01"
                            max={new Date().toISOString().split("T")[0]}
                            value={filters.fecha || new Date().toISOString().split("T")[0]}
                            onChange={(event) => setFilters({ ...filters, fecha: event.target.value })}
                        />
                        {/* <Button
                            variant="contained"
                            className="buttonPrimary"
                            startIcon={<span className="material-icons">calculate</span>}
                            color="success"
                            onClick={() => {
                                exportExcel({ compList, data, chartData, state })
                            }}
                            style={{
                                 marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%'
                                // , opacity: `${state == optTurnoData.acomulado ? '85%' : '30%'}` 
                            }}
                        >
                            Fecha a excel
                        </Button>
                        <Button
                            variant="contained"
                            className="buttonPrimary"
                            startIcon={<span className="material-icons">calendar_month</span>}
                            color="success"

                            onClick={() => {
                                exportExcel({ compList, data, chartData, state })
                            }}
                            style={{
                                marginTop: '2vh', height: '45px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%'
                                // , opacity: `${state == optTurnoData.acomulado ? '85%' : '30%'}` 
                            }}
                        >
                            Mes a excel
                        </Button> */}
                    </div>
                    <div className='flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                        <div className='flex justify-between'>
                            <span>Total tipos servicio</span>
                            <span>{compList && compList.length}</span>
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Total rutas</span>
                            <span>{compList && compList.map(ts => ts.rutas.length).reduce((r, actual) => r + actual)}</span>
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Total pedidos</span>
                            {/* <span>{state.bonificacion}</span> */}
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Total importe</span>
                            {/* <span>{state.importe}</span> */}
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Total</span>
                            {/* <span>{state.total}</span> */}
                        </div>
                    </div>
                </div>
                <div className="flex sm:flex-col md:flex-row w-[100%] h-[100%] gap-6">
                    {
                        compList && (
                            compList.map(reg => (
                                <div className="flex flex-col w-[100%] max-[1080px]:h-full min-[1080px]:h-[100%] border-2 shadow-md px-4 pb-3 rounded-xl">
                                    <div>{reg.servicio}</div>
                                    <Chart
                                        className="h-[100%] w-[99%] min-[1080px]:h-[100%] p-3"
                                        ref={chart}
                                        type="bar"
                                        data={OptGenEnRuta(reg.rutas).dataSet}
                                        options={OptGenEnRuta(reg.rutas).options}
                                        plugins={[ChartDataLabels]} />
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}
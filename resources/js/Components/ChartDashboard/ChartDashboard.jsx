import { ChartDashboardOptions } from "./ChartDashboardOptions";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useState, useEffect, useRef } from "react";
import { Chart } from 'primereact/chart';
import request from "@/utils";

export const ChartDashboard = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const chart = useRef()

    const getStadistic = async () => {
        const data = await request(route('getOrderStadistic'), 'GET', {}, { enabled: true });
        drawGraph(data);
    }
    const drawGraph = (d) => {
        const { dataSet, options } = ChartDashboardOptions(d.map(({ fecha }) => fecha).reverse(), d.map(({ cantidad }) => cantidad).reverse())

        setChartData(dataSet);
        setChartOptions(options);
    }

    useEffect(() => {
        getStadistic();
    }, []);

    return (
        <>
            <Chart ref={chart} className="h-[100%]" type="bar" data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
        </>
    )

}
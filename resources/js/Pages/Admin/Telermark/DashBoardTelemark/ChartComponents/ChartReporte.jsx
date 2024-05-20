import React from 'react';
import { Chart } from 'devextreme-react';
import { CommonSeriesSettings } from 'devextreme-react/chart';
import { Series } from 'devextreme-react/chart';
import { Export } from 'devextreme-react/chart';
import { Legend } from 'devextreme-react/chart';
import { Point } from 'devextreme-react/chart';
import '../../../../../../sass/Charts/ChartPointOperadoras.scss'
import { useEffect, useState } from 'react';

export default function ChartReporte() {
    const [rutas, setRutas] = useState([]);

    useEffect(() => {
        getRutas();
    }, []);

    const getRutas = async () => {
        const responseR = await fetch(route("rutas.index"));
        const data = await responseR.json();

        const counts = data.reduce((acc, item) => {
            if (item.ruta_idTurno in acc) {
                acc[item.ruta_idTurno]++;
            } else {
                acc[item.ruta_idTurno] = 1;
            }
            return acc;
        }, {});

        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

        const chartData = Object.entries(counts).map(([ruta_idTurno, count]) => ({
            turno: ruta_idTurno,
            porcentaje: (count / total) * 100,
        }));

        setRutas(chartData);

        console.log('total', total);
        console.log('chartData', chartData);
        console.log('chartData', data);
    };

    return (
        <div className='containerChartPortatil'>
            <Chart
                id="chartPoint"
                dataSource={rutas}
                stickyHovering={true}
                palette={'Soft Blue'}
                title="Reporte general acumulado"
            >
                <CommonSeriesSettings
                    argumentField="turno"
                    type="spline"
                    hoverMode="includePoints"
                >
                    <Point hoverMode="allArgumentPoints" />
                </CommonSeriesSettings>
                <Series valueField='porcentaje' name='Matutino' />
                <Series valueField='porcentaje' name='Vespertino' />
                <Export enabled={true} />
                <Legend
                    verticalAlignment="bottom"
                    horizontalAlignment="center"
                    hoverMode="excludePoints"
                />
            </Chart>
        </div>
    );
}

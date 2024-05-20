import React, { useEffect, useState } from 'react';
import PieChart, {
    Series,
    Label,
    Connector,
    SmallValuesGrouping,
    Legend,
    Export,
} from 'devextreme-react/pie-chart';
import '../../../../../../sass/Charts/ChartPieResumen.scss';

export default function ChartPieResumen() {
    const [rutas, setRutas] = useState([]);
    
    useEffect(() => {
        getRutas();
    }, []);

    const getRutas = async () => {
        try {
            const responseR = await fetch(route("rutas.index"));
            if (!responseR.ok) {
                throw new Error('Error al obtener los datos de rutas');
            }
            const data = await responseR.json();
    
            const counts = data.reduce((acc, item) => {
                const key = `${item.ruta_idTipoServicio}_${item.ruta_idTurno}`;
                if (key in acc) {
                    acc[key]++;
                } else {
                    acc[key] = 1;
                }
                return acc;
            }, {});
    
            const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
            const chartData = Object.entries(counts).map(([key, count]) => {
                const [tipoServicio, turno] = key.split('_');
                return {
                    tipoServicio,
                    turno,
                    porcentaje: (count / total) * 100,
                };
            });
    
            setRutas(chartData);
    
            console.log('total', total);
            console.log('chartData', chartData);
        } catch (error) {
            console.error('Error al obtener los datos de rutas:', error);
        }
    };
    

    return (
        <div className='containerChartPortatil'>
            <PieChart
                id="pie"
                dataSource={rutas}
                palette="Soft Blue"
                title="Todo"
            >
                <Series
                    argumentField="tipoServicio"
                    valueField="porcentaje"
                >
                    <Label visible={true} customizeText={(arg) => `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)}%`} format="fixedPoint">
                        <Connector visible={true} width={1} />
                    </Label>
                    <SmallValuesGrouping threshold={8} mode="smallValueThreshold" />
                </Series>
                <Legend horizontalAlignment="center" verticalAlignment="bottom" />
                <Export enabled={true} />
            </PieChart>
        </div>
    );
}

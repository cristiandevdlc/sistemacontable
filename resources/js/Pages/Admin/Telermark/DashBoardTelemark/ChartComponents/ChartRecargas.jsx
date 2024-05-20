import React, { useEffect, useState } from 'react';
import { Chart } from 'devextreme-react';
import { Series } from 'devextreme-react/chart';
import { Legend } from 'devextreme-react/chart';
import { Export } from 'devextreme-react/chart';
import { Title } from 'devextreme-react/chart';
import { Tooltip } from 'devextreme-react/chart';
import { SeriesTemplate } from 'devextreme-react/chart';
import { CommonSeriesSettings } from 'devextreme-react/chart';
import "../../../../../../sass/Charts/ChartBarPortatil.scss";
import request from '@/utils';

export default function ChartRecargas() {
    const [chartPortatil, setChartPortatil] = useState([]);
    const [selectedDate, setSelectedDate] = useState(''); 

    useEffect(() => {
        getChartPortatil();
    }, [selectedDate]);

    const getChartPortatil = async () => {
        const responseR = await request(route("desglosado-rutas"), 'POST', selectedDate);
        setChartPortatil(responseR.data[0].rutas);
        // console.log('total', total);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); 
    };
    
    return (
        <div className='containerChartPortatil'>
            <input type="date" value={selectedDate} onChange={handleDateChange} />
            <Chart
                id='chart2'
                palette={'Soft Blue'}
                dataSource={chartPortatil}
            >
                <CommonSeriesSettings
                    argumentField='ruta'
                    type='bar'
                    valueField="cantidad"
                    // barPadding={2}
                    // cornerRadius={5}
                />

                <Series
                    valueField="cantidad"
                    name='cantidad'
                />

                <SeriesTemplate nameField="servicio" />

                <Tooltip 
                    enabled={true} 
                    cornerRadius={10} 
                    />

                <Legend
                    verticalAlignment="bottom"
                    horizontalAlignment="center"
                />
                <Export enabled={true} />
                <Title text="Recargas" /*subtitle="(in millions tonnes)" */ />
            </Chart>
        </div>
    );
}
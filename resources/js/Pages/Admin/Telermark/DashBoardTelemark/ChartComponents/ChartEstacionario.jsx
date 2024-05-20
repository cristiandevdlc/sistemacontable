import React from 'react';
import { Chart } from 'devextreme-react';
import { Series } from 'devextreme-react/chart';
import { Legend } from 'devextreme-react/chart';
import { Export } from 'devextreme-react/chart';
import { Title } from 'devextreme-react/chart';
import { CommonSeriesSettings } from 'devextreme-react/chart';
import "../../../../../../sass/Charts/ChartBarEstacionario.scss"

const dataSource = [{
    state: 'Saudi Arabia',
    year1970: 186.7,
    year1980: 480.4,
    year1990: 319.6,
    year2000: 465,
    year2008: 549.7,
    year2009: 428.4,
}, {
    state: 'USA',
    year1970: 557.8,
    year1980: 423.2,
    year1990: 340.1,
    year2000: 282.9,
    year2008: 280,
    year2009: 298.9,
}, {
    state: 'China',
    year1970: 32.7,
    year1980: 87.7,
    year1990: 165.1,
    year2000: 126.6,
    year2008: 191.3,
    year2009: 181.1,
}, {
    state: 'Canada',
    year1970: 87.5,
    year1980: 78.1,
    year1990: 69.3,
    year2000: 145.7,
    year2008: 148.5,
    year2009: 182.2,
}, {
    state: 'Mexico',
    year1970: 24.7,
    year1980: 109.2,
    year1990: 145.3,
    year2000: 148.3,
    year2008: 132.1,
    year2009: 121.6,
}];

export default function ChartEstacionario() {
    return (
        <div className='containerChartPortatil'>
            <Chart
                id='chart3'
                palette={'Soft Blue'}
                dataSource={dataSource}
            >
                <CommonSeriesSettings
                    argumentField='state'
                    type='bar'
                    barPadding={0.5}
                />
                <Series valueField="year1970" name="1970 " />
                <Series valueField="year1980" name="1980" />
                <Series valueField="year1990" name="1990" />
                <Series valueField="year2000" name="2000" />
                <Series valueField="year2008" name="2008" />
                <Series valueField="year2009" name="2009" />
                <Legend
                    verticalAlignment="bottom"
                    horizontalAlignment="center" />
                <Export enabled={true} />
                <Title text="Estacionario" /*subtitle="(in millions tonnes)" *//>
            </Chart>
        </div>
    );
}
export const OptComparaciones = (labels, fieldData, compList) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const dataSet = {
        labels: labels,
        datasets: [
            {
                label: fieldData.firstYear,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--orange-500'),
                backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                data: compList.y1,
                display: 'auto'
            },
            {
                label: fieldData.lastYear,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                data: compList.y2,
                display: 'auto'
            }
        ]
    };
    const options = {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: { color: textColor }
            },
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                },
                formatter: (value, context) => {
                    return value; // Muestra el valor de la barra
                },
                anchor: 'end',
                backgroundColor: function (context) {
                    return context.dataset.borderColor;
                },
                borderColor: "#FFFF",
                borderRadius: 25,
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: { color: textColorSecondary },
                grid: { color: surfaceBorder }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: { color: textColorSecondary },
                grid: { color: surfaceBorder }
            },
        }
    };
    return {dataSet, options};
}
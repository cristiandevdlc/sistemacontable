import { randomColors } from "@/utils";

export const OptDiariosOperadoras = (data) => {
    // console.log("first: ", data)
    const documentStyle = getComputedStyle(document.documentElement);
    const dataSets = data.map((reg, index) => {
        return {
            label: reg.nombre,
            fill: false,
            borderColor: documentStyle.getPropertyValue(`${randomColors[index % randomColors]}`),
            backgroundColor: documentStyle.getPropertyValue(`${randomColors[index % randomColors]}`),
            data: [reg.cantidad],
            display: 'auto'
        }
    })

    // console.log('dataSet', dataSets)
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const dataSet = {
        labels: ['Operadores'],
        datasets: dataSets,
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
    return { dataSet, options };
}
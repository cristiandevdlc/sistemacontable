export const colores = [
    '#02869B',
    '#A07EC1',
    '#7240A2',
    '#566573',
    '#FFC300',
    '#D03838',
    '#F19D00',
    '#18CBA5',
    '#1E8AA9',
    '#845CE8',
    '#D05877',
    '#E9B45D',
    '#3AA09B',
    '#5D89E9',
    '#4CC981',
]

const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--text-color');
const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
export const options = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: {
            labels: {
                fontColor: textColor,
                padding: 25,
                font: {
                    size: 14
                }
            }
        },
        title: {
            display: true,
            text: 'Reporte de Servicio Técnico',
            fullSize: true,
            font: {
                size: 24
            }
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
                return context.dataset.backgroundColor;
            },
            borderColor: "#FFFF",
            borderRadius: 25,
            borderWidth: 2,
        },
    },
    scales: {
        x: {
            ticks: {
                color: textColorSecondary,
                font: {
                    weight: 100
                }
            },
            grid: {
                display: false,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        }
    }
};
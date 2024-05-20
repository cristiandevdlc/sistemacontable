import { addAligmentToHeaders, generatTemplate, lettersExcel, excelBg, randomColors } from '@/core/CreateExcel';
import MonthsList from '@/core/MonthsList';
import { Workbook } from 'exceljs';

export async function exportExcel({ data, graph }) {
    const opServDataValues = {
        0: 'FECHA',
        1: 'LLENOS',
        2: 'ESTACIONARIO',
        3: 'RECARGAS',
        4: 'TOTAL',
    }
    const month = `${MonthsList.find((month) => month.id == data.month).value.toUpperCase()}`

    const opServDataKeys = {
        d: 0,
        llenos: 1,
        estacionario: 2,
        recargas: 3,
        total_diario: 4,
    }

    const workbook = new Workbook();
    const headersValues = Object.values(opServDataValues)
    headersValues.shift()
    for (const key in data.excelRows) {
        let worksheet = workbook.addWorksheet(key.toUpperCase());

        worksheet = await generatTemplate(worksheet, workbook, `REPORTE INDIVIDUAL OPERADORAS TURNO ${key.toUpperCase()}`)

        let promRow = 0;
        let sumRow = 0;
        const promsRow = ['PROMEDIO']
        const sumsRow = ['SUMA']
        const rowsLen = data.excelRows[key].length
        const firstRegLen = data.excelRows[key][0].length

        const operadoras = Array.from(data.headers[key])

        operadoras.unshift('')

        let lastIndex = 0;

        /// Agrega los headers de los turnos
        operadoras.forEach((r, i) => {
            if (lastIndex === 0) lastIndex = 1
            if (i > 0) {
                worksheet.getCell(`${lettersExcel[lastIndex]}5`).value = r;
                const finalCell = lastIndex + 3
                worksheet.mergeCells(`${lettersExcel[lastIndex]}5:${lettersExcel[finalCell]}5`)
                lastIndex = finalCell + 1
            }
        })

        // Número de veces que deseas duplicar los valores
        const vecesADuplicar = (firstRegLen - 1) / headersValues.length;

        const serviceHeaders = [];
        for (let i = 0; i < vecesADuplicar; i++) {
            serviceHeaders.push(...headersValues);
        }

        serviceHeaders.unshift(month)
        worksheet.addRow(serviceHeaders)
        worksheet.addRows(data.excelRows[key])

        for (let index = 1; index < firstRegLen; index++) {
            promsRow[index] = '';
            sumsRow[index] = '';
        }

        worksheet.addRow(sumsRow)
        worksheet.addRow(promsRow)

        worksheet.getColumn('A')['eachCell']((cell) => {
            if (cell.value === 'PROMEDIO')
                promRow = cell.row;
            if (cell.value === 'SUMA')
                sumRow = cell.row;
        })

        worksheet.getRow(sumRow)['eachCell']((cell) => {
            if (!cell.value) {
                const column = cell.$col$row.split('$')[1]
                cell.value = { formula: `SUM(${column}${cell.row - 1}:${column}${cell.row - rowsLen})`, result: 1 }
            }
        })
        worksheet.getRow(promRow)['eachCell']((cell) => {
            if (!cell.value) {
                const column = cell.$col$row.split('$')[1]
                cell.value = { formula: `ROUND(${column}${cell.row - 1}/${data.days}, 0)`, result: 1 }
            }
        })

        worksheet.columns.forEach((col) => {
            col['eachCell']((cell) => {
                if (Object.values(opServDataValues).includes(cell.value) || cell.value === month)
                    cell.alignment = { vertical: 'top', textRotation: 90 }
            })
        })

        let lastOper = 0;
        let operCol = 0;
        let rowProm = 0;
        let rowsum = 0;
        worksheet.columns.forEach((column) => {
            column['eachCell']({ includeEmpty: false }, (cell, index) => {
                if (cell.$col$row.split('$')[2] != 1 && cell.$col$row.split('$')[2] != 2 && cell.$col$row.split('$')[2] != 3) {
                    if (isNaN(cell.value)) {

                        if (operadoras.includes(cell.value))
                            lastOper = operadoras.indexOf(cell.value) + 1;

                        if (lastOper)
                            cell.fill = { ...excelBg, fgColor: { argb: randomColors[lastOper % operadoras.length + 1] } }
                        else
                            cell.fill = { ...excelBg, fgColor: { argb: randomColors[0] } }

                        operCol = cell.value === 'TOTAL' ? cell.$col$row.split('$')[1] : null
                        if (cell.value === 'PROMEDIO')
                            rowProm = cell.row;
                        if (cell.value === 'SUMA')
                            rowProm = cell.row;
                    } else {
                        if (cell.$col$row.split('$')[1] == operCol)
                            cell.fill = { ...excelBg, fgColor: { argb: randomColors[lastOper % operadoras.length + 1] } }
                    }
                }
                if ((cell.row == rowProm || cell.row == sumRow) && cell.fill) {
                    cell.fill.fgColor.argb = randomColors[0]
                    cell.fill.fgColor.argb = randomColors[0]
                }
            })
        })

        worksheet = addAligmentToHeaders(worksheet, {}, { width: 9 })
    }

    let worksheet = workbook.addWorksheet('TOTALES');

    worksheet = await generatTemplate(worksheet, workbook, `TOTALES REPORTE OPERADORAS`)
    headersValues.unshift(month)
    worksheet.addRow(headersValues)

    data.totales.forEach(element => {
        worksheet.addRow(Object.values(element))
    });
    let monthCol = ''
    worksheet.columns.forEach((column) => {
        column['eachCell'](cell => {
            if (Object.values(opServDataValues).includes(cell.value) || cell.value === month)
                cell.alignment = { vertical: 'top', textRotation: 90 }
            if (isNaN(cell.value)) {
                if (Object.values(opServDataValues).includes(cell.value) || cell.value === month)
                    cell.fill = { ...excelBg, fgColor: { argb: randomColors[0] } }
                if (cell.value === month)
                    monthCol = cell.$col$row.split('$')[1]
                if (cell.$col$row.split('$')[1] === monthCol)
                    cell.fill = { ...excelBg, fgColor: { argb: randomColors[0] } }

            }
        })
    })

    worksheet = addAligmentToHeaders(worksheet, {}, { width: 9 })

    
    const imageId = workbook.addImage({
        base64: graph,
        extension: 'png',
    });

    
    worksheet.addImage(imageId,
        {
            tl: { col: 6, row: 4 }, // Coordenada para la esquina superior izquierda (D4)
            br: { col: 18, row: 20 }, // Coordenada para reducir el tamaño de la imagen
            editAs: 'absolute',
        }
    );
    
    worksheet.mergeCells('G5:R20')

    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = `COMPARACIONES_.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    });
}

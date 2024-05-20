import { generatTemplate, noFillableRows } from '@/core/CreateExcel';
import { primaryColorExcel } from '@/utils';
import MonthsList from '@/core/MonthsList';
import { Workbook } from 'exceljs';

const titleValues = {
    PROMEDIO: 'prom',
    MÍNIMO: 'min',
    MAXIMO: 'max',
    TOTAL: 'total',
    CRECIMIENTO: '',
}

export async function exportExcel(data, graph) {
    const excelData = data.compList;
    const otherData = data.data;
    const origen1 = data.origenes.find((origen) => origen.idorigen === otherData.origen1).descripcion
    const origen2 = data.origenes.find((origen) => origen.idorigen === otherData.origen2).descripcion
    const mes = MonthsList.find((month) => month.id === otherData.month)
    const workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Hoja1');

    const headerStyle = {
        font: { bold: true, color: { argb: '0000000' } }, // Color de letra negro
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryColorExcel } }, // Relleno
    };

    worksheet = await generatTemplate(worksheet, workbook, `COMPARACION DE ORIGENES (${origen1} y ${origen2}) ${otherData.year}`)

    const headersRow = worksheet.addRow(excelData.headers1);

    for (const index in excelData.y1) {
        const newRow = [
            excelData.monthDays[index],
            excelData.y1[index],
            excelData.y2[index],
            excelData.dif[index],
        ];
        worksheet.addRow(newRow);
    }
    for (const index in excelData.headers2) {
        const newRow = (excelData[titleValues[excelData.headers2[index]]]).map(c => { return c })
        newRow.unshift(excelData.headers2[index])
        worksheet.addRow(newRow);
    }

    const cellBorder = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    }

    let isFirstEmpty = false;
    let crecimiento = 0;
    const crecRows = []
    worksheet.getColumn('D')['eachCell']({ includeEmpty: false }, function (cell) {
        if ((cell.value === null || cell.value === undefined || cell.value === '') && !isFirstEmpty && !noFillableRows.includes(cell.address)) {
            cell.value = "CRECIMIENTO"
            isFirstEmpty = true;
        }

        if (isFirstEmpty) {
            if (crecimiento < 3 && crecimiento > 0) {
                const nr = cell.$col$row.replace(/\$/g, '')
                crecRows.push(nr)
                var columnLength = cell.value ? cell.value.toString().length + 2 : 10;
                const maxLength = columnLength;
                worksheet.getColumn(cell.col).width = maxLength < 10 ? 10 : maxLength;
                if (crecRows.length === 1) {
                    worksheet.getCell(nr).numFmt = '0.0%'
                    worksheet.getCell(nr).value = excelData.crecimiento / 100
                } else {
                    worksheet.mergeCells(crecRows.join(':'))
                }
            }
            crecimiento++;
        }
    })

    worksheet.columns.forEach(function (column, i) {
        let maxLength = 0;
        column["eachCell"]({ includeEmpty: false }, function (cell) {
            if (cell.row !== 1 && cell.row !== 2 && cell.row !== 3) {
                var columnLength = cell.value ? cell.value.toString().length + 2 : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
                if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
                    cell.border = cellBorder;
                    cell.alignment = { horizontal: 'center', vertical: 'middle' }
                }
                if (Object.keys(titleValues).includes(cell.value)) {
                    cell.font = headerStyle.font;
                    cell.fill = headerStyle.fill;
                }
            }

        });
        column.width = maxLength < 10 ? 10 : maxLength;
    });

    headersRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
    });

    // // Agregar filtros a las columnas
    worksheet.autoFilter = {
        from: {
            row: headersRow.number, // Fila donde comienzan los encabezados (la primera fila con datos)
            // column: 1, // Columna de la primera celda de encabezados (Fecha)
        },
        to: {
            row: headersRow.number, // Fila donde terminan los encabezados (la primera fila con datos)
            column: worksheet.columnCount, // Columna de la última celda de encabezados (Diferencia)
        },
    };

    /// AÑADE LA IMAGEN DE LA GRAFICA
    const imageId = workbook.addImage({
        base64: graph,
        extension: 'png',
    });

    worksheet.addImage(imageId,
        {
            tl: { col: 5, row: 4 }, // Coordenada para la esquina superior izquierda (D4)
            br: { col: 15, row: 20 }, // Coordenada para reducir el tamaño de la imagen
            editAs: 'absolute',
        }
    );
    worksheet.mergeCells('F5:O20')


    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = `COMPARACION_DE_ORIGENES_(${origen1}_y_${origen2})_${otherData.year}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    });
}

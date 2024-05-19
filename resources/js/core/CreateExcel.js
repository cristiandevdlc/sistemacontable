import { getEnterpriseData, loadImageAsBuffer } from '@/utils';
import { Workbook } from 'exceljs';

/*
******* EJEMPLO EN ReporteServicioTecnico ******
    - excelData -> Array de datos a mostrar
    - excelColumns -> Array de objetos al igual que en Datatable pero sin opcion "cell"
                    * header: encabezado de la columna
                    * accessor: nombre de la propiedad a acceder de excelData
                    * type: tipo de dato para dar formato en excel (number, date, etc.)
    - name -> Nombre que tendrá el archivo al guardarse
    - graph -> imagen de la grafica
*/
export const randomColors = ['02869B', 'A07EC1', '7240A2', 'FFC300', 'D03838', 'F19D00', '18CBA5', '1E8AA9', '845CE8', 'D05877', 'E9B45D', '3AA09B', '5D89E9', '4CC981'];

export async function exportExcel(excelData, excelColumns, name, graph,startDate) {
    graph = graph || null
    // console.log('excelData', excelData)
    const data = excelData.map((item, index) => {
        // console.log("item",item)
        const convertedItem = {};
        for (let i = 0; i < excelColumns.length; i++) {
            const prop = excelColumns[i].accessor;
            if (item[prop]) {
                if (excelColumns[i].type === "number") {
                    convertedItem[prop] = !isNaN(item[prop]) ? parseInt(item[prop]) : '';
                } else if (excelColumns[i].type === 'date') {
                    const fecha = item[prop].split(' ')
                    const [year, month, day] = fecha[0].split('-');
                    const date = new Date(`${year}-${month}-${day}`);
                    convertedItem[prop] = !isNaN(date.getTime()) ? date : '';
                } else {
                    convertedItem[prop] = item[prop] ?? '';
                }
            } else {
                convertedItem[prop] = '';
            }
        }
        return convertedItem;
    });

    const headers = excelColumns.map((column) => {
        return column.header;
    });

    const workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Hoja1');
    worksheet = await generatTemplate(worksheet, workbook, '', 'M')
    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } }, // Color de letra blanco
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B2654' } }, // Relleno
    };

    // Agrega datos a la hoja de cálculo
    const headersRow = worksheet.addRow(headers);

    // Define formatos de número y fecha
    const numberFormat = '#,##0.00';
    const dateFormat = 'dd/mm/yyyy';

    data.forEach((reg) => {
        const row = excelColumns.map((col) => {
            // console.log(reg, col)
            let value = reg[col.accessor];
            // Aplica el formato adecuado según el tipo de dato
            // if (col.type === 'number') {
            //     worksheet.getColumn(col.accessor).numFmt = numberFormat;
            // } else if (col.type === 'date') {
            //     worksheet.getColumn(col.accessor).numFmt = dateFormat;
            // }
            return value;
        });
        worksheet.addRow(row);
    });

    // Configura el ancho de las columnas
    excelColumns.forEach((col, index) => {
        // console.log(index)
        worksheet.getColumn(index + 1).width = 25;
    });

    headersRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
    });

    // Agregar filtros a las columnas
    worksheet.autoFilter = {
        from: {
            row: headersRow.number, // Fila donde comienzan los encabezados (la primera fila con datos)
            column: 1, // Columna de la primera celda de encabezados (Fecha)
        },
        to: {
            row: headersRow.number, // Fila donde terminan los encabezados (la primera fila con datos)
            column: headersRow._cells?.length, // Columna de la última celda de encabezados (Diferencia)
        },
    };

    if (graph) {
        const imageId = workbook.addImage({
            base64: graph,
            extension: 'png',
        });

        worksheet.addImage(imageId,
            {
                tl: { col: 3, row: 1 }, // Coordenada para la esquina superior izquierda (D4)
                br: { col: 21, row: 18 }, // Coordenada para reducir el tamaño de la imagen
                editAs: 'absolute',
            }
        );
        worksheet.mergeCells('D2:U18')
    }

    // Crea un archivo blob para descargar
    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(url);
    });
}

export const lettersExcel = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

export const noFillableRows = ['C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4']

export const excelBg = { type: 'pattern', pattern: 'solid' }

export async function generatTemplate(worksheet, workbook, title = '', finalLogo = 'Z') {
    const empresa = await getEnterpriseData();

    const imageId = workbook.addImage({
        base64: `data:image/png;base64,${empresa.logo}`,
        extension: 'png',
    });

    worksheet.addImage(imageId,
        {
            tl: { col: 0, row: 0.8 }, // Coordenada para la esquina superior izquierda (D4)
            ext: { height: 50, width: 180 },
            editAs: 'absolute',
        }
    );
    worksheet.addRows([{}, {}, {}, {}]);
    worksheet.getCell('D1').value = `${empresa.empresa}, S.A. DE C.V`;
    worksheet.getCell('D1').style = { font: { bold: true, size: 20 } };
    worksheet.mergeCells('A1:C3');
    worksheet.mergeCells(`D1:${finalLogo}1`);
    worksheet.getCell('D2').value = title;
    worksheet.getCell('D2').style = { font: { bold: true, size: 15 } };
    worksheet.mergeCells(`D2:${finalLogo}2`);
    worksheet.mergeCells(`D3:${finalLogo}3`);
    return worksheet;
}

export const addAligmentToHeaders = (worksheet, titleValues = {}, options = { width: 0, align: 0 }) => {
    const cellBorder = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    }
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
                    cell.alignment = { ...cell.alignment, ...options.align, horizontal: 'center', vertical: 'middle' }
                }
                if (Object.keys(titleValues).includes(cell.value)) {
                    cell.font = headerStyle.font;
                    cell.fill = headerStyle.fill;
                }
            }

        });
        if (!options.width)
            column.width = maxLength < 10 ? 10 : maxLength;
        else
            column.width = options.width
    });
    return worksheet;
}
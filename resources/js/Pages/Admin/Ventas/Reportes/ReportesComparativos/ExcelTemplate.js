import { getEnterpriseData } from '@/utils';
import { Workbook, FormulaType } from 'exceljs';

export async function excelTemplate(excelData, excelColumns, name, pagosCanceladosCheck) {
    // console.log('data', excelData)
    const data = excelData.map((item, index) => {
        const convertedItem = {};
        for (let i = 0; i < excelColumns.length; i++) {
            const prop = excelColumns[i].accessor;
            if (item[prop]) {
                if (excelColumns[i].type === "number") {
                    convertedItem[prop] = !isNaN(item[prop]) ? parseFloat(item[prop]) : '';
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
    worksheet = await generatTemplate(worksheet, workbook, '', 'E', pagosCanceladosCheck, excelData)

    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B2654' } },
    };

    const headersRow = worksheet.addRow(headers);
    headersRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
    });

    data.forEach((reg) => {
        const row = excelColumns.map((col) => {
            // console.log(col, 'col')
            let accessor = col.accessor.split('.').length > 0 ? col.accessor.split('.')[0] : col.accessor.split('.')[1]
            let value = reg[accessor];
            return value;
        });
        worksheet.addRow(row);
    });

    excelColumns.forEach((col, index) => {
        worksheet.getColumn(index + 1).width = 25;
    });

    worksheet.autoFilter = {
        from: {
            row: headersRow.number,
            column: 1,
        },
        to: {
            row: headersRow.number,
            column: worksheet.columnCount,
        },
    };
    worksheet.addRow({});
    const columnsToSum = ['E', 'F'];
    columnsToSum.forEach((col) => {
        const totalCell = worksheet.getCell(`${col}${worksheet.lastRow.number}`);
        totalCell.value = {
            formula: `SUM(${col}7:${col}${worksheet.lastRow.number - 1})`,
            formulaType: FormulaType.Shared, // Esta opción es importante
        };
    });

    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(url);
    });
}


export async function generatTemplate(worksheet, workbook, title = '', finalLogo = 'Z', pagosCanceladosCheck, excelData) {
    const empresa = await getEnterpriseData();

    const imageId = workbook.addImage({
        base64: `data:image/png;base64,${empresa.logo}`,
        extension: 'png',
    });

    worksheet.addImage(imageId,
        {
            tl: { col: 0, row: 0.8 },
            ext: { height: 50, width: 180 },
            editAs: 'absolute',
        }
    );
    worksheet.addRows([{}, {}, {}, {}]);
    worksheet.getCell('D1:F1').value = `${empresa.empresa}, S.A. DE C.V`;
    worksheet.getCell('D1:F1').style = { font: { bold: true, size: 20 } };



    const titleText = 'Reporte Comparativo'

    worksheet.mergeCells('A1:C3');
    worksheet.mergeCells(`D1:${finalLogo}1`);
    worksheet.getCell('D2').value = title;
    worksheet.getCell('D2').style = { font: { bold: true, size: 15 } };
    worksheet.mergeCells(`D2:${finalLogo}2`);
    worksheet.mergeCells(`D3:${finalLogo}3`);
    worksheet.getCell('D2').value = titleText;
    worksheet.getCell('D2').style = { font: { bold: true, size: 15 } };

    return worksheet;
}




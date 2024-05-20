import { Workbook, FormulaType } from 'exceljs';

export function exportRemisiones(excelData, excelColumns, name) {
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
    const worksheet = workbook.addWorksheet('Hoja1');

    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B2654' } },
    };

    const numberFormat = '#,##0.00';
    const dateFormat = 'dd/mm/yyyy';

    const headersRow = worksheet.addRow(headers);
    headersRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
    });

    data.forEach((reg) => {
        const row = excelColumns.map((col) => {
            let value = reg[col.accessor];
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

    // Agregar una fila vacía
    worksheet.addRow({});

    // Configurar fórmulas de suma para las columnas "L" a "P"
    const columnsToSum = ['L', 'M', 'N', 'O', 'P'];
    columnsToSum.forEach((col) => {
        const totalCell = worksheet.getCell(`${col}${worksheet.lastRow.number}`);
        totalCell.value = {
            formula: `SUM(${col}2:${col}${worksheet.lastRow.number - 1})`, // Excluye la fila de totales en la suma
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

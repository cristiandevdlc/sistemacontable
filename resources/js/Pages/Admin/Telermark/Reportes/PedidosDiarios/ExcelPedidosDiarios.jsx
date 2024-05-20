import { addAligmentToHeaders, generatTemplate, lettersExcel, excelBg } from '@/core/CreateExcel';
import { primaryColorExcel, regex } from '@/utils';
import MonthsList from '@/core/MonthsList';
import { Workbook } from 'exceljs';


const stValues = {
    lle: 'LLENOS',
    est: 'ESTACIONARIO',
    rec: 'RECARGAS',
    tot: 'TOTAL DIARIO',
    met: 'META',
    mea: 'META-ACOMULADO',
    LLENOS: 'lle',
    ESTACIONARIO: 'est',
    RECARGAS: 'rec',
    META: 'met',
    'TOTAL DIARIO': 'tot',
    'META-ACOMULADO': 'mea',
}

const optTurnoData = {
    matutino: 0,
    vespertino: 1,
    total: 2,
    acomulado: 3,
    0: 'matutino',
    1: 'vespertino',
    2: 'total',
    3: 'acomulado',
}

export async function exportExcel({ compList = { matutino: [], vespertino: [], total: [], acomulado: [], rowsData: {} }, data, chartData = {}, state}) {
    const graphImage = chartData[optTurnoData[state]].ref.current.getBase64Image()
    const tV = {
        month: { val: MonthsList.find((month) => month.id === data.month).value.toUpperCase(), color: '8DB4E2' },
        mat: { val: 'MATUTINO', color: 'FABF8F' },
        ves: { val: 'VESPERTINO', color: '8DB4E2' },
        tot: { val: 'TOTAL', color: 'FFF981' },
        acc: { val: 'ACOMULADO', color: 'FFF981', color2: 'FFFFCC' },
        sum: { val: 'SUMA', color: 'FFFF00' },
        pro: { val: 'PROMEDIO', color: '8DB4E2' },
        met: { val1: 'META', val2: 'META-ACOMULADO', color: '8DB4E2' },
        MATUTINO: 'mat',
        VESPERTINO: 'ves',
        TOTAL: 'tot',
        ACOMULADO: 'acc',
        SUMA: 'sum',
        PROMEDIO: 'pro',
        default: 'FFFF00',
    }
    const mes = MonthsList.find((month) => month.id === data.month)
    const workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Hoja1');

    worksheet = await generatTemplate(worksheet, workbook, `DESGLOSE DIARIO Y ACOMULADO DE PEDIDOS SURTIDOS, CONFIRMADOS Y PROGRAMADOS DEL MES DE ${mes.value.toUpperCase()} ${data.year}`)


    const initialHeaders = []
    const headersTurns = Object.keys(chartData).map(key => (key !== 'rowsData') && key.toUpperCase()).filter(key => key !== false);

    headersTurns.unshift('');
    const headersType = Object.keys(compList.acomulado[0]).map(key => key.toUpperCase().replace('_', ' '));
    initialHeaders.push(mes.value.toUpperCase());
    initialHeaders.push(headersType.shift());
    let lastIndex = 0;

    /// Agrega los headers de los turnos
    headersTurns.forEach((r, i) => {
        if (lastIndex === 0) lastIndex = 1
        if (i > 0) {
            worksheet.getCell(`${lettersExcel[lastIndex]}5`).value = r;
            const finalCell = lastIndex + 3
            worksheet.mergeCells(`${lettersExcel[lastIndex]}5:${lettersExcel[finalCell]}5`)
            lastIndex = finalCell + 1
        }
    })

    const rowHeadersTypes = worksheet.getRow(6)
    rowHeadersTypes.getCell(1).value = mes.value.toUpperCase()
    rowHeadersTypes.getCell(1).alignment = { vertical: 'top', textRotation: 90 }

    // Agrega los headers del tipo de servicio
    headersType.forEach((type, index) => {
        rowHeadersTypes.getCell(index + 2).value = type
        rowHeadersTypes.getCell(index + 6).value = type
        rowHeadersTypes.getCell(index + 10).value = type
        rowHeadersTypes.getCell(index + 14).value = type
        rowHeadersTypes.getCell(index + 2).alignment = { vertical: 'top', textRotation: 90 }
        rowHeadersTypes.getCell(index + 6).alignment = { vertical: 'top', textRotation: 90 }
        rowHeadersTypes.getCell(index + 10).alignment = { vertical: 'top', textRotation: 90 }
        rowHeadersTypes.getCell(index + 14).alignment = { vertical: 'top', textRotation: 90 }
    })

    worksheet.getCell('R6').value = "META"
    worksheet.getCell('R6').alignment = { vertical: 'top', textRotation: 90 }

    worksheet.getCell('S6').value = "META-ACOMULADO"
    worksheet.getCell('S6').alignment = { vertical: 'top', textRotation: 90 }



    worksheet.addRows(Object.values(compList.rowsData))
    worksheet = addAligmentToHeaders(worksheet, {}, { width: 9 })

    let lastTurn = 0;
    let sumRow = 0;
    let promRow = 0;
    let lastType = 0;
    worksheet.columns.forEach((column) => {
        column['eachCell']({ includeEmpty: false }, (cell) => {
            if (cell.$col$row.split('$')[2] != 1 && cell.$col$row.split('$')[2] != 2 && cell.$col$row.split('$')[2] != 3) {
                if (isNaN(cell.value)) {
                    // le da color al header del turno y en base a eso guarda el turno para pintar todo lo que esta por debajo
                    if (cell.value === tV.mat.val || cell.value === tV.ves.val || cell.value === tV.tot.val || cell.value === tV.acc.val) {
                        lastTurn = tV[cell.value]
                        cell.fill = { ...excelBg, fgColor: { argb: tV[lastTurn].color } }
                    } else {
                        /// Obtiene verifica si el header es un tipo de servicio y obtiene el ultimo tipo de servicio 
                        if (Object.values(stValues).includes(cell.value))
                            lastType = stValues[cell.value];
                        cell.fill = { ...excelBg, fgColor: { argb: tV[lastTurn] && tV[lastTurn].color } }
                    }
                    // Pinta la celda del mes
                    if (cell.value === tV.month.val)
                        cell.fill = { ...excelBg, fgColor: { argb: tV.month.color } }
                    // Si la celda es una fecha la pinta por defecto
                    if (regex.date1.test(cell.value))
                        cell.fill = { ...excelBg, fgColor: { argb: tV.default } }

                    //Obtiene el numero de la fila de la suma y promedio
                    if (cell.value === tV.sum.val)
                        sumRow = cell.row
                    if (cell.value === tV.pro.val)
                        promRow = cell.row

                    if (tV.met.val1 === cell.value || tV.met.val2 === cell.value) {
                        lastType = cell.value
                        cell.fill = { ...excelBg, fgColor: { argb: tV.met.color } }
                    }
                } else {
                    if ((stValues[lastType] == stValues.tot) && (cell.value !== null))
                        cell.fill = { ...excelBg, fgColor: { argb: tV[lastTurn] && tV[lastTurn].color } }
                    if (((lastType == stValues.met) || (lastType == stValues.mea)) && (cell.value !== null))
                        cell.fill = { ...excelBg, fgColor: { argb: tV.met.color } }
                }
            }
        })
    })

    /// Le da color a la suma y promedio
    worksheet.getRow(sumRow)['eachCell']({ includeEmpty: false }, (cell) => {
        if (cell.value !== null)
            cell.fill = { ...excelBg, fgColor: { argb: tV.sum.color } }
    })
    worksheet.getRow(promRow)['eachCell']({ includeEmpty: false }, (cell) => {
        if (cell.value !== null)
            cell.fill = { ...excelBg, fgColor: { argb: tV.pro.color } }
    })


    const imageId = workbook.addImage({
        base64: graphImage,
        extension: 'png',
    });

    worksheet.addImage(imageId,
        {
            tl: { col: 20, row: 4 }, // Coordenada para la esquina superior izquierda (D4)
            br: { col: 34, row: 22 }, // Coordenada para reducir el tamaño de la imagen
            editAs: 'absolute',
        }
    );
    
    worksheet.mergeCells('U5:AH22')

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

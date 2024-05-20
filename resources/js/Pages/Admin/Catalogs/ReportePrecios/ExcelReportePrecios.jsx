 import * as ExcelJS from 'exceljs';
 import React from 'react';
import imagenintergas from './img/imagenintergas.png';

// Función para cargar una imagen y convertirla en un buffer
const loadImageAsBuffer = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = function () {
      reject('Network error occurred');
    };

    xhr.send();
  });
};

// Función para manejar la exportación a Excel
export const handleExportToExcel = async (data, selectedZone, otro) => {
  // console.log('excel otro', otro);

  // Crear una nueva instancia de ExcelJS
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Estilos para el título
 

  // Agregar el título con la zona seleccionada y aplicar el estilo
  const titulo = worksheet.getCell('A4');
  titulo.value = `Zona: ${otro}`;
  titulo.font = { size: 20, bold: true }; // Tamaño de fuente 40 y en negritas
  // Ajustar el ancho de la columna y la altura de la fila para mostrar completamente el texto "INTERGAS DEL NORTE"
  worksheet.getColumn('A').width = 40; // Ajustar el ancho de la columna A
  worksheet.getRow(4).height = 30; // 

  worksheet.columns = [
    { key: 'fecha', width: 15 },
    { key: 'anterior', width: 20 },
    { key: 'precio', width: 20 },
    { key: 'diferencia', width: 20 },
    // Agrega más columnas aquí si es necesario
    { key: 'emptyColumn', width: 15 }, // Columna vacía para separar la tabla de la celda D
  ];

// Establecer el ancho de la columna D según el ancho total de la tabla

  // Fusionar las celdas A1 hasta D1 para mostrar el título en la celda D
  worksheet.mergeCells('A1:D1');

  // Insertar una fila en blanco para dar un salto

  const lonelyCell = worksheet.getCell('A3'); // Obtener la celda A3 que quedó sola después del salto
  lonelyCell.value = 'INTERGAS DEL NORTE';
  lonelyCell.font = { size: 30, bold: true }; // Tamaño de fuente 40 y en negritas

  // Ajustar el ancho de la columna y la altura de la fila para mostrar completamente el texto "INTERGAS DEL NORTE"
  worksheet.getColumn('A').width = 40; // Ajustar el ancho de la columna A
  worksheet.getRow(3).height = 60; // Ajustar la altura de la fila 3

  // Añadir encabezados para las columnas
  const headersRow = worksheet.addRow(['Fecha', 'Anterior', 'Precio', 'Diferencia']);
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } }, // Color de letra blanco
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E65100' } }, // Relleno naranja
  };

  // Agregar los datos al worksheet
  worksheet.addRows(data);

  // Estilos para las celdas de datos (bordes y rellenado)
  const cellStyle = {
    border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' }, color: { argb: "FF000000" } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }, // Relleno blanco
  };

  // Aplicar los estilos a todas las celdas de datos
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 4) {
      // No aplicar estilos al título, salto, encabezados y la celda con "INTERGAS DEL NORTE" (primera a cuarta fila)
      row.eachCell((cell) => {
        cell.border = cellStyle.border;
      });
    }
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
      column: worksheet.columnCount, // Columna de la última celda de encabezados (Diferencia)
    },
  };

  try {
    // Cargar la imagen y convertirla en buffer
    const imageBuffer = await loadImageAsBuffer(imagenintergas); // Reemplaza la ruta con la ubicación correcta de la imagen

    // Agregar imagen
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    });
    // Obtener el ancho y alto de la imagen
 
    worksheet.addImage(imageId, {
      tl: { col: 3, row: 3 }, // Nueva coordenada para la esquina superior izquierda (D4)
      br: { col: 4, row: 4 }, // Nueva coordenada para la esquina inferior derecha (D4)
      editAs: 'absolute',
    });
    
    
    
    // Obtener el búfer con los datos del archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Crear un objeto Blob con el búfer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Crear una URL para descargar el archivo Excel
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace (link) y hacer clic en él para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.xlsx';
    a.click();

    // Liberar la URL creada para evitar pérdida de memoria
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
  }
};



// PDFComponent.js

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../../../png/Grupo 10@2x.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '9%',
    width: '100%',
    // backgroundColor: 'yellow'
  },
  item: {
    width: '60%',
    fontSize: '50pt',
    top: 40,
    fontFamily: 'Helvetica-Bold',
    // backgroundColor: 'gray'
  },
  logo: {
    width: '25%',
    // backgroundColor: 'gray'
  },
  fecha: {
    width: '25%',
    fontSize: 10,
    textAlign: 'right',
    // backgroundColor: 'gray',
  },

  dataContainer: {
    paddingTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  firmaContainer: {
    bottom: -60,
    left: 205
  },

  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 8,
    // fontFamily: 'Helvetica-Bold',
  },
  firmaListItem: {
    fontSize: 12,
    marginBottom: 8,
    left: 60
  },
  listItemDescripcion: {
    fontSize: 10,
    marginBottom: 8,
    paddingTop: 20
  },

  tableContainer: {
    paddingTop: 10
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderWidth: 1,

  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderWidth: 1,
    backgroundColor: '#2b3f75',
    color: 'white'
  },
  cell: {
    flex: 1,
    padding: 2,
  },
  fuente: {
    fontSize: 8,
  }
});

const ReportePDF = ({ data, historial }) => {
  const date = new Date
  const fecha = new Intl.DateTimeFormat('es-MX').format(date)

  const numberFormat = (number) => {
    const num = parseInt(number)
    const newString = num.toString()
    return newString
  }

  function getDatesDifference(startDate, endDate) {
    const date1 = new Date(startDate) 
    const date2 = new Date(endDate) 
    const diffInMs = date2 - date1;
  
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
  
    const days = Math.floor(diffInMs / msPerDay);
    const hours = Math.floor((diffInMs % msPerDay) / msPerHour);
    const minutes = Math.floor((diffInMs % msPerHour) / msPerMinute);
  
    return `${days}:${hours}:${minutes}`;
  }
  

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image src={intergasLogo} />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>Reposición de Gas</Text>
          </View>
          <View style={styles.fecha}>
            <Text>Fecha: {fecha}</Text>
            <Text>Folio: {data.pedidoId}</Text>
          </View>
        </View>
        <View>
          <View style={styles.dataContainer}>
              <Text style={styles.listItem}>Cliente: {data.cliente}</Text>
              <Text style={styles.listItem}>Teléfono: {data.telefono}</Text>
              <Text style={styles.listItem}>Dirección: {data.direccion}</Text>
              <Text style={styles.listItem}>Situación: {data.servicio}</Text>
              <Text style={styles.listItem}>Cambio de tanque: {!data.cambioTanque ? "No" :"Si"}</Text>
              <Text style={styles.listItem}>Cantidad: {data.detalles.rdg} Kg.</Text>
          </View>
          {historial && historial.length > 0 &&
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Fecha registro</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Registrado por</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Cantidad</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Producto</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Ruta</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Tiempo</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Fecha surtido</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Surtido por</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.fuente}>Folio</Text>
                  </View>
                </View>
                {historial.map((item) => (
                  <View key={item.pedidoId} style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.fechaPedido}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.usuario_nombre}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{numberFormat(item.Cantidad)}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.producto_nombre}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.ruta_nombre}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{getDatesDifference(item.fechaPedido, item.fechaSurtido)}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.fechaSurtido}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.surtidoPor}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.pedidoId}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          }
          {historial && historial.length === 0 &&
            <Text style={styles.listItem}>Este cliente no tiene historial</Text>
          }
          <Text style={styles.listItemDescripcion}>Descripción: {data.obs ?? ""}</Text>
          <View style={styles.firmaContainer}>
            <Text style={styles.listItem}>_______________________</Text>
            <Text style={styles.firmaListItem}>Firma</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportePDF;

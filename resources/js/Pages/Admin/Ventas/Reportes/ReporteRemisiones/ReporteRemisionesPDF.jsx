// PDFComponent.js

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../../../png/Grupo 10@2x.png";
import { Divider } from '@mui/material';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    width: '400%',

  },

  item: {
    width: '60%',
    fontSize: '23pt',
    top: 40,
    fontFamily: 'Helvetica-Bold',
  },

  fecha: {
    width: '50%',
    fontSize: 10,
    textAlign: 'right',
    // backgroundColor: 'gray',
  },

  dataContainer: {
    paddingTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  tableContainer: {
    paddingTop: 60
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
    paddingVertical: 2,
    borderWidth: 1,
    backgroundColor: '#2b3f75',
    color: 'white',
    width: '100%',
  },



  cell: {
    flex: 1,
    padding: 1,


  },
  cellText: {

    textAlign: 'left',
    fontSize: '8px'

  },
  fuente: {
    fontSize: 8,
  },


  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    // borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    height: 40,
    marginRight: 10,
  },
  logoImage: {
    width: '140%',
    height: '100%',
    resizeMode: 'contain',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',

    // color: '#333',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginLeft: "35px",
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 5,
  },
  date: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',

  },
});

const ReportePDF = ({ data, state, startDate, endDate, sumakgcontado, sumakgcredito, sumacontado, sumacantidad, sumabonificacioncredito }) => {
  const fechaInicio = startDate;

  const date = new Date
  const fecha = new Intl.DateTimeFormat('es-MX').format(date)

  const numberFormat = (number) => {
    const num = parseInt(number)
    const newString = num.toString()
    return newString
  }

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image style={styles.logoImage} src={intergasLogo} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}> Remisiones</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Fecha del: </Text>
            <Text style={styles.date}>{data.fechaInicial}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}> al:</Text>
            <Text style={styles.date}>{data.fechaFinal}</Text>
          </View>
        </View>
        <View>

          {state.Procedimiento && state.Procedimiento.length > 0 &&
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>nControl</Text>
                  </View>

                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Remision</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Fecha</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Turno</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Cliente</Text>
                  </View>

                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Cantidad</Text>
                  </View>

                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Bonificacion</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Importe</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>Total</Text>
                  </View>
                </View>
                {state.Procedimiento.map((item) => (
                  <View style={styles.row}>

                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.nControl}</Text>
                    </View>

                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.Remision}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.fecha}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.turno}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{item.Cliente}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{parseFloat(item.Cantidad).toFixed(3)}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{parseFloat(item.Bonificacion).toFixed(3)}</Text>
                    </View>

                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{parseFloat(item.Importe).toFixed(3)}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.fuente}>{parseFloat(item.Total).toFixed(3)}</Text>

                    </View>
                  </View>
                ))}
              </View>
            </View>
          }
        </View>
        <br /> <br />
        <hr />

        <div style={{ marginTop: "90px" }}>

          <View style={styles.tableHeader}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Total Litros:</Text>
              <br />
              <span>
                <Text style={styles.fuente}>{state.TotalLts ? state.TotalLts.toFixed(4) : 0}</Text>
              </span>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>TotalCantidad</Text>
              <br />
              <span>
                <Text style={styles.fuente}>{state.TotalCantidad ? state.TotalCantidad.toFixed(4) : 0}</Text>
              </span>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Total Bonificación</Text>
              <br />
              <span>
                <Text style={styles.fuente}>{state.TotalBonificacion ? state.TotalBonificacion.toFixed(4) : 0}</Text>
              </span>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Total Importe</Text>
              <br />
              <span>
                <Text style={styles.fuente}>{state.TotalImporte ? state.TotalImporte.toFixed(4) : 0}</Text>
              </span>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Total</Text>
              <br />
              <span>
                <Text style={styles.fuente}>
                  {state.Total ? state.Total.toFixed(4) : 0}</Text>
              </span>
            </View>
          </View>
        </div>

      </Page>
    </Document>
  );
};

export default ReportePDF;

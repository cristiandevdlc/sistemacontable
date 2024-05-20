import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../png/Grupo 10@2x.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  block: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#333',
    padding: 10,
    marginBottom: 10,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  compraDetails: {},
  compraHeader: {
    flexDirection: 'row',
  },
  compraTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: '25%',
    justifyContent: 'center',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 4,
    flex: 1,
    textAlign: 'center', // Alinea el texto al centro horizontalmente
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 13,
    flex: 1,
    textAlign: 'center', // Alinea el texto al centro horizontalmente
  },
  totalsRow: {
    flexDirection: 'row',
  },
  nameCell: {
    fontSize: 12,
    flex: 3, // Ajusta el ancho para dar más espacio al nombre
    textAlign: 'left', // Alinea el nombre a la izquierda
  },
});

const ReporteVentasTotalPDF = ({ data, startDate, endDate }) => {
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-MX').format(date);

  const getClienteNombre = (clienteId) => {
    const cliente = data.find((item) => item.nombreCompleto === clienteId);
    return cliente ? cliente.nombreCompleto : 'Nombre no encontrado';
  }

  let totalContado = 0;
  let totalCredito = 0;

  return (
    <Document title="Reporte General" author="INTERGAS DEL NORTE SA DE CV" creator="" language="spanish">
      <Page size="A4" style={styles.page}>
        <View style={styles.block}>
          <View style={styles.logo}>
            <Image src={intergasLogo} />
          </View>
          <View style={styles.blockHeader}>
            <Text style={styles.blockTitle}>Reporte General</Text>
            <Text>Fecha: {formattedDate}</Text>
          </View>
          {data && (
            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Text style={{ flex: 1 }}>Fecha inicial: {startDate}</Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>Fecha final: {endDate}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.nameCell}>Nombre Cliente</Text>
                <Text style={styles.totalText}>Contado</Text>
                <Text style={styles.totalText}>Crédito</Text>
                <Text style={styles.totalText}>Total</Text>
              </View>
            </View>
          )}

          {data &&
            data.length > 0 &&
            data.map((item, index) => {
              totalContado += parseFloat(item.totalContado);
              totalCredito += parseFloat(item.totalCredito);

              return (
                <View key={item.idVentaEncabezadoTiendita}>
                  <View style={styles.compraHeader}>
                  </View>
                  <View style={styles.compraDetails}>
                    <View style={styles.totalsRow}>
                      <Text style={styles.nameCell}>{getClienteNombre(item.nombreCompleto)}</Text>
                      <Text style={styles.totalText}>${parseFloat(item.totalContado).toFixed(2)}</Text>
                      <Text style={styles.totalText}>${parseFloat(item.totalCredito).toFixed(2)}</Text>
                      <Text style={styles.totalText}>${(parseFloat(item.totalCredito) + parseFloat(item.totalContado)).toFixed(2)}</Text>
                    </View>

                  </View>
                </View>
              );
            })}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.listItem}>________________________________________________________________________________</Text>
          </View>

          <View style={styles.totalsRow}>
            <Text style={styles.nameCell}>Totales:</Text>
            <Text style={styles.listItem}>${totalContado.toFixed(2)}</Text>
            <Text style={styles.listItem}>${totalCredito.toFixed(2)}</Text>
            <Text style={styles.listItem}>${(totalContado + totalCredito).toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReporteVentasTotalPDF;

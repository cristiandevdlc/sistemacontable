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
  compraDetails: {
    marginTop: 10,
  },
  compraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 25,
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
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
});

const ReporteClientePDF = ({ data, startDate, endDate }) => {
  console.log("hola puta",data)
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-MX').format(date);

  const getClienteNombre = (clienteId) => {
    const cliente = data.find((item) => item.nombreCompleto === clienteId);
    return cliente ? cliente.nombreCompleto : 'Nombre no encontrado';
  }

  let totalContado = 0;
  let totalCredito = 0;

  return (
    <Document title="Reporte Cliente" author="INTERGAS DEL NORTE SA DE CV" creator="" language="spanish">
      <Page size="A4" style={styles.page}>
        <View style={styles.block}>

          <View style={styles.logo}>
            <Image src={intergasLogo} />
          </View>
          <View style={styles.blockHeader}>
            <Text style={styles.blockTitle}>Reporte de Cliente</Text>
            <Text>Fecha: {formattedDate}</Text>
          </View>
          {data && data.length > 0 && (
            <View style={styles.block}>
              <View style={styles.blockHeader}>
                <Text style={{ flex: 1 }}>Fecha inicial: {startDate}</Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>Fecha final: {endDate}</Text>
              </View>
              <View style={styles.blockHeader}>
                <Text style={styles.listItem}>Cliente: {getClienteNombre(data[0].nombreCompleto)}</Text>
              </View>
            </View>
          )}

          {data &&
            data.length > 0 &&
            data.map((item, index) => {
              // Calcula las sumas de Contado y Crédito
              totalContado += parseFloat(item.totalContado);
              totalCredito += parseFloat(item.totalCredito);

              return (
                <View key={item.idVentaEncabezadoTiendita}>
                  <View style={styles.compraHeader}>
                  <Text style={styles.listItem}>Fecha de Compra: {item.fechaCompra.substring(0, 16)}</Text>
                    <Text style={styles.listItem}>{item.metodoPago}</Text>
                  </View>
                  <View style={styles.compraDetails}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.listItem}></Text>
                    </View>
                    {item.detalles && item.detalles.length > 0 && (
                      <View>
                        <Text style={styles.compraTitle}>Articulos:</Text>
                        {item.detalles.map((detalle, detalleIndex) => (
                          <View key={detalleIndex} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 13, flex: 2 }}>{detalle.articulo_nombre}</Text>
                            <Text style={{ fontSize: 13, flex: 1, textAlign: 'center' }}>{parseInt(detalle.Cantidad)}</Text>
                            <Text style={{ fontSize: 13, flex: 1, textAlign: 'right' }}>${parseFloat(detalle.Precio).toFixed(2)}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.listItem}></Text>
                      <Text style={styles.totalText}>Total: ${parseFloat(item.total).toFixed(2)} mxn</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.listItem}>________________________________________________________________________________</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.listItem}></Text>
            <Text style={styles.totalText}>Total Contado: ${totalContado.toFixed(2)}</Text>
            <Text style={styles.totalText}>Total Crédito: ${totalCredito.toFixed(2)}</Text>
            <Text style={styles.totalText}>Totales: ${(totalContado + totalCredito).toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReporteClientePDF;

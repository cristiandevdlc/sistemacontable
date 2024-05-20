import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../../png/Grupo 10@2x.png";

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
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },

  logo: {
    width: '25%',
    justifyContent: 'center',
  },

});

const ReportePDF = ({ data }) => {
    console.log("data",data)
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('es-MX').format(date);
  
    if (!data || data.length === 0) {
      return null;
    }
  
    const cliente = data[0];
  
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#FFF', // Cambia el color de fondo a blanco para un aspecto más profesional
        padding: 20,
      },
      header: {
        marginBottom: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 18,
        marginBottom: 5,
      },
      text: {
        fontSize: 12,
        marginBottom: 3,
      },
      logo: {
        width: '25%',
      },
    });
  
    return (
      <Document title="Recibo de Pago" author="INTERGAS DEL NORTE SA DE CV" creator="" language="spanish">
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Image src={intergasLogo} />
            </View>
            <Text style={styles.title}>Recibo de Pagos</Text>
            <Text style={styles.subtitle}>Fecha: {formattedDate}</Text>
          </View>
          <View>
            <Text style={styles.text}>Cliente: {cliente.cliente_nombrecomercial}</Text>
            <Text style={styles.text}>Dirección: {cliente.empresa_calle}, {cliente.empresa_numeroExterior}, {cliente.empresa_numeroInterior}, {cliente.empresa_localidad}, CP: {cliente.empresa_codigoPostal}</Text>
            <Text style={styles.text}>RFC: {cliente.empresa_rfc}</Text>
            <Text style={styles.text}>Teléfono: {cliente.empresa_telefonos}</Text>
          </View>
        </Page>
      </Document>
    );
  };
  
  
  

export default ReportePDF;


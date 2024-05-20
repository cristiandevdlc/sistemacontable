import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../../png/Grupo 10@2x.png";


// Define los estilos del PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  text: {
    textAlign: 'center',
  },
  centrarTitulo: {
    textAlign: 'center',
    fontSize: '16px',
    color: 'black'
  },
  centrarSubtitulo: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'black',
    lineHeight: '1.5',
  },
  Usuario: {
    alignContent: 'flex-start',
    textAlign: 'left',
    fontSize: '11px',
    color: 'black',
    lineHeight: '1.5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '9%',
    width: '100%',
    backgroundColor: 'yellow'
  },
  item: {
    width: '60%',
    fontSize: '50pt',
    top: 40,
    fontFamily: 'Helvetica-Bold',
    // backgroundColor: 'gray'
  },
  logo: {
    width: '15%',
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
    border: '1px solid #000',

  },
  fuente: {
    fontSize: 8,
  },
  izquierda: {
    marginLeft: 200,
    fontSize: '11px',
  },
  modelo: {
    fontSize: '11px',
    // border: '1px solid #000',
  },
  celdas: {
    border: '1px solid #000',
  }
  // ... Otros estilos
});


const GenerarPDF = ({ auditoria, detalles }) => {


  return (
    <Document title="Auditoria De sistemas" author="INTERGAS DEL NORTE SA DE CV" creator="AM" language="spanish">
      <Page size="A4" style={styles.page}>
        {/* Otro contenido del PDF */}
        <View>
          <Text style={styles.centrarTitulo}>Reporte De Equipo </Text>
        </View>
        <View style={styles.logo}>
          <Image src={intergasLogo} />
        </View>
        <View>
          <Text style={styles.centrarSubtitulo}>Departamento de TI Intergas del Norte S.A De C.V</Text>
        </View>
        <View>

          {/* <Text style={styles.Usuario}>USUARIO: {detalles[0].nombre_completo}</Text> */}
          {detalles && detalles.length > 0 ? (

            <Text style={styles.Usuario}>USUARIO: {detalles[0].nombre_completo}</Text>
          ) : (
            <Text style={styles.Usuario}>NO SE ENCONTRO USUARIO</Text>
          )}

          {/* <Text style={styles.Usuario}>DEPARTAMENTO:{auditoria.idDepartamento}</Text> */}
          {detalles && detalles.length > 0 ? (

            <Text style={styles.Usuario}>Departamento: {detalles[0].nombre}</Text>
          ) : (
            <Text style={styles.Usuario}> NO SE ENCONTRO DEPARTAMENTO</Text>
          )}
          {/* <Text style={styles.Usuario}>MODELO PC: {auditoria.descripcionEquipo}</Text> */}

          {detalles && detalles.length > 0 ? (

            <Text style={styles.Usuario}>MODELO PC: {detalles[0].descripcionEquipo}</Text>
          ) : (
            <Text style={styles.Usuario}> NO SE ENCONTRO MODELO PC</Text>
          )}
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>

            <Text style={styles.cell}>Descripcion</Text>
            <Text style={styles.cell}>Comentarios</Text>
            <Text style={styles.cell}>Estatus</Text>
          </View>
          {detalles && detalles.map((detalle, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{detalle.DescripcionRevision}</Text>
              <Text style={styles.cell}>{detalle.comentarios}</Text>
              <Text style={styles.cell}>
                {detalle.estatus === "1" ? "Activo" : "Inactivo"}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};


export default GenerarPDF;
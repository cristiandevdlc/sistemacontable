
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../../png/Grupo 10@2x.png";
import { Divider } from '@mui/material';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    width: '400%',

  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '9%',
    width: '100%',
    paddingHorizontal: 2 // Puedes ajustar este valor según tus preferencias
    // backgroundColor: 'yellow'
  },
  item: {
    width: '60%',
    fontSize: '23pt',
    top: 40,
    fontFamily: 'Helvetica-Bold',
  },
  logo: {
    width: '25%',
    // backgroundColor: 'gray'
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



  title: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: 'center',
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


});

const QrPDF = (data ) => {



 console.log("soy data",data)

//   const fechaInicio = startDate;

//   const date = new Date
//   const fecha = new Intl.DateTimeFormat('es-MX').format(date)

//   const numberFormat = (number) => {
//     const num = parseInt(number)
//     const newString = num.toString()
//     return newString
//   }

//   // console.log("dataarray",dataArray[0].turno)



  

//   return (
//     <Document>
//       <Page size={"A4"} style={styles.page}>
//         <View style={styles.header}>
//           <View style={styles.logo}>
//             <Image src={intergasLogo} />
//           </View>
//           <View style={styles.item}>
//             <Text style={styles.title}>Ventas Portatil Por Vendedor</Text>
//           </View>
//           <View style={styles.fecha}>
//             <Text>Fecha del: {startDate}</Text>

//           </View>

//           <View style={styles.fecha}>
//             <Text>Fecha al: {endDate}</Text>

//           </View>
//         </View>
//         <View>

//           {data && data.length > 0 &&
//             <View style={styles.tableContainer}>
//               <View style={styles.table}>
//                 <View style={styles.tableHeader}>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Folio</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Unidad</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Vendedor</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Kg Contado</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Contado</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>B Con</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Kg Credito</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Credito</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>B Credito</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Total Kg</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Promedio</Text>
//                   </View>
//                   <View style={styles.cell}>
//                     <Text style={styles.cellText}>Dias Trabajados</Text>
//                   </View>
//                 </View>
//                 {data.map((item) => (
//                   <View style={styles.row}>
                    
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>{item.nControl}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>{item.unidad_numeroComercial}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>{item.Operador}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.kg_contado).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.contado).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.Bonificacion_Contado).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.kg_Credito).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.credito).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.Bonificacion_Credito).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.total_kilos).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>${parseFloat(item.Contado).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>{parseFloat(item.Promedio).toFixed(3)}</Text>
//                     </View>
//                     <View style={styles.cell}>
//                       <Text style={styles.fuente}>{item.DiasTrabajados}</Text>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           }
//         </View>
//         <br /> <br />
//         <hr />

//         <div style={{ marginTop: "90px" }}>

//           <View style={styles.tableHeader}>
//             <View style={styles.cell}>
//               <Text style={styles.cellText}>kg Contado:</Text>
//               <br />
//               <span> 
//               <Text style={styles.fuente}>{sumakgcontado.toFixed(4)}</Text>            
//               </span>
//             </View>
//             <View style={styles.cell}>
//               <Text style={styles.cellText}>kg Credito</Text>
//               <br />
//               <span> 
//               <Text style={styles.fuente}>{sumakgcredito.toFixed(4)}</Text>            
//               </span>
//             </View>
//             <View style={styles.cell}>
//               <Text style={styles.cellText}>Contado</Text>
//               <br />
//               <span>
//               <Text style={styles.fuente}>{sumacontado.toFixed(4)}</Text>            
//               </span>
//             </View>
//             <View style={styles.cell}>
//               <Text style={styles.cellText}>Cantidad</Text>
//               <br />
//               <span>
//               <Text style={styles.fuente}>{sumacantidad.toFixed(4)}</Text>            
//               </span>
//             </View>
//             <View style={styles.cell}>
//               <Text style={styles.cellText}>Bonificacion Credito</Text>
//               <br />
//               <span>
//                 <Text style={styles.fuente}> {sumabonificacioncredito.toFixed(4)}</Text>
//               </span>
//             </View>
//           </View>
//         </div>

//       </Page>
//     </Document>
//   );
};

export default QrPDF;

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
        marginTop: 10,

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
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 5,
        marginBottom: 10,
    },
    nameCell: {
        fontSize: 12,
        flex: 3, // Ajusta el ancho para dar más espacio al nombre
        textAlign: 'left', // Alinea el nombre a la izquierda
    },
    detalleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
        paddingBottom: 1,
    },
    detalleHeader: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        color: '#333',
    },
});

const CortesPDF = ({ data }) => {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('es-MX').format(date);

    return (
        <Document title="Reporte General" author="INTERGAS DEL NORTE SA DE CV" creator="" language="spanish">
            <Page size="A4" style={styles.page}>
                <View style={styles.block}>
                    <View style={styles.logo}>
                        <Image src={intergasLogo} />
                    </View>
                    <View style={styles.blockHeader}>
                        {/* <Text style={styles.blockTitle}>{`Folio: ${data.length > 0 ? data[0].Folio : ''}`}</Text> */}
                        <Text style={styles.listItem}>Detalles de Venta</Text>
                        <Text style={styles.listItem}>{`Fecha: ${formattedDate}`}</Text>
                    </View>
                    {data && data.length > 0 && data.map((item, index) => (
                        <View key={index} style={styles.compraDetails}>
                            <View style={styles.detalleItem}>
                                <Text style={styles.nameCell}>{`Método de Pago: ${item.idMetodoPago}`}</Text>
                                <Text style={styles.totalText}>{`Fecha de Compra: ${item.fechaCompra}`}</Text>
                            </View>
                            <View style={styles.detalleItem}>
                                <Text style={styles.nameCell}>Artículo</Text>
                                <Text style={styles.totalText}>Cantidad</Text>
                                <Text style={styles.totalText}>Precio Unitario</Text>
                            </View>
                            {item.detallesVenta && item.detallesVenta.length > 0 && (
                                <View>
                                    {item.detallesVenta.map((detalle, dIndex) => (
                                        <View key={dIndex} style={styles.detalleItem}>
                                            <Text style={styles.nameCell}>{detalle.nombreArticulo}</Text>
                                            <Text style={styles.totalText}>{detalle.Cantidad}</Text>
                                            <Text style={styles.totalText}>{`$${parseFloat(detalle.Precio).toFixed(2)}`}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                            
                            <Text style={styles.totalText}>{`Total: $${parseFloat(item.total).toFixed(2)}`}</Text>
                            <Text style={styles.totalText}>{item.usuario_nombre}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default CortesPDF;

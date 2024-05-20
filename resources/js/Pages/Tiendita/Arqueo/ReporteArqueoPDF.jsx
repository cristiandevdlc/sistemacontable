import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../png/Grupo 10@2x.png";
import { useEffect } from 'react';

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

    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        marginBottom: 5,
        fontSize: 12,
        padding: 5,
        flex: 1,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    totalsRow: {
        flexDirection: 'row',
    },
    articulosXalm: {},
    compraHeader: {
        flexDirection: 'row',
    },

    totalText: {
        fontSize: 12,
        fontWeight: 'arial',
        marginBottom: 6,
        flex: 1,
        textAlign: 'left',
        color: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    totalTex2: {
        fontSize: 16,
        fontWeight: 'arial',
        marginBottom: 13,
        flex: 1,
        color: '#DC8A21',
        textAlign: 'left',
        color: '#C77D1D'
    },
});

const ReporteArqueoPDF = ({ data, state, columns }) => {

    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('es-MX').format(date);
    console.log('data', data)

    return (
        <Document title="Arqueo Almacén" author="INTERGAS DEL NORTE SA DE CV" creator="" language="spanish">
            <Page size="A4" style={styles.page}>
                <View style={styles.block}>

                    <View style={styles.logo}>
                        <Image src={intergasLogo} />
                    </View>
                    <View style={styles.blockHeader}>
                        <Text style={styles.blockTitle}>Reporte de Almacén</Text>
                        <Text>Fecha: {formattedDate}</Text>
                    </View>
                    {data && data.length > 0 && (
                        <View>
                            <View style={styles.articulosXalm}>
                                <View style={styles.totalsRow}>
                                    <Text style={[styles.totalTex2, { fontWeight: 'bold' }]}>Artículos</Text>
                                    <Text style={[styles.totalTex2, { fontWeight: 'bold' }]}>Cantidad</Text>
                                </View>
                                {data.map((item, index) => (
                                    <View key={index} style={styles.totalsRow}>
                                        <Text style={styles.totalText}>{item.articulo?.articulo_nombre}</Text>
                                        <Text style={styles.totalText}>{item.almacenArticulo_existencia} pzas</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                </View>
            </Page>
        </Document>
    );
};

export default ReporteArqueoPDF;

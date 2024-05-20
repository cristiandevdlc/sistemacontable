import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../png/Grupo 10@2x.png";

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#EAEAEA', // Cambié el color de fondo a un tono más neutro
        padding: 20,
    },
    block: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#CCC', // Cambié el color del borde para un aspecto más suave
        padding: 20,
        marginBottom: 20,
    },
    blockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    blockTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    logo: {
        width: '25%',
        justifyContent: 'center',
        marginBottom: 20,
    },
    totalTex2: {
        fontSize: 14,
        fontWeight: 'normal',
        marginBottom: 15,
        flex: 1,
        textAlign: 'left',
        color: '#000000'
    },
});

const ReporteCortesPDF = ({ data }) => {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('es-MX').format(date);
    let montoInicial = 0;
    let montoContado = 0;
    let montoCredito = 0;

    return (
        <Document title="Reporte Corte" author="INTERGAS DEL NORTE SA DE CV" creator="" language="spanish">
            <Page size="A4" style={styles.page}>
                <View style={styles.block}>
                    <View style={styles.logo}>
                        <Image src={intergasLogo} />
                    </View>
                    <View style={styles.blockHeader}>
                        <Text style={styles.blockTitle}>Corte Tiendita</Text>
                        <Text>Fecha: {formattedDate}</Text>
                    </View>
                    {data && (

                        montoInicial += parseFloat(data.montoInicial),
                        montoContado += parseFloat(data.montoContado),
                        montoCredito += parseFloat(data.montoCredito),
                        <View style={styles.block}>
                            <View style={styles.blockHeader}>
                                <Text style={[styles.totalTex2, { fontWeight: 'bold' }]}>Fecha Inicio: {data.fecha_inicio.substring(0, 11)}</Text>
                                <Text style={[styles.totalTex2, { fontWeight: 'bold' }]}>Fecha Fin: {data.fecha_fin.substring(0, 11)}</Text>
                            </View>
                            <View>
                                <Text style={styles.totalTex2}>Efectivo Inicial: ${Math.floor(data.montoInicial)}</Text>
                                <Text style={styles.totalTex2}>Venta a Contado: ${Math.floor(data.montoContado)}</Text>
                                <Text style={styles.totalTex2}>Venta a Crédito: ${Math.floor(data.montoCredito)}</Text>
                                <Text style={styles.totalTex2}>Total: ${Math.floor(data.montoFinal)}</Text>
                                <Text style={styles.totalTex2}>Total a contado: ${(montoInicial + montoContado).toFixed(2)}</Text>
                                <Text style={styles.totalTex2}>Venta del día: ${(montoInicial + montoContado + montoCredito).toFixed(2)}</Text>
                            </View>
                            <View style={styles.blockHeader}>
                                <Text style={styles.totalTex2}>Usuario: {data.usuario_apertura}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default ReporteCortesPDF;

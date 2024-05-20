import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { camionLogo, moneyFormat } from '@/utils';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { IntPdfPortData } from './IntVentasPortatil';

// Create styles
const styles = StyleSheet.create({
    page: { flexDirection: 'column', fontSize: '11px' },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        border: '1px',
        borderColor: 'black',
        gap: '20px'
    },
    div: { flexDirection: 'row' },
    divCol: { flexDirection: 'column' },
    center: { alignItems: 'center' },
    bold: {
        fontFamily: 'Helvetica-Bold',
        marginRight: '5px'
    },
    firma: {
        backgroundColor: 'black',
        height: '2px',
        width: '100%'
    }
});

// Create Document Component
export default function PDFVentaPortatil({ data = IntPdfPortData }) {
    return (
        <Document title={`Venta_port_${data.unidad}_${moment().clone(data.fecha).format('DDMMYYYY')}`}>
            <Page size="A4" style={{ ...styles.page, paddingVertical: '80px', paddingHorizontal: '20px' }}>
                <TemplateToken data={data} />
                <TemplateToken data={data} />
                <TemplateToken data={data} />
            </Page>
        </Document>
    );
}

const TemplateToken = ({ data = IntPdfEstData }) => {
    const [img, setImg] = useState(null)
    useEffect(() => {
        const empresa = localStorage.getItem('empresaData')
        empresa && setImg(JSON.parse(empresa).logo)
    }, []);

    return (<>
        <View style={styles.section}>
            {/* <View> */}
            <View style={{ ...styles.div, gap: '40px' }}>
                <Image style={{ width: '150px' }} source={`data:image/png;base64,${img}`} />
                <View style={{ ...styles.page, flexGrow: 1, justifyContent: 'center', gap: '11px' }}>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Fecha:</Text>
                        <Text>{moment().clone(data.fecha).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Folio:</Text>
                        <Text>{data.folio}</Text>
                    </View>
                </View>
                <View style={{ ...styles.page, flexGrow: 1, justifyContent: 'center', gap: '11px' }}>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Hora:</Text>
                        <Text>{moment().clone(data.fecha).format('h:mm a')}</Text>
                    </View>
                </View>
            </View>
            <View style={{ ...styles.div, justifyContent: 'space-around' }}>
                <View style={styles.div}>
                    <Text style={styles.bold}>Operador:</Text>
                    <Text>{data.operador}</Text>
                </View>
                <View style={styles.div}>
                    <Text style={styles.bold}>Unidad:</Text>
                    <Text>{data.unidad}</Text>
                </View>
            </View>
            <View style={{ ...styles.div, justifyContent: 'space-between' }}>
                <View style={{ ...styles.divCol, ...styles.center }}>
                    <Text style={styles.bold}>Tanque 10: </Text>
                    <Text>{moneyFormat(data.tanque10)}</Text>
                </View>
                <View style={{ ...styles.divCol, ...styles.center }}>
                    <Text style={styles.bold}>Tanque 20: </Text>
                    <Text>{moneyFormat(data.tanque20)}</Text>
                </View>
                <View style={{ ...styles.divCol, ...styles.center }}>
                    <Text style={styles.bold}>Tanque 30: </Text>
                    <Text>{moneyFormat(data.tanque30)}</Text>
                </View>
                <View style={{ ...styles.divCol, ...styles.center }}>
                    <Text style={styles.bold}>Tanque 45: </Text>
                    <Text>{moneyFormat(data.tanque45)}</Text>
                </View>
                <View style={{ ...styles.divCol, ...styles.center }}>
                    <Text style={styles.bold}>Recargas: </Text>
                    <Text>{moneyFormat(data.recargas)}</Text>
                </View>
                <View style={{ ...styles.divCol, ...styles.center }}>
                    <Text style={styles.bold}>Total tanques: </Text>
                    <Text>{moneyFormat(data.kg)}</Text>
                </View>
            </View>
            <View style={{ ...styles.div, paddingLeft: '40px', right: '40px' }}>
                <View style={{ flexGrow: 1 }}>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Total KG: </Text>
                        <Text>{moneyFormat(data.totalkg)}</Text>
                    </View>
                </View>
                <View style={{ ...styles.page, gap: '4px', flexGrow: 1 }}>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Total credito: </Text>
                        <Text>$ {moneyFormat(data.totalCredito)}</Text>
                    </View>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Total a pagar: </Text>
                        <Text>$ {moneyFormat(data.total)}</Text>
                    </View>
                </View>
                <View style={{ flexGrow: 1, flexDirection: 'column', alignContent: 'center', paddingTop: '10px' }}>
                    <View style={styles.firma} />
                    <Text style={{ transform: 'translate(50%, 0)' }} >Firma</Text>
                </View>
            </View>
        </View>
    </>)
}     
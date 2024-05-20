import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { camionLogo, moneyFormat } from '@/utils';
import { useState, useEffect } from 'react';
import { IntPdfEstData } from './IntVentaEstacionario';
import moment from 'moment';

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
export default function PDFVentaEstacionario({ data = IntPdfEstData }) {
    return (
        <Document title={`Venta_est_${data.unidad}_${moment().clone(data.fecha).format('DDMMYYYY')}`}>
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
            <View style={styles.div}>
                <View style={{ ...styles.page, gap: '4px' }}>
                    <View style={styles.div}>
                        <View style={styles.divCol}>
                            <Text style={styles.bold}>LTOS. CONTADO: </Text>
                            <Text style={styles.bold}>LTOS. CREDITO: </Text>
                            <Text style={styles.bold}>TOTAL LTOS.: </Text>
                        </View>
                        <View style={{ ...styles.divCol, alignItems: 'flex-end' }}>
                            <Text>{moneyFormat(data.contado)}</Text>
                            <Text>{moneyFormat(data.credito)}</Text>
                            <Text>{moneyFormat(data.total)}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ ...styles.div, paddingLeft: '40px', right: '40px' }}>
                <View style={{ flexGrow: 1 }}></View>
                <View style={{ ...styles.page, gap: '4px', flexGrow: 1 }}>
                    <View style={styles.div}>
                        <View style={styles.divCol}>
                            <Text style={styles.bold}>Total a credito: </Text>
                            <Text style={styles.bold}>Total a pagar: </Text>
                        </View>
                        <View style={{ ...styles.divCol, alignItems: 'flex-end' }}>
                            <Text>$ {moneyFormat(data.totalcredito)}</Text>
                            <Text>$ {moneyFormat(data.totalpago)}</Text>
                        </View>
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
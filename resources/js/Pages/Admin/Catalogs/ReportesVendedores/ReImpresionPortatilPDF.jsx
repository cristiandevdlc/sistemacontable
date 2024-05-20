import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { camionLogo, moneyFormat } from '@/utils';
import { useState, useEffect } from 'react';
import moment from 'moment';
// import { IntPdfPortData } from './IntVentasPortatil';

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
export default function PDFVentaPortatil({ data, state }) {
    // console.log('Data Portatil', data)


    return (
        <Document title={`Venta_port_${data.unidad}_${moment().clone(data.fecha).format('DDMMYYYY')}`}>
            <Page size="A4" style={{ ...styles.page, paddingVertical: '80px', paddingHorizontal: '20px' }}>
                <TemplateToken data={data} state={state} />
                <TemplateToken data={data} state={state} />
                <TemplateToken data={data} state={state} />
            </Page>
        </Document>
    );
}


const TemplateToken = ({ data = IntPdfEstData, state }) => {
    // console.log('state', state)
    // console.log('data', data)

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
                        <Text>{data.nControl}</Text>
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
                    <Text>{data.Operador}</Text>
                </View>
                <View style={styles.div}>
                    <Text style={styles.bold}>Unidad:</Text>
                    <Text>{data.numeroComercial}</Text>
                </View>
            </View>

            <View style={{ ...styles.div, justifyContent: 'space-between' }}>
                {['Portatil 10KG', 'Portatil 20KG', 'Portatil 30KG', 'Portatil 45KG', 'Recarga'].map(tipoTanque => {
                    const item = state.find(item => item.nombreP === tipoTanque);
                    let quantity = item ? parseFloat(item.CANTIDAD) : 0;
                    let tanqueType = '';
                    let tanqueValue = 0;

                    switch (tipoTanque) {
                        case 'Portatil 10KG':
                            tanqueType = 'Tanque 10KG';
                            tanqueValue = quantity;
                            break;
                        case 'Portatil 20KG':
                            tanqueType = 'Tanque 20KG';
                            tanqueValue = quantity;
                            break;
                        case 'Portatil 30KG':
                            tanqueType = 'Tanque 30KG';
                            tanqueValue = quantity;
                            break;
                        case 'Portatil 45KG':
                            tanqueType = 'Tanque 45KG';
                            tanqueValue = quantity;
                            break;
                        case 'Recarga':
                            tanqueType = 'Recarga';
                            tanqueValue = quantity;
                            break;
                    }

                    return (
                        <View key={tipoTanque} style={{ ...styles.divCol, ...styles.center }}>
                            <Text style={styles.bold}>{tanqueType}: </Text>
                            <Text>{moneyFormat(quantity)}</Text>
                        </View>
                    );
                })}
                {/* Total tanques */}
                <View style={{ ...styles.divCol, ...styles.center }}>
                    <Text style={styles.bold}>Total </Text>
                    <Text>{moneyFormat(state.reduce((total, item) => total + parseFloat(item.CANTIDAD), 0))}</Text>
                </View>
            </View>



            <View style={{ ...styles.div, paddingLeft: '40px', right: '40px' }}>
                <View style={{ flexGrow: 1 }}>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Total KG: </Text>
                        <Text>{moneyFormat(data.kg_total)}</Text>
                    </View>
                </View>
                <View style={{ ...styles.page, gap: '4px', flexGrow: 1 }}>
                    <View style={styles.div}>
                        <Text style={styles.bold}>Total a pagar: </Text>
                        <Text>$ {moneyFormat(data.contado)}</Text>
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
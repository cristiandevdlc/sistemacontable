import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { moneyFormat } from '@/utils';
import intergasLogo from "../../../../../png/Grupo 10@2x.png";
import { styles } from "./pdfStyles";

const ReportePagosPDF = ({ data, state, pagosCanceladosCheck }) => {
    const todosLosMismosClientes = data.every((pago, index, arr) => {
        return pago.cliente.cliente_nombrecomercial === arr[0].cliente.cliente_nombrecomercial;
    });

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formattedFechaInicio = formatDate(new Date(state.FechaInicio));
    const formattedFechaFinal = formatDate(new Date(state.FechaFinal));





    let nombreCliente;
    if (todosLosMismosClientes) {
        nombreCliente = data[0]?.cliente?.cliente_nombrecomercial;
    } else {
        nombreCliente = "Todos los clientes";
    }
    const formattedDate = new Intl.DateTimeFormat('es-MX').format(new Date());

    const agruparPorFecha = (pagos) => {
        const gruposPorFecha = {};
        pagos.forEach((pago) => {
            const fecha = new Date(pago.pago_fecha).toLocaleDateString('es-MX');
            if (!gruposPorFecha[fecha]) {
                gruposPorFecha[fecha] = [];
            }
            gruposPorFecha[fecha].push(pago);
        });
        return gruposPorFecha;
    };

    const calcularTotalImporte = (pagos) => {
        return pagos.reduce((total, pago) => total + parseFloat(pago.pago_detalle.pagoDetalle_importepagado), 0);
    };

    const saldoAnticipo = (pagos) => {
        return pagos.reduce((total, pago) => total + parseFloat(pago.pago_idAnticipo), 0);
    };

    const gruposPorFecha = agruparPorFecha(data);

    const importeTotalGeneral = Object.keys(gruposPorFecha).reduce((total, fecha) => {
        return total + calcularTotalImporte(gruposPorFecha[fecha]);
    }, 0);

    const AnticipoTotalGeneral = Object.keys(gruposPorFecha).reduce((total, fecha) => {
        return total + saldoAnticipo(gruposPorFecha[fecha]);
    }, 0);


    return (
        <Document title="Reporte de Pagos" author="Tu Empresa" language="spanish">
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Image style={styles.logoImage} src={intergasLogo} />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{pagosCanceladosCheck ? 'Pagos Cancelados' : 'Pagos Aplicados'}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateLabel}>Fecha del: </Text>
                            <Text style={styles.date}>{formattedFechaInicio}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateLabel}> al:</Text>
                            <Text style={styles.date}>{formattedFechaFinal}</Text>
                        </View>
                        
                    </View>
                    <Text style={styles.clienteTitulo}>{nombreCliente}</Text>


                    <View style={styles.lineaSeparacion} />
                    <br />
                    {Object.keys(gruposPorFecha).map((fecha, index) => (
                        <View key={index}>
                            <View style={styles.table}>
                                {index === 0 && (
                                    <View style={styles.tableRow}>
                                        <Text style={styles.headerCell}>Fecha del Pago</Text>
                                        <Text style={styles.headerCell}>Folio</Text>
                                        {todosLosMismosClientes && <Text style={styles.headerCell}>Detalle</Text>}
                                        {!todosLosMismosClientes && <Text style={styles.HeaderCliente}>Cliente</Text>}
                                        <Text style={styles.HeaderFormaPago}>Forma de Pago</Text>
                                        <Text style={styles.headerCell}>Anticipo</Text>
                                        <Text style={styles.headerCell}>Total</Text>
                                    </View>
                                )}
                                <Text style={styles.fecha}>{fecha}</Text>
                                {gruposPorFecha[fecha].map((pago, pagoIndex) => (
                                    <View key={pagoIndex} style={styles.tableRow}>
                                        <Text style={styles.cell}> </Text>
                                        <Text style={styles.cell}>P-{pago.pago_idPago}</Text>
                                        {todosLosMismosClientes && <Text style={styles.cell}>{pago.pago_detalle.pagoDetalle_folio}</Text>}
                                        {!todosLosMismosClientes && <Text style={styles.cellCliente}>{pago.cliente.cliente_nombrecomercial}</Text>}
                                        <Text style={styles.cellFormaPago}>{pago.forma_pago.formasPago_descripcion}</Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}>${moneyFormat(pago.pago_detalle.pagoDetalle_importepagado)}</Text>
                                    </View>
                                ))}
                                <View style={styles.tableRow}>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                    {todosLosMismosClientes && <Text style={styles.cell}></Text>}
                                    {!todosLosMismosClientes && <Text style={styles.cellCliente}></Text>}
                                    <Text style={styles.Total}>TOTAL:</Text>
                                    <Text style={styles.Total}>${moneyFormat(saldoAnticipo(gruposPorFecha[fecha]))}</Text>
                                    <Text style={styles.Total}>${moneyFormat(calcularTotalImporte(gruposPorFecha[fecha]))}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    <View style={styles.lineaTotalGlobal} />
                    <View style={styles.tableRow}>
                        <Text style={styles.cell}></Text>
                        <Text style={styles.cell}></Text>
                        {todosLosMismosClientes && <Text style={styles.cell}></Text>}
                        {!todosLosMismosClientes && <Text style={styles.cellCliente}></Text>}
                        <Text style={styles.Total}>TOTAL GLOBAL:</Text>
                        <Text style={styles.Total}>${moneyFormat(AnticipoTotalGeneral)}</Text>
                        <Text style={styles.Total}>${moneyFormat(importeTotalGeneral)}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );

};

export default ReportePagosPDF;

// PDFComponent.js

import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import intergasLogo from "../../../../../png/Grupo 10@2x.png";
import { styles } from "./pdfStyles"
import { moneyFormat } from '@/utils';

const ReportePDF = ({ data, estado, columns }) => {
    const date = new Date
    const fecha = new Intl.DateTimeFormat('es-MX').format(date)
    let totalesGlobales = columns.reduce((acc, columnHeader) => {
        if (columnHeader.type === "number") {
            acc[columnHeader.accessor] = 0;
        }
        return acc;
    }, {});

    const formatoDDMMYY = (date) => {
        const fechaOriginal = date;
        const [año, mes, dia] = fechaOriginal.split('-');
        const fechaFormateada = `${dia}/${mes}/${año.slice(-2)}`;
        return fechaFormateada
    }

    const reporteResumido = () => {
        const reporte = data.map((item, index) => {
            columns.forEach((col) => {
                if (col.type === "number" && col.header !== "Días vencidos") {
                    const cantidad = parseFloat(item[col.accessor]) || 0;
                    totalesGlobales[col.accessor] += cantidad;
                }
            })

            return (
                <React.Fragment key={index}>
                    <View style={styles.tableRow}>
                        {columns.map((col, colIndex) => (
                            <View key={colIndex} style={col.type === "number" ? styles.cellNumber : styles.cell}>
                                {(col.type === "number") ? (
                                    <Text>{moneyFormat(item[col.accessor])}</Text>
                                ) : (
                                    <Text>{item[col.accessor]}</Text>
                                )
                                }
                            </View>
                        ))}
                    </View>
                    {index === data.length - 1 &&
                        <View style={styles.tableRow}>
                            {
                                columns.map((columnHeader, colIndex) => {
                                    if (columnHeader.header !== 'No. Cliente') {
                                        if (columnHeader.type === "number") {
                                            return (
                                                <View key={colIndex} style={{ ...styles.cellTotal, marginTop: '15pt', borderTopWidth: "2pt" }}>
                                                    <Text>$ {moneyFormat(totalesGlobales[columnHeader.accessor])}</Text>
                                                </View>
                                            );
                                        }
                                        if (columnHeader.header === "Cliente") {
                                            return (
                                                <View key={colIndex} style={{ ...styles.totalText, marginTop: '15pt', borderTopWidth: "2pt" }}>
                                                    <Text>TOTAL GLOBAL</Text>
                                                </View>
                                            );
                                        }
                                    }
                                    return <View key={colIndex} style={styles.cell}></View>;
                                })
                            }
                        </View>
                    }
                </React.Fragment>
            )
        })

        return reporte
    }

    const reporteCompleto = () => {
        let fromIndex = 0
        let toIndex = 0

        const reporte = data.map((item, index) => {
            const firstClient = index === 0 || data[index - 1].cliente_idCliente !== item.cliente_idCliente;
            const lastClient = data[index + 1]?.cliente_idCliente !== item.cliente_idCliente || index === data.length;
            // console.log(smn)
            let totalesCliente = {};

            if (firstClient) fromIndex = index
            if (lastClient) toIndex = index

            if (lastClient) {
                totalesCliente = columns.reduce((acc, columnHeader) => {
                    if (columnHeader.type === "number" && columnHeader.header !== "Días vencidos") {
                        acc[columnHeader.accessor] = 0;
                    }
                    return acc;
                }, {});

                data.forEach((reg, i) => {
                    if (i >= fromIndex && i <= toIndex) {
                        columns.forEach((col) => {
                            if (col.type === "number" && col.header !== "Días vencidos") {
                                const cantidad = parseFloat(reg[col.accessor]) || 0;
                                totalesCliente[col.accessor] += cantidad;
                                totalesGlobales[col.accessor] += cantidad;
                            }
                        })
                    }
                })
            }

            return (
                <React.Fragment key={index}>
                    <View style={styles.tableHeadersClient}>
                        {firstClient &&
                            columns.map((columnHeader, colIndex) => {
                                if (columnHeader.header === 'No. Cliente' || columnHeader.header === 'Días' || columnHeader.header === 'Cliente') {
                                    return (
                                        <View key={colIndex} style={columnHeader.type === "number" ? { ...styles.cellNumber, textAlign: 'center' } : (columnHeader.header === 'Cliente' ? { width: '85%' } : styles.cell)}>
                                            <Text>{item[columnHeader.accessor]}</Text>
                                        </View>
                                    )
                                }
                                // return <View key={colIndex} style={styles.cell}></View>
                            })
                        }
                    </View>
                    <View style={styles.tableRow}>
                        {
                            columns.map((columnHeader, colIndex) => (
                                (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente') &&
                                <View key={colIndex} style={columnHeader.type === "number" ? styles.cellNumber : styles.cell}>
                                    {(columnHeader.type === "number" && columnHeader.accessor !== 'dias_vencidos') ? (
                                        <Text>{moneyFormat(item[columnHeader.accessor])}</Text>
                                    ) : (
                                        <Text>{item[columnHeader.accessor]}</Text>
                                    )
                                    }
                                </View>
                            ))
                        }
                    </View>
                    <View style={styles.tableRow}>
                        {lastClient &&
                            columns.map((columnHeader, colIndex) => {
                                if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente') {
                                    if (columnHeader.type === "number" && columnHeader.header !== "Días vencidos") {
                                        return (
                                            <View key={colIndex} style={styles.cellTotal}>
                                                <Text>$ {moneyFormat(totalesCliente[columnHeader.accessor])}</Text>
                                            </View>
                                        );
                                    }
                                    if (columnHeader.header === "Días vencidos") {
                                        return (
                                            <View key={colIndex} style={styles.totalText}>
                                                <Text>TOTAL</Text>
                                            </View>
                                        );
                                    }
                                    return <View key={colIndex} style={styles.cell}></View>;
                                }
                            })
                        }
                    </View>
                    {index === data.length - 1 &&
                        <View style={styles.tableRow}>
                            {
                                columns.map((columnHeader, colIndex) => {
                                    if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente') {
                                        if (columnHeader.type === "number" && columnHeader.header !== "Días vencidos") {
                                            return (
                                                <View key={colIndex} style={{ ...styles.cellTotal, marginTop: '15pt', borderTopWidth: "2pt" }}>
                                                    <Text>$ {moneyFormat(totalesGlobales[columnHeader.accessor])}</Text>
                                                </View>
                                            );
                                        }
                                        if (columnHeader.header === "Días vencidos") {
                                            return (
                                                <View key={colIndex} style={{ ...styles.totalText, marginTop: '15pt', borderTopWidth: "2pt" }}>
                                                    <Text>TOTAL GLOBAL</Text>
                                                </View>
                                            );
                                        }
                                        return <View key={colIndex} style={styles.cell}></View>;
                                    }
                                })
                            }
                        </View>
                    }
                </React.Fragment>
            )
        })

        return reporte
    }

    return (
        <Document>
            <Page size={"A4"} orientation='landscape' style={styles.page} wrap>
                <View style={styles.header} fixed>
                    <View style={styles.logo}>
                        <Image src={intergasLogo} />
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Antigüedad de cuentas por cobrar</Text>
                        <Text style={styles.titleData}>Reporte al: {estado && formatoDDMMYY(estado?.fechaSelected)}</Text>
                    </View>
                    <View style={styles.fecha}>
                        <Text>Fecha: {fecha}</Text>
                    </View>
                </View>
                {(estado && data && columns) && estado.checkResumido === "1" ? (
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeaders} fixed>
                            {columns.map((columnHeader, index) => (
                                <View key={index} style={columnHeader.type === "number" ? styles.cellNumber : styles.cell}>
                                    <Text>{columnHeader.header}</Text>
                                </View>
                            ))}
                        </View>
                        {reporteResumido()}
                    </View>
                ) : (
                    <View style={styles.tableContainer}>
                        <View style={{ flexDirection: 'col' }}>
                            <View style={styles.tableHeaders}>
                                {data.length > 0 && columns.map((columnHeader, index) => (
                                    (columnHeader.header === 'No. Cliente' || columnHeader.header === 'Días' || columnHeader.header === 'Cliente') &&
                                    <View key={index} style={columnHeader.type === "number" ? { ...styles.cellNumber, textAlign: 'center' } : (columnHeader.header === 'Cliente' ? { width: '85%' } : styles.cell)}>
                                        <Text>{columnHeader.header}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.tableHeaders}>
                                {data.length > 0 && columns.map((columnHeader, index) => (
                                    (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente') &&
                                    <View key={index} style={columnHeader.type === "number" ? styles.cellNumber : styles.cell}>
                                        <Text>{columnHeader.header}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        {reporteCompleto()}
                    </View>
                )
                }
                <View style={styles.pageCount} fixed>
                    <Text render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} />
                </View>
            </Page>
        </Document>
    );
};

export default ReportePDF;

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

    const reporteCliente = () => {
        let fromIndex = 0
        let toIndex = 0

        const reporte = data.map((item, index) => {
            const firstClient = index === 0 || data[index - 1].cliente_idCliente !== item.cliente_idCliente;
            const lastClient = data[index + 1]?.cliente_idCliente !== item.cliente_idCliente || index === data.length;
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
                                (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') &&
                                <View key={colIndex} style={columnHeader.type === "number" ? styles.cellNumber : styles.cell}>
                                    {(columnHeader.type === "number" && columnHeader.accessor !== 'dias_vencidos' && columnHeader.accessor !== 'diasCredito') ? (
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
                                if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') {
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
                                    if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') {
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

    const reporteVendedor = () => {
        let fromIndex = 0
        let toIndex = 0
        let vendedores = {}
        const renderData = []
        data.map((item) => {
            if (!vendedores[item.idcobrador]) {
                vendedores[item.idcobrador] = {};
            }
            if (!vendedores[item.idcobrador][item.cliente_idCliente]) {
                vendedores[item.idcobrador][item.cliente_idCliente] = [item];
            } else {
                vendedores[item.idcobrador][item.cliente_idCliente].push(item);
            }
        })

        Object.values(vendedores).forEach((vendedor, index) => {
            let totalesVendedor = {};

            totalesVendedor = columns.reduce((acc, columnHeader) => {
                if (columnHeader.type === "number" && columnHeader.header !== "Días vencidos") {
                    acc[columnHeader.accessor] = 0;
                }
                return acc;
            }, {});

            Object.values(vendedor).forEach((cliente, subIndex) => {
                let totalesCliente = {};

                cliente.forEach((item, thirdIndex) => {
                    const firstClient = thirdIndex === 0
                    const firstVendedor = subIndex === 0 && firstClient
                    const lastClient = Object.values(cliente)[thirdIndex + 1]?.cliente_idCliente !== item.cliente_idCliente
                    const lastVendedor = subIndex === Object.values(vendedor).length - 1 && lastClient;
                    const showGlobal = index === Object.values(vendedores).length - 1 && lastVendedor && lastClient
                    if (firstClient) fromIndex = thirdIndex
                    if (lastClient) toIndex = thirdIndex
                    if (lastClient) {
                        totalesCliente = columns.reduce((acc, columnHeader) => {
                            if (columnHeader.type === "number" && columnHeader.header !== "Días vencidos") {
                                acc[columnHeader.accessor] = 0;
                            }
                            return acc;
                        }, {});
                        cliente.forEach((reg, i) => {
                            if (i >= fromIndex && i <= toIndex) {
                                columns.forEach((col) => {
                                    if (col.type === "number" && col.header !== "Días vencidos") {
                                        const cantidad = parseFloat(reg[col.accessor]) || 0;
                                        totalesCliente[col.accessor] += cantidad;
                                        totalesVendedor[col.accessor] += cantidad;
                                        totalesGlobales[col.accessor] += cantidad;
                                    }
                                })
                            }
                        })
                    }

                    renderData.push(
                        <View key={item.folio}>
                            {firstVendedor &&
                                <View style={styles.tableHeadersClient}>
                                    <View style={styles.cell}>
                                        <Text>Cobrador: {item.Cobrador}</Text>
                                    </View>
                                </View>
                            }
                            {firstClient &&
                                <View style={styles.tableHeadersClient}>
                                    <>
                                        <View style={styles.cell}>
                                            <Text>{item.cliente_idCliente}</Text>
                                        </View>
                                        <View style={{ ...styles.cellNumber, textAlign: 'center' }}>
                                            <Text>{item.diasCredito}</Text>
                                        </View>
                                        <View style={{ width: '85%' }}>
                                            <Text>{item.cliente_razonsocial}</Text>
                                        </View>
                                    </>
                                </View>
                            }
                            <View style={styles.tableRow}>
                                {
                                    columns.map((columnHeader, colIndex) => (
                                        (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') &&
                                        <View key={colIndex} style={columnHeader.type === "number" ? styles.cellNumber : styles.cell}>
                                            {(columnHeader.type === "number" && columnHeader.accessor !== 'dias_vencidos' && columnHeader.accessor !== 'diasCredito') ? (
                                                <Text>{moneyFormat(item[columnHeader.accessor])}</Text>
                                            ) : (
                                                <Text>{item[columnHeader.accessor]}</Text>
                                            )
                                            }
                                        </View>
                                    ))
                                }
                            </View>
                            {/* {lastClient && <Text>Total Cliente: {item.cliente_razonsocial}</Text>} */}
                            {lastClient &&
                                <View style={styles.tableRow}>
                                    {
                                        columns.map((columnHeader, colIndex) => {
                                            if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') {
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
                            }
                            {lastVendedor &&
                                <View style={styles.tableRow}>
                                    {
                                        columns.map((columnHeader, colIndex) => {
                                            if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') {
                                                if (columnHeader.type === "number" && columnHeader.header !== "Días vencidos") {
                                                    return (
                                                        <View key={colIndex} style={styles.cellTotal}>
                                                            <Text>$ {moneyFormat(totalesVendedor[columnHeader.accessor])}</Text>
                                                        </View>
                                                    );
                                                }
                                                if (columnHeader.header === "Días vencidos") {
                                                    return (
                                                        <View key={colIndex} style={styles.totalText}>
                                                            <Text>TOTAL VENDEDOR</Text>
                                                        </View>
                                                    );
                                                }
                                                return <View key={colIndex} style={styles.cell}></View>;
                                            }
                                        })
                                    }
                                </View>
                            }
                            {showGlobal &&
                                <View style={styles.tableRow}>
                                    {
                                        columns.map((columnHeader, colIndex) => {
                                            if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') {
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
                        </View>
                    )
                });
            });
        });

        return renderData
    }

    return (
        <Document>
            <Page size={"A4"} orientation='landscape' style={styles.page} wrap>
                <View style={styles.header} fixed>
                    <View style={styles.logo}>
                        <Image src={intergasLogo} />
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Cargos de los clientes</Text>
                        <Text style={styles.titleData}>Reporte al: {estado && formatoDDMMYY(estado?.fechaSelected)}</Text>
                    </View>
                    <View style={styles.fecha}>
                        <Text>Fecha: {fecha}</Text>
                    </View>
                </View>
                {(data && columns && estado) && estado.checkCliente === '1' ? (
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
                                    (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') &&
                                    <View key={index} style={columnHeader.type === "number" ? styles.cellNumber : styles.cell}>
                                        <Text>{columnHeader.header}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        {reporteCliente()}
                    </View>
                ) : (
                    <View style={styles.tableContainer}>
                        <View style={{ flexDirection: 'col' }}>
                            <View style={styles.tableHeaders}>
                                <View style={styles.cell}>
                                    <Text>Cobrador</Text>
                                </View>
                            </View>
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
                                    (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente' && columnHeader.header !== 'Cobrador') &&
                                    <View key={index} style={columnHeader.type === "number" ? styles.cellNumber : styles.cell}>
                                        <Text>{columnHeader.header}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        {reporteVendedor()}
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

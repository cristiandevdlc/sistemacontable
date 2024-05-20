// pdfStyles.js

import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        // backgroundColor: '#fff',
        padding: 20,
    },
    container: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#333',
        padding: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    table: {
        flexDirection: 'column',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',

    },
    cell: {
        fontSize: 10,
        // color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    Total: {
        fontSize: 10,
        // color: '#333',
        flex: 1,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    logo: {
        width: 1000,
        height: 50,
        width: '25%',
        justifyContent: 'center',
    },
    cellCliente: {
        fontSize: 10,
        flex: 3, // Aumenta el ancho del campo para el cliente
        textAlign: 'left', // Alinea el texto a la izquierda
    },
    cellFormaPago: {
        fontSize: 10,
        flex: 1, // Reduce el ancho del campo para la forma de pago
        textAlign: 'center', // Mantiene el texto centrado
    },
    
    HeaderCliente: {
        fontSize: 12,
        fontWeight: 'bold',
        flex: 3, // Aumenta el ancho del campo para el cliente
        textAlign: 'center', // Alinea el texto a la izquierda
        fontFamily: 'Helvetica-Bold',

    },
    HeaderFormaPago: {
        fontSize: 12,
        fontWeight: 'bold',
        flex: 1, // Reduce el ancho del campo para la forma de pago
        textAlign: 'center', // Mantiene el texto centrado
        fontFamily: 'Helvetica-Bold',

    },
    
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    fecha: {
        marginTop: 15,
        fontSize: 12,
        color: '#333',
        marginBottom: 5,
        fontFamily: 'Helvetica-Bold',
    },
    fechaContainer: {
        marginBottom: 10,
    },
    total: {
        fontSize: 14,
        color: '#333',
        marginLeft: 20,
    },
    lineaSeparacion: {
        borderBottomColor: 'orange',
        borderBottomWidth: 2,
        marginBottom: 10,
    },
    lineaTotalGlobal: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        marginBottom: 10,
    },
    clienteTitulo: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        fontFamily: 'Helvetica-Bold',
    },
    cliente: {
        fontSize: 12,
        color: '#333',
    },
    blockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});

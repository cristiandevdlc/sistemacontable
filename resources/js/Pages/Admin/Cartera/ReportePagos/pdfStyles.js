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
        // borderColor: '#333',
        padding: 10,
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: '100%',
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: '#000',
    },
    tableRow: {
        // flexDirection: 'row',
        // borderBottomColor: '#ccc',
        // borderBottomWidth: 1,
        alignItems: 'center',



        flexDirection: 'row',
        paddingVertical: 7,
        // borderWidth: 1,
        backgroundColor: '#2b3f75',
        color: 'white',
        width: '100%',
    },
    headerCell: {
        fontSize: 12,
        fontWeight: 'bold',
        // color: '#333',
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
        textAlign: 'center', // Alinea el texto a la izquierda
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
        color: '#000000',
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
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        marginRight: "85px",
        top: "-2%",
    },
    cliente: {
        fontSize: 12,
        // color: '#333',
    },
    blockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },


    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        // borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    logo: {
        width: 80,
        height: 40,
        marginRight: 10,
    },
    logoImage: {
        width: '140%',
        height: '100%',
        resizeMode: 'contain',
    },
    titleContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        
        // color: '#333',
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        marginLeft: "35px",
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 5,
    },
    date: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',

    },
});

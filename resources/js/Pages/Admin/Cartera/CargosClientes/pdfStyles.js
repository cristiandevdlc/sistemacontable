import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: "space-between",
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '9%',
        width: '100%',
        // backgroundColor: 'yellow'
    },
    item: {
        width: '60%',
        fontSize: '50pt',
        top: 0,
        // backgroundColor: 'gray'
    },
    logo: {
        width: '25%',
        // backgroundColor: 'gray'
    },
    fecha: {
        width: '25%',
        fontSize: 10,
        textAlign: 'right',
        // backgroundColor: 'gray',
    },
    title: {
        fontSize: 16,
        marginBottom: 0,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    titleData: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    tableContainer: {
        marginTop: "10pt",
        fontSize: 12,
        flexGrow: 1
    },
    tableHeaders: {
        flexDirection: 'row',
        justifyContent: "space-between",
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
        marginBottom: '5pt'
    },
    tableHeadersClient: {
        flexDirection: 'row',
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        fontSize: 8,
        paddingVertical: 1
    },
    cell: {
        flex: 1,
        padding: 1,
        // borderStyle: 'solid',
        // borderWidth: "1pt",
        // borderColor: '#eee',
    },
    cellNumber: {
        flex: 1,
        padding: 1,
        textAlign: "right",
    },
    cellTotal: {
        flex: 1,
        padding: 1,
        textAlign: "right",
        fontFamily: 'Helvetica-Bold',
        marginBottom: '10pt',
        marginTop: '5pt',
        paddingTop: '5pt',
        borderTopStyle: 'solid',
        borderTopWidth: "1pt",
        borderTopColor: '#000',
    },
    totalText: {
        flex: 1,
        padding: 1,
        textAlign: "right",
        fontFamily: 'Helvetica-Bold',
        marginBottom: '10pt',
        marginTop: '5pt',
        paddingTop: '5pt',
    },

    pageCount: {
        height: "3%",
        marginTop: "2%",
        bottom: 0,
        justifyContent: "flex-end",
        fontSize: 10,
        textAlign: "right"
    }
});
import { BlobProvider, Document, PDFViewer, Page, StyleSheet, Text, View, usePDF } from "@react-pdf/renderer";
import { CancelButton, dialogDefaultProps } from "./DialogComp"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import PDFVentaEstacionario from "@/Pages/Admin/Ventas/VentasEstacionario/PDFVentaEstacionario";
import { useEffect } from "react";
import { useState } from "react";
// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});
export default function PDFVisualizer({ dialogProps = dialogDefaultProps, PDFView = <></> }) {
    const [pdf, setPdf] = useState(<></>)

    useEffect(() => {
        setPdf(PDFView)
    }, [PDFView]);

    return <>
        <Dialog
            open={dialogProps.openState ?? false}
            maxWidth={'xl'}
            fullWidth={true}
            PaperProps={{
                style: {
                    height: '100%'
                }
            }}
            onClose={dialogProps.openStateHandler}
        >
            <DialogTitle className="flex justify-between" style={{ backgroundColor: 'white' }}>
                {dialogProps.customTitle && (dialogProps.model)}
            </DialogTitle>
            <div className='flex justify-center'><Divider className='w-[95%]' /></div>
            <DialogContent className="relative">

                {/* <iframe src={pdfInstance.url && pdfInstance.url} height='100%' width='100%' ></iframe> */}
                {<PDFViewer height='100%' width='100%' showToolbar={true}>
                    {pdf && pdf}
                </PDFViewer>}
            </DialogContent>
            <DialogActions style={{ backgroundColor: 'white' }}>
                <Button color="error" onClick={dialogProps.openStateHandler}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    </>
}
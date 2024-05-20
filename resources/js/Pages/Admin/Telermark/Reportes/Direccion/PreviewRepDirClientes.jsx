import Datatable from '@/components/Datatable'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

const PreviewRepDirClientes = ({ open, data, columns, onClose, exportFunc, title }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="2xl" fullWidth>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <Datatable
                    data={data}
                    columns={columns}
                    virtual={true}
                    searcher={false}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
                <Button onClick={exportFunc}>Exportar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PreviewRepDirClientes
import request from "@/utils";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";

export default function DocumentacionEntregada({ open, handleOpen, docsList, data, employeeDocs }) {
    const [assignedDocs, setAssignedDocs] = useState(employeeDocs);

    const onSubmitState = async () => {
        const dataToSend = {
            idEmpleado: data.IdPersona,
            documentos: assignedDocs
        }
        await request(route('documentacion-empleado.store'), 'POST', dataToSend);
    }

    const handleCheck = (doc) => {
        const exist = assignedDocs.some((assignedDoc) => (assignedDoc.idDocumentacion === doc.idDocumentacion))
        if (!exist) {
            const newDocs = [...assignedDocs, doc]; // Use spread operator to create a new array
            setAssignedDocs(newDocs);
        } else {
            const newDocs = assignedDocs.filter((assignedDoc) => {
                return assignedDoc.idDocumentacion != doc.idDocumentacion;
            })
            setAssignedDocs(newDocs);
        }
    }

    return (
        <div className="h-full">
            <div className="grid grid-cols-2 !max-h-[90%] overflow-auto blue-scroll">
                {
                    docsList.map((doc, index) => {
                        return (
                            <div key={index}>
                                <FormControlLabel control={<Checkbox checked={
                                    assignedDocs.some((assignedDoc) => (assignedDoc.idDocumentacion === doc.idDocumentacion)) ? true : false
                                }
                                    onClick={() => { handleCheck(doc) }}
                                />} label={doc.descripcion} />
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex justify-end">
                <Button color={"success"} onClick={() => onSubmitState()}> Actualizar documentos </Button>
            </div>
        </div>
    )
}
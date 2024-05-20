

import { IntGeneralControlState, IntSubmitState, dialogTitles, dialogTypes } from "./IntControlVehiculos";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LoadingDiv from "@/components/LoadingDiv";
import Estacionario from "./Modal/Estacionario";
import Utilitarios from "./Modal/Utilitarios";
import Portatil from "./Modal/Portatil";
import Visita from "./Modal/Visita";
import { useEffect, useState } from "react";
import { ButtonComp } from "@/components/ButtonComp";

export default function ModalControlVehiculo({ states = IntGeneralControlState, setStates = () => { } }) {
    const [loading, setLoading] = useState(false);
    const [submitState, setSubmitState] = useState(IntSubmitState)

    useEffect(() => {
        if (loading) submitState.submit().then(() => {
            setLoading(false)
        })
    }, [loading]);

    return (<>
        <Dialog open={states.openDialog} fullWidth={true} maxWidth='lg'>
            <DialogTitle className='flex justify-between' style={{ backgroundColor: 'white' }}>
                <p>Control vehiculos {dialogTitles[states.dialogType]} </p>
                <div onClick={() => states.dialogHandler(states.dialogType)}>
                    <CloseIcon className='cursor-pointer' />
                </div>
            </DialogTitle>
            <div className='flex justify-center'><Divider className='w-[95%]' /></div>
            <DialogContent className="!bg-white">
                {!states.dataLoaded && <LoadingDiv />}
                {states.dataLoaded && (
                    <>
                        {(states.dialogType == dialogTypes.estacionario) && <Estacionario states={states} setStates={setStates} setSubmitState={setSubmitState} />}
                        {(states.dialogType == dialogTypes.portatil) && <Portatil states={states} setStates={setStates} setSubmitState={setSubmitState} />}
                        {(states.dialogType == dialogTypes.utilitario) && <Utilitarios states={states} setStates={setStates} setSubmitState={setSubmitState} />}
                        {(states.dialogType == dialogTypes.visita) && <Visita states={states} setStates={setStates} setSubmitState={setSubmitState} />}
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <div className="flex min-w-[400px] gap-2">
                    <ButtonComp
                        color={'#DC2626'}
                        label='Cancelar'
                        onClick={() => states.dialogHandler(states.dialogType)}
                    />
                    <ButtonComp
                        color={'#008000'}
                        label={submitState.btnText}
                        disabled={loading}
                        onClick={() => setLoading(true)}
                    />
                </div>
            </DialogActions>
        </Dialog>
    </>)
}
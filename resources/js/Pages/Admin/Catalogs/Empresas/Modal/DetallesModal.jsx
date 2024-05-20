import { detallesDialogStyles } from '@/utils'; // No borrar, sin esto no hay estilos
import { leftArrow } from '@/utils'
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react'
import AddBankCountForm from '../Forms/AddBankCountForm';
import CorreosForm from '../Forms/Correos';
import TimbresForm from '../Forms/TimbresForm';
import EditarEmpresa from './EditarEmpresa';
import EditBankCount from '../Forms/EditBankCount';

const DetallesModal = ({
    state,
    dispatch
}) => {
    const [prevState, setPrevState] = useState()
    const actionBtnRefs = useRef([]);
    const [isActionsActive, setIsActionsActive] = useState(false);
    const [editActionActive, setEditActionActive] = useState(false);
    const optionsRef = useRef(null)

    const handleBackClick = () => {
        if (state.confirmacionDialog.confirm) {
            dispatch({ type: 'SET_SHOW_CONFIRM_DIALOG', payload: true })
            dispatch({ type: 'SET_BACK', payload: true })
        } else {
            // dispatch({ type: 'SET_ACTION', payload: '' })
            // dispatch({ type: 'SET_EMPRESA', payload: prevState })
            dispatch({ type: 'HANDLE_BACK_CLICK', payload: prevState })
        }
    };

    const handleCloseModal = () => {
        if (state.confirmacionDialog.confirm) {
            dispatch({ type: 'SET_SHOW_CONFIRM_DIALOG', payload: true })
        } else {
            dispatch({ type: 'HANDLE_CLOSE_MODAL' })
        }
    };

    const handleActionClick = (action) => {
        dispatch({ type: 'SET_LOADING_FORM', payload: true })
        setPrevState({ ...state.empresa })
        dispatch({ type: 'SET_AUX_ACTION', payload: action })
    }

    useEffect(() => {
        if (state.action !== '') {
            if (state.action === state.catalog.ACTION.CREATE) {
                dispatch({ type: 'SET_LOADING_FORM', payload: false })
                setEditActionActive(true);
            }
            if (state.action === state.catalog.ACTION.EDIT) {
                dispatch({ type: 'SET_LOADING_FORM', payload: false })
                setEditActionActive(true);
            } else {
                dispatch({ type: 'SET_LOADING_FORM', payload: false })
                setIsActionsActive(true);
            }
        }
        else {
            dispatch({ type: 'SET_LOADING_FORM', payload: false })
            setEditActionActive(false);
            setIsActionsActive(false)
        }
    }, [state.action]);

    return (
        <Dialog open={state.open} onClose={() => handleCloseModal()} maxWidth={'md'} fullWidth>
            {/* <div className='bg-white rounded-2xl'> */}
            <DialogTitle className='flex justify-between'>
                <div>
                    {editActionActive || isActionsActive ? state.action : "Detalles de la empresa"}
                </div>
                <div onClick={() => handleCloseModal()}>
                    <CloseIcon className='cursor-pointer' />
                </div>
            </DialogTitle>
            <div className='flex justify-center'>
                <Divider className='w-[95%]' />
            </div>
            <DialogContent className=''>
                <div className={`wrapper`}>
                    <div className={`monitor-dialog-options sm:overflow-y-auto md:overflow-y-hidden blue-scroll buttons-box ${!editActionActive ? 'active-box' : ''}`}>
                        <div className='sm:grid-cols-1 md:grid md:grid-cols-5 gap-4 h-[70vh] min-h-[280px] max-w-full'>
                            <div className='monitor-dialog-details sm:col-span-5 md:col-span-2 sm:mb-4 md:mb-0 sm:h-[70%] md:h-full'>
                                <div className='grid sm:grid-cols-2 md:grid-cols-1 w-full h-full gap-2 p-3'>
                                    <div className='flex flex-col'>
                                        <span>Razón Social</span>
                                        <span className='text-[14px] text-[#D1D1D1]'>{state.empresa.empresa_razonSocial ?? '-'}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Razón Comercial</span>
                                        <span className='text-[14px] text-[#D1D1D1]'>{state.empresa.empresa_razonComercial ?? '-'}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Teléfono</span>
                                        <span className='text-[14px] text-[#D1D1D1]'>{state.empresa.empresa_telefonos ?? '-'}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>RFC</span>
                                        <span className='text-[14px] text-[#D1D1D1]'>{state.empresa.empresa_rfc ?? '-'}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Localidad</span>
                                        <span className='text-[14px] text-[#D1D1D1]'>{state.empresa.empresa_localidad ?? '-'}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Estado</span>
                                        <span className='text-[14px] text-[#D1D1D1]'>{state.empresa.estado?.descripcionEstado ?? '-'}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span>Correo</span>
                                        <span className='text-[10px] text-[#D1D1D1]'>{state.empresa.empresa_correoNotificacion ?? '-'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='wrapper md:col-span-3 sm:pb-5 md:pb-0'>
                                <div className={`monitor-dialog-options buttons-box ${!isActionsActive ? 'active-box' : ''}`}>
                                    <button className='order-button col-span-2 h-[25%]' onClick={() => handleActionClick(state.catalog.ACTION.EDIT)} ref={optionsRef}>
                                        <div className='img-box'>
                                            {/* <img className='non-selectable' style={{ width: '45%' }} src={CancelarServImg} alt={empresa.detalles.enviado.toString() === '0' ? 'No enviado' : 'Enviado'} /> */}
                                            <div className="img h-full w-[40%]">
                                                <div className={`material-icons w-full h-full`} style={{
                                                    fontSize: 135
                                                }} >drive_file_rename_outline</div>
                                            </div>
                                            <div className='blur-thing'></div>
                                        </div>
                                        <span>
                                            Editar datos
                                        </span>
                                    </button>
                                    <button className='order-button col-span-2 h-[25%]' onClick={() => handleActionClick(state.catalog.ACTION.TIMBRES)} ref={optionsRef}>
                                        <div className='img-box'>
                                            {/* <img className='non-selectable' style={{ width: '45%' }} src={CancelarServImg} alt={empresa.detalles.enviado.toString() === '0' ? 'No enviado' : 'Enviado'} /> */}
                                            <div className="img h-full w-[40%]">
                                                <div className={`material-icons w-full h-full`} style={{
                                                    fontSize: 135
                                                }} >notifications</div>
                                            </div>
                                            <div className='blur-thing'></div>
                                        </div>
                                        <span>
                                            Ver timbres
                                        </span>
                                    </button>
                                    <button className='order-button col-span-2 h-[25%]' onClick={() => handleActionClick(state.catalog.ACTION.ADD_BANK_COUNT)} ref={optionsRef}>
                                        <div className='img-box'>
                                            {/* <img className='non-selectable' style={{ width: '45%' }} src={SurtirServImg} alt="" /> */}
                                            <div className="img h-full w-[40%]">
                                                <div className={`material-icons w-full h-full`} style={{
                                                    fontSize: 135
                                                }} >add_card</div>
                                            </div>
                                            <div className='blur-thing'></div>
                                        </div>
                                        <span>
                                            Crear cuentas de banco
                                        </span>
                                    </button>
                                    <button className='order-button col-span-2 h-[25%]' onClick={() => handleActionClick(state.catalog.ACTION.EDIT_BANK_COUNT)} ref={optionsRef}>
                                        <div className='img-box'>
                                            {/* <img className='non-selectable' style={{ width: '45%' }} src={SurtirServImg} alt="" /> */}
                                            <div className="img h-full w-[40%]">
                                                <div className={`material-icons w-full h-full`} style={{
                                                    fontSize: 135
                                                }} >credit_card_off</div>
                                            </div>
                                            <div className='blur-thing'></div>
                                        </div>
                                        <span>
                                            Editar cuentas de banco
                                        </span>
                                    </button>
                                    <button className='order-button col-span-2 h-[25%]' onClick={() => handleActionClick(state.catalog.ACTION.CORREOS)} ref={optionsRef}>
                                        <div className='img-box'>
                                            {/* <img className='non-selectable' style={{ width: '45%' }} src={SurtirServImg} alt="" /> */}
                                            <div className="img h-full w-[100%]">
                                                <div className={`material-icons w-full h-full`} style={{
                                                    fontSize: 135
                                                }} >email_icon</div>
                                            </div>
                                            <div className='blur-thing'></div>
                                        </div>
                                        <span>
                                            Configuración de correos
                                        </span>
                                    </button>
                                </div>
                                {state.loading.form &&
                                    <div className='absolute w-full h-full bg-[#c0c0c03a]'></div>
                                }
                                {
                                    <div className={`monitor-dialog-options action ${isActionsActive ? 'active-box' : ''}`}>
                                        <div className='flex flex-col w-full h-full gap-3'>
                                            <div>
                                                <button ref={actionBtnRefs} onClick={handleBackClick}>
                                                    <img
                                                        className="non-selectable"
                                                        src={leftArrow}
                                                        alt=""
                                                    />
                                                </button>
                                            </div>
                                            <div className=' h-full'>
                                                {
                                                    state.action === state.catalog.ACTION.TIMBRES ? (
                                                        <TimbresForm
                                                            state={state}
                                                            dispatch={dispatch}
                                                        />
                                                    ) : (state.action === state.catalog.ACTION.ADD_BANK_COUNT ? (
                                                        <AddBankCountForm
                                                            state={state}
                                                            dispatch={dispatch}
                                                        />
                                                    ) : (state.action === state.catalog.ACTION.EDIT_BANK_COUNT ? (
                                                        <EditBankCount
                                                            state={state}
                                                            dispatch={dispatch}
                                                        />


                                                    ) : (state.action === state.catalog.ACTION.CORREOS ? (
                                                        <CorreosForm
                                                            state={state}
                                                            dispatch={dispatch}
                                                        />
                                                    ) : (
                                                        <>
                                                        </>
                                                    )
                                                    )))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {(state.action === state.catalog.ACTION.EDIT || state.action === state.catalog.ACTION.CREATE) &&
                        <div className={`monitor-dialog-options action ${editActionActive ? 'active-box' : ''}`}>
                            <EditarEmpresa
                                state={state}
                                dispatch={dispatch}
                                actionBtnRefs={actionBtnRefs}
                                handleBackClick={handleBackClick}
                            />
                        </div>
                    }
                    <Dialog open={state.confirmacionDialog.show} maxWidth={'sm'} fullWidth>
                        <DialogTitle>
                            Atención
                        </DialogTitle>
                        <div className='flex justify-center'>
                            <Divider className='w-[95%]' />
                        </div>
                        <DialogContent>
                            Tienes cambios sin guardar, ¿Seguro(a) que deseas salir?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => dispatch({ type: 'SET_SHOW_CONFIRM_DIALOG', payload: false })}>Cancelar</Button>
                            <Button onClick={() =>
                                state.confirmacionDialog.back ? dispatch({ type: 'HANDLE_BACK_CLICK', payload: prevState }) : dispatch({ type: 'HANDLE_CLOSE_MODAL', payload: true })
                            }>Aceptar</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DetallesModal
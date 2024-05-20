import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select } from '@mui/material'
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import SelectComp from "@/components/SelectComp";

const CorreoNotificaciones = ({ open, empresas, action, asunto, data, errors, setData, handleCloseModal, submit }) => {
    return (
        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>
                {action === 'create' ? 'Crear Correo' : 'Editar Correo'}
            </DialogTitle>
            <DialogContent>
                <form>
                    <div className="mt-3">
                        <InputLabel
                            htmlFor="correoNotificaciones_correo"
                             />
                        <TextInput
                        label="Correo"
                            className="block w-full mt-1 texts"
                            type="text"
                            name="correoNotificaciones_correo"
                            value={data.correoNotificaciones_correo}
                            isFocused={true}

                            onChange={(e) => {
                                setData({ ...data, correoNotificaciones_correo: e.target.value })
                            }}
                        />
                        {errors.correoNotificaciones_correo &&
                            <span className="text-red-600">{errors.correoNotificaciones_correo}</span>
                        }
                    </div>
                    <div className="mt-3">
                        <SelectComp
                            label="Asunto"
                            options={asunto}
                            value={data.correoNotificaciones_idAsunto}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    correoNotificaciones_idAsunto: newValue,
                                })
                            }
                            data="asunto_descripcion"
                            valueKey="asunto_idAsunto"
                        />
                        {errors.correoNotificaciones_idAsunto &&
                            <span className="text-red-600">{errors.correoNotificaciones_idAsunto}</span>
                        }
                    </div>
                    <div className="mt-3">
                        <SelectComp
                            label="Empresa"
                            options={empresas}
                            value={data.correoNotificaciones_idEmpresa}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    correoNotificaciones_idEmpresa: newValue,
                                })
                            }
                            data="empresa_razonComercial"
                            valueKey="empresa_idEmpresa"
                        />
                        {errors.correoNotificaciones_idEmpresa &&
                            <span className="text-red-600">{errors.correoNotificaciones_idEmpresa}</span>
                        }
                    </div>
                </form>
            </DialogContent>
            <DialogActions className={'mt-4'}>
                <Button color="error" onClick={handleCloseModal}>Cancelar</Button>
                <Button color={(action == 'create') ? 'success' : 'warning'} onClick={submit}>{(action == 'create') ? 'Crear' : 'Actualizar'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CorreoNotificaciones;

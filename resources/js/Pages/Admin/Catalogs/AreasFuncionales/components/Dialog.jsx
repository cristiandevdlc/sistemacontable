import React from "react";
import { Dialog, DialogActions, DialogContent, Button, DialogTitle } from "@mui/material";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import SelectComp from "@/components/SelectComp";




const AreaFuncionalDialog = ({ open, action, data, errors, setData, empresas, handleCloseModal, submit }) => {
    return (
        <Dialog
            open={open}
            onClose={handleCloseModal}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {action === "create" ? "Crear área funcional" : "Editar área funcional"}
            </DialogTitle>
            <DialogContent>
                <form id="register-form">
                    <div className="mt-3">
                        <InputLabel htmlFor="AF_Clave" />
                        <TextInput
                            label="Clave"
                            id="AF_Clave"
                            type="text"
                            name="AF_Clave"
                            maxLength="20"
                            value={data.AF_Clave}
                            className="block w-full mt-1 texts"
                            autoComplete="AF_Clave"
                            isFocused={true}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    AF_Clave: e.target.value,
                                })
                            }
                        />
                        {errors.AF_Clave &&
                            <span className="text-red-600">{errors.AF_Clave}</span>
                        }
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="AF_Nombre" />
                        <TextInput
                            label="Nombre de área"
                            id="AF_Nombre"
                            type="text"
                            name="AF_Nombre"
                            value={data.AF_Nombre}
                            className="block w-full mt-1 texts"
                            autoComplete="AF_Nombre"
                            isFocused={true}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    AF_Nombre: e.target.value,
                                })
                            }
                        />
                        {errors.AF_Nombre &&
                            <span className="text-red-600">{errors.AF_Nombre}</span>
                        }
                    </div>
                    <div className="mt-3">
                        <SelectComp
                            label="Empresas"
                          options={empresas}
                            value={data.AF_idCC}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    AF_idCC: newValue,
                                })
                            } 
                            data="empresa_razonComercial"
                            valueKey="empresa_idEmpresa"
                        />

                        {errors.AF_idCC &&
                            <span className="text-red-600">{errors.AF_idCC}</span>
                        }
                    </div>
                </form>
                <DialogActions className="mt-4">
                    <Button color="error" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button color={action === "create" ? "success" : "warning"} onClick={submit}>
                        {action === "create" ? "Crear" : "Actualizar"}
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
    
};

export default AreaFuncionalDialog;

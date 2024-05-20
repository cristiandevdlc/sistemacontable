import React from "react";
import { Dialog, DialogActions, DialogContent, Button, DialogTitle } from "@mui/material";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import SelectComp from "@/components/SelectComp";

function formatDateInput(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + date.getUTCDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}.000`;
    return formattedDate
}

const QuienConQuienDialog = ({Unidad,Ruta,Red,Vendedor,open, action, data, errors, setData, handleCloseModal, submit }) => {
    return (
        <Dialog
            open={open}
            onClose={handleCloseModal}
            maxWidth="sm"
            fullWidth>
            <DialogTitle>
                {action === "create" ? "Crear Quien con Quien" : "Editar Quien con Quien"}
            </DialogTitle>
            <DialogContent>
                <form id="register-form" className='grid grid-cols-2 gap-3'>
                    <div>
                        <SelectComp
                            label="Vendedor"
                            options={Vendedor}
                            value={data.quienConQuien_idVendedor}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    quienConQuien_idVendedor: newValue,
                                })
                            }
                            data="Nombres"
                            valueKey="IdPersona"
                        />
                        {errors.quienConQuien_idVendedor && (
                            <div className="text-red-600">{errors.quienConQuien_idVendedor}</div>
                        )}
                    </div>
                    <div>
                        <SelectComp
                            label="Red"
                            options={Red}
                            value={data.quienConQuien_idRed}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    quienConQuien_idRed: newValue,
                                })
                            }
                            data="red_numero"
                            valueKey="red_idRed"
                        />
                        {errors.quienConQuien_idRed && (
                            <div className="text-red-600">{errors.quienConQuien_idRed}</div>
                        )}
                    </div>
                    <div>
                        <SelectComp
                            label="Ayudante"
                            options={Vendedor}
                            value={data.quienConQuien_idAyudante}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    quienConQuien_idAyudante: newValue,
                                })
                            }
                            data="Nombres"
                            valueKey="IdPersona"
                        />
                        {errors.quienConQuien_idAyudante && (
                            <div className="text-red-600">{errors.quienConQuien_idAyudante}</div>
                        )}
                    </div>

                    <div>
                        <SelectComp
                            label="Supervisor"
                            options={Vendedor}
                            value={data.quienConQuien_idSupervisor}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    quienConQuien_idSupervisor: newValue,
                                })
                            }
                            data="Nombres"
                            valueKey="IdPersona"
                        />
                        {errors.quienConQuien_idSupervisor && (
                            <div className="text-red-600">{errors.quienConQuien_idSupervisor}</div>
                        )}
                    </div>
                    <div>
                        <SelectComp
                            label="Ruta"
                            options={Ruta}
                            value={data.quienConQuien_idRuta}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    quienConQuien_idRuta: newValue,
                                })
                            }
                            data="ruta_nombre"
                            valueKey="ruta_idruta"
                        />
                        {errors.quienConQuien_idRuta && (
                            <div className="text-red-600">{errors.quienConQuien_idRuta}</div>
                        )}
                    </div>

                    <div className="mt-2">
                        <InputLabel value="Fecha guardada" />
                        <input
                            id="Hora_Comienzo"
                            type="datetime-local"
                            name="Hora_Comienzo"
                            value={data.quienConQuien_fechaGuardada}
                            className="block w-full mt-1"
                            autoComplete="Hora_Comienzo"
                            style={{ borderRadius: '50px', padding: '15px', boxShadow: '0 0 2em #e6e9f9', }}
                            pattern="\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}"
                            // placeholder={data.Hora_Comienzo}
                            onChange={(e) => setData({ ...data, quienConQuien_fechaGuardada: formatDateInput(e.target.value) })}
                        />
                        {errors.quienConQuien_fechaGuardada && (
                            <div className="text-red-600">{errors.quienConQuien_fechaGuardada}</div>
                        )}
                    </div>
                    <div>
                        <SelectComp
                            label="Ayudante 2"
                            options={Vendedor}
                            value={data.quienConQuien_idAyudante2}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    quienConQuien_idAyudante2: newValue,
                                })
                            }
                            data="Nombres"
                            valueKey="IdPersona"
                        />
                        {errors.quienConQuien_idAyudante2 && (
                            <div className="text-red-600">{errors.quienConQuien_idAyudante2}</div>
                        )}
                    </div>
                    <div >
                        <SelectComp
                            label="Unidad"
                            options={Unidad}
                            value={data.quienConQuien_idunidad}
                            onChangeFunc={(newValue) =>
                                setData({
                                    ...data,
                                    quienConQuien_idunidad: newValue,
                                })
                            }
                            data="unidad_numeroComercial"
                            valueKey="unidad_idUnidad"
                        />
                        {errors.quienConQuien_idunidad && (
                            <div className="text-red-600">{errors.quienConQuien_idunidad}</div>
                        )}
                    </div>

                </form>
                <DialogActions className={'mt-4'}>
                    <Button
                        color="error"
                        onClick={handleCloseModal}
                    >
                        Cancelar
                    </Button>
                    <Button color={(action == 'create') ? 'success' : 'warning'} onClick={submit}>
                        {(action == 'create') ? 'Crear' : 'Actualizar'}
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default QuienConQuienDialog;

import SelectComp from '@/components/SelectComp';
import TextInput from '@/components/TextInput';
import request from '@/utils';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import ReportePDF from '../ServiciosTransito/reportePDF';

const MonServTecDialog = ({
    open,
    handleCloseModal,
    action,
    submit,
    pedido,
    historial,
    soluciones,
    check,
    checkCambioTanque,
    onChangeCheck,
    onChangeSolucion,
    onChangeServicio,
    onChangeTecnico,
    onChangeCheckCambioTanque,
    onChangeCantidad
}) => {
    const [state, setState] = useState({ check: false, checkCambioTanque: false, tecnico: null, tecnicos: null, solucion: '', filteredSolutions: null })
    const historialArray = historial?.pedidos
    const fechaActual = new Intl.DateTimeFormat('es-MX').format(new Date)

    const fetchData = async () => {
        // const response = await fetch(route('vendedor-quienconquien'), {
        const response = await fetch(route('persona.vendedores'), {
            method: "GET",
            body: JSON.stringify(),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (!response.ok) {
                new Noty({
                    text: "Ocurrió un error al obtener los vendedores.",
                    type: "error",
                    theme: "metroui",
                    layout: "bottomRight",
                    timeout: 2000
                }).show();
            }
            return response.json();
        })
        setState({ ...state, tecnicos: response });
    };

    useEffect(() => {
        if (!state.tecnicos) fetchData()
        if (!state.filteredSolutions) {
            const filtered = soluciones.filter((sol) => {
                return pedido.detalles.motivoserviciotecnicoid.toString() === sol.idproblema.toString();
            });
            setState({ ...state, filteredSolutions: filtered });
        }
        // console.log('tecnicos', state.tecnicos)
        // console.log('historial', historialArray)
    }, [open, state.tecnicos])

    return (
        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>
                {pedido &&
                    action === "envio" ? "Telemark" : (action === "confServ" ? `Solucionado ${pedido.pedidoId}` : `Reposición de gas ${pedido.pedidoId}`)
                }
            </DialogTitle>
            <Divider />
            <DialogContent>
                <form id="register-form" onSubmit={e => e.preventDefault()}>
                    <div className="flex flex-col mt-2 gap-4">
                        {action !== 'envio' &&
                            <div className='grid grid-flow-col text-center gap-4'>
                                <span>
                                    {pedido.detalles.productoNombre ?? "-"}
                                </span>
                                <span>
                                    Cliente: {pedido.cliente ?? "-"}
                                </span>
                            </div>
                        }
                        {action === "confServ" &&
                            <SelectComp
                                className={"h-12"}
                                label="Solución"
                                disabled={false}
                                options={state.filteredSolutions}
                                value={state.solucion || ''}
                                data="descripcion"
                                valueKey="idsoluciones"
                                onChangeFunc={onChangeSolucion}
                            />
                        }
                        <div className='flex'>
                            {action !== "envio" &&
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                            checked={check || false}
                                            onChange={onChangeCheck}
                                        />
                                    }
                                    label={action === "rdg" ? "Vendedor" : "Solucionó otro técnico"}
                                    className='pt-[2vh]'
                                />
                            }
                            {action === "envio" &&
                                <div className='pt-[2vh]'>Técnico al que se pasa el servicio</div>
                            }
                            <SelectComp
                                className={"h-12"}
                                label={action === "rdg" ? "Vendedor" : "Técnico"}
                                disabled={action !== "envio" ? !check : false}
                                options={state.tecnicos}
                                value={state.tecnico || ''}
                                data="nombre_completo"
                                valueKey="IdPersona"
                                onChangeFunc={onChangeTecnico}
                            />
                        </div>
                        {action === "rdg" &&
                            <div className='flex'>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                            checked={checkCambioTanque || false}
                                            onChange={onChangeCheckCambioTanque}
                                        />
                                    }
                                    label="Cambio de tanque"
                                />
                                <TextInput
                                    label="Cantidad a reponer (kg)"
                                    id="kg"
                                    type="number"
                                    name="kg"
                                    // value={filters.kg}
                                    className="block w-full mt-1 texts"
                                    autoComplete="kg"
                                    isFocused={false}
                                    onChange={onChangeCantidad}
                                />
                            </div>
                        }
                        <TextInput
                            label={action === "rdg" ? "Observaciones" : ""}
                            id="servicio"
                            type="text"
                            name="servicio"
                            // value={filters.servicio}
                            className="block w-full mt-1 texts"
                            autoComplete="servicio"
                            isFocused={false}
                            onChange={onChangeServicio}
                        />
                    </div>
                </form>
                <DialogActions className={'mt-4'}>
                    <Button
                        color="error"
                        onClick={() => {
                            handleCloseModal();
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button color={'success'} onClick={submit}>
                        {action === "rdg" ?
                            (
                                <PDFDownloadLink document={<ReportePDF data={pedido} historial={historialArray} />} fileName={`Reposición_${pedido.cliente}_${fechaActual}.pdf`}>
                                    {({ blob, url, loading, error }) =>
                                        loading ? 'Generando PDF...' : 'Reporte'
                                    }
                                </PDFDownloadLink>
                            ) :
                            "Guardar"
                        }
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

export default MonServTecDialog
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, MobileStepper, Paper, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react'
import { useState } from 'react';
import '../../../../../../sass/TabsEncuesta/_tabs.scss'
import { useForm } from '@inertiajs/react';
import request from '@/utils';
import TextInput from '@/components/TextInput';

const ConfClientesDialog = ({
    open,
    handleCloseModal,
    cliente,
    questions,
    getData
}) => {
    const [state, setState] = useState({ activeStep: 0, calificacion: '' })
    const { data, setData } = useForm({ encuesta: [], comentarios: '' })
    const theme = useTheme()

    const handleChange = (event) => {
        setState({ ...state, calificacion: event.target.value });
        setData((prevData) => {
            const newData = [...prevData.encuesta];
            newData[state.activeStep] = { ...newData[state.activeStep], calificacion: event.target.value };
            return { ...prevData, encuesta: newData };
        });
        if (state.activeStep !== questions.length - 1) setTimeout(() => handleNext(), 500);
    };

    const controlProps = (item) => ({
        checked: data.encuesta[state.activeStep]?.calificacion === item ? true : false,
        onChange: handleChange,
        value: item,
        name: "id",
        // inputProps: { 'aria-label': item },
    });

    const handleNext = () => {
        setState({ ...state, activeStep: state.activeStep + 1, calificacion: 0 });
    };

    const handleBack = () => {
        setState({ ...state, activeStep: state.activeStep - 1, calificacion: 0 });
    };

    const submit = async () => {
        await request(route("encuesta-cliente.store"), "POST", data);
        handleCloseModal()
        getData()
    }

    useEffect(() => {
        const newData = questions.map((item, index) => ({ pregunta: index + 1, id_pregunta: item.id, calificacion: '', pedidoId: cliente.pedidoId, clientePedidosid: cliente.IdCliente }));
        setData({ ...data, encuesta: [...newData] });
    }, [])

    return (
        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>
                Cliente: {cliente.cliente}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <form id="register-form" onSubmit={e => e.preventDefault()}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Paper
                            square
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: 50,
                                pl: 2,
                                bgcolor: 'background.default',
                            }}
                        >
                            <Typography>{questions[state.activeStep].pregunta}</Typography>
                        </Paper>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2, textAlign: 'center', gap: 2 }}>
                            <div className='container-encuesta'>
                                <div className="tabs-encuesta">
                                    <input type="radio" {...controlProps('1')} id="radio-1" name="tabs" />
                                    <label className="tab" htmlFor="radio-1">1</label>

                                    <input type="radio" {...controlProps('2')} id="radio-2" name="tabs" />
                                    <label className="tab" htmlFor="radio-2">2</label>

                                    <input type="radio" {...controlProps('3')} id="radio-3" name="tabs" />
                                    <label className="tab" htmlFor="radio-3">3</label>

                                    <input type="radio" {...controlProps('4')} id="radio-4" name="tabs" />
                                    <label className="tab" htmlFor="radio-4">4</label>

                                    <input type="radio" {...controlProps('5')} id="radio-5" name="tabs" />
                                    <label className="tab" htmlFor="radio-5">5</label>
                                    <span className="glider"></span>
                                </div>
                            </div>
                            {data.encuesta[questions.length - 1]?.calificacion !== '' &&
                                <TextInput label={"Comentarios"} value={data.comentarios || ''} onChange={(e) => setData({ ...data, comentarios: e.target.value })} />
                            }
                        </Box>
                        <MobileStepper
                            variant="text"
                            steps={questions.length}
                            position="static"
                            activeStep={state.activeStep}
                            nextButton={
                                <Button
                                    size="small"
                                    onClick={handleNext}
                                    disabled={state.activeStep === questions.length - 1 || data.encuesta[(state.activeStep + 1)]?.calificacion === '' && data.encuesta[(state.activeStep)]?.calificacion === ''}
                                >
                                    Siguiente
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft />
                                    ) : (
                                        <KeyboardArrowRight />
                                    )}
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={state.activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                    ) : (
                                        <KeyboardArrowLeft />
                                    )}
                                    Anterior
                                </Button>
                            }
                        />
                    </Box>
                </form>
                <DialogActions className={'mt-4'}>
                    <Button
                        color="error"
                        onClick={handleCloseModal}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color={'success'}
                        onClick={submit}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

export default ConfClientesDialog
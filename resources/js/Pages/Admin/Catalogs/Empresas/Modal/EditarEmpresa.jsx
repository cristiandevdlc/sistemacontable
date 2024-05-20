import React from 'react'
import { Button, Step, StepLabel, Stepper } from '@mui/material'
import { useState } from 'react'
import InformacionGeneral from './InformacionGeneral'
import InformacionFiscal from './InformacionFiscal'
import { FieldDrawer } from '@/components/DialogComp'
import { leftArrow } from '@/utils'

const EditarEmpresa = ({ state, dispatch, actionBtnRefs, handleBackClick }) => {
    const [activeStep, setActiveStep] = useState(0)
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = [
        { label: 'Información general', style: 'grid grid-cols-4 gap-x-4 h-[100%]', fields: InformacionGeneral(state, dispatch) },
        { label: 'Información fiscal', style: 'grid grid-cols-2 gap-x-4', fields: InformacionFiscal(state, dispatch) }
    ];

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const stepBack = () => {
        setActiveStep(prev => prev - 1)
    }

    const stepForward = () => {
        setActiveStep(prev => prev + 1)
    }

    return (
        <article className='h-full flex flex-col justify-between'>
            <div className='flex'>
                {state.action !== state.catalog.ACTION.CREATE &&
                    <button ref={actionBtnRefs} onClick={handleBackClick}>
                        <img
                            className="non-selectable"
                            src={leftArrow}
                            alt=""
                        />
                    </button>
                }
                <Stepper className='w-full' activeStep={activeStep}>
                    {steps.map((step, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={index} {...stepProps}>
                                <StepLabel {...labelProps}>{step.label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
            <section className='overflow-auto blue-scroll p-1'>
                {steps.map((step, index) => {
                    if (activeStep === index) {
                        return (
                            <form key={index} className={step.style} autoComplete="off">
                                <FieldDrawer fields={step.fields} errors={state.errors}></FieldDrawer>
                            </form>
                        )
                    }
                })}
            </section>
            <section className='flex justify-between'>
                <Button
                    disabled={activeStep === 0}
                    onClick={stepBack}
                >
                    Anterior
                </Button>
                {activeStep === steps.length - 1 ? (
                    <Button onClick={() => dispatch({ type: 'SUBMIT_EMPRESA', payload: true })}>Guardar</Button>
                ) : (
                    <Button onClick={stepForward}>Siguiente</Button>
                )
                }
            </section>
        </article>
    )
}

export default EditarEmpresa
import { FieldDrawer } from '@/components/DialogComp';
import { leftArrow } from '@/utils';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import React from 'react'
import InformacionPersonal from './InformacionPersonal';
import InformacionLaboral from './InformacionLaboral';
import Documentacion from './Documentacion';
import { useState } from 'react';

const PersonaForm = ({ action, actionBtnRefs, handleBackClick, submit, data, setData, dataSelects, setDataSelects, open, errors }) => {
    const [activeStep, setActiveStep] = useState(0)
    const steps=[
        {
            label: 'Información personal',
            style: 'grid grid-cols-12 gap-x-4',
            fields: InformacionPersonal(data, setData, dataSelects, setDataSelects)
        },
        {
            label: 'Información laboral',
            style: 'grid grid-cols-6 gap-x-4',
            fields: InformacionLaboral(data, setData, dataSelects)
        },
        {
            label: 'Documentación',
            style: 'grid grid-cols-2 gap-x-4',
            fields: Documentacion(data, setData, activeStep, open)
        }
    ]

    const stepBack = () => {
        setActiveStep(prev => prev - 1)
    }

    const stepForward = () => {
        setActiveStep(prev => prev + 1)
    }

    return (
        <article className='h-full flex flex-col justify-between' >
            <div className='flex'>
                {action !== 'create' &&
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
                        // if (isStepSkipped(index)) {
                        //     stepProps.completed = false;
                        // }
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
                                <FieldDrawer fields={step.fields} errors={errors}></FieldDrawer>
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
                    <Button onClick={() => submit()}>Guardar</Button>
                ) : (
                    <Button onClick={stepForward}>Siguiente</Button>
                )
                }
            </section>
        </article >
    )
}

export default PersonaForm
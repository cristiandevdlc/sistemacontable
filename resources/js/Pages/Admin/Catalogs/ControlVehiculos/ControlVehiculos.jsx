import ModalControlVehiculo from "./ModalControlVehiculo";
import '../../../../../sass/_detallesDialogSyle.scss';
import { useState, useEffect } from "react";
import {
    IntGeneralControlState,
    IntCatalogsList,
    dialogTypes,
    imgEstacionario,
    imgPortatil,
    imgUtilitario,
    imgVisita,
    servicesList
} from "./IntControlVehiculos";
import request from "@/utils";

const min = 'min-[1200px]'
const max = 'max-[1200px]'

export default function ControlVehiculos() {
    const [catalogs, setCatalogs] = useState(IntCatalogsList)
    const [states, setStates] = useState(IntGeneralControlState)

    const getCatalogsData = async () => {
        const [
            listaVerificacion,
            // nivelCarburacion,
            nivelGasolina,
            motivosES,
            empleados,
        ] = await Promise.all([
            request(route('lista-verificacion.index')),
            // request(route('nivel-carburacion.index')),
            request(route('nivel-gasolina.index')),
            request(route('motivo-entrada-salida.index')),
            request(route('getAllEmployees')),
        ])
        setStates({
            ...states,
            // carburaciones: nivelCarburacion,
            nivelesGasolina: nivelGasolina,
            empleados: empleados,
            dataLoaded: true
        })
        setCatalogs({
            listaVerificacion: listaVerificacion,
            motivosES: motivosES,
        })
    }

    const getUnidades = async (tipo = states.dialogType) => {
        const responseUnidades = await request(route('unidades-por-control', tipo))
        return responseUnidades;
    }

    const getVisitas = async () => {
        const responseUnidades = await request(route('getControlVisita'))
        return responseUnidades;
    }

    const handleModal = async (type = states.dialogType, openDialog = !states.openDialog) => {
        if (states.dataLoaded)
            setStates({
                ...states,
                dialogType: type,
                openDialog: openDialog,
                listaVerificacion: catalogs.listaVerificacion.filter(reg => servicesList[type].map(r => String(r)).includes(String(reg.idTipoServicio)) && reg.estatus == 1),
                motivosES: catalogs.motivosES.filter(reg => servicesList[type].map(r => String(r)).includes(String(reg.idTipoServicio))),
                unidades: type !== dialogTypes.visita ? await getUnidades(type) : await getVisitas()
            })
    }
    // const handleModal = async (type = states.dialogType) => {
    //     if (states.dataLoaded)
    //         setStates({
    //             ...states,
    //             dialogType: type,
    //             openDialog: !states.openDialog,
    //             listaVerificacion: catalogs.listaVerificacion.filter(reg => servicesList[type].map(r => String(r)).includes(String(reg.idTipoServicio))),
    //             motivosES: catalogs.motivosES.filter(reg => servicesList[type].map(r => String(r)).includes(String(reg.idTipoServicio))),
    //             unidades: await getUnidades(states.dialogType)
    //         })
    // }


    useEffect(() => {
        getCatalogsData()
    }, []);

    return (
        <div className="relative h-[100%] px-3 overflow-auto blue-scroll">
            <div className="h-[100%] flex max-[1200px]:flex-col min-[1200px]:flex-row sm:gap-3 md:gap-8 overflow-auto blue-scroll">
                {/* <div className={`grid min-[1200px]:grid-cols-2 max-[1200px]:grid-cols-1 max-[1200px]:gap-[2vh] sm:gap-[2vh] min-[1200px]:gap-[6vh] !h-full `}> */}
                {/* <div className={`flex sm:flex-col md:flex:row`}> */}
                    <div className={`flex flex-col monitor-dialog-options buttons-box active-box !justify-around`}>
                        <DialogButtons
                            click={() => handleModal(dialogTypes.estacionario)}
                            label={'Estacionario'}
                            img={imgEstacionario}
                            color={states.dataLoaded ? buttonColors.primary : buttonColors.disabled}
                            disabled={!states.dataLoaded}
                        />
                        <DialogButtons
                            click={() => handleModal(dialogTypes.portatil)}
                            label={'Portatil'}
                            img={imgPortatil}
                            color={states.dataLoaded ? buttonColors.primary : buttonColors.disabled}
                            disabled={!states.dataLoaded}
                        />
                    </div>
                    <div className={`flex flex-col monitor-dialog-options buttons-box active-box !justify-around`}>
                        <DialogButtons
                            click={() => handleModal(dialogTypes.utilitario)}
                            label={'Utilitarios'}
                            img={imgUtilitario}
                            color={states.dataLoaded ? buttonColors.primary : buttonColors.disabled}
                            disabled={!states.dataLoaded}
                        />
                        <DialogButtons
                            click={() => handleModal(dialogTypes.visita)}
                            label={'Visita'}
                            img={imgVisita}
                            color={states.dataLoaded ? buttonColors.primary : buttonColors.disabled}
                            disabled={!states.dataLoaded}
                        />
                    </div>
                {/* </div> */}
            </div>
            <ModalControlVehiculo states={{ ...states, dialogHandler: handleModal }} setStates={setStates} />
        </div>
    )
};

const buttonColors = {
    primary: 'order-button',
    disabled: 'asignar-button-grey',
    success: 'asignar-button-green',
}

const DialogButtons = ({ click, label, img, color = buttonColors.primary, disabled = false }) => {
    return <>
        <button className={`${color} sm:h-[90%] md:h-[43%]`} disabled={disabled} onClick={click}>
            <div className='img-box'>
                <div className='blur-thing !w-[60%]' />
                <div className="img h-full w-[60%] ">
                    <div style={{ backgroundImage: `url(${img})` }} className="h-full w-full bg-contain bg-no-repeat bg-center" />
                </div>
            </div>
            <span className="sm:text-[18px] md:text-[25px]">{label}</span>
        </button>
    </>
}
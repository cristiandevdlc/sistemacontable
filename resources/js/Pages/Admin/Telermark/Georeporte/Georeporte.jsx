import '../../../../../sass/FormsComponent/_checkbox.scss'
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import Recorrido from './Recorrido'; 
import GeoMapa from './GeoMapa'; 
import RecorridoImg from './img/delivery.png'
import GeoMapaImg from './img/map.png'

export default function Georeporte() {
    const [state, setState] = useState({ type: 0, model: true })
    const ChangeOption = async (e) => { setState({ ...state, model: false, type: e });};

    const changeType = (newType) => {
      setState({ ...state, model: true, type: 0 });
    };
    
    return (
        <>
            <div className="relative h-[100%] pb-6 px-2 overflow-auto blue-scroll">
                <div className="relative grid grid-cols-1 h-[100%] gap-x-10">
                    {state?.model && (
                        <div className={`flex flex-col monitor-dialog-options buttons-box active-box !justify-around`}>
                            <DialogButtons
                                click={(e) => ChangeOption(1)}
                                label={'Geo Mapa'}
                                color={ buttonColors.primary}
                                img={GeoMapaImg}
                            />
                            <DialogButtons
                                click={(e) => ChangeOption(2)}
                                label={'Buscar Recorrido'}
                                color={ buttonColors.primary}
                                img={RecorridoImg}
                            />
                        </div>
                    )}
                    {state.type === 1 && <GeoMapa changeType={changeType}/>}
                    {state.type === 2 && <Recorrido changeType={changeType} />}
                </div>
            </div>
        </>
    );
}

const buttonColors = {
    primary: 'order-button',
    disabled: 'asignar-button-grey',
    success: 'asignar-button-green',
}

const DialogButtons = ({ click,img, label, color = buttonColors.primary, disabled = false, ...props }) => {
    return <>
        <button className={`${color} sm:h-[90%] md:h-[43%]`} disabled={disabled} onClick={click}>
            <div className='img-box'>
                <div className='blur-thing !w-[60%]' />
                <div className="img h-full w-[60%] ">
                    {props.img && (<props.img />)}
                    <div style={{ backgroundImage: `url(${img})` }} className="h-full w-full bg-contain bg-no-repeat bg-center" />
                </div>
            </div>
            <span className="sm:text-[18px] md:text-[25px] non-selectable">{label}</span>
        </button>
    </>
}

import Datatable from "@/components/Datatable";
import { FieldDrawer } from "@/components/DialogComp";
import { Request } from "@/core/Request";
import { options } from "@mobiscroll/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { ButtonComp } from "@/components/ButtonComp";
import { Calculate, PictureAsPdf } from '@mui/icons-material';
import { MasterDetail, DataGrid, Column, Scrolling, Selection, Export, Lookup } from 'devextreme-react/data-grid';
import { fileDownloader } from "@/utils";

const tiposServicio = {
    Estacionario: 1,
    Portatil: 2,
}

const tiposArchivo = {
    Cargas: 1,
    Kilometraje: 2,
}


export default function ReporteVigilancia() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({ fecha: moment().subtract(1, 'day').format('YYYY-MM-DD') })

    const routes = {
        [tiposServicio.Estacionario]: {
            [tiposArchivo.Cargas]: 'ReporteCargas',
            [tiposArchivo.Kilometraje]: 'ReporteKilometraje',
        },
        [tiposServicio.Portatil]: {
            [tiposArchivo.Cargas]: 'reporte-portail-cargas',
            [tiposArchivo.Kilometraje]: 'reporte-portail-kilometraje',
        }
    }

    const titles = {
        [tiposServicio.Estacionario]: {
            [tiposArchivo.Cargas]: `lecturas_estacionario_${data.fecha}`,
            [tiposArchivo.Kilometraje]: `kilometraje_estacionario_${data.fecha}`,
        },
        [tiposServicio.Portatil]: {
            [tiposArchivo.Cargas]: `cargas_portatil_${data.fecha}`,
            [tiposArchivo.Kilometraje]: `kilometraje_portatil_${data.fecha}`,
        }
    }

    const exportFile = async (e, servicio = tiposServicio.Estacionario, archivo = tiposArchivo.Cargas) => {
        e.preventDefault()
        setLoading(true)

        await fileDownloader(route(routes[servicio][archivo]), 'POST', data, titles[servicio][archivo], () => setLoading(prev => !prev))
    }

    return (
        <>
            <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">

                <div className="flex mt-3 mb-6 border-2 w-full shadow-md px-4 pb-3 rounded-xl justify-end">
                    <FieldDrawer
                        fields={[
                            {
                                label: 'Fecha',
                                input: true,
                                type: 'date',
                                max: moment().format('YYYY-MM-DD'),
                                value: data.fecha,
                                style: 'w-[30%] min-w-[300px]',
                                onChangeFunc: (e) => { setData({ ...data, fecha: e.target.value }) }
                            },
                        ]}
                    />
                </div>
                <div className="relative grid grid-cols-2 h-[90%] gap-x-10">
                    <div className={`flex flex-col monitor-dialog-options buttons-box active-box !justify-around`}>
                        <DialogButtons
                            click={(e) => exportFile(e, tiposServicio.Estacionario, tiposArchivo.Kilometraje)}
                            label={'Kilometraje estacionario'}
                            disabled={loading}
                            color={(loading) ? buttonColors.disabled : buttonColors.primary}
                        />
                        <DialogButtons
                            click={(e) => exportFile(e, tiposServicio.Portatil, tiposArchivo.Kilometraje)}
                            label={'Kilometraje portatil'}
                            disabled={loading}
                            color={(loading) ? buttonColors.disabled : buttonColors.primary}
                        />
                    </div>
                    <div className={`flex flex-col monitor-dialog-options buttons-box active-box !justify-around`}>
                        <DialogButtons
                            click={(e) => exportFile(e, tiposServicio.Estacionario, tiposArchivo.Cargas)}
                            label={'Lecturas estacionario'}
                            disabled={loading}
                            color={(loading) ? buttonColors.disabled : buttonColors.primary}
                        />
                        <DialogButtons
                            click={(e) => exportFile(e, tiposServicio.Portatil, tiposArchivo.Cargas)}
                            label={'Cargas portatil'}
                            disabled={loading}
                            color={(loading) ? buttonColors.disabled : buttonColors.primary}
                        />
                    </div>
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

const DialogButtons = ({ click, label, color = buttonColors.primary, disabled = false, ...props }) => {
    return <>
        <button className={`${color} sm:h-[90%] md:h-[43%]`} disabled={disabled} onClick={click}>
            <div className='img-box'>
                <div className='blur-thing !w-[60%]' />
                <div className="img h-full w-[60%] ">
                    {props.img && (<props.img />)}
                    {/* <div style={{ backgroundImage: `url(${img})` }} className="h-full w-full bg-contain bg-no-repeat bg-center" /> */}
                </div>
            </div>
            <span className="sm:text-[18px] md:text-[25px] non-selectable">{label}</span>
        </button>
    </>
}
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import '../../../../../sass/FormsComponent/_checkbox.scss';
import { Calculate, Refresh } from '@mui/icons-material';
import { FieldDrawer } from '@/components/DialogComp';
import { ButtonComp } from '@/components/ButtonComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';
import { Request } from '@/core/Request';
import moment from 'moment';
import { exportExcel } from '@/core/CreateExcel';

const reportTypes = {
    tiempos: 0,
    calificaciones: 1,
    detalle: 2,
    estatus: 3,
}

const titles = ['Tiempos', 'Calificaciones', 'Detalles llamadas', 'Estados']

export default function ReportesIsabel() {
    const [state, setState] = useState({
        fechaInicial: moment().subtract(1, 'day').format('YYYY-MM-DDThh:mm'),
        fechaFinal: moment().format('YYYY-MM-DDThh:mm'),
        reporte: 0,
        tableData: [],
        loading: false,
    })

    const tableProperties = {
        [reportTypes.tiempos]: [
            { width: '44%', header: "Nombre", accessor: "Nombre" },
            { width: '15%', header: 'Dia', accessor: 'Dia', type: "date" },
            {
                width: '15%',
                header: 'Inicio',
                accessor: 'Inicio',
                cell: ({ item }) => item.Inicio && (new Date(item.Inicio)).formatMX(),
                type: "date"
            },
            {
                width: '15%',
                header: 'Fin',
                accessor: 'Fin',
                cell: ({ item }) => item.Fin && (new Date(item.Fin)).formatMX(),
                type: "date"
            },
            { width: '12%', header: 'TiempoLogueo', accessor: 'TiempoLogueo', type: "time" },
        ],
        [reportTypes.calificaciones]: [
            { width: '50%', header: "Calificacion", accessor: "Calificacion", type: "number" },
            { width: '50%', header: 'Servicio', accessor: 'Servicio' },
        ],
        [reportTypes.detalle]: [
            { width: '8%', header: "Numero", accessor: "id" },
            { header: 'Nombre', accessor: 'name' },
            { header: 'Entrante', accessor: 'datetime_init' },
            { header: 'Finalizado', accessor: 'datetime_entry_queue' },
            { width: '7%', header: 'Duracion', accessor: 'duration', type: "time" },
            { width: '7%', header: 'Duracion espera', accessor: 'duration_wait', type: "time" },
            { header: 'Telefono', accessor: 'callerid' },
            // { header: 'Transferido', accessor: 'transfer' },
            { header: 'Estatus', accessor: 'status' },
        ],
        [reportTypes.estatus]: [
            { width: '33%', header: "Activo", accessor: "Estatus" },
            { width: '33%', header: 'Cantidad', accessor: 'Cantidad', type: "number" },
            {
                width: '33%',
                header: 'Fecha',
                accessor: 'Fecha',
                cell: ({ item }) => (new Date(item.Fecha)).formatMXNoTime(),
                type: "date"
            },
        ],
    }

    const getDataFunctions = {
        [reportTypes.tiempos]: async () => await tiemposDeLogin(),
        [reportTypes.calificaciones]: async () => await calificacionesLlamadas(),
        [reportTypes.detalle]: async () => await detallesLlamadas(),
        [reportTypes.estatus]: async () => await estadosLlamadas(),
    }

    const tiemposDeLogin = async () => {
        const res = await Request._post(route('Logeo'), { inicio: state.fechaInicial, fin: state.fechaFinal })
        setState(prev => ({ ...prev, tableData: res, loading: false }))
    }
    const calificacionesLlamadas = async () => {
        const res = await Request._post(await route('QualificationCall'), { inicio: state.fechaInicial, fin: state.fechaFinal })
        setState(prev => ({ ...prev, tableData: res, loading: false }))
    }
    const detallesLlamadas = async () => {
        const res = await Request._get(route('detailCall'))
        setState(prev => ({ ...prev, tableData: res, loading: false }))
    }
    const estadosLlamadas = async () => {
        const res = await Request._post(route('estatusllamada'), { inicio: state.fechaInicial, fin: state.fechaFinal })
        setState(prev => ({ ...prev, tableData: res, loading: false }))
    }

    const handleReporte = async (reporte = state.reporte) => !state.loading && setState(prev => ({ ...prev, loading: true, reporte: reporte }))

    const handleExportExcel = () => exportExcel(
        state.tableData,
        tableProperties[state.reporte],
        `${titles[state.reporte]} ${moment().format('YYYYMMDDThhmm')}`
    )


    useEffect(() => { getDataFunctions[state.reporte]() }, [state.reporte]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="flex max-h-[90%] sm:flex-col md:flex-row font-sans gap-6">
                <div className="flex-none w-full md:w-72 relative md:order-1">
                    <div className="grid grid-cols-1 gap-2 shadow-md rounded-2xl bg-white text-black" style={{ border: '2px solid #e9e5e5', paddingTop: '10px', padding: '20px', width: '100%' }}>
                        <div> Tipo de Reporte: </div>
                        <div className='flex items-center'>
                            <RadioGroup
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={state.reporte}
                                onChange={(e) => handleReporte(e.target.value)}
                            >
                                <FormControlLabel value={reportTypes.tiempos} control={<Radio />} label="Tiempos de logeo" />
                                <FormControlLabel value={reportTypes.calificaciones} control={<Radio />} label="Calificaciones Llamadas" />
                                <FormControlLabel value={reportTypes.detalle} control={<Radio />} label="Detalle Llamadas" />
                                <FormControlLabel value={reportTypes.estatus} control={<Radio />} label="Estatus Llamadas" />
                            </RadioGroup>
                        </div>
                        <hr />
                        <div className='grid grid-cols-1 pt-[5px]'>
                            <FieldDrawer
                                fields={[
                                    {
                                        input: true,
                                        type: 'datetime-local',
                                        label: 'F. Inicial',
                                        value: state.fechaInicial,
                                        onChangeFunc: (e) => setState({ ...state, fechaInicial: e.target.value })
                                    },
                                    {
                                        input: true,
                                        type: 'datetime-local',
                                        label: 'F. Final',
                                        value: state.fechaFinal,
                                        onChangeFunc: (e) => setState({ ...state, fechaFinal: e.target.value })
                                    },
                                ]}
                            />
                            <ButtonComp
                                disabled={state.loading}
                                className={state.loading && `!bg-disabled-color`}
                                label={<div className='flex gap-1'> <Refresh /> Refrescar</div>}
                                onClick={() => getDataFunctions[state.reporte]()}
                            />
                            <ButtonComp
                                disabled={state.loading}
                                className={state.loading ? `!bg-disabled-color` : '!bg-excel-color'}
                                label={<div className='flex gap-1'> <Calculate /> Exportar</div>}
                                onClick={() => handleExportExcel()}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-auto max-h-[90%] md:order-2">
                    {state.loading && <LoadingDiv />}
                    {!state.loading && <Datatable
                        data={state.tableData}
                        virtual={true}
                        columns={tableProperties[state.reporte]}
                    />}
                </div>
            </div>
        </div>
    );

}
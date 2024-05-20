import Datatable from '@/components/Datatable'
import ListIcon from '@mui/icons-material/List';
import { Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoIcon from '../../../../../../png/icons8-info-24.png'
import React from 'react'
import { useEffect } from 'react';

const MonitorTable = ({ filteredData, setData, setState, state }) => {
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#C4CCF1',
            color: 'rgba(0, 0, 0, 0.87)',
            minWidth: 400,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
            padding: 12,
            borderRadius: 12,
            boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.30)',
        },
    }));

    useEffect(() => {
        if (filteredData) {
            setState({ ...state, loadingMonitor: false })
        }
    }, [filteredData])

    return (
        <Datatable
            data={filteredData}
            searcher={false}
            // rowClass={(eprops) => {
            // 	return eprops.item.estatusTiempos === 1
            // 		? "bg-[green] text-[#E5E5E5]" // Verde
            // 		: eprops.item.estatusTiempos === 2
            // 			? "bg-[#FBD413]" // Amarillo
            // 			: "bg-[#CE2929] text-[#E5E5E5]"; // Rojo
            // }}
            columns={[
                {
                    header: " ", cell: eprops => (
                        <div className='relative w-[25px] h-[40px]'>
                            <div className={(eprops.item.estatusTiempos === 1
                                ? "bg-[#46DC00]" // Verde
                                : eprops.item.estatusTiempos === 2
                                    ? "bg-[#FFE601]" // Amarillo
                                    : "bg-[#FF0000]") // Rojo
                                + ' absolute rounded-full h-[100%] w-[9px] top-0 left-2'}></div>
                        </div>
                    ),
                    width: '3%'
                },
                {
                    header: "Fecha", accessor: "fecha", width: '10%', cell: eprops => {
                        let fecha = eprops.item.detalles.fechaCreacion.split(' ')[0]
                        let hora = eprops.item.detalles.fechaCreacion.split(' ')[1] + ' ' + eprops.item.detalles.fechaCreacion.split(' ')[2]
                        return (
                            <div className='flex flex-col'>
                                <div>{fecha}</div>
                                <div>{hora}</div>
                            </div>
                        )
                    }
                },
                { header: "Teléfono", accessor: "telefono", width: '10%' },
                { header: "Cliente", accessor: "cliente" },
                { header: "Colonia", accessor: "colonia" },
                { header: "Dirección", accessor: "direccion" },
                { header: "Cantidad", accessor: 'detalles.Cantidad'},
                { header: "Producto", accessor: "servicio" },
                {
                    header: "Tiempo", accessor: "tiempoTranscurrido", cell: eprops => (
                        <span className={
                            eprops.item.estatusTiempos === 1
                                ? "text-[#298000]" // Verde
                                : eprops.item.estatusTiempos === 2
                                    ? "text-[#FCB602]" // Amarillo
                                    : "text-[#FF0000]" // Rojo
                        }>{eprops.item.tiempoTranscurrido}</span>)
                    , width: '5%'
                },
                { header: "Operadora", accessor: "operadora" },
                {
                    header: " ", cell: eprops => (
                        <>
                            <div className='flex gap-3 text-black'>
                                <button onClick={() => {
                                    // setData({ ...eprops.item, tipo: 'envio' })
                                    // setState({ ...state, action: 'envio' })
                                }}
                                    className='bg-[#1B2654] rounded-sm text-white p-1 w-[25px]'
                                >
                                    {/* <ListIcon /> */}
                                    <HtmlTooltip
                                        arrow
                                        placement='left'
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Detalle de la orden</Typography>
                                                <Divider />
                                                <div className='grid w-full grid-cols-2 gap-3 pt-2 overflow-x-hidden overflow-y-auto'>
                                                    <div className='flex flex-col'>
                                                        <span>Fecha creación:</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className='flex-grow'>{eprops.item.detalles.fechaCreacion ?? "-"}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>Dirección:</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className='flex-grow'>{eprops.item.direccion ?? '-'}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>Entre calles:</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className='flex-grow'>{eprops.item.detalles.calle1} y {eprops.item.detalles.calle2}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>Vendedor:</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className='flex-grow'>{eprops.item.detalles.nombresVendedor ?? '-'}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>Ruta:</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className='flex-grow'>{eprops.item.detalles.nombreRuta ?? '-'}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>Unidad:</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className='flex-grow'>{eprops.item.detalles.numComercialUnidad ?? '-'}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>Información:</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className='flex-grow'>{eprops.item.detalles.servicio}</span>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    >
                                        <img className='non-selectable w-[16px] h-[16px]' src={InfoIcon} alt="i" />
                                    </HtmlTooltip>
                                </button>
                                <span className={`flex h-[18px] w-[18px] ${eprops.item.detalles.enviado.toString() === "1" ? "bg-[#38AE00]" : "bg-[#A19C9C]"} rounded-full -translate-x-5 -translate-y-2 border-[1px]`} />
                            </div>
                        </>
                    )
                }
            ]}
        />
    )
}

export default MonitorTable
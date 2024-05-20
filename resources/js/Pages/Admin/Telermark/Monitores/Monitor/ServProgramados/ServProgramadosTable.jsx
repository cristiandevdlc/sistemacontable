import Datatable from '@/components/Datatable'
import ListIcon from '@mui/icons-material/List';
import React from 'react'
import { useEffect } from 'react'

const ServProgramadosTable = ({ filteredData, setState, state, setData }) => {
  return (
    <Datatable
      data={filteredData}
      searcher={false}
      columns={[
        {
          header: " ", cell: eprops => {
            return (
              <div className='relative w-[25px] h-[40px]'>
                <div className={(eprops.item.estatusTiempos === 1
                  ? "bg-[#46DC00]" // Verde
                  : eprops.item.estatusTiempos === 2
                    ? "bg-[#FFE601]" // Amarillo
                    : "bg-[#FF0000]") // Rojo
                  + ' absolute rounded-full h-[100%] w-[9px] top-0 left-2'}>
                </div>
              </div >
            )
          },
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
                  setData({ ...eprops.item })
                  // setState({ ...state, action: 'envio' })
                  // setState({ ...state, open: true })
                }}
                  className='bg-[#1B2654] rounded-sm text-white'
                >
                  <ListIcon />
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

export default ServProgramadosTable
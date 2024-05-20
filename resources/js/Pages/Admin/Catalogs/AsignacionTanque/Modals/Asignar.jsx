import request from '@/utils';
import { useEffect, useState } from 'react';
import Datatable from '@/components/Datatable'
import TextInput from '@/components/TextInput';
import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';

const Asignar = ({ tanks, allAssigamentData, setAllAssigamentData, usersToAuth }) => {

  const [leftTable, setLeftTable] = useState([])
  const [leftTableColumns, setLeftTableColumns] = useState([])
  const [selectedLeftTableData, setSelectedLeftTableData] = useState([])
  const [selectedTankToAssign, setSelectedTankToAssign] = useState([])
  const [allClientsSucursal, setAllClientsSucursal] = useState([])

  const fetchUnits = async () => {
    const response = await request(route('unidades.index'))
    setLeftTable(response)
  }

  const fetchStations = async () => {
    const response = await request(route('estacion.index'))
    setLeftTable(response)
  }

  const fetchClients = async () => {
    const response = await request(route('clientes.index'))
    setLeftTable(response)
  }

  const fetchClientsSucursal = async (id) => {
    const response = await request(route('cliente-sucursal.show', id))
    const sucursales = response.map(sucursal => {
      return {
        idDireccionSucursal: sucursal.idDireccionSucursal,
        direccion: `CALLE: ${sucursal.calle.toUpperCase()} #${sucursal.numeroExterior}, COLONIA: ${sucursal.colonia.Colonia_Nombre.toUpperCase()}`
      }
    })
    setAllClientsSucursal(sucursales)
  }

  useEffect(() => {
    setLeftTable([])
    if (allAssigamentData.tipo !== '') {
      if (allAssigamentData.tipo === 'Unidad') {
        setLeftTableColumns([
          { header: "Nombre", accessor: "unidad_numeroComercial" },
          { header: "Modelo", accessor: "unidad_idModeloVehiculo" },
          { header: "Año", accessor: "unidad_año" },
        ])
        fetchUnits()
      } else if (allAssigamentData.tipo === 'Estacion') {
        setLeftTableColumns([
          { header: "Nombre", accessor: "estacion_nombre" },
          { header: "Dirección", accessor: "estacion_direccion" },
        ])
        fetchStations()
      } else if (allAssigamentData.tipo === 'Cliente') {

        setLeftTableColumns([
          { header: "Nombre", accessor: "cliente_nombrecomercial" },
          { header: "RFC", accessor: "cliente_rfc" },
        ])
        fetchClients()
      }
    }
  }, [allAssigamentData.tipo])

  const selectLeftTableRow = ({ selectedRowKeys, selectedRowsData }) => {
    if (allAssigamentData.tipo === 'Cliente') {
      fetchClientsSucursal(selectedRowsData[0]?.cliente_idCliente)
    }
    if (allAssigamentData.tipo === 'Estacion') {
      setAllAssigamentData(prev => ({ ...prev, idTablaTipo: selectedRowsData[0]?.estacion_idEstacion }))
    }
    if (allAssigamentData.tipo === 'Unidad') {
      setAllAssigamentData(prev => ({ ...prev, idTablaTipo: selectedRowsData[0]?.unidad_idUnidad }))
    }
    setSelectedLeftTableData(selectedRowKeys)
  }

  const selectTankTableRow = ({ selectedRowKeys, selectedRowsData }) => {
    setAllAssigamentData(prev => ({ ...prev, idTanque: selectedRowsData[0]?.idTanque }))
    setSelectedTankToAssign(selectedRowKeys)
  }

  return (
    <>
      <div className='w-full grid grid-cols-3 gap-5 place-items-end'>
        <SelectComp
          label="Tipo"
          options={
            [
              { typeName: 'Cliente' },
              { typeName: 'Estacion' },
              { typeName: 'Unidad' },
            ]
          }
          value={allAssigamentData.tipo}
          onChangeFunc={(newValue) => {
            setSelectedLeftTableData([])
            setAllAssigamentData(prev => ({ ...prev, tipo: newValue }))
          }}
          data="typeName"
          valueKey="typeName"
        />
        {
          (allAssigamentData.tipo === 'Cliente' && selectedLeftTableData.length > 0 && allClientsSucursal.length > 0) ? (
            <div className='col-span-2 w-full transition-all opacity-100'>
              <SelectComp
                label="Dirección del cliente"
                options={allClientsSucursal}
                value={allAssigamentData.idTablaTipo || ''}
                onChangeFunc={(newValue) =>
                  setAllAssigamentData(prev => ({ ...prev, idTablaTipo: newValue }))
                }
                data="direccion"
                valueKey="idDireccionSucursal"
              />
            </div>
          ) : (allAssigamentData.tipo === 'Cliente' && selectedLeftTableData.length > 0 && allClientsSucursal.length === 0) ? (
            <p className='w-full border border-red-400 rounded-lg py-2 text-center col-span-2 border-dashed text-red-600 '>El cliente seleccinado no cuenta con sucursales</p>
          ) : null
        }
      </div>
      <div className="w-full flex justify-center items-center gap-14">
        <div className="mt-3 text-center w-1/2 ">
          <h4 className='w-full text-xl font-semibold'>Selecciona un tanque </h4>
          <Datatable
            height={300}
            data={tanks}
            selection="single"
            virtual={true}
            selectedData={selectedTankToAssign}
            selectionFunc={selectTankTableRow}
            columns={[
              { header: "No. Serie", accessor: "serie" },
              { header: "Marca", accessor: "marca" },
              { header: "Tipo", accessor: "tipo_tanque.nombre" },
              { header: "Capacidad", accessor: "capacidad" },
            ]}
          />
        </div>
        <div className="mt-3 text-center w-1/2 ">
          <h4 className='w-full text-xl font-semibold'>Selecciona asignación</h4>
          {
            (leftTable.length >= 0 || leftTableColumns.length === 0) ? (
              <Datatable
                height={300}
                data={leftTable}
                selection="single"
                virtual={true}
                selectedData={selectedLeftTableData}
                selectionFunc={selectLeftTableRow}
                columns={leftTableColumns.length > 0 ? leftTableColumns : [{ header: "Elige un tipo", accessor: "serie" }]}
              />
            ) : (<LoadingDiv />)
          }
        </div>
      </div>
    </>
  )
}

export default Asignar
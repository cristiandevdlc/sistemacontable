import { FieldDrawer } from "@/components/DialogComp"
import request from "@/utils"
import { useForm } from "@inertiajs/react"
import { DataGrid, SpeedDialAction } from "devextreme-react"
import { Column, Editing } from "devextreme-react/data-grid"
import ArrayStore from "devextreme/data/array_store"
import DataSource from "devextreme/data/data_source"
import { useState, useEffect } from "react"

const CartaPorteTransporte = () => {
  const { data, setData } = useForm({
    factura_idFactura: '',
    factura_idCliente: '',
    factura_rfc: '',
    factura_idMetodoPago: '',
    factura_idUsocfdi: '',

    factura_folio: '',
    factura_serie: '',

    //factura_folioFiscal: '',
    //factura_idEmpresa: '',
    factura_fecha: '',
    factura_importe: '', //subtotl
    factura_iva: '',
    factura_total: '',
    factura_descuento: '',//no se usa en carta porte
    //factura_cadenaOriginal: '',
    //factura_XMLSinSellar: '',
    //factura_XMLConSello: '',
    //factura_XMLTimbrado: '',
    //factura_fechaTimbrado: '',
    //factura_certificadoDigitalSAT: '',
    //factura_certificado: '',
    //factura_estatusTimbrado: '',
    factura_numeroPartidas: '',//renglones que se ingresaron a la tabla
    factura_observaciones: '',
    factura_estatusImpreso: '', //si se imprime sin guardar que se guarde automaticamente
    factura_estatusEnviado: '', //si se imprime sin guardar que se guarde automaticamente
    //factura_estatus: '',
    //factura_tipo: '',
    //factura_fechaEstatus: '',
    //factura_idUsuario: '',
    //factura_fechaCancelacion: '',
    //factura_acuseCancelacion: '',
    //factura_idUsuarioCancela: '',
    //factura_idRegimenfiscal: '',
    //factura_retencion: '',
    //factura_idFormaPago: ''
  })

  /* const { data, setData } = useForm({ idCliente: '', idFolio: '', idOperador: '', idOrigen: '', fecha: '' }) */
  const [errors, setErrors] = useState({})
  const [selectedItemKeys, setSelectedItemKeys] = useState();
  //Response Data
  const [allClientes, AllClientes] = useState([])
  const [origenes, setOrigenes] = useState([])
  const [destinos, setDestinos] = useState([])
  const [operadores, setOperadores] = useState([])
  const [foliosTipoC, setFoliosTipoC] = useState([])
  const [formasPago, setFormasPago] = useState([])
  const [selects, setSelects] = useState({
    origenes: [],
    operadores: [],
    foliosTipoC: [],
    formasPago: [],
    clientes: [],
  })
  //Selected Data
  const [selectedClientData, setSelectedClientData] = useState(null)
  const [operadorData, setOperadorData] = useState(null)
  const [origenDestinoData, setOrigenDestinoData] = useState(null)
  const [origenDestino, setOrigenDestino] = useState({ origen: '', destino: '' })
  const [folioData, setFolioData] = useState(null)
  const [dataRows, setDataRows] = useState([
    { id: 1, concepto: 123, unidadMedida: 'Tracto', descripcion: '', cantidad: '', importe: '', iva: '' },
  ])
  /*   const [tableData, setTableData] = useState([{concepto:}])
    const dataSource = new DataSource({ store: new ArrayStore({ 
      data: products, key: 'producto_idProducto' }) }); */
  const dataSource = new DataSource({
    store: new ArrayStore({

      data: dataRows,
      key: 'id',
    }),
  });


  //Helpers
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    console.log(data)
  }, [data])


  //Min Max date
  function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    return yyyy + '-' + mm + '-' + dd
  }

  useEffect(() => {
    const currentDate = new Date();
    const formattedMaxDate = formatDate(currentDate);
    setMaxDate(formattedMaxDate);
    currentDate.setDate(currentDate.getDate() - 2);
    const formattedMinDate = formatDate(currentDate)
    setMinDate(formattedMinDate)
  }, []);


  const ultimoNoFolio = async () => {
    if (data.idFolio) {
      const response = await request(route('ultimo-numero-folio', data.idFolio))
      setFolioData(response)

    }
  }

  const habilitarDestinosSegunOrigen = async () => {
    const response = await request(route('habilitar-destinos-segun-origen', origenDestino.origen))
    setDestinos(response)
  }

  const buscarClientePorId = async () => {
    const response = await request(
      route('buscar-por-numerocliente', data.factura_idCliente),
      'GET',
      {},
      { enabled: true, error: { type: 'error', message: 'Cliente no encontrado' } })

    if (response.status) {
      // setData({ ...data })
      setSelectedClientData(response.cliente)
    }
  }

  // const verificarRelacionOrigenDestino = async () => {
  //   const response = await request(route('transporte-origen-destino.show', `${origenDestino.origen},${origenDestino.destino}`))
  //   setOrigenDestinoData(response)
  // }

  const fetchData = async () => {
    const [origenes, operadores, foliosTipoC, formasPago, clientes] = await Promise.all([
      request(route('transporte-origen.index')),
      request(route('buscar-por-operadoractivo')),
      request(route('folios-tipoc')),
      request(route('formas-pago.index')),
      request(route('clientes.index'))
    ]);
    setSelects({
      origenes: origenes,
      operadores: operadores,
      foliosTipoC: foliosTipoC,
      formasPago: formasPago,
      clientes: clientes
    })
    console.log('clientes', clientes)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (origenDestino.origen !== '') {
      habilitarDestinosSegunOrigen()
    }
  }, [origenDestino.origen])


  useEffect(() => {
    if (data.factura_idCliente !== '') {
      buscarClientePorId()
    }
  }, [data.factura_idCliente])


  const buscarPorOperador = async () => {
    /* const response = await request(route('operadores-unidad.show', data.idOperador))
    console.log(response)
    setOperadorData(response) */
  }

  useEffect(() => {
    if (data.idOperador !== '') {
      buscarPorOperador()

    }
  }, [data.idOperador])

  useEffect(() => {
    if (data.idFolio !== '') {
      ultimoNoFolio()
    }
  }, [data.idFolio])


  const onRowUpdating = (e) => {
    const newState = dataRows.map(obj => {
      const value = Object.values(e.newData)
      const key = Object.keys(e.newData)
      if (obj.id === e.key) {
        return { ...obj, [key]: value[0] };
      }
      return obj;
    })
    setDataRows(newState)
  }

  const selectionChanged = () => {

  }

  const addRowTable = () => {
    const canAddNewRow = dataRows.every(row => {
      return Object.values(row).every(rowData => rowData !== '')
    })
    if (canAddNewRow) {
      const lastRowId = dataRows[dataRows.length - 1].id
      setDataRows([...dataRows, { id: Number(lastRowId + 1), concepto: 123, unidadMedida: 'Tracto', descripcion: '', cantidad: '', importe: '', iva: '' }])
    }
  }


  const topFields = [
    {
      label: "No. Cliente",
      value: data.factura_idCliente || '',
      onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, ""); setData({ ...data, factura_idCliente: input }) },
      input: true,
    },
    { blankSpace: true },
    {
      label: "RFC",
      value: selectedClientData !== null ? selectedClientData.cliente_rfc : '',
      onChangeFunc: () => { },
      input: true,
    },
    {
      label: "",
      value: '', customItem: () => (<div />),
      onChangeFunc: null, custom: true,
    },
    {
      label: "Nombre cliente",
      style: 'col-span-3',
      select: true,
      options: selects.clientes,
      value: data.factura_idCliente,
      onChangeFunc: (e) => setData({ ...data, factura_idCliente: e }),
      data: 'cliente_razonsocial',
      valueKey: 'cliente_idCliente',
    },
    {
      label: "Direccón",
      disabled: true,
      style: 'col-span-3',
      value: selectedClientData !== null ? `Calle ${selectedClientData?.cliente_calle} #${selectedClientData?.cliente_numeroExterior} Col. ${selectedClientData?.colonia[0].Colonia_Nombre}` : '',
      onChangeFunc: () => { },
      input: true,
    },
    {
      label: "Direccón 2",
      disabled: true,
      style: 'col-span-3',
      value: selectedClientData !== null ? `${selectedClientData?.colonia[0].municipio.descripcionMunicipio}, ${selectedClientData?.estado.descripcionEstado}` : '',
      onChangeFunc: () => { },
      input: true,
    },
  ]
  const topRightFields = [
    {
      label: "Codigo postal",
      disabled: true,
      input: true,
      value: selectedClientData !== null ? selectedClientData.cliente_codigoPostal : '',
      onChangeFunc: () => { }
    },
    {
      label: "Metodo de pago",
      disabled: true,
      input: true,
      value: selectedClientData !== null ? selectedClientData.forma_pago.formasPago_descripcion : '',
      onChangeFunc: () => { },
      data: 'nombre',
      valueKey: 'idTipoTanque',
    },
    {
      label: "Uso de CFDI",
      disabled: true,
      input: true,
      value: selectedClientData !== null ? selectedClientData.uso_cfdi_sat.usoCfdiSAT_descripcion : '',
      onChangeFunc: () => { }
    },
    {
      label: "Formas de pago",
      select: true,
      options: selects.formasPago,
      value: '',
      onChangeFunc: () => { },
      data: 'formasPago_descripcion',
      valueKey: 'formasPago_idFormasPago'
    },
  ]
  const middleUpFields = [
    {
      label: "Nombre operador",
      value: data.idOperador,
      onChangeFunc: (e) => { setOperadorData(null); setData({ ...data, idOperador: e }) },
      options: selects.operadores,
      data: 'nombreCompleto',
      valueKey: 'idOperador',
      style: 'col-span-2',
      select: true,
    },
    {
      label: "Tracto Camion",
      value: operadorData !== null ? operadorData.infoTracto.unidad_numeroComercial : '',
      onChangeFunc: () => { },
      input: true,
      disabled: true,
      style: 'col-span-2',
    },
    {
      label: "Configuracion",
      value: operadorData !== null ? operadorData.configuracion.claveConfigAutotransporte : '',
      onChangeFunc: () => { },
      input: true,
      disabled: true,
      style: 'col-span-2',
    },
    {
      label: "PG1",
      value: operadorData !== null ? operadorData.infoPG1.unidad_numeroComercial : '',
      onChangeFunc: () => { },
      input: true,
      disabled: true
    },
    {
      label: "PG2",
      value: operadorData !== null ? operadorData.infoPG2?.unidad_numeroComercial : '',
      onChangeFunc: () => { },
      input: true,
      disabled: true
    },
  ]
  const middleDownFields = [
    {
      label: "Origen ",
      value: data.origen,
      onChangeFunc: (e) => { setOrigenDestinoData(null); setOrigenDestino({ destino: '', origen: e }) },
      data: 'NombreRFCOrigen',
      valueKey: 'idOrigen',
      style: 'col-span-3',
      select: true,
      options: selects.origenes,
    },
    {
      label: "Destino",
      value: data.destino,
      onChangeFunc: (e) => setOrigenDestino({ ...origenDestino, destino: e }),
      data: 'NombreRFCDestino',
      valueKey: 'idDestino',
      style: 'col-span-3',
      select: true,
      options: destinos,
    },
    {
      label: "KG1",
      value: '',
      onChangeFunc: () => { },
      input: true
    },
    {
      label: "KG2",
      value: '',
      onChangeFunc: () => { },
      input: true
    },
    {
      label: "Distancia en KM",
      value: origenDestinoData !== null ? origenDestinoData.DistanciaOrigenDestino : '',
      onChangeFunc: () => { },
      disabled: true,
      style: 'col-span-2',
      input: true
    },
    {
      label: "Tiempo en minutos",
      value: origenDestinoData !== null ? origenDestinoData.TiempoPromedio : '',
      onChangeFunc: () => { },
      disabled: true,
      style: 'col-span-2',
      input: true,
    },
  ]
  const bottomFields = [
    {
      label: "Fecha ",
      input: true, type: 'date', min: minDate, max: maxDate,
      style: 'col-span-2', value: data.fecha !== '' ? data.fecha : today,
      onChangeFunc: (e) => { console.log(e.target.value) },
    },
    {
      label: "",
      custom: true,
      value: '',
      customItem: () => (<div />),
      onChangeFunc: null,
    },
    {
      label: "",
      custom: true,
      value: '',
      customItem: () => (<div />),
      onChangeFunc: null,
    },
    {
      label: "",
      custom: true,
      value: '',
      customItem: () => (<div />),
      onChangeFunc: null,
    },
    {
      label: "Serie",
      select: true,
      options: selects.foliosTipoC,
      value: "", onChangeFunc: (e) => setData({ ...data, idFolio: e }),
      data: 'folios_serie',
      valueKey: 'folios_idFolios',
    },
    {
      label: "No. Folio", value: folioData !== null ? folioData.folios_numeroFolio : '', onChangeFunc: () => { },
      disabled: true,
      input: true,
    },
  ]
  const tableDownFields = [
    {
      label: "Observaciones",
      style: 'col-span-2 row-span-2',
      input: true,
      options: [], value: "", onChangeFunc: () => { },
      data: 'nombre',
      valueKey: 'idTipoTanque',
    },
    {
      label: "",
      custom: true,
      value: '',

      style: 'text-lg flex flex-col justify-center items-center w-full',
      customItem: () => (
        <div className="text-center font-semibold">
          <p>Subtotal: <span>0.0</span> </p>
          <p>IVA: <span>0.0</span> </p>
          <p>Retención: <span>0.0</span> </p>
          <p>Total: <span>0.0</span> </p>
        </div>
      ),
      onChangeFunc: null,
    },
    {
      label: "",
      custom: true,
      value: '',

      style: 'text-lg flex flex-col justify-center items-center w-full',
      customItem: () => (
        <div>
          <button className='bg-[#1B2654] text-white rounded-[10px]  my-1 w-full block ' /* onClick={submit} */ >Guardar</button>
          <button className='bg-[#1B2654] text-white rounded-[10px]  my-1 w-full block ' /* onClick={submit} */ >Enviar</button>
          <button className='bg-[#1B2654] text-white rounded-[10px]  my-1 w-full block ' /* onClick={submit} */ >Imprimir</button>
        </div>
      ),
      onChangeFunc: null,
    },
  ]

  return (
    <div className="p-2 rounded-md pb-20 h-screen overflow-y-auto"  >
      <div className="grid grid-cols-4 gap-x-3">
        <div className="col-span-3 grid grid-cols-3  shadow-lg gap-x-3  p-4 rounded-2xl">
          <FieldDrawer fields={topFields} errors={errors} />
        </div>
        <div className=" p-4 rounded-2xl h-fit  shadow-lg ">
          <FieldDrawer fields={topRightFields} errors={errors} />
        </div>
        <div className="col-span-4 shadow-lg rounded-2xl">
          <div className=" grid grid-cols-8 gap-1  gap-x-3  p-4 pb-0 ">
            <FieldDrawer fields={middleUpFields} errors={errors} />
          </div>
          <div className="col-span-4 grid grid-cols-8 gap-1  gap-x-3  p-4 pt-0  ">
            <FieldDrawer fields={middleDownFields} errors={errors} />
          </div>
        </div>
        <div className="col-span-4 grid grid-cols-7 gap-1 shadow-lg rounded-2xl gap-x-3  p-4 pt-0  ">
          <FieldDrawer fields={bottomFields} errors={errors} />
        </div>
        <div className="flex w-full flex-col items-end justify-end col-span-4 shadow-lg  ">
          <button className='bg-[#1B2654] my-1.5 text-white rounded-[10px] px-10 py-2 w-1/5' onClick={addRowTable}>Agregar renglon</button>
          <DataGrid
            className="relative"
            dataSource={dataSource}
            showBorders={true}
            selectedRowKeys={selectedItemKeys}
            selectionChanged={selectionChanged}
            showRowLines={true}
            showColumnLines={true}
            sorting={false}
            onRowUpdating={onRowUpdating}>
            <Editing mode="cell" allowUpdating={true} />-
            <Column alignment='center' dataField="concepto" caption='Concepto' allowEditing={false} />
            <Column alignment='center' dataField="unidadMedida" caption='Unidad Medida' allowEditing={false} />
            <Column alignment='center' dataField="descripcion" caption='Descripcion' allowEditing={true} />
            <Column alignment='center' dataField="cantidad" caption='Cantidad' allowEditing={true} />
            <Column alignment='center' dataField="importe" caption='Importe' allowEditing={true} />
            <Column alignment='center' dataField="iva" caption='IVA' allowEditing={true} />
          </DataGrid>
        </div>
        <div className="col-span-4 mt-2 grid grid-cols-4 gap-4 place-content-end">
          <FieldDrawer fields={tableDownFields} errors={errors} />
        </div>
      </div>
    </div>
  )
}

export default CartaPorteTransporte
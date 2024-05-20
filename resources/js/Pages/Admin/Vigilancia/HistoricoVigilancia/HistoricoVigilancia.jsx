import Datatable from "@/components/Datatable";
import DialogComp, { FieldDrawer } from "@/components/DialogComp";
import { Request } from "@/core/Request";
import { options } from "@mobiscroll/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { ButtonComp } from "@/components/ButtonComp";
import { Calculate, PictureAsPdf } from '@mui/icons-material';

import { MasterDetail, DataGrid, Column, Scrolling, Selection, Export, Lookup } from 'devextreme-react/data-grid';
import { Tooltip } from "@mui/material";
import { noty } from "@/utils";

const tiposServicio = [
    { id: 1, data: 'Estacionario' },
    { id: 2, data: 'Portatil' }
]

const tiposReportes = [
    { id: 1, data: 'Reporte de cargas' },
    { id: 2, data: 'Reporte de kilometraje' }
]

const tiposServicioKey = {
    Estacionario: 1,
    Portatil: 2
}

export default function HistoricoVigilancia() {
    const [states, setStates] = useState({
        nivelesGasolina: [],
        operadores: [],
        tableData: [],
        updatedData: [],
        dialogOpen: false,
        selectedControl: null,
        updatedLoads: []
    })
    const [formData, setData] = useState({
        tiposReportes: '',
        tipoServicio: 2,
        fecha: moment().format('YYYY-MM-DD')
    })

    const fetchData = async () => {
        const [nivelesGas, vendedores] = await Promise.all([
            Request._get(route('nivel-gasolina.index')),
            Request._get(route('persona.vendedores'))
        ])
        setStates(prev => ({
            ...prev,
            nivelesGasolina: nivelesGas,
            operadores: vendedores
        }))
    }

    const getReporte = async () => {
        const response = await Request._post(route('reporte-vigilancia'), { ...formData, tipoServicio: (formData.tipoServicio - 1) })
        setStates(prev => ({ ...prev, tableData: response }))
    }

    const handleMainTableUpdating = (e) => {
        const newData = { ...e.oldData, ...e.newData }
        setStates({
            ...states,
            updatedData: [
                ...states.updatedData.filter(r => newData.cexitId != r.cexitId),
                newData
            ]
        })
    }

    const handleLoadsUpdating = (e) => {
        const newData = { ...e.oldData, ...e.newData }
        setStates({
            ...states,
            updatedLoads: [
                ...states.updatedLoads.filter(r => newData.idCargaEntradaSalida != r.idCargaEntradaSalida),
                newData
            ]
        })
    }

    const updateLoadsRequest = async () => {
        const response = await Request._post(route('update-cargas-vigilanica'), {
            data: states.updatedLoads,
            type: (formData.tipoServicio - 1)
        })

        if (response.status) {
            noty(response.message, 'success')
            setStates({
                ...states,
                dialogOpen: false,
                updatedLoads: [],
                selectedControl: null
            })
        }
        else noty(response.message, 'error')
        getReporte()
    }

    const updateControlRequest = async () => {
        await Request._post(route('update-control-vigilanica'), { data: states.updatedData }, {
            success: { message: 'Datos actualizados correctamente' },
            error: { message: 'Error al actualizar los datos' }
        })
        setStates({ ...states, updatedData: [] })
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        (formData.tipoServicio && formData.fecha) && getReporte()
    }, [formData.tipoServicio, formData.fecha]);

    return (
        <>
            <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
                <div className="flex max-h-[90%] sm:flex-col md:flex-row font-sans gap-6">
                    <div className="flex-none md:w-[240px]  relative md:order-1 ">
                        <div className="grid grid-cols-1 gap-x-2 shadow-md rounded-2xl bg-white text-black shadow-md px-4 pb-3 rounded-xl" >
                            <FieldDrawer
                                fields={[
                                    {
                                        label: 'Fecha',
                                        input: true,
                                        type: 'date',
                                        max: moment().format('YYYY-MM-DD'),
                                        min: moment().subtract(2, 'day').format('YYYY-MM-DD'),
                                        value: formData.fecha,
                                        onChangeFunc: (e) => setData({ ...formData, fecha: e.target.value })
                                    },
                                    {
                                        select: true,
                                        label: 'Tipo de Servicio',
                                        value: formData.tipoServicio,
                                        options: tiposServicio,
                                        data: 'data',
                                        valueKey: 'id',
                                        onChangeFunc: (e) => setData({ ...formData, tipoServicio: e })
                                    },
                                    {
                                        custom: true,
                                        disabled: states.updatedData.length == 0,
                                        customItem: ({ disabled }) => (<ButtonComp
                                            label={<>Guardar</>}
                                            onClick={updateControlRequest}
                                            disabled={disabled}
                                        />)
                                    }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="flex-auto max-h-[100%] md:order-2">
                        <Datatable
                            data={states.tableData}
                            virtual={true}
                            handleRowUpdating={handleMainTableUpdating}
                            columns={[
                                { header: 'Unidad', accessor: 'unidad_numeroComercial', allowEditing: false },
                                { header: 'H. Salida', accessor: 'fsal', dataType: 'date', format: { type: 'longTime' }, allowEditing: false },
                                { header: 'H. Entrada', accessor: 'fent', dataType: 'date', format: { type: 'longTime' }, allowEditing: false },
                                {
                                    width: '18%',
                                    header: 'Operador',
                                    accessor: 'id_operador',
                                    lookup: {
                                        dataSource: states.operadores,
                                        displayExpr: "nombre_completo",
                                        valueExpr: "IdPersona",
                                    }
                                },
                                { header: 'KM Salida', accessor: 'kmsal', dataType: "number", format: 'fixedPoint' },
                                { header: 'KM Entrada', accessor: 'kment', dataType: "number", format: 'fixedPoint' },
                                { header: '% Salida', accessor: 'persal', dataType: "number", format: { type: 'fixedPoint', precision: 0 } },
                                { header: '% Entrada', accessor: 'perent', dataType: "number", format: { type: 'fixedPoint', precision: 0 } },
                                {
                                    header: 'Gasol. Salida', accessor: 'gassal', lookup: {
                                        dataSource: states.nivelesGasolina,
                                        displayExpr: "nivelGasolina",
                                        valueExpr: "idNivelGasolina",
                                    }
                                },
                                {
                                    header: 'Gasol. Entrada', accessor: 'gasent', lookup: {
                                        dataSource: states.nivelesGasolina,
                                        displayExpr: "nivelGasolina",
                                        valueExpr: "idNivelGasolina",
                                    }
                                },
                                {
                                    width: '80px',
                                    header: 'Acciones',
                                    custom: ({ item }) => (<>
                                        <Tooltip title='Editar cargas'>
                                            <span onClick={() => setStates({
                                                ...states,
                                                dialogOpen: !states.dialogOpen,
                                                updatedLoads: [],
                                                selectedControl: item
                                            })} className="material-icons">propane_tank</span>
                                        </Tooltip>
                                    </>)
                                }
                            ]}
                        />
                    </div>
                </div>
            </div>

            <DialogComp
                dialogProps={{
                    customTitle: true,
                    model: `Editar ${formData.tipoServicio == tiposServicioKey.Estacionario ? 'lecturas' : 'cargas'}`,
                    onSubmitState: () => updateLoadsRequest,
                    openStateHandler: () => setStates({ ...states, dialogOpen: !states.dialogOpen }),
                    openState: states.dialogOpen
                }}
                fields={[
                    {
                        _conditional: () => formData.tipoServicio == tiposServicioKey.Estacionario,
                        table: true,
                        data: [states.selectedControl],
                        handleRowUpdating: handleLoadsUpdating,
                        searcher: false,
                        columns: [
                            { header: 'Entrada', accessor: 'lecsal', dataType: 'number', format: { type: 'fixedPoint', precision: 4 } },
                            { header: 'Salida', accessor: 'lecent', dataType: 'number', format: { type: 'fixedPoint', precision: 4 } },
                        ]
                    },
                    {
                        _conditional: () => formData.tipoServicio == tiposServicioKey.Portatil,
                        table: true,
                        data: states.selectedControl?.carga_registrada_entrada,
                        searcher: false,
                        handleRowUpdating: handleLoadsUpdating,
                        columns: [
                            { header: 'Producto', accessor: 'producto_nombre', dataType: 'number', format: { type: 'fixedPoint', precision: 0 } },
                            { header: 'Salida', accessor: 'cantidadSalida', dataType: 'number', format: { type: 'fixedPoint', precision: 0 } },
                            { header: 'Entrada', accessor: 'cantidadEntrada', dataType: 'number', format: { type: 'fixedPoint', precision: 0 } },
                        ]
                    }
                ]}
            />
        </>
    );
}
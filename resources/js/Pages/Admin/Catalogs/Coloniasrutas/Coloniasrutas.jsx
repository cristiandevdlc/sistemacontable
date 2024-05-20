import Datatable from "@/components/Datatable";
import InputLabel from "@/components/InputLabel";
import LoadingDiv from "@/components/LoadingDiv";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import request, { noty } from "@/utils";
import SelectComp from "@/components/SelectComp";
import "../../../../../sass/TablesComponent/_tableEditDropStyle.scss";
import DataGrid, { Column, Editing, Paging, Selection, Lookup, Toolbar, Item } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

export default function ColoniasRutas() {
    const [state, setState] = useState({ loading: true })
    const [coloniaRutas, setColoniaRutas] = useState([]);
    const [coloniaRutasServicio, setColoniaRutasServicio] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [rutasFiltradas, setRutasFiltradas] = useState();
    const [estado, setEstado] = useState('');
    const [estados, setEstados] = useState([]);
    const [servicios, setServicios] = useState();
    const [selectedItemKeys, setSelectedItemKeys] = useState([]);
    const [filterState, setFilterState] = useState({
        dataWithoutFilter: [],
        filter: ''
    })
    const [requestData, setRequestData] = useState({
        municipio: '',
        servicio: ''
    });

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };

    const selectionChanged = (data) => {
        setSelectedItemKeys(data.selectedRowKeys);
    };

    const dataSource = new DataSource({
        store: new ArrayStore({
            data: coloniaRutas,
            key: 'Colonia_Id',
        }),
    });

    const GetServicios = async () => {
        const response = await fetch(route("tipos-servicios.index"));
        const data = await response.json();
        setServicios(data);
    };

    const GetEstados = async () => {
        const response = await fetch(route("estados-filtrados"));
        const data = await response.json();
        setEstados(data);
    };

    const GetMunicipios = async () => {
        const response = await request(route("buscarPorEstadoTelemark"), 'POST', { id: estado }, { enabled: true, error: { message: 'No se pueden filtrar municipios', type: 'error' }, success: { message: "Municipios filtrados", type: 'success' } });
        setMunicipios(response);
    };

    const GetRutas = async () => {
        const response = await fetch(route("rutas-sin-index"));
        const data = await response.json();
        setRutas(data);
        setRutasFiltradas(data);
    };

    const GetColoniaRutaMunicipio = async () => {
        const response = await request(route("colonia-rutas.byCity"), 'POST', requestData, { enabled: true, error: { message: 'No se encontraron colonias', type: 'error' }, success: { message: "Colonias encontradas", type: 'success' } })
        setColoniaRutas(response);
        setFilterState({ ...filterState, dataWithoutFilter: response })
    };

    const GetColoniaRutaServicio = async () => {
        const response = await request(route("colonia-rutas.byService"), 'POST', requestData, { enabled: true, error: { message: 'No se filtro por tipo de servicio', type: 'error' }, success: { message: "Se filtro por tipo de servicio", type: 'success' } })
        setColoniaRutasServicio(response);
    };

    const handleRowUpdating = async (e) => {
        const key = e.key;
        const newData = e.newData;
        const updatedFields = {};

        for (const field in newData) {
            if (newData.hasOwnProperty(field)) {
                if (newData[field] !== undefined) {
                    updatedFields[field] = newData[field];
                }
            }
        }
        const originalData = coloniaRutas.find(
            (item) => item.Colonia_Id === key
        );
        originalData.servicio_id = requestData.servicio;

        const finalData = { ...originalData, ...updatedFields };
        const response = await request(route("colonia-rutas.store"), "POST", finalData, { enabled: true, success: { message: 'Se ha actualizado correctamente', type: 'success' } });

        GetColoniaRutaServicio();

    };

    useEffect(() => {
        if (!estados || !servicios || !rutas) {
            // if(!municipios || !servicios){
            GetServicios();
            // GetMunicipios();
            GetEstados();
            GetRutas();
        }
    }, []);

    useEffect(() => {
        if (estados && servicios && rutas) setState({ loading: false })
    }, [estados, servicios, rutas])

    useEffect(() => {
        if (requestData.municipio !== '') {
            GetColoniaRutaMunicipio();
        }
        if (requestData.servicio !== '') {
            GetRutas().then(() => {
                GetColoniaRutaServicio();
            })
        }
    }, [requestData.municipio]);

    useEffect(() => {
        if (estado) {
            GetMunicipios();
        }
    }, [estado]);

    useEffect(() => {
        if (rutas) {
            const newRoutes = rutas.filter(ruta => (ruta.ruta_idTipoServicio == requestData.servicio) || (ruta.ruta_idruta === 0))
            setRutasFiltradas(newRoutes)
            coloniaRutas.forEach(original => {
                original.ruta_idruta = rutas[0].ruta_idruta
                coloniaRutasServicio.forEach(servicio => {
                    if (original.Colonia_Id === servicio.Colonia_Id) {
                        original.ruta_idruta = servicio.ruta_idruta;
                    }
                })
            });
        }
    }, [coloniaRutasServicio, coloniaRutas]);

    useEffect(() => {
        if (requestData.servicio !== '') {
            GetRutas().then(() => {
                GetColoniaRutaServicio();
            })
        }
    }, [requestData.servicio]);

    useEffect(() => {
        setColoniaRutas(filterState.dataWithoutFilter.filter(cr => {
            var filter = filterState.filter.toUpperCase()
            if (cr.Colonia_Nombre.toUpperCase().indexOf(filter) > -1)
                return true
            return false
        }))
    }, [filterState.filter]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <div className='flex items-center justify-center h-screen'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className="flex gap-6 sm:flex-col md:flex-row">
                    <div className='flex flex-col min-w-[30vh] gap-4 pt-4'>
                        <div className="border-2 w-full shadow-md px-4 pb-3 rounded-xl">
                            <SelectComp
                                label="Estado"
                                options={estados}
                                value={estado}
                                onChangeFunc={(newValue) => {
                                    setEstado(newValue),
                                        setRequestData({
                                            ...requestData,
                                            municipio: '',
                                        })
                                }}
                                virtual={false}
                                firstOption={true}
                                firstLabel="Ninguno"
                                data="descripcionEstado"
                                valueKey="idEstado"
                            />
                            <SelectComp
                                label="Municipio"
                                options={municipios}
                                value={requestData.municipio}
                                firstOption={true}
                                firstLabel="Ninguno"
                                onChangeFunc={(newValue) =>
                                    setRequestData({
                                        ...requestData,
                                        municipio: newValue,
                                    })
                                }
                                data="descripcionMunicipio"
                                valueKey="idMunicipio"
                            />

                            <SelectComp
                                label="Tipo de servicio"
                                options={servicios}
                                value={requestData.servicio}
                                onChangeFunc={(newValue) =>
                                    setRequestData({
                                        ...requestData,
                                        servicio: newValue,
                                    })
                                }
                                data="tipoServicio_descripcion"
                                valueKey="tipoServicio_idTipoServicio"
                            />

                            <TextInput
                                label={'Buscar'}
                                className="block w-full mt-1 texts"
                                value={filterState.filter}
                                onChange={(e) => setFilterState({ ...filterState, filter: e.target.value })}
                                customIcon={'search'}
                            />
                        </div>
                    </div>
                    {coloniaRutas &&
                        <div className="w-full">
                            <div className='virtualTable blue-scroll monitor-table'>
                                <DataGrid
                                    dataSource={dataSource}
                                    showBorders={false}
                                    selectionChanged={selectionChanged}
                                    showRowLines={true}
                                    showColumnLines={false}
                                    paging={false}
                                    onRowUpdating={handleRowUpdating}
                                    editing={{
                                        mode: "cell",
                                        allowUpdating: true,
                                        allowDeleting: false
                                    }}
                                >
                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                    <Column dataField="Colonia_Nombre" caption='CP - Colonia' allowEditing={false} valueExpr="Colonia_Nombre" displayExpr="Colonia_Nombre" />
                                    <Column dataField="descripcionMunicipio" caption='Ciudad' allowEditing={false} valueExpr="descripcionMunicipio" displayExpr="descripcionMunicipio" />
                                    {
                                        (rutasFiltradas && (requestData.servicio !== '')) ? (
                                            <Column dataField="ruta_idruta" caption={'Ruta'} allowEditing={true}>
                                                <Lookup dataSource={rutasFiltradas} valueExpr="ruta_idruta" displayExpr="ruta_nombre" />
                                            </Column>
                                        ) : null
                                    }
                                </DataGrid>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
}

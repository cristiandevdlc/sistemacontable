import request from '@/utils';
import { useEffect, useState } from "react";
import { useForm } from '@inertiajs/react';
import Datatable from '@/components/Datatable';
import { Tooltip } from '@mui/material';
import SelectCompWhite from '@/components/SelectCompWhite';
import LoadingDiv from '@/components/LoadingDiv';


const OperadoresUnidad = () => {
    const { data, setData } = useForm({ idQuienconQuienTransporte: '', fechaGuardado: '', idOperador: '', idTracto: '', idClaveConfigAutotransporte: '', idPG1: '', idPG2: '' })
    const [allData, setAllData] = useState({ operadores: [], unidadesTracto: [], unidadesPortaGas: [], configuracionAutotransporte: [] })
    const [operadoresUnidad, setOperadoresUnidad] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchActiveData = async () => {
        const operadoresResponse = await request(route('operadores-unidad.index'))
        const response = await request(route('operadores-unidad-activo'))
        console.log(response.operadores)
        const operadoresConDatosIds = new Set(operadoresResponse.map(op => Number(op.idOperador)));
        console.log(operadoresConDatosIds)
        const operadoresFiltrados = response.operadores.filter(op => !operadoresConDatosIds.has(op.idOperador));
        console.log(operadoresFiltrados)
        setAllData(response)
        let nuevosOperadoresUnidad = []
        if (operadoresResponse.length > 0) {
            operadoresResponse.map(opRes => {
                console.log(opRes)
                nuevosOperadoresUnidad.push({ idUnidadTracto: opRes.idTracto, idPortaGasUno: opRes.idPG1, idConfiguracion: opRes.idClaveConfigAutotransporte, idPortaGasDos: opRes?.idPG2, remolqueConfigAutotransporte: opRes.configuracion.remolqueConfigAutotransporte, idOperador: opRes.idOperador, nombre: opRes.operador.Nombre + ' ' + opRes.operador.ApellidoPaterno + ' ' + opRes.operador.ApellidoMaterno })
            })
        }
        operadoresFiltrados.map(operador => nuevosOperadoresUnidad.push({ idUnidadTracto: '', idPortaGasUno: '', idConfiguracion: '', idPortaGasDos: '', remolqueConfigAutotransporte: '0', idOperador: operador.idOperador, nombre: operador.Nombre + ' ' + operador.ApellidoPaterno + ' ' + operador.ApellidoMaterno }))
        console.log(nuevosOperadoresUnidad)
        setOperadoresUnidad(nuevosOperadoresUnidad)
    }

    useEffect(() => {
        fetchActiveData().then(() => setLoading(false))
    }, [])

    const submit = async (opData) => {

        await request(route('operadores-unidad.store'), 'POST',
            { idOperador: opData.idOperador, idTracto: opData.idUnidadTracto, idClaveConfigAutotransporte: opData.idConfiguracion, idPG1: opData.idPortaGasUno, idPG2: opData.idPortaGasDos })

        fetchActiveData()
    }

    const updateOperadorData = (idOperador, id, key, idPortaGasUno) => {
        switch (key) {
            case 'idUnidadTracto':
                const updateIdUnidadTracto = operadoresUnidad.map(operador =>
                    operador.idOperador === idOperador ? { ...operador, idUnidadTracto: id } : operador
                )
                setOperadoresUnidad(updateIdUnidadTracto)
                break;
            case 'idPortaGasUno':
                const updateIdPortaGasUno = operadoresUnidad.map(operador =>
                    operador.idOperador === idOperador ? { ...operador, idPortaGasUno: id } : operador
                )
                setOperadoresUnidad(updateIdPortaGasUno)
                break;
            case 'idConfiguracion':
                const tieneDobleRemolque = allData.configuracionAutotransporte.find(auCon => auCon.idConfigAutotransporte === id)
                const updateIdConfiguracion = operadoresUnidad.map(operador =>
                    operador.idOperador === idOperador ? { ...operador, idConfiguracion: id, remolqueConfigAutotransporte: tieneDobleRemolque.remolqueConfigAutotransporte, idPortaGasDos: tieneDobleRemolque.remolqueConfigAutotransporte === '1' ? '' : null } : operador
                )
                setOperadoresUnidad(updateIdConfiguracion)
                break;
            case 'idPortaGasDos':
                if (id === idPortaGasUno) {
                    return
                }
                const updateIdPortaGasDos = operadoresUnidad.map(operador =>
                    operador.idOperador === idOperador ? { ...operador, idPortaGasDos: id } : operador
                )
                setOperadoresUnidad(updateIdPortaGasDos)
                break;
            default:
                break;
        }
    }


    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <div className='containerTable '>
                        <Datatable
                            data={operadoresUnidad}
                            searcher={false}
                            virtual={true}
                            columns={[
                                { header: 'Nombre', accessor: 'nombre', width: '30vh', },
                                {
                                    header: 'Unidad Tracto',
                                    accessor: 'idUnidadTracto',
                                    width: '20vh',
                                    cell: eprops => (
                                        <SelectCompWhite
                                            label='Unidad Tracto'
                                            virtual={true}
                                            onChangeFunc={(e) => {
                                                updateOperadorData(eprops.item.idOperador, e, 'idUnidadTracto')
                                                console.log(eprops)
                                            }}
                                            options={allData.unidadesTracto}
                                            data="unidad_numeroComercial"
                                            valueKey="unidad_idUnidad"
                                            secondKey={eprops.item.idUnidadTracto}
                                        />
                                    ),
                                },
                                {
                                    header: 'PG1',
                                    accessor: 'idPortaGasUno',
                                    width: '20vh',
                                    cell: eprops => (
                                        <SelectCompWhite
                                            label='PG1'
                                            virtual={true}
                                            onChangeFunc={(e) => {
                                                updateOperadorData(eprops.item.idOperador, e, 'idPortaGasUno')
                                            }}
                                            options={allData.unidadesPortaGas}
                                            data="unidad_numeroComercial"
                                            valueKey="unidad_idUnidad"
                                            secondKey={eprops.item.idPortaGasUno}
                                        />
                                    ),
                                },
                                {
                                    header: 'Configuración',
                                    accessor: 'idConfiguracion',
                                    width: '20vh',
                                    cell: eprops => (
                                        <SelectCompWhite
                                            label='Configuracion'
                                            virtual={true}
                                            onChangeFunc={(e) => {
                                                updateOperadorData(eprops.item.idOperador, e, 'idConfiguracion')
                                            }}
                                            options={allData.configuracionAutotransporte}
                                            data="claveConfigAutotransporte"
                                            valueKey="idConfigAutotransporte"
                                            secondKey={eprops.item.idConfiguracion}
                                        />
                                    ),
                                },
                                {
                                    header: 'PG2',
                                    accessor: 'idPortaGasDos',
                                    width: '20vh',
                                    cell: eprops => (
                                        <SelectCompWhite
                                            label='PG2'
                                            virtual={true}
                                            onChangeFunc={(e) => {
                                                updateOperadorData(eprops.item.idOperador, e, 'idPortaGasDos', eprops.item.idPortaGasUno)
                                                console.log(eprops)
                                            }}
                                            options={eprops.item.remolqueConfigAutotransporte === '0' ? [] : allData.unidadesPortaGas}
                                            data="unidad_numeroComercial"
                                            valueKey="unidad_idUnidad"
                                            secondKey={eprops.item.idPortaGasDos}
                                        />
                                    ),
                                },
                                {
                                    header: "Acciones",
                                    cell: (eprops) => (
                                        <div>
                                            <Tooltip title="Guardar">
                                                <button onClick={() => submit(eprops.item)} className="material-icons">save</button>
                                            </Tooltip>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
            }

        </div>
    );
}
export default OperadoresUnidad

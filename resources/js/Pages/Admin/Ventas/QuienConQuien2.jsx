import { ButtonComp } from "@/components/ButtonComp";
import Datatable from "@/components/Datatable";
import { FieldDrawer } from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import SelectComp from "@/components/SelectComp";
import request, { primaryColor } from "@/utils";
import { DataGrid } from "devextreme-react";
import { Column, Lookup } from "devextreme-react/data-grid";
import { useEffect } from "react";
import { useState } from "react";



export default function QuienConQuien() {
    const [filter, setFilter] = useState('quienConQuien_idTipoServicio')
    const [modData, setModData] = useState([])
    const [states, setStates] = useState({
        loading: true,
        redes: [],
        unidades: [],
        ayudantes: [],
        vendedores: [],
        supervisores: [],
        quienConQuien: [],
        tipoServicio: [],
        vendedoresOmitidos: [],
        tipo: ''
    })

    const getWho = async () => {
        const [
            tipoServicio,
            redes,
            whoByWho
        ] = await Promise.all([
            request(route('tipos-servicios.index')),
            request(route('red.index')),
            request(route('quien-con-quien.index'))
        ])
        setStates({
            ...states,
            quienConQuien: whoByWho.quienconquien,
            supervisores: whoByWho.supervisores,
            vendedores: whoByWho.vendedores,
            unidades: whoByWho.unidades,
            tipoServicio: tipoServicio,
            vendedoresOmitidos: whoByWho.vendedores.filter(v => v.Nombres == '(SIN').map(r => r.IdPersona),
            loading: false,
            redes: redes,
        })
    }

    const updateWhoStatus = (e) => {
        const index = states.quienConQuien.findIndex(who => who == e)
        const copyWho = states.quienConQuien
        const actual = states.quienConQuien[index].quienConQuien_checkout == 1
        copyWho[index].quienConQuien_checkout = !actual

        const { newModData, newWhoByWhoData } = processWhoEquals(copyWho[index])
        setStates({ ...states, quienConQuien: newWhoByWhoData })
        setModData(newModData)
    }

    const processWhoEquals = (who = {}, whoData = states.quienConQuien) => {
        const unSavedWho = whoData
            .filter(reg => false)
            // .filter(reg => (reg.quienConQuien_idunidad == who.quienConQuien_idunidad ||
            //     (reg.quienConQuien_idVendedor == who.quienConQuien_idVendedor && !states.vendedoresOmitidos.includes(who.quienConQuien_idVendedor)) ||
            //     (reg.quienConQuien_idAyudante == who.quienConQuien_idAyudante && !states.vendedoresOmitidos.includes(who.quienConQuien_idAyudante)) ||
            //     (reg.quienConQuien_idAyudante2 == who.quienConQuien_idAyudante2 && !states.vendedoresOmitidos.includes(who.quienConQuien_idAyudante2))) &&
            //     (reg.quienConQuien_idRuta !== who.quienConQuien_idRuta && reg.quienConQuien_checkout == 1))
            // .map(reg => ({ ...reg, quienConQuien_checkout: false }))

        const unsavedWhoIds = unSavedWho.map(reg => reg.quienConQuien_idRuta)

        const newWhoByWhoData = states.quienConQuien.map(reg => ({
            ...reg,
            quienConQuien_checkout: unsavedWhoIds
                .includes(reg.quienConQuien_idRuta) ?
                false :
                reg.quienConQuien_checkout
        }))
        const whoIndex = newWhoByWhoData.findIndex(q => q.quienConQuien_idRuta == who.quienConQuien_idRuta)
        newWhoByWhoData[whoIndex] = who
        const dataToSend = {
            newModData: [
                ...modData.filter(q => !unsavedWhoIds.includes(q.quienConQuien_idRuta) && q.quienConQuien_idRuta !== who.quienConQuien_idRuta),
                ...unSavedWho,
                who
            ],
            unsavedWhoIds,
            newWhoByWhoData
        }
        console.log(dataToSend)

        return dataToSend
    }

    const updateWhoRow = (e) => {
        if (e.newData) {
            const newData = { ...e.oldData, ...e.newData }

            console.log(e.oldData, e.newData)
            const { newModData, newWhoByWhoData } = processWhoEquals(newData)
            setStates({ ...states, quienConQuien: newWhoByWhoData })
            setModData(newModData)
        }
    }

    const submit = async () => {
        await request(
            route("quien-con-quien.store"),
            "POST",
            { quienConQuienArray: modData },
            {
                enabled: true,
                error: { message: 'Error al registrar quien con quien' },
                success: { message: 'Registros guardados' }
            }
        ).then(() => {
            setModData([])
            getWho()
        });
    }

    const filterDataSource = (options = { data: null }) => options.data ? ["is_vendedor.idtiposervicio", "=", options.data?.quienConQuien_idTipoServicio] : null

    useEffect(() => {
        getWho()
    }, []);

    return (
        <div className="relative h-[98%] pb-4 px-3 overflow-auto blue-scroll">
            {states.loading && <LoadingDiv />}
            {!states.loading &&
                <div className="flex flex-col h-[100%]">
                    <div className="grid grid-cols-3 gap-3 border-2 w-full shadow-md px-4 pb-3 rounded-xl items-center">
                        <FieldDrawer
                            fields={[
                                {
                                    select: true,
                                    label: 'Tipo Servicio',
                                    options: states.tipoServicio,
                                    data: 'tipoServicio_descripcion',
                                    valueKey: 'tipoServicio_idTipoServicio',
                                    firstLabel: 'Todos',
                                    value: states.tipo,
                                    onChangeFunc: (e) => setStates({
                                        ...states,
                                        tipo: e
                                    })
                                },
                                { custom: true, customItem: () => (<div></div>) },
                                {
                                    custom: true,
                                    customItem: () => (<>
                                        <ButtonComp onClick={submit} label="Guardar" color={primaryColor} />
                                    </>)
                                },
                            ]}
                        />
                    </div>
                    <div className="quienConQuienTablaTotal">
                        <Datatable
                            // add={submit}
                            data={states.tipo != '' ? states.quienConQuien.filter(q => q.servicio.tipoServicio_idTipoServicio == states.tipo) : states.quienConQuien}
                            virtual={true}
                            tableId={'quienConQuien_idQuienConQuien'}
                            handleRowUpdating={updateWhoRow}
                            editingMode={{ mode: "cell", allowUpdating: true }}
                            columns={[
                                {
                                    header: 'Ruta',
                                    // accessor: 'ruta_nombre',
                                    cell: ({ item }) => item.ruta_nombre,
                                    width: '15%',
                                    alignment: 'start'
                                },
                                {
                                    header: 'Tipo servicio',
                                    cell: ({ item }) => item.servicio.tipoServicio_descripcion,
                                    width: '8%',
                                    alignment: 'start'
                                },
                                {
                                    header: 'Unidad',
                                    accessor: 'quienConQuien_idunidad',
                                    lookup: {
                                        dataSource: (options = { data: null }) => {
                                            return {
                                                store: states.unidades,
                                                filter: options.data ?
                                                    ["unidad_idTipoServicio", "=", options.data?.quienConQuien_idTipoServicio] : null
                                            }
                                        },
                                        displayExpr: "unidad_numeroComercial",
                                        valueExpr: "unidad_idUnidad",
                                    },
                                    width: '5%',
                                },
                                {
                                    header: 'Vendedor',
                                    accessor: 'quienConQuien_idVendedor',
                                    lookup: {
                                        dataSource: (options = { data: null }) => ({
                                            store: states.vendedores,
                                            filter: filterDataSource(options)
                                        }),
                                        displayExpr: "nombre_completo",
                                        valueExpr: "IdPersona",
                                    }
                                },
                                {
                                    header: 'Ayudante',
                                    accessor: 'quienConQuien_idAyudante',
                                    lookup: {
                                        dataSource: (options = { data: null }) => ({
                                            store: states.vendedores,
                                            filter: filterDataSource(options)
                                        }),
                                        displayExpr: "nombre_completo",
                                        valueExpr: "IdPersona",
                                    },
                                },
                                {
                                    header: 'Ayudante 2',
                                    accessor: 'quienConQuien_idAyudante2',
                                    lookup: {
                                        dataSource: (options = { data: null }) => ({
                                            store: states.vendedores,
                                            filter: filterDataSource(options)
                                        }),
                                        displayExpr: "nombre_completo",
                                        valueExpr: "IdPersona",
                                    },
                                },
                                {
                                    width: '8%',
                                    header: 'Red',
                                    accessor: 'quienConQuien_idRed',
                                    lookup: {
                                        dataSource: states.redes,
                                        displayExpr: "red_numero",
                                        valueExpr: "red_idRed",
                                    },
                                },
                                {
                                    header: 'Supervisor',
                                    accessor: 'quienConQuien_idSupervisor',
                                    lookup: {
                                        dataSource: states.supervisores,
                                        displayExpr: "nombre_completo",
                                        valueExpr: "IdPersona",
                                    },
                                },
                                {
                                    width: '8%',
                                    header: 'Estado',
                                    accessor: 'quienConQuien_checkout',
                                    width: '8vh',
                                    cell: ({ item }) => (
                                        <>
                                            <input type="checkbox"
                                                checked={item.quienConQuien_checkout == 1}
                                                className="cursor-pointer"
                                                onChange={e => updateWhoStatus(item)} ></input>
                                        </>
                                    )
                                },

                            ]}
                        />
                    </div>
                </div>
            }

        </div>
    )
}
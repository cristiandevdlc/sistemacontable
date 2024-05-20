import request, { noty, yearsList, } from "@/utils";
import CloseIcon from '@mui/icons-material/Close';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";

const dialogActions = { create: 0, update: 1 }
const intMarca = { Descripcion: '' }
const intModelo = { idMarca: '', descripcion: '', idTipoVehiculo: '' }
// const intDetail = { idMarca: '', descripcion: '', idTipoVehiculo: '' }

const dialogTypes = {
    marca: 0,
    modelo: 1,
    modelDetail: 2,
}

const dialogActDict = [
    'create',
    'edit',
]

const dialogTitles = [
    'marca',
    'modelo',
    'detalles',
]

const initialState = {
    tipos: [],
    marcas: [],
    modelos: [],
    modelosDetalles: [],
    años: [{ value: yearsList()[0].value + 1 }, ...yearsList(50)].map(y => {
        return { year: y.value }
    }),
    loading: true,
    open: false,
    dialogType: dialogTypes.marca,
    action: dialogActions.create,
    errors: {},
    selectedMarca: [],
    submit: () => { },
    loadData: true
}

export default function MarcaModeloCarros() {
    const [state, setState] = useState(initialState)
    const [dataMarca, setDataMarca] = useState(intMarca)
    const [dataModelo, setDataModelo] = useState(intModelo)
    const [dataDetail, setDataDetail] = useState([])

    const fetchAllData = async (optionalState = {}) => {
        const [
            modelos,
            tipos,
            marcas,
        ] = await Promise.all([
            fetch(route("modelo-carro.index")).then(res => res.json()),
            fetch(route("tipo-vehiculo.index")).then(res => res.json()),
            fetch(route("marca-carros.index")).then(res => res.json()),
        ]);

        setState({
            ...state,
            ...optionalState,
            marcas: marcas,
            modelos: modelos,
            tipos: tipos,
            loading: false,
            loadData: false
        })
    }

    const submitMarca = async (e) => {
        e.preventDefault();

        const ruta = !state.action ? route("marca-carros.store") : route("marca-carros.update", dataMarca.idMarca);
        const method = !state.action ? "POST" : "PUT";

        await request(ruta, method, dataMarca).then(() => {
            handleModal(state.action, state.dialogType, state.submit, true)
        })
    };

    const submitModelo = async (e) => {
        e.preventDefault();
        const ruta = !state.action ? route("modelo-carro.store") : route("modelo-carro.update", dataModelo.idModelo);
        const method = !state.action ? "POST" : 'PUT';

        const response = await request(ruta, method, { ...dataModelo, idMarca: state.selectedMarca[0]?.idMarca });
        response.descripcion && noty(response.descripcion, 'error')
        handleModal(state.action, state.dialogType, state.submit, true)
    }

    const cilYearHandler = (e) => {
        if (e.newData) {
            const newObject = { ...e.oldData, ...e.newData }
        }
    }

    const submitAño = async (e, data, idModelo) => {
        e.preventDefault()
        const requestData = { ...data, 'idModelo': idModelo };

        const ruta = !data.idModeloVehiculo ? route("modelo-vehiculo.store") : route("modelo-vehiculo.update", data.idModeloVehiculo);
        const method = !data.idModeloVehiculo ? "POST" : 'PUT';

        await request(ruta, method, requestData)
        const newModelos = await fetch(route("modelo-carro.index")).then(res => res.json())
        setState({
            ...state,
            modelos: newModelos
        })

        setDataModelo(newModelos.find(mod => mod.idModelo == dataModelo.idModelo))
    };

    const onSelect = ({ selectedRowKeys }) => setState({ ...state, selectedMarca: selectedRowKeys })

    const handleModal = (action = state.action, type = state.dialogType, submit = () => { }, loadData = false) => setState({
        ...state,
        open: !state.open,
        action: action,
        dialogType: type,
        submit: submit,
        loadData: loadData
    })

    useEffect(() => {
        if (state.loadData)
            fetchAllData()
    }, [state.loadData]);

    useEffect(() => {
        let submit = () => { }
        dialogTypes.modelDetail == state.dialogType && (submit = submitAño)
        dialogTypes.modelo == state.dialogType && (submit = submitModelo)
        dialogTypes.marca == state.dialogType && (submit = submitMarca)
        setState({ ...state, submit })
    }, [dataMarca, dataModelo]);

    return (
        <>
            <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
                {state.loading && <LoadingDiv />}
                {!state.loading && (
                    <div className="grid grid-cols-10 gap-10">
                        <div className="col-span-5 text-center">
                            <h4>Marcas</h4>
                            <Datatable
                                virtual={true}
                                data={state.marcas}
                                add={() => {
                                    setDataMarca(intMarca)
                                    handleModal(dialogActions.create, dialogTypes.marca, submitMarca)
                                }}
                                selection={'single'}
                                selectedData={state.selectedMarca}
                                selectionFunc={onSelect}
                                columns={[
                                    { header: 'Marca', accessor: 'Descripcion' },
                                    {
                                        header: "Acciones",
                                        edit: ({ item }) => {
                                            setDataMarca(item)
                                            handleModal(dialogActions.update, dialogTypes.marca, submitMarca)
                                        },
                                    },
                                ]}
                            />
                        </div >
                        <div className="col-span-5 text-center">
                            <h4>Modelo</h4>
                            <Datatable
                                virtual={true}
                                data={state.modelos.filter(m => m.idMarca == state.selectedMarca[0]?.idMarca)}
                                add={state.selectedMarca.length > 0 ? () => {
                                    setDataModelo(intModelo)
                                    handleModal(dialogActions.create, dialogTypes.modelo, submitModelo)
                                } : false}
                                columns={[

                                    { header: 'Modelo', accessor: 'descripcion', width: '34%' },
                                    { header: 'Tipo', cell: ({ item }) => item.tipo_vehiculo?.descripcionTipo, width: '33%' },
                                    {
                                        header: "Acciones", width: '33%',
                                        cell: ({ item }) => (
                                            <div>
                                                <Tooltip title="Editar">
                                                    <button onClick={() => {
                                                        setDataModelo(item)
                                                        handleModal(dialogActions.update, dialogTypes.modelo, submitModelo)
                                                    }} className="material-icons ">edit</button>
                                                </Tooltip>
                                                <Tooltip title="Ver Detalles">
                                                    <button onClick={() => {
                                                        setDataModelo(item)
                                                        handleModal(dialogActions.update, dialogTypes.modelDetail, submitAño)
                                                    }} className="material-icons">visibility</button>
                                                </Tooltip>

                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </div>

            <DialogComp
                dialogProps={{
                    model: (state.dialogType == dialogTypes.modelDetail) ?
                        <>{`Año y cilindraje: ${state.selectedMarca[0]?.Descripcion} - ${dataModelo.descripcion}`}
                            <div onClick={() => handleModal(state.action, state.dialogType, state.submit)}>
                                <CloseIcon className='cursor-pointer' />
                            </div>
                        </>
                        : dialogTitles[state.dialogType],
                    width: 'sm',
                    openState: state.open,
                    customTitle: state.dialogType == dialogTypes.modelDetail,
                    style: 'grid grid-cols-1 ',
                    actionState: dialogActDict[state.action],
                    customAction: state.dialogType == dialogTypes.modelDetail && (() => <></>),
                    openStateHandler: () => (state.dialogType != dialogTypes.modelDetail) &&
                        handleModal(state.action, state.dialogType, state.submit),
                    onSubmitState: () => state.submit
                }}
                fields={[
                    (state.dialogType == dialogTypes.marca) && {
                        label: "Marca",
                        input: true,
                        type: 'text',
                        fieldKey: 'Descripcion',
                        value: dataMarca.Descripcion,
                        onChangeFunc: (e) => { setDataMarca({ ...dataMarca, Descripcion: e.target.value }) }
                    },
                    (state.dialogType == dialogTypes.modelo) && {
                        label: "Modelo",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcion',
                        value: dataModelo.descripcion || '',
                        onChangeFunc: (e) => { setDataModelo({ ...dataModelo, descripcion: e.target.value }) }
                    },
                    (state.dialogType == dialogTypes.modelo) && {
                        label: "Tipo",
                        select: true,
                        options: state.tipos,
                        value: dataModelo.idTipoVehiculo,
                        onChangeFunc: (newValue) =>
                            setDataModelo({
                                ...dataModelo,
                                idTipoVehiculo: newValue,
                            }),
                        data: "descripcionTipo",
                        valueKey: "idTipoVehiculo",
                    },
                    (state.dialogType == dialogTypes.modelDetail) && {
                        table: true,
                        style: 'col-span-full',
                        data: [...dataModelo.modelo_vehiculo, { year: '', cilindrosMotor: '' }],
                        virtual: true,
                        id: 'dialogTable',
                        handleRowUpdating: cilYearHandler,
                        editingMode: { mode: "cell", allowUpdating: true },
                        columns: [
                            {
                                header: 'Año',
                                accessor: "year",
                                lookup: {
                                    dataSource: state.años,
                                    displayExpr: "year",
                                    valueExpr: "year",
                                },
                                width: '40%'
                            },
                            { header: 'Cilindros del motor', accessor: 'cilindrosMotor', width: '50%' },
                            {
                                header: 'Acciones', cell: ({ item }) =>
                                    (item.year && item.cilindrosMotor) && <Tooltip title="Guardar">
                                        <button onClick={(e) => { submitAño(e, item, dataModelo.idModelo) }} className="material-icons">save</button>
                                    </Tooltip>
                            },

                        ]
                    }
                ]}
                errors={state.errors}
            />

        </>
    );
}

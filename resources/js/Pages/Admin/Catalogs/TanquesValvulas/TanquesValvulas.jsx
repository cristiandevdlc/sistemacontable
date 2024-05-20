import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import Datatable from "@/components/Datatable";
import LoadingDiv from "@/components/LoadingDiv";
import SelectComp from "@/components/SelectComp";
import TextInput from "@/components/TextInput";
import request, { validateInputs } from "@/utils";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const tankValveValidations = {
    idTanque: "required",
    idValvula: "required",
    fechaInstalacion: "required"
}

const tanqueValvulaData = {
    idTanque: "",
    idValvula: "",
    fechaInstalacion: "",
    activo: 1,
}

const TanquesValvulas = () => {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [tanks, setTanks] = useState([])
    const [valves, setValves] = useState([])
    const [tanskValves, setTanskValves] = useState([])

    const [tankValve, setTankValve] = useState(tanqueValvulaData)
    const [selectedTankId, setSelectedTankId] = useState([])
    const [selectedValveId, setSelectedValveId] = useState([])
    const selectedRowTankValveDataRef = useRef([])
    const selectedRowTankDataRef = useRef([])
    const selectedRowValveDataRef = useRef([])

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const fetchValves = async () => {
        const response = await request(route('valvulas.index'))
        setValves(response)
    }
    const fetchTanksValves = async () => {
        const response = await request(route('tanques-valvulas.index'))
        console.log(response);
        setLoading(false)
        setTanskValves(response)
    }
    const fetchTanks = async () => {
        const response = await request(route('tanques.index'))
        setTanks(response)
    }

    const selectTankValve = ({ selectedRowKeys, selectedRowsData }) => {
        selectedRowTankValveDataRef.current = selectedRowsData
        /* setSelectedTableDataTank(selectedRowKeys) */
    }
    const selectTank = ({ selectedRowKeys, selectedRowsData }) => {
        selectedRowTankDataRef.current = selectedRowsData
        setTankValve({ ...tankValve, idTanque: selectedRowKeys[0] })
        setSelectedTankId(selectedRowKeys)
    }

    const selectValve = ({ selectedRowKeys, selectedRowsData }) => {
        selectedRowValveDataRef.current = selectedRowsData
        setTankValve(prev => ({ ...prev, idValvula: selectedRowKeys[0] }))
        selectedRowTankDataRef.current[0]?.serie
        setSelectedValveId(selectedRowKeys)
    }

    const handleModal = () => {
        setErrors({})
        setOpen(false)
    }

    const submitRecord = () => {

        setErrors({})
        const result = validateInputs(tankValveValidations, tankValve);
        console.log(result)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        if (action === 'create') {
            request(route('tanques-valvulas.store'), 'POST', tankValve)
            setOpen(false)
        } else if (action === 'edit') {
            request(route('tanques-valvulas.update', tankValve.id), 'PUT', tankValve)
            setOpen(false)
        }
        fetchTanksValves()
    }

    useEffect(() => {
        fetchValves()
        fetchTanksValves()
        fetchTanks()
        getMenuName();
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {tankValve && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        search={true}
                        add={() => {
                            setOpen(true)
                            setTankValve(tanqueValvulaData)
                        }}
                        tableId="dataGridTanquesValvulas"
                        rowId="id"
                        data={tanskValves}
                        selection='single'
                        virtual={true}
                        selectedData={() => { }}
                        selectionFunc={selectTankValve}
                        columns={[
                            { width: '23%', header: "No. Serie Tanque", accessor: "tanque.serie", },
                            { width: '23%', header: "Nombre valvula", accessor: "valvula.nombre" },
                            { width: '23%', header: "Fecha de instalacion", accessor: "fechaInstalacion", cell: ({ item }) => (new Date(item.fechaInstalacion)).formatMXNoTime() },
                            {
                                width: '15%',
                                header: "Activo",
                                accessor: "activo",
                                cell: (eprops) =>
                                    eprops.item.activo === '1' ? (
                                        <Chip label="Activo" color="success" />
                                    ) : (
                                        <Chip label="Inactivo" color="error" />
                                    ),
                            },
                            {
                                width: '15%',
                                header: "Acciones",
                                cell: (eprops) => (
                                    <div>
                                        <Tooltip title="Editar">
                                            <button
                                                className="material-icons"
                                                onClick={() => {
                                                    setAction("edit");
                                                    setTankValve({
                                                        id: eprops.item.id,
                                                        idTanque: eprops.item.idTanque,
                                                        idValvula: eprops.item.idValvula,
                                                        fechaInstalacion: eprops.item.fechaInstalacion,
                                                        activo: Number(eprops.item.activo),
                                                        serie: eprops.item.tanque.serie,
                                                        nombre: eprops.item.valvula.nombre,
                                                    })
                                                    setSelectedTankId([eprops.item.idTanque])
                                                    setSelectedValveId([eprops.item.idValvula])
                                                    console.log(eprops.item);
                                                    setOpen(prev => ({ ...prev, tank: { open: true } }))
                                                }}
                                            >
                                                edit
                                            </button>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                        ]} />
                </div>
            )}
            <Dialog open={open} maxWidth="lg" fullWidth onClose={() => { setOpen(false) }}>
                <DialogTitle> {action === 'create' ? 'Asignar valvula a tanque' : 'Resignar valvula a tanque'} </DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-2 gap-5">
                        <TextInput
                            label="Tanque"
                            type="text"
                            disabled
                            value={selectedRowTankDataRef.current[0]?.serie || tankValve.serie || ''}
                        />
                        <TextInput
                            label="Valvula"
                            type="text"
                            disabled
                            value={selectedRowValveDataRef.current[0]?.nombre || tankValve.nombre || ''}
                        />
                        <TextInput
                            label="Fecha de instalación"
                            type="date"
                            value={tankValve.fechaInstalacion || tankValve.fechaInstalacion || ''}
                            max={(new Date(Date.now() + 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                            onChange={(e) => setTankValve(prev => ({ ...prev, fechaInstalacion: e.target.value }))}
                            className="block w-1/2 mt-1 texts"
                        />

                        <SelectComp
                            label="Activo"
                            select={true}
                            options={[{ id: 0, value: "Inactivo" }, { id: 1, value: "Activo" }]}
                            data='value'
                            fieldKey='unidad_estatus'
                            valueKey='id'
                            value={tankValve.activo || 1}
                            onChangeFunc={(newValue) => {
                                setTankValve({ ...tankValve, activo: newValue })
                            }}
                        />
                        {tanks && !loading && (
                            <Datatable
                                searcher={false}
                                showColumnLines={true}
                                tableId="dataGridTanquesValvulasTanques"
                                rowId="idTanque"
                                data={tanks}
                                selection='single'
                                virtual={true}
                                selectedData={selectedTankId}
                                selectionFunc={selectTank}
                                columns={[
                                    { header: "Selecciona un tanque", accessor: "serie" },
                                    {
                                        header: "Activo",
                                        accessor: "activo",
                                        cell: (eprops) =>
                                            eprops.item.activo === '1' ? (
                                                <Chip label="Activo" color="success" />
                                            ) : (
                                                <Chip label="Inactivo" color="error" />
                                            ),
                                    },
                                ]}
                            />
                        )}
                        {valves && !loading && (
                            <Datatable
                                searcher={false}
                                showColumnLines={true}
                                tableId="dataGridTanquesValvulasValvulas"
                                rowId="idValvula"
                                data={valves}
                                selection='single'
                                virtual={true}
                                selectedData={selectedValveId}
                                selectionFunc={selectValve}
                                columns={[
                                    { header: "Selecciona una valvula", accessor: "nombre" },
                                    {
                                        header: "Activo",
                                        accessor: "activo",
                                        cell: (eprops) =>
                                            eprops.item.activo === '1' ? (
                                                <Chip label="Activo" color="success" />
                                            ) : (
                                                <Chip label="Inactivo" color="error" />
                                            ),
                                    },
                                ]}
                            />
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => { handleModal() }}> Cancelar </Button>
                    <Button color={action == "create" ? "success" : "warning"} onClick={submitRecord}> {action == "create" ? "Crear" : "Actualizar"} </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default TanquesValvulas
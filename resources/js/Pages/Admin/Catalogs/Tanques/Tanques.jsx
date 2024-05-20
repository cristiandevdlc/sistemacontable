import Datatable from "@/components/Datatable";
import request from "@/utils";
import { Button, Chip, DialogActions, Tooltip } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import TipoTanque from "./Modal/TipoTanque";
import CrearTanque from "./Modal/CrearTanque";
import AsignarValvula from "./Modal/AsignarValvula";
import DialogComp from "@/components/DialogComp";
import VerValvulasAsignadas from "./Modal/VerValvulasAsignadas";
import LoadingDiv from "@/components/LoadingDiv";

const Tanques = () => {
    const [open, setOpen] = useState({ choose: false, tankType: false, tank: false, valvesList: false, addValve: false });
    const [selectedRowToAction, setSelectedRowToAction] = useState({ idTanque: "", idTipoTanque: "", capacidad: "", serie: "", ubicacion: "", fecha: "", activo: '', marca: "", precio: '', idUnidadMedida: '' })
    const [action, setAction] = useState('create');
    const [loading, setLoading] = useState(true);
    const [tanks, setTanks] = useState([])

    const fetchTanks = async () => {
        const response = await request(route('tanques.index'))
        setTanks(response)
        setLoading(false)
    }

    useEffect(() => {
        fetchTanks()
    }, [])

    const setRowData = (data) => {
        setSelectedRowToAction({ idTanque: data.idTanque, idTipoTanque: data.idTipoTanque, capacidad: data.capacidad, serie: data.serie, ubicacion: data.ubicacion, fecha: data.fecha, activo: data.activo, marca: data.marca, precio: data.precio, idUnidadMedida: data.idUnidadMedida })
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {tanks && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        search={true}
                        add={() => { setOpen(prev => ({ ...prev, choose: !prev.choose })) }}
                        tableId="dataGridTanques"
                        rowId="idTanque"
                        data={tanks || []}
                        // selection={'single'}
                        virtual={true}
                        // virtual={false}
                        columns={[
                            { width: '13%', header: "Tipo Tanque", cell: ({ item }) => item.tipo_tanque.nombre, },
                            { width: '10%', header: "Precio", accessor: "precio", },
                            { width: '10%', header: "Capacidad", accessor: "capacidad" },
                            { width: '13%', header: "Serie", accessor: "serie" },
                            { width: '10%', header: "Unidad Medida", cell: ({ item }) => item.unidad_medida.unidadMedida_nombre },
                            { width: '10%', header: "Comentarios", accessor: "ubicacion" },
                            { width: '10%', header: "Marca", accessor: "marca" },
                            { width: '10%', header: "Fabricación", accessor: "fecha", cell: ({ item }) => (new Date(item.fecha)).formatMXNoTime() },
                            {
                                width: '7%',
                                header: "Activo",
                                accessor: "activo",
                                cell: (eprops) => Number(eprops.item.activo) === 1 ? (<Chip label="Activo" color="success" />) : (<Chip label="Inactivo" color="error" />),
                            },
                            {
                                width: '7%',
                                header: "Acciones",
                                cell: (eprops) => (
                                    <div>
                                        <Tooltip title="Editar">
                                            <button onClick={() => { setAction("edit"); setOpen(prev => ({ ...prev, tank: !prev.tank })); setRowData(eprops.item) }} className="material-icons">edit</button>
                                        </Tooltip>
                                        <Tooltip title="Agregar valvula">
                                            <button onClick={() => { setOpen(prev => ({ ...prev, addValve: !prev.addValve })); setRowData(eprops.item) }} className="material-icons">add</button>
                                        </Tooltip>
                                        <Tooltip title="Ver Valvulas Asignadas">
                                            <button onClick={() => { setOpen(prev => ({ ...prev, valvesList: !prev.valvesList })); setSelectedRowToAction(prev => ({ ...prev, idTanque: eprops.item.idTanque })); }} className="material-icons">format_list_bulleted </button>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            )}
            <DialogComp dialogProps={{
                openStateHandler: () => setOpen(prev => ({ ...prev, choose: !prev.choose })),
                onSubmitState: () => { },
                actionState: 'x',
                openState: open.choose,
                model: 'x',
                width: 'xs',
                style: '',
                customAction: () => (
                    <DialogActions style={{ backgroundColor: 'white' }}>
                        <Button color="error" onClick={() => setOpen({ ...open, choose: false })}>Cerrar</Button>
                    </DialogActions>
                )
            }}
                fields={[
                    {
                        label: "",
                        custom: true,
                        value: '',
                        style: '',
                        customItem: () =>
                        (
                            <div className="w-full flex flex-col gap-y-4 justify-center items-center p-0 ">
                                <button onClick={() => { setOpen(prev => ({ ...prev, choose: !prev.choose, tankType: !prev.tankType })); }} className="text-white rounded-lg bg-[#2E7D32] tradu hover:bg-[#1E5321] px-10 py-2 w-full">Agregar tipo de tanque</button>
                                <button onClick={() => { setOpen(prev => ({ ...prev, choose: !prev.choose, tank: !prev.tank })); setAction('create') }} className="text-white rounded-lg bg-[#2B3F75] tradu hover:bg-[#1C2A4E px-10 py-2 w-full">Agregar tanque</button>
                            </div>
                        ),
                        onChangeFunc: null,
                    },

                ]}
            />
            {open.tankType && (<TipoTanque open={open} handleCloseModal={() => setOpen(prev => ({ ...prev, tankType: false }))}  />)}
            {open.tank && (<CrearTanque open={open} handleCloseModal={() => setOpen(prev => ({ ...prev, tank: false }))} setRowData={setRowData} selectedRowToAction={selectedRowToAction} action={action} fetchTanks={fetchTanks} />)}
            {open.addValve && (<AsignarValvula open={open} handleCloseModal={() => {setOpen(prev => ({ ...prev, addValve: false }))}} action={action}  selectedRowToAction={selectedRowToAction} />)}
            {open.valvesList && (<VerValvulasAsignadas open={open} handleCloseModal={() => setOpen(prev => ({ ...prev, valvesList: false }))} currentIdTank={selectedRowToAction.idTanque} />)}
        </div>
    )
}

export default Tanques
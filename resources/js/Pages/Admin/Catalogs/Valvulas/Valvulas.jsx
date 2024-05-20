import Datatable from "@/components/Datatable";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import request from "@/utils";
import { Button, Chip, DialogActions, Tooltip } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import TipoValvula from "./Modal/TipoValvula";
import CrearValvula from "./Modal/CrearValvula";

const Valvulas = () => {
    const [open, setOpen] = useState({
        choose: false,
        valveType: false,
        valve: false,
    });

    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [selectedRowToAction, setSelectedRowToAction] = useState({ idValvula: '', nombre: '', descripcion: '', marca: '', modelo: '', tiempoVida: '', fechaRegistro: '', activo: '', numSerie: '', idTipoValvula: '', fechaValvula: '' })
    const [errors, setErrors] = useState({});
    const [valves, setValves] = useState([])
    const tableValveRef = useRef()

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
        setLoading(false)
        console.log(response);
        setValves(response)
    }

    const setRowData = (data, option) => {
        if (option === 'edit') {
            console.log('edit');
            setSelectedRowToAction({ idValvula: data.idValvula, nombre: data.nombre, descripcion: data.descripcion, marca: data.marca, modelo: data.modelo, tiempoVida: data.tiempoVida, fechaRegistro: data.fechaRegistro, activo: data.activo, numSerie: data.numSerie, idTipoValvula: data.idTipoValvula, fechaValvula: data.fechaValvula })
        } else if (option === 'create') {
            console.log('create');
            setSelectedRowToAction({ idValvula: '', nombre: '', descripcion: '', marca: '', modelo: '', tiempoVida: '', fechaRegistro: '', activo: '', numSerie: '', idTipoValvula: '', fechaValvula: '' })
        }
    }

    useEffect(() => {
        document.title = 'Intergas | Valvulas';
        fetchValves();
        getMenuName();
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {/* <div className=" h-full "> */}
            {loading && <LoadingDiv />}
            {valves && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        search={true}
                        add={() => { setOpen(prev => ({ ...prev, choose: !prev.choose })) }}
                        tableId="dataGridValvulas"
                        rowId="idValvula"
                        data={valves}
                        virtual={true}
                        tableRef={tableValveRef}
                        columns={[
                            { header: "Nombre", accessor: "nombre", },
                            { header: "Descripción", accessor: "descripcion", },
                            { header: "Marca", accessor: "marca", },
                            { header: "Modelo", accessor: "modelo" },
                            { header: "Tiempo de vida", accessor: "tiempoVida" },
                            { header: "Fecha de registro", accessor: "fechaRegistro", cell: ({ item }) => (new Date(item.fechaRegistro)).formatMXNoTime() },
                            { header: "No. Serie", accessor: "numSerie" },
                            { header: "Tipo de valvula", accessor: "tipo_valvula.nombre" },
                            { header: "Fecha de fabricacion", accessor: "fechaValvula", cell: ({ item }) => (new Date(item.fechaValvula)).formatMXNoTime() },
                            { header: "Activo", accessor: "tipo_valvula.nombre", cell: (eprops) => eprops.item.activo === '1' ? (<Chip label="Activo" color="success" />) : (<Chip label="Inactivo" color="error" />) },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit');
                                    setOpen(prev => ({ ...prev, valve: { open: true } }));
                                    setRowData(eprops.item, 'edit');
                                }
                            },
                        ]} />
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
                            <div className="w-full flex flex-col gap-y-4 justify-center items-center">
                                <button onClick={() => { setOpen(prev => ({ ...prev, choose: !prev.choose, valveType: !prev.valveType })); }} className="text-white rounded-lg bg-[#2E7D32] tradu hover:bg-[#1E5321] px-10 py-2 w-full">Agregar tipo de valvula</button>
                                <button onClick={() => { setOpen(prev => ({ ...prev, choose: !prev.choose, valve: !prev.valve })); setAction('create'); setRowData({}, 'create') }} className="text-white rounded-lg bg-[#2B3F75] tradu hover:bg-[#1C2A4E] px-10 py-2 w-full">Agregar valvula</button>
                            </div>
                        ),
                        onChangeFunc: null,
                    },

                ]}
            />
            {open.valveType && (<TipoValvula open={open} handleCloseModal={() => setOpen(prev => ({ ...prev, valveType: false }))} />)}
            {open.valve && (<CrearValvula open={open} handleCloseModal={() => setOpen(prev => ({ ...prev, valve: false }))} selectedRowToAction={selectedRowToAction} fetchValves={fetchValves} action={action} />)}

            {/* </div> */}
        </div>
    )
}

export default Valvulas
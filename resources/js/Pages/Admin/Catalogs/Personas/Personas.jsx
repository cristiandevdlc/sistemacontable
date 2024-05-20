import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Chip from "@mui/material/Chip";
import Datatable from "@/components/Datatable";
import LoadingDiv from "@/components/LoadingDiv";
import personData from "./IntPersona";
import request from "@/utils";
import DialogActions from "./Modal/DialogActions";
import ListIcon from '@mui/icons-material/List';
import SelectComp from '@/components/SelectComp';
import SearchIcon from '@mui/icons-material/Search';
import { ButtonComp } from "@/components/ButtonComp";

const excludeWordsPermission = {
    vendedor: "SIN VENDEDOR",
    ayudante: "SIN AYUDANTE",
    sistemas: "ADMINISTATOR DE SISTEMAS",
}
export default function Personas() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState("create");
    const [personas, setPersonas] = useState();
    const [personasfiltradas, setPersonasfiltradas] = useState();
    const [data, setData] = useState(personData);
    const [filtro, setFiltro] = useState({ estatus: '', cedis: '', departamento: '', puesto: '', periocidad: '' });
    const [docs, setDocs] = useState([]);
    const [departamento, setDepartamento] = useState([]);
    const [cedis, setCedis] = useState();
    const [puestos, setPuestos] = useState();
    const [periodicidad, setPeriodicidad] = useState([]);
    const estatus = [{ label: 'Activo', value: "1" }, { label: 'Inactivo', value: "0" }];

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            const requestData = await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    useEffect(() => {
        getDocumments();
    }, []);

    const getDocumments = async () => {
        const docsResponse = await request(route("documentacion.index"), 'GET');
        setDocs(docsResponse);
    }

    const getPersonas = async () => {
        const response = await fetch(route("personas.index"));
        const data = await response.json();
        setPersonas(data);
        setPersonasfiltradas(data);
    };

    const getDepartamento = async () => {
        const response = await fetch(route("departamento.index"));
        const data = await response.json();
        setDepartamento(data);
    };

    const getCedis = async () => {
        const responseR = await fetch(route("cedis.index"));
        const dataR = await responseR.json();
        setCedis(dataR);
    };

    const getPuestos = async () => {
        const response = await request(route("puesto.index"));
        setPuestos(response);
    };

    const getPeriodicidad = async () => {
        const response = await fetch(route("periodicidad.index"));
        const data = await response.json();
        setPeriodicidad(data);
    };

    useEffect(() => {
        if (!personas) {
            getPersonas();
            getMenuName();
            getDepartamento();
            getCedis();
            getPuestos();
            getPeriodicidad();
        } else {
            setLoading(false);
        }
    }, [personas]);

    const filteredData = () => {
        const filtered = personas.filter(persona => {
            const Periodo = Number(persona.PeriodoNominal);
            return !(filtro.estatus && filtro.estatus !== '3' && persona.EsEmpleado !== filtro.estatus) &&
                !(filtro.cedis && filtro.cedis !== 0 && persona.cedis.nombre !== filtro.cedis) &&
                !(filtro.departamento && filtro.departamento !== 0 && persona.departamento.nombre !== filtro.departamento) &&
                !(filtro.puesto && filtro.puesto !== 0 && persona.puestos.nombre !== filtro.puesto) &&
                !(filtro.periocidad && filtro.periocidad !== 0 && Periodo !== filtro.periocidad);
        });

        setPersonasfiltradas(filtered);
    };


    const handleCloseModal = () => { setOpen(false); }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {personas && !loading && (
                <>
                    <section className='gap-6 flex-col sm:w-full md:w-[275px] sm:float-none md:float-left border-2 rounded-xl relative px-4 pb-4'>
                        <SelectComp
                            label="Activo"
                            options={estatus}
                            value={filtro.estatus}
                            data="label"
                            valueKey="value"
                            onChangeFunc={(e) => setFiltro({ ...filtro, estatus: e })}
                        />
                        <SelectComp
                            label="Cedis"
                            options={cedis}
                            data="nombre"
                            value={filtro.cedis}
                            valueKey="nombre"
                            onChangeFunc={(e) => setFiltro({ ...filtro, cedis: e })}
                        />
                        <SelectComp
                            label="Departamento"
                            options={departamento}
                            data="nombre"
                            valueKey="nombre"
                            value={filtro.departamento}
                            onChangeFunc={(e) => setFiltro({ ...filtro, departamento: e })}
                        />

                        <SelectComp
                            label="Puestos"
                            options={puestos}
                            data="nombre"
                            valueKey="nombre"
                            value={filtro.puesto}
                            onChangeFunc={(e) => setFiltro({ ...filtro, puesto: e })}
                        />
                        <SelectComp
                            label="Perido Nominal"
                            options={periodicidad}
                            data="descripcion"
                            valueKey="idPeriodicidad"
                            value={filtro.periocidad}
                            onChangeFunc={(e) => setFiltro({ ...filtro, periocidad: e })}
                        />
                        <ButtonComp 
                            onClick={filteredData}
                            label="Buscar"
                        />
                    </section>
                    <section className='relative flex flex-col h-full items-stretch sm:pl-0 md:pl-4'>
                        <Datatable
                            tableId="DataGridPersons"
                            rowId="IdPersona"
                            add={() => {
                                setAction('create')
                                setData(personData)
                                setOpen(!open)
                            }}
                            data={personasfiltradas}
                            virtual={true}
                            columns={[
                                {
                                    header: "Persona",
                                    accessor: "nombreCompleto",
                                    width: '40%'
                                },
                                {
                                    header: "Cedis",
                                    accessor: "cedis.nombre",
                                    width: '20%',
                                },
                                {
                                    header: "Dpto",
                                    accessor: "departamento.nombre",
                                    width: '20%'
                                },
                                {
                                    header: "Puesto",
                                    accessor: "puestos.nombre",
                                    width: '20%'
                                },
                                {
                                    header: "Activo",
                                    width: '10vh',
                                    cell: (eprops) => <>{eprops.item.EsEmpleado == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>,
                                    width: '10%'
                                },
                                {
                                    header: "Acciones",
                                    // edit: (eprops) => {
                                    //     setAction("edit");
                                    //     setData({ ...eprops.item });
                                    //     setOpen(true)
                                    // },
                                    _editConditional: (eprops) => {
                                        return !(new String(eprops.item.nombreCompleto ?? '')
                                            .toUpperCase()
                                            .includes(excludeWordsPermission.ayudante.toUpperCase()) ||
                                            new String(eprops.item.nombreCompleto ?? '')
                                                .toUpperCase()
                                                .includes(excludeWordsPermission.vendedor.toUpperCase()) ||
                                            new String(eprops.item.nombreCompleto ?? '')
                                                .toUpperCase()
                                                .includes(excludeWordsPermission.sistemas.toUpperCase())
                                        )

                                    },
                                    _customConditional: (eprops) => {
                                        return !(new String(eprops.item.nombreCompleto ?? '')
                                            .toUpperCase()
                                            .includes(excludeWordsPermission.ayudante.toUpperCase()) ||
                                            new String(eprops.item.nombreCompleto ?? '')
                                                .toUpperCase()
                                                .includes(excludeWordsPermission.vendedor.toUpperCase()) ||
                                            new String(eprops.item.nombreCompleto ?? '')
                                                .toUpperCase()
                                                .includes(excludeWordsPermission.sistemas.toUpperCase())
                                        )
                                    },
                                    cell: (eprops) =>
                                    (
                                        <>{(!(new String(eprops.item.nombreCompleto ?? '')
                                            .toUpperCase()
                                            .includes(excludeWordsPermission.ayudante.toUpperCase()) ||
                                            new String(eprops.item.nombreCompleto ?? '')
                                                .toUpperCase()
                                                .includes(excludeWordsPermission.vendedor.toUpperCase()) ||
                                            new String(eprops.item.nombreCompleto ?? '')
                                                .toUpperCase()
                                                .includes(excludeWordsPermission.sistemas.toUpperCase())
                                        )) &&
                                            <div className='flex gap-3 justify-center text-black'>
                                                <button onClick={() => {
                                                    setAction("edit");
                                                    setData({ ...eprops.item });
                                                    setOpen(true)
                                                }}
                                                    className='bg-[#1B2654] rounded-sm text-white'
                                                >
                                                    <ListIcon />
                                                </button>
                                            </div>
                                        }
                                        </>
                                    ),
                                    width: '15%'
                                },
                            ]}
                        />
                    </section>
                </>
            )}
            <DialogActions
                open={open}
                dialogHandler={() => handleCloseModal()}
                data={data}
                setData={setData}
                docsList={docs}
                action={action}
                getPersonas={getPersonas}
            />
        </div>
    );
}

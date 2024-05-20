import request, { noty, validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';

const cedisValidations = {
    nombre: 'required',
    IdEstado: 'required',
    IdZona: 'required',
}
const cedisData = {
    IdEstado: "",
    IdZona: "",
    nombre: "",
    estatus: 0,
}
export default function Cedis() {
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(cedisData);
    const [cedisId, setCedisId] = useState(0);
    const [estados, setEstados] = useState();
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [cedis, setCedis] = useState();
    const [zonas, setZona] = useState();

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };

    const fetchdata = async () => {
        GetCedis();
        GetZonas();
        GetEstado();
    };

    const GetCedis = async () => {
        const responseR = await fetch(route("cedis.index"));
        const dataR = await responseR.json();
        setCedis(dataR);
    };

    const GetZonas = async () => {
        const responseE = await fetch(route("zonas.index"));
        const dataE = await responseE.json();
        setZona(dataE);
    };

    const GetEstado = async () => {
        const responseTs = await fetch(route("sat/estados.index"));
        const dataTs = await responseTs.json();
        setEstados(dataTs);
    };

    const handleEstado = async (event) => {
        setData({ ...data, IdEstado: event });
        await getZonaPorestado(event);
    };

    const getZonaPorestado = async (estadoId) => {
        const response = await request(route("getZonaEstado"), 'POST', { estadoId: estadoId }, { enabled: true });
        if (response.length === 0) {
            setZona([]);
            noty("No se encontraron zonas", 'error')
        } else {
            setZona(response);
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(cedisValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("cedis.store") : route("cedis.update", cedisId);
        const method = action === "create" ? "POST" : "PUT";

        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        if (!cedis) {
            GetCedis();
            GetZonas();
            GetEstado();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [cedis]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {cedis && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={cedis}
                        add={() => { setAction("create"); setData(cedisData); setOpen(!open); }}
                        columns={[
                            { header: "Cedis", accessor: "nombre" },
                            {
                                header: "Estado", accessor: "estado",
                                cell: (eprops) => <span>{eprops.item.estado.descripcionEstado}</span>
                            },
                            {
                                header: "Zona", accessor: "zona",
                                cell: (eprops) => <span>{eprops.item.zona && eprops.item.zona.zona_descripcion}</span>
                            },
                            {
                                header: "Activo",
                                cell: (eprops) => <>{eprops.item.estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>
                            },

                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setCedisId(eprops.item.IdCedis);
                                    setOpen(!open);
                                },
                            },
                        ]}
                    />
                </div>
            )}
            <DialogComp dialogProps={{
                model: 'Cedis',
                width: 'sm',
                openState: open,
                style: 'grid grid-cols-1 ',
                actionState: action,
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit
            }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: 'text',
                        fieldKey: 'nombre',
                        value: data.nombre || "",
                        onChangeFunc: (e) => {
                            if (e.target.value.length < 30) {
                                setData({
                                    ...data,
                                    nombre: e.target.value,
                                })
                            }
                        },
                    },
                    {
                        label: "Estado",
                        select: true,
                        options: estados,
                        value: data.IdEstado || "",
                        onChangeFunc: (newValue) => handleEstado(newValue),
                        data: "descripcionEstado",
                        valueKey: "idEstado",
                        fieldKey: 'IdEstado',
                    },
                    {
                        label: "Zonas",
                        select: true,
                        options: zonas || [],
                        value: data.IdZona || '',
                        onChangeFunc: (e) => setData({ ...data, IdZona: e }),
                        data: 'zona_descripcion',
                        valueKey: 'zona_idZona',
                    },
                    
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

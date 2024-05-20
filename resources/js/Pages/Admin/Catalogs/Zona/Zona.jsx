import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import zonaData, { zonaFields } from "./IntZona";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import { Link } from 'react-router-dom'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
export default function Zona() {
    const [action, setAction] = useState(["create"]);
    const [loading, setLoading] = useState(true);
    const [empresas, setEmpresas] = useState();
    const [data, setData] = useState(zonaData);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [zona, setZona] = useState([]);
    const [estado, setEstado] = useState([]);
    const [municipio, setMunicipio] = useState([]);

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true })
        } catch (error) { }
    };

    const fetchdata = async () => {
        getZonas();
        getEmpresas();
        getEstado();
        getMunicipios();
        setLoading(false);
    };

    useEffect(() => {
        fetchdata();
    }, []);

    const getZonas = async () => {
        const response = await fetch(route("zonas.index"));
        const data = await response.json();
        setZona(data);
    };

    const getEstado = async () => {
        const response = await fetch(route("sat/estados.index"));
        const data = await response.json();
        setEstado(data);
    };
    const getMunicipios = async () => {
        const response = await fetch(route("municipio.index"));
        const data = await response.json();
        setMunicipio(data);
    };

    const getEmpresas = async () => {
        const response = await fetch(route("empresas.index"));
        const data = await response.json();
        setEmpresas(data);
    };

    const submit = async (e) => {
        const result = validateInputs('', data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("zonas.store") : route("zonas.update", data.zona_idZona);
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

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {zona && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={zona}
                        add={() => {
                            setAction("create");
                            setData(zonaData);
                            setOpen(!open);
                        }}
                        columns={[
                            { header: "Numero Zona", accessor: "zona_numero" },
                            { header: "Descripcion de la Zona", accessor: "zona_descripcion" },
                            { header: "Empresa", cell: (eprops) => <>{eprops.item.empresa.empresa_razonSocial}</> },
                            { header: "Municipio", cell: (eprops) => <>{eprops.item.municipio.descripcionMunicipio}</> },
                            { header: "Estado", cell: (eprops) => <>{eprops.item.estado.descripcionEstado}</> },
                            {
                                header: "Activo",
                                cell: (eprops) => (<>{eprops.item.zona_estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>),
                            },
                            {
                                header: "Editar",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setOpen(!open);
                                },

                            },
                            {
                                header: "Precios",
                                cell: eprops => (
                                    <div className="flex">
                                        <Link to={'/precios'} state={{ item: eprops.item }}>
                                            <AttachMoneyIcon />
                                        </Link>
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            )}
            <DialogComp
                dialogProps={{
                    model: 'zona',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1 gap-x-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Número zona",
                        input: true,
                        type: 'text',
                        fieldKey: 'zona_numero',
                        value: data.zona_numero,
                        onChangeFunc: (e) => {
                            const inputValue = e.target.value;
                            if (/^\d{1,4}$/.test(inputValue)) {
                                setData({ ...data, zona_numero: inputValue });
                            }
                        }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'zona_descripcion',
                        value: data.zona_descripcion,
                        onChangeFunc: (e) => setData({ ...data, zona_descripcion: e.target.value })
                    },
                    {
                        label: "Estado",
                        select: true,
                        options: estado,
                        data: 'descripcionEstado',
                        fieldKey: 'idEstado',
                        valueKey: 'idEstado',
                        value: data.zona_idestado || "",
                        onChangeFunc: (newValue) => setData({ ...data, zona_idestado: newValue, zona_idmunicipio: '' }),
                    },
                    {
                        label: "Municipio",
                        select: true,
                        options: municipio.filter(m => m.idestado == data.zona_idestado),
                        data: 'descripcionMunicipio',
                        fieldKey: 'idMunicipio',
                        valueKey: 'idMunicipio',
                        value: data.zona_idmunicipio || "",
                        onChangeFunc: (newValue) => setData({ ...data, zona_idmunicipio: newValue }),
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'zona_estatus',
                        checked: data.zona_estatus,
                        style: 'justify-center',
                        onChangeFunc: (e) => setData({
                            ...data,
                            zona_estatus: e.target.checked ? "1" : "0",
                        })
                    }
                ]}
                errors={errors}
            />
        </div>
    );
}

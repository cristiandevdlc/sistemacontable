import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { Chip } from "@mui/material";

const municipioData = {
    idMunicipio: "",
    claveMunicipio: "",
    idestado: "",
    descripcionMunicipio: "",
    telemark: ""
}
const municipioValidations = {
    claveMunicipio: "required",
    idestado: "required",
    descripcionMunicipio: ["required", 'max:30'],
}

export default function Municipio() {
    const [data, setData] = useState(municipioData);
    const [action, setAction] = useState("create");
    const [municipios, setMunicipios] = useState();
    const [loading, setLoading] = useState(true);
    const [estados, setEstados] = useState();
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    
    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true })
        } catch (error) { }
      };

    const getMunicipio = async () => {
        const responseP = await fetch(route("municipio.index"));
        const dataP = await responseP.json();
        setMunicipios(dataP);
    };

    const getEstados = async () => {
        const responseT = await fetch(route("sat/estados.index"));
        const dataT = await responseT.json();
        setEstados(dataT);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(municipioValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("municipio.store") : route("municipio.update", data.idMunicipio);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getMunicipio();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    useEffect(() => {
        if (!municipios) {
            getMunicipio();
            getEstados();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [municipios]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {municipios && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={municipios}
                        virtual={true}
                        add={() => {
                            setAction('create')
                            setData(municipioData)
                            handleModal()
                        }}
                        columns={[
                            { header: "Clave", accessor: "claveMunicipio", width: '10%' },
                            { header: "Nombre", accessor: "descripcionMunicipio", width: '40%' },
                            { header: "Estado", accessor: "estado.descripcionEstado" , width: '40%' },
                            { header: "Telemark", accessor: "telemark", width: '20%', cell: (eprops) => (<>{eprops.item.telemark == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>) },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    handleModal();
                                },
                            },
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'municipio',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => { handleModal() },
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Clave",
                        input: true,
                        type: 'text',
                        fieldKey: 'claveMunicipio',
                        value: data.claveMunicipio || '',
                        onChangeFunc: (e) => { setData({ ...data, claveMunicipio: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcionMunicipio',
                        value: data.descripcionMunicipio || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcionMunicipio: e.target.value }) }
                    },
                    {
                        label: "Estado",

                        options: estados,
                        value: data.idestado,
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                idestado: newValue,
                            }),
                        data: "descripcionEstado",
                        valueKey: "idEstado",
                        fieldKey: 'idestado',
                        select: true,
                    },
                    {
                        label: "Telemark",
                        check: true,
                        fieldKey: 'telemark',
                        checked: data.telemark || false,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            telemark: e.target.checked ? "1" : "0",
                        }),
                    }
                ]}
                errors={errors}
            />
        </div>
    );
}

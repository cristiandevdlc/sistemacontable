import request, { validateInputs } from '@/utils';
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";

const estadoData = {
    idEstado: '',
    cveEstado: '',
    cvePais: '',
    descripcionEstado: '',
}

const estadoValidations = {
    cveEstado: 'required',
    cvePais: 'required',
    descripcionEstado: 'required',
}

export default function Estados() {
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(estadoData);
    const [estados, setEstados] = useState();
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [paises, setPaises] = useState();

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };

    useEffect(() => {
        if (!estados) {
            getEstados()
            getPaises()
            getMenuName()
        } else {
            setLoading(false);
        }
    }, [estados]);


    const getEstados = async () => {
        const responseE = await fetch(route("sat/estados.index"));
        const dataE = await responseE.json();
        setEstados(dataE);
    }
    const getPaises = async () => {
        const responseP = await fetch(route("sat/paises.index"));
        const dataP = await responseP.json();
        setPaises(dataP);
    }

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(estadoValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("sat/estados.store") : route("sat/estados.update", data.idEstado);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getEstados();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {estados && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(estadoData)
                            handleModal()
                        }}
                        data={estados}
                        columns={[
                            { header: "Nombre", accessor: "descripcionEstado", },
                            { header: "Clave", accessor: "cveEstado", },
                            {
                                header: "Pais",
                                cell: (eprops) => (<span>{eprops.item.pais.descripcionPais}</span>),
                            },
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
                    model: 'estado',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Clave",
                        input: true,
                        type: 'text',
                        fieldKey: 'cveEstado',
                        value: data.cveEstado || '',
                        onChangeFunc: (e) => { setData({ ...data, cveEstado: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcionEstado',
                        value: data.descripcionEstado || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcionEstado: e.target.value }) }
                    },
                    {
                        label: "Estado",
                        options: paises,
                        value: data.cvePais,
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                cvePais: newValue,
                            }),
                        data: "descripcionPais",
                        valueKey: "idPais",
                        fieldKey: 'cvePais',
                        select: true,
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
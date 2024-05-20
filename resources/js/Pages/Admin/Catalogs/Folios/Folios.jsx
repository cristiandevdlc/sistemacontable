import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";

const folioData = {
    folios_serie: "",
    folios_tipo: "",
    // folios_idEmpresa: "",
    folios_porDefault: "0",
    folios_numeroFolio: "",
}
const folioValidation = {
    folios_tipo: "required",
    folios_serie: "required",
    // folios_idEmpresa: "required",
    folios_numeroFolio: "required",
}
export default function Folios() {
    const [action, setAction] = useState(["edit"]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(folioData);
    const [empresas, setEmpresas] = useState();
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [folios, setfolios] = useState();

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getFolios = async () => {
        const response = await fetch(route("folios.index"));
        const data = await response.json();
        setfolios(data);
    };

    const getEmpresas = async () => {
        const responseE = await fetch(route("empresas.index"));
        const dataE = await responseE.json();
        setEmpresas(dataE);
    };

    useEffect(() => {
        if (!folios) {
            getEmpresas();
            getFolios();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [folios]);

    const submit = async (e) => {
        e.preventDefault();
        
        setErrors({})
        const result = validateInputs(folioValidation, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("folios.store") : route("folios.update", data.folios_idFolios);
        const method = action === "create" ? "POST" :  "PUT";

        await request(ruta, method, data).then(() => {
            getFolios();
            setOpen(!open);
        });
    };
    
    const handleCloseModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {folios && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData(folioData);
                            handleCloseModal();
                        }}
                        data={folios}
                        columns={[
                            {
                                header: "Empresa",
                                accessor: "empresa",
                                cell: (eprops) => (
                                  <span>
                                    {eprops.item.empresa
                                      ? eprops.item.empresa.empresa_razonSocial
                                      : "SIN EMPRESA ASIGNADA"}
                                  </span>
                                ),
                              },
                                                          { header: "Folios serie", accessor: "folios_serie", },
                            { header: "Folios tipo", accessor: "folios_tipo" },
                            { header: "Numero Folio", accessor: "folios_numeroFolio", },
                            { header: "Estatus", accessor: "folios_porDefault" },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    handleCloseModal();
                                },
                            },
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: `folio`,
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    style: 'grid grid-cols-1 gap-x-4',
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit,
                }}
                fields={[
                    {
                        label: "Número de folio",
                        input: true,
                        type: 'number',
                        fieldKey: 'folios_numeroFolio',
                        value: data.folios_numeroFolio,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                folios_numeroFolio: e.target.value
                            })
                        }
                    },
                    {
                        label: "Folio serie",
                        input: true,
                        type: 'text',
                        fieldKey: 'folios_serie',
                        value: data.folios_serie,
                        maxlenght:'3',
                        onChangeFunc: (e) => {
                            const input = e.target.value.slice(0, 3); // Ensure only the first 3 characters are considered
                            setData({
                                ...data,
                                folios_serie: input
                            });
                        }
                    },
                    {
                        label: "Tipo de folio",
                        input: true,
                        type: 'text',
                        fieldKey: 'folios_tipo',
                        value: data.folios_tipo,
                        onChangeFunc: (e) => {
                            const input = e.target.value.replace(/[^a-zA-Z]/g, "").charAt(0); // Obtener solo la primera letra
                            setData({
                                ...data,
                                folios_tipo: input
                            });
                        }
                        
                        
                        
                    },
                    // {
                    //     label: "Empresa",
                    //     options: empresas,
                    //     value: data.folios_idEmpresa || '',
                    //     onChangeFunc: (newValue) => {
                    //         setData({
                    //             ...data,
                    //             folios_idEmpresa: newValue
                    //         })
                    //     },
                    //     data: "empresa_razonSocial",
                    //     valueKey: "empresa_idEmpresa",
                    //     fieldKey: "folios_idEmpresa",
                    //     select: true,
                    //     fistrOption: true,
                    //     firstLabel: 'Ninguno'
                    // },
                    {
                        label: "Folio default",
                        check: true,
                        fieldKey: 'folios_porDefault',
                        checked: data.folios_porDefault,
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            folios_porDefault: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

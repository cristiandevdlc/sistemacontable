import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect,useState } from 'react';
import Chip from '@mui/material/Chip';

const regimenData = {
    catalogoRegimenFiscalSAT_id: "",
    catalogoRegimenFiscalSAT_clave: "",
    catalogoRegimenFiscalSAT_descripcion: "",
    catalogoRegimenFiscalSAT_fisica: '0',
    catalogoRegimenFiscalSAT_moral: '1',
}

const regimenValidations = {
    catalogoRegimenFiscalSAT_clave:"required",
    catalogoRegimenFiscalSAT_descripcion: "required",
    catalogoRegimenFiscalSAT_fisica: 'required',
    catalogoRegimenFiscalSAT_moral: 'required',
}

export default function RegimenFiscal() {
    const [action, setAction] = useState("create");
    const [data, setData] = useState(regimenData);
    const [regimenes, setRegimenes] = useState();
    const [loading, setLoading] = useState(true);
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

    const getRegimines = async () => {
        const responseE = await fetch(route("sat/regimen-fiscal.index"));
        const dataE = await responseE.json();
        setRegimenes(dataE);
    };

    useEffect(() => {
        if (!regimenes) {
            getRegimines();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [regimenes])

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(regimenValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("sat/regimen-fiscal.store") : route("sat/regimen-fiscal.update", data.catalogoRegimenFiscalSAT_id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getRegimines();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(regimenes && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(regimenData)
                            handleModal()
                        }}
                        data={regimenes}
                        columns={[
                            { header: 'Clave', accessor: 'catalogoRegimenFiscalSAT_clave' },

                            { header: 'Descripcion', accessor: 'catalogoRegimenFiscalSAT_descripcion' },
                            {
                                header: 'Fisica', cell: eprops =>
                                    <>{eprops.item.catalogoRegimenFiscalSAT_fisica == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)} </>
                            },
                            {
                                header: 'Moral', cell: eprops =>
                                    <>{eprops.item.catalogoRegimenFiscalSAT_moral == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>
                            },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    handleModal();
                                },
                            }
                        ]}
                    />
                </div>
            }
            
            <DialogComp
                dialogProps={{
                    model: 'regimen fiscal',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-2',
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[

                    {
                        label: "Clave",
                        input: true,
                        type: 'text',
                        style: 'col-span-2',
                        fieldKey: 'catalogoRegimenFiscalSAT_clave',
                        value: data.catalogoRegimenFiscalSAT_clave || '',
                        onChangeFunc: (e) => {  const value = e.target.value;  if (/^\d*\.?\d*$/.test(value)) { setData({ ...data, catalogoRegimenFiscalSAT_clave: value }); } }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        style: 'col-span-2',
                        fieldKey: 'catalogoRegimenFiscalSAT_descripcion',
                        value: data.catalogoRegimenFiscalSAT_descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoRegimenFiscalSAT_descripcion: e.target.value }) }
                    },
                    {
                        label: "Física",
                        check: true,
                        fieldKey: 'catalogoRegimenFiscalSAT_fisica',
                        checked: data.catalogoRegimenFiscalSAT_fisica,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            catalogoRegimenFiscalSAT_fisica: e.target.checked ? "1" : "0",
                        }),
                    },
                    {
                        label: "Moral",
                        check: true,
                        fieldKey: 'catalogoRegimenFiscalSAT_moral',
                        checked: data.catalogoRegimenFiscalSAT_moral,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            catalogoRegimenFiscalSAT_moral: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}


import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';

const relacionData = {
    catalogoTipoRelacionSAT_id: "",
    catalogoTipoRelacionSAT_clave: "",
    catalogoTipoRelacionSAT_descripcion: "",
}

const relacionValidations = {
    catalogoTipoRelacionSAT_id: "required",
    catalogoTipoRelacionSAT_clave: "required",
    catalogoTipoRelacionSAT_descripcion: "required",
}

export default function TipoRelacionSAT() {
    const [action, setAction] = useState("create");
    const [relaciones, setRelaciones] = useState();
    const [data, setData] = useState(relacionData);
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
    
    const getRelaciones = async () => {
        const responseE = await fetch(route("sat/tipo-relaciones.index"));
        const dataE = await responseE.json();
        setRelaciones(dataE);

    };

    const submit = async (e) => {
        e.preventDefault();
        
        setErrors({})
        const result = validateInputs(relacionValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("sat/tipo-relaciones.store") : route("sat/tipo-relaciones.update", data.catalogoTipoRelacionSAT_id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getRelaciones();
            handleModal();
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    useEffect(() => {
        if (!relaciones) getRelaciones(),getMenuName();
        else setLoading(false)
    }, [relaciones])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(relaciones && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={relaciones}
                        add={() => {
                            setAction('create')
                            setData(relacionData)
                            handleModal()
                        }}
                        columns={[
                            { header: 'Descripcion', accessor: 'catalogoTipoRelacionSAT_descripcion' },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    handleModal()
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
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'catalogoTipoRelacionSAT_descripcion',
                        value: data.catalogoTipoRelacionSAT_descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoTipoRelacionSAT_descripcion: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

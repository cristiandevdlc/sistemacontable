import request, { validateInputs } from '@/utils';;
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect,useState } from 'react';

const cfdiData = {
    usoCfdiSAT_id: "",
    usoCfdiSAT_clave: "",
    usoCfdiSAT_descripcion: ''
}
const cfdiVallidations = {
    usoCfdiSAT_clave: "required",
    usoCfdiSAT_descripcion: ['required', 'max:250'],
}

const CFDI = () => {
    const [action, setAction] = useState("create")
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(cfdiData);
    const [errors, setErrors] = useState({});
    const [usoCfdi, setUsoCfdi] = useState();
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

    const getUsoCFDI = async () => {
        const response = await fetch(route("uso-cfdi.index"));
        const data = await response.json();
        setUsoCfdi(data);
    }

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(cfdiVallidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("uso-cfdi.store") : route("uso-cfdi.update", data.usoCfdiSAT_id)
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getUsoCFDI();
            handleModal();
        });
    };

    useEffect(() => {
        if (!usoCfdi) getUsoCFDI(),getMenuName();
        else setLoading(false)
    }, [usoCfdi])

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {(usoCfdi && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={usoCfdi}
                        add={() => {
                            setAction('create')
                            setData(cfdiData)
                            handleModal()
                        }}
                        columns={[
                            { header: 'Clave', cell: (eprops) => <>{eprops.item.usoCfdiSAT_clave}</> },
                            { header: 'Descripción', cell: (eprops) => <> {eprops.item.usoCfdiSAT_descripcion} </> },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    handleModal()
                                },
                            }
                        ]}
                    />
                </div>
            }

            <DialogComp
                dialogProps={{
                    model: 'CFDI',
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
                        fieldKey: 'usoCfdiSAT_clave',
                        value: data.usoCfdiSAT_clave || '',
                        onChangeFunc: (e) => { setData({ ...data, usoCfdiSAT_clave: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'usoCfdiSAT_descripcion',
                        value: data.usoCfdiSAT_descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, usoCfdiSAT_descripcion: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

export default CFDI
import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';

const paisData = {
    idPais: '',
    cvePais: '',
    descripcionPais: ''
}
const paisValidation = {
    cvePais: 'required',
    descripcionPais: 'required'
}

const Pais = () => {
    const [action, setAction] = useState("create");
    const [countries, setCountries] = useState();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(paisData);
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

    const getCountries = async () => {
        const response = await fetch(route('sat/paises.index'))
        const data = await response.json()
        setCountries(data)
    }

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(paisValidation, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("sat/paises.store") : route("sat/paises.update", data.idPais)
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getCountries();
            handleModal();
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    }

    useEffect(() => {
        if (!countries) {
            getCountries()
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [countries])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {countries && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={countries}
                        add={() => {
                            setAction('create')
                            setData(paisData)
                            handleModal()
                        }}
                        columns={[
                            { header: 'Clave', accessor: 'cvePais' },
                            { header: 'Descripción', accessor: 'descripcionPais' },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    handleModal()
                                },
                            },
                        ]}
                    />
                </div>
            )}
            <DialogComp
                dialogProps={{
                    model: 'metodo de pago',
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
                        maxLength:"3",
                        fieldKey: 'cvePais',
                        value: data.cvePais || '',
                        onChangeFunc: (e) => { setData({ ...data, cvePais: e.target.value }) }
                    },
                    {
                        label: "Descrición",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcionPais',
                        value: data.descripcionPais || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcionPais: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}

export default Pais
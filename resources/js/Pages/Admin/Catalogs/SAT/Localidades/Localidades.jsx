import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';

const localidadData = {
    idLocalidad: '',
    claveLocalidad: '',
    claveEstadoLocalidad: '',
    descripcionLocalidad: ''
}

const localidadValidations = {
    claveLocalidad: 'required',
    claveEstadoLocalidad: 'required',
    descripcionLocalidad: 'required'
}

const Localidades = () => {
    const [data, setData] = useState(localidadData)
    const [action, setAction] = useState("create")
    const [open, setOpen] = useState(false)
    const [localidades, setLocalidades] = useState()
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true);


    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };



    const fetchLocalidades = async () => {
        const response = await request(route('sat-localidades.index'))
        setLocalidades(response)
    }

    useEffect(() => {
        if (!localidades) {
            fetchLocalidades()
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [localidades])

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(localidadValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route('sat-localidades.store') : route('sat-localidades.update', data.idLocalidad);
        const method = action === "create" ? "POST" : action === "edit" ? "PUT" : "DELETE";
        await request(ruta, method, data).then(() => {
            fetchLocalidades()
            setOpen(!open)
        })
    }

    const handleModal = ()=>{
        setOpen(!open)
        setErrors({})
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {localidades && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create');
                            setData(localidadData);
                            handleModal();
                        }}
                        data={localidades}
                        virtual={true}
                        columns={[
                            { header: 'Clave de localidad', accessor: 'claveLocalidad' },
                            { header: 'Clave de estado', accessor: 'claveEstadoLocalidad' },
                            { header: 'Descripción', accessor: 'descripcionLocalidad' },
                            {
                                header: 'Acciones',
                                edit: eprops => {
                                    setAction('edit');
                                    handleModal();
                                    setData(eprops.item);
                                }
                            }
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'localidad',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1',
                    actionState: action,
                    openStateHandler: () => handleModal() ,
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Clave localidad",
                        input: true,
                        type: 'text',
                        fieldKey: 'claveLocalidad',
                        value: data.claveLocalidad || '',
                        onChangeFunc: (e) => { setData({ ...data, claveLocalidad: e.target.value }) }
                    },
                    {
                        label: "Clave estado",
                        input: true,
                        type: 'text',
                        fieldKey: 'claveEstadoLocalidad',
                        value: data.claveEstadoLocalidad || '',
                        onChangeFunc: (e) => { setData({ ...data, claveEstadoLocalidad: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcionLocalidad',
                        value: data.descripcionLocalidad || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcionLocalidad: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}

export default Localidades
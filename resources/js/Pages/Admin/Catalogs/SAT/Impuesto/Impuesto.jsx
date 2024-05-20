import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';

const impuestoData = {
    catalogoImpuestoSAT_id: '',
    catalogoImpuestoSAT_clave: '',
    catalogoImpuestoSAT_descripcion: '',
    catalogoImpuestoSAT_retencion: '0',
    catalogoImpuestoSAT_traslado: '0',
    catalogoImpuestoSAT_localFederal: '',
    catalogoImpuestoSAT_Entidad: ''
}
const impuestoValidations = {
    catalogoImpuestoSAT_clave: 'required',
    catalogoImpuestoSAT_descripcion: ['required', 'max:25'],
    catalogoImpuestoSAT_retencion: 'required',
    catalogoImpuestoSAT_traslado: 'required',
    catalogoImpuestoSAT_localFederal: ['required', 'max:20'],
    catalogoImpuestoSAT_Entidad: ['required', 'max:20'],
}

const Impuesto = () => {
    const [action, setAction] = useState("create");
    const [data, setData] = useState(impuestoData);
    const [loading, setLoading] = useState(true);
    const [impuestos, setImpuestos] = useState();
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };


    
    const getImpuesto = async () => {
        const response = await fetch(route('sat/impuestos.index'))
        const data = await response.json()
        setImpuestos(data)
    }

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(impuestoValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("sat/impuestos.store") : route("sat/impuestos.update", data.catalogoImpuestoSAT_id)
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getImpuesto();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    }

    useEffect(() => {
        if (!impuestos) {
            getImpuesto()
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [impuestos])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {impuestos && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={impuestos}
                        add={() => {
                            setAction('create')
                            setData(impuestoData)
                            handleModal(!open)
                        }}
                        columns={[
                            { header: 'Clave', accessor: 'catalogoImpuestoSAT_clave' },
                            { header: 'Descripción', accessor: 'catalogoImpuestoSAT_descripcion' },
                            { header: 'Local Fed.', accessor: 'catalogoImpuestoSAT_localFederal' },
                            { header: 'Entidad', accessor: 'catalogoImpuestoSAT_Entidad' },
                            { header: 'Retención', accessor: 'catalogoImpuestoSAT_retencion', cell: eprops => eprops.item.catalogoImpuestoSAT_retencion === '1' ? (<Chip label='Si' color='success' size='small' />) : (<Chip label='No' color='error' size='small' />) },
                            { header: 'Traslado', accessor: 'catalogoImpuestoSAT_traslado', cell: eprops => eprops.item.catalogoImpuestoSAT_traslado === '1' ? (<Chip label='Si' color='success' size='small' />) : (<Chip label='No' color='error' size='small' />) },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    setOpen(!open)
                                },
                            }
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'impuesto',
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
                        fieldKey: 'catalogoImpuestoSAT_clave',
                        style: 'col-span-2',
                        value: data.catalogoImpuestoSAT_clave || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoImpuestoSAT_clave: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'catalogoImpuestoSAT_descripcion',
                        style: 'col-span-2',
                        value: data.catalogoImpuestoSAT_descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoImpuestoSAT_descripcion: e.target.value }) }
                    },
                    {
                        label: "Local federal",
                        input: true,
                        type: 'text',
                        fieldKey: 'catalogoImpuestoSAT_localFederal',
                        style: 'col-span-2',
                        value: data.catalogoImpuestoSAT_localFederal || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoImpuestoSAT_localFederal: e.target.value }) }
                    },
                    {
                        label: "Entidad",
                        input: true,
                        type: 'text',
                        fieldKey: 'catalogoImpuestoSAT_Entidad',
                        style: 'col-span-2',
                        value: data.catalogoImpuestoSAT_Entidad || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoImpuestoSAT_Entidad: e.target.value }) }
                    },
                    {
                        label: "Retención",
                        check: true,
                        fieldKey: 'catalogoImpuestoSAT_retencion',
                        checked: data.catalogoImpuestoSAT_retencion,
                        style: 'justify-center',
                        onChangeFunc: (e) => setData({
                            ...data,
                            catalogoImpuestoSAT_retencion: e.target.checked ? "1" : "0",
                        })
                    },
                    {
                        label: "Traslado",
                        check: true,
                        fieldKey: 'catalogoImpuestoSAT_traslado',
                        checked: data.catalogoImpuestoSAT_traslado,
                        style: 'justify-center',
                        onChangeFunc: (e) => setData({
                            ...data,
                            catalogoImpuestoSAT_traslado: e.target.checked ? "1" : "0",
                        })
                    }
                ]}
                errors={errors}
            />
        </div>
    )
}

export default Impuesto
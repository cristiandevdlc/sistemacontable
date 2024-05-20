import Datatable from '@/components/Datatable'
import LoadingDiv from '@/components/LoadingDiv'
import { useForm } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Chip from '@mui/material/Chip';
import { Tooltip, } from "@mui/material";
import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';

export default function TipoDocumentacion() {
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [documentaciones, setDocumentacion] = useState();
    const { data, setData } = useForm({
        descripcion: "",
        estatus: "",
    });
    const [documentacionId, setDocumentacionId] = useState(0);
    const [errors, setErrors] = useState({});

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) {
                    console.error("Error en getMenuName:", error);
         }
      };




    const fetchdata = async () => {
        try {
            getDocumentacion();

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const getDocumentacion = async () => {
        const responseE = await fetch(route("tipo-documentacion.index"));
        const dataE = await responseE.json();
        setDocumentacion(dataE);
    };



    useEffect(() => {

        if (open && !documentaciones) {
            getDocumentacion();
        }
    }, [open])


    useEffect(() => {
        if (!documentaciones) {
            getDocumentacion();
            getMenuName()
        } else {
            setLoading(false)
        }
    }, [documentaciones])

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs({descripcion: 'required'}, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("tipo-documentacion.store") : route("tipo-documentacion.update", documentacionId);
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
        <>
            {loading &&
                <LoadingDiv />
            }
            {(documentaciones && !loading) &&
                <>
                    <Datatable
                        add={() => { setAction('create'); setData({ descripcion: "", estatus: false }); setOpen(!open) }}
                        data={documentaciones}
                        columns={[
                            { header: 'Descripcion', accessor: 'descripcion' },
                            { header: 'Estatus', accessor: 'estatus', cell: eprops => eprops.item.estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />) },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setDocumentacionId(eprops.item.idTipoDocumentacion);
                                    setOpen(true);
                                },
                            }
                        ]}
                    />
                </>
            }

            <DialogComp
                dialogProps={{
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit,
                    actionState: action,
                    openState: open,
                    model: 'tipo de documentación',
                    width: 'sm',
                    style: 'grid grid-cols-1 ',
                }}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcion',
                        value: data.descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcion: e.target.value }) }
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                   
                ]}
                errors={errors}
            />
        </>
    )
}


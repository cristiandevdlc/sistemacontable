import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Imagen from '../../Admin/Telermark/ClientesPedidos/img/camion.png';

const docData = {
    idTipoDocumentacion: "",
    descripcion: "",
    estatus: '1',
}

const TipoDocData = {
    descripcion: "",
    estatus: "",
}

const docValidation = {
    idTipoDocumentacion: "required",
    descripcion: "required",
    estatus: "required",
}


export default function Documentacion() {
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [openTipoDoc, setOpenTipoDoc] = useState(false);


    const [action, setAction] = useState("create");
    const [documentaciones, setDocumentacion] = useState()
    const [tipos, setTipos] = useState([]);

    const [IdIsr, setISRId] = useState(0);
    const [data, setData] = useState(docData, TipoDocData);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState('');

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
        getTipos();
        getDocumentacion();
        getMenuName();

    };

    const getDocumentacion = async () => {
        const responseE = await fetch(route("documentacion.index"));
        const dataE = await responseE.json();
        setDocumentacion(dataE);

    };
    const getTipos = async () => {
        const response = await fetch(route("tipo-documentacion.index"));
        const data = await response.json();
        setTipos(data);
    };

    const getDocBytipo = async () => {
        const response = await fetch(route("documentacion-por-tipo", documentoSeleccionado));
        const data = await response.json();
        setDocumentacion(data);
    }

    useEffect(() => {
        getMenuName();
        if (!documentaciones) {
            getMenuName();

            getDocumentacion()
            getTipos();
        } else {
            setLoading(false)
        }
    }, [documentaciones])

    useEffect(() => {
        getDocBytipo();
        getMenuName();

    }, [documentoSeleccionado]);


    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(docValidation, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("documentacion.store") : route("documentacion.update", IdIsr);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    const tipoSubmit = async (e) => {
        e.preventDefault();
        const result = validateInputs({ descripcion: 'required' }, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("tipo-documentacion.store") : route("tipo-documentacion.update", IdIsr);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpenTipoDoc(!openTipoDoc);
        });
    };


    const handleCloseModal = () => {
        setOpen(false);
        setOpenTipoDoc(false);
        setErrors({});
    };
    return (
        <>
            {loading && <LoadingDiv />}
            <section className="overflow-hidden bg-white-50 sm:grid sm:grid-cols-2 -mt-[20px]">
                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className=" text-center ltr:sm:text-left rtl:sm:text-right">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Tipo de documentacion
                        </h2>
                        {documentaciones && (
                            <Datatable
                                data={documentaciones}
                                add={() => {
                                    setAction("create");
                                    setData(documentaciones);
                                    setOpenTipoDoc(!openTipoDoc);
                                }}
                                columns={[
                                    {
                                        header: 'Tipo de documentacion', accessor: 'descripcion',
                                        cell: eprops => (
                                            <button style={{ width: "100%" }}
                                                onClick={() => {
                                                    const documentoId = eprops.item.idTipoDocumentacion;
                                                    if (documentoSeleccionado === documentoId) {
                                                        setDocumentoSeleccionado('');
                                                    } else {
                                                        setDocumentoSeleccionado(documentoId);
                                                    }
                                                }}
                                            >
                                                {eprops.item.descripcion}
                                            </button>
                                        ),
                                    },
                                    { header: 'Estatus', accessor: 'estatus', cell: eprops => eprops.item.estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />) },
                                    {
                                        header: "Acciones",
                                        edit: (eprops) => {
                                            setAction("edit");
                                            setData({ ...eprops.item });
                                            setISRId(eprops.item.idTipoDocumentacion);
                                            setOpenTipoDoc(true);
                                        },
                                    }
                                ]}
                            />
                        )}
                    </div>
                </div>

                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className=" text-center ltr:sm:text-left rtl:sm:text-right">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Documentación
                        </h2>
                        {documentoSeleccionado && documentaciones ? (
                            <Datatable
                                data={documentaciones}
                                add={() => {
                                    setAction("create");
                                    setData(documentaciones);
                                    setOpen(!open);
                                }}
                                columns={[
                                    // { header: 'Tipo de documentacion', accessor: 'documentacion', cell: eprops => <span>{eprops.item.tipo_servicio.descripcion}</span> },
                                    { header: 'Descripcion', accessor: 'descripcion' },
                                    { header: 'Status', cell: eprops => <> {eprops.item.estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</> },
                                    {
                                        header: "Acciones",
                                        edit: (eprops) => {
                                            setAction('edit')
                                            setData({ ...eprops.item });
                                            // setISRId(eprops.item.idDocumentacion);
                                            setOpen(!open)
                                        },
                                    }
                                ]}
                            />
                        ) : (
                            <>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={Imagen} alt="" style={{ textAlign: 'center', width: '60%', height: 'auto', marginTop: '100px', marginRight: '45px' }} className="h-56 w-full object-cover sm:h-full" />
                                </div>
                                <h2 style={{ fontSize: '21px', padding: '10px', marginLeft: '0%' }}>Seleccione una marca para ver el modelo</h2>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

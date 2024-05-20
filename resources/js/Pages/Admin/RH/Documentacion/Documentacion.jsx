import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Imagen from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';

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
    const [documentacion, setDocumentacion] = useState([])
    const [documentacionF, setDocumentacionF] = useState()
    const [tipos, setTipos] = useState();
    const [IdIsr, setISRId] = useState(0);
    const [data, setData] = useState(docData, TipoDocData);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState([]);

    const fetchdata = async () => {
        getTipos();
        getDocumentacion();
    };

    const getDocumentacion = async () => {
        const responseE = await fetch(route("documentacion.index"));
        const dataE = await responseE.json();
        setDocumentacion(dataE);
        setDocumentacionF(dataE)
    };

    const getTipos = async () => {
        const response = await fetch(route("tipo-documentacion.index"));
        const data = await response.json();
        setTipos(data);
    };

    useEffect(() => {
        if (!tipos) {
            getDocumentacion()
            getTipos();
        } else
            setLoading(false)
    }, [tipos])

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

    const handleSelection = ({ selectedRowKeys }) => setDocumentoSeleccionado(selectedRowKeys);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            <div className='grid grid-cols-10 gap-10'>
                <div className="col-span-5 text-center">
                    <h4>Tipo de documentacion</h4>
                    {documentacion && (
                        <Datatable
                            data={tipos}
                            virtual={true}
                            selection={{ mode: 'single' }}
                            add={() => {
                                setAction("create");
                                setData(tipos);
                                setOpenTipoDoc(!openTipoDoc);
                            }}
                            selectedData={documentoSeleccionado}
                            selectionFunc={handleSelection}
                            columns={[
                                {
                                    width: '50%', header: 'Tipo de documentacion', accessor: 'descripcion',
                                    cell: eprops => eprops.item.descripcion,
                                },
                                { width: '30%', header: 'Activo', accessor: 'estatus', cell: eprops => eprops.item.estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />) },
                                {
                                    width: '20%', header: "Acciones",
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

                <div className="col-span-5 text-center">

                    <h4>Documentación</h4>
                    {(documentoSeleccionado.length > 0 && documentacionF) ? (
                        // <></>
                        <Datatable
                            data={documentacionF.filter(d => d.idTipoDocumentacion == documentoSeleccionado[0]?.idTipoDocumentacion)}
                            virtual={true}
                            add={() => {
                                setAction("create");
                                setData(documentacion);
                                setOpen(!open);
                            }}
                            columns={[
                                // { header: 'Tipo de documentacion', accessor: 'documentacion', cell: eprops => <span>{eprops.item.tipo_servicio.descripcion}</span> },
                                { width: '50%', header: 'Descripcion', accessor: 'descripcion' },
                                { width: '30%', header: 'Activo', cell: eprops => <> {eprops.item.estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</> },
                                {
                                    width: '20%',
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
                            <h2 style={{ fontSize: '21px', padding: '10px', marginLeft: '0%' }}>Seleccione un tipo de documentación</h2>
                        </>
                    )}
                </div>
            </div>

            <DialogComp
                dialogProps={{
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => tipoSubmit,
                    actionState: action,
                    openState: openTipoDoc,
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

            <DialogComp
                dialogProps={{
                    model: 'documentación',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    style: 'grid grid-cols-1 ',
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Tipo de Documentación",
                        select: true,
                        options: tipos || [],
                        value: data.idTipoDocumentacion || '',
                        onChangeFunc: (e) => setData({ ...data, idTipoDocumentacion: e }),
                        data: 'descripcion',
                        valueKey: 'idTipoDocumentacion',
                    },
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

        </div>
    )
}

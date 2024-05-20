import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useEffect, useState, useRef } from "react";
import request, { validateInputs } from '@/utils';
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { Tooltip } from "@mui/material";

const conceptoSatData = {
    conceptosProductosSAT_id: '',
    conceptosProductosSAT_descripcion: '',
    conceptosProductosSAT_clave: '',
}
const conceptoSatValidations = {
    conceptosProductosSAT_descripcion: ['required', 'max:255'],
    conceptosProductosSAT_clave: 'required',
}

export default function ConceptosProductos() {
    const [productosSelected, setProductosSelected] = useState()
    const [clavesSelected, setClavesSelected] = useState()
    const [data, setData] = useState(conceptoSatData);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState("edit");
    const [productos, setProductos] = useState();
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [claves, setClaves] = useState();
    const dataProductosGrid = useRef([]);
    const dataClavesGrid = useRef([]);
    const [aux, setAux] = useState(0);

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const fetchdata = async () => {
        const response = await fetch(route("conceptos-productos.index"));
        const data = await response.json();
        const filtered = data.filter((prod) => {
            return !claves.some((clave) => {
                return prod.conceptosProductosSAT_id.toString() === clave.ClavesSatMostrar_idconceptosProductosSAT.toString();
            });
        });
        setProductos(filtered);
        setAux(0)
    };

    const fetchdataClave = async () => {
        const response = await fetch(route("claves-mostrar.index"));
        const data = await response.json();
        setClaves(data);
        setAux(1)
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(conceptoSatValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("conceptos-productos.store") : route("conceptos-productos.update", data.conceptosProductosSAT_id)
        const method = action === "create" ? "POST" : action === "edit" ? "PUT" : "DELETE";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    const onChangeProductos = ({ selectedRowKeys, selectedRowsData }) => {
        dataProductosGrid.current = selectedRowsData
        setProductosSelected(selectedRowKeys)
    }

    const onChangeClaves = (e) => {
        dataClavesGrid.current = e.selectedRowsData
        setClavesSelected(e.selectedRowKeys)
    }

    const passProductosToClaves = async () => {
        const ruta = route("claves-mostrar.store")
        const method = 'POST';
        await request(ruta, method, { ClavesSatMostrar_ids: dataProductosGrid.current })
            .then(() => {
                // setLoading(true)
                clearData();
                fetchdataClave()
            })
        // .then(() => fetchdata());
    }

    const passClavesToProductos = async () => {
        const ruta = route("claves-mostrar.destroy")
        const method = 'POST';
        await request(ruta, method, { claves_mostrar: dataClavesGrid.current })
            .then(() => {
                // setLoading(true)
                clearData();
                fetchdataClave()
            })
        // .then(() => fetchdata());
    }

    const clearData = () => {
        dataClavesGrid.current = []
        dataProductosGrid.current = []
        setProductosSelected([])
        setClavesSelected([])
    }

    useEffect(() => {
        if (aux === 1) {
            fetchdata();
        }
        if (!claves) {
            fetchdataClave()
        }
        if (productos && claves && aux === 0) {
            setLoading(false);
        }
    }, [productos, claves]);

    useEffect(() => {
        getMenuName();
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {(productos && claves && !loading) && (
                <div className="grid grid-cols-11 gap-2">
                    <div className="col-span-5 text-center">
                        <h4>Conceptos SAT</h4>
                        <Datatable
                            tableId="DataGridProductos"
                            rowId="conceptosProductosSAT_id"
                            add={() => {
                                setAction('create')
                                setData(conceptoSatData)
                                handleModal()
                            }}
                            data={productos}
                            selection='multiple'
                            virtual={true}
                            selectedData={productosSelected}
                            selectionFunc={onChangeProductos}
                            columns={[
                                { header: "Clave", accessor: "conceptosProductosSAT_clave" },
                                { header: "Nombre", accessor: "conceptosProductosSAT_descripcion" },
                                {
                                    header: "Acciones",
                                    edit: (eprops) => {
                                        setAction("edit");
                                        setData({ ...eprops.item });
                                        handleModal();
                                    },
                                },
                            ]}
                        />
                    </div >
                    <div className="flex items-center justify-center col-span-1">
                        <div className="grid col-span-1 gap-12">
                            <div>
                                {(dataProductosGrid.current.length != 0) && <Tooltip title="Agregar a Disponibles Facturacion">
                                    <button onClick={passProductosToClaves}><KeyboardDoubleArrowRightIcon /></button>
                                </Tooltip>}
                            </div>
                            <div>
                                {(dataClavesGrid.current.length != 0) && <Tooltip title="Agregar a Conceptos Sat">
                                    <button onClick={passClavesToProductos}><KeyboardDoubleArrowLeftIcon /></button>
                                </Tooltip>}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 text-center">
                        <h4>Disponibles facturación</h4>
                        <Datatable
                            tableId="DataGridClaves"
                            rowId="ClavesSatMostrar_idClavesSatMostrar"
                            data={claves}
                            selection='multiple'
                            virtual={true}
                            selectedData={clavesSelected}
                            selectionFunc={onChangeClaves}
                            columns={[
                                { header: "Clave", accessor: "conceptosProductosSAT_clave" },
                                { header: "Nombre", accessor: "conceptosProductosSAT_descripcion" }
                            ]}
                        />
                    </div>
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'concepto producto',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => { handleModal(); },
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Clave",
                        input: true,
                        type: 'text',
                        fieldKey: 'conceptosProductosSAT_clave',
                        value: data.conceptosProductosSAT_clave || '',
                        onChangeFunc: (e) => { setData({ ...data, conceptosProductosSAT_clave: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'conceptosProductosSAT_descripcion',
                        value: data.conceptosProductosSAT_descripcion,
                        onChangeFunc: (e) => { setData({ ...data, conceptosProductosSAT_descripcion: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

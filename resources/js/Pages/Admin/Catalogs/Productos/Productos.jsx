import request, { numberFormat, validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";

const productData = {
    producto_idUnidadMedida: '',
    producto_nombre: '',
    producto_capacidad: '',
    producto_capacidadvariable: '0',
    producto_estatus: '1',
    producto_idProductoFactura: '',
    producto_cuentaContable: '',
    producto_idConceptosProductosSAT: '',
    producto_idTipoServicio: ''
}

const productValidations = {
    producto_idUnidadMedida: 'required',
    producto_nombre: 'required',
    producto_capacidad: 'required',
    producto_capacidadvariable: 'required',
    producto_estatus: 1,
    producto_idProductoFactura: 'required',
    producto_cuentaContable: 'required',
    producto_idConceptosProductosSAT: 'required',
    producto_idTipoServicio: 'required'
}

export default function Productos() {
    const [facturaciones, setFacturaciones] = useState([]);
    const [conceptos, setConceptos] = useState([]);
    const [action, setAction] = useState("create");
    const [data, setData] = useState(productData);
    const [productos, setProductos] = useState();
    const [servicio, setServicio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [medidas, setMedidas] = useState([]);
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

    const getServicios = async () => {
        const responseE = await fetch(route("tipos-servicios.index"));
        const dataE = await responseE.json();
        setServicio(dataE);
    };

    const getProductos = async () => {
        const responseE = await fetch(route("productos.index"));
        const dataE = await responseE.json();
        setProductos(dataE);
        console.log(dataE);
    };
    const getMedidas = async () => {
        const response = await fetch(route("unidades-de-medida.index"));
        const data = await response.json();
        setMedidas(data);
    };

    const getConceptos = async () => {
        const response = await fetch(route("conceptos-productos.disponibles"));
        const data = await response.json();
        setConceptos(data);
    };

    const getFacturaciones = async () => {
        const response = await fetch(route("facturacione.index"));
        const data = await response.json();
        setFacturaciones(data);
    };

    useEffect(() => {
        if (!productos) {
            getProductos();
            getMedidas();
            getConceptos();
            getFacturaciones();
            getServicios();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [productos]);

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(productValidations, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("productos.store") : route("productos.update", data.producto_idProducto);
        const method = action === "create" ? "POST" : "PUT";

        await request(ruta, method, data).then(() => {
            getProductos();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setErrors({});
        setOpen(!open);
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {productos && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData(productData);
                            setOpen(!open);
                        }}
                        data={productos}
                        columns={[
                            { header: "Nombre", accessor: "producto_nombre" },
                            { header: "Capacidad", cell: ({ item }) => Number(item.producto_capacidad).toFixed(4)},
                            { header: "Unidades", accessor: "Unidades", cell: (eprops) => (<>{eprops.item.unidades.unidadMedida_nombre}</>) },
                            { header: "Activo", cell: (eprops) => (<>{eprops.item.producto_estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>), },
                            { header: "Variable", cell: (eprops) => (<>{eprops.item.producto_capacidadvariable == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>), },

                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setOpen(!open);
                                },
                            },
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'producto',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    style: 'grid grid-cols-2 gap-x-4',
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        type: "text",
                        input: true,
                        fieldKey: 'producto_nombre',
                        value: data.producto_nombre,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                producto_nombre: e.target.value,
                            }),
                    },
                    {
                        label: "Capacidad",
                        type: "decimal",
                        input: true,
                        fieldKey: 'producto_capacidad',
                        value: data.producto_capacidad,
                        onChangeFunc: (e) => {
                            const input = e.target.value;
                            const regex = /^[0-9\b]+$/; // Expresión regular para validar números
                            if (input === "" || regex.test(input)) {
                                setData({
                                    ...data,
                                    producto_capacidad: input,
                                });
                            }
                        },
                    },
                    {
                        label: "Cuenta contable",
                        type: "number",
                        input: true,
                        fieldKey: 'producto_cuentaContable',
                        value: data.producto_cuentaContable,
                        onChangeFunc: (e) => {
                            const input = e.target.value;
                            const regex = /^[0-9\b]+$/; // Expresión regular para validar números
                            if (input === "" || regex.test(input)) {
                                setData({
                                    ...data,
                                    producto_cuentaContable: input,
                                });
                            }
                        },
                    },
                    {
                        label: "Unidades de Medida",
                        select: true,
                        options: medidas,
                        fieldKey: 'producto_idUnidadMedida',
                        value: data.producto_idUnidadMedida || "",
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                producto_idUnidadMedida: newValue,
                            }),
                        data: "unidadMedida_nombre",
                        valueKey: "unidadMedida_idUnidadMedida",
                    },
                    {
                        label: "Concepto Producto",
                        select: true,
                        options: conceptos,
                        fieldKey: 'producto_idConceptosProductosSAT',
                        value: data.producto_idConceptosProductosSAT || "",
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                producto_idConceptosProductosSAT: newValue,
                            }),
                        data: "conceptosProductosSAT_descripcion",
                        valueKey: "conceptosProductosSAT_id",
                    },
                    {
                        label: "Tipo de servicio",
                        select: true,
                        options: servicio,
                        fieldKey: 'producto_idTipoServicio',
                        value: data.producto_idTipoServicio || "",
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                producto_idTipoServicio: newValue,
                            }),
                        data: "tipoServicio_descripcion",
                        valueKey: "tipoServicio_idTipoServicio",
                    },
                    {
                        label: "Perfil de facturacion",
                        select: true,
                        options: facturaciones,
                        fieldKey: 'producto_idProductoFactura',
                        style: 'justify-center col-span-2',
                        value: data.producto_idProductoFactura || "",
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                producto_idProductoFactura: newValue,
                            }),
                        data: "productoFactura_descripcion",
                        valueKey: "productoFactura_idProductoFactura",
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'producto_estatus',
                        checked: data.producto_estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-6',
                        onChangeFunc: (e) => setData({
                            ...data,
                            producto_estatus: e.target.checked ? "1" : "0",
                        })
                    },
                    {
                        label: "Capacidad variable",
                        check: true,
                        fieldKey: 'producto_capacidadvariable',
                        checked: data.producto_capacidadvariable,
                        labelPlacement: 'end',
                        style: 'justify-center mt-6',
                        onChangeFunc: (e) => setData({
                            ...data,
                            producto_capacidadvariable: e.target.checked ? "1" : "0",
                        })
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

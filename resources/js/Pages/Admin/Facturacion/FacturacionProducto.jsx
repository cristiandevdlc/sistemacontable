import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';

const facturaciónData = {
    productoFactura_codigo: "",
    productoFactura_descripcion: "",
    productoFactura_idUnidadMedida: "",
    productoFactura_idProductoFactura: "",
    productoFactura_idImpuesto:""
}
const facturaciónValidations = {
    productoFactura_codigo: "required",
    productoFactura_descripcion: "required",
    productoFactura_idUnidadMedida: "required",
}

export default function FacturacionProducto() {
    const [facturaciones, setFacturaciones] = useState();
    const [data, setData] = useState(facturaciónData);
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [impuestos,SetImpuestos] = useState([])


    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };



      const getimpuestos = async () => {
        const responseE = await fetch(route("impuesto"));
        const dataE = await responseE.json();
        console.log("impuestos",dataE)
        SetImpuestos(dataE);
    };


    const getUmas = async () => {
        const response = await fetch(route("unidades-de-medida.index"));
        const data = await response.json();
        setUsuarios(data);
    };

    const getFacturaciones = async () => {
        const responseE = await fetch(route("facturacione.index"));
        const dataE = await responseE.json();
        setFacturaciones(dataE);
    };

    useEffect(() => {
        document.title = 'Intergas | Facturacion producto';

        if (!facturaciones) {
            getFacturaciones();
            getUmas();
            getMenuName();
            getimpuestos();
        } else {
            setLoading(false)
        }
    }, [facturaciones])

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(facturaciónValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("facturacione.store") : route("facturacione.update", data.productoFactura_idProductoFactura);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getFacturaciones();
            setOpen(!open);
        });
    };
    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {(facturaciones && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(facturaciónData)
                            handleModal()
                        }}
                        data={facturaciones}
                        columns={[
                            { header: 'Código', accessor: 'productoFactura_codigo' },
                            { header: 'Descripcion', accessor: 'productoFactura_descripcion' },
                            { header: 'Unidad de medida', accessor: 'usuarios', cell: eprops => <span>{eprops.item.unidades?.unidadMedida_nombre}</span> },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setOpen(true);
                                },
                            }
                        ]}
                    />
                </div>
            }

            <DialogComp
                dialogProps={{
                    model: 'facturación',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Codigo",
                        input: true,
                        type: 'text',
                        maxLength:"15",
                        fieldKey: 'productoFactura_codigo',
                        value: data.productoFactura_codigo || '',
                        onChangeFunc: (e) => { setData({ ...data, productoFactura_codigo: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'productoFactura_descripcion',
                        value: data.productoFactura_descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, productoFactura_descripcion: e.target.value }) }
                    },
                    {
                        select:true,
                        label: "Unidad de Medida",
                        options: usuarios,
                        value: data.productoFactura_idUnidadMedida || '',
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                productoFactura_idUnidadMedida: newValue,
                            }),
                        fieldKey: "productoFactura_idUnidadMedida",
                        data: "unidadMedida_nombre",
                        valueKey: "unidadMedida_idUnidadMedida",
                    },
                    {
                        select:true,
                        label: "IVA%",
                        options: impuestos,
                        value: data.productoFactura_idImpuesto || '',
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                productoFactura_idImpuesto: newValue,
                            }),
                        fieldKey: "catalogoImpuestoSAT_id",
                        data: "catalogoImpuestoSAT_descripcion",
                        valueKey: "catalogoImpuestoSAT_id",
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}

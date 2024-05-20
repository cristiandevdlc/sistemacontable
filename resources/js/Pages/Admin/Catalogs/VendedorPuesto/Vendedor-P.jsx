import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useState,useEffect } from "react";

const vpData ={
    idtiposervicio: '',
    idpuesto: '',
}
const vpValidations ={
    idtiposervicio: 'required',
    idpuesto: 'required',
}

export default function VendedorPuesto() {
    const [vendedorID, setvendedorId] = useState(0);
    const [action, setAction] = useState(["edit"]);
    const [loading, setLoading] = useState(true);
    const [servicios, setServicios] = useState();
    const [vendedor, setvendedor] = useState();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(vpData);
    const [puestos, setPuesto] = useState();
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

    const fetchdata = async () => {
        getVendedor();
        getPuestos();
        getServicio();
    };
    const getVendedor = async () => {
        const responseE = await fetch(route("vendedor-puestos.index"));
        const dataE = await responseE.json();
        setvendedor(dataE);
    };

    const getPuestos = async () => {
        const responseE = await fetch(route("puesto.index"));
        const dataE = await responseE.json();
        setPuesto(dataE);
    };

    const getServicio = async () => {
        const responseE = await fetch(route("tipos-servicios.index"));
        const dataE = await responseE.json();
        setServicios(dataE);
    };

    const submit = async (e) => {
        e.preventDefault();
        
        setErrors({})
        const result = validateInputs(vpValidations, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("vendedor-puestos.store") : route("vendedor-puestos.update", vendedorID);
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

    useEffect(() => {
        if (!vendedor) {
            getVendedor();
            getPuestos();
            getServicio();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [vendedor]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {vendedor && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData(vpData);
                            setOpen(!open);
                        }}
                        data={vendedor}
                        columns={[
                            {
                                header: "Tipo Servicio",
                                accessor: "servicio",
                                cell: (eprops) => (<span>{eprops.item.servicio.tipoServicio_descripcion}</span>),
                            },
                            {
                                header: "Puesto",
                                accessor: "idpuesto",
                                cell: (eprops) => (<span>{eprops.item.puesto.nombre}</span>),
                            },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setvendedorId(eprops.item.idvendedores);
                                    setOpen(!open);
                                },
                            },
                        ]}
                    />
                </div>
            )}
            <DialogComp
                dialogProps={{
                    model: 'vendedor puesto',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        select: true,
                        label: "Puesto",
                        options: puestos,
                        value: data.idpuesto || '',
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                idpuesto: newValue,
                            })
                        ,
                        data: "nombre",
                        valueKey: "IdPuesto",
                        fieldKey: 'idpuesto',
                    },
                    {
                        select: true,
                        label: "Tipo de servicio",
                        options: servicios,
                        value: data.idtiposervicio || '',
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                idtiposervicio: newValue,
                            })
                        ,
                        data: "tipoServicio_descripcion",
                        valueKey: "tipoServicio_idTipoServicio",
                        fieldKey: 'idtiposervicio',
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}

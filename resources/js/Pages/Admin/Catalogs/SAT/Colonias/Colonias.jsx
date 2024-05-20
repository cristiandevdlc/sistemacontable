import TextInput from '@/components/TextInput'
import { useForm } from '@inertiajs/react'
import { Tooltip } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import request from '@/utils';
import { DataGrid } from 'devextreme-react'
import DataSource from 'devextreme/data/data_source'
import ArrayStore from 'devextreme/data/array_store'
import { Column, Editing } from 'devextreme-react/data-grid'
import DialogComp from '@/components/DialogComp'
import { validateInputs } from '@/utils';
import { exportExcel } from '@/core/CreateExcel'
import selectOptImg from '../../../../../../png/camion.png'
import LoadingDiv from '@/components/LoadingDiv'
import Datatable from '@/components/Datatable'
// import ArchiveIcon from '@mui/icons-material/Archive';
import { ButtonComp } from '@/components/ButtonComp'
import { Archive } from '@mui/icons-material'

export default function Colonias() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [colonias, setColonias] = useState([]);
    const [estados, setEstados] = useState();
    const [selectedestado, setSelectedestado] = useState([]);
    const [selectedestadomodal, setSelectedestadomodal] = useState([]);
    const [selectedMunicipioModal, setSelectedMunicipioModal] = useState('');
    const [selectedMunicipio, setSelectedMunicipio] = useState('');
    const [coloniasID, setColoniasID] = useState([""]);
    const [errors, setErrors] = useState({});
    const [selectedItemKeys, setSelectedItemKeys] = useState([]);

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };


      

    const excelColumns = [
        { header: "Colonia", accessor: "Colonia_Nombre", type: "text" },
        { header: "CP", accessor: "c_CodigoPostal", type: "number" }
    ]

    const { data, setData } = useForm({
        Colonia_Nombre: "",
        c_CodigoPostal: "",
        c_CodigoPostalModal: "",
        idEstado: 0,
        Colonia_Id: "",
        Colonia_IdMunicipio: 0
    });

    const ColoniasValidations = {
        idEstado: 'required',
        Colonia_Nombre: 'required',
        c_CodigoPostalModal: 'required',
        Colonia_IdMunicipio: 'required'
    }

    const handleMunicipio = async (id_municipio) => {
        setData({
            ...data,
            Colonia_IdMunicipio: id_municipio,
        });
    };

    const handleEstado = async (idEstado) => {
        setData({
            ...data,
            idEstado: idEstado,
        });
        // aqui se agarra el id del estado y le da el estado del id a setSelectedestadomodal

        // aqui se hace la peticion el cual se le manda el id del estado y nos regresa municipios
        try {
            const requestBody = { id: idEstado };
            const requestData = await request(route("buscarPorEstado"), 'POST', requestBody)
            setSelectedMunicipioModal(requestData);
        } catch (error) {
            console.error("Error fetching municipios:", error);
        }
    };

    //aqui se guarda el codigo postal que se esta ingresando en el input para poder setear 
    const handleCodigoPostalChange = async (event) => {
        const cp = event.target.value;
        setData({
            ...data,
            c_CodigoPostal: cp,
        });
        if (cp.length == 5) {
            setLoadingInfo(true)
            await GetCodigoPostal(cp).then(() => setLoadingInfo(false));
        }
    };

    //AQUI SE MUESTRA LOS DATOS YA DEL FILTRO DONDE SE COMPARA EL CP DE LA API Y COLONIA DE LA API
    const GetCodigoPostal = async (cp) => {
        if (cp.length === 5) {
            const requestBody = { codigo_postal: cp };
            const data = await request(route("getApiBaseDatosColonias"), 'POST', requestBody, { enabled: true, error: { message: 'Código postal no encontrado', type: 'error' } });
            setSelectedMunicipio(data[0].descripcionMunicipio);
            setSelectedestado(data[0].descripcionEstado); // Limpiar el estado seleccionado
            setColonias(data); // Actualizar las colonias
        } else {
            setSelectedestado(''); // Limpiar el estado seleccionado
            setSelectedMunicipio(''); // Limpiar el estado seleccionado
            setColonias([]); // Limpiar los datos si el cp no tiene 5 dígitos
        }
    };

    const fetchdata = async () => {
        GetEstados();
        GetEstadosModal();
    };

    //se obtienen los datos de la api//
    const GetEstados = async () => {
        const response = await fetch(route("estadosApi"));
        const data = await response.json();
        setEstados(data);
    };

    // se obtienen los datos de la base de datos esto es para el modal al momento de insertar
    const GetEstadosModal = async () => {
        const response = await fetch(route("sat/estados.index"));
        const data = await response.json();
        setSelectedestadomodal(data);
    };

    const dataSource = new DataSource({
        store: new ArrayStore({
            data: Array.isArray(colonias) ? colonias : [],
            // key: 'ASENTA_ID',
        }),
    });

    const submit = async (e) => {
        const result = validateInputs(ColoniasValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta =
            action === "create"
                ? route("colonias.store")
                : route("colonias.update", coloniasID);
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

    const updateColonia = async (e) => {
        if (e.newData) {
            if (!regex.email.test(e.newData?.correoCliente_correo)) {
                noty('Correo no valido', 'error')
                return
            }

            const newData = { ...e.oldData, ...e.newData, correoCliente_idCliente: data.cliente_idCliente }
            const ruta = newData.correoCliente_idCorreoCliente ? route('correos-clientes.update', newData.correoCliente_idCorreoCliente) : route('correos-clientes.store');
            const metodo = newData.correoCliente_idCorreoCliente ? 'PUT' : 'POST';
            await request(ruta, metodo, newData).then(() => {
                fetchClientEmails()
            })
        }
    };

    useEffect(() => {
        getMenuName();
        fetchdata()
        setLoading(false);
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <div className='flex place-content-center h-[90vh] w-full'>
                    <LoadingDiv />
                </div>
            }
            {!loading &&
                <div className='flex gap-6 sm:flex-col md:flex-row'>
                    <div className='flex flex-col min-w-[30vh] gap-4 pt-4'>
                        <div className='border-2 w-full shadow-md px-4 pb-4 rounded-xl'>
                            <TextInput
                                label="Codigo Postal"
                                id="Codigo_Postal"
                                type="text"
                                name="Codigo_Postal"
                                value={data.c_CodigoPostal}
                                className="block w-full mt-1 texts"
                                autoComplete="Codigo_Postal"
                                isFocused={true}
                                maxLength={5}
                                onChange={handleCodigoPostalChange} // Aquí está el cambio
                            />
                            <TextInput
                                label="Estado"
                                id="Estado"
                                type="text"
                                name="Estado"
                                value={selectedestado}
                                className="block w-full mt-1 texts"
                                autoComplete="Estado"
                                isFocused={false}
                                readOnly // Agregar este atributo para hacerlo de solo lectura
                                disabled
                                onChange={setSelectedestado} // Aquí está el cambio
                            />
                            <TextInput
                                label="Municipio"
                                id="Municipio"
                                type="text"
                                name="Municipio"
                                value={selectedMunicipio}
                                className="block w-full mt-1 texts"
                                autoComplete="Municipio"
                                isFocused={false}
                                readOnly // Agregar este atributo para hacerlo de solo lectura
                                disabled
                                onChange={setSelectedMunicipio} // Aquí está el cambio
                            />
                            <ButtonComp
                                icon={<Archive />}
                                onClick={() => exportExcel(colonias, excelColumns, `Colonias CP ${data.c_CodigoPostal}`)}
                                label='Descargar tabla'
                                color={colonias.length > 0 ? '#2e7d32' : ''}
                                disabled={!(colonias.length > 0)}
                            />
                        </div>
                    </div>
                    {loadingInfo ? (
                        <div className='flex place-content-center h-[90vh] w-[100%]'>
                            <LoadingDiv />
                        </div>
                    ) : (
                        <div className='sm:h-[97%] md:h-[90%]'>
                            <Datatable
                                add={() => {
                                    setAction("create");
                                    setOpen(!open);
                                }}
                                virtual={true}
                                data={colonias}
                                columns={[
                                    { header: 'Colonia', accessor: 'Colonia_Nombre' },
                                    { header: 'Codigo postal', accessor: 'c_CodigoPostal' },
                                ]}
                            />
                            <DialogComp
                                dialogProps={{
                                    model: 'Colonia',
                                    width: 'sm',
                                    openState: open,
                                    actionState: action,
                                    openStateHandler: () => handleCloseModal(),
                                    onSubmitState: () => submit
                                }}
                                fields={[
                                    {
                                        select: true,
                                        label: "Estado",
                                        options: selectedestadomodal,
                                        value: data.idEstado || "",
                                        data: "descripcionEstado",
                                        valueKey: "idEstado",
                                        onChangeFunc: handleEstado
                                    },
                                    {
                                        select: true,
                                        label: "Municipio",
                                        options: selectedMunicipioModal,
                                        value: data.Colonia_IdMunicipio || "",
                                        disabled: data.idEstado === 0 || data.idEstado === '' ? true : false,
                                        data: "descripcionMunicipio",
                                        valueKey: "idMunicipio",
                                        onChangeFunc: handleMunicipio
                                    },
                                    {
                                        label: "Colonia",
                                        input: true,
                                        type: 'text',
                                        fieldKey: 'Colonia_Nombre',
                                        value: data.Colonia_Nombre || '',
                                        onChangeFunc: (e) => { setData({ ...data, Colonia_Nombre: e.target.value }) }
                                    },
                                    {
                                        label: "Codigo Postal",
                                        input: true,
                                        type: 'text',
                                        fieldKey: 'c_CodigoPostalModal',
                                        value: data.c_CodigoPostalModal || '',
                                        onChangeFunc: (e) => { setData({ ...data, c_CodigoPostalModal: e.target.value }) }
                                    },
                                ]}
                                errors={errors}
                            />
                        </div>
                    )}
                </div>
            }
        </div>
    );
}

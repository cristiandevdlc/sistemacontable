import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import SelectComp from '@/components/SelectComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import TextInput from '@/components/TextInput';
import request from '@/utils';

export default function ClienteOtraEmpresa() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [allClients, setAllClients] = useState([])
    const [allCompanies, setAllCompanies] = useState([])
    const [allOtherCompanyClient, setAllOtherCompanyClient] = useState()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        nombreCliente: '',
        clienteOtraEmpresa_idCliente: '',
        clienteOtraEmpresa_idEmpresa: '',
        clienteOtraEmpresa_fecha: '',
    })
    const [selectedClients, setSelectedClients] = useState([])
    const tableAllClients = useRef()
    const dataTableAllClients = useRef()

    const fetchClients = async () => {
        try {
            const response = await request(route('clientes.index'))
            setAllClients(response)
        } catch (error) {
            console.error('Error al obtener los datos de servicios:', error)
        }
    }

    const fetchCompanies = async () => {
        try {
            const response = await request(route('empresas.index'))
            setAllCompanies(response)
        } catch (error) {
            console.error('Error al obtener los datos de servicios:', error)
        }
    }

    const fetchOtherCompanyClients = async () => {
        try {
            const response = await request(route('cliente-otra-empresa.index'))
            setAllOtherCompanyClient(response)
        } catch (error) {
            console.error('Error al obtener los datos de rutas:', error);
        }
    }

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        if (data.cliente_id === "") {
            newErrors.cliente_id = "El nombre es requerido";
            isValid = false;
        }
        if (data.empresa_id === 0) {
            newErrors.empresa_id = "Debe seleccionar una empresa";
            isValid = false;
        }
        if (data.fecha === "") {
            newErrors.fecha = "La fecha es requerida";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const submitRecord = async () => {
        try {
            if (action === 'create') {
                const response = await request(route('cliente-otra-empresa.store'), 'POST', data)
            }
            fetchOtherCompanyClients()
            setOpen(false)
        } catch (error) {
            fetchOtherCompanyClients()
            setOpen(false)
            console.error('Error al obtener los datos de rutas:', error);
        }
    }

    useEffect(() => {
        if (!allOtherCompanyClient) {
            fetchOtherCompanyClients()
            fetchCompanies()
            fetchClients()
        } else {
            setLoading(false)
        }
    }, [allOtherCompanyClient])

    const selectClient = ({ selectedRowKeys, selectedRowsData }) => {
        console.log("tabla", selectedRowsData)
        dataTableAllClients.current = selectedRowsData
        setSelectedClients(selectedRowKeys)
        setData(prev => ({ ...prev, nombreCliente: selectedRowsData[0].cliente_nombrecomercial, clienteOtraEmpresa_idCliente: selectedRowKeys[0] }))
    }

    return (
        <>
            {loading && <LoadingDiv />}
            {!loading && (
                <div>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData({
                                clienteOtraEmpresa_idCliente: "",
                                clienteOtraEmpresa_idEmpresa: "",
                                clienteOtraEmpresa_fecha: "",
                            });
                            setOpen(!open);
                        }}
                        data={allOtherCompanyClient}
                        columns={[
                            { header: "Cliente", accessor: "nombreCliente" },
                            { header: "Empresa", accessor: "nombreEmpresa" },
                            { header: "Fecha", accessor: "clienteOtraEmpresa_fecha" },
                        ]}
                    />
                </div>
            )}
            <Dialog open={open} maxWidth="lg" onClose={() => { setErrors({}); setData({}); setOpen(false) }} >
                <DialogTitle>Trasladar cliente a otra empresa</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-5 gap-x-10 place-content-center">
                        <div className="col-span-2 w-full m-auto">
                            <h5>Selección de empresa</h5>
                            <TextInput
                                label="Cliente"
                                id="clienteOtraEmpresa_idCliente"
                                type="text"
                                name="clienteOtraEmpresa_idCliente"
                                value={data.nombreCliente || ""}
                                autoComplete="username"
                                isFocused={true}
                                disabled={true}
                            />
                            {errors.clienteOtraEmpresa_idCliente && (
                                <span className="text-red-600">
                                    {errors.clienteOtraEmpresa_idCliente}
                                </span>
                            )}
                            <SelectComp
                                label="Empresas"
                                options={allCompanies}
                                value={data.clienteOtraEmpresa_idEmpresa}
                                onChangeFunc={(newValue) => setData(prev => ({ ...prev, clienteOtraEmpresa_idEmpresa: newValue }))}
                                data="empresa_razonComercial"
                                valueKey="empresa_idEmpresa"
                            />
                            <TextInput
                                label="Fecha"
                                id="clienteOtraEmpresa_fecha"
                                type="date"
                                name="clienteOtraEmpresa_fecha"
                                value={data.clienteOtraEmpresa_fecha || ""}
                                onChange={(e) => {
                                    setData({ ...data, clienteOtraEmpresa_fecha: e.target.value });
                                }}
                                max={(new Date(Date.now() + 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="col-span-3">
                            <Datatable
                                tableId="DataGridClientes"//TABLE KEY
                                rowId="cliente_idCliente"//REGUSTRO KEY
                                data={allClients}
                                selection={{ mode: "single" }}
                                virtual={true}
                                selectedData={selectedClients}
                                selectionFunc={selectClient}
                                tableRef={tableAllClients}
                                columns={[
                                    { header: "Cliente", accessor: "cliente_nombrecomercial" }
                                ]}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => { setErrors({}); setOpen(false); }}>Cancelar</Button>
                    <Button color="success" onClick={submitRecord}> Crear</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


import Datatable from '@/components/Datatable'
import request from '@/utils'
import { Chip, Dialog, DialogActions, DialogContent, Tooltip, Button, DialogTitle } from '@mui/material'
import { useEffect, useState } from 'react'
import Asignar from './Modals/Asignar'
import NumerosALetras from './numeroLetra'
import DialogComp from '@/components/DialogComp'
import LoadingDiv from '@/components/LoadingDiv'

const AsignacionTanque = () => {
    const [loading, setLoading] = useState(true)
    const [tableData, setTableData] = useState()
    const [tanks, setTanks] = useState([])
    const [usersToAuth, setUsersToAuth] = useState([])
    const [action, setAction] = useState('assign')
    const [pdfData, setPdfData] = useState(null)
    const [modals, setModals] = useState({
        assign: false,
        unassign: false,
    })
    const [allAssigamentData, setAllAssigamentData] = useState({
        idAsignacionTanque: '',
        fechaAsignacion: '',
        estatus: 1,
        tipo: '',
        idTablaTipo: '',
        fechaDesinstalacion: '',
        idTanque: '',
        idUsuarioAsignacion: '',
        idUsuarioAutorizacion: '',
    })

    const fetchAssignaments = async () => {
        const response = await request(route('asignacion-tanque-por-tipo.index'))
        setTableData(response)
    }
    const fetchTanks = async () => {
        const response = await request(route('tanques.index'))
        setTanks(response)
    }

    const fetchUsersToAuth = async () => {
        const response = await request(route('usuarios.index'))
        setUsersToAuth(response)
    }

    const actionSubmitButton = async () => {
        if (action === 'assign') {
            await request(route('asignacion-tanque-por-tipo.store'), 'POST', allAssigamentData)
            fetchAssignaments()
            setModals({ assign: false, unassign: false })
        } else if (action === 'unassign') {
            await request(route('asignacion-tanque-por-tipo.update', allAssigamentData.idAsignacionTanque), 'PUT', allAssigamentData)
            fetchAssignaments()
            setModals({ assign: false, unassign: false })
        }
    }
    const formatoMexico = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        return number.toString().replace(exp, rep);
    }

    function addZeroes(num) {
        var num = Number(num);
        if (isNaN(num)) {
            return 0;
        }
        if (String(num).split(".").length < 2 || String(num).split(".")[1].length <= 2) {
            num = num.toFixed(2);
        }
        return num;
    }

    const fetchContractInfo = async (neededData) => {
        const response = await request(route('asignacion-tanque-por-tipo-pdf.infoPdf'), 'POST', neededData)
        const valvulas = response.datosTanque.map((item) => {
            return item.valvula.nombre + ' ' + item.fechaInstalacion
        })

        await fetch(route('generate-contrato-de-comodato'), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                empresa: {
                    nombreRepresentanteLegal: response.empresa.empresa_NombreRepresentanteLegal,
                    calle: response.empresa.empresa_calle,
                    numeroExterior: response.empresa.empresa_numeroExterior,
                    colonia: response.empresa.empresa_colonia,
                    codigoPostal: response.empresa.empresa_codigoPostal,
                    ciudad: response.empresa.empresa_ciudad,
                    estado: response.empresa.estado.descripcionEstado,
                    pais: response.empresa.pais.descripcionPais,
                    razonSocial: response.empresa.empresa_razonSocial,
                    razonComercial: response.empresa.empresa_razonComercial,
                    localidad: response.empresa.empresa_localidad,
                },
                datosTanque: {
                    marca: response.datosTanque[0].tanque.marca,
                    cantidad: 1,
                    serie: response.datosTanque[0].tanque.serie,
                    capacidad: formatoMexico(addZeroes(response.datosTanque[0].tanque.capacidad)),
                    valvulas: valvulas,
                    fechaCreacion: response.datosTanque[0].tanque.fecha,
                    precio: formatoMexico(addZeroes(response.datosTanque[0].tanque.precio)),
                    precioLetra: NumerosALetras(response.datosTanque[0].tanque.precio),
                    unidadMedida: response.datosTanque[0].tanque.unidad_medida.unidadMedida_nombre,
                    tipoTanque: response.datosTanque[0].tanque.tipo_tanque.nombre,
                },
                clienteDireccion: {
                    fiscal: {
                        calle: response.direccionFiscalCliente.cliente_calle,
                        ciudad: response.direccionFiscalCliente.cliente_ciudad,
                        colonia: response.direccionFiscalCliente.cliente_colonia,
                        estado: response.direccionFiscalCliente.estado.descripcionEstado,
                        localidad: response.direccionFiscalCliente.cliente_localidad,
                        numeroExterior: response.direccionFiscalCliente.cliente_numeroExterior,
                        codigoPostal: response.direccionFiscalCliente.cliente_codigoPostal,
                        nombreCliente: response.direccionFiscalCliente.cliente_nombrecomercial,
                        giro: response.direccionFiscalCliente.giro.tipoCaptacion_tipo,
                        nombreRepresentanteLegal: response.direccionFiscalCliente.cliente_representanteLegal,
                    },
                    sucursal: {
                        calle: response.direccionClienteSucursal.calle,
                        municipio: response.direccionClienteSucursal.municipio.descripcionMunicipio,
                        colonia: response.direccionClienteSucursal.colonia.Colonia_Nombre,
                        estado: response.direccionClienteSucursal.estado.descripcionEstado,
                        nombreSucursal: response.direccionClienteSucursal.descripcion,
                        numeroExterior: response.direccionClienteSucursal.numeroExterior,
                    }
                },
                datosUsuarios: {
                    usuarioAsigno: response.usuarioAsigno,
                    usuarioAutoriza: response.usuarioAutoriza
                },
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error("Error al generar el archivo PDF");
                }
            })
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Contrato.pdf";
                link.click();
                URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.log(error);
            });
        setPdfData({
            empresa: {
            },
            datosTanque: {
                marca: response.datosTanque[0].tanque.marca,
                cantidad: 1,
                serie: response.datosTanque[0].tanque.serie,
                capacidad: response.datosTanque[0].tanque.capacidad,
                valvulas: valvulas,
                precio: formatoMexico(addZeroes(response.datosTanque[0].tanque.precio)),
                precioLetra: NumerosALetras(response.datosTanque[0].tanque.precio),
                unidadMedida: response.datosTanque[0].tanque.unidad_medida.unidadMedida_nombre,
                tipoTanque: response.datosTanque[0].tanque.tipo_tanque.nombre,
            },
            direccionSucursal: {
                /*  calle: response.direccionClienteSucursal.cliente_calle,
                 ciudad: response.direccionClienteSucursal.cliente_ciudad,
                 colonia: response.direccionClienteSucursal.cliente_colonia,
                 estado: response.direccionClienteSucursal.cliente_estado,
                 localidad: response.direccionClienteSucursal.cliente_localidad,
                 numeroExterior: response.direccionClienteSucursal.cliente_numeroExterior,
                 nombreCliente: response.direccionClienteSucursal.cliente_nombrecomercial,
                 nombreRepresentanteLegal: response.direccionClienteSucursal.cliente_representanteLegal, */
            },
            clienteDireccion: {
                fiscal: {
                    calle: response.direccionFiscalCliente.cliente_calle,
                    ciudad: response.direccionFiscalCliente.cliente_ciudad,
                    colonia: response.direccionFiscalCliente.cliente_colonia,
                    estado: response.direccionFiscalCliente.estado.descripcionEstado,
                    giro: response.direccionFiscalCliente.giro.tipopCaptacion_tipo,
                    codigoPostal: response.direccionFiscalCliente.cliente_codigoPostal,
                    localidad: response.direccionFiscalCliente.cliente_localidad,
                    numeroExterior: response.direccionFiscalCliente.cliente_numeroExterior,
                    nombreCliente: response.direccionFiscalCliente.cliente_nombrecomercial,
                    nombreRepresentanteLegal: response.direccionFiscalCliente.cliente_representanteLegal,
                },
                sucursal: {
                    calle: response.direccionClienteSucursal.calle,
                    municipio: response.direccionClienteSucursal.municipio.descripcionMunicipio,
                    colonia: response.direccionClienteSucursal.colonia.Colonia_nombre,
                    estado: response.direccionClienteSucursal.estado.descripcionEstado,
                    nombreSucursal: response.direccionClienteSucursal.descripcion,
                    numeroExterior: response.direccionClienteSucursal.numeroExterior,
                }
            },
            datosUsuarios: {
                usuarioAsigno: response.usuarioAsigno,
                usuarioAutoriza: response.usuarioAutoriza
            },
        })
    }

    const currentDate = () => {
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;

    }

    useEffect(() => {
        fetchTanks()
        fetchAssignaments()
        fetchUsersToAuth()
    }, [])

    useEffect(() => {
        if (tableData) setLoading(false)
    }, [tableData])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        searcher={false}
                        add={() => {
                            setAction('assign')
                            setModals(prev => ({ ...prev, assign: true }))
                            setAllAssigamentData({ idAsignacionTanque: '', fechaAsignacion: currentDate(), estatus: 1, tipo: '', idTablaTipo: '', fechaDesinstalacion: '', idTanque: '', idUsuarioAsignacion: '', idUsuarioAutorizacion: '', })
                        }}
                        data={tableData}
                        virtual={true}
                        columns={[
                            { width: '10%', header: "ID Tanque", accessor: "idTanque" },
                            { width: '17%', header: "No. Serie Tanque", accessor: "tanque.serie" },
                            { width: '15%', header: "Nombre del Asignado", accessor: "datosTipo.nombreTipo" },
                            { width: '10%', header: "Tanque Marca", accessor: "tanque.marca" },
                            { width: '12%', header: "Tanque Capacidad", accessor: "tanque.capacidad" },
                            { width: '10%', header: "Tipo Asignacion", accessor: "tipo" },
                            { width: '10%', header: "Fecha Asignacion", accessor: "fechaAsignacion", cell: eprops => (new Date(eprops.item.fechaAsignacion)).formatMXNoTime() },
                            {
                                width: '8%',
                                header: "Activo",
                                accessor: "estatus",
                                cell: (eprops) => eprops.item.estatus === "1" ? (<Chip label="SI" color="success" size="small" />) : (<Chip label="NO" color="error" size="small" />),
                            },
                            {
                                width: '8%',
                                header: "Acciones",
                                cell: ({ item }) => (
                                    <div className='space-x-4'>
                                        {item.estatus === "1" && <Tooltip title="Cambiar asignación">
                                            <button
                                                className="material-icons"
                                                onClick={() => {
                                                    setAllAssigamentData({
                                                        idAsignacionTanque: item.idAsignacionTanque,
                                                        fechaAsignacion: item.fechaAsignacion,
                                                        estatus: 1,
                                                        tipo: item.tipo,
                                                        idTablaTipo: item.idTablaTipo,
                                                        fechaDesinstalacion: item.fechaDesinstalacion,
                                                        idTanque: item.idTanque,
                                                        idUsuarioAsignacion: item.idUsuarioAsignacion,
                                                        idUsuarioAutorizacion: item.idUsuarioAutorizacion,
                                                    })
                                                    setAction('unassign')
                                                    setModals(prev => ({ ...prev, unassign: true }))
                                                }}>
                                                event_busy
                                            </button>
                                        </Tooltip>}
                                        {
                                            item.tipo === 'Cliente' && (
                                                <Tooltip title="Descargar Contrato">
                                                    <button
                                                        className="material-icons"
                                                        onClick={() => fetchContractInfo(item)}>
                                                        assign
                                                    </button>
                                                </Tooltip>
                                            )
                                        }
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            }
            <Dialog
                open={modals.assign}
                maxWidth="xl"
                fullWidth={true}
                onClose={() => setModals({ assign: false, unassign: false })}>
                <DialogTitle>Asignacion de tanques</DialogTitle>
                <DialogContent style={{ backgroundColor: 'white' }}>
                    <Asignar tanks={tanks} usersToAuth={usersToAuth} allAssigamentData={allAssigamentData} setAllAssigamentData={setAllAssigamentData} />
                </DialogContent>
                <DialogActions className={"mt-0 "} style={{ backgroundColor: 'white' }}>
                    <Button color="error" onClick={() => setModals({ assign: false, unassign: false })}>
                        Cancelar
                    </Button>
                    <Button className="!bg-excel-color" onClick={() => actionSubmitButton(action)}>
                        Asignar
                    </Button>
                </DialogActions>
            </Dialog>
            <DialogComp
                dialogProps={{
                    model: 'Fecha de desinstalación',
                    width: 'xs',
                    customTitle: true,
                    openState: modals.unassign,
                    actionState: modals.unassign,
                    openStateHandler: () => setModals({ ...modals, unassign: false }),
                    onSubmitState: () => actionSubmitButton(action),
                    customAction: () => (
                        <>
                            <Button color="error" onClick={() => setModals({ assign: false, unassign: false })}>Cancelar</Button>
                            <Button color={action === 'assign' ? 'success' : 'primary'} onClick={() => actionSubmitButton(action)}>Desasignar</Button>
                        </>
                    )
                }}
                fields={[
                    {
                        input: true,
                        type: 'date',
                        value: allAssigamentData.fechaDesinstalacion,
                        onChangeFunc: (e) => setAllAssigamentData({ ...allAssigamentData, fechaDesinstalacion: e.target.value })
                    }
                ]}
            />
        </div>
    )
}

export default AsignacionTanque
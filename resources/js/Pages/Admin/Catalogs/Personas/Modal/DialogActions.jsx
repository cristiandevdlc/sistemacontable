import { Dialog, DialogContent, DialogTitle, Divider, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { useState } from 'react'
import personData, { IntStateDialogPerson, personFields, personValidations } from '../IntPersona'
import request, { requestMultipart, fileDownloader, leftArrow, validateInputs, noty, firstObj } from '@/utils';
import { useEffect } from 'react';
import DocumentacionEntregada from './DocumentacionEntregada';
import CrearUsuario from './CrearUsuario';
import PersonaForm from './PersonaForm';

const dialogMenus = {
    mainMenu: 0,
    persona: 1,
    gafete: 2,
    contrato: 3,
    constancia: 4,
    documentos: 5,
    usuario: 6
}

const buttonColors = {
    primary: 'order-button',
    disabled: 'asignar-button-grey',
    success: 'asignar-button-green',
}

const buttonNumber = {
    one: 560,
    two: 200,
    three: 200,
    four: 135,
    five: 94,
    six: 70,
}

const DialogActions = ({ open = false, dialogHandler = () => { }, data = personData, docsList = [], action, setData = () => { }, getPersonas = () => { } }) => {
    const [activeMenu, setActiveMenu] = useState(dialogMenus.mainMenu);
    const [states, setStates] = useState(IntStateDialogPerson);
    const [employeeDocs, setEmployeeDocs] = useState()
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [fs, setFs] = useState(true);
    const [dataSelects, setDataSelects] = useState({
        municipios: [],
        colonias: [],
        estados: [],
        departamentos: [],
        puestos: [],
        zonas: [],
        cedis: [],
        centros: [],
        periodicidad: []
    });



    const menuHandler = (_menu) => {
        if (_menu === dialogMenus.persona || _menu === dialogMenus.documentos) {
            setActiveMenu(_menu)
            setStates({ ...states, loading: true, largeDialog: false })
        } else if (_menu === dialogMenus.mainMenu) {
            setActiveMenu(_menu)
            setStates({ ...states, loading: false, largeDialog: false, showForm: false, title: "Detalles" })
        } else {
            setActiveMenu(_menu)
            setStates({ ...states, loading: true, largeDialog: false })
        }
    }

    const getCities = async (dataS) => {
        if (data.IdEstado) {
            const municipioResponse = await request(route("municipio.byEstado", data.IdEstado), 'GET');
            dataS.municipios = municipioResponse
            return dataS;
        }
    }

    const GetColonias = async (dataS) => {
        if (data.IdMunicipio) {
            const coloniasResponse = await request(route("colonia.byMunicipio", data.IdMunicipio), 'GET');
            dataS.colonias = coloniasResponse
            return dataS;
        }
    };

    const getInputsData = async () => {
        if (activeStep == 0 && !open) {
            if (dataSelects.estados.length === 0) {
                setDataSelects({
                    ...dataSelects,
                    estados: await request(route("sat/estados.index")),
                })
            }
        }
        if (activeStep == 0 && open) {
            if (dataSelects.departamentos.length === 0 ||
                dataSelects.puestos.length === 0 ||
                dataSelects.zonas.length === 0 ||
                dataSelects.cedis.length === 0 ||
                dataSelects.centros.length === 0 ||
                dataSelects.periodicidad.length === 0) {
                setDataSelects({
                    ...dataSelects,
                    departamentos: await request(route("departamento.index")),
                    puestos: await request(route("puesto.index")),
                    zonas: await request(route("zonas.index")),
                    cedis: await request(route("cedis.index")),
                    centros: await request(route("empresas.index")),
                    periodicidad: await request(route("periodicidad-activos")),
                })
            }

        }
    }

    const getEmployeeDocs = async () => {
        const response = await request(route('documentacion-de-empleado', data.IdPersona))
        setEmployeeDocs(response)
        setStates({ ...states, loading: false, showForm: true, title: "Documentos entregados" })
    }

    const submitPersona = async () => {
        setErrors({})
        const result = validateInputs(personValidations, data, personFields)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("personas.store") : route("personas.update", data.IdPersona);
        const method = "POST";
        const formData = new FormData();
        for (const key in data) formData.append(key, data[key] ?? null);
        if (action !== "create") formData.append('_method', 'PUT')
        const res = await requestMultipart(ruta, method, formData)
        if (res.status) {
            setActiveStep(0);
            getPersonas();
            setFs(true)
            setErrors({})
            dialogHandler()
            // setOpen(!open);
        }
        !res.status && noty(firstObj(res.messages), 'error')
    };

    function generarGafete() {
        const onStartDownload = () => {
            setStates({ ...states, loading: false, largeDialog: false })
        };
        const req = {
            Nombres: data.Nombres,
            Apellidomat: data.ApeMat,
            Apellidopat: data.ApePat,
            IdPersona: data.IdPersona,
            Tel1: "555-1234",
            puesto: data.puestos.nombre,
            departamento: data.departamento.nombre,
            PathFotoEmpleado: data.PathFotoEmpleado,
        };
        fileDownloader(route("generar-gafete"), 'POST', req, `Gafete ${Date.now()}`, onStartDownload)
    }

    function generarContrato() {
        const onStartDownload = () => {
            setStates({ ...states, loading: false, largeDialog: false })
        };

        const req = {
            Nombres: `${data.Nombres} ${data.ApePat} ${data.ApeMat}`,
            apellidos: data.ApeMat,
            empresa: "EMPRESA 1",
            licenciado: "licenciado",
            civil: data.EstadoCivil,
            domicilioempresa: "Domicilio de la empresa",
            domicilio: data.calle,
            puesto: data.puestos.nombre,
            salario: data.SalarioDiario,
            patron: "JEFE DE JEFES",
            dias: "9",
        };

        fileDownloader(route("generar-contrato"), 'POST', req, `Contrato ${Date.now()}`, onStartDownload)
    }

    const generarConstanciaPDF = () => {
        const onStartDownload = () => {
            setStates({ ...states, loading: false, largeDialog: false })
        };

        const req = {
            nombre: data.Nombres,
            apellidomat: data.ApeMat,
            apellidospat: data.ApePat,
            calle: data.Calle,
            nexterior: data.CasaNum,
            colonia: data.colonias.Colonia_Nombre,
            postal: data.CodigoPostal,
            municipio: data.municipio.descripcionMunicipio,
            estado: data.estado.descripcionEstado,
            rfc: data.RFC,
            curp: data.Curp,
            nss: data.NSS,
            umf: "UMF123",
            nacionalidad: data.Nacionalidad,
            telf1: data.Tel2,
            telf2: data.Tel3,
            telfpropio: data.Tel1,
            sexo: data.Sexo,
            nacimiento: data.FechaNacimiento,
            ingreso: data.FechaIngreso,
            civil: data.EstadoCivil,
            departamento: data.departamento.nombre,
            puesto: data.puestos.nombre,
            zona: data.zona.zona_descripcion,
            cedis: data.cedis.nombre,
            periodo: data.PeriodoNominal,
            sueldoreal: data.sueldoreal,
            tipocontrato: data.ContratoTipo,
            centrodecostos: data.centrocostos.empresa_razonSocial,
            dias: "30",
        };

        fileDownloader(route("solicitud-nomina"), 'POST', req, `Solicitud Nomina ${Date.now()}`, onStartDownload)
    };

    const TextDetail = ({ label, data }) => {
        return (
            <div className='flex flex-col'>
                <span>{label}</span>
                <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data}</span>
            </div>
        )
    }

    const DialogButtons = ({ click, label, img, color = buttonColors.primary, size = buttonNumber.five }) => {
        const matches = useMediaQuery('(min-width:768px)');
        return (
            <button className={`${color} col-span-2 sm:h-[100%] md:h-[100%]`} onClick={click}>
                <div className='img-box'>
                    <div className='blur-thing' />
                    <div className="img w-[40%] h-full top-2">
                        <div className={`material-icons w-full h-full`} style={{
                            fontSize: size
                        }} >{img}</div>
                    </div>
                </div>
                <span>{label}</span>
            </button>
        )
    }

    const handleClose = () => {
        setActiveMenu(dialogMenus.mainMenu)
        setStates({ ...states, loading: false, showForm: false, title: "Detalles" })
        setActiveStep(0);
        setFs(false)
        setErrors({});
        dialogHandler()
    }

    useEffect(() => {
        action === 'create' && open ? menuHandler(dialogMenus.persona) : ''
    }, [action, open])

    // useEffect(() => {
    //     let data = dataSelects
    //     const getLocData = async () => {
    //         const newData = await getCities(data)
    //         const finalData = await GetColonias(newData)
    //         setDataSelects(finalData)
    //         // setOpen(true)
    //     }
    //     if (!fs) {
    //         getLocData()
    //     }
    // }, [fs]);

    useEffect(() => {
        activeMenu === dialogMenus.gafete && states.loading && generarGafete()
        activeMenu === dialogMenus.contrato && states.loading && generarContrato()
        activeMenu === dialogMenus.constancia && states.loading && generarConstanciaPDF()
        activeMenu === dialogMenus.documentos && states.loading && getEmployeeDocs()
        activeMenu === dialogMenus.persona && states.loading && setStates({ ...states, loading: false, showForm: true, title: action === "create" ? "Agregar empleado" : "Editar datos" })
        activeMenu === dialogMenus.usuario && states.loading && setStates({ ...states, loading: false, showForm: true, title: "Crear usuario" })
    }, [activeMenu, states.loading])

    useEffect(() => {
        getInputsData()
    }, [open])

    return (
        <Dialog open={open} onClose={() => { }} fullWidth={true} maxWidth={states.largeDialog ? 'lg' : 'md'}>
            <DialogTitle className='flex justify-between' style={{ backgroundColor: 'white' }}>
                {states.title}
                <div onClick={handleClose}><CloseIcon className='cursor-pointer' /></div>
            </DialogTitle>
            <div className='flex justify-center'><Divider className='w-[95%]' /></div>
            <DialogContent style={{ backgroundColor: 'white' }}>
                <div className='wrapper'>
                    <div className={`monitor-dialog-options sm:overflow-y-auto md:overflow-y-hidden blue-scroll buttons-box ${!(activeMenu === dialogMenus.persona && !states.loading) ? 'active-box' : ''}`}>
                        <div className='sm:grid-cols-1 md:grid md:grid-cols-8 gap-4 h-[600px] '>
                            <div className={`monitor-dialog-details sm:col-span-5 ${states.largeDialog ? "md:col-span-2" : "md:col-span-3"} sm:mb-4 md:mb-0 sm:h-[70%] md:h-full p-3`}>
                                <div className='grid sm:grid-cols-2 md:grid-cols-1 w-full h-full gap-2 p-3  gap-y-5'>
                                    <TextDetail label='Nombre' data={data.nombreCompleto} />
                                    <TextDetail label='NSS' data={data.NSS} />
                                    <TextDetail label='RFC' data={data.RFC} />
                                    <TextDetail label='Telefono' data={data.Tel1} />
                                    <TextDetail label='Departamento' data={data.departamento?.nombre} />
                                    <TextDetail label='Cedis' data={data.cedis?.nombre} />
                                    <TextDetail label='Fecha Ingreso' data={data.FechaIngreso} />
                                </div>

                            </div>
                            <div className={`wrapper ${states.largeDialog ? "md:col-span-6" : "md:col-span-5"} sm:pb-5 md:pb-0`}>
                                <div className={`monitor-dialog-options buttons-box ${!states.showForm || states.loading ? 'active-box' : ''}`}>
                                    <DialogButtons
                                        click={() => menuHandler(dialogMenus.persona)}
                                        label={`Editar datos`}
                                        img={'person'}
                                        size={buttonNumber.six}
                                    />
                                    <DialogButtons
                                        click={() => menuHandler(dialogMenus.gafete)}
                                        label={'Descargar gafete'}
                                        img={'badge'}
                                        size={buttonNumber.six}
                                    />
                                    <DialogButtons
                                        click={() => menuHandler(dialogMenus.contrato)}
                                        label={`Descargar contrato`}
                                        img={'drive_file_rename_outline'}
                                        size={buttonNumber.six}
                                    />
                                    <DialogButtons
                                        click={() => menuHandler(dialogMenus.constancia)}
                                        label={'Descargar constancia'}
                                        img={'request_quote'}
                                        size={buttonNumber.six}
                                    />
                                    <DialogButtons
                                        click={() => menuHandler(dialogMenus.documentos)}
                                        label={`Documentos entregados`}
                                        img={'rule_folder'}
                                        size={buttonNumber.six}
                                    />
                                    <DialogButtons
                                        click={() => menuHandler(dialogMenus.usuario)}
                                        label={`Crear usuario`}
                                        img={'account_circle'}
                                        size={buttonNumber.six}
                                    />
                                </div>
                                <div className={`monitor-dialog-options action ${states.showForm && !states.loading ? 'active-box' : ''}`}>
                                    <div className='flex flex-col w-full h-full gap-3'>
                                        <div>
                                            <button onClick={() => menuHandler(dialogMenus.mainMenu)}>
                                                <img className="non-selectable" src={leftArrow} alt="Menú principal" />
                                            </button>
                                        </div>
                                        <div className='h-full relative'>
                                            {(activeMenu === dialogMenus.documentos && !states.loading) && <DocumentacionEntregada data={data} docsList={docsList} employeeDocs={employeeDocs} />}
                                            {(activeMenu === dialogMenus.usuario && !states.loading) && <CrearUsuario data={data} />}
                                        </div>
                                    </div>
                                </div>
                                {/* LOADING ANIMATION */}
                                {states.loading && <div className='absolute w-full h-full bg-[#c0c0c03a]'></div>}
                            </div>
                        </div>
                    </div>
                    <div className={`monitor-dialog-options action ${(activeMenu === dialogMenus.persona && !states.loading) ? 'active-box' : ''}`}>
                        <PersonaForm
                            states={states}
                            data={data}
                            setData={setData}
                            submit={submitPersona}
                            dataSelects={dataSelects}
                            setDataSelects={setDataSelects}
                            errors={errors}
                            action={action}
                            handleBackClick={() => menuHandler(dialogMenus.mainMenu)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogActions
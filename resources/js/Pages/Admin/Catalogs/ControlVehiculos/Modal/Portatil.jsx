import { IntPortatilData, IntPortatilRules, IntGeneralControlState, IntPartesEstacionarias, typesES } from "../IntControlVehiculos";
import pFrente from "../../../../../../png/Portatil/PortatilFrente.png";
import pAtras from "../../../../../../png/Portatil/PortatilTrasero.png";
import pIzquierda from "../../../../../../png/portatil/portatiles.png";
import tacha from "../../../../../../png/estacionario/icons8-x-25.png";
import pDerecha from "../../../../../../png/portatil.png";
import request, { noty, validateInputs } from "@/utils";

import { FieldDrawer } from "@/components/DialogComp";
import { useState, useEffect } from "react";
import Datatable from "@/components/Datatable";
import moment from "moment";

export const Portatil = ({ states = IntGeneralControlState, setStates = () => { }, setSubmitState = () => { } }) => {
    const [envioPartes, setEnvioPartes] = useState(IntPartesEstacionarias);
    const [cargas, setCargas] = useState({ auth: [], reg: [] })
    const [data, setData] = useState(IntPortatilData)
    const [condiciones, setCondiciones] = useState([])
    const [checkboxes, setCheckboxes] = useState({})
    const [errors, setErrors] = useState({})

    const resetData = () => {
        setEnvioPartes(IntPartesEstacionarias)
        setCargas({ auth: [], reg: [] })
        setData({ ...IntPortatilData, tipoRegistro: data.tipoRegistro })
        setCondiciones([])
        setCheckboxes({})
        setErrors({})
    }

    const filterUnidades = (tipo = data.tipoRegistro) => {
        const unidades = states.unidades.filter(u => (u.last_control && u.last_control.tipoRegistro != tipo) ||
            (tipo == typesES.salida && !u.last_control))
        return unidades
    }

    const handleCheckboxChange = (index, id, estado) => {
        const newCheckboxStates = { ...checkboxes };
        newCheckboxStates[index] = !newCheckboxStates[index];
        let objeto = { id, estado };
        if (condiciones) {
            const existingObjIndex = condiciones.findIndex(item => item.id === id);
            const newCondi = condiciones
            if (existingObjIndex !== -1) condiciones[existingObjIndex].estado = estado;
            else {
                newCondi.push({ ...objeto, estado: estado })
                setCondiciones(newCondi)
            }

        } else setCondiciones([objeto]);

        setCheckboxes(newCheckboxStates);
    };

    const updateCargas = (e) => {
        if (e.newData) {
            const newCarga = cargas.reg.filter(ca => ca.productoId !== e.newData.productoId)

            if (data.tipoRegistro == typesES.entrada) {
                const oldIndex = cargas.auth.findIndex(ca => ca.productoId === e.oldData.productoId)
                cargas.auth[oldIndex].totalLiquidar = e.oldData.salioCon - e.newData.devueltos
            }

            newCarga.push(e.oldData)
            setCargas({ ...cargas, reg: newCarga })
        }
    }

    const submit = async () => {
        setErrors({})
        const validations = validateInputs(IntPortatilRules, data);
        if (!validations.isValid) {
            console.log(validations)
            setErrors(validations.errors)
            return
        }
        if (data.kilometraje <= (data.unidadObjeto?.last_control?.kilometraje ?? 0) && data.tipoRegistro == typesES.entrada) {
            noty('El kilometraje tiene que ser mayor', 'error')
            return
        }
        if (cargas.auth.length !== cargas.reg.length) {
            if (data.tipoRegistro != typesES.entrada) {
                noty('Favor de llenar la tabla', 'error')
                return
            }
            cargas.reg = cargas.auth
        }
        if (data.tipoRegistro == typesES.entrada && cargas.reg.some(cr => cr.totalLiquidar < 0)) {
            noty('No puede haber negativos por liquidar', 'error')
            return
        }

        const response = await request(route('controlPortatil'), 'POST', {
            listaVerificacion: condiciones.filter(con => !con.estado),
            partesUnidad: Object.values(envioPartes).filter(p => p),
            registroData: data,
            cargasRegistradas: cargas.reg
        }, { enabled: true })

        noty(response.message, response.status ? 'success' : 'error')
        states.dialogHandler(states.dialogType, true)

        resetData()
        response.status && setData((prev) => ({ ...prev, dataSent: true }))
    }

    const emailIncidencias = async () => {
        if (condiciones.length > 0 || Object.values(envioPartes).some(val => val != ''))
            await request(route('correoCondiciones'), 'POST', {
                listaVerificacion: condiciones.filter(con => !con.estado),
                partesUnidad: Object.values(envioPartes).filter(p => p),
                registroData: data,
            }, { enabled: true })
    }

    useEffect(() => {
        if (data.dataSent) {
            emailIncidencias()
            setData({ ...data, dataSent: false })
        }
    }, [data.dataSent]);

    useEffect(() => {
        setSubmitState({
            btnText: `Registro ${data.tipoRegistro == typesES.entrada ? 'entrada' : 'salida'}`,
            submit: submit
        })
    }, [data, envioPartes, condiciones, cargas]);

    useEffect(() => {
        setStates((prev) => ({
            ...prev,
            unidadesFiltradas: filterUnidades(data.tipoRegistro),
            motivosESFiltrados: states.motivosES.filter(mes => mes.tipoEntradaSalida == data.tipoRegistro)
        }))
        resetData()
    }, [data.tipoRegistro, states.unidades]);


    return (
        <>
            <div className="grid md:grid-cols-5 sm:grid-cols-1 gap-5" >
                {/* <div className="grid grid-cols-5 bg-red-600" > */}
                <div className="col-span-2 grid grid-cols-6 gap-x-3">
                    <FieldDrawer
                        fields={[
                            {
                                select: true,
                                virtual: false,
                                label: 'Tipo registro',
                                style: 'col-span-3',
                                options: states.regTypes,
                                value: data.tipoRegistro,
                                fieldKey: 'tipoRegistro',
                                data: 'value',
                                valueKey: 'id',
                                onChangeFunc: (e) => {
                                    setCargas({ ...cargas, auth: [], reg: [] })
                                    setData({ ...data, tipoRegistro: e, unidad: '', unidadObjeto: {}, motivosES: '' })
                                }
                            },
                            {
                                select: true,
                                firstLabel: 'SIN SELECCIONAR',
                                virtual: false,
                                label: 'Motivo',
                                style: 'col-span-3',
                                value: data.motivosES,
                                fieldKey: 'motivosES',
                                options: states.motivosESFiltrados,
                                data: 'descripcion',
                                valueKey: 'idmotivoentradasalida',
                                onChangeFunc: (e) => setData({ ...data, motivosES: e })
                            },
                            {
                                select: true,
                                firstLabel: 'SIN SELECCIONAR',
                                virtual: false,
                                label: 'Unidad',
                                style: 'col-span-6',
                                options: states.unidadesFiltradas,
                                value: data.unidad,
                                fieldKey: 'unidad',
                                data: 'unidad_numeroComercial',
                                valueKey: 'unidad_idUnidad',
                                onChangeFunc: (e, o) => {
                                    setCargas({ ...cargas, auth: o.cargas_autorizadas ? o.cargas_autorizadas : [] })
                                    setData({
                                        ...data,
                                        unidad: e,
                                        unidadObjeto: o,
                                        kilometraje: o.last_control?.kilometraje ?? 0,
                                    })
                                }
                            },
                        ]}
                        errors={errors}
                    />

                    <div className={`monitor-dialog-details sm:col-span-full my-2 mt-[2vh]`}>
                        <div className='grid sm:grid-cols-1 md:grid-cols-2 w-full h-full gap-2 p-3  gap-y-5'>
                            <TextDetail style='col-span-2' label='Operador' data={data.unidadObjeto?.quien_con_quien?.vendedor?.nombre_completo || "No registrado"} />
                            <TextDetail style='col-span-2' label='Ayudante' data={data.unidadObjeto?.quien_con_quien?.ayudante?.nombre_completo || "No registrado"} />
                            <TextDetail label='Red' data={data.unidadObjeto?.quien_con_quien?.red?.red_numero || "No registrado"} />
                            <TextDetail label='Fecha' data={
                                data.unidadObjeto?.quien_con_quien ?
                                moment(data.unidadObjeto?.quien_con_quien?.quienConQuien_fechaGuardada).format('DD-MM-YYYY hh:mm a') :
                                    "No registrado"
                            } />
                        </div>

                    </div>
                    <FieldDrawer
                        fields={[
                            {
                                slider: true,
                                steps: 5,
                                label: 'Porcentaje',
                                style: 'col-span-full px-1',
                                value: data.porcentaje,
                                onChangeFunc: (e) => setData({ ...data, porcentaje: e })
                            },
                            {
                                select: true,
                                firstLabel: 'SIN SELECCIONAR',
                                virtual: false,
                                label: 'Gasolina',
                                style: 'col-span-3',
                                value: data.gasolina,
                                fieldKey: 'gasolina',
                                options: states.nivelesGasolina,
                                data: 'nivelGasolina',
                                valueKey: 'idNivelGasolina',
                                onChangeFunc: (e) => setData({ ...data, gasolina: e })
                            },
                            {
                                input: true,
                                label: 'Kilometraje',
                                fieldKey: 'kilometraje',
                                type: 'number',
                                disabled: data.tipoRegistro == typesES.salida,
                                value: data.kilometraje,
                                style: 'col-span-3',
                                onChangeFunc: (e) => setData({ ...data, kilometraje: e.target.value })
                            },
                        ]}
                        errors={errors}
                    />
                </div>

                <div className="col-span-3">
                    <h2 className="p-2" >Condiciones unidad</h2>
                    <div className={`grid md:grid-cols-2 sm:grid-cols-1 ${(data.tipoRegistro != typesES.entrada) && 'h-full'}`}>
                        {states.listaVerificacion.map((lv, index) =>
                            <div className="mt-1 content-center" key={index} >
                                <input
                                    type="checkbox"
                                    checked={!checkboxes[index]} // Usa el estado individual
                                    onChange={(e) => handleCheckboxChange(index, lv.idListaVerificacion, e.target.checked)} // Pasa e.target.checked directamente
                                    color="success"
                                    className="ml-[10px] w-[30px] h-[30px]"
                                    style={{ color: "green", borderRadius: "10px" }}
                                />
                                <label className="text-[18px] ml-[10px] text-[#255]" >
                                    {lv.descripcion}
                                </label>
                            </div>
                        )}
                    </div>


                    {/* 
                    
                    IMAGENEEEEEEEEEEEEEEEEEEES
                    
                    */}
                    {
                        (data.tipoRegistro == typesES.entrada) && <div className="flex h-[280px] overflow-x-auto overflow-y-hidden blue-scroll  place-items-center">
                            <div className='p-5'>
                                <div className="relative place-items-center  w-[350px]">
                                    <img src={pFrente} className="relative  w-[90%] ml-[15px]" />
                                    {/* div Parte Frontal */}
                                    <div className="grid grid-cols-3 grid-rows-5 absolute -top-4 h-full w-full place-items-center opacity-80">
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Torreta*/}
                                        <div
                                            title="Torreta"
                                            className="col-span-1 row-span-1 mt-6 w-[35%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt1: envioPartes.Fpt1 === "" ? 2 : '', })}
                                        ><TachaImg state={envioPartes.Fpt1 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* espejo izq */}
                                        <div
                                            title="Espejo Izquierdo"
                                            className="col-span-1 row-span-1 mt-9 w-[35%] mr-[30px] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt2: envioPartes.Fpt2 === "" ? 3 : '', })}
                                        ><TachaImg state={envioPartes.Fpt2 ? 0 : 1} /></div>
                                        {/* parabrisas */}
                                        <div
                                            title="Parabrisas"
                                            className="col-span-1 row-span-1 mt-4  cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ftp3: envioPartes.Ftp3 === "" ? 4 : '', })}
                                        ><TachaImg state={envioPartes.Ftp3 ? 0 : 1} /></div>
                                        {/* espejo der */}
                                        <div
                                            title="Espejo Derecho"
                                            className="col-span-1 row-span-1 mt-9  w-[35%] -mr-[25px] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt4: envioPartes.Fpt4 === "" ? 5 : '', })}
                                        ><TachaImg state={envioPartes.Fpt4 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"> </div>
                                        {/* cofre */}
                                        <div
                                            title="Cofre"
                                            className="col-span-1 row-span-1 mt-1  cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ftp5: envioPartes.Ftp5 === "" ? 6 : '', })}
                                        ><TachaImg state={envioPartes.Ftp5 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* faro izq */}
                                        <div
                                            title="Faro izquierdo"
                                            className="col-span-1 row-span-1 mb-[50%] w-[35%]  mr-[10px] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt6: envioPartes.Fpt6 === "" ? 27 : '', })}
                                        ><TachaImg state={envioPartes.Fpt6 ? 0 : 1} /></div>
                                        {/* parrilla */}
                                        <div
                                            title="Parrilla"
                                            className="col-span-1 row-span-1 mt-[5%]  cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ftp7: envioPartes.Ftp7 === "" ? 8 : '', })}
                                        ><TachaImg state={envioPartes.Ftp7 ? 0 : 1} /></div>
                                        {/* faro der */}
                                        <div
                                            title=""
                                            className="col-span-1 row-span-1 w-[35%] mb-[50%]  -mr-[30px] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt8: envioPartes.Fpt8 === "" ? 29 : '', })}
                                        ><TachaImg state={envioPartes.Fpt8 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* fascia centro */}
                                        <div
                                            title="Fascia centro"
                                            className="col-span-1 row-span-1 mt-8  cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ftp9: envioPartes.Ftp9 === "" ? 10 : '', })}
                                        ><TachaImg state={envioPartes.Ftp9 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                    </div>
                                </div>
                            </div>

                            <div className='p-5'>
                                <div className="relative place-items-center w-[300px]">
                                    <img src={pIzquierda} className="relative bg- " style={{ width: "300px", height: "400px" }} />
                                    {/* div Parte izquierda */}
                                    <div className="grid grid-cols-4 grid-rows-4 absolute top-6 h-full w-full place-items-center opacity-90  ">

                                        {/* cuarto izq */}
                                        <div
                                            title="cuarto izq"
                                            className="col-span-1 row-span-1 mt-[500%] mr-[30px] w-[35%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt8: envioPartes.Ipt8 === "" ? 22 : '', })}
                                        ><TachaImg state={envioPartes.Ipt8 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* polvorera frente */}
                                        <div
                                            title="Polvorera Delantera"
                                            className="col-span-1 row-span-1 mt-[140%] ml-[60px] w-[35%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt4: envioPartes.Ipt4 === "" ? 13 : '', })}
                                        ><TachaImg state={envioPartes.Ipt4 ? 0 : 1} /></div>
                                        {/* ventana */}
                                        <div
                                            title="Ventana"
                                            className="col-span-1 row-span-1 mt-[92%] ml-[40px] w-[35%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt5: envioPartes.Ipt5 === "" ? 18 : '', })}
                                        ><TachaImg state={envioPartes.Ipt5 ? 0 : 1} /></div>
                                        {/* Caja izquierda */}
                                        <div
                                            title="Caja izquierda"
                                            className="col-span-1 row-span-1 mt-12 ml-[90px] w-[65%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt6: envioPartes.Ipt6 === "" ? 30 : '', })}

                                        ><TachaImg state={envioPartes.Ipt6 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* llanta delantera */}
                                        <div
                                            title="Llanta Delantera"
                                            className="col-span-1 row-span-1 mt-[70%] ml-[45px] w-[40%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt1: envioPartes.Ipt1 === "" ? 24 : '', })}
                                        ><TachaImg state={envioPartes.Ipt1 ? 0 : 1} /></div>
                                        {/* puerta */}
                                        <div
                                            title="Puerta"
                                            className="col-span-1 row-span-1 -mt-8 ml-[30px] w-[55%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt2: envioPartes.Ipt2 === "" ? 20 : '', })}
                                        ><TachaImg state={envioPartes.Ipt2 ? 0 : 1} /></div>
                                        {/* llanta trasera */}
                                        <div
                                            title="Llanta Trasera"
                                            className="col-span-1 row-span-1 mt-[50%] ml-[75px] w-[40%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt3: envioPartes.Ipt3 === "" ? 23 : '', })}
                                        ><TachaImg state={envioPartes.Ipt3 ? 0 : 1} /></div>
                                        {/*Calabera Izquierda  */}
                                        <div
                                            title="Calabera Izquierda"
                                            className="col-span-1 row-span-1 -mt-9 ml-[40px] w-[45%] cursor-pointer select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt7: envioPartes.Ipt7 === "" ? 19 : '', })}
                                        ><TachaImg state={envioPartes.Ipt7 ? 0 : 1} /></div>
                                    </div>
                                </div>
                            </div>


                            <div className='p-5'>
                                <div className="relative place-items-center  w-[300px]">
                                    <img src={pAtras} className="relative" style={{ width: "250px", height: "240px" }} />
                                    {/* div Parte trasera */}
                                    <div className="grid grid-cols-3 grid-rows-3 absolute -top-6 h-full w-full place-items-center opacity-90">

                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Puerta Caja */}
                                        <div
                                            title="Defensa"
                                            className="col-span-1 row-span-1 mt-4 ml-[45px] w-[100%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt4: envioPartes.Apt4 === "" ? 26 : '', })}
                                        ><TachaImg state={envioPartes.Apt4 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Faro Izquierdo */}
                                        <div
                                            title="Faro Izquierdo"
                                            className="col-span-1 row-span-1 mt-4 mr-[30px] w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt1: envioPartes.Apt1 === "" ? 7 : '', })}
                                        ><TachaImg state={envioPartes.Apt1 ? 0 : 1} /></div>
                                        {/* Defensa */}
                                        <div
                                            title="Defensa"
                                            className="col-span-1 row-span-1 mt-4 ml-[5px] w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt3: envioPartes.Apt3 === "" ? 28 : '' })}
                                        ><TachaImg state={envioPartes.Apt3 ? 0 : 1} /></div>

                                        {/* Faro Derecho */}
                                        <div
                                            title="Faro Derecho"
                                            className="col-span-1 row-span-1 mt-4  w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt2: envioPartes.Apt2 === "" ? 62 : '', })}
                                        ><TachaImg state={envioPartes.Apt2 ? 0 : 1} /></div>

                                    </div>
                                </div>
                            </div>


                            <div className='p-5'>
                                <div className="relative place-items-center  w-[300px]">
                                    <img src={pDerecha} className="relative" style={{ width: "300px", height: "400px" }} />
                                    {/* div Parte derecha */}
                                    {/* div Parte Frontal */}
                                    <div className="grid grid-cols-4 grid-rows-4 absolute top-6 h-full w-full place-items-center opacity-90">

                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* cuarto derecho */}
                                        <div
                                            title="cuarto derecho"
                                            className="col-span-1 row-span-1 mt-[500%] ml-[20px] w-[40%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt8: envioPartes.Dpt8 === "" ? 12 : '', })}
                                        ><TachaImg state={envioPartes.Dpt8 ? 0 : 1} /></div>


                                        {/* calabera derecha */}
                                        <div
                                            title="calabera Derecha"
                                            className="col-span-1 row-span-1 mt-[250%] mr-[40px] w-[40%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt4: envioPartes.Dpt4 === "" ? 15 : '', })}
                                        ><TachaImg state={envioPartes.Dpt4 ? 0 : 1} /></div>


                                        {/* ventana */}
                                        <div
                                            title="Ventana"
                                            className="col-span-1 row-span-1 mt-12 ml-[100px] w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt5: envioPartes.Dpt5 === "" ? 11 : '', })}
                                        ><TachaImg state={envioPartes.Dpt5 ? 0 : 1} /></div>

                                        {/* Caja derecha */}
                                        <div
                                            title="Caja derecha"
                                            className="col-span-1 row-span-1 mt-4 mr-[220px] w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt6: envioPartes.Dpt6 === "" ? 25 : '', })}
                                        ><TachaImg state={envioPartes.Dpt6 ? 0 : 1} /></div>

                                        {/* faro derecho*/}
                                        <div>


                                        </div>
                                        {/* llanta trasera */}
                                        <div
                                            title="Llanta trasera"
                                            className="col-span-1 row-span-1 mt-1 ml-[75px] w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt1: envioPartes.Dpt1 === "" ? 17 : '', })}
                                        ><TachaImg state={envioPartes.Dpt1 ? 0 : 1} /></div>

                                        {/* puerta */}
                                        <div
                                            title="Puerta"
                                            className="col-span-1 row-span-1 -mt-8 ml-[100px] w-[55%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt2: envioPartes.Dpt2 === "" ? 14 : '', })}
                                        ><TachaImg state={envioPartes.Dpt2 ? 0 : 1} /></div>

                                        {/* llanta delantera */}
                                        <div
                                            title="Llanta Delantera"
                                            className="col-span-1 row-span-1 mt-4 ml-[100px] w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt3: envioPartes.Dpt3 === "" ? 16 : '', })}
                                        ><TachaImg state={envioPartes.Dpt3 ? 0 : 1} /></div>

                                        {/*polvera derecha */}
                                        <div
                                            title="polvera derecha"
                                            className="col-span-1 row-span-1 -mt-[140%] mr-[50px] w-[40%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt7: envioPartes.Dpt7 === "" ? 13 : '', })}
                                        ><TachaImg state={envioPartes.Dpt7 ? 0 : 1} /></div>

                                    </div>
                                </div>
                            </div>
                        </div >
                    }

                </div>

                <div className="col-span-full">

                    <Datatable
                        searcher={false}
                        virtual={true}
                        // data={data.cargasAutorizadas}
                        data={cargas.auth}
                        tableId='dialogTable'
                        editingMode={{ mode: "cell", allowUpdating: true }}
                        handleRowUpdating={updateCargas}
                        columns={
                            (data.tipoRegistro == typesES.entrada) ? [
                                {
                                    header: "Producto",
                                    cell: ({ item }) => item.producto,
                                    accessor: "producto",
                                    width: '21%'
                                },
                                {
                                    header: "Carga autorizada",
                                    accessor: "cargaAutorizada",
                                    cell: ({ item }) => item.cargaAutorizada,
                                    width: '20%'
                                },
                                {
                                    header: "Salio con",
                                    cell: ({ item }) => item.salioCon,
                                    width: '20%'
                                },
                                {
                                    header: "Devuelve llenos",
                                    accessor: "devueltos",
                                    width: '20%'
                                },
                                {
                                    header: "Total a liquidar",
                                    cell: ({ item }) => item.totalLiquidar,
                                    width: '20%'
                                },
                            ] : [
                                {
                                    header: "Producto",
                                    cell: ({ item }) => item.producto,
                                    accessor: "producto",
                                    width: '34%'
                                },
                                {
                                    header: "Carga autorizada",
                                    accessor: "cargaAutorizada",
                                    cell: ({ item }) => item.cargaAutorizada,
                                    width: '33%'
                                },
                                {
                                    /// Este es cuando es de salida y es editable
                                    header: "Salio con",
                                    accessor: "salioCon",
                                    width: '33%'
                                },
                            ]
                        }
                    />
                </div>
            </div>
        </>
    );
};

const TextDetail = ({ label, data, style }) => {
    return <>
        <div className={`flex flex-col ${style}`}>
            <span>{label}</span>
            <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data}</span>
        </div>
    </>
}


const TachaImg = ({ state = 0 }) => {
    return (<>
        <div
            style={{ backgroundImage: `url(${tacha})` }}
            className={`select-none justify-center h-6 w-6 ${state ? 'invert' : ''}`}
        />
    </>)
}


export default Portatil;

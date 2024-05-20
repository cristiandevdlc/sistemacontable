import { IntEstacionarioData, IntEstacionarioRules, IntGeneralControlState, IntPartesEstacionarias, typesES } from "../IntControlVehiculos";
import PFrente from "../../../../../../png/estacionario/FrenteEstacionarioSF.png";
import pDerecha from "../../../../../../png/estacionario/EstacionarioDerch.png";
import pIzquierda from "../../../../../../png/estacionario/EstacionarioIzq.png";
import PAtras from "../../../../../../png/estacionario/EstacionarioTrasero.png";
import tacha from "../../../../../../png/estacionario/icons8-x-25.png";
import { FieldDrawer } from "@/components/DialogComp";
import { useState, useEffect } from "react";
import request, { noty, validateInputs } from "@/utils";
import moment from "moment";

const Estacionario = ({ states = IntGeneralControlState, setStates = () => { }, setSubmitState = () => { } }) => {
    const [envioPartes, setEnvioPartes] = useState(IntPartesEstacionarias);
    const [data, setData] = useState(IntEstacionarioData)
    const [condiciones, setCondiciones] = useState([])
    const [checkboxes, setCheckboxes] = useState({})
    const [errors, setErrors] = useState({})

    const resetData = () => {
        setEnvioPartes(IntPartesEstacionarias)
        setData({ ...IntEstacionarioData, tipoRegistro: data.tipoRegistro })
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

    const submit = async () => {
        setErrors({})
        const validations = validateInputs(IntEstacionarioRules, data);
        if (!validations.isValid) {
            setErrors(validations.errors)
            return
        }
        if (data.kilometraje <= (data.unidadObjeto?.last_control?.kilometraje ?? 0) && data.tipoRegistro == typesES.entrada) {
            noty('El kilometraje tiene que ser mayor', 'error')
            return
        }

        const response = await request(route('controlEstacionario'), 'POST', {
            listaVerificacion: condiciones.filter(con => !con.estado),
            partesUnidad: Object.values(envioPartes).filter(p => p),
            registroData: data,
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
    }, [data, envioPartes, condiciones]);

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
                                onChangeFunc: (e) => setData({ ...data, tipoRegistro: e, unidad: '', unidadObjeto: {}, motivosES: '' })
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
                                onChangeFunc: (e, o) => setData({
                                    ...data,
                                    unidad: e,
                                    unidadObjeto: o,
                                    kilometraje: o.last_control?.kilometraje ?? 0,
                                    lectura: o.last_control?.lectura ?? 0
                                })
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
                                label: 'Carburación',
                                style: 'col-span-full px-1',
                                value: data.carburacion,
                                onChangeFunc: (e) => setData({ ...data, carburacion: e })
                            },
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
                                style: 'sm:col-span-full md:col-span-3',
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
                                type: 'number',
                                value: data.kilometraje,
                                disabled: data.tipoRegistro == typesES.salida,
                                style: 'sm:col-span-full md:col-span-3',
                                onChangeFunc: (e) => setData({ ...data, kilometraje: e.target.value })
                            },
                            {
                                input: true,
                                label: 'Lectura',
                                value: data.lectura,
                                fieldKey: 'lectura',
                                type: 'decimal',
                                disabled: data.tipoRegistro == typesES.salida,
                                style: 'sm:col-span-full md:col-span-2',
                                onChangeFunc: (e) => setData({
                                    ...data,
                                    lectura: e.target.value,
                                    venta: e.target.value - (data.unidadObjeto?.last_control?.lectura ?? 0)
                                })
                            },
                        ]}
                        errors={errors}
                    />
                    <div className="sm:col-span-full md:col-span-4 grid grid-cols-2 gap-x-3" >
                        <FieldDrawer
                            fields={[
                                {
                                    input: true,
                                    label: 'Venta',
                                    value: data.venta,
                                    type: 'decimal',
                                    disabled: true
                                },
                                {
                                    input: true,
                                    label: 'Capacidad',
                                    type: 'decimal',
                                    disabled: true,
                                    value: data.unidadObjeto?.unidad_capacidad ?? 0,
                                },
                            ]}
                        />
                    </div>
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
                        (data.tipoRegistro == typesES.entrada) && <div className="flex overflow-auto blue-scroll">

                            {/* Estacionario Parte Frontal */}
                            <div className="p-5">
                                <div className="relative place-items-center w-[300px]">
                                    <img
                                        src={PFrente}
                                        className="relative w-[90%] ml-[15px]"
                                    />
                                    {/* Estacionario Parte Frontal */}
                                    <div className="grid grid-cols-3 grid-rows-5 absolute -top-4 h-full w-full place-items-center opacity-90">
                                        <div className="col-span-1 row-span-1"></div>

                                        <div
                                            title="Torreta"
                                            className="col-span-1 row-span-1 mt-6 cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt1: envioPartes.Fpt1 === "" ? 46 : "" })}
                                        ><TachaImg state={envioPartes.Fpt1 ? 0 : 1} /></div>

                                        <div className="col-span-1 row-span-1"></div>

                                        <div
                                            title="Espejo Izquierdo"
                                            className="col-span-1 row-span-1 mt-7  mr-[35px] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt2: envioPartes.Fpt2 === "" ? 55 : "" })}
                                        ><TachaImg state={envioPartes.Fpt2 ? 0 : 1} /></div>

                                        <div
                                            title="Parabrisas"
                                            className="col-span-1 row-span-1 -mt-1 ml-[20px]  cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt3: envioPartes.Fpt3 === "" ? 60 : "" })}
                                        ><TachaImg state={envioPartes.Fpt3 ? 0 : 1} /></div>

                                        <div
                                            title="Espejo Derecho"
                                            className="col-span-1 row-span-1 mt-6 -mr-[45px] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt4: envioPartes.Fpt4 === "" ? 38 : "" })}
                                        ><TachaImg state={envioPartes.Fpt4 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1">
                                            {" "}
                                        </div>

                                        <div
                                            title="Cofre"
                                            className="col-span-1 row-span-1 -mt-6  cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt5: envioPartes.Fpt5 === "" ? 45 : "" })}
                                        ><TachaImg state={envioPartes.Fpt5 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>

                                        <div
                                            title="Faro izquierdo"
                                            className="col-span-1 row-span-1 -mt-2  cursor-pointer  select-none "
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt6: envioPartes.Fpt6 === "" ? 50 : "" })}
                                        ><TachaImg state={envioPartes.Fpt6 ? 0 : 1} /></div>

                                        <div
                                            title="Parrilla"
                                            className="col-span-1 row-span-1 -mt-2 ml-[20px]  cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt7: envioPartes.Fpt7 === "" ? 44 : "" })}
                                        ><TachaImg state={envioPartes.Fpt7 ? 0 : 1} /></div>

                                        <div
                                            title="Faro derecho"
                                            className="col-span-1 row-span-1 -mt-4  -mr-[45px] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt8: envioPartes.Fpt8 === "" ? 50 : "" })}
                                        ><TachaImg state={envioPartes.Fpt8 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>

                                        <div
                                            title="Fascia"
                                            className="col-span-1 row-span-1 mt-12  cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Fpt9: envioPartes.Fpt9 === "" ? 43 : "" })}
                                        ><TachaImg state={envioPartes.Fpt9 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                    </div>
                                </div>
                            </div>


                            {/* Estacionario  Parte izquierda */}
                            <div className="p-5">
                                {/* Estacionario  Parte izquierda */}
                                <div className="relative place-items-center w-[300px]">
                                    <img src={pDerecha} className="relative -mt-[20px] ml-[5px]" style={{ width: "300px", height: "230px" }} />
                                    <div className="grid grid-cols-4 grid-rows-4 absolute top-9 h-full w-full place-items-center opacity-80 ">
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Tanque izquierdo */}
                                        <div
                                            title="tanque izquierda"
                                            className="col-span-1 row-span-1 mt-1 ml-[40px]   select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt2: envioPartes.Ipt2 === "" ? 31 : "" })}
                                        ><TachaImg state={envioPartes.Ipt2 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Polvera Izquierda */}
                                        <div
                                            title="Polvera Izquierda"
                                            className="col-span-1 row-span-1 mt-[90%] ml-[20px]   select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt4: envioPartes.Ipt4 === "" ? 53 : "" })}
                                        ><TachaImg state={envioPartes.Ipt4 ? 0 : 1} /></div>
                                        {/* ventana */}
                                        <div
                                            title="Ventana"
                                            className="col-span-1 row-span-1 -mt-12 mr-[20px]  select-none w-[35%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt1: envioPartes.Ipt1 === "" ? 56 : "" })}
                                        ><TachaImg state={envioPartes.Ipt1 ? 0 : 1} /></div>
                                        {/* calabera */}
                                        <div
                                            title="calabera"
                                            className="col-span-1 row-span-1 mt-[100%] ml-[90px]   select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt9: envioPartes.Ipt9 === "" ? 58 : "" })}
                                        ><TachaImg state={envioPartes.Ipt9 ? 0 : 1} /></div>
                                        {/* Cuarto izquierda */}
                                        <div
                                            title="Cuarto Izquierdo"
                                            className="col-span-1 row-span-1 mt-[40%] mr-[480px]   select-none w-[35%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt3: envioPartes.Ipt3 === "" ? 51 : "" })}
                                        ><TachaImg state={envioPartes.Ipt3 ? 0 : 1} /></div>
                                        {/* llanta delantera */}
                                        <div
                                            title="Llanta Superior Izquierdo"
                                            className="col-span-1 row-span-1 mt-9 ml-[60px]   select-none w-[85%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt7: envioPartes.Ipt7 === "" ? 52 : "" })}
                                        ><TachaImg state={envioPartes.Ipt7 ? 0 : 1} /></div>
                                        {/* Puerta */}
                                        <div
                                            title="Puerta izquierda"
                                            className="col-span-1 row-span-1 -mt-12 mr-[20px]   select-none w-[55%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt5: envioPartes.Ipt5 === "" ? 54 : "" })}
                                        ><TachaImg state={envioPartes.Ipt5 ? 0 : 1} /></div>
                                        {/* llanta inferior izquierdo */}
                                        <div
                                            title="Llanta inferior izquierdo"
                                            className="col-span-1 row-span-1 mt-10 ml-[90px]   select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt8: envioPartes.Ipt8 === "" ? 57 : "" })}
                                        ><TachaImg state={envioPartes.Ipt8 ? 0 : 1} /></div>
                                        {/*Caja Izquierda  */}
                                        <div
                                            title="Caja Izquierda"
                                            className="col-span-1 row-span-1 -mt-12 ml-[60px]   select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Ipt6: envioPartes.Ipt6 === "" ? 32 : "" })}
                                        ><TachaImg state={envioPartes.Ipt6 ? 0 : 1} /></div>
                                    </div>
                                </div>
                            </div>



                            {/*ESTACIONARIO PARTE TRASERA*/}
                            <div className="p-5">
                                <div className="relative place-items-center w-[300px]">
                                    <img src={PAtras} className=" w-[100%]" />

                                    <div className="grid grid-cols-3 grid-rows-3 absolute -top-2 h-full w-full place-items-center opacity-80">
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Puerta Caja */}
                                        <div
                                            title="Puerta Caja"
                                            className="col-span-1 row-span-1 mt-2 ml-[65px] select-none w-[100%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt1: envioPartes.Apt1 === "" ? 48 : "" })}
                                        ><TachaImg state={envioPartes.Apt1 ? 0 : 1} /></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Faro Izquierdo */}
                                        <div
                                            title="Faro Izquierdo"
                                            className="col-span-1 row-span-1 mt-12 ml-[30px]  select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt2: envioPartes.Apt2 === "" ? 59 : "" })}
                                        ><TachaImg state={envioPartes.Apt2 ? 0 : 1} /></div>
                                        {/* Defensa */}
                                        <div
                                            title="Defensa"
                                            className="col-span-1 row-span-1 mt-10 ml-[15px]  select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt3: envioPartes.Apt3 === "" ? 49 : "" })}
                                        ><TachaImg state={envioPartes.Apt3 ? 0 : 1} /></div>
                                        {/* Faro Derecho */}
                                        <div
                                            title="Faro Derecho"
                                            className="col-span-1 row-span-1 mt-10 ml-[30px]  select-none w-[45%] cursor-pointer"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Apt4: envioPartes.Apt4 === "" ? 42 : "" })}
                                        ><TachaImg state={envioPartes.Apt4 ? 0 : 1} /></div>

                                    </div>
                                </div>
                            </div>

                            {/* ESTACIONARIO PARTE DERECHA*/}
                            <div className="p-5">
                                <div className="relative place-items-center w-[300px]" >
                                    <img src={pIzquierda} className="relative -mt-[20px] ml-[5px]" style={{ width: "300px", height: "230px" }} />

                                    <div className="grid grid-cols-4 grid-rows-4 absolute top-9 h-full w-full place-items-center opacity-80 ">
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* Tanque Derecho */}
                                        <div
                                            title="Tanque Derecho"
                                            className="col-span-1 row-span-1 mt-5 ml-[15px] w-[45%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt6: envioPartes.Dpt6 === "" ? 61 : "" })}
                                        ><TachaImg state={envioPartes.Dpt6 ? 0 : 1} /></div>

                                        <div className="col-span-1 row-span-1"></div>
                                        <div className="col-span-1 row-span-1"></div>
                                        {/* caja Derecha */}
                                        <div
                                            title="caja"
                                            className="col-span-1 row-span-1 mt-[100%] mr-[15px] w-[45%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt4: envioPartes.Dpt4 === "" ? 47 : "" })}
                                        ><TachaImg state={envioPartes.Dpt4 ? 0 : 1} /></div>

                                        {/* ventana derecha */}
                                        <div
                                            title="Ventana"
                                            className="col-span-1 row-span-1 -mt-10 ml-[190px] w-[35%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt5: envioPartes.Dpt5 === "" ? 39 : "" })}
                                        ><TachaImg state={envioPartes.Dpt5 ? 0 : 1} /></div>

                                        {/* calabera */}
                                        <div
                                            title="calabera"
                                            className="col-span-1 row-span-1 mt-[110%] mr-[190px] w-[45%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt9: envioPartes.Dpt9 === "" ? 41 : "" })}
                                        ><TachaImg state={envioPartes.Dpt9 ? 0 : 1} /></div>

                                        {/* Cuarto derecha */}
                                        <div
                                            title="Cuarto derecho"
                                            className="col-span-1 row-span-1 mt-8 -mr-[60px] w-[35%] cursor-pointer  select-none "
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt8: envioPartes.Dpt8 === "" ? 34 : "" })}
                                        ><TachaImg state={envioPartes.Dpt8 ? 0 : 1} /></div>

                                        {/* Llanta inferior Derecha */}
                                        <div
                                            title="Llanta inferior Derecha"
                                            className="col-span-1 row-span-1 mt-[80%] ml-[100px] w-[45%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt1: envioPartes.Dpt1 === "" ? 40 : "" })}
                                        ><TachaImg state={envioPartes.Dpt1 ? 0 : 1} /></div>


                                        {/* puerta */}
                                        <div
                                            title="Puerta"
                                            className="col-span-1 row-span-1 -mt-8 ml-[220px] w-[55%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt2: envioPartes.Dpt2 === "" ? 37 : "" })}
                                        ><TachaImg state={envioPartes.Dpt2 ? 0 : 1} /></div>

                                        {/* Llanta Superior Derecha */}
                                        <div
                                            title="Llanta Superior Derecha"
                                            className="col-span-1 row-span-1 mt-12 ml-[190px] w-[85%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt3: envioPartes.Dpt3 === "" ? 35 : "" })}
                                        ><TachaImg state={envioPartes.Dpt3 ? 0 : 1} /></div>

                                        {/*Polvera derecha */}
                                        <div
                                            title="Polvera derecha"
                                            className="col-span-1 row-span-1 -mt-[80%] ml-[10px] w-[35%] cursor-pointer  select-none"
                                            onClick={() => setEnvioPartes({ ...envioPartes, Dpt7: envioPartes.Dpt7 === "" ? 36 : "" })}
                                        ><TachaImg state={envioPartes.Dpt7 ? 0 : 1} /></div>

                                    </div>
                                </div>
                            </div>
                        </div >
                    }
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


export default Estacionario;

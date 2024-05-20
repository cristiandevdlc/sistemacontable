import { IntVisitaData, IntVisitaRules, imgVisita, typesES } from "../IntControlVehiculos"
import { FieldDrawer } from "@/components/DialogComp";
import request, { noty, validateInputs } from "@/utils";
import { useState, useEffect } from "react"

export default function Visita({ states = IntGeneralControlState, setStates = () => { }, setSubmitState = () => { } }) {
    const [data, setData] = useState(IntVisitaData)
    const [errors, setErrors] = useState({})

    const filterUnidades = (tipo = data.tipoRegistro) => {
        const unidades = states.unidades.filter(u => (u.last_control && u.last_control.tipoRegistro != tipo) ||
            (tipo == typesES.entrada && !u.last_control))
        return unidades
    }

    const resetData = () => {
        setData({...IntVisitaData, tipoRegistro: data.tipoRegistro})
    }

    const submit = async () => {
        setErrors({})
        const validations = validateInputs(IntVisitaRules, data);
        if (!validations.isValid) {
            console.log(validations)
            setErrors(validations.errors)
            return
        }

        const response = await request(route('controlVisita'), 'POST', data, { enabled: true })

        states.dialogHandler(states.dialogType, true)

        resetData()
        response.status && setData((prev) => ({ ...prev, dataSent: true }))
        
        noty(response.message, response.status ? 'success' : 'error')
        // states.dialogHandler(states.dialogType)
    }

    useEffect(() => {
        setSubmitState({
            btnText: `Registro ${data.tipoRegistro == typesES.entrada ? 'entrada' : 'salida'}`,
            submit: submit
        })
    }, [data]);


    useEffect(() => {
        setStates({
            ...states,
            unidadesFiltradas: filterUnidades(data.tipoRegistro),
            motivosESFiltrados: states.motivosES.filter(mes => mes.tipoEntradaSalida == data.tipoRegistro)
        })
        resetData()
    }, [data.tipoRegistro, states.unidades]);


    return (
        <>
            <div className="pb-7 gap-7 grid md:grid-cols-2  sm:grid grid-cols-1">
                <div className="grid grid-cols-2 gap-x-3">
                    <FieldDrawer
                        fields={[
                            {
                                select: true,
                                virtual: false,
                                label: 'Tipo registro',
                                options: states.regTypes,
                                value: data.tipoRegistro,
                                fieldKey: 'tipoRegistro',
                                data: 'value',
                                valueKey: 'id',
                                onChangeFunc: (e) => {
                                    setData({
                                        ...data,
                                        tipoRegistro: e,
                                        motivosES: '',
                                        quienSale: '',
                                        unidadvisitante: '',
                                        visitante: '',
                                        empresa: '',
                                        celular: '',
                                        placa: '',
                                    })
                                }
                            },
                            {
                                select: true,
                                firstLabel: 'SIN SELECCIONAR',
                                virtual: false,
                                label: 'Motivo',
                                value: data.motivosES,
                                fieldKey: 'motivosES',
                                options: states.motivosESFiltrados,
                                data: 'descripcion',
                                valueKey: 'idmotivoentradasalida',
                                onChangeFunc: (e) => setData({ ...data, motivosES: e })
                            },
                            (data.tipoRegistro === typesES.salida) && {
                                select: true,
                                firstLabel: 'SIN SELECCIONAR',
                                virtual: false,
                                label: 'Quien sale',
                                value: data.quienSale,
                                fieldKey: 'motivosES',
                                options: states.unidades,
                                data: 'nombre_operador',
                                style: 'col-span-2',
                                valueKey: 'id_registro',
                                onChangeFunc: (e, o) => setData({
                                    ...data,
                                    quienSale: e,
                                    unidadvisitante: o.unidadvisitante,
                                    visitante: o.nombre_operador,
                                    empresa: o.visitante,
                                    celular: o.celular,
                                    placa: o.placa,
                                })
                            },
                            {
                                input: true,
                                label: 'Unidad',
                                style: 'col-span-2',
                                fieldKey: 'unidadvisitante',
                                value: data.unidadvisitante,
                                onChangeFunc: (e) => setData({ ...data, unidadvisitante: e.target.value })
                            },
                            (data.tipoRegistro === typesES.entrada) && {
                                input: true,
                                label: 'Visitante',
                                fieldKey: 'visitante',
                                style: 'col-span-2',
                                value: data.visitante,
                                onChangeFunc: (e) => setData({ ...data, visitante: e.target.value })
                            },
                            {
                                input: true,
                                label: 'Empresa',
                                fieldKey: 'empresa',
                                style: 'col-span-2',
                                value: data.empresa,
                                onChangeFunc: (e) => setData({ ...data, empresa: e.target.value })
                            },
                            {
                                input: true,
                                label: 'Telefono',
                                value: data.celular,
                                fieldKey: 'celular',
                                onChangeFunc: (e) => {
                                    if (e.target.value.length < 10)
                                        setData({ ...data, celular: e.target.value })
                                }
                            },
                            {
                                input: true,
                                label: 'Placa',
                                value: data.placa,
                                fieldKey: 'placa',
                                onChangeFunc: (e) => setData({ ...data, placa: e.target.value })
                            },
                        ]}
                        errors={errors}
                    />
                </div>

                <div className="h-full hidden md:block ">
                    <div style={{ backgroundImage: `url(${imgVisita})` }} className="h-full bg-cover bg-no-repeat bg-center" />
                </div>
            </div>
        </>
    )
}
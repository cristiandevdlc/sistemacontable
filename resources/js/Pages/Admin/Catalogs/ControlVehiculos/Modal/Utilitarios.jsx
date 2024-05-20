import { IntUtilitarioData, IntUtilitarioRules, typesES } from "../IntControlVehiculos"
import { FieldDrawer } from "@/components/DialogComp"
import { useState, useEffect } from "react"
import request, { noty, validateInputs } from "@/utils";

export default function Utilitatios({ states = IntGeneralControlState, setStates = () => { }, setSubmitState = () => { } }) {
    const [data, setData] = useState(IntUtilitarioData)
    const [condiciones, setCondiciones] = useState([])
    const [checkboxes, setCheckboxes] = useState({})
    const [errors, setErrors] = useState({})

    const resetData = () => {
        setData(IntUtilitarioData)
        setCondiciones([])
        setCheckboxes({})
        setErrors({})
    }

    const filterUnidades = (tipo = data.tipoRegistro) => {
        const unidades = states.unidades.filter(u => (u.last_control && u.last_control.tipoRegistro != tipo) ||
            (tipo == typesES.entrada && !u.last_control))
        return unidades
    }

    const submit = async () => {
        setErrors({})
        const validations = validateInputs(IntUtilitarioRules, data);
        if (!validations.isValid) {
            console.log(validations)
            setErrors(validations.errors)
            return
        }
        if (data.kilometraje <= (data.unidadObjeto?.last_control?.kilometraje ?? 0) && data.tipoRegistro == typesES.entrada) {
            noty('El kilometraje tiene que ser mayor', 'error')
            return
        }

        const response = await request(route('controlUtilitario'), 'POST', {
            listaVerificacion: condiciones.filter(con => !con.estado),
            partesUnidad: [],
            registroData: data,
        }, { enabled: true })

        noty(response.message, response.status ? 'success' : 'error')
        states.dialogHandler(states.dialogType, true)

        resetData()
        response.status && setData((prev) => ({ ...prev, dataSent: true }))
    }

    const emailIncidencias = async () => {
        // await request(route('correoCondiciones'), 'POST', {
        //     listaVerificacion: condiciones.filter(con => !con.estado),
        //     partesUnidad: [],
        //     registroData: data,
        // }, { enabled: true })
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
    }, [data]);


    useEffect(() => {
        setStates((prev) => ({
            ...prev,
            unidadesFiltradas: filterUnidades(data.tipoRegistro),
            motivosESFiltrados: states.motivosES.filter(mes => mes.tipoEntradaSalida == data.tipoRegistro)
        }))
    }, [data.tipoRegistro, states.unidades]);


    return (
        <>
            <div className="pb-7 gap-7 flex sm:flex-col md:flex-row">
                {/* <div className="grid grid-cols-5 bg-red-600" > */}
                <div className="md:max-w-[40%] col-span-2 grid grid-cols-6 gap-x-3">
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
                                    setData({
                                        ...data,
                                        tipoRegistro: e,
                                        unidad: '',
                                        unidadObjeto: {},
                                        motivosES: ''
                                    })
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
                                style: 'col-span-3',
                                options: states.unidadesFiltradas,
                                value: data.unidad,
                                fieldKey: 'unidad',
                                data: 'unidad_numeroComercial',
                                valueKey: 'unidad_idUnidad',
                                onChangeFunc: (e, o) => setData({
                                    ...data,
                                    unidad: e,
                                    unidadObjeto: o,
                                    kilometraje: o.last_control.kilometraje ?? 0
                                })
                            },
                            {
                                input: true,
                                label: 'Telefono',
                                value: data.telefono,
                                fieldKey: 'telefono',
                                style: 'col-span-3',
                                onChangeFunc: (e) => {
                                    if (e.target.value.length < 10)
                                        setData({ ...data, telefono: e.target.value })
                                }
                            },
                            {
                                select: true,
                                firstLabel: 'SIN SELECCIONAR',
                                virtual: false,
                                label: 'Operador',
                                style: 'col-span-6',
                                value: data.operador,
                                fieldKey: 'gasolina',
                                options: states.empleados,
                                data: 'nombre_completo',
                                valueKey: 'IdPersona',
                                onChangeFunc: (e) => setData({ ...data, operador: e })
                            },
                            {
                                slider: true,
                                steps: 5,
                                label: 'Porcentaje',
                                style: 'col-span-full px-1 mt-4',
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
                                value: data.kilometraje,
                                style: 'col-span-3',
                                onChangeFunc: (e) => setData({ ...data, kilometraje: e.target.value })
                            },
                        ]}
                        errors={errors}
                    />

                    {/* <div className={`monitor-dialog-details sm:col-span-full my-2`}>
                        <div className='grid sm:grid-cols-1 md:grid-cols-2 w-full h-full gap-2 p-3  gap-y-5'>
                            <TextDetail style='col-span-2' label='Operador' data={data.unidadObjeto?.quien_con_quien?.vendedor?.nombre_completo || "No registrado"} />
                            <TextDetail style='col-span-2' label='Ayudante' data={data.unidadObjeto?.quien_con_quien?.ayudante?.nombre_completo || "No registrado"} />
                            <TextDetail label='Red' data={data.unidadObjeto?.quien_con_quien?.red?.red_numero || "No registrado"} />
                            <TextDetail label='Fecha' data={
                                data.unidadObjeto?.quien_con_quien ?
                                    (new Date(data.unidadObjeto?.quien_con_quien?.quienConQuien_fechaGuardada)).formatMXNoTime() :
                                    "No registrado"
                            } />
                        </div>
                    </div> */}
                </div>
                <div>
                    <h2 className="p-2" >Condiciones unidad</h2>
                    <div className={`grid md:grid-cols-2 sm:grid-cols-1 h-full`}>
                        {states.listaVerificacion.map((lv, index) =>
                            <div className="mt-3 content-center" key={index} >
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
                </div>
            </div>
        </>
    )
}
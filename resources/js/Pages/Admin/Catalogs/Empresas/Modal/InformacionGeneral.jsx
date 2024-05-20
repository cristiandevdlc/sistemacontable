import request, { dataCodigoPostal } from "@/utils";
import { useState, useEffect, useRef } from "react";
import imagenDefault from '../../../../../../png/4.3_logo_colorfull-04.png'
import '../../../../../../sass/Empresas/_empresas.scss'
import { Button } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import { debounce, throttle } from 'lodash'

export default function InformacionGeneral(state, dispatch) {
    const btnImageR = useRef()
    const [edited, setEdited] = useState(false)
    const [tempCode, setTempCode] = useState('')
    const [imagen, setImage] = useState('')
    const imagenKey = imagen ? `${imagen}-${Date.now()}` : "";
    const [infoByPostalCode, setInfoByPostalCode] = useState({
        colonias: [],
        municipio: null,
        estado: null,
        pais: null
    })

    const imageHandler = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        dispatch({ type: 'SET_LOGOTIPO', payload: file })
        setEdited(true)
        reader.onload = (e) => {
            const imagenSeleccionada = e.target.result;
            setImage(imagenSeleccionada);
        };
        reader.readAsDataURL(file);
        setEdited(true)
    };

    const coloniasPorCodigoPostal = async () => {
        const response = await dataCodigoPostal(state.empresa.empresa_codigoPostal)
        // const response = await request(route("colonia-por-cp", state.empresa.empresa_codigoPostal), 'GET', {}, { enabled: true, error: { message: "Codigo postal invalido", type: 'error' } });
        // const finalResponse = formatearRespuestColonias(response);
        setInfoByPostalCode(response);
        setTempCode(state.empresa.empresa_codigoPostal)
        dispatch({
            type: 'SET_LOCALIDAD_RESPONSE', payload: {
                empresa_idPais: response.pais?.idPais,
                empresa_ciudad: response.municipio?.idMunicipio,
                empresa_idEstado: response.estado?.idEstado,
                descripcionMunicipio: response.municipio?.descripcionMunicipio,
                empresa_localidad: response.municipio?.descripcionMunicipio,
            },
        })
    };

    useEffect(() => {
        console.log(state.empresa.empresa_codigoPostal)
        if (state.empresa.empresa_codigoPostal.length === 5) {
            coloniasPorCodigoPostal()
        } else {
            setInfoByPostalCode({
                colonias: [],
                municipio: null,
                estado: null,
                pais: null
            })
            dispatch({
                type: 'SET_COLONIA',
                payload: ''
            })
        }
    }, [state.empresa.empresa_codigoPostal])

    useEffect(() => {
        edited && dispatch({ type: 'SET_CONFIRM', payload: true })
        !edited && dispatch({ type: 'SET_CONFIRM', payload: false })
    }, [edited])

    return [
        {
            label: "Empresa Razón Social",
            input: true,
            type: 'text',
            fieldKey: 'empresa_razonSocial',
            style: 'col-span-2',
            value: state.empresa.empresa_razonSocial,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_RAZON_SOCIAL', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Empresa Razón Comercial",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'empresa_razonComercial',
            value: state.empresa.empresa_razonComercial,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_RAZON_COMERCIAL', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Calle",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'empresa_calle',
            value: state.empresa.empresa_calle,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_CALLE', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "No. Exterior",
            input: true,
            type: 'text',
            fieldKey: 'empresa_numeroExterior',
            value: state.empresa.empresa_numeroExterior,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_NUMERO_EXTERIOR', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "No. Interior",
            input: true,
            type: 'text',
            fieldKey: 'empresa_numeroInterior',
            value: state.empresa.empresa_numeroInterior,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_NUMERO_INTERIOR', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Código Postal",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'empresa_codigoPostal',
            value: state.empresa.empresa_codigoPostal,
            onChangeFunc: (e) => {
                if (e.target.value.length < 6) {
                    dispatch({ type: 'SET_CODIGO_POSTAL', payload: e.target.value.replace(/\D/g, "").slice(0, 5) })
                    setEdited(true)
                }
            },
        },
        {
            label: "Pais",
            input: true,
            type: 'text',
            disabled: true,
            fieldKey: 'empresa_idPais',
            style: 'col-span-2',
            value: infoByPostalCode.pais?.descripcionPais || '',
            onChangeFunc: () => { }
        },
        {
            label: "Estado",
            input: true,
            type: 'text',
            fieldKey: 'empresa_idEstado',
            style: 'col-span-2',
            disabled: true,
            value: infoByPostalCode.estado?.descripcionEstado || '',
            onChangeFunc: () => { }
        },
        {
            label: "Municipio",
            input: true,
            type: 'text',
            fieldKey: 'empresa_ciudad',
            style: 'col-span-2',
            disabled: true,
            value: infoByPostalCode.municipio?.descripcionMunicipio || '',
            onChangeFunc: () => { }
        },
        {
            label: "Colonia",
            select: true,
            options: infoByPostalCode.colonias || [],
            value: state.empresa.empresa_colonia || '',
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_COLONIA', payload: e })
                setEdited(true)
            },
            data: 'Colonia_Nombre',
            valueKey: 'Colonia_Id',
            fieldKey: 'empresa_colonia',
            style: !(state.empresa.empresa_colonia.length == 5 || infoByPostalCode.colonias.length > 0) ? 'hidden' : 'col-span-2',
            _conditional: () => {
                if (state.empresa.empresa_colonia.length == 5 || infoByPostalCode.colonias.length > 0) {
                    console.log("muestrate")
                    return true
                }
            },
        },
        {
            label: "Colonia",
            select: true,
            options: infoByPostalCode.colonias || [],
            value: state.empresa.empresa_colonia || '',
            style: 'col-span-2',
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_COLONIA', payload: e })
                setEdited(true)
            },
            data: 'Colonia_Nombre',
            valueKey: 'Colonia_Id',
            fieldKey: 'empresa_colonia',
            style: (state.empresa.empresa_colonia.length == 5 || infoByPostalCode.colonias.length > 0) ? 'hidden' : 'col-span-2',
            _conditional: () => {
                if (!(state.empresa.empresa_colonia.length == 5 || infoByPostalCode.colonias.length > 0)) {
                    return true
                }
                return false
            },
        },
        {
            label: "Localidad",
            input: true,
            type: 'text',
            fieldKey: 'empresa_localidad',
            style: 'col-span-2',
            value: state.empresa.empresa_localidad,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_LOCALIDAD', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Referencia",
            input: true,
            type: 'text',
            fieldKey: 'empresa_referencia',
            style: 'col-span-2',
            value: state.empresa.empresa_referencia,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_REFERENCIA', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Teléfono",
            input: true,
            type: 'text',
            fieldKey: 'empresa_telefonos',
            value: state.empresa.empresa_telefonos,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_TELEFONOS', payload: e.target.value.replace(/\D/g, "").slice(0, 10) })
                setEdited(true)
            },
        },
        {
            label: "Color",
            input: true,
            type: 'color',
            fieldKey: 'empresa_Color',
            value: state.empresa.empresa_Color,
            onChangeFunc: throttle((e) => {
                dispatch({ type: 'SET_COLOR', payload: e.target.value })
                setEdited(true)
            }, 300),
        },
        {
            label: "Añadir logotipo",
            custom: true,
            style: 'col-span-2 pt-7 pb-5 justify-center',
            customItem: ({ label }) =>
            (
                <>
                    <input type="file" accept="image/.jpg,.png"
                        onChange={(e) => imageHandler(e)}
                        style={{ display: 'none' }}
                        id="boton-imagen"
                        ref={btnImageR}
                    />

                    <Button
                        variant="contained"
                        value={state.fotoEmpleado}
                        className="buttonPrimary"
                        startIcon={<BadgeIcon />}
                        onClick={() => {
                            btnImageR.current.click()
                        }}
                        style={{ backgroundColor: '#1B2654', color: 'white', borderRadius: '10px', opacity: '85%' }}
                    >
                        {label}
                    </Button>
                </>
            ),
        },
        {
            label: "Añadir logotipo",
            custom: true,
            style: 'col-span-2 pt-3 flex justify-center',
            customItem: ({ label }) =>
            (
                <>
                    <div className="logoContent">
                        <div className="companyLogo">
                            <img
                                src={imagen ? imagen : (state.image !== '') ? `data:image/png;base64, ${state.image}` : imagenDefault}
                                key={imagenKey}
                                alt="Imagen seleccionada"
                                id="companyLogo"
                            />
                        </div>
                    </div>
                </>
            ),
        },
    ];
}

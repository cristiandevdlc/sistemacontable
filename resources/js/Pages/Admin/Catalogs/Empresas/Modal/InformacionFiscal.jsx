import '../../../../../../sass/Personas/_documentacion.scss'
import { useRef, useState, useEffect } from "react";
import BadgeIcon from "@mui/icons-material/Badge";
import { Button } from "@mui/material";

export default function InformacionFiscal(state, dispatch) {
    const btnSello = useRef()
    const btnCert = useRef()
    const [selloLabel, setSelloLabel] = useState('')
    const [certLabel, setCertLabel] = useState('')
    const [edited, setEdited] = useState(false)

    useEffect(() => {
        if (state.empresa.empresa_archivoKey !== '')
            setSelloLabel(`: 1 archivo`)
        else
            setSelloLabel('')
        if (state.empresa.empresa_SelloDigital !== '')
            setCertLabel(`: 1 archivo`)
        else
            setCertLabel('')
    }, [state.empresa.empresa_archivoKey, state.empresa.empresa_SelloDigital]);

    const selloHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelloLabel(': ACTUALIZAR 1 archivo')
        }
        dispatch({ type: 'SET_SELLO_DIGITAL', payload: file })
        setEdited(true)
    };

    const certHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCertLabel(': ACTUALIZAR 1 archivo')
        }
        dispatch({ type: 'SET_ARCHIVO_KEY', payload: file })
        setEdited(true)
    };

    useEffect(() => {
        edited && dispatch({ type: 'SET_CONFIRM', payload: true })
        !edited && dispatch({ type: 'SET_CONFIRM', payload: false })
    }, [edited])

    return [
        {
            label: "RFC",
            input: true,
            type: 'text',
            fieldKey: 'empresa_rfc',
            value: state.empresa.empresa_rfc,
            onChangeFunc: (e) => {
                if (e.target.value.length < 14)
                    dispatch({ type: 'SET_EMPRESA_RFC', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Regimen fiscal",
            select: true,
            options: state.regimens,
            value: state.empresa.empresa_idRegimenFiscal,
            onChangeFunc: (newValue) => {
                dispatch({ type: 'SET_IDREGIMENFISCAL', payload: newValue })
                setEdited(true)
            },
            data: 'catalogoRegimenFiscalSAT_descripcion',
            valueKey: 'catalogoRegimenFiscalSAT_id',
            fieldKey: 'empresa_idRegimenFiscal',
        },
        {
            label: `Sello${selloLabel}`,
            custom: true,
            customItem: ({ label }) =>
            (
                <>
                    <div className="pt-5">
                        <input type="file" accept=".cer"
                            onChange={(e) => selloHandler(e)}
                            style={{ display: 'none' }}
                            id="boton-sello"
                            ref={btnSello}
                        />

                        <Button
                            variant="contained"
                            className="buttonPrimary"
                            startIcon={<BadgeIcon />}
                            onClick={() => {
                                btnSello.current.click()
                            }}
                            style={{ backgroundColor: '#1B2654', width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: '85%' }}
                        >
                            {label}
                        </Button>
                    </div>
                </>
            ),
        },
        {
            label: "Contraseña Sello",
            input: true,
            type: 'password',
            autoComplete: 'off',
            fieldKey: 'empresa_passwordSello',
            value: state.empresa.empresa_passwordSello,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_PASSWORD_SELLO', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: `Key Certificado${certLabel}`,
            custom: true,
            customItem: ({ label }) =>
            (
                <>
                    <div className="pt-5">
                        <input type="file" accept=".key"
                            onChange={(e) => certHandler(e)}
                            style={{ display: 'none' }}
                            id="boton-cert"
                            ref={btnCert}
                        />
                        <Button
                            variant="contained"
                            valuer={state.empresa.empresa_archivoKey}
                            className="buttonPrimary"
                            startIcon={<BadgeIcon />}
                            onClick={() => {
                                btnCert.current.click()
                            }}
                            style={{ backgroundColor: '#1B2654', width: '100%', height: '52.13px', color: 'white', borderRadius: '10px', opacity: '85%' }}
                        >
                            {label}
                        </Button>
                    </div>
                </>
            ),
        },
        {
            label: "No.Certificado",
            input: true,
            type: 'text',
            fieldKey: 'empresa_noCertificado',
            value: state.empresa.empresa_noCertificado,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_NO_CERTIFICADO', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "No. Oficio",
            input: true,
            type: 'text',
            value: state.empresa.empresa_numeroOficio,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_NO_OFICIO', payload: e.target.value })
                setEdited(true)
            },
            fieldKey: 'empresa_numeroOficio',
        },
        {
            label: "No. Permiso",
            input: true,
            type: 'text',
            fieldKey: 'empresa_numeroPermiso',
            value: state.empresa.empresa_numeroPermiso,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_NO_PERMISO', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Usuario PAC",
            input: true,
            type: 'text',
            fieldKey: 'empresa_usuarioCertificado',
            value: state.empresa.empresa_usuarioCertificado,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_USUARIO_CERTIFICADO', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Contraseña PAC",
            input: true,
            type: 'password',
            autoComplete: 'new-password',
            fieldKey: 'empresa_passwordCertificado',
            value: state.empresa.empresa_passwordCertificado,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_PASSWORD_CERTIFICADO', payload: e.target.value })
                setEdited(true)
            },
        },
        {
            label: "Ruta facturas",
            input: true,
            fieldKey: 'empresa_RutaFacturacion',
            onlyUppercase: false,
            value: state.empresa.empresa_RutaFacturacion,
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_RUTA_FACTURACION', payload: e.target.value.replace(/\\/g, '/') })
                setEdited(true)
            },
        },
        {
            label: "Consultar Remisiones",
            check: true,
            fieldKey: 'empresa_ConsultaRemision',
            checked: state.empresa.empresa_ConsultaRemision,
            labelPlacement: 'end',
            style: 'justify-center',
            onChangeFunc: (e) => {
                dispatch({ type: 'SET_CONSULTA_REMISION', payload: e.target.checked ? "1" : "0" })
                setEdited(true)
            }
        },
    ];
}

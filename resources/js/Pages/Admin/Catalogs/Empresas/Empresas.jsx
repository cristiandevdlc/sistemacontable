import React from "react";
import FormData from 'form-data';
import { useState } from "react";
import { useEffect } from "react";
import { empresaValidations, initialState } from "./intEmpresa";
import request, { requestMultipart, validateInputs } from "@/utils";
import Datatable from "@/components/Datatable";
import LoadingDiv from "@/components/LoadingDiv";
import ListIcon from '@mui/icons-material/List';
import DetallesModal from "./Modal/DetallesModal";
import { useReducer } from "react";
import EmpresasContext from "@/Context/EmpresasContext";
import { reducer } from "./Reducer/EmpresasReducer";

export default function Empresas() {
    const [storeState, dispatch] = useReducer((state, action) => reducer(state, action), initialState)
    const [loadingState, setLoadingState] = useState({ comp: true, openModal: false })
    const [empresas, setEmpresas] = useState();

    const submitCuenta = async () => {
        const ruta = route("banco-empresa-cuenta.store")
        await request(ruta, "POST", storeState.cuentasBanco).then(() => {
            getBancos();
        });
        dispatch({ type: 'HANDLE_CLOSE_MODAL' })
    };

    const submit = async () => {
        // e.preventDefault();
        dispatch({ type: 'SET_ERRORS', payload: {} })
        const result = validateInputs(empresaValidations, storeState.empresa)
        if (!result.isValid) {
            dispatch({ type: 'SET_ERRORS', payload: result.errors })
            dispatch({ type: 'SUBMIT_EMPRESA', payload: false })
            return;
        }
        try {
            const ruta = storeState.action === storeState.catalog.ACTION.CREATE ? route("empresas.store") : route("empresas.update", storeState.empresa.empresa_idEmpresa);
            const method = "POST";

            const formData = new FormData();
            for (const key in storeState.empresa) {
                formData.append(key, storeState.empresa[key]);
            }
            if (storeState.action !== storeState.catalog.ACTION.CREATE) {
                formData.append('_method', 'PUT');
            }
            await requestMultipart(ruta, method, formData).then(() => {
                dispatch({ type: 'SET_STEP', payload: 0 })
                GetEmpresas();
                dispatch({ type: 'HANDLE_CLOSE_MODAL' })
            })
        } catch {
            dispatch({ type: 'SUBMIT_EMPRESA', payload: false })
        }
    }

    const getImagen = async (id) => {
        const response = await request(route("empresa-con-icono", id), 'GET');
        dispatch({ type: 'SET_IMAGE', payload: response.empresa_Logotipo })
        dispatch({
            type: 'SET_ARCHIVOS',
            payload: {
                empresa_archivoKey: response.empresa_archivoKey,
                empresa_SelloDigital: response.empresa_SelloDigital,
            }
        })
    };

    const getCuentasBanco = async () => {
        const response = await fetch(route("cuentas-banco-by-empresa", { id: storeState.empresa.empresa_idEmpresa }));
        const dataRes = await response.json();
        dispatch({ type: 'SET_CUENTAS_BANCO_LIST', payload: dataRes })
    }

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const GetEmpresas = async () => {
        const response = await fetch(route("empresas.index"));
        const dataRes = await response.json();
        setEmpresas(dataRes);
    };

    const getRegimen = async () => {
        const response = await fetch(route("sat/regimen-fiscal.index"));
        const dataRes = await response.json();
        dispatch({ type: 'SET_REGIMENS', payload: dataRes })
    };

    const getBancos = async () => {
        const response = await fetch(route("bancos.index"));
        const dataRes = await response.json();
        dispatch({ type: 'SET_BANCOS_LIST', payload: dataRes })
    };

    const empresaTimbres = async () => {
        const response = await request(route("obtener-timbres"), 'POST', { idEmpresa: storeState.empresa.empresa_idEmpresa }, { enabled: true, error: { message: 'No se encontrarón timbres de esta empresa', type: 'error' } });
        dispatch({ type: 'SET_TIMBRES', payload: response })
    };

    useEffect(() => {
        if (!storeState.regimens && storeState.open) {
            getRegimen();
        }
    }, [storeState.open]);

    useEffect(() => {
        if (!empresas) {
            GetEmpresas();
            getMenuName();
            getBancos()
        } else {
            setLoadingState({ ...loadingState, comp: false });
        }
    }, [empresas]);

    useEffect(() => {
        if (storeState.empresa.empresa_idEmpresa) {
            dispatch({ type: 'SET_OPEN', payload: true })
        }
    }, [storeState.empresa])

    useEffect(() => {
        if (storeState.loading.form) {
            if (storeState.aux === storeState.catalog.ACTION.EDIT_BANK_COUNT) {
                getCuentasBanco()
                return
            }
            if (storeState.aux === storeState.catalog.ACTION.TIMBRES) {
                empresaTimbres()
                return
            }
            dispatch({ type: 'SET_ACTION', payload: storeState.aux })
        }
    }, [storeState.loading.form])

    useEffect(() => {
        if (storeState.timbres !== '') {
            dispatch({ type: 'SET_ACTION', payload: storeState.aux })
        }
        if (storeState.cuentasBancoList !== null) {
            dispatch({ type: 'SET_ACTION', payload: storeState.aux })
        }
    }, [storeState.timbres, storeState.cuentasBancoList])

    useEffect(() => {
        storeState.submit && submit()
        storeState.submitCuenta && submitCuenta()
    }, [storeState.submit, storeState.submitCuenta])

    useEffect(() => {
console.log(storeState)
    }, [storeState])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loadingState.comp && <LoadingDiv />}
            {empresas && !loadingState.comp && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={empresas}
                        add={() => {
                            dispatch({ type: 'SET_ACTION', payload: storeState.catalog.ACTION.CREATE })
                            dispatch({ type: 'SET_OPEN', payload: true })
                        }}
                        columns={[
                            {
                                header: "Razón social",
                                accessor: 'empresa_razonSocial'
                            },
                            {
                                header: "Razón comercial",
                                accessor: 'empresa_razonComercial'
                            },
                            {
                                header: 'Acciones',
                                cell: eprops => (
                                    <>
                                        <div className='flex gap-3 justify-center text-black'>
                                            <button onClick={() => {
                                                getImagen(eprops.item.empresa_idEmpresa)
                                                dispatch({ type: 'SET_EMPRESA', payload: { ...eprops.item } })
                                            }}
                                                className='bg-[#1B2654] rounded-sm text-white'
                                            >
                                                <ListIcon />
                                            </button>
                                        </div>
                                    </>
                                )
                            },
                        ]}
                    />
                    <EmpresasContext.Provider value={{ storeState, dispatch, empresas}}>
                        <DetallesModal
                            state={storeState}
                            dispatch={dispatch}
                        />
                    </EmpresasContext.Provider>
                </div >
            )}
        </div >
    );
}

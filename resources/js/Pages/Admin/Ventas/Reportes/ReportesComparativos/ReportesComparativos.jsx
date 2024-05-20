import { FieldDrawer } from "@/components/DialogComp";
import request, { camionLogo, firstObj, moneyFormat, noty } from '@/utils'
import { useState } from "react";
import Datatable from "@/components/Datatable";
import { intData, intState } from "./IntComparativos";
import { Request } from "@/core/Request";
import { useEffect } from "react";
import { excelTemplate } from "./ExcelTemplate";
import { Checkbox, Divider, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

export default function ReporteComparativos() {
    const [data, setData] = useState(intData)
    const [state, setState] = useState(intState);
    const [tableCols, setTableCols] = useState([])
    const [optionsSelect, setOptionsSelect] = useState([])
    const [labelElevated, setLabelElevated] = useState(false);
    const [cellName, setCellName] = useState([])
    // const [optionsSelect, setOptionsSelect] = useState();

    const searchAñoCliente = async () => {
        const res = await Request._post(route('reporte-año-cliente', data))
        if (res.data.length > 0) {
            const keys = Object.keys(firstObj(res.data))
            showNotification("se encontraron registros", 'success', 'metroui', 'bottomRight', 3000);


            setOptionsSelect(keys.map(r => ({
                accessor: r,
                header: r,
                visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true,
            })))

            setState({
                ...state,
                comparativo: res
            })


        } else {


            showNotification("No se encontraron registros", 'error', 'metroui', 'bottomRight', 2000);

        }
    }

    const searchMesCliente = async () => {
        const res = await Request._post(route('reporte-mes-cliente', data))
        if (res.data.length > 0) {
            const keys = Object.keys(firstObj(res.data))
            showNotification("se encontraron registros", 'success', 'metroui', 'bottomRight', 3000);


            setOptionsSelect(keys.map(r => ({
                accessor: r,
                header: r,
                visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true,
            })))

            setState({
                ...state,
                comparativo: res
            })


        } else {


            showNotification("No se encontraron registros", 'error', 'metroui', 'bottomRight', 2000);

        }
    }
    const searchMesUnidad = async () => {
        const res = await Request._post(route('reporte-mes-unidad', data))

        if (res.data.length > 0) {
            showNotification("se encontraron registros", 'success', 'metroui', 'bottomRight', 3000);


            const keys = Object.keys(firstObj(res.data))

            setOptionsSelect(keys.map(r => ({
                accessor: r,
                header: r,
                visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true,
            })))
            setState({
                ...state,
                comparativo: res
            })


        } else {



            showNotification("se encontraron registros", 'error', 'metroui', 'bottomRight', 3000);

        }
    }


    const searchMesVendedor = async () => {
        const res = await Request._post(route('reporte-mes-vendedor', data))
        const keys = Object.keys(firstObj(res.data))

        setOptionsSelect(keys.map(r => ({
            accessor: r,
            header: r,
            visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true,
        })))
        setState({
            ...state,
            comparativo: res
        })
    }
    const searchMesVendedorEstacionario = async () => {
        const res = await Request._post(route('reporte-mes-vendedor-estacionario', data))
        const keys = Object.keys(firstObj(res.data))

        setOptionsSelect(keys.map(r => ({
            accessor: r,
            header: r,
            visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true,
        })))
        setState({
            ...state,
            comparativo: res
        })
    }

    const searchMesRuta = async () => {

        const res = await Request._post(route('reporte-mes-ruta', data))
        if (res.data.length > 0) {
            showNotification("Se encontraron registros", 'error', 'metroui', 'bottomRight', 3000);

            const keys = Object.keys(firstObj(res.data))
            setOptionsSelect(keys.map(r => ({
                accessor: r,
                header: r,
                visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true,
            })))
            setState({
                ...state,
                comparativo: res
            })




        } else {

            showNotification("No se encontraron registros", 'error', 'metroui', 'bottomRight', 3000);


        }
    }

    const searchMesRutaPortatil = async () => {
        const res = await Request._post(route('reporte-mes-ruta-portatil', data))
        const keys = Object.keys(firstObj(res.data))


        setOptionsSelect(keys.map(r => ({
            accessor: r,
            header: r,
            visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true,
        })))
        setState({
            ...state,
            header: r,
        })
    }

    const getComparativos = async () => setState({
        ...state,
        tipos: await Request._get(route('comparativos.index'))
    })

    const getExcel = () => {
        const datatableData = state.comparativo.data;
        const datatableColumns = optionsSelect.filter(column => column.visible);
        excelTemplate(
            datatableData,
            datatableColumns,
            excelName()
        );
    };

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat("es-mx").format(new Date()).replaceAll("/", "_");
        return `Reportes Comparativos$${fechaActual}`;
    };

    const getVisibleCells = () => {
        const columns = optionsSelect.map((item) => {
            if (item.visible) {
                return item.header;
            }
        });
        setCellName(columns)
    }

    const handleCellChange = (event) => {
        const { target: { value } } = event;
        const newColumns = optionsSelect.map((col) => ({
            ...col,
            visible: value.includes(col.header)
        }));
        setOptionsSelect(newColumns);
        setCellName(value);
    };

    useEffect(() => {
        if (cellName.length > 0) {
            setLabelElevated(true)
        } else {
            setLabelElevated(false)
        }
    }, [cellName]);

    useEffect(() => {
        const visibleColumnsArray = tableCols.filter(col => optionsSelect.includes(col.accessor));
        setTableCols(visibleColumnsArray);

    }, [optionsSelect]);

    useEffect(() => {
        getComparativos()
    }, [])

    useEffect(() => {
        (optionsSelect && optionsSelect) && getVisibleCells()
    }, [optionsSelect, optionsSelect])


    return (
        <div className="relative h-[100%] pb-4 px-3 -mt-4">
            <div className="flex relative gap-3 sm:flex-col md:flex-row h-[90%]">
                <div className="flex flex-col gap-2 pt-4 min-w-[300px]">
                    <div className="flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 ">
                        <FieldDrawer
                            fields={[
                                {
                                    label: "Reporte",
                                    select: true,
                                    fieldKey: "Reporte",
                                    value: data.tipoReporte,
                                    options: state.tipos,
                                    onChangeFunc: (e) =>
                                        setData({
                                            ...data,
                                            tipoReporte: e,
                                            fecha: ''
                                        }),
                                    data: 'nombre',
                                    valueKey: 'procedimiento',
                                },

                                {
                                    label: "Fecha",
                                    input: true,
                                    value: data.fecha,
                                    onChangeFunc: (e) => {
                                        let newValue = e.target.value;
                                        const selectedOption = state.tipos.find(option => option.procedimiento === data.tipoReporte);
                                        if (selectedOption) {
                                            const { patronfecha } = selectedOption;
                                            if (patronfecha === "MM") {
                                                newValue = Math.min(parseInt(newValue), 12);
                                            } else {
                                                (patronfecha === "YYYY")
                                                newValue = Math.min(parseInt(newValue), 2050);

                                            }
                                        }
                                        setData({
                                            ...data,
                                            fecha: newValue,
                                        });
                                    },
                                },

                            ]
                            }

                        />
                        <FormControl
                            sx={{
                                width: "270px",
                                background: "transparent",
                                marginTop: "2vh",
                                borderColor: "black",
                                color: "#4d4d4d",
                                fontSize: "14px",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    background: "white",
                                }
                            }}
                        >
                            <InputLabel
                                sx={{
                                    color: "#a3a3a3",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    fontFamily: "monserrat",
                                    left: "20px",
                                    padding: "1px 10px",
                                    backgroundColor: "white",
                                    transform: labelElevated ? 'none' : 'translate(-10px, 25px) ',
                                    top: "-10px",
                                    transition: "transform 0.2s, font-size 0.2s"
                                }}
                                htmlFor="select-component"
                            >Mostrar/Ocultar</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                sx={{
                                    background: "none",
                                    borderColor: "white",
                                    color: "#4d4d4d",
                                    fontSize: "14px",
                                    fontFamily: "monserrat",
                                    fontWeight: "bold",
                                    transform: "",
                                    textAlign: "start",
                                    marginTop: 'unset',
                                    width: '100%'
                                }}
                                value={cellName}
                                onChange={handleCellChange}
                                renderValue={(selected) => selected.join(" ")}
                                MenuProps={MenuProps}
                            >
                                {optionsSelect && optionsSelect.map((item, key) => (
                                    <MenuItem key={key} value={item.header}>
                                        <Checkbox checked={optionsSelect && optionsSelect[key] && optionsSelect[key].visible} />

                                        <ListItemText primary={item.header} />
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>

                        <button
                            className={`h-[48px] w-full mt-4 ${'bg-primary-color'} text-white rounded-lg`}
                            onClick={() => {
                                switch (data.tipoReporte) {
                                    case 'comparativokgañocliente':
                                        searchAñoCliente();
                                        break;
                                    case 'comparativokgmescliente':
                                        searchMesCliente();
                                        break;
                                    case 'comparativokgmesunidad':
                                        searchMesUnidad();
                                        break;
                                    case 'comparativokgmesvendedor':
                                        searchMesVendedor();
                                        break;
                                    case 'comparativokgmesvendedorESTACIONARIO':
                                        searchMesVendedorEstacionario();
                                        break;
                                    case 'comparativokgmesruta':
                                        searchMesRuta();
                                        break;
                                    case 'comparativokgmesrutaportatil':
                                        searchMesRutaPortatil();
                                        break;
                                    default:
                                        console.error('Procedimiento no reconocido');
                                        break;
                                }
                            }}
                        >
                            Buscar
                        </button>
                        <button
                            className={`h-[48px] w-full mt-4 ${`bg-excel-color`} text-white rounded-lg`}
                            onClick={() => getExcel()}
                        >
                            Exportar excel
                        </button>
                    </div>
                </div>

                <div className="relative col-span-10 mx-5 w-full mt-4">
                    {(state.comparativo && optionsSelect) ? (
                        <Datatable searcher={false} virtual={true} data={state.comparativo.data} columns={optionsSelect.filter(column => column.visible)} />
                    ) : (
                        <>
                            <div className='mt-[-50px] flex  flex-col relative h-full items-center overflow-hidden self-center justify-center'>
                                <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                                <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
function showNotification(text, type, theme, layout, timeout) {
    new Noty({
        text: text,
        type: type,
        theme: theme,
        layout: layout,
        timeout: timeout
    }).show();

}
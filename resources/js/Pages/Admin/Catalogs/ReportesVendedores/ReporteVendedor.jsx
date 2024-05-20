import { FieldDrawer } from "@/components/DialogComp";
import request, { camionLogo, firstObj, moneyFormat, noty, numberFormat, tipoNoVariable, tiposServEstacionario, tiposServPortatil, variacionesTipo } from '@/utils'
import { useState } from "react";
import Datatable from "@/components/Datatable";
import { intData, intState } from "./intVendedor";
import { Request } from "@/core/Request";
import { useEffect } from "react";
import { excelTemplate } from "./excelTemplate";
import { Checkbox, Divider, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { PDFViewer } from "@react-pdf/renderer";
import ReportePDF from "./ReporteVendedorPDF";
import ReImpresionEstacionarioPDF from "./ReImpresionEstacionarioPDF";
import ReImpresionPortatilPDF from "./ReImpresionPortatilPDF";
import { Data } from "@react-google-maps/api";
import LoadingDiv from '@/components/LoadingDiv'
import PDFVentaEstacionario from "../../Ventas/VentasEstacionario/PDFVentaEstacionario";

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

export default function Reportedatoss() {
    const [data, setData] = useState(intData)
    const [state, setState] = useState(intState);
    const [tableCols, setTableCols] = useState([])
    const [optionsSelect, setOptionsSelect] = useState([])
    const [labelElevated, setLabelElevated] = useState(false);
    const [cellName, setCellName] = useState([])
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [selected, setSelected] = useState([]);

    const searchVendedores = async () => {
        const res = await Request._post(route('vendedoresReporte', data));

        if (res.Procedimiento.length === 0) {
            setOptionsSelect([]);
            setState({
                ...state,
                datos: res,

            });
        } else {
            const keys = Object.keys(firstObj(res.Procedimiento));
            setOptionsSelect(keys.map(r => ({
                accessor: r,
                header: r,
                visible: optionsSelect.find(a => a.accessor == r)?.visible ?? true
            })));
            setState({
                ...state,
                datos: res,
                descuento: res.descuento,
                total: res.total,
                contado: res.contado,
                credito: res.credito,
                totalKg: res.totalKg,
                totalLts: res.totalLts
            })
        }
    };


    const getTiposServicio = async () => setState({
        ...state,
        tiposServicio: await Request._get(route('tipos-servicios.index'))
    })

    const getExcel = () => {
        const datatableData = state.datos.Procedimiento;
        const datatableColumns = optionsSelect.filter(column => column.visible);
        excelTemplate(
            datatableData,
            datatableColumns,
            excelName()
        );
    };

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat("es-mx").format(new Date()).replaceAll("/", "_");
        return `Reportes datoss$${fechaActual}`;
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

    const handlePDFButtonClick = () => {
        setLoadingPDF(true);
        setState({ ...state, showPDF: !state.showPDF });
        setLoadingPDF(false);
    };

    const handleReImpresion = () => {
        setLoadingPDF(true);
        setState({ ...state, showReImpresion: !state.showReImpresion });
        setLoadingPDF(false);
    };


    const onSelect = ({ selectedRowKeys }) => {
        setSelected(selectedRowKeys)
    }

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
        getTiposServicio()
    }, [])


    useEffect(() => {
        (optionsSelect && optionsSelect) && getVisibleCells()
    }, [optionsSelect, optionsSelect])


    const Tanques = async () => {
        const res = await Request._post(route('tanquesReporte', {nControl:selected?.[0]?.nControl}));
        // console.log('selected',  selected[0].nControl)
        setState({ ...state, Tanques: res.Procedimiento });
        // console.log('res',  res.Procedimiento)
   
    }

    useEffect(() => {
        if (selected && selected.length > 0) {
            Tanques();
        }
        console.log('selected', selected)
    }, [selected?.[0]?.nControl]);
    

    return (
        <div className="relative h-[100%] pb-4 px-3 -mt-4">
            <div className="flex relative gap-3 sm:flex-col md:flex-row h-[90%]">
                <div className="flex flex-col gap-2 pt-4 min-w-[300px]">
                    <div className="flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 ">
                        <FieldDrawer
                            fields={[
                                {
                                    label: 'Fecha Inicial',
                                    input: true,
                                    type: 'date',
                                    value: data.fechaInicial,
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        fechaInicial: e.target.value,
                                    })
                                },
                                {
                                    label: 'Fecha Final',
                                    input: true,
                                    type: 'date',
                                    value: data.fechaFinal,
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        fechaFinal: e.target.value,
                                    })
                                },
                                {
                                    label: "Tipos de Servicio",
                                    select: true,
                                    fieldKey: "Reporte",
                                    value: data.tipos,
                                    options: state.tiposServicio,
                                    onChangeFunc: (e) =>
                                        setData({
                                            ...data,
                                            tipos: e,
                                        }),
                                    data: 'tipoServicio_descripcion',
                                    valueKey: 'tipoServicio_idTipoServicio',
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
                            className={`h-[48px] w-full mt-4 ${`bg-primary-color`} text-white rounded-lg`}
                            onClick={() => searchVendedores()}
                        >
                            Buscar
                        </button>
                        <button
                            className={`grid h-[48px] w-full bg-pdf-color text-white rounded-lg text-center content-center cursor-pointer non-selectable mt-4`}
                            onClick={handlePDFButtonClick}
                        >
                            {loadingPDF ? <LoadingDiv /> : (state.showPDF ? 'Ocultar PDF' : 'Visualizar PDF')}
                        </button>
                        <button
                            className={`h-[48px] w-full mt-4 ${`bg-excel-color`} text-white rounded-lg`}
                            onClick={() => getExcel()}
                        >
                            Exportar excel
                        </button>

                        <button
                            className={`grid h-[48px] w-full bg-[#EB5D16] text-white rounded-lg text-center content-center cursor-pointer non-selectable mt-4`}
                            onClick={handleReImpresion}
                        >
                            {loadingPDF ? <LoadingDiv /> : (state.showReImpresion ? 'Ocultar PDF' : 'Reimprimir PDF')}
                        </button>
                    </div>
                    <div className='flex flex-col gap-2 pt-4 min-w-[300px]'>
                        <div className='grid grid-cols gap-4'>
                            <div className='flex !text-[12px] flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                                <div className='flex justify-between'>
                                    <span>Total Kg:</span>
                                    <span>{numberFormat(state.totalKg)}</span>
                                </div>
                                <Divider color='#5F6C91' />
                                <div className='flex justify-between'>
                                    <span>Total Lts:</span>
                                    {numberFormat(state.totalLts)}
                                </div>
                                <Divider color='#5F6C91' />
                                <div className='flex justify-between'>
                                    <span>Contado:</span>
                                    {numberFormat(state.contado)}
                                </div>
                                <Divider color='#5F6C91' />
                                <div className='flex justify-between'>
                                    <span>Crédito:</span>
                                    {numberFormat(state.credito)}
                                </div>
                                <Divider color='#5F6C91' />
                                <div className='flex justify-between'>
                                    <span>Descuentos:</span>
                                    {numberFormat(state.descuento)}
                                </div>
                                <Divider color='#5F6C91' />
                                <div className='flex justify-between'>
                                    <span>Total:</span>
                                    {numberFormat(state.total)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative col-span-10 mx-5 w-full mt-4">
                    {(state.showPDF) && LoadingDiv && (
                        <PDFViewer width="100%" height="100%">
                            <ReportePDF
                                data={data}
                                state={state.datos}
                            />
                        </PDFViewer>
                    )}
                    {console.log(firstObj(selected))}
                    {(state.showReImpresion && selected.length) && LoadingDiv && (
                        <PDFViewer width="100%" height="100%">
                            {tiposServPortatil.includes(data.tipos) && <ReImpresionPortatilPDF data={firstObj(selected)}  state={state.Tanques}   />}
                            {tiposServEstacionario.includes(data.tipos) && <ReImpresionEstacionarioPDF data={firstObj(selected)} />}
                        </PDFViewer>
                    )}

                    {!state.showPDF && !state.showReImpresion && LoadingDiv && (
                        <Datatable
                            selection='single'
                            selectedData={selected}
                            selectionFunc={onSelect}
                            searcher={false}
                            virtual={true}
                            data={state.datos.Procedimiento}
                            columns={optionsSelect.filter(column => column.visible)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { DataGrid, Column, Scrolling, Selection, Export, Lookup, MasterDetail } from 'devextreme-react/data-grid';
import NoDataImg from '../../png/camion.png'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import '../../sass/TablesComponent/_tablesStyle.scss'
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from "react-router-dom";
import { useContext } from "react";

import UserMenusContext from "@/Context/UserMenusContext";
import { Tooltip } from '@mui/material';
import e from 'cors';
import _ from 'lodash';


/*  PROPS 
data: Array = Datos que muestra la tabla
    columns: Array = Columnas a mostrar en la tabla
            -> header: String = Header (nombre) de la columna
            -> accessor: String = Nombre del campo a acceder de data 
            -> cell: function/html = Propiedad a la que se le pasa el html que se desea renderizar en la celda (No obligatorio)
            -> tableId: String = ID de la tabla (No obligatorio si es solo una tabla) que se usa principalmente para el buscador 
            -> edit: function/html = Propiedad a la que se le pasan las funciones o html que realizará al editar
            -> custom: function/html = Propiedad a la que se le pasan las funciones o html custom que tendrá el modelo (como descargar pdf, abrir otro modal etc)
    virtual: boolean = Indica si se usará una tabla virtualizada (tabla con miles de datos) o una tabla que se renderiza toda la data de forma normal (No obligatorio)
    add: function = Si se pasa esta propiedad, se renderiza el boton de agregar, esta recibira una funcion (No obligatoria)
    searcher: boolean = Decide si se renderiza el buscador de la tabla
    tableRef: ref = Crea una referencia a la tabla (Unicamente virtualizada, no obligatorio)
    rowId: String = ID del renglon de la tabla (Unicamente virtualizada)
    selection: String = Habilita la seleccion de la tabla (Unicamente virtualizada, no obligatoria) con las opciones 'multiple' y 'single'
    selectedData: Array = Datos seleccionados (No obligatorio)
    selectionFunc: function = Funcion de seleccion de registros/renglon
    rowClass: String = recibe las clases de estilo para los renglones de la tabla normal
    si encapsulas la tabla en <div> quitar las clase del containerTable
    */

const Datatable = (props) => {
    const location = useLocation();
    const tableRef = useRef();
    const [filteredData, setFilteredData] = useState()
    const [searchTerm, setSearchTerm] = useState('');
    const [lookupFilter, setLookupFilter] = useState([])
    const [postPermission, setPostPermission] = useState(false);
    const [putPermission, setPutPermission] = useState(false);
    const [specialPermission, setSpecialPermission] = useState(false);
    const { userMenus, selectedMenu, SetSelectedMenuFunc, state } = useContext(UserMenusContext);
    const search = () => {
        var input = document.getElementById("search-input-datatable")
        var table = document.getElementById("datatable")
        var tr = table.getElementsByTagName("tr")
        var filter = input.value.toUpperCase()
        for (let i = 0; i < tr.length; i++) {
            for (let j = 0; j < props.columns.length; j++) {
                var td = tr[i].getElementsByTagName("td")[j];
                if (td) {
                    var txtValue = td.textContent || td.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                        break;
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
    }
    useEffect(() => {
        if (Array.isArray(state.userMenus)) {
            const url = location.pathname.substring(1)
            let result = null;
            state.userMenus.every((um1) => {
                if (um1.menu_url === url) {
                    result = um1;
                    return false
                } else {
                    um1.childs.every((um2) => {
                        if (um2.menu_url === url) {
                            result = um2;
                            return false
                        } else {
                            um2.childs.every((um3) => {
                                if (um3.menu_url === url) {
                                    result = um3;
                                    return false
                                } else {
                                    return true
                                }
                            })
                            return (result === null)
                        }
                    })
                    return (result === null)
                }
            })
            if (result !== null) {
                setPostPermission(result.pivot.usuarioxmenu_alta == 1 ? true : false)
                setPutPermission(result.pivot.usuarioxmenu_cambio == 1 ? true : false)
                setSpecialPermission(result.pivot.usuarioxmenu_especial == 1 ? true : false)
            }
        }
    }, [state.userMenus]);
    const searchVirtual = () => {
        var id = props.tableId ?? "datagrid"
        var table = document.getElementById(id)
        const trElements = table.querySelectorAll('tr');
        var filter = searchTerm.toUpperCase()
        trElements.forEach((tr, index) => {
            var x = tr.querySelectorAll('[role="gridcell"]')
            if (x.length > 0) {
                const contentArray = Array.from(x).map((td) => td.textContent);
                contentArray.forEach((td) => {
                    if (td.toUpperCase().indexOf(filter).toString() > -1) {
                        tr.style.display = "";
                        return;
                    } else {
                        tr.style.display = "none";
                    }
                })
            }
        })
    }
    const allVisible = () => {
        var table = document.getElementById("datatable")
        var tr = table.getElementsByTagName("tr")
        for (let i = 0; i < tr.length; i++) {
            tr[i].style.display = "";
        }
        []
    }
    const allVisibleVirtual = () => {
        var id = props.tableId ?? "datagrid"
        var table = document.getElementById(id)
        const trElements = table.querySelectorAll('tr');
        var filter = searchTerm.toUpperCase()
        trElements.forEach((tr, index) => {
            tr.style.display = "";
            // var x = tr.querySelectorAll('[role="gridcell"]')
            // if(x.length > 0){
            //     const contentArray = Array.from(x).map((td) => td.textContent);
            //     contentArray.forEach((td) => {
            //         if (td.toUpperCase().indexOf(filter) > -1) {
            //             tr.style.display = "";
            //             return;
            //         } else {
            //             tr.style.display = "none";
            //         }
            //     })
            // }
        })
    }


    useEffect(() => {
        if (!props.virtual) {
            if (searchTerm != "") {
                search()
            } else {
                allVisible()
            }
        } else {
            // if (searchTerm != "") {
            //     searchVirtual()
            // } else {
            //     allVisibleVirtual()
            // } 
            if (props.data) {
                if (searchTerm != "") {
                    const accessors = props.columns.map(c => {
                        if (c.lookup) return c.lookup.displayExpr
                        return c.accessor
                    }).filter(a => a != null || a != undefined)
                    const filteredResults = props.data.filter(reg => {
                        const rowValues = Object.values(reg).some(value => {
                            if (typeof value === 'string') return value.toLowerCase().includes(searchTerm.toLowerCase());
                            if (typeof value === 'object') {
                                return accessors
                                    .some(acc => (value ? `${value[acc]}` : '')
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase()))
                            }
                            return false;
                        });
                        return rowValues;
                    });
                    setFilteredData(filteredResults);
                } else
                    setFilteredData(props.data);
            }
        }
    }, [searchTerm, props.data])

    const handleSelection = () => {
        if (props.selection)
            if (typeof props.selection === 'object') {
                return props.selection
            } else {
                return { mode: props.selection }
            }
        else
            return { mode: 'none' }
    }
    return (
        <>
            {
                (!props.add) && (props.searcher === false) ? null : (
                    <div id='topTableActions' className='relative grid justify-between grid-cols-2 m-3'>
                        <>
                            <div className='flex items-center' >
                                {(postPermission && props.add) &&
                                    <button className='btnAgregar' onClick={props.add}>Agregar</button>
                                }
                            </div>
                            <div className='flex justify-end min-h-[3rem]  ' >
                                {
                                    (props.searcher === false) ? null : (
                                        <div className='grid justify-items-end' >
                                            <input id='search-input-datatable' className='h-12 search-input-datatable' type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                            <label htmlFor="search-input-datatable" className='non-selectable'><SearchIcon className={'search-icon'} /></label>
                                        </div>)
                                }
                            </div>
                        </>
                    </div>
                )
            }
            <div className={props.virtual ? `virtualTable blue-scroll ${props.className || ''}` : `containerTable ${props.className || ''}`}>
                {filteredData && props.columns && props.virtual === true &&
                    <DataGrid
                        className='sm:min-w-[1100px] md:min-w-[10px]'
                        id={props.tableId ?? 'datagrid'}
                        ref={props.tableRef}
                        dataSource={props.searcher === false ? props.data : filteredData}
                        columnAutoWidth={false}
                        keyExpr={props.rowId}
                        showBorders={true}
                        showRowLines={true}
                        width={props.width}
                        height={props.height}
                        editing={{
                            mode: "cell",
                            allowUpdating: props.handleRowUpdating ? true : false,
                            allowDeleting: false
                        }}
                        selection={handleSelection()}
                        showColumnLines={props.showColumnLines ?? false}
                        selectedRowKeys={props.selectedData}
                        onSelectionChanged={props.selectionFunc}
                        onRowUpdating={props.handleRowUpdating}
                        onContentReady={props.onContentReady}
                        onRowRemoving={props.handleRowRemoving}
                        // editing={props.editingMode}
                        hoverStateEnabled={true}
                        elementAttr={{ class: `data-table ${props.tableClassName}` }}
                        onCellPrepared={(e) => {
                            if (e.rowType === 'header') {
                                e.cellElement.setAttribute('data-label', e.column.caption);
                            } else {
                                e.cellElement.setAttribute('data-label', e.column.caption);
                            }
                        }}
                        onEditorPreparing={props.onEditorPreparing}
                    >
                        <Scrolling mode="virtual" />
                        {props.selection &&
                            <Selection mode={{ ...props.selection }}
                                showCheckBoxesMode='always'
                                selectAllMode='allPages'
                                allowSelectAll={false}
                            />
                        }

                        {props.columns &&
                            props.columns.map((column, index) => (
                                (column.edit || column.custom || column.cell) ? (
                                    <Column
                                        key={index}
                                        type="buttons"
                                        caption={column.header}
                                        cellRender={(rowData) => {
                                            return (
                                                <>
                                                    {((!column._editConditional || (column._editConditional && column._editConditional({ item: rowData.data }))) &&
                                                        (putPermission === true && column.edit)) &&
                                                        <button className="material-icons" onClick={() => column.edit({ item: rowData.data })}>edit</button>}
                                                    {((!column._customConditional || (column._customConditional && column._customConditional({ item: rowData.data }))) &&
                                                        (specialPermission && column.custom)) &&
                                                        <column.custom item={{ ...rowData.data }} {...props} />}
                                                    {(column.cell && (!column._cellConditional || (column._cellConditional && column._cellConditional({ item: rowData.data })))) && column.cell({ item: rowData.data, ...props })}

                                                </>
                                            );
                                        }}
                                        name={column.cell ? `button-${index}` : undefined}
                                        alignment={column.alignment ?? 'center'}
                                        allowResizing={column.allowResizing ?? false}
                                        width={column.width && column.width}
                                        dataType={column.dataType}
                                    >
                                    </Column>
                                ) : (column.cell) ? (
                                    <Column
                                        key={index}
                                        type="buttons"
                                        caption={column.header}
                                        cellRender={(rowData) =>
                                            column.cell({ item: rowData.data, ...props })
                                        }
                                        name={column.cell ? `button-${index}` : undefined}
                                        alignment={column.alignment ?? 'center'}
                                        allowResizing={column.allowResizing ?? false}
                                        width={column.width && column.width}
                                        dataType={column.dataType}
                                        format={column.format}
                                    >
                                    </Column>
                                ) : (column.lookup) ? (
                                    <Column
                                        key={index}
                                        caption={column.header}
                                        dataField={column.accessor}
                                        name={column.cell ? `button-${index}` : undefined}
                                        alignment={column.alignment ?? 'center'}
                                        allowResizing={column.allowResizing ?? false}
                                        width={column.width && column.width}
                                        dataType={column.dataType}
                                        setCellValue={column.setCellValue}
                                        allowEditing={column.allowEditing ?? true}
                                    >
                                        <Lookup
                                            dataSource={
                                                /* column.lookup.filteredData ?
                                                    column.lookup.filteredData({ filter: column.filterId ?? [], self: column.lookup }) : */
                                                column.lookup.dataSource /* ?? [] */
                                            }
                                            displayExpr={column.lookup.displayExpr}
                                            valueExpr={column.lookup.valueExpr}
                                        // { ...column.lookup}
                                        />
                                    </Column>
                                ) : Array.isArray(column.accessor) ? (
                                    <Column
                                        key={index}
                                        caption={column.header}
                                        calculateCellValue={(rowData) => {
                                            let fullValue = ''
                                            column.accessor.map((item, i) => {
                                                fullValue += rowData[item] + ' '
                                            })
                                            return fullValue.slice(0, -1)
                                        }}
                                        name={column.cell ? `button-${index}` : undefined}
                                        alignment={column.alignment ?? 'center'}
                                        allowResizing={column.allowResizing ?? false}
                                        dataType={column.dataType}
                                        width={column.width && column.width}
                                        allowEditing={column.allowEditing ?? true}
                                        format={column.format}

                                    />
                                ) :
                                    <Column
                                        key={index}
                                        dataField={column.accessor ?? "-"}
                                        caption={column.header}
                                        name={column.cell ? `button-${index}` : undefined}
                                        alignment={column.alignment ?? 'center'}
                                        allowResizing={column.allowResizing ?? false}
                                        allowEditing={column.allowEditing ?? true}
                                        dataType={column.dataType}
                                        width={column.width && column.width}
                                        format={column.format}
                                    />
                            ))}
                        {props.masterDetail && <MasterDetail enabled={true} component={props.masterDetail} />}
                    </DataGrid>
                }

                {props.data && props.columns && !props.virtual &&

                    <table id={props.tableId ?? 'datatable'} ref={tableRef} className='data-table'>
                        <thead className='headerTable'>
                            <tr scope="col">
                                {props.columns &&
                                    props.columns.map((head, index) => {
                                        return (
                                            <th key={index}>
                                                {(!head.edit && !head.custom) ? head.header : null}
                                                {
                                                    ((putPermission && head.edit) || (specialPermission && head.custom)) && head.header
                                                }
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {props.data &&
                                props.data.length > 0 ? (
                                props.data.map((reg, i) => {
                                    const rowClass = props.rowClass ? props.rowClass({ item: reg }) : "";
                                    return (
                                        <tr id='tr' key={i} className={`table-hover ${rowClass}`} onClick={props.selectionFunc}>
                                            {props.columns &&
                                                props.columns.map((col, index) => {
                                                    const colClass = col.colClass ? col.colClass({ item: reg }) : "";
                                                    return (
                                                        <td key={index} data-label={`${col.header}`} className={`table-item ${colClass}`}>
                                                            {/* {
                                                                `${(putPermission && col.edit)}  ${(specialPermission && col.custom)}`
                                                            } */}
                                                            {
                                                                ((putPermission && col.edit) || (specialPermission && col.custom)) &&
                                                                <>
                                                                    {
                                                                        (putPermission === true && col.edit) &&
                                                                        <Tooltip title="Editar">
                                                                            <button className="material-icons" onClick={() => col.edit({ item: reg })}>edit</button>
                                                                        </Tooltip>
                                                                    }
                                                                    {(specialPermission && col.custom) && <col.custom item={{ ...reg }} {...props} />}
                                                                </>
                                                            }
                                                            {
                                                                // ((!col.edit) && (!col.custom)) &&
                                                                <>
                                                                    {col.cell && <col.cell item={{ ...reg }} {...props} />}
                                                                    {(!col.cell && !col.edit && !col.custom) &&
                                                                        (
                                                                            Array.isArray(col.accessor) ?
                                                                                (col.accessor.map((item) => reg[item] + ' '))
                                                                                : _.get(reg, col.accessor) /* (reg[col.accessor] ?? "-") */
                                                                        )
                                                                    }
                                                                </>
                                                            }
                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td className='relative' colSpan={props.columns.length}>
                                        <div className='flex place-content-center'>
                                            <img className='scale-50 non-selectable' src={NoDataImg} alt="" />
                                            <span className='absolute left-[0] right-[0] top-[70%] m-auto text-center'>No se encontraron registros.</span>
                                        </div>
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                        {/* {(filteredData && props.prev && props.next) &&
                        filteredData.length > 0 &&
                        <tfoot className='sticky w-full h-16 text-center -bottom-1'>
                            <tr>
                                <td colSpan={props.columns.length}>
                                    <div className='flex items-center justify-between pl-12 pr-12'>
                                        <label>{props.current_page} of {props.total_pages}</label>
                                        <div className='flex items-center gap-x-2'>
                                            <div className='flex items-center'>
                                                {props.current_page > 1 &&
                                                    <button onClick={props.prev}>
                                                        <ArrowBackIosIcon />
                                                    </button>
                                                }
                                            </div>
                                            <div>
                                                {pagination().map((pageNumber, index) => (
                                                    <button key={index} disabled={pageNumber === '...'} >{pageNumber}</button>
                                                ))}
                                            </div>
                                            <button onClick={props.next}>
                                                <ArrowForwardIosIcon />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    } */}
                    </table>
                }
            </div >
        </>
    )
}

export default Datatable
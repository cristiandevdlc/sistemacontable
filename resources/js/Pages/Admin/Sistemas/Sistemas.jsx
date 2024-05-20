import React, { useEffect, useState } from "react";
import { FormControlLabel, Checkbox} from "@mui/material";
import ArrayStore from "devextreme/data/array_store";
import SelectComp from "@/components/SelectComp";
import LoadingDiv from "@/components/LoadingDiv";
import TextInput from "@/components/TextInput";
import DataSource from "devextreme/data/data_source";
import DataGrid, { Column, Editing } from "devextreme-react/data-grid";
import request, { noty } from "@/utils";



const AuditoriaInterna = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState([]);
    const [departamento, setDepartamento] = useState([]);
    const [persona, setPersona] = useState([]);
    const [ConceptoRevision, setConceptoRevision] = useState();
    const [selectedItemKeys, setSelectedItemKeys] = useState();
    const [addedRows, setAddedRows] = useState([]);
    const [mayusculas,setMayusculas] = useState('');

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };

    const [data, setData] = useState({
        idUsuarioCaptura: 0,
        idDepartamento: 0,
        departamento: 0,
        detalles: [],
        idInventarioEquipos: "",
        fechaCaptura: "",
        idempresa: 0,
        estatus: 1,
        descripcionEquipo: "",
        DescripcionRevision: "",
        idConceptoRevision: 0,
        idPersona: "",
    });
   
    //funciones para ver el id que cual se esta seleccionando //
    const dataSource = new DataSource({
        store: new ArrayStore({
            data: data.detalles,
        }),
    }); 
    
    const handleAddButton = () => {
        closedialog(addedRows, data);
    };
    
    const handleIdUsuario = async (idUsuario) => {
        setData({
            ...data,
            idUsuarioCaptura: idUsuario,
        });
    };


    //PETICIONES A LA BASE DE DATOS
    const getUsuario = async () => {
        const response = await fetch(route("usuarios.index"));
        const data = await response.json();
        setUsuario(data);
    };

    const getConceptoRevision = async () => {
        const response = await fetch(route("conceptosRevision.index"));
        const data = await response.json();
        //filtramos los datos donde el estatus sea igual a 1 
        const conceptosEstatus = data.filter(item => item.estatus === "1");
        setConceptoRevision(conceptosEstatus);
        
    };

    const getPersona = async () => {
        const responseT = await fetch(route("personas.index"));
        const dataT = await responseT.json();
        const personas = dataT.map(supervisor => {
            const nombreCompleto = `${supervisor.Nombres} ${supervisor.ApePat} ${supervisor.ApeMat}`;
            return {
                ...supervisor,
                NombreCompleto: nombreCompleto
            };
        });
        console.log("personas", personas)
        setPersona(personas);

    };
    const getDepartamento = async () => {
        const response = await fetch(route("departamento.index"));
        const data = await response.json();
        console.log("depas",data)
        setDepartamento(data);
    };
      

    const Mayusculas = (e) =>{
        setMayusculas(e.target.value.toUpperCase());
    };

    const submit = async (e) => {
        e.preventDefault();//esto previene el envio del formulario por defecto 
        //validamos los campos esten completos
        if(!data.idPersona || !data.idDepartamento || !data.descripcion){
            noty('Favor de ingresar datos', 'error')
            return;
        }
        const requestBody2 = { auditorias: data.detalles, departamento: data.idDepartamento, modelo: data.descripcion, IdPersona: data.idPersona };
        const requestDataDetalle = await request(route("sistemaAuditoria.store"), 'POST', requestBody2)
        
        location.reload();
    };
   
    //Cargamos nuestros metodos GET
    useEffect(() => {
        document.title = "Intergas | Auditorias Sistema";
        if (!ConceptoRevision) {
            getUsuario();
            getDepartamento();
            getConceptoRevision();
            getPersona();
            getMenuName();
        } else {
            setData({ ...data, detalles: ConceptoRevision })
        }
    }, [ConceptoRevision]);

    useEffect(() => {
        console.log("data", data);
    }, [data]);

    return (
        <>
            {loading && <LoadingDiv />}
            <div>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <SelectComp
                            label="Persona"
                            options={persona}
                            value={data.idPersona || ""}
                            data="NombreCompleto"
                            valueKey="IdPersona"

                            onChangeFunc={(e) => {
                                setData({
                                    ...data,
                                    idPersona: e,
                                });
                            }}
                        />
                    </div>
                    <div>
                        <div>
                            <SelectComp
                                label="Departamentos"
                                options={departamento}
                                value={data.idDepartamento}
                                data="nombre"
                                valueKey="IdDepartamento"
                                onChangeFunc={(e) => {
                                    setData({
                                        ...data,
                                        idDepartamento: e,
                                    });
                                }}
                                renderValue={(selectedOption) => (
                                    <div>
                                        <span>{selectedOption.IdDepartamento}</span>
                                        <span>{selectedOption.nombre}</span>
                                    </div>
                                )}
                                renderOption={(option) => (
                                    <div>
                                        <span>{option.IdDepartamento}</span>
                                        <span>{option.nombre}</span>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <TextInput className="block w-full mt-1 texts" type="text" label="Modelo PC" name="Modelo PC"  value={data.descripcion} isFocused={true} maxLength="50" 
                         onChange={(e) => {
                                setData({
                                    ...data,
                                    descripcion: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className=" overflow-hidden">
                <div className="containerTable" >
                    <DataGrid
                        dataSource={data.detalles ?? []}
                        showBorders={true}
                        selectedRowKeys={selectedItemKeys}
                        showRowLines={true}
                        showColumnLines={true}
                        paging={false}
                        virtual={true}
                    >
                        <Editing mode="cell" allowUpdating={true}/>
                        <Column
                            alignment="center"
                            dataField="DescripcionRevision"
                            caption="Descripción"
                            allowEditing={false}
                        />
                        <Column caption="Comentarios" dataField="descripcionEquipo"  alignment="center" onChange={Mayusculas} allowEditing={true}/>
                        {/* <Column dataField="estatus" alignment="center" allowEditing={false} cellRender={(rowData, index) => {
                                const dataIndex = rowData.rowIndex;
                                const isChecked = rowData.data.estatus === "1";
                                return (
                                    <>
                                        <FormControlLabel
                                            control={
                                                <Checkbox sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }} checked={isChecked} onChange={(e) => { const updatedDetalles = [...data.detalles]; updatedDetalles[dataIndex].estatus = e.target.checked ? "1" : "0"; setData({ ...data, detalles: updatedDetalles }); }} />
                                            }
                                        />
                                    </>
                                );
                            }}
                        /> */}
                    </DataGrid>
                </div>
                <div className="pt-3">
                    <button onClick={submit} className="bg-[#1B2654] rounded-lg text-white w-full h-[48px]">Enviar</button>
                </div>
            </div> 
        </>
    );

};

export default AuditoriaInterna;

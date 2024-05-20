
export const unidadCRUD = (data, setData, action, tiposServicio, areas, marcas) => {
    const getYears = () => {
        const newAños = []

        const newYearsData = marcas.filter(mar => mar.idMarca == data.modelo?.marca?.idMarca)[0]?.modelos.
            filter(mod => mod.idModelo == data.modelo?.idModelo)[0]?.modelo_vehiculo?.
            forEach(year => !newAños.some(ny => ny.año == year.año) && newAños.push(year))
        return newAños;
    }

    const getCilindros = () => {
        const cilindros = marcas.filter(mar => mar.idMarca == data.modelo?.marca?.idMarca)[0]?.modelos.
            filter(mod => mod.idModelo == data.modelo?.idModelo)[0]?.modelo_vehiculo?.filter(cil => cil.año == data.modelo?.año)

        return cilindros ?? []
    }

    return [
        {
            label: "Numero Comercial",
            input: true,
            type: "text",
            style: `${action !== "show" && "col-span-6"}`,
            fieldKey: "unidad_numeroComercial",
            value: data.unidad_numeroComercial,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    unidad_numeroComercial: e.target.value,
                });
            },
        },
        {
            label: "Marca",
            select: true,
            options: marcas,
            data: "Descripcion",
            valueKey: "idMarca",
            fieldKey: "unidad_marca",
            style: `${action !== "show" && "col-span-3"}`,
            value: data.modelo?.marca?.idMarca,
            onChangeFunc: (newValue) => {
                setData({
                    ...data,
                    unidad_marca: newValue,
                    unidad_idModeloVehiculo: '',
                    modelo: {
                        ...data.modelo,
                        idModelo: '',
                        año: '',
                        marca: {
                            ...data.modelo?.marca,
                            idMarca: newValue
                        }
                    }
                });
            },
        },
        {
            label: "Modelo",
            select: true,
            options: marcas.filter(mar => mar.idMarca == data.modelo?.marca?.idMarca)[0]?.modelos,
            data: "descripcion",
            valueKey: "idModelo",
            fieldKey: "unidad_modelo",
            style: `${action !== "show" && "col-span-3"}`,
            value: data.modelo?.idModelo,
            onChangeFunc: (newValue, object) => {
                setData({
                    ...data,
                    unidad_modelo: newValue,
                    unidad_idModeloVehiculo: '',
                    modelo: {
                        ...data.modelo,
                        idModelo: newValue,
                        año: ''
                    },
                });
            },
        },
        {
            label: "Año",
            select: true,
            options: getYears(),
            data: "año",
            valueKey: "año",
            fieldKey: "unidad_año",
            style: `${action !== "show" && "col-span-2"}`,
            value: data.modelo?.año,
            onChangeFunc: (newValue) => {
                setData({
                    ...data,
                    unidad_idModeloVehiculo: '',
                    unidad_año: newValue,
                    modelo: {
                        ...data.modelo,
                        año: newValue,
                    },
                });
            },
        },
        {
            label: "Cilindros de Motor",
            select: true,
            options: getCilindros(),
            data: "cilindrosMotor",
            valueKey: "idModeloVehiculo",
            fieldKey: "unidad_Cilindros",
            style: `${action !== "show" && "col-span-2"}`,
            value: data.unidad_idModeloVehiculo || '',
            onChangeFunc: (newValue) => {
                setData({
                    ...data,
                    unidad_idModeloVehiculo: newValue,
                    unidad_Cilindros: newValue
                });
            },
        },
        {
            label: "Placa",
            input: true,
            type: "text",
            fieldKey: "unidad_placa",
            style: `${action !== "show" && "col-span-2"}`,
            value: data.unidad_placa,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    unidad_placa: e.target.value,
                });
            },
        },
        {
            label: "Número de Serie",
            input: true,
            type: "text",
            style: `${action !== "show" && "col-span-2"}`,
            fieldKey: "unidad_NumSerie",
            value: data.unidad_NumSerie,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    unidad_NumSerie: e.target.value,
                });
            },
        },
        {
            label: "Número de Computadora",
            input: true,
            type: "text",
            fieldKey: "unidad_NumeroComputadora",
            style: `${action !== "show" && "col-span-2"}`,
            value: data.unidad_NumeroComputadora,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    unidad_NumeroComputadora: e.target.value,
                });
            },
        },
        {
            label: "Permiso CRE",
            input: true,
            type: "text",
            fieldKey: "unidad_permisoCRE",
            style: `${action !== "show" && "col-span-2"}`,
            value: data.unidad_permisoCRE,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    unidad_permisoCRE: e.target.value,
                });
            },
        },
        {
            label: "Tipo de servicio",
            select: true,
            options: (tiposServicio || []).sort((a, b) =>
                a.tipoServicio_descripcion.localeCompare(
                    b.tipoServicio_descripcion
                )
            ),
            data: "tipoServicio_descripcion",
            fieldKey: "unidad_idTipoServicio",
            style: `${action !== "show" && "col-span-3"}`,
            valueKey: "tipoServicio_idTipoServicio",
            value: data.unidad_idTipoServicio || "",
            onChangeFunc: (newValue) => {
                setData({ ...data, unidad_idTipoServicio: newValue });
            },
        },
        {
            label: "Area Funcional",
            select: true,
            options: areas,
            data: "AF_Nombre",
            fieldKey: "unidad_AreaFuncional",
            style: `${action !== "show" && "col-span-3"}`,
            valueKey: "AF_id",
            value: data.unidad_AreaFuncional,
            onChangeFunc: (newValue) => {
                setData({
                    ...data,
                    unidad_AreaFuncional: newValue,
                });
            },
        },
        {
            label: "Litros",
            input: true,
            type: "decimal",
            fieldKey: "unidad_capacidad",
            style: `${action !== "show" && "col-span-3"}`,
            value: data.unidad_capacidad,
            onChangeFunc: (e) => setData({
                ...data,
                unidad_capacidad: e.target.value,
            }),
        },

        {
            label: "Activo",
            select: true,
            options: [
                { id: 0, value: "Inactivo" },
                { id: 1, value: "Activo" },
            ],
            data: "value",
            fieldKey: "unidad_estatus",
            style: `${action !== "show" && "col-span-3"}`,
            valueKey: "id",
            value: data.unidad_estatus || 1,
            onChangeFunc: (newValue) => {
                setData({ ...data, unidad_estatus: newValue });
            },
        },
    ];
};

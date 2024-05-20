import { locationBody } from "@/utils";

export default function InformacionPersonal(data, setData, action, infoByPostalCode, setInfoByPostalCode, coloniaGetter) {
    const coloniaCpHandler = async (input) => {
        const newColoniaData = await coloniaGetter(input)
        setData({ ...data, ...newColoniaData, cliente_codigoPostal: input })
    }

    return [
        {
            label: "Razón social",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'cliente_razonsocial',
            value: data.cliente_razonsocial || '',
            onChangeFunc: (e) => { setData({ ...data, cliente_razonsocial: e.target.value }) }
        },
        {
            label: "Razón comercial",
            input: true,
            type: 'text',
            fieldKey: 'cliente_nombrecomercial',
            style: 'col-span-2',
            value: data.cliente_nombrecomercial || '',
            onChangeFunc: (e) => { setData({ ...data, cliente_nombrecomercial: e.target.value }) }
        },
        {
            label: "Calle",
            input: true,
            type: 'text',
            fieldKey: 'cliente_calle',
            style: 'col-span-2',
            value: data.cliente_calle || '',
            onChangeFunc: (e) => { setData({ ...data, cliente_calle: e.target.value }) }
        },
        {
            label: "No. Exterior",
            input: true,
            type: 'text',
            fieldKey: 'cliente_numeroExterior',
            style: 'col-span-1',
            value: data.cliente_numeroExterior || '',
            onChangeFunc: (e) => { setData({ ...data, cliente_numeroExterior: e.target.value }); }
        },
        {
            label: "No. Interior",
            input: true,
            type: 'text',
            fieldKey: 'cliente_numeroInterior',
            style: 'col-span-1',
            value: data.cliente_numeroInterior || '',
            onChangeFunc: (e) => { setData({ ...data, cliente_numeroInterior: e.target.value }); }
        },
        {
            label: "Codigo Postal",
            input: true,
            type: 'text',
            fieldKey: 'cliente_codigoPostal',
            style: 'col-span-1',
            value: data.cliente_codigoPostal || '',
            onChangeFunc: (e) => {
                const input = e.target.value.replace(/\D/g, "").slice(0, 5);
                if (input.length === 5) {
                    coloniaCpHandler(input)
                } else {
                    setData({ ...data, cliente_codigoPostal: input })
                    setInfoByPostalCode(locationBody)
                }
            }
        },
        {
            label: "Localidad",
            input: true,
            type: 'text',
            fieldKey: 'cliente_localidad',
            style: 'col-span-1',
            disabled: true,
            value: infoByPostalCode.municipio?.descripcionMunicipio || '',
            onChangeFunc: () => { setData({ ...data, cliente_localidad: e.target.value }) }
        },
        {
            label: "Pais",
            input: true,
            type: 'text',
            disabled: true,
            fieldKey: 'cliente_idPais',
            style: 'col-span-2',
            value: infoByPostalCode.pais?.descripcionPais || '',
            onChangeFunc: () => { setData({ ...data, cliente_IdPais: infoByPostalCode.pais?.idPais }) }
        },
        {
            label: "Estado",
            input: true,
            type: 'text',
            fieldKey: 'cliente_idEstado',
            style: 'col-span-2',
            disabled: true,
            value: infoByPostalCode.estado?.descripcionEstado || '',
            onChangeFunc: () => { setData({ ...data, cliente_idEstado: infoByPostalCode.estado?.idEstado }) }
        },
        {
            label: "Municipio",
            input: true,
            type: 'text',
            fieldKey: 'cliente_ciudad',
            style: 'col-span-2',
            disabled: true,
            value: infoByPostalCode.municipio?.descripcionMunicipio || '',
            onChangeFunc: () => { setData({ ...data, cliente_ciudad: infoByPostalCode.municipio?.descripcionMunicipio, descripcionMunicipio: infoByPostalCode.municipio?.idMunicipio }) }
        },
        {
            label: "Colonia",
            select: true,
            options: infoByPostalCode.colonias || [],
            value: data.cliente_colonia || '',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, cliente_colonia: e }),
            data: 'Colonia_Nombre',
            valueKey: 'Colonia_Id',
            fieldKey: 'cliente_colonia',
        },
        {
            label: "Teléfono",
            input: true,
            type: 'text',
            fieldKey: 'cliente_telefono',
            style: 'col-span-1',
            value: data.cliente_telefono || '',
            onChangeFunc: (e) => {
                const input = e.target.value.replace(/\D/g, "").slice(0, 10); // Limitar a 10 números
                setData({ ...data, cliente_telefono: input });
            }
        },

        {
            label: "Estatus del cliente",
            check: true,
            fieldKey: 'cliente_estatus',
            checked: action === 'edit' ? data.cliente_estatus : true,
            style: 'justify-center col-span-1',
            onChangeFunc: (e) => {
                setData({ ...data, cliente_estatus: e.target.checked ? "1" : "0" })
            }
        },
    ];
}

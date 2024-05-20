

export default function InformacionFiscal(data, setData, dataSelects) {
    return [
        {
            label: "RFC",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'cliente_rfc',
            value: data.cliente_rfc || '',
            onChangeFunc: (e) => {
                const input = e.target.value.slice(0, 13); // Limitar a 13 caracteres
                setData({ ...data, cliente_rfc: input });
            }
        },
        {
            label: "Regimen fiscal",
            select: true,
            options: dataSelects.regimenes || [],
            value: data.cliente_idRegimenFiscal || '',
            style: 'col-span-2',
            fieldKey: 'cliente_idRegimenFiscal',
            onChangeFunc: (e) => setData({ ...data, cliente_idRegimenFiscal: e }),
            data: 'catalogoRegimenFiscalSAT_descripcion',
            valueKey: 'catalogoRegimenFiscalSAT_id',
        },
        {
            label: "Uso CFDI",
            select: true,
            options: dataSelects.cfdis || [],
            value: data.cliente_idUsoCfdiSAT || '',
            fieldKey: 'cliente_idUsoCfdiSAT',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, cliente_idUsoCfdiSAT: e }),
            data: 'usoCfdiSAT_descripcion',
            valueKey: 'usoCfdiSAT_id',
        },
        {
            label: "Forma de pago",
            select: true,
            options: dataSelects.formaPagos || [],
            value: data.cliente_idFormasPago || '',
            fieldKey: 'cliente_idFormasPago',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, cliente_idFormasPago: e }),
            data: 'formasPago_descripcion',
            valueKey: 'formasPago_idFormasPago',
        },
        {
            label: "Tipo de cartera",
            select: true,
            options: dataSelects.tipoCarteras || [],
            value: data.cliente_idTipoCartera || '',
            fieldKey: 'cliente_idTipoCartera',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, cliente_idTipoCartera: e }),
            data: 'tipoCartera_nombre',
            valueKey: 'tipoCartera_idTipoCartera',
        },
        {
            label: "Cuenta contable",
            input: true,
            type: 'decimal',
            fieldKey: 'cliente_cuentaContable',
            style: 'col-span-2',
            value: data.cliente_cuentaContable || '',
            onChangeFunc: (e) => {
                setData({ ...data, cliente_cuentaContable: e.target.value })
            }
        },
        {
            label: "Sector comercial",
            select: true,
            options: dataSelects.tipoClientes || [],
            value: data.cliente_idTipoCliente || '',
            fieldKey: 'cliente_idTipoCliente',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, cliente_idTipoCliente: e }),
            data: 'tipoCliente_tipo',
            valueKey: 'tipoCliente_idTipoCliente',
        },
        {
            label: "Giro comercial",
            select: true,
            options: dataSelects.tipoCaptaciones || [],
            value: data.cliente_idTipoCaptacion || '',
            fieldKey: 'cliente_idTipoCaptacion',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, cliente_idTipoCaptacion: e }),
            data: 'tipoCaptacion_tipo',
            valueKey: 'tipoCaptacion_idTipoCaptacion',
        },
        {
            label: "Cobrador",
            select: true,
            options: dataSelects.vendedores || [],
            value: data.cliente_idVendedor || '',
            fieldKey: 'cliente_idVendedor',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, cliente_idVendedor: e }),
            data: 'nombre_completo',
            valueKey: 'IdPersona',
        },
        {
            label: "Nombre representante legal",
            input: true,
            type: 'text',
            fieldKey: 'cliente_representanteLegal',
            style: 'col-span-2',
            value: data.cliente_representanteLegal || '',
            onChangeFunc: (e) => { setData({ ...data, cliente_representanteLegal: e.target.value }) }
        }
    ];
}

import { FieldDrawer } from "@/components/DialogComp";

export default function InformacionLaboral(data, setData, dataSelects) {
    return [
        {
            label: "Departamento",
            select: true,
            options: dataSelects.departamentos,
            value: data.IdDepto,
            style: 'col-span-3',
            onChangeFunc: (e) => setData({ ...data, IdDepto: e, IdPuesto: '' }),
            data: "nombre",
            fieldKey: "IdDepto",
            valueKey: "IdDepartamento",
        },
        {
            label: "Puesto",
            select: true,
            options: dataSelects.puestos.filter(p => p.IdDepartamento == data.IdDepto),
            value: data.IdPuesto,
            style: 'col-span-3',
            onChangeFunc: (e) => setData({ ...data, IdPuesto: e }),
            data: "nombre",
            fieldKey: "IdPuesto",
            valueKey: "IdPuesto",
        },
        {
            label: "Zonas",
            select: true,
            options: dataSelects.zonas,
            value: data.IdZona,
            style: 'col-span-3',
            onChangeFunc: (e) => setData({ ...data, IdZona: e }),
            data: "zona_descripcion",
            fieldKey: "IdZona",
            valueKey: "zona_idZona",
        },
        {
            label: "Cedis",
            select: true,
            options: dataSelects.cedis,
            value: data.IdCedis,
            style: 'col-span-3',
            onChangeFunc: (e) => setData({ ...data, IdCedis: e }),
            data: "nombre",
            fieldKey: "IdCedis",
            valueKey: "IdCedis",
        },
        // {
        //     label: "Periodo Nominal",
        //     select: true,
        //     style: 'col-span-3',
        //     options: [
        //         {
        //             id: "Semanal",
        //             value: "Semanal",
        //         },
        //         {
        //             id: "Quincenal",
        //             value: "Quincenal",
        //         },
        //         {
        //             id: "Mensual",
        //             value: "Mensual",
        //         },
        //     ],
        //     value: data.PeriodoNominal,
        //     onChangeFunc: (e) => setData({ ...data, PeriodoNominal: e }),
        //     data: "value",
        //     fieldKey: "PeriodoNominal",
        //     valueKey: "id",
        // },
        {
            label: "Periodo Nominal",
            select: true,
            options: dataSelects.periodicidad || [],
            value: data.PeriodoNominal || '',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, PeriodoNominal: e }),
            data: 'descripcion',
            valueKey: 'idPeriodicidad',
            fieldKey: 'PeriodoNominal',
        },
        {
            label: "Tipo de Contrato",
            select: true,
            style: 'col-span-2',
            options: [
                {
                    id: "Determinado",
                    value: "Determinado",
                },
                {
                    id: "Inderterminado",
                    value: "Indeterminado",
                },
                {
                    id: "Colectivo",
                    value: "Colectivo",
                },
            ],
            value: data.ContratoTipo,
            fieldKey: "ContratoTipo",
            onChangeFunc: (e) => setData({ ...data, ContratoTipo: e }),
            data: "value",
            valueKey: "id",
        },
        {
            label: "Tipo Empleado",
            select: true,
            style: 'col-span-2',
            options: [
                {
                    id: "Administrativo",
                    value: "Administrativo",
                },
                {
                    id: "Operativo",
                    value: "Operativo",
                },
            ],
            value: data.TipoEmpleado,
            fieldKey: "TipoEmpleado",
            onChangeFunc: (e) => setData({ ...data, TipoEmpleado: e }),
            data: "value",
            valueKey: "id",
        },
        // {
        //     label: "Empresa",
        //     select: true,
        //     style: 'col-span-3',
        //     options: dataSelects.centros,
        //     value: data.IdCentroCostos,
        //     onChangeFunc: (e) => setData({ ...data, IdCentroCostos: e }),
        //     data: "empresa_razonComercial",
        //     fieldKey: "IdCentroCostos",
        //     valueKey: "empresa_idEmpresa",
        // },
        {
            label: "Salario Real",
            input: true,
            type: "decimal",
            style: 'col-span-3',
            fieldKey: "SalarioReal",
            customIcon: 'attach_money',
            value: data.SalarioReal,
            onChangeFunc: (e) => setData({ ...data, SalarioReal: e.target.value }),
        },
        {
            label: "Número de Checador",
            input: true,
            type: "text",
            style: 'col-span-3',
            fieldKey: "IdChecador",
            value: data.IdChecador,
            onChangeFunc: (e) => setData({ ...data, IdChecador: e.target.value }),
        },
        {
            label: "Seguro",
            check: true,
            fieldKey: 'TieneSeguro',
            labelPlacement: 'bottom',
            checked: data.TieneSeguro,
            style: 'justify-center col-span-2',
            onChangeFunc: (e) => setData({
                ...data,
                TieneSeguro: e.target.checked ? "1" : "0",
            })
        },
        {
            label: "Excepcion Checador",
            check: true,
            fieldKey: 'ExcepcionChecador',
            checked: data.ExcepcionChecador,
            labelPlacement: 'bottom',
            style: 'justify-center col-span-2',
            onChangeFunc: (e) => setData({
                ...data,
                ExcepcionChecador: e.target.checked ? "1" : "0",
            })
        },
        {
            label: "Asignar activos",
            check: true,
            fieldKey: 'AsignarActivos',
            checked: data.AsignarActivos,
            labelPlacement: 'bottom',
            style: 'justify-center col-span-2',
            onChangeFunc: (e) => setData({
                ...data,
                AsignarActivos: e.target.checked ? "1" : "0",
            })
        },
        // {
        //     custom: true,
        //     style: 'col-span-2',
        //     customItem: () => <>
        //         <div className="grid grid-cols-3">
        //             <FieldDrawer
        //                 fields={[
        //                     {
        //                         label: "Excepcion Checador",
        //                         check: true,
        //                         fieldKey: 'ExcepcionChecador',
        //                         checked: data.ExcepcionChecador,
        //                         labelPlacement: 'bottom',
        //                         style: 'justify-center',
        //                         onChangeFunc: (e) => setData({
        //                             ...data,
        //                             ExcepcionChecador: e.target.checked ? "1" : "0",
        //                         })
        //                     },
        //                     {
        //                         label: "Asignar activos",
        //                         check: true,
        //                         fieldKey: 'AsignarActivos',
        //                         checked: data.AsignarActivos,
        //                         labelPlacement: 'bottom',
        //                         style: 'justify-center',
        //                         onChangeFunc: (e) => setData({
        //                             ...data,
        //                             AsignarActivos: e.target.checked ? "1" : "0",
        //                         })
        //                     },
        //                 ]}
        //             />
        //         </div>
        //     </>
        // },
    ]
}

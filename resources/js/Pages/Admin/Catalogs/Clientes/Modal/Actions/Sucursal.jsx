import request, { dataCodigoPostal, locationBody, validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@mui/material';
import { FieldDrawer } from '@/components/DialogComp';

const suburbData = (cliente) => {
    return {
        idDireccionSucursal: '',
        idCliente: cliente.idCliente,
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        idcolonia: '',
        idMunicipio: '',
        idEstado: '',
        descripcion: '',
        codigopostal: '',
    }
}

const sucursalValidation = {
    calle: 'required',
    numeroExterior: 'required',
    idcolonia: 'required',
    idMunicipio: 'required',
    idEstado: 'required',
    descripcion: 'required',
    codigopostal: 'required',
}

const Sucursal = ({ allClienteSucursal }) => {
    const [infoByPostalCode, setInfoByPostalCode] = useState(locationBody)
    const { data, setData } = useForm(suburbData(allClienteSucursal))
    const [errors, setErrors] = useState({})

    const coloniasPorCodigoPostal = async () => {
        const response = await dataCodigoPostal(data.codigopostal);
        setInfoByPostalCode(response);
        setData({
            ...data,
            idEstado: response.estado?.idEstado,
            idMunicipio: response.municipio?.idMunicipio,
        });
    };

    useEffect(() => {
        if (data.codigopostal.length === 5) coloniasPorCodigoPostal()
        else setInfoByPostalCode(locationBody)
    }, [data.codigopostal])



    const btnSubmit = (action) => {
        setErrors({})
        const result = validateInputs(sucursalValidation, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        request(route('cliente-sucursal.store'), 'POST', data)
        allClienteSucursal.fetchData(allClienteSucursal.idCliente)
    }

    const TableItem = (e) => {
        return (
            <div style={{ zoom: 0.75 }} >
                <p style={{ fontSize: '25px' }}>{e.label}</p>
                <Datatable
                    searcher={false}
                    virtual={true}
                    data={allClienteSucursal.sucursalesCliente || []}
                    columns={[
                        { header: "Sucursal", accessor: 'descripcion' },
                        { header: "Dirección", cell: (eprops) => (<div>{eprops.item.calle} #{eprops.item.numeroExterior} {eprops.item.numeroInterior ? `Int#${eprops.item.numeroInterior}` : ''}</div>) },
                        { header: "Colonia", cell: (eprops) => eprops.item.colonia.Colonia_Nombre },
                        { header: "CP", cell: (eprops) => eprops.item.codigopostal },
                    ]}
                />
            </div>
        )
    }

    return (
        <div className='grid grid-cols-5'>
            <div className='grid grid-cols-4 col-span-2 gap-x-4'>
                <FieldDrawer
                    fields={[
                        {
                            label: "Nombre",
                            input: true,
                            type: 'text',
                            style: 'col-span-4',
                            fieldKey: 'descripcion',
                            value: data.descripcion || '',
                            onChangeFunc: (e) => { setData({ ...data, descripcion: e.target.value }) }
                        },
                        {
                            label: "Calle",
                            input: true,
                            type: 'text',
                            style: 'col-span-4',
                            fieldKey: 'calle',
                            value: data.calle || '',
                            onChangeFunc: (e) => { setData({ ...data, calle: e.target.value }) }
                        },
                        {
                            label: "No. Exterior",
                            input: true,
                            type: 'text',
                            style: 'col-span-2',
                            fieldKey: 'numeroExterior',
                            value: data.numeroExterior || '',
                            onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 8); setData({ ...data, numeroExterior: input }) }
                        },
                        {
                            label: "No. Interior",
                            input: true,
                            type: 'text',
                            style: 'col-span-2',
                            fieldKey: 'numeroInterior',
                            value: data.numeroInterior || '',
                            onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 8); setData({ ...data, numeroInterior: input }) }
                        },
                        {
                            label: "C. Postal",
                            input: true,
                            type: 'text',
                            style: 'col-span-2',
                            fieldKey: 'codigopostal',
                            value: data.codigopostal || '',
                            onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 5); setData({ ...data, codigopostal: input }) }
                        },
                        {
                            label: "Estado",
                            input: true,
                            disabled: true,
                            type: 'text',
                            style: 'col-span-2',
                            fieldKey: 'idEstado',
                            value: infoByPostalCode.estado?.descripcionEstado || '',
                        },
                        {
                            label: "Municipio",
                            input: true,
                            type: 'text',
                            disabled: true,
                            style: 'col-span-2',
                            fieldKey: 'idMunicipio',
                            value: infoByPostalCode.municipio?.descripcionMunicipio || '',
                        },
                        {
                            label: "Colonia",
                            select: true,
                            style: 'col-span-2',
                            fieldKey: 'idcolonia',
                            options: infoByPostalCode.colonias || [],
                            value: data.idcolonia || '',
                            onChangeFunc: (e) => setData({ ...data, idcolonia: e }),
                            data: 'Colonia_Nombre',
                            valueKey: 'Colonia_Id',
                        },
                        {
                            label: "",
                            custom: true,
                            value: '',
                            style: 'col-span-4 w-full mt-4',
                            customItem: () =>
                            (
                                <div className='flex justify-end'>
                                    <Button color={'error'} onClick={() => { setData(suburbData(allClienteSucursal)) }}>LIMPIAR CAMPOS</Button>
                                    {Object.values(data)[0] === '' ? (<Button color={'success'} sx={{ textAlign: 'center' }} onClick={() => btnSubmit('add')}>Agregar Sucursal</Button>) :
                                        (<Button color={'primary'} onClick={() => btnSubmit('edit')}>Editar Sucursal</Button>)}
                                </div>
                            ),
                            onChangeFunc: () => { },
                        },
                    ]}
                    errors={errors}
                />
            </div>
            <div className='col-span-3 ms-3'>
                <TableItem label='Direcciones' />
            </div>
        </div>
    )
}

export default Sucursal
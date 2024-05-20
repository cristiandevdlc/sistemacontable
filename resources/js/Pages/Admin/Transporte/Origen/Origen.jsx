import { origenData, origenValidations } from './IntOrigen'
import request, { validateInputs } from '@/utils'
import DialogComp from '@/components/DialogComp'
import Datatable from '@/components/Datatable'
import { useEffect, useState } from 'react'
import { useForm } from '@inertiajs/react'
import LoadingDiv from '@/components/LoadingDiv'

const Origen = () => {
    const [infoByPostalCode, setInfoByPostalCode] = useState({ colonias: [], municipio: null, estado: null, pais: null })
    const [localidades, setLocalidades] = useState()
    const [action, setAction] = useState('create')
    const { data, setData } = useForm(origenData)
    const [origenes, setOrigenes] = useState()
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchOrigenes = async () => {
        const response = await request(route('transporte-origen.index'))
        setOrigenes(response)
    }
    const fetchLocalidades = async () => {
        const response = await request(route('sat-localidades.index'))
        setLocalidades(response)
    }

    useEffect(() => {
        fetchOrigenes()
        fetchLocalidades()
    }, [])

    useEffect(() => {
        if (origenes && localidades) setLoading(false)
    }, [origenes, localidades])

    const formatearRespuestColonias = async (response) => {
        const result = response.reduce((acc, item) => {

            acc.colonias.push({
                Colonia_Id: item.Colonia_Id,
                Colonia_Nombre: item.Colonia_Nombre,
                Colonia_IdMunicipio: item.Colonia_IdMunicipio,
                c_CodigoPostal: item.c_CodigoPostal
            });

            if (!acc.municipio) {
                acc.municipio = {
                    idMunicipio: item.municipio.idMunicipio.toString(),
                    claveMunicipio: item.municipio.claveMunicipio,
                    idestado: item.municipio.idestado,
                    descripcionMunicipio: item.municipio.descripcionMunicipio
                };
            }
            if (!acc.estado) {
                acc.estado = {
                    idEstado: item.municipio.estado.idEstado.toString(),
                    cveEstado: item.municipio.estado.cveEstado,
                    cvePais: item.municipio.estado.cvePais,
                    descripcionEstado: item.municipio.estado.descripcionEstado
                };
            }
            if (!acc.pais) {
                acc.pais = {
                    idPais: item.municipio.estado.pais.idPais.toString(),
                    cvePais: item.municipio.estado.pais.cvePais,
                    descripcionPais: item.municipio.estado.pais.descripcionPais
                };
            }
            return acc;
        }, {
            colonias: [],
            municipio: null,
            estado: null,
            pais: null
        });
        return result;
    }

    const submit = async () => {
        setErrors({})
        const result = validateInputs(origenValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            console.log(result.errors)
            return;
        }

        const method = action === "create" ? "POST" : "PUT"
        const url = action === "create" ? route('transporte-origen.store') : route('transporte-origen.update', data.idOrigen);
        await request(url, method, data).then(() => {
            fetchOrigenes()
            handleModal()
        })
    }

    const handleModal = () => {
        setOpen(!open)
        setErrors({})
        setData(origenData)
    }


    const coloniasPorCodigoPostal = async () => {
        const response = await request(route("colonia-por-cp", data.CodigoPostal));
        const finalResponse = await formatearRespuestColonias(response)
        setInfoByPostalCode(finalResponse)
        setData({ ...data, idMunicipio: finalResponse.municipio?.idMunicipio, idEstado: finalResponse.estado?.idEstado, idPais: finalResponse.pais?.idPais, descripcionEstado: finalResponse.estado?.descripcionEstado, descripcionMunicipio: finalResponse.municipio?.descripcionMunicipio, descripcionPais: finalResponse.pais?.descripcionPais })
    }

    useEffect(() => {
        setData({ ...data, idColonia: null })
        if (data.CodigoPostal.length === 5) {
            coloniasPorCodigoPostal()
        } else {
            setInfoByPostalCode({
                municipio: null,
                estado: null,
                pais: null
            })
        }
    }, [data.CodigoPostal])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => { setAction('create'); handleModal(); }}
                        data={origenes}
                        virtual={true}
                        columns={[
                            { width: '15%', header: 'Nombre', accessor: 'NombreRFCOrigen' },
                            { width: '15%', header: 'RFC', accessor: 'RFCOrigen' },
                            {
                                width: '30%', header: "Dirección",
                                cell: (eprops) => `Calle ${eprops.item.Calle} #${eprops.item.NumExterior} Col. ${eprops.item.colonia.Colonia_Nombre} CP. ${eprops.item.CodigoPostal}`,
                            },
                            {
                                width: '15%', header: 'Ciudad',
                                cell: (eprops) => `${eprops.item.municipio.descripcionMunicipio}, ${eprops.item.estado.descripcionEstado}`,
                            },
                            { width: '15%', header: 'Referencia', accessor: 'Referencia' },
                            {
                                width: '10%', header: 'Acciones',
                                edit: (eprops) => {
                                    setAction('edit');
                                    handleModal();
                                    setData(eprops.item);
                                }
                            }
                        ]}
                    />
                    <DialogComp dialogProps={{
                        model: 'origen',
                        width: 'md',
                        openState: open,
                        style: 'grid grid-cols-4 gap-x-4',
                        actionState: action,
                        openStateHandler: () => { handleModal() },
                        onSubmitState: () => submit
                    }}
                        fields={[
                            {
                                label: "Nombre",
                                input: true,
                                type: 'text',
                                style: 'col-span-2',
                                fieldKey: 'NombreRFCOrigen',
                                value: data.NombreRFCOrigen || '',
                                onChangeFunc: (e) => { setData({ ...data, NombreRFCOrigen: e.target.value }) }
                            },
                            {
                                label: "RFC",
                                input: true,
                                type: 'text',
                                fieldKey: 'RFCOrigen',
                                style: 'col-span-2',
                                value: data.RFCOrigen || '',
                                onChangeFunc: (e) => {
                                    const inputValue = e.target.value;
                                    if (inputValue.length <= 13) {
                                        setData({ ...data, RFCOrigen: inputValue });
                                    }
                                }
                            },
                            {
                                label: "Calle",
                                input: true,
                                type: 'text',
                                style: 'col-span-2',
                                fieldKey: 'Calle',
                                value: data.Calle || '',
                                onChangeFunc: (e) => { setData({ ...data, Calle: e.target.value }) }
                            },
                            {
                                label: "Numero exterior",
                                input: true,
                                type: 'text',
                                fieldKey: 'NumExterior',
                                value: data.NumExterior || '',
                                onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 4); setData({ ...data, NumExterior: input }) }

                            },
                            {
                                label: "Numero interior",
                                input: true,
                                type: 'text',
                                fieldKey: 'NumInterior',
                                value: data.NumInterior || '',
                                onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 4); setData({ ...data, NumInterior: input }) }
                            },
                            {
                                label: "Codigo postal",
                                input: true,
                                type: 'text',
                                fieldKey: 'CodigoPostal',
                                value: data.CodigoPostal || '',
                                onChangeFunc: (e) => { const input = e.target.value.replace(/\D/g, "").slice(0, 5); setData({ ...data, CodigoPostal: input }) }
                            },
                            {
                                label: "Localidad",
                                select: true,
                                options: localidades || [],
                                value: data.idLocalidad || '',
                                onChangeFunc: (e) => setData({ ...data, idLocalidad: e }),
                                data: 'descripcionLocalidad',
                                valueKey: 'idLocalidad',
                            },
                            {
                                label: "Pais",
                                input: true,
                                type: 'text',
                                disabled: true,
                                fieldKey: 'descripcionPais',
                                value: data.descripcionPais || '',
                                onChangeFunc: (e) => { setData({ ...data, descripcionPais: e.target.value }) }
                            },
                            {
                                label: "Estado",
                                input: true,
                                type: 'text',
                                disabled: true,
                                fieldKey: 'descripcionEstado',
                                value: data.descripcionEstado || '',
                                onChangeFunc: (e) => { setData({ ...data, descripcionEstado: e.target.value }) }
                            },
                            {
                                label: "Municipio",
                                input: true,
                                type: 'text',
                                disabled: true,
                                style: 'col-span-2',
                                fieldKey: 'descripcionMunicipio',
                                value: data.descripcionMunicipio || '',
                                onChangeFunc: (e) => { setData({ ...data, descripcionMunicipio: e.target.value }) }
                            },
                            {
                                label: "Colonia",
                                select: true,
                                style: 'col-span-2',
                                options: infoByPostalCode.colonias || [],
                                value: data.idColonia || '',
                                fieldKey: 'idColonia',
                                onChangeFunc: (e) => setData({ ...data, idColonia: e }),
                                data: 'Colonia_Nombre',
                                valueKey: 'Colonia_Id',
                            },
                            {
                                label: "Referencia",
                                input: true,
                                type: 'text',
                                style: 'col-span-2',
                                fieldKey: 'Referencia',
                                value: data.Referencia || '',
                                onChangeFunc: (e) => { setData({ ...data, Referencia: e.target.value }) }
                            },
                            {
                                label: "Activo",
                                select: true,
                                style: 'col-span-2',
                                options: action === 'create' ? [{ id: 1, value: 'Activo' }] : [{ id: 1, value: 'Activo' }, { id: 0, value: 'Inactivo' }],
                                value: data.Estatus || '',
                                onChangeFunc: (e) => setData({ ...data, Estatus: e }),
                                data: 'value',
                                valueKey: 'id',
                            },
                        ]}
                        errors={errors}
                    />
                </div>
            }
        </div>
    )
}

export default Origen
import LoadingDiv from '@/components/LoadingDiv'
import Datatable from '@/components/Datatable'
import TextInput from '@/components/TextInput'
import { Chip, Tooltip } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'
import request from '@/utils';
import React from 'react'

const ReposicionGas = () => {
    const [repoGas, setRepoGas] = useState([]);
    const [searchName, setSearchName] = useState('')
    const [data, setData] = useState({
        cliente_idCliente: '',
        cliente_nombrecomercial: '',
        cliente_estatusReposicion: 0
    });

    const getRepoGas = async () => {
        const response = await fetch(route("repoGas.show", searchName));
        const data = await response.json();
        setRepoGas(data);

    };

    useEffect(() => {
        if (searchName !== "") {
            getRepoGas();
        }
    }, [searchName])

    useEffect(() => {
        submit()
    }, [data]);

    const submit = async () => {
        if (data.cliente_idCliente !== '') {
            const ruta = route("repoGas.update", data.cliente_idCliente);
            const method = "PUT";
            await request(ruta, method, data).then(() => {
                getRepoGas();
            });
        }
    };

    return (
        <div>
            <div className='grid grid-cols-4 col-start-' >
                <div className='col-span-3' />
                <TextInput label='Buscar Cliente' type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </div>
            {repoGas && (
                <Datatable
                    searcher={false}
                    data={repoGas}
                    columns={[
                        { header: 'Cliente', accessor: 'cliente_nombrecomercial' },
                        {
                            header: 'Estatus Reposición', accessor: 'cliente_estatusReposicion',
                            cell: eprops => eprops.item.cliente_estatusReposicion === '1' ? (
                                <Chip label='Activo' color='success' size='small' />
                            ) : (
                                <Chip label='Inactivo' color='error' size='small' />
                            )
                        },
                        {
                            header: 'Acciones',
                            cell: eprops => (
                                <Tooltip title="Cambiar estatus reposicion">
                                    <button
                                        className="material-icons"
                                        onClick={() => {
                                            setData({ ...eprops.item, cliente_estatusReposicion: eprops.item.cliente_estatusReposicion == "1" ? false : true })
                                        }}
                                    >
                                        {eprops.item.cliente_estatusReposicion == "1" ? 'close' : 'done'}
                                    </button>
                                </Tooltip>

                            )
                        }
                    ]}
                />
            )}
        </div>
    )
}

export default ReposicionGas

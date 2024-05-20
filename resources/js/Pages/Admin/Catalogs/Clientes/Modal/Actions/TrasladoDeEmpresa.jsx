import { ButtonComp } from "@/components/ButtonComp";
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import { IntEnterpriseList } from "../../IntCliente";
import request from "@/utils";

export default function TrasladoDeEmpresa({ empresas = IntEnterpriseList, data }) {
    const [selected, setSelected] = useState(empresas.empresaClient);

    const onSelect = ({ selectedRowKeys }) => setSelected(selectedRowKeys)

    const onSubmitRequest = async () => {
        await request(
            route('cliente-otra-empresa.store'),
            'POST',
            { empresas: selected, cliente: data },
            { custom: true, error: { message: 'Ha ocurrido un error', type: 'error' }, success: { message: 'Traslado exitoso', type: 'success' } }
        )
    }


    return <>
        <div>
            <div className="">
                <Datatable
                    height="380px"
                    searcher={false}
                    virtual={true}
                    selection={{ mode: 'multiple' }}
                    data={empresas.empresaList}
                    selectedData={selected}
                    selectionFunc={onSelect}
                    columns={[{ header: "Empresa", accessor: 'empresa_razonComercial' }]}
                />
            </div>
            <div>
                <ButtonComp onClick={onSubmitRequest} label={'Trasladar'} icon={
                    <span className="material-icons">
                        move_up
                    </span>
                } />
            </div>
        </div>
    </>
}
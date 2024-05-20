import { FieldDrawer } from '@/components/DialogComp';
import React from 'react'

const TimbresForm = ({
    state,
    dispatch
}) => {
    return (
        <div>
            <FieldDrawer
                fields={[
                    {
                        custom: true,
                        customItem: () => <h1> Timbres restantes: {state.timbres.saldo}</h1>
                    }
                ]}
            />
        </div>
    )
}

export default TimbresForm
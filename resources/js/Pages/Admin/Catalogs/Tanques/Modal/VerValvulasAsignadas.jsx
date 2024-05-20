import LoadingDiv from '@/components/LoadingDiv'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import request from '@/utils';
import DialogComp from '@/components/DialogComp'
import { Button, DialogActions } from '@mui/material';

export default function VerValvulasAsignadas({ handleCloseModal, currentIdTank, selectedRowToAction, open }) {
    const [loading, setLoading] = useState(true)
    const [availableValvesToTankAsign, setAvailableValvesToTankAsign] = useState([])
    const { data, setData } = useForm({ id: '', idTanque: currentIdTank || '', idValvula: '', fechaInstalacion: '', activo: 1, fechaDesinstalacion: '', nombreValvula: '', nombreTanque: selectedRowToAction?.serie || '' })

    const fetchAvailableValvesToTankAsign = async () => {
        const response = await request(route('tanques-valvulas.show', data.idTanque))
        setAvailableValvesToTankAsign(response)
        setLoading(false)
    }

    useEffect(() => {
        fetchAvailableValvesToTankAsign()
    }, [])

    const btnDesactiveValve = async (valvula, valvulaAsignada) => {
        let currentDate = new Date()
        await request(route('valvulas.update', valvula.idValvula), 'PUT', { ...valvula, activo: 0 })
        await request(route('tanques-valvulas.update', valvulaAsignada.id), 'PUT', { ...valvulaAsignada, fechaDesinstalacion: currentDate.toISOString().split('T')[0], activo: 0 })
        fetchAvailableValvesToTankAsign()
        setData({ id: '', idTanque: selectedRowToAction?.idTanque || '', idValvula: '', fechaInstalacion: '', activo: 1, nombreValvula: '', nombreTanque: selectedRowToAction?.serie || '' })
    }
    const submit = async () => {

    }
    return (
        <>
            <DialogComp dialogProps={{
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit,
                actionState: 'create',
                openState: open.valvesList,
                model: 'las valvulas asignadas al tanque',
                width: 'md',
                style: 'grid grid-cols-1 gap-y-2',
                customAction: () => (
                    <DialogActions style={{ backgroundColor: 'white' }}>
                        <Button color="error" onClick={handleCloseModal}>Cerrar</Button>
                    </DialogActions>
                )
            }}
                fields={[
                    {
                        label: "",
                        custom: true,
                        value: '',
                        style: 'justify-center col-span-1',
                        customItem: () =>
                        (
                            <div>
                                {
                                    loading ? (<div className='min-h-[12rem] flex justify-center items-center'><LoadingDiv /></div>) : (
                                        <div className="flex w-full py-5 gap-6">
                                            <div className="text-center w-full h-full">
                                                <h4 className='w-full text-2xl font-semibold mb-4'>Valvulas del tanque</h4>
                                                <div className='rounded-md border max-h-48 min-h-[12rem] overflow-y-auto' >
                                                    <table className='w-full '>
                                                        <thead className=' bg-[#2B3F75] sticky top-0  w-full '>
                                                            <td className='w-1/4 text-white py-1 rounded-tl-md border-r'>Nombre de valvula</td>
                                                            <td className='w-1/4 text-white py-1  border-r'>Fecha de instalación</td>
                                                            <td className='w-1/4 text-white py-1  border-r'>Fecha de desinstalacón</td>
                                                            <td className='w-1/4 text-white py-1 rounded-rl-md border-r'>Estatus</td>
                                                        </thead>
                                                        <tbody>
                                                            {availableValvesToTankAsign.length > 0 ? availableValvesToTankAsign.map((valve) => {
                                                                console.log(valve);
                                                                return (
                                                                    <tr  key={valve.idValvula} className={`table-hover hover:bg-[#E0DFF3] border-b `}>
                                                                        <td className='py-1 '>{valve.valvula.nombre}</td>
                                                                        <td className='py-1 '>{valve.fechaInstalacion}</td>
                                                                        <td className='py-1 '>{valve.fechaDesinstalacion === null ? '-' : valve.fechaDesinstalacion}</td>
                                                                        <div className='flex w-full items-center justify-center mt-1 space-x-1 '>
                                                                            <div disabled={Number(valve.activo) === 1 ? true : false} className={`${Number(valve.activo) === 1 ? 'bg-[#2E7D32]' : 'bg-[#D32F2F]'} w-1/2 text-white  rounded-xl`}>{Number(valve.activo) === 1 ? 'Activo' : 'Inactivo'}</div>
                                                                            {
                                                                                Number(valve.activo) === 1 && (<button type='button' onClick={() => btnDesactiveValve(valve.valvula, valve)} disabled={Number(valve.activo) === 0 ? true : false} className=' bg-gray-400 hover:bg-[#D32F2F] text-white w-1/2 rounded-xl'>{Number(valve.activo) === 0 ? 'Inactivo' : 'Desactivar'}</button>)
                                                                            }
                                                                        </div>
                                                                    </tr>
                                                                )
                                                            }) : (
                                                                <tr><td colSpan={4} className='w-full py-16'>El tanque aun no cuenta con valvulas asignadas.</td></tr>
                                                            )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        ),
                        onChangeFunc: null,
                    },

                ]}
            />
        </>
    )
}
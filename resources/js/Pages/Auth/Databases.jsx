import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import Footer from '@/components/Footer';
import intergasLogo from '../../../png/Grupo 10@2x.png'
import { useState } from 'react';
import SelectComp from "@/components/SelectComp";
import request from '@/utils';

export default function Databases({ status }) {
  const [errors, setErrors] = useState({})
  const [data, setData] = useState({
    Ciudad: '',
    Servidor: '',
    database: '',
    username: '',
    password: '',
    host: '',
    port: '',
  });

  const valdiations = (data) => {
    const errors = {}
    Object.keys(data).forEach((item) => {
      errors[item] = data[item][0]
    })
    setErrors(errors)
  }

  const submit = async (e) => {
    e.preventDefault();
    const response = await request(route('databaseConfiguration'), 'POST', data);
    if(!response.message){
      valdiations(response)
      return
    }
    setErrors({})
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div>
          <img className='non-selectable' src={intergasLogo} alt="logo" />
        </div>
        <div className="w-full max-w-xl px-6 py-4 mt-6 rounded-lg">
          <Head title="Database config" />
          {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
          <form onSubmit={submit}>
            <div className='grid grid-cols-2 gap-x-4'>
              <div>
                <TextInput
                  label="Servidor local"
                  type="text"
                  value={data.Servidor}
                  isFocused={true}
                  onChange={(e) => setData({...data, Servidor: e.target.value})}
                />
                {
                  errors.Servidor &&
                  <InputError message={errors.Servidor} className="mt-2" />
                }
              </div>
              <div>
                <TextInput
                  label="Base de datos"
                  type="text"
                  value={data.database}
                  isFocused={true}
                  onChange={(e) => setData({...data, database: e.target.value})}
                />
                {
                  errors.database &&
                  <InputError message={errors.database} className="mt-2" />
                }
              </div>
              <div>
                <TextInput
                  label="Usuario"
                  type="text"
                  value={data.username}
                  isFocused={true}
                  onChange={(e) => setData({...data, username: e.target.value})}
                />
                {
                  errors.username &&
                  <InputError message={errors.username} className="mt-2" />
                }
              </div>
              <div>
                <TextInput
                  label="Contraseña"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData({...data, password: e.target.value})}
                />
                {
                  errors.password &&
                  <InputError message={errors.password} className="mt-2" />
                }
              </div>
              <div>
                <TextInput
                  label="Ciudad"
                  type="text"
                  value={data.Ciudad}
                  isFocused={true}
                  onChange={(e) => setData({...data, Ciudad: e.target.value})}
                />
                {
                  errors.Ciudad &&
                  <InputError message={errors.Ciudad} className="mt-2" />
                }
              </div>
              <div>
                <TextInput
                  label="Servidor remoto"
                  type="text"
                  value={data.host}
                  isFocused={true}
                  onChange={(e) => setData({...data, host: e.target.value})}
                />
                {
                  errors.host &&
                  <InputError message={errors.host} className="mt-2" />
                }
              </div>
              <div className='col-span-2'>
                <TextInput
                  label="Puerto"
                  type="text"
                  value={data.port}
                  isFocused={true}
                  onChange={(e) => setData({...data, port: e.target.value})}
                />
                {
                  errors.port &&
                  <InputError message={errors.port} className="mt-2" />
                }
              </div>
            </div>

            <div className="flex items-center justify-center mt-4">
              <button
                className={`w-full mt-4 btn-login items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-full font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150`}
              >
                REGISTRAR BASE DE DATOS
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

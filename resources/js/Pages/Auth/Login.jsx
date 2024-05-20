import { useEffect } from 'react';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import Footer from '@/components/Footer';
import intergasLogo from '../../../png/Grupo 10@2x.png'
import { useState } from 'react';
import request from '@/utils';
import SelectComp from "@/components/SelectComp";

export default function Login({ status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    usuario_username: '',
    usuario_password: '',
    connection: ''
  });
  const [connections, setConnections] = useState();

  const getConnections = async () => {
    const connections = await request(route('connections'));
    setConnections(connections)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!connections) {
      getConnections();
    }
    return () => {
      reset('usuario_password');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div>
          <img className='non-selectable' src={intergasLogo} alt="logo" />
        </div>
        <div className="w-full max-w-md px-6 py-4 mt-6 rounded-lg">
          <Head title="Log in" />
          {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
          <form onSubmit={submit}>
            <div>
              <TextInput
                label="Usuario"
                id="usuario_username"
                type="text"
                name="usuario_username"
                value={data.usuario_username}
                onlyUppercase={false}
                autoComplete="username"
                isFocused={true}
                onChange={(e) => setData('usuario_username', e.target.value)}
              />
              {/* <InputError message={errors.usuario_username} className="mt-2" /> */}
            </div>
            <div className="mt-4">
              <TextInput
                label="Password"
                id="usuario_password"
                type="password"
                name="usuario_password"
                value={data.usuario_password}
                autoComplete="current-usuario_password"
                onChange={(e) => setData('usuario_password', e.target.value)}
              />
              {/* <InputError message={errors.usuario_password} className="mt-2" /> */}
            </div>

            <div className="flex items-center justify-center mt-4">
              <button
                className={`w-full btn-login items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-full font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${processing && 'opacity-25'
                  }`}
                disabled={processing}
              >
                INGRESAR
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>

  );
}

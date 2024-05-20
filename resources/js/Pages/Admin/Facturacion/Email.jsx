import React, { useState, useEffect } from 'react';
import TextInput from '@/components/TextInput';
import SelectComp from '@/components/SelectComp';
import { Button, Tooltip } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import request, { noty, regex } from '@/utils';

const Email = ({ facturacion, cliente }) => {
    const [emails, setEmails] = useState([]);
    const [estadocorreo, setEstadoCorreo] = useState(false);
    const [data, setData] = useState({ correo: "" });

    const fetchClientEmails = async () => {
        try {
            const response = await request(route('correos-clientes.show', cliente.id));
            const filteredResponse = response.filter(item => item.correoCliente_idCliente !== '' && item.correoCliente_correo !== '');
            setEmails(filteredResponse);
            showNotification("Se encontraron correos electronicos", 'success', 'metroui', 'bottomRight', 5000); // Mostrar el mensaje de error en la interfaz de usuario

        } catch (error) {
            showNotification("No se encontraron correos electronicos", 'error', 'metroui', 'bottomRight', 5000); // Mostrar el mensaje de error en la interfaz de usuario
        }
    };

    const Correo = async () => {
        const response = await fetch(route('CorreoFactura'), {
            method: "POST",
            body: JSON.stringify({ Folio: facturacion.folio, Correo: data.correo, Tipo: facturacion.tipos, Ruta: facturacion.RutaXml }),
            headers: { "Content-Type": "application/json" }
        });
        const message = response.ok ? "El correo se envió exitosamente." : "Fallo al enviar correo";
        const type = response.ok ? "success" : "error";
        showNotification(message, type, 'metroui', 'bottomRight', 5000); // Mostrar el mensaje de error en la interfaz de usuario
    };

    useEffect(() => {
        fetchClientEmails();
    }, []); // Se ejecuta solo una vez al montar el componente


    return (
        <div className="mx-auto max-w-screen-xl px-4 py-10 lg:flex lg:items-center">
            <div className="mx-auto max-w-xl text-center">
                <h1 className="text-3xl font-extrabold sm:text-4xl">Se ha creado la factura correctamente </h1>

                <div className="relative flex" style={{ width: '100%' }}>
                    {estadocorreo == false && (
                        <TextInput
                            label="Correo Electronico"
                            type="text"
                            value={data.correo || ''}
                            onChange={(e) => {
                                const lowerCaseValue = e.target.value.toLowerCase();
                                setData({ ...data, correo: lowerCaseValue });
                            }}
                        />
                    )}
                    {estadocorreo == true && (
                        <SelectComp
                            label="Correos"
                            options={emails}
                            value={data.correo || ''}
                            data="correoCliente_correo"
                            valueKey="correoCliente_correo"
                            onChangeFunc={(newValue) => {
                                setData({ ...data, correo: newValue });
                            }}
                        />
                    )}
                    {emails.length > 0 && (
                        <Tooltip title={estadocorreo ? "Escribir correo" : "Seleccionar correo"}>
                            <div> {/* Contenedor para envolver todos los elementos */}
                                <Button className="bg-transparent text-white h-8 w-8 absolute right-18 top-7 mt-1 mr-2" onClick={() => { setEstadoCorreo(!estadocorreo); }} >
                                    <KeyboardDoubleArrowRightIcon />
                                </Button>
                            </div>
                        </Tooltip>
                    )}
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button className="block w-full rounded bg-[#1B2654] px-12 py-3 text-sm font-medium text-white shadow sm:w-auto" onClick={Correo}> Enviar correo </button>
                </div>
            </div>
        </div>
    );
};
function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };

export default Email;

import request from "@/utils";
import { Button, Divider } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import { useRef, useState, useEffect } from "react";
import '../../../../../../sass/Personas/_documentacion.scss'
import imagenDefault from '../../../../../../img/default_prof_img.png'

export default function Documentacion(data, setData, activeStep, open) {
    const [imagen, setImage] = useState('')
    const imagenKey = imagen ? `${imagen}-${Date.now()}` : "";
    const btnImageR = useRef()

    useEffect(() => {
        console.log()
        if (activeStep === 2) {
            const image = document.getElementById('image')
            if (imagen === '')
                image.src = imagenDefault;
            obtenerCliente();
        }
    }, [activeStep]);

    useEffect(() => {
        setImage('')
    }, [open]);

    useEffect(() => {
        obtenerCliente();
    }, [data.IdPersona]);

    const obtenerCliente = async () => {
        if (data.IdPersona !== "" && activeStep) {
            const imageResponse = await request(route("persona.image", data.IdPersona))
            const image = document.getElementById('image')
            image.src = `data:image/png;base64,${imageResponse.image}`;
        }

    };

    const imageHandler = (event) => {
        // console.log(event)
        const file = event.target.files[0];
        const reader = new FileReader();
        setData({ ...data, fotoEmpleado: file });

        reader.onload = (e) => {
            // setTimeout(quitarImagen, 1);
            const imagenSeleccionada = e.target.result;
            setImage(imagenSeleccionada);
        };
        reader.readAsDataURL(file);
    };

    return [
        {
            label: "Añadir foto",
            custom: true,
            value: data.SalarioDiario,
            style: 'col-span-2 justify-center',
            customItem: ({ label }) =>
            (
                <>
                    <div className="imgCont">

                        <div className="fotoEmpleado">
                            <img
                                src={imagen ? imagen : imagenDefault}
                                key={imagenKey}
                                alt="Imagen seleccionada"
                                id="image"
                            />
                        </div>
                    </div>

                    <input type="file" accept="image/*"
                        onChange={(e) => imageHandler(e)}
                        style={{ display: 'none' }}
                        id="boton-imagen"
                        ref={btnImageR}
                    />

                    <Button
                        variant="contained"
                        value={data.fotoEmpleado}
                        className="buttonPrimary"
                        startIcon={<BadgeIcon />}
                        onClick={() => {
                            btnImageR.current.click()
                        }}
                        style={{ backgroundColor: '#1B2654', color: 'white', borderRadius: '10px', opacity: '85%' }}
                    >
                        {label}
                    </Button>
                </>
            ),
        },
        {
            label: "Propuesta laboral",
            custom: true,
            style: 'col-span-2 mt-5',
            customItem: ({ label }) =>
            (
                <Divider textAlign="left">{label}</Divider>
            )
        },
        {
            label: "Salario Fijo",
            input: true,
            type: 'decimal',
            fieldKey: 'SalarioDiario',
            customIcon: 'attach_money',
            value: data.SalarioDiario,
            onChangeFunc: (e) => setData({ ...data, SalarioDiario: e.target.value }),
        },
        {
            label: "Cantidad Descuento",
            input: true,
            type: 'decimal',
            fieldKey: 'CantidadDescuento',
            customIcon: 'attach_money',
            value: data.CantidadDescuento,
            onChangeFunc: (e) => setData({ ...data, CantidadDescuento: e.target.value }),
        },
        {
            label: "Alta en el IMSS",
            input: false,
            inputType: 'date',
            fieldKey: 'FechaIngresoIMSS',
            value: data.FechaIngresoIMSS,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    FechaIngresoIMSS: e.target.value,
                });
            },
        },
        {
            label: "Celular",
            input: true,
            fieldKey: 'Celular',
            maxLength: 10,
            value: data.Celular,
            onChangeFunc: (e) => {
                const input = e.target.value.replace(/\D/g, '').slice(0, 10);
                setData({
                    ...data,
                    Celular: input,
                });
            },
        },
        {
            label: "Descuento Infonavit",
            input: true,
            type: 'decimal',
            customIcon: 'attach_money',
            fieldKey: 'DescuentoInfonavit',
            value: data.DescuentoInfonavit,
            onChangeFunc: (e) => setData({ ...data, DescuentoInfonavit: e.target.value, }),
        },
        {
            label: "Es empleado",
            check: true,
            fieldKey: 'EsEmpleado',
            checked: data.EsEmpleado,
            labelPlacement: 'bottom',
            style: 'justify-center',
            onChangeFunc: (e) => setData({
                ...data,
                EsEmpleado: e.target.checked ? "1" : "0",
            })
        },
        {
            label: "Crédito infonavit",
            check: true,
            fieldKey: 'CreditoInfonavit',
            checked: data.CreditoInfonavit,
            labelPlacement: 'bottom',
            style: 'justify-center',
            onChangeFunc: (e) => setData({
                ...data,
                CreditoInfonavit: e.target.checked ? "1" : "0",
            })
        },
    ];
}

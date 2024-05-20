<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
        * {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
        }

        @page {
            size: 20cm 25cm;
            margin-top: 10px;
            margin-bottom: 0cm;
            border: 1px solid blue;
        }

        .font-medium {
            font-weight: 500;
        }

        .left-0 {
            left: 0px;
        }

        .absolute {
            position: absolute;
        }

        .relative {
            position: relative;
        }

        .text-center {
            text-align: center;
        }

        .w-full {
            width: 100%;
        }

        .font-semibold {
            font-weight: 600;
        }

        .leading-relaxed {
            line-height: 1.625;
        }

        .tracking-wider {
            letter-spacing: 0.5em;
        }

        .text-lg {
            font-size: 1.125rem
                /* 18px */
            ;
            line-height: 1.75rem
                /* 28px */
            ;
        }

        .grid {
            display: flex;
        }

        .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        .as {
            display: flex
        }

        .w-2\/5 {
            width: 40%;
        }

        .w-1\/5 {
            width: 20%;
        }

        .m-0 {
            margin: 0px;
        }

        .text-left {
            text-align: left;
        }

        .text-left {
            text-align: right;
        }
    </style>
</head>

<body>
    <div>
        <div>
            <table style="width: 100%; margin-left: auto; margin-right: auto; margin-bottom: -20px ">
                <tr>
                    <td style=" width: 50%">
                        <p style="text-align: center; margin-bottom: -20px; font-size: 11px">
                            {{ $ciudadEmpresa }}, {{ $estadoEmpresa }}. A {{ $fecha }}
                        </p>

                    </td>
                    <td style=" width: 25%">
                        <p></p>
                    </td>
                    <td style=" width: 35%"></td>
                    <p style="text-align: center;">
                        <img style="width: 200px" src="data:image/png;base64, {{ $empresaLogo }}" />
                    </p>
                    </td>
                </tr>
            </table>
        </div>
        <h1 style="font-style: italic; font-size: 15px; text-align: center;">CONTRATO DE SERVICIO Y PRESTAMO DE TANQUE
            ESSTACIONARIO EN CALIDAD DE COMODATO</h1>
        <P style="font-size: 12px">A continuación se detallan los datos generales del CLIENTE al cual nuestra empresa
            {{ $razonSocialEmpresa }}
            cede en calidad de préstamo en comodato el siguiente (s) tanque (s), para uso en instalaciones del
            domicilio abajo señalados: En el entendido que cualquier cambio de domicilio o razón social de este cliente,
            serán notificados a {{ $razonSocialEmpresa }} para poder actualizar datos del presente documento.
        </P>
        <div>
            <p style=" font-size: 13px; font-weight: 600; font-style: italic; margin: 0.5%">DATOS DEL REPRESENTANTE
                LEGAL:</p>
            <table style="width: 35%;   ">
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Nombre:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $nombreRepresentanteLegalClienteFiscal }}</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Dirección:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">{{ $calleFiscal }}
                            #{{ $numeroExteriorFiscal }}</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Colonia:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $coloniaFiscal }}</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Codigo Postal:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $codigoPostal }}
                        </p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Ciudad:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $ciudadFiscal }}
                        </p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Giro:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $giro }}
                        </p>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <p style=" font-size: 13px; font-weight: 600; font-style: italic; margin: 0.5%">DATOS DEL TANQUE:</p>
            <table style="width: 50%;   ">
                <tr style="padding: 0%; ">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Marca:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $marcaTanque }}
                        </p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Norma:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">dasdasda</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Cantidad:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $cantidadTanque }}</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Serie:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $serieTanque }}
                        </p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Fecha:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $fechaCreacionTanque }}</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Válvulas:</p>
                    </td>
                    @foreach ($valvulasTanque as $valvula)
                        <td style=" margin: 0%; width: 40%">
                            <span style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                                {{ $valvula }}
                            </span>
                        </td>
                    @endforeach
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Capacidad:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $capacidadTanque }}</p>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <p style=" font-size: 13px; font-weight: 600; font-style: italic; margin: 0.5%">DATOS DEL ESTABLECIMIENTO:
            </p>
            <table style="width: 35%;   ">
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Nombre Cliente:
                        </p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $nombreCliente }}</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Dirección:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $calleSucursal }} #{{ $numeroExteriorSucursal }} </p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: %">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Colonia:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $coloniaSucursal }}</p>
                    </td>
                </tr>
                <tr style="padding: 0%;">
                    <td style="margin: 0%; width: 40%">
                        <p style="text-align: left;  margin: 0%; font-size: 9.5px; font-weight: 900;">Ciudad:</p>
                    </td>
                    <td style=" margin: 0%; width: 40%">
                        <p style="text-align: left; margin: 0%; font-size: 9.5px; font-weight: 900;">
                            {{ $municipioSucursal }}</p>
                    </td>
                </tr>
            </table>
        </div>

        <p style="font-size: 12px"><span style="font-size: 13px; font-weight: 900">{{ $razonSocialEmpresa }}</span>
            Se compromete a prestar el servicio de suministro de Gas L.P. En
            el tiempo y cantidaddes requeridas por el cliente.</p>
        <p style="font-size: 12px"><span style="font-size: 13px; font-weight: 900">El Cliente</span> Se compromete a
            realizar sus pedidos y sus respectivos consumos de Gas L.P. solo con
            <span style="font-size: 13px; font-weight: 900">{{ $razonSocialEmpresa }}</span> y cubrir en tiempo y
            forma los pagos correspondientes a dichos
            surtidos
        </p>
        <h2 style="width: 100%; text-align: center; margin-bottom: 80px; margin-top: 20px">FIRMAS DE ACUERDOS</h2>
        <div>
            <table style="width: 100%; margin-left: auto; margin-right: auto; margin-bottom: 60px">
                <tr>
                    <td style="border-top: 1px black solid;  width: 40% ">
                        <p style="text-align: center; margin-top: 3%; margin-bottom: 0%">
                            {{ $razonSocialEmpresa }}
                        </p>
                        <p style="text-align: center; margin: 1%">
                            {{ $usuarioAutoriza }}
                        </p>

                    </td>
                    <td style=" width: 40%">
                        <p></p>
                    </td>
                    <td style="border-top: 1px black solid;  width: 40%">
                        <p style="text-align: center; margin-top: 3%;margin-bottom: 0%">
                            Cliente
                        </p>
                        <p style="text-align: center; margin: 1%">
                            {{ $nombreCliente }}
                        </p>
                    </td>
                </tr>

            </table>
            <table style="width: 100%; margin-left: auto; margin-right: auto; ">
                <tr>
                    <td style="border-top: 1px black solid;  width: 40% ">
                        <p style="text-align: center; margin-top: 3%; margin-bottom: 0%">
                            {{ $razonSocialEmpresa }}
                        </p>
                        <p style="text-align: center; margin: 1%">
                            {{ $usuarioAsigno }}
                        </p>
                    </td>
                    <td style=" width: 40%">
                        <p></p>
                    </td>
                    <td style=" width: 40%">
                        <p></p>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <table style="width: 100%;  ">
                <tr>
                    <td style=" width: 10%">
                        <p style="text-align: center; margin-top: 3%; font-size: 11px">

                        </p>

                    </td>
                    <td style=" width: 10%">
                        <p></p>
                    </td>
                    <td style="width: 30%; "></td>
                    <p
                        style="font-size: 17px;  font-weight: 600; text-align: right; margin-top: 0%; margin-bottom: 0%;">
                        {{ $razonSocialEmpresa }}</p>
                    <p
                        style="font-size: 11px;  font-weight: 600;text-align: right; margin-top: 0%; margin-bottom: 0%; tx">
                        {{ $calleEmpresa }}</p>
                    <p
                        style="font-size: 11px;  font-weight: 600;text-align: right; margin-top: 0%; margin-bottom: 0%;">
                        {{ $coloniaEmpresa }}, {{ $ciudadEmpresa }}, {{ $estadoEmpresa }}
                        C.P. {{ $codigoPostalEmpresa }}</p>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div>
        <div>
            <table style="width: 100%; margin-left: auto; margin-right: auto; margin-bottom: 60px">
                <tr>
                    <td style="  width: 20% ">

                        <p style="text-align: center;">
                            <img style="width: 150px" src="data:image/png;base64, {{ $empresaLogo }}" />
                        </p>
                    </td>
                    <td style=" width:40%">
                        <h1 style="font-size: 17; text-align: center">Contrato de Comodato</h1>
                    </td>
                    <td style="  width: 20%">
                        <p style="text-align: center; margin-top: 3%">
                        </p>
                    </td>
                </tr>

            </table>

            <p class="font-medium">
                Contrato de Comodato que celebran por una parte la empresa {{ $razonSocialEmpresa }},
                representada
                legalmente por el señor {{ $nombreRepresentanteLegalEmpresa }}, empresa a quien en lo sucesivo se le
                denominará " El Comodante", y por la otra el señor ({{ $nombreRepresentanteLegalClienteFiscal }}),
                quien
                en lo sucesivo se le
                denominará "El Comodatario" , al tenor de los antecedentes, declaraciones y cláusulas
                siguientes: </p>
        </div>
        <div>
            <h4 class="tracking-wider text-center">ANTECEDENTES</h4>
            <p>
                <span class="font-semibold ">Primero.</span> Manifiesta "El Comodante", que su representada es una
                empresa
                debidamente constituida
                legalmente mediante escritura pública número 609, de fecha 19 de septiembre de 1996, otorgada ante la fe
                del
                licenciado José Ortiz Barroso, Notario Público número 19, e inscrita en el Registro Público del Comercio
                bajo el folic Mercantil 225.

            </p>
            <p>
                <span class="font-semibold ">Segundo.</span> Sigue declarando "El Comodante", el señor
                {{ $nombreRepresentanteLegalEmpresa }}, acredita su personalidad mediante Testimonio Notarial número
                1719, otorgado ante la fe del
                Notario Público número 19, licenciado José Ortiz Barroso, el pasado 20 de Noviembre de 2007.

            </p>
            <p>
                <span class="font-semibold ">Tercero.</span> "El Comodante es propietario de tanques de
                {{ $tipoTanque }} con
                capacidad de {{ $capacidadTanque }} {{ $unidadMedidaTanque }} de la marca {{ $marcaTanque }}
            </p>
        </div>
        <div>
            <h4 class="tracking-wider text-center">DECLARACIONES</h4>
            <div>
                <span class="font-semibold -ml-4"> l. "El Comodante" declara:</span>
                <p>
                    <span class="text-lg">a&#41;</span>
                    Estar constituido conforme a las leyes del país.
                </p>
                <p>
                    <span class="text-lg">b&#41;</span>
                    Estar dedicado a la realización de su objeto social, consistente entre otras a Venta y Distribución
                    según la
                    cláusula de los estatutos sociales previstos en la escritura pública señalada en el antecedente
                    primero de este contrato.
                </p>
                <p>
                    <span class="text-lg">c&#41;</span>
                    Tener su domicilio en la ciudad de {{ $ciudadEmpresa }} {{ $estadoEmpresa }}.
                </p>
                <p>
                    <span class="text-lg">d&#41;</span>
                    Que es su intención otorgar en comodato el bien señalado en el antecedente tercero de este contrato,
                    a
                    "El
                    Comodatario", por tiempo indefinido.
                </p>
                <p>
                    <span class="text-lg">e&#41;</span>
                    Que su representante legal cuenta con la facultad expresamente concedida para celebrar esta clase de
                    contratos, tal y como se desprende de la documentación del poder mencionado en el antecedente
                    segundo.
                </p>
            </div>
            <div>
                <span class="font-semibold -ml-4">ll. "El Comodatario" declara:</span>
                <p>
                    <span class="text-lg">a&#41;</span>
                    Estar constituido conforme a las leyes del país.
                </p>
                <p>
                    <span class="text-lg">b&#41;</span>
                    Tener su domicilio en: Col. {{ $coloniaFiscal }} Calle {{ $calleFiscal }}
                    #{{ $numeroExteriorFiscal }} {{ $ciudadFiscal }} {{ $estadoFiscal }}.
                </p>
                <p>
                    <span class="text-lg">c&#41;</span>
                    Que no existe algún otro vínculo legal entre éste y "El Comodante", salvo el que se genere por la
                    celebración de este contrato que es meramente de carácter civil.
                </p>
                <p>
                    <span class="text-lg">d&#41;</span>
                    Que es su libre voluntad celebrar y obligarse en los términos de este contrato.
                </p>
            </div>
        </div>
        <div>
            <h4 class="tracking-wider text-center">CLAUSULAS</h4>
            <p>
                <span class="font-semibold ">PRIMERA.</span> Ambas partes convienen en suscribir el presente contrato,
                obligándose "El Comodante" a conceder exclusivamente el uso del bien descrito en el antecedente tercero
                de
                forma gratuita a "El Comodatario", por tiempo indefinido.

            </p>
            <p>
                <span class="font-semibold ">SEGUNDA.</span> "El Comodatario" por su parte, se obliga a destinar el
                bien
                objeto de este contrato al uso de almacenamiento de gas LP. mismo que deberá consumir exclusivamente a
                la
                empresa "Comodante".

            </p>
            <p>
                <span class="font-semibold ">TERCERA.</span> "El Comodatario" se obliga a efectuar su costo de gastos
                ordinarios para la conservación y debido funcionamiento del tanques de {{ $tipoTanque }} con capacidad de {{ $capacidadTanque }} {{ $unidadMedidaTanque }}, asi
                como para su uso conforme a la clausula Tercera.
            </p>
            <p>
                <span class="font-semibold ">CUARTA.</span> "El Comodatario" se obliga a cuidar y conservar el objeto
                hasta
                su devolución a "El Comodante" y destinarla para el uso señalado en la cláusula tercera. En caso de que
                se
                destine a uso distinto, será responsable de los daños o pérdida que pudiesen presentarse del bien objeto
                de
                este contrato, aun tratándose de caso fortuito o fuerza mayor.
            </p>
            <p>
                <span class="font-semibold ">QUINTA.</span> "El Comodatario" será responsable por los daños y pérdida
                del
                bien objeto de este contrato, salvo lo dispuesto en la cláusula anterior, así como por el deterioro que
                éste
                sufriera por el uso distinto para el que fue otorgado, cuando ello obedezca a su culpa o negligencia.
            </p>
            <p>
                <span class="font-semibold ">SEXTA.</span> Para asegurar el adecuado uso del bien dado en comodato,
                "El
                Comodatario" deberá obligarse con "El Comodante" a consumir exclusivamente el producto que venda el
                mismo y
                para lo que se destine el bien dado en comodato.
            </p>
            <p>
                <span class="font-semibold ">SEPTIMA.</span> "El Comodante" podrá exigir a "El Comodatario" la
                devolución
                del bien, si hay peligro de que el blen
                perezca en su poder, quedando obligado a dar aviso de tal requerimiento a "El Comodatario" con 15 días
                de
                anticipación o cuando no se consuma el producto de Gas LP., del que surta "El Comodante" o cuando dejare
                de
                comprar o adquirir el producto para abastecer el bien que se da en comodato.
            </p>
            <p>
                <span class="font-semibold ">OCTAVA.</span> El incumplimiento de cualquiera de las cláusulas del
                presente
                contrato por parte de "El Comodatario"
                será motivo de rescisión del mismo, debiendo devolver el bien dado en comodato en el momento de ser
                requerido.
            </p>
            <p>
                <span class="font-semibold ">NOVENA.</span> En caso de que se suscite controversia respecto al presente
                contrato, las partes convienen en someterse a la competencia de los tribunales del fuero común de
                {{ $ciudadEmpresa }}, {{ $estadoEmpresa }},
                independientemente de la que pudiera corresponderles por razón de su domicilio presente o
                futuro.
            </p>
            <p>
                <span class="font-semibold ">DECIMA.</span> En la celebración de este contrato intervienen como
                testigos,
                los señores {{ $nombreRepresentanteLegalEmpresa }} y {{ $nombreRepresentanteLegalClienteFiscal }}, con
                domicilio en
                {{ $calleEmpresa }} {{ $ciudadEmpresa }} {{ $estadoEmpresa }}.
            </p>
            <p>
                <span class="font-semibold ">DECIMA PRIMERA.</span> Por ningún motivo "El comodatario" podrá conceder a
                un
                tercero el uso de la cosa entregada en Comodato sin la autorización del "El comodante". Asimismo, el
                comodatario se obliga a responder por la pérdida o mal uso del bien si lo emplea en uso diverso o por
                más
                tiempo del convenio aun cuando aquélla sobrevenga por caso fortuito. Lo anterior con fundamento en los
                artículos 2824, 2825 y 2826 del Código Civil para el estado de Coahuila y sus correlativos en el
                Distrito
                Federal.
            </p>
            <p>
                <span class="font-semibold ">DECIMA SEGUNDA.</span> "El comodatario se compromete a sufragar todos los
                gastos ordinarios que se necesiten para el uso y la conservación de la cosa prestada. Asi mismo en
                ningún
                caso podrá retener la cosa otorgada en Comodato alegándose el reclamo de expensas e adeudo que se le
                exija a
                el dueño.
            <p>
                <span class="font-semibold ">DECIMA TERCERA.</span> Para la entrega del bien se ha designado el
                domicilio
                del "comodante señalado en el primer párrafo del presente contrato. Asimismo "el comodatario" será
                responsable de los perjuicios que se puedan causar, los desperfectos del bien
                dado en Comodato pudiere tener y de los cuales no hubiere dado aviso oportuno al "comodante".
            </p>
            <p >
                <span class="font-semibold ">DECIMA CUARTA.</span> La duración del presente contrato será desde la
                fecha
                de
                éste contrato por tiempo indefinido.
            </p>
            
            <div ">
                <p>
                    <span class="font-semibold ">DECIMA QUINTA:</span> En caso de que el bien llegara a perderse o
                    quedara
                    inservible, ambas partes están conformes en que si la pérdida del objeto se deriva de una culpa del
                    "comodatario", este deberá pagar ${{ $precioTanque }} PESOS IVA INCLUIDO por cada tanque, arrojando
                    un
                    total de
                    ${{ $precioTanque }} IVA INCLUIDO (son: {{ $precioLetraTanque }}), por concepto de 1 TANQUES DE
                    {{ $capacidadTanque }}
                    {{ $unidadMedidaTanque }} NUMERO
                    DE
                    SERIE {{ $serieTanque }} MARCA {{ $marcaTanque }} en un plazo no mayor de 90 días después de
                    haberse
                    determinado la
                    responsabilidad
                    del "comodatario". Esta cláusula quedara sin efectos si la pérdida del objeto se deriva de un caso
                    fortuito
                    o fuerza mayor.
                </p>
            </div>
            <p>
                <span class="font-semibold ">DECIMA SEXTA:</span> Al término del presente contrato "el comodatario" se
                obliga a devolver la cosa objeto del Comodato en su forma individual, por las causas señaladas por los
                artículos 2834 del código Civil del estado de Coahuila y sus correlativos en el Distrito Federal.
            </p>
        </div>
        <div style="margin-top: 100px">
            <table style="width: 100%; margin-left: auto; margin-right: auto; margin-bottom: 50px">
                <tr>
                    <td style="border-top: 1px black solid;  width: 40% ">
                        <p style="text-align: center; margin-top: 3%">
                            “El Comodante“
                        </p>
                        <p style="text-align: center; margin-top: 3%">
                            {{ $nombreRepresentanteLegalEmpresa }}
                        </p>
                    </td>
                    <td style=" width: 40%">
                        <p></p>
                    </td>
                    <td style="border-top: 1px black solid;  width: 40%">
                        <p style="text-align: center; margin-top: 3%">
                            “EL Comodatario
                        </p>
                        <p style="text-align: center; margin-top: 3; margin-bottom: 0%">
                            {{ $nombreRepresentanteLegalClienteFiscal }}
                        </p>
                        <p style="text-align: center; margin-top: 0%">
                            DOMICILIO PARTICULAR
                        </p>
                    </td>
                </tr>
            </table>
            <table style="width: 100%; margin-left: auto; margin-right: auto; margin-bottom: 60px">
                <tr>
                    <td style="border-top: 1px black solid;  width: 40% ">
                        <p style="text-align: center; margin-top: 3%">
                            Testigo
                        </p>

                    </td>
                    <td style=" width: 40%">
                        <p></p>
                    </td>
                    <td style="border-top: 1px black solid;  width: 40%">
                        <p style="text-align: center; margin-top: 3%">
                            Testigo
                        </p>
                    </td>
                </tr>

            </table>
            <table style="width: 100%; margin-left: auto; margin-right: auto; ">
                <tr>
                    <td style="border-top: 1px black solid;  width: 40% ">
                        <p style="text-align: center; margin-top: 3%">
                            Testigo
                        </p>

                    </td>
                    <td style=" width: 40%">
                        <p></p>
                    </td>
                    <td style=" width: 40%">
                        <p></p>
                    </td>
                </tr>
            </table>
        </div>
    </div>

</body>

</html>

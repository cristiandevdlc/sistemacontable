<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>file_1687967674134</title>
    <meta name="author" content="Edgar Sandoval" />
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
            text-indent: 0;
            padding-left: 20px;
            padding-right: 20px;
            text-justify: auto;  
        }

        @page {
            margin-left: 0.01cm;
            margin-top: 0.01cm;
            margin-bottom: 0.01cm;
            margin-right: 0.01cm;
        }


        .h1,
        h1 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 12pt;
        }

        .p,
        p {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
            /* margin: 0pt; */
        }

        .s1 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: underline;
            font-size: 12pt;
        }

        .s2 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
        }

        .s3 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 12pt;
        }

        .s4 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: underline;
            font-size: 12pt;
        }

        .s5 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 11pt;
        }

        li {
            display: block;
        }

        #l1 {
            padding-left: 0pt;
            counter-reset: c1 1;
        }

        #l1>li>*:first-child:before {
            counter-increment: c1;
            content: counter(c1, upper-roman)". ";
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
        }

        #l1>li:first-child>*:first-child:before {
            counter-increment: c1 0;
        }

        li {
            display: block;
        }

        #l2 {
            padding-left: 0pt;
            counter-reset: d1 1;
        }

        #l2>li>*:first-child:before {
            counter-increment: d1;
            content: counter(d1, upper-roman)". ";
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
        }

        #l2>li:first-child>*:first-child:before {
            counter-increment: d1 0;
        }

        #l3 {
            padding-left: 0pt;
            counter-reset: d2 1;
        }

        #l3>li>*:first-child:before {
            counter-increment: d2;
            content: counter(d2, lower-latin)". ";
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
        }

        #l3>li:first-child>*:first-child:before {
            counter-increment: d2 0;
        }

        #l4 {
            padding-left: 0pt;
            counter-reset: d3 1;
        }

        #l4>li>*:first-child:before {
            counter-increment: d3;
            content: counter(d3, upper-roman)". ";
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
        }

        #l4>li:first-child>*:first-child:before {
            counter-increment: d3 0;
        }

        #l5 {
            padding-left: 0pt;
            counter-reset: d2 1;
        }

        #l5>li>*:first-child:before {
            counter-increment: d2;
            content: counter(d2, lower-latin)". ";
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
        }

        #l5>li:first-child>*:first-child:before {
            counter-increment: d2 0;
        }

        table,
        tbody {
            vertical-align: top;
            overflow: visible;
            /* width: 50px; */
        }
    </style>
</head>

<body>
    <div style="">
        <h1 style="padding-top: 80pt;text-indent: 0pt;text-align: justify;">CONTRATO INDIVIDUAL DE TRABAJO
            POR TIEMPO DETERMINADO POR 28 DIAS<span class="p">, que celebran por una
                parte </span>{{ $empresa }}<span class="p">, representada por el</span> 
                <span class="p">
            </span>   {{ $licenciado }}
            
            
            <span class="p">; a quien en lo sucesivo se le denominará para efectos de este contrato EL
                PATRÓN, y
                por la otra el C</span>.<u>{{$nombre}} {{$apellidos}}</u><span class="p">por su propio derecho,
                a
                quien se le denominará EL TRABAJADOR, quienes están conformes en sujetarse a las cláusulas que más
                adelante
                se señalarán, así como en las siguientes:</span></h1>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>

        <p style="text-indent: 0pt;text-align: center;">DECLARACIONES:</p>

        <ol id="l1">
            <li data-list-text="I.">
                <p style="text-indent: 0pt;text-align: justify;">Manifiesta “EL PATRÓN”, ser una sociedad
                    mercantil, debidamente constituida conforme a las leyes de este país, con domicilio en <b>
                        {{ $domocilioempresa }}
                       </b>, de esta ciudad, asimismo estar
                    debidamente representada por el C. <b>{{ $licenciado }}</b>, quien goza de facultades
                    de
                    representación mismas que no le han sido revocadas a la fecha.</p>
                <p style="text-indent: 0pt;text-align: left;"><br /></p>
            </li>
            <li data-list-text="II.">
                <p class="s1" style="text-indent: 0pt;text-align: justify;"> El TRABAJADOR
                    declara llamarse como ha quedado plasmado en párrafos que ante<span class="p">El TRABAJADOR
                        declara llamarse como ha quedado plasmado en párrafos que ante </span>{{$civil}}<span
                        class="h1">
                    </span><span class="p">y con domicilio ubicado en </span>   {{ $domocilioempresa }}<span
                        class="h1">
                    </span></p>
                <p style="text-indent: 0pt;text-align: left;"><br /></p>
            </li>
            <li data-list-text="III.">
                <p style="padding-top: 4pt;text-indent: 0pt;text-align: justify;">Ambas partes se
                    reconocen mutuamente la personalidad con la que comparecen.</p>
                <p style="text-indent: 0pt;text-align: left;"><br /></p>
            </li>
            <li data-list-text="IV.">
                <p style="text-indent: 0pt;text-align: justify;">Declara “EL PATRÓN”, que tiene necesidad
                    de contratar en forma determinada los servicios de “EL TRABAJADOR” por un tiempo determinado, en
                    virtud
                    de que así lo exige la naturaleza del trabajo el cual consiste esencialmente en lo siguiente: ocupar
                    el
                    puesto de <u><b>{{$puesto}}</b></u><b> </b>con un salario diario de $ <b>{{$salario}}
                    </b>mientras se
                    encuentre vigente el contrato de prestación de servicios celebrado entre EL PATRÓN e <b>{{$empresa}}</b>, para la prestación de servicios de personal.</p>
            </li>
        </ol>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">V.- Las partes están conformes en celebrar el
            presente contrato por tiempo determinado EN VIRTUD DE LA NECESIDAD DE LA empresa 
            
            
            <b>{{$empresa}}</b>,


            DEBIDO A LAS NECESIDADES ADMINISTRATIVAS Y OPERATIVAS DE LA EMPRESA,</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 3pt;text-align: justify;">VI. El Trabajador, manifiesta que cuenta con la
            capacidad, conocimientos y experiencia necesarios para ocupar el puesto de <u>
                
                <b>{{$puesto}}</b></u><b>


            </b>solicita el PATRÓN, y que conoce la necesidad específica de la empresa, que está en aptitud de prestar
            sus
            servicios subordinados por tiempo determinado, en la inteligencia de que una vez concluido el plazo de este
            contrato terminará la relación de trabajo sin ninguna responsabilidad para la empresa por tratarse de un
            trabajo
            eventual, sujetándose las partes al tenor de las siguientes:</p>

<br><br><br><br><br><br><br><br><br><br>

        <h1 style="padding-top: 100pt;text-indent: 0pt;text-align: center;">
            CLÁUSULAS:</h1>

        <p style="text-indent: 0pt;text-align: justify;">PRIMERA. El presente contrato lo celebran las
            partes por tiempo determinado, y tendrá una duración determinada, EN VIRTUD DE LA NECESIDAD DE LA empresa
            <b>{{ $empresa }}</b>, DEBIDO A LAS NECESIDADES
        </p>
        <p style="text-indent: 0pt;text-align: justify;">OPERATIVAS Y ADMINISTRATIVAS DE LA EMPRESA, o
            antes, si la causa que le da origen al contrato y la materia del trabajo concluyen antes de esa fecha, toda
            vez
            que la naturaleza del trabajo es transitoria, la actividad del trabajador tiene por objeto iniciar,
            desarrollar,
            ejecutar y concluir PROCESOS ADMINISTRATIVOS en <b>{{ $empresa }}</b>, los servicios transitorios que se
            especifican en el capítulo de declaraciones. Obligándose además el PATRÓN en poner a disposición del
            TRABAJADOR
            durante todo el tiempo de la prestación de servicios, los materiales, y útiles necesarios para la
            realización
            del trabajo.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">SEGUNDA. El TRABAJADOR prestará sus servicios al
            PATRÓN como en las instalaciones del cliente EL PATRON, es decir en las instalaciones de 
            
            <b>INTERGAS DEL
                NORTE</b>,
                
                
                
                sin perjuicio de que por orden del PATRÓN se le encomienden nuevas tareas, horarios y lugares
            correspondientes a sucursales de <b>{{ $empresa }}</b>para desempeñarlas.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">TERCERA. Las partes convienen en que el
            TRABAJADOR prestará sus servicios al PATRÓN en las instalaciones de <b>{{ $empresa }}</b>en jornada
            laboral
            semanal de 48 horas en jornada diurna, 42 horas en jornada nocturna y 45 horas en jornada mixta,
            entendiéndose
            por jornada diurna la comprendida de las seis a las veinte horas, por nocturna la comprendida entre las
            veinte y
            las seis horas y por jornada mixta la que comprenda periodos de tiempo de las jornadas diurna y nocturna,
            siempre que el período nocturno sea menor de tres horas y media, pues si compre de tres y media hora o más
            se
            reputará nocturno, ello conforme a las necesidades del servicio y a las indicaciones de EL PATRÓN. El
            horario
            será señalado por el PATRÓN, dentro de dichos límites, pero EL PATRÓN no podrá cambiar dicho horario si no
            con
            cuarenta y ocho horas de anticipación. El trabajador tiene prohibido trabajar tiempo extraordinario a menos
            que
            la empresa le dé orden por escrito.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">CUARTA. EL TRABAJADOR contara con un periodo de
            capacitación de acuerdo a las necesidades y complejidad del puesto a desempeñar, teniendo como lapso mínimo
            16
            días y como máximo 31 días. Antes de este periodo no podrá ejercer las funciones del puesto sin supervisión.
            Además semestralmente tendrá que estar disponible en la fecha y lugar que se indique para la recibir
            capacitación respecto a los temas de Búsqueda y Rescate, Evacuación, Primeros Auxilios, Prevención y Control
            de
            Incendios.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">QUINTA. Los suscritos acuerdan que el TRABAJADOR
            se obliga a prestar sus servicios personales acatando en el desempeño de su trabajo, todas las disposiciones
            del
            Reglamento Interior de Trabajo, todas las órdenes, circulares, ideario, misión y disposiciones que dicte el
            PATRÓN y todos los ordenamientos legales que le sean aplicables, realizando en todo momento su labor con
            esmero
            y eficiencia en cualquier
            departamento, sitio o en el establecimiento de la empresa que el PATRÓN le indique dentro o fuera de la
            localidad, de conformidad con la cláusula SEGUNDA.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-top:100px;text-indent: 0pt;text-align: justify;">SEXTA. En este acto las partes acuerdan que
            el
            TRABAJADOR podrá rolar o cambiar turnos, horarios y puestos de trabajo, cuando el PATRON le avise el turno
            de
            horario y el puesto a cambiar, lo anterior sin menoscabo del salario que perciba el trabajador en ese
            momento.
        </p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">SÉPTIMA. Se acuerdan las partes en que, el
            TRABAJADOR tendrá la obligación de firmar las listas de raya, nomina, recibos por la cantidad que se pague
            en
            concepto de salario o cualquier prestación que reciba por su trabajo, y aceptar toda deducción que se le
            haga
            por cuotas del Seguro Social, al INFONAVIT, Impuestos, faltas, daños, préstamos, perdidas en los bienes del
            PATRON y/o cualquier otra causa que conforme a la Ley Federal del Trabajo deba pagar el TRABAJADOR.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">OCTAVA. Ambas partes convienen que, el
            TRABAJADOR tendrá las obligaciones y derechos inherentes al puesto por el que le contrata y éste se obliga
            guardar escrupulosamente los secretos técnicos y comerciales de los cuales tenga conocimiento por razón de
            trabajo que desempeñe, así como de los asuntos administrativos reservados cuya divulgación pueda causar
            perjuicio a la empresa, la fabricación e innovación de los productos que el PATRÓN comercialice o
            desarrolle.
        </p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">NOVENA. Son días de descanso obligatorio con
            pago de salario íntegro, únicamente los días señalados en el artículo 74 de la Ley Federal del Trabajo.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">DÉCIMA. El TRABAJADOR, al término del contrato
            de trabajo que hoy se suscribe, tendrá derecho al pago proporcional de vacaciones, así como el pago del 25%
            por
            concepto de prima vacacional, de conformidad con lo establecido por los diversos 76, 77 y relativos de la
            Ley
            Federal del Trabajo, lo anterior en el caso en que la temporalidad de la contratación cambie.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">DÉCIMA PRIMERA. El TRABAJADOR tendrá derecho a
            la parte proporcional de aguinaldo, por el tiempo prestado, de conformidad con lo establecido en el artículo
            87
            de la Ley Laboral.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">DÉCIMA SEGUNDA. El TRABAJADOR se obliga en
            términos de lo establecido por el diverso 134 de la Ley mencionada, a someterse a todos los reconocimientos
            y
            exámenes médicos que el PATRÓN indique, en la inteligencia de que el médico que los practique será designado
            y
            retribuido por el PATRÓN.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">DÉCIMA TERCERA. Las partes acuerdan que para que
            el PATRON pueda solicitarle al TRABAJADOR que labore tiempo extraordinario, será necesario que reciba orden
            por
            escrito, firmada por el Representante Legal del PATRON, en la que se le indique en forma precisa el número
            de
            horas extras, señalándose el momento de inicio y terminación
            de las mismas, así como el día o días que comprenda la jornada extraordinaria de trabajo, pues sin estos
            requisitos convienen las partes en que no existe obligación del TRABAJADOR de laborar horas extraordinarias,
            ni
            obligación del PATRON para pagar horas extraordinarias, ya que en este mismo acto se acuerda por las partes
            que
            el TRABAJADOR, tiene prohibido laborar por iniciativa propia, mayor tiempo del estipulado como jornada
            laboral.
        </p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">DÉCIMA CUARTA. Los signatarios acuerdan en que
            el TRABAJADOR, deberá además de cumplir con sus funciones ordinarias las necesarias que para ello le indique
            el
            PATRON siempre y cuando no le sea física o materialmente imposible.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-top:100px;text-indent: 0pt;text-align: justify;">DECIMA QUINTA. El TRABAJADOR se obliga a
            acatar
            las disposiciones respecto a la capacitación y adiestramiento; planes y programas que para el efecto tenga
            la
            Empresa, de conformidad con lo señalado por la ley.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">DECIMA SEXTA. El TRABAJADOR se obliga a acatar
            las disposiciones de seguridad e higiene, que se llevan a efecto en la Empresa, en los términos de la ley.
        </p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: justify;">Leído que fue el presente contrato por las
            partes, firman al margen en la primera y al calce para constancia y aceptación ante la presencia de dos
            testigos, a los días <u><b>13 de junio de 2023</b></u>.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>

        <table style="border-collapse:collapse;margin-left:-35" cellspacing="0">
            <tr style="height: 22pt;">
                <td
                    style="width: 225pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p class="s2"
                        style="padding-left: 23pt; padding-right: 22pt; text-indent: 0pt; text-align: center;">EL PATRON
                    </p>
                </td>
                <td
                    style="width: 246pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p class="s2"
                        style="padding-left: 14pt; padding-right: 14pt; text-indent: 0pt; text-align: center;">EL
                        TRABAJADOR</p>
                </td>
            </tr>
            <tr style="height: 69pt">
                <td
                    style="width: 225pt; height: 150pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                    <p style="padding-left: 16pt; text-indent: 0pt; line-height: 1pt; text-align: left;" />
                    <p class="s3"
                        style="padding-top: 100pt; padding-left: 25pt; padding-right: 22pt; text-indent: 0pt; line-height: 11pt; text-align: center;">
                        {{ $licenciado }}</p>
                </td>
                <td
                    style="width: 246pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 2pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                    <p style="padding-left: 5pt; text-indent: 0pt; line-height: 1pt; text-align: left;" />
                    {{-- <hr style="padding-top: 100pt" > --}}
                    <p class="s3"
                        style="padding-left: 14pt; padding-top: 100pt; padding-right: 14pt; text-indent: 0pt; line-height: 11pt; text-align: center;">
                        {{$nombre}} {{$apellidos}}</p>
                </td>
            </tr>
            <tr style="height: 29pt">
                <td
                    style="width: 268pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                </td>
                <td
                    style="width: 246pt; border-top-style: solid; border-top-width: 2pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                </td>
            </tr>
            <tr style="height: 22pt">
                <td
                    style="width: 268pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p class="s2"
                        style="padding-left: 23pt; padding-right: 22pt; text-indent: 0pt; text-align: center;">TESTIGOS
                    </p>
                </td>
                <td
                    style="width: 246pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p class="s2"
                        style="padding-left: 14pt; padding-right: 14pt; text-indent: 0pt; text-align: center;">TESTIGOS
                    </p>
                </td>
            </tr>
            <tr style="height: 52pt">
                <td
                    style="width: 268pt; padding-top: 100pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                </td>
                <td
                    style="width: 246pt; padding-top: 100pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                </td>
            </tr>
            <tr style="height: 23pt">
                <td
                    style="width: 268pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                </td>
                <td
                    style="width: 246pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt">
                    <p style="text-indent: 0pt; text-align: left;"><br /></p>
                </td>
            </tr>
        </table>

        <br>
        <br><br>
        <br>
        <br>
        <br><br>
        <br>
        <br>
        <br><br>
        <br>
        <br>
        <br><br>
        <br>
        <br>
        <br><br>
        <br>
        <br>
        <br><br>
        <br>
        <br>
        <br><br>
        <br>


        <h1 style="padding-top:100pt;text-align: center;">INTERGAS DEL
            NORTE CONTRATO DE CONFIDENCIALIDAD </h1>


        <h1 style="text-indent: 0pt;text-align: justify;"><span class="p">Contrato de confidencialidad
                que celebran por una parte </span>{{ $empresa }}<span class="p">, representada por el C.
            </span>{{ $licenciado }}<span class="p">, a quien en lo sucesivo se le denominara &quot;El
                Titular&quot;, y por
                la otra el C.</span><span class="s4"> </span><u>HOSSTIN DANIEL</u> <u>CASTRUITA RIVAS</u> <span
                class="p">en
                adelante denominado &quot;el receptor&quot;, al tenor de las siguientes declaraciones y
                clausulas:</span>
        </h1>
        <p style="padding-top: 5pt;text-indent: 0pt;text-align: center;">DECLARACIONES</p>
        <ol id="l2">
            <li data-list-text="I.">
                <p style="padding-top: 5pt;text-indent: -36pt;text-align: left;">Declara el
                    representante legal de &quot;EL TITULAR&quot;:</p>
                <ol id="l3">
                    <li data-list-text="a.">
                        <p style="padding-top: 5pt;text-indent: -18pt;text-align: left;">Que su
                            representada es una Sociedad mercantil de nacionalidad mexicana, constituida bajo las leyes
                            de
                            los Estados Unidos Mexicanos.</p>
                    </li>
                    <li data-list-text="b.">
                        <p style="padding-top: 5pt;text-indent: -18pt;text-align: left;">Que su
                            representada y &quot;EL RECEPTOR&quot; firmaron un contrato de trabajo, en el que se convino
                            que
                            “El RECEPTOR” desempeñaría funciones en las cuales se maneja información confidencial y de
                            uso
                            exclusivo de “EL TITULAR”.</p>
                    </li>
                    <li data-list-text="c.">
                        <p style="padding-top: 5pt;text-indent: -18pt;text-align: left;">Que con
                            motivo del contrato referido anteriormente y de lo declarado en el inciso b) que antecede,
                            &quot;EL TITULAR&quot; dispone y utiliza &quot;información confidencial&quot; relativa a EL
                            NEGOCIO. Dicha &quot;información confidencial&quot; para efecto de este contrato es definida
                            como cualquier secreto, técnico o información que le signifique obtener o mantener una
                            ventaja
                            competitiva o económica frente a terceros en la realización de actividades económicas y
                            respecto
                            de la cual ha preservado su confidencialidad y el acceso restringido a la misma, que de una
                            manera enunciativa más no limitativa comprende:</p>
                        <ol id="l4">
                            <li data-list-text="I.">
                                <p style="padding-top: 5pt;text-indent: -36pt;text-align: left;">La
                                    existencia del contrato de trabajo referido en el inciso b).</p>
                            </li>
                            <li data-list-text="II.">
                                <p style="padding-top: 5pt;text-indent: -35pt;text-align: left;">La
                                    posibilidad de llevar a cabo EL NEGOCIO De Desarrollo de tecnologías, Redes y
                                    Telecomunicaciones.</p>
                            </li>
                            <li data-list-text="III.">
                                <p style="padding-top: 5pt;text-indent: -35pt;text-align: left;">
                                    Información incorporada en software de computadoras o incluida en medios de
                                    almacenamiento electrónico, así como información contenida en documentos, medios
                                    magnéticos, discos ópticos, microfilmes, películas u otros medios similares.</p>
                            </li>
                            <li data-list-text="IV.">
                                <p style="padding-top: 5pt;text-indent: -35pt;text-align: left;">
                                    Información revelada en forma oral o escrita, relativa a la actividad de &quot;EL
                                    TITULAR&quot; en relación con los estudios de factibilidad técnica, económica,
                                    comercial, jurídica y fiscal, entre otras, de llevar a cabo &quot;EL NEGOCIO&quot;,
                                    así
                                    como &quot;EL NEGOCIO&quot; mismo y negociaciones que se relacionen con este.</p>
                                <p style="text-indent: 0pt;text-align: left;"><br /></p>
                            </li>
                            <li data-list-text="V.">
                                <p style="text-indent: -35pt;text-align: left;">Toda información,
                                    trabajos, informes, programas, estudios, entre otros, que genere &quot;EL
                                    RECEPTOR&quot;
                                    con motivo de los trabajos de que realice en favor de &quot;EL TITULAR&quot;
                                    relacionada
                                    con la factibilidad técnica, económica, comercial, jurídica y fiscal, entre otras,
                                    de
                                    llevar a cabo &quot;EL NEGOCIO&quot;, así como &quot;EL NEGOCIO&quot; mismo y
                                    negociaciones que se relacionen con éste. Las partes convienen que toda la
                                    información referida en este inciso es propiedad de &quot;EL TITULAR&quot;.</p>
                            </li>
                        </ol>
                    </li>
                    <li data-list-text="d.">
                        <p style="padding-top: 100pt;text-indent: -21pt;text-align: left;">Que con motivo
                            de &quot;EL NEGOCIO&quot; &quot;EL TITULAR&quot; y &quot;EL RECEPTOR&quot;</p>
                        <p style="text-indent: 0pt;text-align: justify;">convinieron que éste último
                            realice trabajos a que se refiere el contrato de trabajo que se menciona en el inciso b) del
                            presente contrato, por lo que &quot;EL TITULAR&quot; se verá en la necesidad de transmitirle
                            &quot;información confidencial&quot; a &quot;EL RECEPTOR&quot;, en forma regular, a efecto
                            de
                            que éste la aplique o utilice exclusivamente para el desarrollo de los trabajos
                            encomendados.
                        </p>
                    </li>
                </ol>
            </li>
            <li data-list-text="II.">
                <p style="padding-top: 5pt;text-indent: -28pt;text-align: left;">Declara &quot;EL
                    RECEPTOR&quot;:</p>
                <ol id="l5">
                    <li data-list-text="a.">
                        <p style="padding-top: 5pt;text-indent: -18pt;text-align: left;">Que tiene la
                            capacidad legal para celebrar el presente contrato.</p>
                        <p style="text-indent: 0pt;text-align: left;"><br /></p>
                    </li>
                    <li data-list-text="b.">
                        <p style="text-indent: -18pt;text-align: justify;">Que derivado de las
                            Declaraciones de &quot;EL TITULAR&quot; y para el desarrollo de los trabajos que tiene
                            encomendados, relacionadas con la factibilidad técnica, económica, comercial, jurídica y
                            fiscal,
                            entre otras que lleva a cabo &quot;EL NEGOCIO&quot;, necesita tener conocimiento de la
                            &quot;información confidencial&quot; que reconoce coloca o mantiene a &quot;EL TITULAR&quot;
                            en
                            una ventaja económica o competitiva frente a terceros en la realización de actividades
                            económicas.</p>
                        <p style="text-indent: 0pt;text-align: left;"><br /></p>
                    </li>
                    <li data-list-text="c.">
                        <p style="text-indent: -18pt;text-align: justify;">Que es su deseo celebrar y
                            cumplir el presente contrato en los términos y condiciones del mismo.</p>
                    </li>
                </ol>
            </li>
        </ol>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-left: 41pt;text-indent: 0pt;line-height: 114%;text-align: left;">Una vez realizadas por ambas
            partes las declaraciones que preceden, convienen en otorgar las siguientes:</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-top: 5pt;text-indent: 0pt;text-align: center;">CLAUSULAS</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">PRIMERA.- &quot;EL
            TITULAR,
            cuando sea necesario, proporcionará a &quot;EL RECEPTOR&quot; la &quot;información confidencial&quot; que
            requiera para que la considere al desempeñar los trabajos encomendados, en favor de &quot;EL TITULAR&quot;
            relacionados con la factibilidad técnica, económica, comercial, jurídica y fiscal, entre otras, de llevar a
            cabo
            &quot;EL NEGOCIO&quot; así como sobre &quot;EL NEGOCIO&quot; mismo.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">“EL RECEPTOR&quot; a
            partir de
            la fecha de celebración del presente contrato, se obliga a no enajenarla, arrendarla, prestarla, grabarla,
            negociarla, revelarla, publicarla, enseñarla, darla a conocer, transmitirla o de alguna otra forma
            divulgarla o
            proporcionarla a cualquier persona física o moral, nacional o extranjera, pública o privada, por cualquier
            medio, aun cuando se trate de incluirla o entregarla en otros documentos como estudios, reportes, propuestas
            u
            ofertas, ni en todo ni en parte, por ningún motivo a terceras personas físicas o morales, nacionales o
            extranjeras, públicas o privadas, presentes o futuras, que no hayan sido autorizadas previamente y por
            escrito
            por &quot;EL TITULAR&quot; conforme a lo previsto en la cláusula segunda.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">De igual forma, &quot;EL
            RECEPTOR&quot; a partir de la fecha de celebración del presente contrato, se obliga a no enajenarla,
            arrendarla,
            prestarla, grabarla, negociarla, revelarla, publicarla, enseñarla, darla a conocer, transmitirla o de alguna
            otra forma divulgarla o proporcionarla por cualquier medio, aun cuando se trate de</p>
        <p style="padding-top: 3pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">incluirla o entregarla en
            otros
            documentos como estudios, reportes, propuestas u ofertas, ni en todo ni en parte, por ningún motivo a
            sociedades
            de las cuales &quot;EL RECEPTOR&quot; sea accionista, asesor, causahabiente, apoderado, consejero,
            comisario,
            tenedor de acciones y, en general, tenga alguna relación de índole cualquiera por sí o por terceras
            personas.
        </p>
        <p style="padding-top: 100pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">Asimismo, &quot;EL
            RECEPTOR&quot; conviene expresamente en que no podrá aprovechar o utilizar, en ningún caso, la
            &quot;información
            confidencial&quot; para sí o para fines propios. &quot;EL RECEPTOR&quot; asume la obligación de no revelar
            la
            &quot;información confidencial&quot; por diez años contados a partir de la fecha de firma del presente
            contrato.
        </p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">La obligación de no
            enajenar,
            arrendar, prestar, gravar, negociar, revelar, publicar, enseñar, dar a conocer, transmitir o de alguna otra
            forma divulgar o proporcionar a cualquier persona física o moral, nacional o extranjera, pública o privada,
            presente o futura, por cualquier medio, incluyendo los indicados en el párrafo segundo de esta cláusula
            primera,
            la &quot;información confidencial&quot; prevista en este contrato se extiende a sus socios, consejeros,
            representantes legales, directivos, gerentes, asesores, dependientes y demás personas físicas o morales que
            guarden relación con &quot;EL RECEPTOR&quot;, por lo que éste último se obliga a comprometer a las personas
            referidas en este párrafo al cumplimiento de este contrato y, de igual forma, a no referirse a la
            &quot;información confidencial&quot; en público ni en privado, independientemente de los fines de la
            exposición,
            ya sea cátedra, conferencia o cualquier otro medio, sin importar si dichas cátedras o conferencias o demás
            medios son o no pagado.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">En virtud de lo anterior,
            queda
            entendido que &quot;EL RECEPTOR&quot; debe asegurarse que cada receptor de información mencionados en el
            párrafo
            que antecede se adhiera al compromiso de confidencialidad previsto en este contrato.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">Las partes contratantes
            reconocen y convienen que toda la información relacionada con el inciso c) apartado V, de las Declaraciones
            de
            &quot;EL TITULAR&quot; es en todo tiempo propiedad de &quot;EL TITULAR&quot; por lo que &quot;EL
            RECEPTOR&quot;
            acuerda observar en este sentido lo dispuesto en el párrafo que antecede y, en general lo convenido en este
            instrumento.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">&quot;EL TITULAR&quot;
            podrá
            reclamar o solicitar se le devuelva la &quot;información confidencial&quot; en cualquier tiempo mediante
            comunicación que haga a &quot;EL RECEPTOR&quot;.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">&quot;EL RECEPTOR&quot;
            deberá
            devolver, dentro de los 3 días siguientes a la fecha en que reciba el comunicado, los originales, copias y
            reproducciones de la &quot;información confidencial&quot; que tenga en su posesión así como la que esté en
            posesión de personas a las cuales la &quot;información confidencial&quot; les haya sido divulgada.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">SEGUNDA.- &quot;EL
            TITULAR&quot; debe autorizar por escrito y previamente a &quot;EL RECEPTOR&quot; en caso de que sea deseo de
            &quot;EL TITULAR&quot;, o necesidad de &quot;EL RECEPTOR&quot; divulgar todo o parte de la &quot;información
            confidencial&quot; a un tercero.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">&quot;EL TITULAR&quot;
            podrá
            negar la referida autorización sin expresar causa alguna.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">Si &quot;EL TITULAR&quot;
            otorga la autorización escrita firmará con el tercero para tal efecto, un contrato de confidencialidad
            previamente a que &quot;EL RECEPTOR&quot; le proporcione todo o en parte cualquier &quot;información
            confidencial&quot; al tercero, para lo</p>
        <p style="padding-top: 3pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">cual &quot;EL
            RECEPTOR&quot;
            deberá cerciorarse antes de divulgar la &quot;información confidencial&quot; si efectivamente &quot;EL
            TITULAR&quot; y el tercero firmaron el correspondiente contrato de confidencialidad.</p>
        <p style="padding-top: 100pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">TERCERA.- &quot;EL
            RECEPTOR&quot; conviene en no celebrar con ninguna persona física o moral, nacional o extranjera, pública o
            privada, presente o futura, cualquier clase de acuerdo, convenio, contrato, negociación o asumir
            obligaciones
            que estén en conflicto con el presente contrato o que deriven o impliquen el incumplimiento del mismo.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">CUARTA.- Los elementos
            específicos que se consideran como parte de la &quot;información confidencial&quot; definida anteriormente,
            son:
            (Clientes, Facturación, Proveedores, Administración de página web, Logística de la empresa, procedimientos,
            estrategias de venta, manuales de operaciones y planes a desarrollar).</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">QUINTA.- En caso de que
            &quot;EL RECEPTOR&quot; incumpla con las obligaciones a su cargo, previstas en este instrumento, pagará a
            &quot;EL TITULAR&quot; una indemnización correspondiente a los daños y perjuicios que por este concepto se
            generen, o bien, una pena convencional equivalente a la cantidad que tenga el costo del proyecto señalado en
            el
            contrato de prestación de servicios o cualquier tercero cesionario del referido contrato reclame a &quot;EL
            TITULAR&quot; como resultado del incumplimiento de este contrato, además de las cantidades que se generen
            por
            concepto de gastos de abogados y del procedimiento judicial que o cualquier tercero cesionario del contrato
            de
            prestación de servicios entable en contra de &quot;EL TITULAR&quot;, así como los gastos de abogados y del
            procedimiento judicial que &quot;EL TITULAR&quot; tenga que promover en contra de &quot;EL RECEPTOR&quot;.
        </p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">SEXTA.- La vigencia del
            presente contrato será de 10 años contados a partir de la fecha de firma del mismo.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">SEPTIMA.- En caso de que
            una o
            más de las disposiciones contenidas en este contrato sea, por cualquier razón, inválida, ilegal o no pueda
            ejercitarse en cualquier aspecto, tal invalidez o ilegalidad no afectará cualquier otra disposición aquí
            prevista y este contrato será interpretado como si tal disposición inválida o ilegal nunca hubiera sido
            incluida.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">OCTAVA.- El presente
            contrato
            solo puede ser modificado mediante convenio por escrito suscrito por todas las partes contratantes.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">NOVENA.- Todo aviso o
            notificación que deban hacerse las partes respecto del presente contrato se realizará por escrito a los
            siguientes domicilios:</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">&quot;EL TITULAR&quot;:
            <b>   {{ $domocilioempresa }}</b>.
        </p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">&quot;EL RECEPTO Asimismo,
            si
            por cualquier causa alguna de las partes contratantes cambia su domicilio, la parte que sufra el cambio
            deberá
            notificarlo con una anticipación de cinco días naturales a la fecha en que ocurra el cambio, de lo contrario
            las
            notificaciones hechas al anterior domicilio surtirán todos sus efectos.</p>

        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>




        <p style="padding-top: 100pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">DECIMA.- Para la
            interpretación
            y cumplimiento de este contrato, así como para la resolución de cualquier controversia relacionada con el
            mismo
            las partes se someterán a la jurisdicción de los tribunales de la ciudad de Torreón, Coahuila,</p>
        <p style="padding-top: 3pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">renunciando expresamente a
            cualquier otro fuero que por cualquier causa pudiere corresponderles.</p>
        <p style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;">DECIMA PRIMERA.- Las
            partes
            reconocen y aceptan que las presentes declaraciones y cláusulas contenidas en este convenio dejan sin efecto
            cualquier acuerdo o negociación sostenido por ellas previamente, prevaleciendo lo dispuesto en este
            instrumento
            respecto de cualquier otro acuerdo anterior.</p>
        <p class="s1" style="padding-top: 5pt;padding-left: 41pt;text-indent: 0pt;text-align: justify;"><span
                class="p">Leído que fue en todas sus partes el contenido del presente contrato y conociendo las
                partes
                contratantes el alcance de todas las declaraciones y cláusulas lo suscriben por duplicado en la ciudad
                de
                Torreón, Coahuila, el </span>13 de junio de<span class="h1"> </span>2023<span
                class="p">.</span></p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <table style="border-collapse:collapse;margin-left:0" cellspacing="0">
            <tr style="height:26pt">
                <td
                    style="width:242pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2"
                        style="padding-left: 82pt;padding-right: 81pt;text-indent: 0pt;text-align: center;">“EL
                        TITULAR“</p>
                </td>
                <td
                    style="width:228pt;
                
                border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-left: 67pt;text-indent: 0pt;text-align: left;">“EL RECEPTOR”</p>
                </td>
            </tr>
            <tr style="height:51pt">
                <td
                    style="width:242pt;
                height: 150pt;
                border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;"><br /></p>
                </td>
                <td
                    style="width:228pt;
                height: 150pt;
                border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;"><br /></p>
                </td>
            </tr>
            <tr style="height:58pt">
                <td
                    style="width:242pt;
                border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s5"
                        style="padding-left: 107pt;text-indent: -34pt;line-height: 114%;text-align: left;">{{ $licenciado }}</p>
                </td>
                <td
                    style="width:228pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s5"
                        style="padding-left: 114pt;text-indent: -63pt;line-height: 114%;text-align: left;">HOSSTIN
                        DANIEL CASTRUITA RIVAS</p>
                </td>
            </tr>
        </table>

        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <h1 style="padding-top: 100pt;padding-left: 41pt;text-indent: 0pt;text-align: left;">QUIEN CORRESPONDA:</h1>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-left: 41pt;text-indent: 0pt;text-align: left;">Presente.-</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-left: 41pt;text-indent: 67pt;text-align: justify;">Por medio de la presente, me permito
            informar
            que con la fecha arriba mencionada por así convenir a mis intereses, renuncio formal e irrevocablemente al
            trabajo que le he venido prestando para <b>{{ $empresa }}</b></p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-left: 41pt;text-indent: 35pt;text-align: justify;">Aprovecho la ocasión para hacer constar
            que
            durante el tiempo de prestación de mis servicios, siempre recibí el pago de todas las prestaciones a que
            tuve
            derecho conforme a la Ley y a mi contrato individual de trabajo tales como: salarios ordinarios, séptimos
            días,
            días festivos, vacaciones, prima vacacional, horas extras, aguinaldo y PTU y se me han pagado las partes
            proporcionales correspondientes al presente año hasta el día de hoy en que me retiro voluntariamente sin
            pendientes económicos de ningún tipo.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="padding-left: 41pt;text-indent: 35pt;text-align: justify;">Por ser de equidad manifiesto, que durante
            la
            prestación de mis servicios no sufrí la realización de riesgo profesional alguno, por lo que no
            adeudándoseme
            cantidad alguna, extiendo el finiquito más amplio que en derecho proceda a favor de<b>{{ $empresa }}</b>y
            no me reservo acción o derecho alguno que ejercitar en su contra en lo presente y en lo futuro.</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;text-align: center;">Atentamente</p>
        <p style="text-indent: 0pt;text-align: left;"><br /></p>
        <p style="text-indent: 0pt;line-height: 2pt;text-align: center;" />
        <hr>
        <p class="s1" style="text-indent: 0pt;text-align: center;">{{$nombre}} {{$apellidos}}</p>



    </div>
</body>

</html>

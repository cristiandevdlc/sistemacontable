<!DOCTYPE html>
<html>
<head>
    <title>PDF Title</title>
    <style>
        /* Estilos CSS para el PDF */
        @page { margin: 100px 50px; }
        header { position: fixed; top: -50px; left: 0px; right: 0px; height: 50px; text-align: center; width: 100%; display: flex; justify-content: space-between; flex-direction: row; }
        footer { position: fixed; bottom: -50px; left: 0px; right: 0px; height: 50px; text-align: center; }
        section { page-break-after: always; }
        .container { flex: 1; border: 1px solid black; padding: 10px; }
        table {
            width: 100%; /* Ocupa todo el ancho disponible */
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid rgb(255, 255, 255);
            padding: 8px;
            text-align: center;
        }
    </style>
</head>
<body>
    <header>
        <table>
            <tr>
                <th>Imagen</th>
                <th>Columna 2</th>
                <th>Columna 3</th>
            </tr>
            <tr>
                <td>PEDIDOS: </td>
                <td>{{ $Datos->Nombre ? $Datos->Nombre : 'Sin nombre' }}</td>
                <td>{{ $Datos->Empresa_calle ? $Datos->Empresa_calle : 'S/N CALLE' }}</td>
            </tr>
            <tr>
                <td></td>
                <td>Dato 5</td>
                <td>Dato 6</td>
            </tr>
        </table>
    </header>
    
    
    
    <footer>Footer Content</footer>

    <section>
        <!-- Contenido de la primera parte -->
    </section>

    <section>
        <!-- Contenido de la segunda parte -->
    </section>

    <section>
        <!-- Contenido de la tercera parte -->
    </section>

    <section>
        <!-- Contenido de la cuarta parte -->
    </section>
</body>
</html>

 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
@php
    use Carbon\Carbon;
@endphp

<head>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<style type="text/css">
    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        border: rgb(0, 0, 0) 2px solid;
    }

    table,
    th,
    td {
        border: 1px solid rgb(255, 255, 255);
        border-collapse: collapse;
        font-size: 12px;
        font-family: 'Arial', sans-serif;
    }

    .columna {
        width: 28.33%;
        float: left;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid #ffffff;
    }

    .fila::after {
        content: "";
        display: table;
        clear: both;
    }

    .columna {
        display: flex;
        flex-direction: column;
    }

    .titulo {
        font-style: normal;
        font-size: 12pt;
        font-family: 'Arial', sans-serif;
        font-weight: bold;
        color: #000000;
        text-align: center;
    }

    .info {
        font-style: normal;
        font-size: 10pt;
        font-family: 'Arial', sans-serif;
        color: #000000;
        text-align: center;
    }

    .tabla {
        width: 100%;
        background-color: rgb(255, 255, 255);
        border: 1px solid rgb(0, 0, 0);
        border-left: 1px solid black;
        border-right: 1px solid black;
        color: #000000;
        text-align: center;
    }

    .subtotal-container {
        background-color: rgb(255, 255, 255);
        text-align: center;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        border-right: none;
        text-align: left;
        width: 100%;
    }

    .subtotal-label {
        background-color: rgb(255, 255, 255);
        text-align: left;
        color: black;
        font-size: 12px;
    }

    .subtotal-value {
        background-color: rgb(255, 255, 255);
        text-align: right;
        color: black;
        font-size: 12px;
    }

    .subtotal-cell {
        background-color: rgb(255, 255, 255);
        text-align: center;
        border: 1px solid black;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        border-right: none;
        text-align: left;
        width: 50%;
    }

    .document-info {
        background-color: rgb(255, 255, 255);
        text-align: left;
        font-size: 10px;
        border-bottom: 1px solid rgb(255, 255, 255);
    }

    .document-info h2 {
        color: black;
        font-size: 10px;
        margin-bottom: 5px;
    }

    .document-info strong {
        font-weight: bold;
    }

    .column-one {
        width: 160%;
    }

    .column-two {
        width: 130%;
    }

    .empty-cell {
        background-color: rgb(255, 255, 255);
        border-bottom: 1px solid rgb(255, 255, 255);
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    .table th,
    .table td {
        background-color: rgb(255, 255, 255);
        border: 1px solid black;
        /* padding: 8px; */
    }

    .table-header {
        color: black;
        font-size: 15px;
    }

    .table-data {
        text-align: left;
        border-right: none;
    }

    .table-data strong {
        font-weight: bold;
    }

    .table-data.na {
        color: #888888;
    }

    .table-header th {
        background-color: rgb(255, 255, 255);
        text-align: center;
        border: 1px solid black;
        /* padding: 8px; */
    }

    .table-header2 th {
        background-color: rgb(255, 255, 255);
        text-align: left;
        border: 1px solid rgb(255, 255, 255);
        padding: 2px;
    }

    .table-header th:nth-child(odd) {
        background-color: rgb(255, 255, 255);
    }

    .table-data td {
        background-color: rgb(255, 255, 255);
        text-align: center;
        border: 1px solid black;
        padding: 8px;
    }
    h2{
        font-size: 10px;
        font-family: 'Arial', sans-serif;

    }
</style>
</head>

<body>

    <div class="fila">
        <div class="columna">
            <img style="position:absolute;width:2.12in;height:0.75in;padding-top:40px" src="{{ $Images['Logotipo'] }}" />
            <table style="position:absolute; width:2.12in; height:0.75in;padding-top:120px">
                <tr>
                    <th style="background-color: rgb(255, 255, 255); text-align: center;width:100%">
                        PEDIDOS:
                        {{ $Datos->Empresa_telefonos ? $Datos->Empresa_telefonos : 'S/N TELEFONO' }}</th>
                </tr>
            </table>
        </div>


        <div class="columna">
            <p class="titulo">{{ $Datos->Nombre ? $Datos->Nombre : 'Sin nombre' }}</p>
            <div class="info">
                <span>{{ $Datos->Empresa_calle ? $Datos->Empresa_calle : 'S/N CALLE' }}:</span>
                <span>{{ $Datos->Empresa_localidad ? $Datos->Empresa_localidad : 'S/N LOCALIDAD' }} CP:
                    {{ $Datos->CodigoPostal ? $Datos->CodigoPostal : 'S/N CODIGO POSTAL' }}</span>
                <p>RFC: {{ $Datos->RfcEmpresa ? $Datos->RfcEmpresa : 'Sin RFC' }}</p>
                <p>TEL: {{ $Datos->Empresa_telefonos ? $Datos->Empresa_telefonos : 'S/N TELEFONO' }}</p>
            </div>
        </div>

        <div class="columna">
            <p class="titulo" style="text-align: right"><strong>FACTURA</strong></p>
            <table class="tabla">
                <tr style="border: #000000">
                    <th style="border: #000000">FECHA</th>
                    <th style="border: #000000">FOLIO</th>
                </tr>
                <tr style="border: #000000">
                    <td style="border: #000000">
                        {{ $Extraccion->FechaTimbre ? date('d/m/Y', strtotime($Extraccion->FechaTimbre)) : 'S/N FECHA DE TIMBRADO' }}
                    </td>
                    <td style="border: #000000">
                        D- {{ $Datos->Factura->NFolio }}
                    </td>
                </tr>
            </table>
        </div>



    </div>
    <table class="table">
        <tr>
            <th colspan="2" class="table-header">CLIENTE</th>
        </tr>
    </table>



    <table style="width:100%;height:10%; border-collapse: collapse;">

        <tr class="table-header2">
            <th>NOMBRE:</th>
            <th>{{ $Datos->NombreCliente ? $Datos->NombreCliente : '<span class="na">S/N COMERCIAL</span>' }}</th>
            <th>RFC</th>
            <th> {{ $Datos->RfcCliente ? $Datos->RfcCliente : '<span class="na">S/N RFC</span>' }}</th>
        </tr>
        <tr class="table-header2">
            <th>DOMICILIO:</th>
            <th>{{ $Datos->Domicilio ? $Datos->Domicilio : 'S/N CALLE' }} </th>
            <th>CONDICIONES:</th>
            <th> CREDITO 30 DIAS</th>
        </tr>
        <tr class="table-header2">
            <th>POBLACIÓN:</th>
            <th>{{ $Datos->Localidad ? $Datos->Localidad : 'S/N LOCALIDAD' }},
                {{ $Datos->Estado ? $Datos->Estado : 'S/N ESTADO' }} CP:</th>
            <th>USO DE CFDI:</th>
            <th>{{ $Datos->UsoCfdiClave ? $Datos->UsoCfdiClave : 'S/N  NUMERO CFDI' }} :
                {{ $Datos->UsoCfdiNombre ? $Datos->UsoCfdiNombre : 'S/N CFDI' }}</th>
        </tr>
        <tr class="table-header2">
            <th>REGIMEN FISCAL:</th>
            <th> {{ $Datos->RegimenDescripcion ? $Datos->RegimenDescripcion : 'S/N REGIMEN' }}</th>
            {{-- <th>USO DE CFDI:</th> --}}
            {{-- <th>{{ $Datos->UsoCfdiClave ? $Datos->UsoCfdiClave : 'S/N  NUMERO CFDI' }} : {{ $Datos->UsoCfdiNombre ? $Datos->UsoCfdiNombre : 'S/N CFDI' }}</th> --}}
        </tr>


    </table>

    <table style="width:100%;height:15%; border-collapse: collapse;">

        <tr class="table-header">
            <th>ARTICULO</th>
            <th>IDENTIFICACION</th>
            <th>NOMBRE</th>
            <th>U. MEDIDA</th>
            <th>UNIDADES</th>
            <th>PRECIO</th>
            <th>IMPORTE</th>
        </tr>

        @foreach ($Datos->Conceptos as $concepto)
            <tr class="table-data">
                <td>{{ $concepto['NOidentificacion'] }}</td>
                <td>{{ $concepto['Descripcion'] }}</td>
                <td>{{ $concepto['ConceptoNombre'] }}</td>
                <td>{{ $concepto['UnidadNombre'] }}</td>
                <td>{{ $concepto['Cantidad'] }}</td>
                <td>{{ number_format($concepto['Precio'], 2, '.', ',') }}</td>
                <td>{{ number_format($concepto['Importe'], 2, '.', ',') }}</td>
            </tr>
        @endforeach
    </table>



    <table style="width:100%; border-collapse: collapse;">
        @php
            $complementos = [
                [
                    'label' => 'CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACION DIGITAL DEL SAT',
                    'cadena' => $Extraccion->CadenaComplementoSAT,
                ],
                ['label' => 'SELLO DIGITAL DE CFDI', 'cadena' => $Extraccion->selloDigitalEmisor],
                ['label' => 'SELLO DIGITAL DEL SAT', 'cadena' => $Extraccion->selloDigitalSAT],
            ];

            foreach ($complementos as $complemento) {
                $cadena = $complemento['cadena'];
                $longitud = strlen($cadena);
                $partes = str_split($cadena, ceil($longitud / 4));

                echo '<tr>';
                echo '<td style="background-color: rgb(255, 255, 255); text-align: center; border-bottom: 1px solid rgb(255, 255, 255); text-align:left;width:100%;font-size:7pt;">';
                echo '<strong>' . $complemento['label'] . ':</strong><br>';

                foreach ($partes as $parte) {
                    echo $parte . '<br>';
                }

                echo '</td>';
                echo '</tr>';
            }
        @endphp
    </table>




    <table style="width:100%;height:10%; border-collapse: collapse;">

        <tr>
            <td
                style="background-color: rgb(255, 255, 255); border: 1px solid black; border-left: none; border-top: 1px solid black; border-bottom: 1px solid black;text-align:center;width:100%">
                <img src="{{ $Images['Qrcode'] }} }}" alt="Código QR"
                    style="display: block; max-width: 100%; max-height: 90%; margin: auto;">

            </td>
            <td
                style="background-color: rgb(255, 255, 255); text-align: center; border: 1px solid rgb(0, 0, 0); border-top: 1px solid rgb(0, 0, 0); border-bottom: 1px solid rgb(0, 0, 0); border-right:  1px solid rgb(0, 0, 0);text-align:left;width:150%">
                <table style="width:100%; border-collapse: collapse;">
                    <tr>
                        <th
                            style="background-color: rgb(255, 255, 255); text-align: center; border: 1px solid rgb(255, 255, 255); color: black; font-size: 12px;border-bottom: 1px solid rgb(0, 0, 0); ">
                            CANTIDAD CON LETRA
                        </th>
                    </tr>
                    <tr>
                        <td
                            style="background-color: rgb(255, 255, 255); text-align: center; border: 1px solid rgb(255, 255, 255); border-left: none; border-top: 1px solid black; border-bottom: 1px solid black;text-align:left;">
                            {{ $Extraccion->Total_en_palabras }} PESOS M.N
                        </td>
                    </tr>

                </table>

                <table style="width:100%; border-collapse: collapse;">
                    <tr>
                        <th
                            style="background-color: rgb(255, 255, 255); text-align: center; border: 1px solid rgb(255, 255, 255);font-size: 12px;border-bottom: 1px solid rgb(0, 0, 0);">
                            OBSERVACIONES
                        </th>
                    </tr>
                    <tr>
                        <td
                            style="background-color: rgb(255, 255, 255); text-align: center; border: 1px solid rgb(255, 255, 255); border-left: none; border-bottom: 1px solid rgb(255, 254, 254);text-align:left;">
                            {{ isset($Datos->Observaciones) ? $Datos->Observaciones : 'SIN NINGUNA OBSERVACIÓN' }}
                        </td>
                    </tr>

                </table>

                <table style="width:100%; border-collapse: collapse;">
                    <tr>
                        <td rowspan="1"
                            style="background-color: rgb(255, 255, 255); text-align: center; border: 1px solid rgb(255, 255, 255); border-left: none; border-top: 1px solid rgb(255, 255, 255);text-align:left;width:100%">
                            <div style="background-color: rgb(255, 255, 255); text-align: left;  font-size: 12px;">
                                <strong>METODO DE PAGO:</strong> {{ $Datos->MetodoPagoDescripcion }}
                            </div>

                            <div style="background-color: rgb(255, 255, 255); text-align: left;font-size: 12px;">
                                <strong>FORMA DE PAGO:</strong>{{ $Datos->FormaPagoDescripcion }}
                            </div>

                        </td>
                    </tr>
                </table>
            </td>
            <td class="subtotal-container">
                <h2 class="subtotal-label">SUBTOTAL</h2>
                <h2 class="subtotal-label">DESCUENTO EXTRA 0.00%</h2>
                <h2 class="subtotal-label">IMPORTE</h2>
                <h2 class="subtotal-label">IVA POR TRASLADAR 16%</h2>
                <h2 class="subtotal-label">TOTAL</h2>
            </td>
            <td class="subtotal-cell">
                <h2 class="subtotal-value">$ {{ number_format($Extraccion->Subtotal, 2) }}</h2>
                <h2 class="subtotal-value">$ {{ number_format($Extraccion->Descuento, 2) }}</h2>
                <h2 class="subtotal-value">$ {{ number_format($Extraccion->Importe, 2) }}</h2>
                <h2 class="subtotal-value">$ {{ number_format($Extraccion->Impuesto_trasladado, 2) }}</h2>
                <h2 class="subtotal-value">$ {{ number_format($Extraccion->Total, 2) }}</h2>
            </td>
        </tr>
    </table>


    <table style="width:100%; border-collapse: collapse;">

        <tr>

            <td
                style="background-color: rgb(255, 255, 255); text-align: center;border-bottom: 1px solid black; text-align:left;width:100%">
                <div style="background-color: rgb(255, 255, 255); text-align: left; color: black; font-size: 12px;">
                    <strong>EXPEDIDA EN:</strong>Torreon,Coahuila
                </div>
                <div style="background-color: rgb(255, 255, 255); text-align: left; font-size: 12px;">
                    EFECTOS FISCALES AL PAGO</div>

            </td>
            <td
                style="background-color: rgb(255, 255, 255); text-align: center;  border-bottom: 1px solid black; text-align:left;width:100%">
                <h2 style="background-color: rgb(255, 255, 255);color: black; font-size: 16px;text-align:center">
                    !GRACIAS POR SU COMPRA!</h2>
                <h2 style="background-color: rgb(255, 255, 255);color: black; font-size: 15px;text-align:center">
                    EXIGA SU NOTA</h2>
            </td>
            <td
                style="background-color: rgb(255, 255, 255); text-align: center; border-bottom: 1px solid black;text-align:left;width:100%">
                <br>
                <br>
                <hr style="width:70%">
                <h2 style="background-color: rgb(255, 255, 255); text-align: center; color: black; font-size: 15px;">
                    FIRMA</h2>
            </td>
        </tr>
    </table>

    <table style="width:100%; border-collapse: collapse;">
        <tr>
            <td class="document-info column-one">
                <h2 style="font-size:10px">ESTE DOCUMENTO ES UNA REPRESENTACION IMPRESA DE UN CFDI</h2>
                <h2><strong>FOLIO DEL SAT:</strong> {{ $Extraccion->Uuid }}</h2>
                <h2><strong>CERTIFICADO DEL EMISOR:</strong> {{ $Extraccion->SerieCer }}</h2>
            </td>
            <td class="document-info column-two">
                <h2><strong>REGIMEN FISCAL EMISOR:</strong> {{ $Datos->RegimenDescripcion ?: 'S/N REGIMEN' }}</h2>
                <h2><strong>FECHA DE CERTIFICACION:</strong> 2023-10-03T10:24:43</h2>
                <h2><strong>CERTIFICADO DEL SAT:</strong> {{ $Extraccion->SerieSat }}</h2>
            </td>
            <td class="empty-cell"></td>
        </tr>
    </table>
</body>

</html> --}}
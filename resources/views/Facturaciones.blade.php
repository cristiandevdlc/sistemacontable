<!DOCTYPE html>
<html>

<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <title>Facturacion</title>
    <style>
        /* Estilos CSS para el PDF */
        @page {
            margin: 100px 50px;
        }

        body {
            margin: 0;
            padding: 0;
            height: 100%;
            box-sizing: border-box;
            border: 1px solid #000;

        }




        header {

            position: fixed;
            top: -50px;
            left: 0px;
            right: 0px;
            height: 50px;
            text-align: center;
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
        }

        footer {
            position: fixed;
            bottom: -55px;
            left: 0px;
            right: 0px;
            height: 50px;
            text-align: center;


        }



        table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'Arial', sans-serif;
        }

        th,
        td {
            border: 1px solid rgb(8, 8, 8);
            /* padding: 2px; */
            text-align: center;
        }


        .table-header2 th {
            background-color: rgb(255, 255, 255);
            text-align: center;
            border: 1px solid rgb(255, 255, 255);
            padding: 2px;
        }

        .Contenedor-datos th {
            background-color: rgb(255, 255, 255);
            text-align: left;
            border: 1px solid rgb(255, 255, 255);
            padding: 2px;
        }


        .table-header th {
            background-color: rgb(255, 255, 255);
            text-align: left;
            border: 1px solid rgb(0, 0, 0);
            /* padding: 2px; */
        }

        .table-headerPagos th {
            background-color: rgb(255, 255, 255);
            text-align: left;
            border: 1px solid rgb(0, 0, 0);
            /* padding: 2px; */
        }

        .columna {
            text-align: right;
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

        h2 {
            font-size: 10px;
            font-family: 'Arial', sans-serif;
            text-align: left;
        }

        .letracontainer {
            font-size: 13px;
            font-weight: normal;
        }

        .letracontainerbold {
            font-size: 13px;
            font-weight: bold;
        }

        hr {
            height: 3px;
            width: 100%;

            background-color: black;
        }
    </style>
</head>

<body>

    <header>
        <table style="width:100%;height:10%; border-collapse: collapse;">

            <tr class="table-header2">
                <th class="letracontainer" style="width: 20%;"><img style="width:1.40in;height:0.75in;"
                        src="{{ $Images['Logotipo'] }}" /></th>
                <th class="letracontainer" style="width: 60%">


                    <p style="font-size:18px"> <strong> {{ $Datos->Nombre ? $Datos->Nombre : 'Sin nombre' }}</strong> </p>
                   
                    <span style="text-align:center"> {{ $Datos->Empresa_calle ? $Datos->Empresa_calle : 'S/N CALLE' }},{{ $Datos->Localidad ? strtoupper($Datos->Localidad) : 'S/N LOCALIDAD' }},{{ $Datos->Localidad ? strtoupper($Datos->Estado) : 'S/N ESTADO' }} <strong>CP:</strong>{{ $Datos->CodigoPostal ? $Datos->CodigoPostal : 'S/N CODIGO POSTAL' }}</span>

                       

                        <p><strong>RFC:</strong> {{ $Datos->RfcEmpresa ? $Datos->RfcEmpresa : 'Sin RFC' }}</p>

                        <table style="width:100%;height:2%; border-collapse: collapse;">

                            <tr class="Contenedor-datos">
                                <th class="letracontainer" style="width: 100%;text-align:right"> <strong>TEL:</strong>
                                    {{ $Datos->Empresa_telefonos ? $Datos->Empresa_telefonos : 'S/N TELEFONO' }}</th>
                                <th class="letracontainer" style="width: 100%;text-align:left">
                                    <strong>PEDIDOS:</strong>
                                    {{ $Datos->Empresa_telefonos ? $Datos->Empresa_telefonos : 'S/N TELEFONO' }}
                                </th>
                            </tr>
                        </table>
                </th>
                <th style="width: 20%;">
                    <p style="text-align: right">FACTURA</p>
                    <table>
                        <tr class="table-header">
                            <th class="letracontainerbold"style="text-align: center">FECHA</th>
                            <th class="letracontainerbold"style="text-align: center">FOLIO</th>
                        </tr>
                        <tr>
                            <td class="letracontainer">
                                @if ($Datos->FormaMetodoViewRemisiones === 1)
                                    {{ $Datos->Fecha }}
                                @else
                                    {{ $Extraccion->FechaTimbre ? date('d/m/Y', strtotime($Extraccion->FechaTimbre)) : 'S/N FECHA DE TIMBRADO' }}
                                @endif
                            </td>
                            <td class="letracontainer"> {{ $Datos->Serie }} - {{ $Datos->Folio }}</td>
                        </tr>
                    </table>
                </th>
            </tr>
        </table>
    </header>

    <section style="padding-top:80px">


        <table style="width:100%;height:2%; border-collapse: collapse;">
            <tr class="table-header">
                <th class="letracontainerbold"style="text-align: center">CLIENTE</th>
            </tr>
        </table>


        <table style="width:100%;height:10%; border-collapse: collapse;">
            <tr class="Contenedor-datos">
                <th class="letracontainerbold">NOMBRE:</th>
                <th class="letracontainer">{{ strtoupper($Datos->NombreCliente) }} </th>
                <th class="letracontainerbold">RFC:</th>
                <th class="letracontainer">
                    {!! $Datos->RfcCliente
                        ? '<span class="na">' . strtoupper($Datos->RfcCliente) . '</span>'
                        : '<span class="na">S/N RFC</span>' !!}
                </th>
            </tr>
            <tr class="Contenedor-datos" style="width: 100%;">
                <th class="letracontainerbold" style="width: 20%;">DOMICILIO:</th>
                <th class="letracontainer" style="width: 100%;">
                    {{ $Datos->Domicilio ? strtoupper($Datos->Domicilio) : 'S/N CALLE' }}
                    {{ $Datos->Numero ? strtoupper($Datos->Numero) : 'S/N N°' }}
                    {{ $Datos->Colonia ? strtoupper($Datos->Colonia) : 'S/N COLONIA' }} </th>


            </tr>
            <tr class="Contenedor-datos">
                <th class="letracontainerbold">POBLACIÓN:</th>
                <th class="letracontainer">
                    {{ $Datos->Localidad ? strtoupper($Datos->Localidad) : 'S/N LOCALIDAD' }},
                    {{ $Datos->Estado ? strtoupper($Datos->Estado) : 'S/N ESTADO' }} CP:
                    {{ $Datos->Codigo ? strtoupper($Datos->Codigo) : 'S/N CODIGO' }}
                </th>

                @if ($Datos->Tipo !== 2 && $Datos->Tipo !== 5)

                    <th class="letracontainerbold" style="width: 10%;text-align:right">CONDICIONES:</th>
                    <th class="letracontainer" style="width: 10%;text-align:left">
                        @if ($Datos->MetodoPagoDescripcion === 'CONTADO')
                            CONTADO
                        @else
                            {{ $Datos->cliente_diasCredito }} días de crédito
                        @endif
                    </th>

                @endif


            </tr>
            <tr class="Contenedor-datos">
                <th class="letracontainerbold" style="width: 10%;">REGIMEN FISCAL:</th>
                <th class="letracontainer" style="width: 30%;">
                    {{ $Datos->RegimenDescripcion ? strtoupper($Datos->RegimenDescripcion) : 'S/N REGIMEN' }}
                </th>

                <th class="letracontainerbold" style="width: 30%;">USO DE CFDI:</th>
                <th class="letracontainer" style="width: 70%;">
                    {{ $Datos->UsoCfdiClave ? strtoupper($Datos->UsoCfdiClave) : 'S/N NUMERO CFDI' }}:{{ $Datos->UsoCfdiNombre ? strtoupper($Datos->UsoCfdiNombre) : 'S/N CFDI' }}
                </th>
            </tr>
        </table>


        {{-- Facturacion diversos --}}
        @if ($Datos->Tipo === 1)
            <table style="width:100%;height:22%; border-collapse: collapse;">
                <tr class="table-header">
                    <th class="letracontainerbold" style="text-align: center">ARTICULO</th>
                    <th class="letracontainerbold" style="text-align: center">IDENTIFICACION</th>
                    <th class="letracontainerbold" style="text-align: center">NOMBRE</th>
                    <th class="letracontainerbold" style="text-align: center">U. MEDIDA</th>
                    <th class="letracontainerbold" style="text-align: center">CANTIDAD</th>
                    <th class="letracontainerbold" style="text-align: center">PRECIO</th>
                    <th class="letracontainerbold" style="text-align: center">IMPORTE</th>
                </tr>
                @foreach ($Datos->Conceptos as $concepto)
                    <tr class="table-data">
                        <td class="letracontainer" style="text-align: center">{{ $concepto['NOidentificacion'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['Descripcion'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['ConceptoNombre'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['UnidadNombre'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['Cantidad'] }}</td>
                        <td class="letracontainer" style="text-align: right">
                            {{ number_format($concepto['Precio'], 6, '.', ',') }}</td>
                        <td class="letracontainer" style="text-align: right">
                            {{ number_format($concepto['Importe'], 6, '.', ',') }}</td>
                    </tr>
                @endforeach
            </table>
        @elseif ($Datos->Tipo === 2)
            <table style="width:100%;height:35%; border-collapse: collapse;">

                <tr class="table-headerPagos">
                    <th class="letracontainerbold" style="text-align: center">NOMBRE</th>
                    <th class="letracontainerbold" style="text-align: center">IMPORTE</th>
                    <th class="letracontainerbold" style="text-align: center">FECHA</th>
                    <th class="letracontainerbold" style="text-align: center">FORMA DE PAGO</th>
                    <th class="letracontainerbold" style="text-align: center" colspan="2">TOTAL DE PAGO</th>
                </tr>


                @foreach ($Datos->Conceptos as $pago)
                    <tr class="table-data" style="background-color: #85C1E9; color: black;">
                        <td class="letracontainer" style="text-align: center">{{ $pago['pago_documentoPago'] }}</td>
                        <td class="letracontainer" style="text-align: center">
                            ${{ number_format($pago['pago_importe'], 2, '.', ',') }}</td>
                        <td class="letracontainer" style="text-align: center">
                            {{ date('d/m/Y', strtotime($pago['pago_fecha'])) }}</td>
                        <td class="letracontainer" style="text-align: center">
                            {{ $pago['formasPago_cveFormasPago'] }}
                        </td>
                        <td class="letracontainer" style="text-align: center" colspan="2">
                            ${{ number_format($pago['pago_total'], 2, '.', ',') }}</td>
                    </tr>


                    <tr class="table-headerPagos">
                        <th class="letracontainerbold" style="text-align: center">UUID</th>
                        <th class="letracontainerbold" style="text-align: center">FOLIO</th>
                        <th class="letracontainerbold" style="text-align: center">METODO DE PAGO</th>
                        <th class="letracontainerbold" style="text-align: center">SALDO ANTERIOR</th>
                        <th class="letracontainerbold" style="text-align: center">SALDO PENDIENTE</th>
                        <th class="letracontainerbold" style="text-align: center">MONTO PAGADO</th>
                    </tr>


                    @foreach ($pago['detalles'] as $detalle)
                        <tr class="table-data" style="background-color: #85C1E9; color: black;">
                            <td class="letracontainer">{{ $detalle['pagoDetalle_UUID'] }} </td>
                            <td class="letracontainer">{{ $detalle['pagoDetalle_folio'] }}</td>
                            <td class="letracontainer">{{ $pago['formaPago_descripcion'] }}</td>
                            <td class="letracontainer">
                                ${{ number_format($detalle['pagoDetalle_SaldoAnterior'], 2, '.', ',') }}</td>
                            <td class="letracontainer">
                                ${{ number_format($detalle['pagoDetalle_SaldoPendiente'], 2, '.', ',') }}</td>
                            <td class="letracontainer">
                                ${{ number_format($detalle['pagoDetalle_importepagado'], 2, '.', ',') }}</td>
                        </tr>
                    @endforeach
                @endforeach
            </table>
        @elseif ($Datos->Tipo === 3)
            @if ($Datos->FormaMetodoViewRemisiones === 1)
                <table style="width:100%;height:55%; border-collapse: collapse;">
                    <tr class="table-header">
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">REMISION</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">CONCEPTO</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">IDENTIFICACION</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">PRECIO</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">CANTIDAD</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">BONIFICACION</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">IVA</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">TOTAL</th>
                    </tr>
                    @foreach ($Datos->Conceptos as $concepto)
                        <th style="background-color: rgb(0, 0, 0); text-align: center; color:white;font-size:10px"
                            colspan="8"> CLIENTE: {{ $concepto['Cliente'] }} </th>
                        <tr class="table-data">
                            <td class="letracontainer"style="text-align: center;font-size:10px">
                                {{ $concepto['remision'] }}</td>

                            <td class="letracontainer"style="text-align: center;font-size:10px">
                                {{ $concepto['producto_nombre'] }}</td>
                            <td class="letracontainer"style="text-align: center;font-size:10px">
                                {{ $concepto['Estacion_PCRE'] }}</td>


                            <td class="letracontainer"style="text-align: right;font-size:10px">
                                {{ number_format($concepto['Precio'], 6, '.', ',') }}</td>

                            <td class="letracontainer"style="text-align: right;font-size:10px">
                                {{ number_format($concepto['Cantidad'], 6, '.', ',') }}</td>

                            <td class="letracontainer"style="text-align: right;font-size:10px">
                                {{ number_format($concepto['Bonificacion'], 6, '.', ',') }}</td>

                            <td class="letracontainer"style="text-align: right;font-size:10px">
                                {{ number_format($concepto['ventaDetalle_IVA'], 6, '.', ',') }}</td>

                            <td class="letracontainer"style="text-align: right;font-size:10px">
                                {{ number_format($concepto['total'], 6, '.', ',') }}</td>
                        </tr>
                    @endforeach
                </table>
            @else
                <table style="width:100%;height:15%; border-collapse: collapse;">
                    <tr class="table-header">
                        <th class="letracontainerbold"style="text-align: center;font-size:10px;width:15%">REMISION</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">IDENTIFICACION</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">PRODUCTO FACTURA</th>

                        <th class="letracontainerbold"style="text-align: center;font-size:10px">PRECIO</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">CANTIDAD</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">BONIFICACION</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">IVA</th>
                        <th class="letracontainerbold"style="text-align: center;font-size:10px">TOTAL</th>
                    </tr>
                    @foreach ($Datos->Conceptos as $concepto)
                        <th style="background-color: rgb(0, 0, 0); text-align: center; color:white;font-size:10px"
                            colspan="8">CLIENTE: {{ $concepto['Cliente'] }} </th>
                        <tr class="table-data">
                            <td class="letracontainer"style="text-align: center;font-size:10px">
                                {{ $concepto['remision'] }}
                            </td>

                            <td class="letracontainer"style="text-align: center;font-size:10px">
                                {{ $concepto['Estacion_PCRE'] }}</td>

                            </td>
                            <td class="letracontainer"style="text-align: center;font-size:10px">
                                {{ $concepto['productoFactura_descripcion'] }}</td>

                            <td class="letracontainer"style="text-align: right;font-size:10px">
                                {{ number_format($concepto['precios'], 6, '.', ',') }}</td>
                            <td class="letracontainer" style="text-align: right;font-size:10px">
                                {{ number_format($concepto['Cantidad'], 6, '.', ',') }}</td>
                            <td class="letracontainer" style="text-align: right;font-size:10px">
                                {{ number_format($concepto['descuento'], 6, '.', ',') }}</td>
                            <td class="letracontainer" style="text-align: right;font-size:10px">
                                {{ number_format($concepto['iva'], 6, '.', ',') }}</td>
                            <td class="letracontainer" style="text-align: right;font-size:10px">
                                {{ number_format($concepto['importedescuento'], 6, '.', ',') }}</td>
                        </tr>
                    @endforeach
                </table>
            @endif
        @elseif ($Datos->Tipo === 4)
            <table style="width:100%;height:23%; border-collapse: collapse;">
                <tr class="table-header">
                    <th class="letracontainerbold" style="text-align: center">ARTICULO</th>
                    <th class="letracontainerbold" style="text-align: center">IDENTIFICACION</th>
                    <th class="letracontainerbold" style="text-align: center">NOMBRE</th>
                    <th class="letracontainerbold" style="text-align: center">U. MEDIDA</th>
                    <th class="letracontainerbold" style="text-align: center">CANTIDAD</th>
                    <th class="letracontainerbold" style="text-align: center">PRECIO</th>

                    <th class="letracontainerbold" style="text-align: center">IMPORTE</th>
                </tr>
                @foreach ($Datos->Conceptos as $concepto)
                    <tr class="table-data">
                        <td class="letracontainer" style="text-align: center">{{ $concepto['ClaveProd'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['ProductoCodigo'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['ProductoNombre'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['UnidadNombre'] }}</td>
                        <td class="letracontainer" style="text-align: center">{{ $concepto['CantidadLitro'] }}</td>


                        <td class="letracontainer" style="text-align: right">
                            {{ number_format($concepto['Precio'], 6, '.', ',') }}</td>

                        <td class="letracontainer" style="text-align: right">
                            {{ number_format($concepto['Importe'], 6, '.', ',') }}</td>
                    </tr>
                @endforeach
            </table>
        @elseif ($Datos->Tipo === 5)
            <table style="width:100%;height:30%; border-collapse: collapse;">
                <tr class="table-header">
                    <th class="letracontainerbold" style="text-align: center">ARTICULO</th>
                    <th class="letracontainerbold" style="text-align: center">NOMBRE</th>
                    <th class="letracontainerbold" style="text-align: center">CLAVE UNIDAD</th>
                    <th class="letracontainerbold" style="text-align: center">CANTIDAD</th>
                    <th class="letracontainerbold" style="text-align: center">IMPORTE</th>
                </tr>
                <tr class="table-data">
                    <td class="letracontainer" style="text-align: center">84111506</td>
                    <td class="letracontainer" style="text-align: center"> Servicios de Facturación</td>
                    <td class="letracontainer" style="text-align: center">ACT</td>
                    <td class="letracontainer" style="text-align: center">1</td>
                    <td class="letracontainer" style="text-align: center"></td>
                </tr>

                <th style="background-color: rgb(0, 0, 0); text-align: center; color:white" colspan="5"> Documento
                    Relacionado </th>
                @foreach ($Datos->Conceptos as $registro)
                    <tr style="background-color: #ffffff;">
                        <td class="letracontainer" style="text-align: center" colspan="5">{{ $registro['UUID'] }}
                        </td>
                    </tr>
                @endforeach
            </table>

        @endif

        @if ($Datos->FormaMetodoViewRemisiones !== 1)
        <div style="width: 100%; height: 15%; border: 1px solid white;">
            @php
                $complementos = [
                    [
                        'label' => 'CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACION DIGITAL DEL SAT',
                        'cadena' => $Extraccion->CadenaComplementoSAT ?? 'Valor predeterminado si CadenaComplementoSAT no está definida',
                    ],
                    [
                        'label' => 'SELLO DIGITAL DE CFDI',
                        'cadena' => $Extraccion->selloDigitalEmisor ?? 'Valor predeterminado si selloDigitalEmisor no está definida',
                    ],
                    [
                        'label' => 'SELLO DIGITAL DEL SAT',
                        'cadena' => $Extraccion->selloDigitalSAT ?? 'Valor predeterminado si selloDigitalSAT no está definida',
                    ],
                ];
            @endphp
            
            @foreach ($complementos as $complemento)
                <div style="padding: 10px; font-size: 10px; font-family: 'Arial', sans-serif;">
                    <strong>{{ $complemento['label'] }}:</strong>
                    @php
                        $parts = str_split($complemento['cadena'], ceil(strlen($complemento['cadena']) / 4));
                    @endphp
                    @foreach ($parts as $part)
                        <span>{{ $part }}</span><br>
                    @endforeach
                </div>
            @endforeach
        
       
        
        @endif


        @if ($Datos->Tipo !== 2 && $Datos->Tipo !== 5 && $Datos->FormaMetodoViewRemisiones !== 1)
            <table style="width:95%; border-collapse: collapse;height:2%">
                <tr class="Contenedor-datos">
                    <th class="letracontainer"style="width:55%"  ><strong>METODO DE PAGO:
                        </strong>{{ $Datos->MetodoPagoClave ? strtoupper($Datos->MetodoPagoClave) : 'S/N CLAVE' }}
                        ,
                        {{ $Datos->MetodoPagoDescripcion2 ? strtoupper($Datos->MetodoPagoDescripcion2) : 'S/N DESCRIPCION' }}
                    </th>
                    <th class="letracontainer" style="width:35%;text-align:right">
                        <strong>FORMA DE PAGO: </strong>
                        {{ $Datos->FormaPagoDescripcion ? strtoupper($Datos->FormaPagoDescripcion) : 'S/N FORMA DE PAGO' }}
                    </th>
                </tr>
            </table>


            <table class="table" style="width:100%;height:5%">
                <tr>
                    <td style="width: 30%;"><img src="{{ $Images['Qrcode'] }}" alt="Código QR"
                            style="display: block;width: 80%; max-height:50%  margin: auto;"></td>

                    <td style="width: 70%;">
                        <table style="width:100%; border-collapse: collapse;">
                            <tr>
                                <th class="letracontainerbold"> CANTIDAD CON LETRA </th>
                            </tr>
                            <tr>
                                <td class="letracontainer"> {{ $Extraccion->Total_en_palabras }} PESOS
                                    {{ $Extraccion->Total_Decimal }}/100 M.N. </td>
                            </tr>

                            <tr>
                                <th class="letracontainerbold">OBSERVACIONES </th>
                            </tr>
                            <tr>
                                <td class="letracontainer">
                                    {{ $Datos->Observaciones ? strtoupper($Datos->Observaciones) : 'SIN NINGUNA OBSERVACIÓN' }}
                                </td>
                            </tr>


                            <table style="width:100%;height:10%; border-collapse: collapse;">
                                <tr class="Contenedor-datos">
                                    <th class="letracontainerbold" style="width: 100%;">SUBTOTAL:</th>
                                    <th class="letracontainer" style="width: 100%;text-align:right">
                                        {{ number_format($Extraccion->Subtotal, 2) }} </th>

                                </tr>

                                <tr class="Contenedor-datos">
                                    <th class="letracontainerbold">DESCUENTO EXTRA 0.00%:</th>
                                    <th class="letracontainer" style="width: 100%;text-align:right">
                                        {{ number_format($Extraccion->Descuento, 2) }} </th>
                                </tr>

                                <tr class="Contenedor-datos">
                                    <th class="letracontainerbold">IMPORTE:</th>
                                    <th class="letracontainer" style="width: 100%;text-align:right">
                                        {{ number_format($Extraccion->Importe, 2) }} </th>
                                </tr>
                                <tr class="Contenedor-datos">
                                    <th class="letracontainerbold">IVA POR TRASLADAR 16%:</th>
                                    <th class="letracontainer" style="width: 100%;text-align:right">
                                        {{ number_format($Extraccion->Impuesto_trasladado, 2) }} </th>
                                </tr>
                                <tr class="Contenedor-datos">
                                    <th class="letracontainerbold">TOTAL:</th>
                                    <th class="letracontainer" style="width: 100%;text-align:right">
                                        {{ number_format($Extraccion->Total, 2) }} </th>
                                </tr>

                            </table>
                        </table>
                    </td>
                </tr>
            </table>
        @endif



        @if ($Datos->Tipo == 2 || $Datos->Tipo == 5)
            @if ($Datos->CheckTimbrado)
            @else
                <table style="width:100%; border:black;">
                    <tr class="table-header2">
                        @if ($Datos->FormaMetodoViewRemisiones == 1)
                        @elseif ($Datos->Tipo == 5)
                            <th class="letracontainer" style="width: 33%;">
                                <img src="{{ $Images['Qrcode'] }}" alt="Código QR"
                                    style="display: block; max-width: 100%; max-height: 90%; margin: auto;">
                            </th>
                        @endif
                        <th class="letracontainer" style="width: 33%;">
                            <h2 class="letracontainerbold" style="text-align:center;"> CANTIDAD CON LETRA </h2>
                            <h2 class="letracontainer" style="text-align:center;">
                                @if ($Datos->Tipo == 2)
                                    {{ $Datos->TotalPalabra }} PESOS {{ $Datos->Parte_Decimal }}/100 M.N.
                                @elseif ($Datos->Tipo == 5)
                                    {{ $Extraccion->Total_en_palabras }} PESOS {{ $Extraccion->Total_Decimal }}/100
                                    M.N.
                                @endif

                                @if ($Datos->Tipo == 3)
                                    {{ $Datos->Totales['TotalPalabra'] }} PESOS
                                    {{ $Datos->Totales['Parte_Decimal'] }}/100 M.N.
                                @endif

                            </h2>
                        </th>
                        <th style="width: 33%;">
                            <h2 class="letracontainerbold" style="text-align:center;">TOTAL</h2>
                            <h2 class="letracontainer" style="text-align:center;">
                                @if ($Datos->Tipo == 2 || $Datos->Tipo == 3)
                                    ${{ number_format($Datos->Total, 2, '.', ',') }}
                                @elseif ($Datos->Tipo == 5)
                                    ${{ number_format($Extraccion->Total, 2, '.', ',') }}
                                @endif
                            </h2>
                        </th>
                    </tr>
                </table>
            @endif
        @endif


        @if ($Datos->FormaMetodoViewRemisiones == 1)
            <table style="width:100%; border-collapse: collapse;height:2%">
                <tr class="Contenedor-datos">
                    <th class="letracontainer" style="width: 100%;"><strong>CANTIDAD CON LETRA :
                        </strong>
                        {{ $Datos->Totales['TotalPalabra'] }} PESOS
                        {{ $Datos->Totales['Parte_Decimal'] }}/100 M.N.
                    </th>
                    <th class="letracontainer" style="width: 100%;text-align:right">
                        <strong>TOTAL: </strong>
                        ${{ number_format($Datos->Total, 2, '.', ',') }}
                    </th>
                </tr>
            </table>
        @endif

        <table style="width:95%; border-collapse: collapse;">

            <tr class="table-header2" style="width: 100%;">
                <th class="letracontainer" style="width: 30%;">
                    <div class="letracontainer"style="text-align:left;"> <strong>EXPEDIDA EN:</strong> </div>
                    <div class="letracontainer"style="text-align:left; font-size: 10px;">
                         {{ $Datos->Localidad ? strtoupper($Datos->Localidad) : 'S/N LOCALIDAD' }} ,
                        {{ $Datos->Localidad ? strtoupper($Datos->Estado) : 'S/N ESTADO' }}
                       </div>

                    <div class="letracontainer"style="text-align:left; font-size: 10px;">EFECTOS FISCALES AL PAGO</div>
                </th>
                <th class="letracontainer" style="width: 30%;">
                    <h2 class="letracontainerbold" style="text-align:center;font-size: 11px;">¡GRACIAS POR SU COMPRA!
                    </h2>
                    <h2 class="letracontainerbold" style="text-align:center; font-size: 11px;">EXIGA SU NOTA</h2>
                </th>
                <th style="width: 30%;">
                    <hr>
                    <h2 class="letracontainerbold" style="text-align:center;">FIRMA</h2>
                </th>
            </tr>
        </table>

        
    </section>
    <footer style="">

        @if ($Datos->FormaMetodoViewRemisiones !== 1)
            <table style="width:100%; border-collapse: collapse;">
                <tr class="Contenedor-datos" style="width: 50%;">
                    <th class="letracontainer" style="font-size: 10px;">ESTE DOCUMENTO ES UNA REPRESENTACION IMPRESA
                        DE UN
                        CFDI</th>

                    <th class="letracontainer" style="width: 50%;">
                        <h2 class="letracontainer" style="text-align:left;font-size: 10px;"><strong>REGIMEN FISCAL
                                EMISOR:</strong>
                            {{ $Datos->RegimenFiscalEmpresa ? strtoupper($Datos->RegimenFiscalEmpresa) : 'S/N REGIMEN FISCAL' }}
                        </h2>
                    </th>
                </tr>

                <tr class="Contenedor-datos" style="width: 50%;">
                    <th class="letracontainer">
                        <h2 class="letracontainer" style="text-align:left;font-size: 10px;"><strong>FOLIO DEL
                                SAT:</strong>
                            {{ $Extraccion->Uuid }}</h2>
                    </th>

                    <th class="letracontainer" style="width: 50%;">
                        <h2 class="letracontainer" style="text-align:left;font-size: 10px;"><strong>FECHA DE
                                CERTIFICACION:</strong>
                            {{ $Extraccion->FechaTimbre ? date('d/m/Y', strtotime($Extraccion->FechaTimbre)) : 'S/N FECHA DE TIMBRADO' }}
                        </h2>
                    </th>
                </tr>

                <tr class="Contenedor-datos" style="width: 50%;">
                    <th class="letracontainer">
                        <h2 class="letracontainer" style="text-align:left;font-size: 10px;"><strong>CERTIFICADO DEL
                                EMISOR:</strong>
                            {{ $Extraccion->SerieCer }}</h2>
                    </th>

                    <th class="letracontainer" style="width: 50%;">
                        <h2 class="letracontainer" style="text-align:left;font-size: 10px;"><strong>CERTIFICADO DEL
                                SAT:</strong>{{ $Extraccion->SerieSat }}</h2>
                    </th>
                </tr>

            </table>
        @endif
    </footer>

</body>

</html>

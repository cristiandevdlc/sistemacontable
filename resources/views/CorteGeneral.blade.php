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

    .gdce {
        background-color: rgb(252, 76, 2);
        text-align: center;
        border: 1px solid rgb(252, 76, 2);
        border-left: 1px solid black;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        border-right: 1px solid rgb(252, 76, 2);


    }

    .gdcetotal {
        background-color: rgb(252, 76, 2);
        text-align: center;
        border: 1px solid rgb(255, 255, 255);
        border-left: 1px solid black;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        border-right: 1px solid black;

    }

    .rows {
        background-color: rgb(255, 255, 255);
        text-align: right;
        border: 1px solid rgb(255, 255, 255);
        border-left: 1px solid black;
        border-top: 1px solid black;
        border-bottom: 1px solid rgb(255, 255, 255);

    }

    .totales {
        background-color: rgb(255, 255, 255);
        text-align: rgb(252, 76, 2);
        border: 1px solid rgb(0, 0, 0);
        text-align: right;

    }

    .rowsfinal {
        background-color: rgb(255, 255, 255);
        text-align: right;
        border: 1px solid rgb(255, 255, 255);
        border-left: 1px solid black;
        border-top: 1px solid black;
        border-bottom: 1px solid rgb(255, 255, 255);
        border-right: 1px solid black;

    }

    .titulos {
        background-color: rgb(252, 76, 2);
        text-align: center;
        border: 1px solid rgb(0, 0, 0);
    }
</style>
</head>

<body>

    <div class="fila">
        <div class="columna">
            <img style="position:absolute;width:2.12in;height:0.75in" src="{{ $empresaLogo }}" />
        </div>
        <div class="columna" style="display: flex; flex-direction: column;">
            <p
                style="font-style:normal;  font-size:14pt; font-family:'Arial', sans-serif;font-weight:bold; color:#000000; text-align:center;">
                Corte general</p>


            <span
                style="font-style:normal; font-size:10pt; font-family:'Arial', sans-serif; color:#000000; text-align:left;">
                <strong>Del:</strong>{{ \Carbon\Carbon::parse($fechainicio)->format('d/m/Y') }}
            </span>

            <span
                style="font-style:normal;font-weight:normal;font-size:10pt;font-family:'Arial', sans-serif;color:#000000;text-align:right;">
                <strong>AL: </strong>{{ \Carbon\Carbon::parse($fechafinal)->format('d/m/Y') }}
            </span>
            <p
                style="font-style:normal;font-weight:normal;font-size:10pt;font-family:'Arial', sans-serif;color:#000000; text-align:center;">
                <strong>Zona:</strong> {{ $nombrezona }}
            </p>

        </div>
        <div class="columna" style="display: flex; flex-direction: column;">

            <p
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:'Arial', sans-serif;color:#000000;text-align:right;">
            <p
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:'Arial', sans-serif;color:#000000;text-align:right;">
                <strong>Fecha:</strong> {{ \Carbon\Carbon::now('America/Mexico_City')->format('d/m/Y') }}
            </p>
            <p
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:'Arial', sans-serif;color:#000000;text-align:right;">
                <strong>Hora:</strong> {{ \Carbon\Carbon::now('America/Mexico_City')->format('H:i A') }}
            </p>
            </p>

        </div>

    </div>
    <table style="width:100%">
        <tr>
            <th colspan="8" class="titulos"> Contado</th>
        </tr>
        <tr>
            <th class="gdce" colspan="2" style="text-align:left;padding-left: 12px;">Conceptos</th>
            <th class="gdce">Litros</th>
            <th class="gdce">P.Venta</th>
            <th class="gdce">Importe</th>
            <th class="gdce">IVA</th>
            <th class="gdcetotal">Totales</th>
            <th rowspan="{$CantidadConceptos}" style="border-right: 1px solid black;border-left: 1px solid black;">
            </th>
        </tr>



        @foreach ($ConceptosLitros as $index => $item)
            <tr>
                <td class="rows" style="text-align:left;padding-left: 12px;" @if ($loop->last) style="border-bottom: 1px solid black;text-align:left;padding-left: 12px;" @endif> {{ $item->concepto }}</td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif></td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item->litros, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item->precioVenta, 6, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item->importe, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item->iva, 2, '.', ',') }} </td>
                <td class="rowsfinal" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item->total, 2, '.', ',') }} </td>
                <td class="rowsfinal" @if ($loop->last) style="border-bottom: 1px solid black;" @endif>
                </td>
            </tr>
        @endforeach


        <tr>
            <th class="totales" style="text-align:left;border-right:#ffffff;padding-left: 12px;">Totales</th>
            <th class="totales" style="border:#ffffff;"></th>
            <th class="totales"> {{ number_format($TotalesLitros->totalLitros, 2, '.', ',') }}</th>
            <th class="totales"></th>
            <th class="totales"> {{ number_format($TotalesLitros->totalImporte, 2, '.', ',') }}</th>
            <th class="totales"> {{ number_format($TotalesLitros->totalIVA, 2, '.', ',') }}</th>
            <td class="rowsfinal" style="border: 1px solid black;"> </td>
            <th class="rowsfinal" style="border-bottom: 1px solid rgb(0, 0, 0);">
                ${{ number_format($TotalesLitros->total, 2, '.', ',') }}</th>
        </tr>

        <tr>
            <th class="gdce" style="text-align:left;padding-left: 12px;">Tipo tanque</th>
            <th class="gdce">Kilos</th>
            <th class="gdce">Tanques</th>
            <th class="gdce">P.Ventas</th>
            <th class="gdce">Importe</th>
            <th class="gdce">IVA</th>
            <th class="gdcetotal">Totales</th>
            <th rowspan="{$CantidadTanque}" style="border-right: 1px solid black;border-left: 1px solid black;"></th>
        </tr>


        @foreach ($ConceptosKilos as $index => $item2)
            <tr>
                <td class="rows" style="text-align:left;padding-left: 12px;" @if ($loop->last) style="border-bottom: 1px solid black;text-align:left;padding-left: 12px;" @endif> {{ $item2->tipoTanque }}</td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->kilos, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->tanques, 2, '.', ',') }} </td>
                <td class="rows"@if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->precioVenta, 6, '.', ',') }} </td>
                <td class="rows"@if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->importe, 2, '.', ',') }}</td>
                <td class="rows"@if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->iva, 2, '.', ',') }} </td>
                <td class="rowsfinal"@if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->total, 2) }} </td>
                <td class="rowsfinal"@if ($loop->last) style="border-bottom: 1px solid black;" @endif> </td>
            </tr>
        @endforeach




        <tr>
            <th class="totales" style="text-align:left;border-right:#ffffff;padding-left: 12px;"> Totales</th>
            <th class="totales"> {{ number_format($TotalesKilos->totalKilos, 2, '.', ',') }} </th>
            <th class="totales" style="border:#ffffff;"> </th>
            <th class="totales" style="border:#ffffff;"> </th>
            <th class="totales">${{ number_format($TotalesKilos->totalImporte, 2, '.', ',') }} </th>
            <th class="totales"> ${{ number_format($TotalesKilos->totalIVA, 2, '.', ',') }} </th>
            <th class="rowsfinal" style="border: 1px solid black;"> </th>
            <th class="rowsfinal" style="border-bottom: 1px solid rgb(0, 0, 0);">
                ${{ number_format($TotalesKilos->total, 2, '.', ',') }} </th>
        </tr>



        <tr>
            <th class="gdce" style="text-align:left;padding-left: 12px;">Conceptos</th>
            <th class="gdce">Kilos</th>
            <th class="gdce">Litros</th>
            <th class="gdce"></th>
            <th class="gdce">Importe</th>
            <th class="gdce">IVA</th>
            <th class="gdcetotal"> Totales</th>
            <th rowspan="{$CantidadTanque}" style="border-right: 1px solid black;border-left: 1px solid black;"></th>

        </tr>

        @foreach ($Bonificacion as $index => $item2)
            <tr>
                <td class="rows" style="text-align:left;padding-left: 12px;" @if ($loop->last) style="border-bottom: 1px solid black;text-align:left;padding-left: 12px;" @endif> {{ $item2->concepto }}</td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->kilos, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->litros, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif>  </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->importe, 2, '.', ',') }}</td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->iva, 2, '.', ',') }} </td>
                <td class="rowsfinal" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->total, 2) }} </td>
                <td class="rowsfinal" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> </td>
            </tr>
        @endforeach

        <tr>
            <th class="totales" style="text-align:left;border-right:#ffffff;padding-left: 12px;"> Totales</th>
            <th class="totales"> {{ number_format($TotalesBonificacion->totalKilos, 2, '.', ',') }} </th>
            <th class="totales"> {{ number_format($TotalesBonificacion->totalLitros, 2, '.', ',') }}</th>
            <th class="totales" style="border:#ffffff;"> </th>
            <th class="totales">${{ number_format($TotalesBonificacion->totalImporte, 2, '.', ',') }} </th>
            <th class="totales"> ${{ number_format($TotalesBonificacion->totalIVA, 2, '.', ',') }} </th>
            <th class="rowsfinal" style="border: 1px solid black;"> </th>
            <th class="rowsfinal" style="border-bottom: 1px solid rgb(0, 0, 0);">
                ${{ number_format($TotalesBonificacion->total, 2, '.', ',') }} </th>
        </tr>




        <tr>
            <th colspan="7" class="gdce" style="text-align:left;padding-left: 12px;">
                Conceptos</th>
            <th rowspan="5"
                style="border-right: 1px solid black;border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;">
            </th>
        </tr>
        <tr>
            <td style="border-left: 1px solid black;padding-left: 10px; padding-right: 10px;"colspan="3">Cobranza en
                Cheques </td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;text-align: right;padding-left: 10px; padding-right: 10px;"> 00.00
            </td>
        </tr>
        <tr>
            <td style="border-left: 1px solid black;padding-left: 10px; padding-right: 10px;"colspan="3">Cobranza en
                Transferencias</td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;text-align: right;padding-left: 10px; padding-right: 10px;"> 00.00
            </td>
        </tr>

        <tr>
            <td style="border-left: 1px solid black;padding-left: 10px; padding-right: 10px;"colspan="3">Cobranza en
                Efectivo</td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;"></td>
            <td style="border: 1px solid white;text-align: right;padding-left: 10px; padding-right: 10px;"> 00.00
            </td>
        </tr>


        <tr>
            <td
                style="border-left: 1px solid black;border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;text-align: left;padding-left: 10px; padding-right: 10px;"colspan="2">
                Total de Ventas Diversos</td>
            <td
                style="border: 1px solid white;border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;">
            </td>
            <td
                style="border: 1px solid white;border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;">
            </td>
            <td
                style="border: 1px solid white;border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;">
            </td>
            <td
                style="border: 1px solid white;border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;">
            </td>
            <td
                style="border: 1px solid white;border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;text-align: right;padding-left: 10px; padding-right: 10px;">
                00.00</td>
        </tr>

        <tr>
            <th colspan="7"
                style="border: 1px solid rgb(0, 0, 0);text-align: left; padding-left: 10px; padding-right: 10px;">
                Totales</th>
            <th
                style="border: 1px solid white;border-left: 1px solid black;border-bottom: 1px solid black;border-right: 1px solid black;text-align: right;padding-left: 10px; ">
                $ 0.00</th>
        </tr>

        <tr>
            <th colspan="5" style="border-width: 0; border-color: white; border-style: none;"></th>
            <th colspan="2"
                style="background-color: rgb(252, 76, 2);text-align:left;padding-left: 12px; border: 1px solid rgb(0, 0, 0);border: 1px solid white;border-left: 1px solid black;border-bottom: 1px solid black;border-right: 1px solid black;">
                Total a depositar</th>
            <th style="border: 1px solid rgb(0, 0, 0);text-align: right;padding-left: 10px; ">
                ${{ number_format($totaldeposito, 2, '.', ',') }}
            </th>

        <tr>
            <th colspan="8" class="titulos">Crédito</th>
        </tr>

        <tr>
            <th class="gdce" style="text-align:left;padding-left: 12px;"> Conceptos</th>
            <th class="gdce"></th>
            <th class="gdce"> Litros</th>
            <th class="gdce"> P.Venta</th>
            <th class="gdce"> Importe</th>
            <th class="gdce"> IVA</th>
            <th class="gdcetotal">Totales</th>
            <th style="border-right: 1px solid black;border-left: 1px solid black;"></th>
        </tr>



        @foreach ($ConceptosLitrosC as $index => $item3)
            <tr>
                <td class="rows" style="text-align:left;padding-left: 12px;" @if ($loop->last) style="border-bottom: 1px solid black;text-align:left;padding-left: 12px;" @endif>{{ $item3->concepto }}</td>
                <td class="rows"  @if ($loop->last) style="border-bottom: 1px solid black;" @endif></td>
                <td class="rows"  @if ($loop->last) style="border-bottom: 1px solid black;" @endif>{{ number_format($item3->litros, 2, '.', ',') }}</td>
                <td class="rows"  @if ($loop->last) style="border-bottom: 1px solid black;" @endif>{{ number_format($item3->precioVenta, 6, '.', ',') }}</td>
                <td class="rows"  @if ($loop->last) style="border-bottom: 1px solid black;" @endif>{{ number_format($item3->importe, 2, '.', ',') }}</td>
                <td class="rows"  @if ($loop->last) style="border-bottom: 1px solid black;" @endif>{{ number_format($item3->iva, 2, '.', ',') }}</td>
                <td class="rows" style="border-right: 1px solid black;" @if ($loop->last) style="border: 1px solid black;" @endif>
                    {{ number_format($item3->total, 2, '.', ',') }}</td>
                <td class="rows" style="border-right: 1px solid black;border-left: 1px solid black;"  @if ($loop->last) style="border: 1px solid black;" @endif></td>
            </tr>
        @endforeach



        <tr>
            <th class="totales" style="text-align:left;padding-left: 12px;">Totales</th>
            <th class="totales"></th>
            <th class="totales">{{ number_format($TotalesLitrosC->totalLitros, 2, '.', ',') }} </th>
            <th class="totales"> </th>
            <th class="totales">${{ number_format($TotalesLitrosC->totalImporte, 2, '.', ',') }}</th>
            <th class="totales">${{ number_format($TotalesLitrosC->totalIVA, 2, '.', ',') }} </th>
            <th class="totales"></th>
            <th class="totales">${{ number_format($TotalesLitrosC->total, 2, '.', ',') }}</th>
        </tr>



        <tr>
            <th class="gdce" style="text-align:left;padding-left: 12px;">Tipo tanque</th>
            <th class="gdce">Kilos</th>
            <th class="gdce">Tanques</th>
            <th class="gdce">P.Ventas</th>
            <th class="gdce">Importe</th>
            <th class="gdce">IVA</th>
            <th class="gdcetotal">Totales</th>
            <th rowspan="{$CantidadTanqueCredito}"
                style="border-right: 1px solid black;border-left: 1px solid black; border-top: 1px solid black;"></th>
        </tr>


        @foreach ($ConceptosKilosC as $index => $item4)
            <tr>
                <td class="rows" style="text-align:left;padding-left: 12px;" @if ($loop->last) style="border-bottom: 1px solid black;text-align:left;padding-left: 12px;" @endif>{{ $item4->tipoTanque }} </td>
                <td class="rows" @if ($loop->last) style="border: 1px solid black;" @endif> {{ number_format($item4->kilos, 2, '.', ',') }}</td>
                <td class="rows" @if ($loop->last) style="border: 1px solid black;" @endif>{{ number_format($item4->tanques, 2, '.', ',') }}</td>
                <td class="rows" @if ($loop->last) style="border: 1px solid black;" @endif> {{ number_format($item4->precioVenta, 6, '.', ',') }}</td>
                <td class="rows" @if ($loop->last) style="border: 1px solid black;" @endif> {{ number_format($item4->importe, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border: 1px solid black;" @endif> {{ number_format($item4->iva, 2, '.', ',') }} </td>
                <td class="rows" style="border-right: 1px solid black;" @if ($loop->last) style="border: 1px solid black;" @endif>
                    {{ number_format($item4->total, 2, '.', ',') }} </td>
                <td style="border-right: 1px solid black;border-left: 1px solid black;" @if ($loop->last) style="border: 1px solid black;" @endif></td>
            </tr>
        @endforeach




        <tr>
            <th class="totales" style="text-align:left;padding-left: 12px;">Totales</th>
            <th class="totales">{{ number_format($TotalesKilosC->totalKilos, 2, '.', ',') }}</th>
            <th class="totales"> </th>
            <th class="totales"> </th>
            <th class="totales">${{ number_format($TotalesKilosC->totalImporte, 2, '.', ',') }} </th>
            <th class="totales">${{ number_format($TotalesKilosC->totalIVA, 2, '.', ',') }} </th>
            <th class="totales"></th>
            <th class="totales">${{ number_format($TotalesKilosC->total, 2, '.', ',') }} </th>
        </tr>



        <tr>
            <th class="gdce"style="text-align:left;padding-left: 12px;">Conceptos</th>
            <th class="gdce">Kilos</th>
            <th class="gdce">Litros</th>
            <th class="gdce"> </th>
            <th class="gdce">Importe</th>
            <th class="gdce">IVA</th>
            <th class="gdcetotal"> Totales</th>
            <th rowspan="{$CantidadTanqueCredito}"
                style="border-right: 1px solid black;">
            </th>
        </tr>

        @foreach ($BonificacionCredito as $index => $item2)
            <tr>
                <td class="rows" style="text-align:left;padding-left: 12px;" @if ($loop->last) style="border-bottom: 1px solid black;text-align:left;padding-left: 12px;" @endif> {{ $item2->concepto }}</td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->kilos, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->litros, 2, '.', ',') }} </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif>  </td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->importe, 2, '.', ',') }}</td>
                <td class="rows" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->iva, 2, '.', ',') }} </td>
                <td class="rowsfinal" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> {{ number_format($item2->total, 2) }} </td>
                <td class="rowsfinal" @if ($loop->last) style="border-bottom: 1px solid black;" @endif> </td>
            </tr>
        @endforeach

        <tr>
            <th class="totales" style="text-align:left;border-right:#ffffff;padding-left: 12px;"> Totales</th>
            <th class="totales"> {{ number_format($TotalesBonificacionCredito->totalKilos, 2, '.', ',') }} </th>
            <th class="totales"> {{ number_format($TotalesBonificacionCredito->totalLitros, 2, '.', ',') }}</th>
            <th class="totales"> </th>
            <th class="totales">${{ number_format($TotalesBonificacionCredito->totalImporte, 2, '.', ',') }} </th>
            <th class="totales"> ${{ number_format($TotalesBonificacionCredito->totalIVA, 2, '.', ',') }} </th>
            <th class="rowsfinal" style="border: 1px solid black;"> </th>
            <th class="rowsfinal" style="border: 1px solid black;">${{ number_format($TotalesBonificacionCredito->total, 2, '.', ',') }} </th>
        </tr>


        <tr>
            <th colspan="5" style="border-width: 0; border-color: white; border-style: none;"></th>
            <th colspan="2" class="titulos" style="text-align:left;padding-left: 12px;"> Total Ventas Credito</th>
            <th style="border: 1px solid rgb(0, 0, 0);text-align: right;padding-left: 10px; ">
                ${{ number_format($totaldepositocredito, 2, '.', ',') }} </th>
        </tr>

        <tr>
            <th style="border: 1px solid rgb(0, 0, 0);text-align: center;padding-left: 1px; padding-right: 1px;">
                Poliza de Control
            </th>
            <th
                colspan="2"style="border: 1px solid rgb(0, 0, 0);text-align: center;padding-left: 1px; padding-right: 1px;">
                {{ $PolizaL }}</th>
            <th colspan="2"
                style="border: 1px solid rgb(0, 0, 0);text-align: center;padding-left: 1px; padding-right: 1px;">
                {{ $PolizaK }} / {{ $PolizaP }}</th>



            <th colspan="2" class="titulos" style="text-align:left;padding-left: 12px;">Total de ventas</th>
            <th style="border: 1px solid rgb(0, 0, 0);text-align: right;padding-left: 10px;">
                ${{ number_format($totaldepositoventas, 2, '.', ',') }}</th>
        </tr>

        <tr>
            <th style="border: 1px solid rgb(0, 0, 0);text-align: center;padding-left: 1px; padding-right: 1px;">
                KG del Periodo
            </th>
            <th colspan="2"
                style="border: 1px solid rgb(0, 0, 0);text-align: center;padding-left: 1px; padding-right: 1px;">
                {{ number_format( $Poliza[0]->Kilos, 2, '.', ',') }}
            </th>
            <th colspan="2" style="border-width: 0; border-color: white; border-style: none;"></th>
            <th colspan="2" class="titulos" style="text-align:left;padding-left: 12px;"> Total a Depositar</th>
            <th style="text-align: right; border: 1px solid rgb(0, 0, 0);">
                ${{ number_format($totaldeposito, 2, '.', ',') }} </th>
        </tr>
       
        <tr>
            <th style="border: 1px solid rgb(0, 0, 0);text-align: center;padding-left: 1px; padding-right: 1px;">
                LTS del Periodo
            </th>
            <th colspan="2"
                style="border: 1px solid rgb(0, 0, 0);text-align: center;padding-left: 1px; padding-right: 1px;">
                {{ number_format( $Poliza[0]->Litros, 2, '.', ',') }}
            </th>
            <th colspan="5" style="border-width: 0; border-color: rgb(0, 0, 0); border-style: none;"></th>
        </tr>

    </table>

</body>

</html>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>

<body>


    <img style="position:absolute;top:1.21in;left:0.50in;width:2.39in;height:0.72in" src="{{ public_path('storage/gafete/ri_1.jpeg') }}" />

    <div style="position:absolute;top:1.28in;left:3.29in;width:1.41in;line-height:0.29in;">
        <DIV style="position:relative; left:0.59in;"><span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $fecha }}</span>
        </DIV><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Folio :
        </span></SPAN><br />
    </div>
    <div style="position:absolute;top:1.31in;left:6.24in;width:0.77in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
            {{ $hora }}</span>
    </div>
    <div style="position:absolute;top:1.65in;left:3.19in;width:1.41in;line-height:0.23in;">
        <DIV style="position:relative; left:0.59in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $folio }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:1.98in;left:1.24in;width:2.9in;line-height:0.31in;">
        <DIV style="position:relative; left:0.23in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $operador }} </span>
        </DIV>

    </div>
    <img style="position:absolute;top:3.82in;left:0.09in;width:7.10in;height:0.01in" src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:1.03in;left:0.09in;width:7.10in;height:0.01in" src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:1.02in;left:0.10in;width:0.01in;height:2.83in" src="{{ public_path('storage/gafete/vi_4.png') }}" />
    <img style="position:absolute;top:1.02in;left:7.17in;width:0.01in;height:2.83in" src="{{ public_path('storage/gafete/vi_5.png') }}" />

    <div style="position:absolute;top:1.28in;left:3.29in;width:0.50in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Fecha
            :</span>
    </div>
    <div style="position:absolute;top:1.31in;left:5.75in;width:0.39in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Hora:</span>
    </div>
    <div style="position:absolute;top:2.04in;left:0.55in;width:1.77in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Operador :
        </span></div>
    <div style="position:absolute;top:2.04in;left:5.55in;width:0.60in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Unidad :
        </span></div>

    <div style="position:absolute;top:2.05in;left:6.15in;width:0.60in;line-height:0.24in;"><span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000;position:relative; ">
            {{ $unidad }}
        </span></div>

    <div style="position:absolute;top:2.44in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">LTOS
            CONTADO:</span>
    </div>

    <div style="position:absolute;top:2.44in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal; font-weight:bold; font-size:11pt; font-family:Calibri; color:#000000">
            {{ number_format((float) $contado, 2, '.', ',') }} lts
        </span>
    </div>


    <div style="position:absolute;top:2.64in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">LTOS
            CREDITO</span>
    </div>

    <div style="position:absolute;top:2.64in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $credito, 2, '.', ',') }} lts
        </span>
    </div>

    <div style="position:absolute;top:2.84in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">TOTAL LTOS:
        </span>
    </div>

    <div style="position:absolute;top:2.84in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $total, 2, '.', ',') }} lts
            <!-- $ {{ number_format((float) $total, 2, '.', ',') }} -->
        </span>
    </div>


    <div style="position:absolute;top:3.10in;left:3.07in;width:1.26in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Credito :</span>
    </div>

    <div style="position:absolute;top:3.10in;left:4.20in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            $ {{ number_format((float) $totalcredito, 2, '.', ',') }}
        </span>
    </div>

    <div style="position:absolute;top:3.25in;left:3.07in;width:1.01in;line-height:0.24in;">

        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Pagar:</span>
    </div>

    <div style="position:absolute;top:3.25in;left:4.20in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            $ {{ number_format((float) $totalpago, 2, '.', ',') }}

        </span>
    </div>
    <img style="position:absolute;top:3.46in;left:5.46in;width:1.42in;height:0.01in" src="{{ public_path('storage/gafete/vi_2.png') }}" />

    <div style="position:absolute;top:3.57in;left:6.05in;width:0.40in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Firma</span>
    </div>








    <img style="position:absolute;top:4.21in;left:0.50in;width:2.39in;height:0.72in" src="{{ public_path('storage/gafete/ri_1.jpeg') }}" />

    <div style="position:absolute;top:4.28in;left:3.29in;width:1.41in;line-height:0.29in;">
        <DIV style="position:relative; left:0.59in;"><span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $fecha }}</span>
        </DIV><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Folio :
        </span></SPAN><br />
    </div>
    <div style="position:absolute;top:4.31in;left:6.24in;width:0.77in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
            {{ $hora }}</span>
    </div>
    <div style="position:absolute;top:4.65in;left:3.19in;width:1.41in;line-height:0.23in;">
        <DIV style="position:relative; left:0.59in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $folio }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:4.98in;left:1.24in;width:2.9in;line-height:0.31in;">
        <DIV style="position:relative; left:0.23in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $operador }} </span>
        </DIV>

    </div>
    <img style="position:absolute;top:6.82in;left:0.09in;width:7.10in;height:0.01in" src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:4.03in;left:0.09in;width:7.10in;height:0.01in" src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:4.02in;left:0.10in;width:0.01in;height:2.83in" src="{{ public_path('storage/gafete/vi_4.png') }}" />
    <img style="position:absolute;top:4.02in;left:7.17in;width:0.01in;height:2.83in" src="{{ public_path('storage/gafete/vi_5.png') }}" />

    <div style="position:absolute;top:4.31in;left:3.29in;width:0.50in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Fecha
            :</span>
    </div>
    <div style="position:absolute;top:4.31in;left:5.75in;width:0.39in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Hora:</span>
    </div>
    <div style="position:absolute;top:5.04in;left:0.55in;width:1.77in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Operador :
        </span></div>
    <div style="position:absolute;top:5.04in;left:5.55in;width:0.60in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Unidad :
        </span></div>

    <div style="position:absolute;top:5.05in;left:6.15in;width:0.60in;line-height:0.24in;"><span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000;position:relative; ">
            {{ $unidad }}
        </span></div>

    <div style="position:absolute;top:5.44in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">LTOS
            CONTADO:</span>
    </div>

    <div style="position:absolute;top:5.44in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $contado, 2, '.', ',') }} lts
        </span>
    </div>


    <div style="position:absolute;top:5.64in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">LTOS
            CREDITO</span>
    </div>

    <div style="position:absolute;top:5.64in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $credito, 2, '.', ',') }} lts
        </span>
    </div>

    <div style="position:absolute;top:5.84in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">TOTAL LTOS:
        </span>
    </div>

    <div style="position:absolute;top:5.84in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $total, 2, '.', ',') }} lts
            <!-- $ {{ number_format((float) $total, 2, '.', ',') }} -->
        </span>
    </div>


    <div style="position:absolute;top:6.10in;left:3.07in;width:1.26in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Credito :</span>
    </div>

    <div style="position:absolute;top:6.10in;left:4.20in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            $ {{ number_format((float) $totalcredito, 2, '.', ',') }}
        </span>
    </div>

    <div style="position:absolute;top:6.25in;left:3.07in;width:1.01in;line-height:0.24in;">

        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Pagar:</span>
    </div>

    <div style="position:absolute;top:6.25in;left:4.20in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            $ {{ number_format((float) $totalpago, 2, '.', ',') }}
        </span>
    </div>
    <img style="position:absolute;top:6.46in;left:5.46in;width:1.42in;height:0.01in" src="{{ public_path('storage/gafete/vi_2.png') }}" />

    <div style="position:absolute;top:6.57in;left:6.05in;width:0.40in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Firma</span>
    </div>





    <img style="position:absolute;top:7.21in;left:0.50in;width:2.39in;height:0.72in" src="{{ public_path('storage/gafete/ri_1.jpeg') }}" />

    <div style="position:absolute;top:7.31in;left:3.29in;width:1.41in;line-height:0.29in;">
        <DIV style="position:relative; left:0.59in;"><span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $fecha }}</span>
        </DIV><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Folio :
        </span></SPAN><br />
    </div>
    <div style="position:absolute;top:7.31in;left:6.24in;width:0.77in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
            {{ $hora }}</span>
    </div>
    <div style="position:absolute;top:7.65in;left:3.19in;width:1.41in;line-height:0.23in;">
        <DIV style="position:relative; left:0.59in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $folio }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:7.98in;left:1.24in;width:2.9in;line-height:0.31in;">
        <DIV style="position:relative; left:0.23in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $operador }} </span>
        </DIV>

    </div>
    <img style="position:absolute;top:9.82in;left:0.09in;width:7.10in;height:0.01in" src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:7.03in;left:0.09in;width:7.10in;height:0.01in" src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:7.02in;left:0.10in;width:0.01in;height:2.83in" src="{{ public_path('storage/gafete/vi_4.png') }}" />
    <img style="position:absolute;top:7.02in;left:7.17in;width:0.01in;height:2.83in" src="{{ public_path('storage/gafete/vi_5.png') }}" />

    <div style="position:absolute;top:7.31in;left:3.29in;width:0.50in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Fecha
            :</span>
    </div>
    <div style="position:absolute;top:7.31in;left:5.75in;width:0.39in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Hora:</span>
    </div>
    <div style="position:absolute;top:8.04in;left:0.55in;width:1.77in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Operador :
        </span></div>
    <div style="position:absolute;top:8.04in;left:5.55in;width:0.60in;line-height:0.24in;"><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Unidad :
        </span></div>

    <div style="position:absolute;top:8.05in;left:6.15in;width:0.60in;line-height:0.24in;"><span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000;position:relative; ">
            {{ $unidad }}
        </span></div>

    <div style="position:absolute;top:8.44in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">LTOS
            CONTADO:</span>
    </div>

    <div style="position:absolute;top:8.44in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $contado, 2, '.', ',') }} lts
        </span>
    </div>


    <div style="position:absolute;top:8.64in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">LTOS
            CREDITO</span>
    </div>

    <div style="position:absolute;top:8.64in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $credito, 2, '.', ',') }} lts
        </span>
    </div>

    <div style="position:absolute;top:8.84in;right:3.40in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">TOTAL LTOS:
        </span>
    </div>

    <div style="position:absolute;top:8.84in;right:1.93in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            {{ number_format((float) $total, 2, '.', ',') }} lts
            <!-- $ {{ number_format((float) $contado, 2, '.', ',') }} -->
        </span>
    </div>


    <div style="position:absolute;top:9.10in;left:3.07in;width:1.26in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Credito :</span>
    </div>

    <div style="position:absolute;top:9.10in;left:4.20in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            $ {{ number_format((float) $totalcredito, 2, '.', ',') }}
        </span>
    </div>

    <div style="position:absolute;top:9.25in;left:3.07in;width:1.01in;line-height:0.24in;">

        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Pagar:</span>
    </div>

    <div style="position:absolute;top:9.25in;left:4.20in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">
            $ {{ number_format((float) $totalpago, 2, '.', ',') }}
        </span>
    </div>
    <img style="position:absolute;top:9.46in;left:5.46in;width:1.42in;height:0.01in" src="{{ public_path('storage/gafete/vi_2.png') }}" />

    <div style="position:absolute;top:9.57in;left:6.05in;width:0.40in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Firma</span>
    </div>




</body>

</html>
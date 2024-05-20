<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>

<body>
    <img style="position:absolute;top:1.21in;left:0.50in;width:2.39in;height:0.72in"
        src="{{ public_path('storage/gafete/ri_1.jpeg') }}" />

    <div style="position:absolute;top:1.31in;left:3.29in;width:1.41in;line-height:0.29in;">
        <DIV style="position:relative; left:0.59in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000"> {{ $fecha }}</span>
        </DIV><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Folio :
        </span></SPAN><br />
    </div>
    <div style="position:absolute;top:1.31in;left:6.24in;width:0.77in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000"> {{ $hora }}</span>
    </div>
    <div style="position:absolute;top:1.66in;left:3.69in;width:1.41in;line-height:0.23in;">
        <DIV style="position:relative; left:0.59in;">
            <span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000"> {{ $folio }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:1.98in;left:1.24in;width:3.25in;line-height:0.31in;">
        <DIV style="position:relative; left:0.23in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $operador }} </span>
        </DIV><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000;position:relative; top:0.10in;"> {{ $unidad }}</span>
        </SPAN>
    </div>
    <img style="position:absolute;top:3.82in;left:0.09in;width:7.10in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:1.03in;left:0.09in;width:7.10in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:1.02in;left:0.10in;width:0.01in;height:2.83in"
        src="{{ public_path('storage/gafete/vi_4.png') }}" />
    <img style="position:absolute;top:1.02in;left:7.17in;width:0.01in;height:2.83in"
        src="{{ public_path('storage/gafete/vi_5.png') }}" />

    <div style="position:absolute;top:1.31in;left:3.29in;width:0.50in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Fecha
            :</span>
    </div>
    <div style="position:absolute;top:1.31in;left:5.75in;width:0.39in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Hora:</span>
    </div>
    <div style="position:absolute;top:2.04in;left:0.55in;width:0.77in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Operador :
        </span></div>
    <div style="position:absolute;top:2.44in;left:0.55in;width:0.60in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Unidad :
        </span></div>

    <div style="position:absolute;top:2.44in;left:2.00in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque
            20</span>
    </div>
    <div style="position:absolute;top:2.44in;left:2.10in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:1.05in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque 30
            </span></DIV>
    </div>
    <div style="position:absolute;top:2.44in;left:2.20in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:2.06in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque 45
            </span></DIV>
    </div>
    <div style="position:absolute;top:2.44in;left:2.30in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:3.09in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Recargas</span>
        </DIV>
    </div>
    <div style="position:absolute;top:2.44in;left:6.15in;width:0.9in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total tanques
        </span>
    </div>

    <div style="position:absolute;top:2.69in;left:2.27in;width:3.44in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000"> {{ $tanque20 }}
        </span>
    </div>
    <div style="position:absolute;top:2.69in;left:2.27in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:0.99in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000"> {{ $tanque30 }}
            </span>
        </DIV>
    </div>
    <div style="position:absolute;top:2.69in;left:2.27in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:2.00in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000"> {{ $tanque45 }}
            </span>
        </DIV>
    </div>
    <div style="position:absolute;top:2.69in;left:2.35in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:2.97in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $recargas }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:2.69in;left:6.22in;width:0.47in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $kg }}</span>
    </div>
    <div style="position:absolute;top:3.10in;left:0.55in;width:3in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total KG:
        </span><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $totalkg }}Kgs</span>
    </div>
    <div style="position:absolute;top:3.10in;left:4.09in;width:0.65in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">${{ $total }}</span>
    </div>
    <div style="position:absolute;top:3.10in;left:3.07in;width:1.01in;line-height:0.24in;">

        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Pagar:</span>
    </div>
    <img style="position:absolute;top:3.46in;left:5.46in;width:1.42in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_2.png') }}" />

    <div style="position:absolute;top:3.57in;left:6.05in;width:0.40in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Firma</span>
    </div>

    <img style="position:absolute;top:7.21in;left:0.50in;width:2.39in;height:0.72in"
        src="{{ public_path('storage/gafete/ri_1.jpeg') }}" />

    <div style="position:absolute;top:7.31in;left:3.29in;width:1.41in;line-height:0.29in;">
        <DIV style="position:relative; left:0.59in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $fecha }}</span>
        </DIV><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Folio :
        </span></SPAN><br />
    </div>
    <div style="position:absolute;top:7.31in;left:6.24in;width:0.77in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $hora }}</span>
    </div>
    <div style="position:absolute;top:7.66in;left:3.69in;width:1.41in;line-height:0.23in;">
        <DIV style="position:relative; left:0.59in;">
            <span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $folio }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:7.98in;left:1.24in;width:2.83in;line-height:0.31in;">
        <DIV style="position:relative; left:0.23in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $operador }} </span>
        </DIV><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000;position:relative; top:0.10in;">{{ $unidad }}</span>
        </SPAN>
    </div>
    <img style="position:absolute;top:9.82in;left:0.09in;width:7.10in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:7.03in;left:0.09in;width:7.10in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:7.02in;left:0.10in;width:0.01in;height:2.83in"
        src="{{ public_path('storage/gafete/vi_4.png') }}" />
    <img style="position:absolute;top:7.02in;left:7.17in;width:0.01in;height:2.83in"
        src="{{ public_path('storage/gafete/vi_5.png') }}" />

    <div style="position:absolute;top:7.31in;left:3.29in;width:0.50in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Fecha
            :</span>
    </div>
    <div style="position:absolute;top:7.31in;left:5.75in;width:0.39in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Hora:</span>
    </div>
    <div style="position:absolute;top:8.04in;left:0.55in;width:0.77in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Operador :
        </span></div>
    <div style="position:absolute;top:8.44in;left:0.55in;width:0.60in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Unidad :
        </span></div>

    <div style="position:absolute;top:8.44in;left:2.00in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque
            20</span>
    </div>
    <div style="position:absolute;top:8.44in;left:2.10in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:1.05in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque 30
            </span></DIV>
    </div>
    <div style="position:absolute;top:8.44in;left:2.20in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:2.06in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque 45
            </span></DIV>
    </div>
    <div style="position:absolute;top:8.44in;left:2.30in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:3.09in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Recargas</span>
        </DIV>
    </div>
    <div style="position:absolute;top:8.44in;left:6.15in;width:0.9in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total tanques
        </span>
    </div>

    <div style="position:absolute;top:8.69in;left:2.27in;width:3.44in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $tanque20 }}
        </span>
    </div>
    <div style="position:absolute;top:8.69in;left:2.27in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:0.99in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $tanque30 }}
            </span>
        </DIV>
    </div>
    <div style="position:absolute;top:8.69in;left:2.27in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:2.00in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $tanque45 }}
            </span>
        </DIV>
    </div>
    <div style="position:absolute;top:8.69in;left:2.35in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:2.97in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $recargas }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:8.69in;left:6.22in;width:0.47in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $kg }}</span>
    </div>
    <div style="position:absolute;top:9.10in;left:0.55in;width:3in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total KG:
        </span><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $totalkg }}Kgs</span>
    </div>
    <div style="position:absolute;top:9.10in;left:4.09in;width:0.65in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">${{ $total }}</span>
    </div>
    <div style="position:absolute;top:9.10in;left:3.07in;width:1.01in;line-height:0.24in;">

        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Pagar:</span>
    </div>
    <img style="position:absolute;top:9.46in;left:5.46in;width:1.42in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_2.png') }}" />

    <div style="position:absolute;top:9.57in;left:6.05in;width:0.40in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Firma</span>
    </div>



    <img style="position:absolute;top:4.21in;left:0.50in;width:2.39in;height:0.72in"
        src="{{ public_path('storage/gafete/ri_1.jpeg') }}" />

    <div style="position:absolute;top:4.31in;left:3.29in;width:1.41in;line-height:0.29in;">
        <DIV style="position:relative; left:0.59in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $fecha }}</span>
        </DIV><span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Folio :
        </span></SPAN><br />
    </div>
    <div style="position:absolute;top:4.31in;left:6.24in;width:0.77in;line-height:0.23in;">
        <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $hora }}</span>
    </div>
    <div style="position:absolute;top:4.66in;left:3.69in;width:1.41in;line-height:0.23in;">
        <DIV style="position:relative; left:0.59in;">
            <span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $folio }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:4.98in;left:1.24in;width:2.83in;line-height:0.31in;">
        <DIV style="position:relative; left:0.23in;">
            <span style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">
                {{ $operador }} </span>
        </DIV><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000;position:relative; top:0.10in;">{{ $unidad }}</span>
        </SPAN>
    </div>
    <img style="position:absolute;top:6.82in;left:0.09in;width:7.10in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:4.03in;left:0.09in;width:7.10in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_3.png') }}" />
    <img style="position:absolute;top:4.02in;left:0.10in;width:0.01in;height:2.83in"
        src="{{ public_path('storage/gafete/vi_4.png') }}" />
    <img style="position:absolute;top:4.02in;left:7.17in;width:0.01in;height:2.83in"
        src="{{ public_path('storage/gafete/vi_5.png') }}" />

    <div style="position:absolute;top:4.31in;left:3.29in;width:0.50in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Fecha
            :</span>
    </div>
    <div style="position:absolute;top:4.31in;left:5.75in;width:0.39in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Hora:</span>
    </div>
    <div style="position:absolute;top:5.04in;left:0.55in;width:0.77in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Operador :
        </span></div>
    <div style="position:absolute;top:5.44in;left:0.55in;width:0.60in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Unidad :
        </span></div>

    <div style="position:absolute;top:5.44in;left:2.00in;width:3.72in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque
            20</span>
    </div>
    <div style="position:absolute;top:5.44in;left:2.10in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:1.05in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque 30
            </span></DIV>
    </div>
    <div style="position:absolute;top:5.44in;left:2.20in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:2.06in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Tanque 45
            </span></DIV>
    </div>
    <div style="position:absolute;top:5.44in;left:2.30in;width:3.72in;line-height:0.24in;">
        <DIV style="position:relative; left:3.09in;"><span
                style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Recargas</span>
        </DIV>
    </div>
    <div style="position:absolute;top:5.44in;left:6.15in;width:0.9in;line-height:0.24in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total tanques
        </span>
    </div>

    <div style="position:absolute;top:5.69in;left:2.27in;width:3.44in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $tanque20 }}
        </span>
    </div>
    <div style="position:absolute;top:5.69in;left:2.27in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:0.99in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $tanque30 }}
            </span>
        </DIV>
    </div>
    <div style="position:absolute;top:5.69in;left:2.27in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:2.00in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $tanque45 }}
            </span>
        </DIV>
    </div>
    <div style="position:absolute;top:5.69in;left:2.35in;width:3.44in;line-height:0.23in;">
        <DIV style="position:relative; left:2.97in;"><span
                style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $recargas }}</span>
        </DIV>
    </div>
    <div style="position:absolute;top:5.69in;left:6.22in;width:0.47in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $kg }}</span>
    </div>
    <div style="position:absolute;top:6.10in;left:0.55in;width:3in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total KG:
        </span><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">{{ $totalkg }}Kgs</span>
    </div>
    <div style="position:absolute;top:6.10in;left:4.09in;width:0.65in;line-height:0.23in;"><span
            style="font-style:normal;font-weight:normal;font-size:11pt;font-family:Calibri;color:#000000">${{ $total }}</span>
    </div>
    <div style="position:absolute;top:6.10in;left:3.07in;width:1.01in;line-height:0.24in;">

        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Total a
            Pagar:</span>
    </div>
    <img style="position:absolute;top:6.46in;left:5.46in;width:1.42in;height:0.01in"
        src="{{ public_path('storage/gafete/vi_2.png') }}" />

    <div style="position:absolute;top:6.57in;left:6.05in;width:0.40in;line-height:0.24in;">
        <span style="font-style:normal;font-weight:bold;font-size:11pt;font-family:Calibri;color:#000000">Firma</span>
    </div>



</body>

</html>

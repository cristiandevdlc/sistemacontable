import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import "../../../../../sass/_dashboardTelemark.scss";
import ChartPieResumen from "./ChartComponents/ChartPieResumen";
import ChartPortatil from "./ChartComponents/ChartPortatil";
import ChartRecargas from "./ChartComponents/ChartRecargas";
import ChartEstacionario from "./ChartComponents/ChartEstacionario";
import ChartOperadoras from "./ChartComponents/ChartOperadoras";
import ChartReporte from "./ChartComponents/ChartReporte";

export default function DashboardTelemark({ auth }) {
    return (

        <div className="containerTelemark">
            <div className="containerTelemark__info">
                <div className="containerTelemark__info--transito">
                    <p>Servicios en transito</p>
                    <div>

                    </div>
                </div>
                <div className="containerTelemark__info--tecnico">
                    <p>Servicio tecnico</p>
                    <div>

                    </div>
                </div>
                <div className="containerTelemark__info--pedidos">
                    <p>Proximos pedidos</p>
                    <div>

                    </div>
                </div>
            </div>
            <div className="containerTelemark__chart">
                <div className="containerTelemark__info--rutas">

                </div>
                <div className="containerTelemark__info--operadoras&reporte">

                </div>
            </div>
        </div>

    );
}

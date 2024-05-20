import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import "../../../../../sass/_dashboardVentas.scss";
import ChartPieVentas from "./ChartComponents/ChartResumenVentas";
export default function DashboardVentas({ auth }) {
    return (
        <div className="containerVentas">
            <div className="containerPresentation">
                <div className="containerTitle">
                    <p>VENTAS</p>
                </div>
                <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div className="container2">
                <div className="container2__container2ChartVentasNav">
                    <nav className="container2__container2ChartVentasNav--nav">
                        <a className="navChartVentas" href="#ventas1">Resumen</a>
                        <a className="navChartVentas" href="#ventas2">Prueba 1</a>
                        <a className="navChartVentas" href="#ventas3">Prueba 2</a>
                        <a className="navChartVentas" href="#ventas4">Prueba 3</a>
                    </nav>
                </div>
                <div className="swipeContainerVentas">
                    <div className="content">
                        <div className="content__contentChartVentas">
                            <div className="content__contentChartVentas--chart" id="ventas1">
                                <ChartPieVentas />
                            </div>
                            <div className="content__contentChartVentas--chart" id="ventas2">
                                <ChartPieVentas />
                            </div>
                            <div className="content__contentChartVentas--chart" id="ventas3">
                                <ChartPieVentas />
                            </div>
                            <div className="content__contentChartVentas--chart" id="ventas4">
                                <ChartPieVentas />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

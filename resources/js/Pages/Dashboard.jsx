import "../../sass/_calendarStyle.scss";
import "../../sass/_dashboardStyle.scss";
import Calendario from "../components/Calendar";
import { ChartDashboard } from "@/components/ChartDashboard/ChartDashboard";

var date = new Date();
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Dashboard({ auth }) {
    return (
        <div className="grid grid-cols-12 h-[100%] overflow-auto blue-scroll">
            <div className="col-span-12 min-[900px]:row-span-3 max-h-[40vh] m-2 rounded-lg ">
                <div className="warn-back">
                    <div className="grid grid-cols-12 h-full">
                        <div className="date col-span-7">
                            <p>{capitalizeFirstLetter(date.toLocaleString('es-ES', { month: 'long' }))}</p>
                            <p>{date.toLocaleString('ES', { year: 'numeric' })}</p>
                        </div>
                        <div className="inc col-span-5">
                            <p className="hidden min-[1200px]:flex">Intergas</p>
                            <p className="hidden min-[1200px]:flex">Empresa fundada en septiembre de 1996 con la finalidad de distribuir y vender gas l.p.,
                                comprometida a satisfacer la necesidad de nuestros clientes, mediante un servicio oportuno y confiable.
                                <br />
                                <br />
                                ¡Somos la mejor alternativa de servicio!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden max-[1200px]:flex bg-[#1B2654] inc2 row-span-4 col-span-12 m-2 rounded-lg">
                {/* <p className="text-[5vw]">Intergas</p> */}
                <p className="sm:text-[4vh] md:text-[3.5vw] text-[10vw]">Intergas</p>
                <p>Empresa fundada en septiembre de 1996 con la finalidad de distribuir y vender gas l.p.,
                    comprometida a satisfacer la necesidad de nuestros clientes, mediante un servicio oportuno y confiable.
                    <br />
                    <br />
                    ¡Somos la mejor alternativa de servicio!</p>
            </div>
            <div className="row-span-6 min-h-[50vh] lg:max-w-screen-xl col-span-12 lg:col-span-5 m-2 rounded-lg p-3 shadow-lg shadow-dark">
                <Calendario />
            </div>
            <div className="row-span-6 min-h-[50vh] lg:max-w-screen-xl col-span-12 lg:col-span-7 m-2 rounded-lg p-3 shadow-lg shadow-dark">
                <ChartDashboard />
            </div>
        </div>
    );
}

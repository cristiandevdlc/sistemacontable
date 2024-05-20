import request from "@/utils"

const ReportesTanques = () => {

  const tankReport = async (type) => {
    try {
      const res = await request(route('tanque-pdf-activo', type))
      await fetch(route('generate-tank-active'), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: res, type: type }),
      })
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error("Error al generar el archivo PDF");
          }
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${type === 'active' ? 'Reporte tanques activos.pdf' : 'Reporte tanques historico.pdf'}`;
          link.click();
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const tankClientReport = async (type) => {
    try {
      const res = await request(route('tanque-pdf-cliente', type))
      await fetch(route('generate-tank-client'), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: res, type: type }),
      })
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error("Error al generar el archivo PDF");
          }
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${type === 'active' ? 'Reporte tanques de clientes activos.pdf' : 'Reporte tanques de clientes historico.pdf'}`;
          link.click();
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.log(error);
        });

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center max-w-max mx-auto ">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-center font-semibold text-2xl mb-3">Reporte tanques</p>
          <div className="h-60 w-96  bg-gray-300 rounded-2xl overflow-hidden p-8 flex flex-col justify-center items-center gap-4">
            <button onClick={() => tankReport('active')} className="bg-[#2B3F75] hover:bg-[#5f74ad] transition-colors duration-500 hover:cursor-pointer block w-4/5 py-3 text-white  rounded-lg ">Activos</button>
            <button onClick={() => tankReport('historical')} className="bg-[#2B3F75] hover:bg-[#5f74ad] transition-colors duration-500 hover:cursor-pointer block w-4/5 py-3 text-white  rounded-lg ">Histórico</button>
          </div>
        </div>
        <div>
          <p className="text-center font-semibold text-2xl mb-3">Reporte tanques del clientes</p>
          <div className="h-60 w-96  bg-gray-300 rounded-2xl overflow-hidden p-8 flex flex-col justify-center items-center gap-4">
            <button onClick={() => tankClientReport('active')} className="bg-[#2B3F75] hover:bg-[#5f74ad] transition-colors duration-500 hover:cursor-pointer block w-4/5 py-3 text-white  rounded-lg ">Activos</button>
            <button onClick={() => tankClientReport('historical')} className="bg-[#2B3F75] hover:bg-[#5f74ad] transition-colors duration-500 hover:cursor-pointer block w-4/5 py-3 text-white  rounded-lg ">Histórico</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesTanques

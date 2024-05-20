const fetchClientes = async () => {
    const response = await fetch(route("clientes.index"));
    return await response.json();
};

const fetchProductos = async () => {
    const response = await fetch(route("productos.index"));
    return await response.json();
};


const fetchunidades = async () => {
    const responseE = await fetch(route("unidades-de-medida.index"));
    return await responseE.json();
};


const fetchClaves = async () => {
    const responseR = await fetch(route("claves-mostrar.index"));
    return await responseR.json();
};

const fetchImpuestos = async () => {
    const response = await fetch(route("sat/impuestos.index"));
    return await response.json();
};

const fetchZonas = async () => {
    const response = await fetch(route("zonas.index"));
    return await response.json();
};

const fetchFolioDiversos = async () => {
    const response = await fetch(route("FolioDiversos"));
    return await response.json();
};
const fetchFolioCarburacion = async () => {
    const response = await fetch(route("FolioCarburacion"));
    return await response.json();
};



const fetchEstaciones = async () => {
    const response = await fetch(route("estacion.index"));
    return await response.json();
};

const fetchFormaPago = async () => {
    const response = await fetch(route("formas-pago.index"));
    return await response.json();
};

const fetchMetodoPago = async () => {
    const response = await fetch(route("sat/metodo-pago.index"));
    return await response.json();
};

export {
    fetchClientes,
    fetchProductos,
    fetchFolioDiversos,
    fetchEstaciones,
    fetchFormaPago,
    fetchImpuestos,
    fetchMetodoPago,
    fetchZonas,
    fetchFolioCarburacion,
    fetchunidades,
    fetchClaves
};

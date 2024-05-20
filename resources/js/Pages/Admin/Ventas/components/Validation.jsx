export const validateForm = (data) => {
    let isValid = true;
    const errors = {};

    if (data.quienConQuien_idVendedor === "") {
        errors.quienConQuien_idVendedor = "El vendedor es requerido";
        isValid = false;
    }

    if (data.quienConQuien_idRed === "") {
        errors.quienConQuien_idRed = "La red es requerida";
        isValid = false;
    }

    if (data.quienConQuien_idAyudante === "") {
        errors.quienConQuien_idAyudante = "El ayudante es requerido";
        isValid = false;
    }

    if (data.quienConQuien_idSupervisor === "") {
        errors.quienConQuien_idSupervisor = "El supervisor es requerido";
        isValid = false;
    }

    if (data.quienConQuien_idRuta === "") {
        errors.quienConQuien_idRuta = "La ruta es requerida";
        isValid = false;
    } else if (data.quienConQuien_idRuta === data.quienConQuien_idRuta) {
        errors.quienConQuien_idRuta = "La ruta ya existe en la tabla";
        isValid = false;
    }

    if (data.quienConQuien_idAyudante2 === "") {
        errors.quienConQuien_idAyudante2 = "El segundo ayudante es requerido";
        isValid = false;
    }

    if (data.quienConQuien_fechaGuardada === "") {
        errors.quienConQuien_fechaGuardada = "La fecha es requerida";
        isValid = false;
    }

    if (data.quienConQuien_idunidad === "") {
        errors.quienConQuien_idunidad = "La unidad es requerida";
        isValid = false;
    }



    return { isValid, errors };
};

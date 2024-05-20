export const validateForm = (data) => {
    let isValid = true;
    const errors = {};

    if (data.correoNotificaciones_correo === "") {
        errors.correoNotificaciones_correo = "El correo es requerido";
        isValid = false;
    }
    if (data.correoNotificaciones_idAsunto === "") {
        errors.correoNotificaciones_idAsunto = "El asunto es requerido";
        isValid = false;
    }
    if (data.correoNotificaciones_idEmpresa === "") {
        errors.correoNotificaciones_idEmpresa = "La empresa es requerida";
        isValid = false;
    }

    return { isValid, errors };
};

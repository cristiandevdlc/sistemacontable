
export const requestTypes = {
    portatil: 1,
    estacionario: 2,
    creditos: 3,
}

export const requestTypesKeys = {
    1: 'portatil',
    2: 'estacionario',
    3: 'creditos',
}

export const requestStates = {
    TODOS: 0,
    PENDIENTE: 1,
    ACEPTADO: 2,
    RECHAZADO: 3,
}

export const selectsValues = {
    tipos: [
        { id: requestTypes.estacionario, value: 'Descuentos estacionarios' },
        { id: requestTypes.portatil, value: 'Descuentos portatiles' },
        { id: requestTypes.creditos, value: 'Creditos' },
    ],
    estados: [
        { id: 1, value: 'Pendientes' },
        { id: 2, value: 'Aceptados' },
        { id: 3, value: 'Rechazados' },
    ]
}

export const cdActions = {
    accept: 1,
    reject: 2,
}
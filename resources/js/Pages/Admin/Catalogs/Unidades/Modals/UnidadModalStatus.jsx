import unidadData from "../IntUnidad";

export const UnidadModalStatus = (unidad = unidadData) => {
    return [
        {
            label: 'Ver carta factura',
            custom: true,
            style: 'mb-2',
            customItem: ({ label }) =>
            (
                <>                
                    {`LA UNIDAD ${unidad.unidad_numeroComercial}, MODELO ${unidad.unidad_idModeloVehiculo}, DEL AÑO ${unidad.unidad_año} SERÁ DESACTIVADA`}
                </>
            ),
        },
    ]
}

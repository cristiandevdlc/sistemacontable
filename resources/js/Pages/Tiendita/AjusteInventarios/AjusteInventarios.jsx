import { useEffect, useState } from 'react';
import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';
import request, { validateInputs } from "@/utils";
import TextInput from "@/components/TextInput";

const AjusteInventarios = () => {

    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ loading: true, open: false, almacen: null, articulo: null, motivo: null, cantidad: null })
    const [filters, setFilters] = useState({ idArticulo: 0, idAlmacen: null })
    const [data, setData] = useState({ AjusteInventario_id: '', AjusteInventario_cantidadAjustada: null, AjusteInvantario_motivo: null })
    const [almacenSelected, setAlmacenSelected] = useState()
    const [articulosResponse, setArticulosResponse] = useState([]);
    const [selectedArticuloDetails, setSelectedArticuloDetails] = useState(null);


    const getFetchData = async () => {
        const [almacenResponse,] = await Promise.all([
            fetch(route("almacen.index")).then(res => res.json()),
            // fetch(route("articulos.index")).then(res => res.json()),
        ]);
        return { almacenResponse };
    }

    const artitulosXalmacenId = async () => {
        const response = await request(route("ajuste-inventarios"), 'POST', { almacen_id: almacenSelected }, { enabled: true });
        setArticulosResponse(response);
        return { response }
    };
    const handleAlmacenSelection = (almacenId) => {
        setAlmacenSelected(almacenId);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!selectedArticuloDetails) {
            console.error("Debes seleccionar un artículo antes de enviar el formulario.");
            return;
        }
        const requestData = {
            AjusteInventario_idArticuloAlmacen: selectedArticuloDetails.almacenArticulo_id,
            AjusteInventario_cantidadAjustada: state.cantidad,
            AjusteInventario_cantidadActual: selectedArticuloDetails.almacenArticulo_existencia,
            AjusteInvantario_motivo: state.motivo
        };

        const ruta = action === "create" ? route("ajustes.store") : route("ajustes.update", data.AjusteInventario_id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, requestData).then(() => {
            getFetchData();
        });

        setState({
            ...state,
            almacen: '',
            articulo: '',
            motivo: '',
            cantidad: '',
        });
    };

    useEffect(() => {
        getFetchData()
            .then((res) => {
                setState({
                    ...state,
                    almacen: res.almacenResponse,
                    loading: false
                });
            });
    }, []);

    useEffect(() => {
        if (almacenSelected) {
            artitulosXalmacenId()
        }
    }, [almacenSelected]);



    return (
        <>
            {state.loading &&
                <LoadingDiv />
            }
            <section className="overflow-hidden  sm:grid sm:grid-cols-2">
                <div className="rounded-lg md:p-12 lg:px-16 lg:py-24  shadow-lg bg-white p-8">
                    <SelectComp
                        label="Almacén"
                        options={state.almacen}
                        value={filters.idAlmacen || ''}
                        data="almacen_nombre"
                        valueKey="almacen_id"
                        onChangeFunc={(value) => {
                            setFilters({ ...filters, idAlmacen: value });
                            handleAlmacenSelection(value);
                        }}
                    />
                    <SelectComp
                        label="Artículos"
                        options={articulosResponse.map((item) => ({
                            value: item.almacenArticulo_id,
                            label: `${item.articulo.articulo_codigo} - ${item.articulo.articulo_nombre}`,
                        }))}
                        value={filters.idArticulo || ''}
                        data="label"
                        valueKey="value"
                        onChangeFunc={(value) => {
                            setFilters({ ...filters, idArticulo: value });
                            const selectedArticulo = articulosResponse.find((item) => item.almacenArticulo_id === value);
                            setSelectedArticuloDetails(selectedArticulo);
                        }}
                        disabled={!almacenSelected}
                    />

                    <TextInput
                        label="Cantidad"
                        type="text"
                        name="Cantidad"
                        value={state.cantidad}
                        isFocused={true}
                        maxLength="50"
                        onChange={(e) => {
                            setState({ ...state, cantidad: e.target.value })
                        }}
                    />
                    <div
                        className="mt-9 overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                    </div>

                    <article
                        className="hover:animate-background rounded-xl bg-gradient-to-r from-orange-600 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
                    >
                        <textarea
                            id="OrderNotes"
                            className="w-full resize-none border-none align-top focus:ring-0 sm:text-md"
                            rows="4"
                            placeholder="Motivo..."
                            maxLength="500"
                            value={state.motivo}
                            onChange={(e) => {
                                setState({ ...state, motivo: e.target.value })
                            }}
                        >
                        </textarea>
                    </article>
                    <button
                        onClick={submit}
                        type="button"
                        className="rounded bg-indigo-600 px-3 py-1.5 text-md font-medium text-white hover:bg-indigo-700 mt-8">
                        Guardar
                    </button>
                </div>
            </section>
        </>
    )
}
export default AjusteInventarios
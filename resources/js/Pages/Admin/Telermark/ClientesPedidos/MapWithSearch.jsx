import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from "react-google-places-autocomplete";
import { intAddressData, intMapAddress, intStateModule } from "./intClientePedidos";
import React, { useEffect, useRef, useState } from "react";
import { firstObj, nonNullObjVal, noty, primaryColor } from "@/utils";
import { ButtonComp } from "@/components/ButtonComp";
import AddIcon from '@mui/icons-material/Add';

const mapZoneType = {
	postal_code: 'postal_code',
	route: 'route',
	street_address: 'street_address',
	sublocality_level_1: 'sublocality_level_1',
	locality: 'locality',
	political: 'political',
	administrative_area_level_1: 'administrative_area_level_1',
	sublocality: 'sublocality',
	street_number: 'street_number'
}

const MapWithSearch = ({ addressData = intAddressData, setAddressData, state = intStateModule, setState }) => {
	const [addressTemp, setAddressTemp] = useState({ ...intAddressData, ...addressData })
	const [addressMap, setAddressMap] = useState(intMapAddress)
	const markerRef = useRef(null);
	const mapRef = useRef(null);

	const keyDownHandler = event => {
		if (event.key === 'Enter') event.preventDefault();
	};

	document.addEventListener('keydown', keyDownHandler);

	const initializeMap = (latitud = addressMap.lat, longitud = addressMap.lng) => {
		try {
			const newMap = new google.maps.Map(mapRef.current, {
				center: { lat: latitud, lng: longitud },
				zoom: 19,
			});
			markerRef.current = new google.maps.Marker({
				position: { lat: latitud, lng: longitud },
				map: newMap,
				draggable: true,
			});

			markerRef.current.addListener("dragend", dragendFunc);
		} catch (error) {
			console.error(error)
		}
	}

	const dragendFunc = async () => {
		const newPosition = markerRef.current.getPosition();
		const lat = newPosition.lat();
		const lng = newPosition.lng();

		const geocoder = new google.maps.Geocoder();
		const location = new google.maps.LatLng(lat, lng);
		new Promise((resolve, reject) => {
			geocoder.geocode({ 'location': location }, (results, status) => {
				if (status === google.maps.GeocoderStatus.OK) resolve(results);
				else reject(status);
			});
		}).then((res = []) => {

			const { zipCode, streetName, suburbName, noExt } = getAddressData(res)


			const coloniaID = state.suburbs?.find(col => {
				return String(col.Colonia_Nombre)
					.toUpperCase() == (String(suburbName).toUpperCase())
			})?.Colonia_Id

			setAddressTemp({
				...addressTemp,
				latitud: `${addressMap.lat}`,
				longitud: `${addressMap.lng}`,
				zipCode: coloniaID ? '' : zipCode,
				calle: streetName,
				ColoniaId: coloniaID,
				numeroExterior: noExt
			})

			setAddressMap({
				label: getMapLabel(res),
				lat: lat,
				lng: lng,
				value: { place_id: getAddressId(res) }
			})
		});
	}

	const handlePlaceSelect = async ({ value }) => {
		const resPlace = await geocodeByPlaceId(value.place_id)
		const { lat, lng } = await getLatLng(getFirstObj(resPlace))
		const { zipCode, streetName, route, defaultZip, suburbName, noExt } = getAddressData(resPlace)

		setAddressMap({
			label: getMapLabel(resPlace),
			lat: lat,
			lng: lng,
			value: { place_id: getFirstObj(resPlace)?.place_id }
		})

		const coloniaID = state.suburbs?.find(col => {
			const match = String(col.Colonia_Nombre).toUpperCase()
			return match == (String(route).toUpperCase()) || match == (String(suburbName).toUpperCase())
		})?.Colonia_Id

		setAddressTemp({
			...addressTemp,
			latitud: `${lat}`,
			longitud: `${lng}`,
			zipCode: coloniaID ? '' : defaultZip,
			calle: streetName,
			ColoniaId: coloniaID,
			numeroExterior: noExt
		})

		initializeMap(lat, lng)
	};

	const getAddressData = (addressRes = []) => {
		const zipCode = getZipCode(addressRes) ?? '';
		const streetName = getStreet(addressRes) ?? '';
		const route = getRoute(addressRes) ? getRoute(addressRes) : (getRouteDefault(addressRes) ?? '');
		const defaultZip = getFirstZip(addressRes) ?? '';
		const suburbName = getFirstSuburb(addressRes) ?? '';
		const noExt = getNoExt(addressRes) ?? '';

		return { zipCode, streetName, route, defaultZip, suburbName, noExt }
	}

	const filters = {
		street_address: (obj) => obj.types?.includes(mapZoneType.street_address),
		postal_code: (obj) => obj.types?.includes(mapZoneType.postal_code),
		route: (obj) => obj.types?.includes(mapZoneType.route),
		sublocality_level_1: (obj) => obj.types?.includes(mapZoneType.sublocality_level_1),
		political: (obj) => obj.types?.includes(mapZoneType.political),
		sublocality: (obj) => obj.types?.includes(mapZoneType.sublocality),
		street_number: (obj) => obj.types?.includes(mapZoneType.street_number),
	}

	const getFirstSuburb = (addressRes = []) => {
		const firstObj = getFirstObj(addressRes)
		return getFirstObj(firstObj.address_components.filter(filters.political))?.long_name
	}

	const getFirstObj = (addressRes = []) => addressRes.find(() => true)

	const getRouteDefault = (addressRes = []) => getFirstObj(getFirstObj(addressRes)?.address_components)?.long_name

	const getRoute = (addressRes = []) => {
		const totalAddress = getFirstObj(addressRes)
		const addressObj = Array.from(totalAddress?.address_components ?? []).find(filters.sublocality_level_1)
		return addressObj?.long_name
	}

	const getZipCode = (addressRes = []) => {
		const totalAddress = addressRes.find(filters.postal_code)
		const addressObj = Array.from(totalAddress?.address_components ?? []).find(filters.postal_code)
		return addressObj?.long_name
	}

	const getFirstZip = (addressRes = []) => {
		const totalAddress = addressRes.find(() => true)
		const addressObj = Array.from(totalAddress?.address_components ?? []).find(filters.postal_code)
		return addressObj?.long_name
	}

	const getStreet = (addressRes = []) => {
		const totalAddress = addressRes.find(filters.street_address)
		const addressDefault = firstObj(addressRes)
		const addressComp = totalAddress?.address_components || addressDefault?.address_components || []
		const addressObj = Array.from(addressComp).find(filters.route)
		return addressObj?.long_name
	}

	const getNoExt = (addressRes = []) => {
		const totalAddress = firstObj(addressRes)
		const addressObj = Array.from(totalAddress.address_components).find(filters.street_number)
		return addressObj?.long_name
	}

	const getMapLabel = (addressRes = []) => getFirstObj(addressRes)?.formatted_address

	const getAddressId = (addressRes = []) => addressRes
		.find(filters.street_address)?.place_id

	const saveAddressData = () => {
		setAddressData({ ...addressData, ...nonNullObjVal(addressTemp) })
		setState({
			...state,
			openGeolocation: false
		})
	}

	useEffect(() => {
		if (mapRef.current) {
			setTimeout(() => {
				initializeMap(addressMap.lat, addressMap.lng)
			}, 2000)
		}
	}, [mapRef]);

	return (
		<>
			<div className="grid w-full mb-5" >
				<GooglePlacesAutocomplete
					apiKey="AIzaSyDiRJzPGa1pnDYNn7fLzoVKI6xhZDP5bm4" // Reemplaza con tu clave de API de Google
					placeholder="Escribe la dirección"
					selectProps={{
						value: addressMap,
						onChange: handlePlaceSelect,
					}}

					autocompletionRequest={{
						componentRestrictions: {
							country: ['mx'],
						}
					}}
				/>
			</div>
			<div style={{ display: "inline" }}>
				<div className="!w-[35px] z-10 absolute top-[87%] left-[30px] ">
					<ButtonComp
						color={primaryColor}
						label={<AddIcon />}
						onClick={saveAddressData}
					/>
				</div>
				<div id="map" ref={mapRef} style={{ height: "600px", width: "100%" }} />
			</div>
		</>
	);

};

export default MapWithSearch;

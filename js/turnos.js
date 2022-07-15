//funcion que trae los datos del json.
export const obtenerDatos = async() => {
	let respuesta = await fetch('../baseDatos/stock.json')
	return respuesta.json() //transformo a algo legible por js
}
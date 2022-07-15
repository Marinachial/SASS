//modularizacion para acomodar el proyecto
import { obtenerDatos } from './turnos.js'

const domTurnos = document.getElementById('mainTurnos')

//evento
window.addEventListener('DOMContentLoaded', () =>{
	renderizarDOM()
})

const mostrarDatos = async() => {
 	let datos = await obtenerDatos()
  	console.log(datos)
}

mostrarDatos()


const renderizarDOM = async() =>{
 	let productos = await obtenerDatos()
	let productosVista = ''
 	productos.forEach(producto =>{
		const {img, nombre, demora, precio, desc, id} = producto
		{
			productosVista += `
				<div class="card mb-3 scale" style="max-width: 540px;"> 
					<div class="row g-0">
					<div class="col-md-4 col-sm-4">
						<img id=fotoProducto src="${img}" class="img-fluid rounded-start">
			  		</div>
			  	<div class="col-md-8 col-sm-8">
				<div class="card-body">
					<h3 id=tituloProducto class="card-titlesobre">${nombre}</h3>
				  	<p id=demoraProducto class="card-text2">${demora}</p>
				  	<p id=precioProducto>$${precio}</p> 
				  	<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
					<p id=descProducto class="card-text2">${desc}</p>
				  	<button data-id"${id}" id="mybtn" name="btnSeleccionar" class="btn btn-primary">Seleccionar</button>
					</div>
			    </div>
				</div>
		  		</div>
				`
		}
	});
	domTurnos.innerHTML = productosVista
}

//evento para el boton Seleccionar y que se guarde en el LS
domTurnos.addEventListener("click", (e) => {
	if (e.target.id === "mybtn"){
		guardarTurnos(e.target.dataset.id) //recupero la data del elemento que se quiere seleccionar
	}
})

//funcion que busca el elemento con ese id del stock
	const guardarTurnos = async (id) => {
	let productos = await obtenerDatos()
	let productoEncontrado = productos.find(producto => producto.id === parseInt(id));
	let productoStorage = JSON.parse(localStorage.getItem(id));
	if(productoStorage === null){
		localStorage.setItem(id, JSON.stringify({...productoEncontrado, Cantidad:1})) //devuelve todas las prop de un objeto o array.
	}else{
		let productoExiste = JSON.parse(localStorage.getItem(id))
		productoExiste.precio = productoExiste.precio + productoEncontrado.precio
		productoExiste.Cantidad = productoExiste.Cantidad + 1
		console.log(productoExiste)
		localStorage.setItem(id, JSON.stringify(productoExiste))
	}
}
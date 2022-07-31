//modularizacion para acomodar el proyecto
import { obtenerDatos } from './turnos.js'

const domTurnos = document.getElementById('mainTurnos')
const domCarrito = document.getElementById('carrito')
const fCompra = document.getElementById('finCompra')

let carrito = []


//evento para cuando se carga la pagina, ejecute la funcion
window.addEventListener('DOMContentLoaded', () =>{
	renderizarDOM()
})

const renderizarDOM = async() =>{
	let productosVista = ''
	let productos = await obtenerDatos()
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
				  	<button data-id="${id}" id="mybtn" name="btnSeleccionar" class="btn btn-primary">Seleccionar</button>
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
domTurnos.addEventListener('click', (e) => {
	if (e.target.id === "mybtn"){
		Swal.fire({
			title: '¡Perfecto! Agregaste un item.',
			icon: 'success',
			showClass: {
			  popup: 'animate__animated animate__fadeInDown'
			},
			hideClass: {
			  popup: 'animate__animated animate__fadeOutUp'
			}
		  })
		guardarTurnos(e.target.dataset.id); //recupero la data del elemento que se quiere seleccionar
	}
})

//funcion que busca el elemento con ese id del stock
 	const guardarTurnos = async(id) => {
	let productos = await obtenerDatos()
	let productoEncontrado = productos.find(producto => producto.id === parseInt(id));
	let productoStorage = JSON.parse(localStorage.getItem(id));
	if(productoStorage === null){
		localStorage.setItem(id, JSON.stringify({...productoEncontrado, cantidad:1})) //devuelve todas las prop de un objeto o array.
		recorrerStorage() //con esta funcion actualizo el carrito.
	}else{
		let productoExiste = JSON.parse(localStorage.getItem(id))
		productoExiste.cantidad = productoExiste.cantidad + 1
		productoExiste.precio = productoExiste.precio + productoEncontrado.precio
		localStorage.setItem(id, JSON.stringify(productoExiste))
		recorrerStorage()
	}
}

//contenedor donde guardamos los items
const recorrerStorage = () => {
    carrito.length = 0 //ponemos el carrito en 0 para que no se pisen los productos
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i)
        carrito.push(JSON.parse(localStorage.getItem(clave)))
    }
	renderCarrito()
}

const renderCarrito = () => {
	if (carrito.length > 0){
		domCarrito.innerHTML = ''
		carrito.forEach(producto => {
			const {img, nombre, demora, precio, desc, id, cantidad} = producto
			domCarrito.innerHTML += `
			<div id="carrito" class="card" style="width: 18rem;">
				<img id=fotoProducto src="${img}" class="card-img-top" alt="...">
				<div class="card-body">
			  <p id="descProducto" class="card-text2">Seleccionaste ${nombre}</p>
			  <p id=precioProducto>$${precio}</p>
			  <p>Cantidad: ${cantidad}</p> 
			  <button id="eliminar" data-id="${id}" type="button" class="btn btn-secondary">Eliminar</button>
				</div>
				</div>`			
		});
	} else{
		domCarrito.innerHTML = `
		<div id="carritoVacio" class="card mb-3" style="max-width: 540px;">
		<div class="col-md-4 col-sm-4">
  			<img src="../img/carritovacio.png" class="card-img-top" alt="bolsa de compras vacia.">
		<div class="card-body">
		</div>
			<p class="card-text">No hay nada seleccionado.</p>
		</div>
		</div>`
	}
}

domCarrito.addEventListener('click', borrarProducto)

function borrarProducto(e) {
	if (e.target.id === "eliminar"){
		let idProducto = e.target.dataset.id
		//let productoEncontrado = productos.find(producto => producto.id === parseInt(idProducto))
		let productoStorage = JSON.parse(localStorage.getItem(idProducto))
		if(productoStorage.cantidad > 1){
			productoStorage.cantidad = productoStorage.cantidad - 1
			productoStorage.precio = productoStorage.precio - productoEncontrado.precio
			localStorage.setItem(idProducto, JSON.stringify(productoStorage))
			recorrerStorage()
		}else{
			localStorage.removeItem(idProducto)
			recorrerStorage()
		}
	}
}
recorrerStorage()

fCompra.addEventListener('click',(e) => {
	Swal.fire({
		title: 'Finalizaste tu compra :)',
		icon: 'success',
		showClass: {
		  popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
		  popup: 'animate__animated animate__fadeOutUp'
		}
	  })	
})



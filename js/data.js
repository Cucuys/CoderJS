
//PARA CARGAR EL JSON CON AVIONES CON FECH USANDO ASYNX-AWAIT Y MANEJO DE ERRORES
async function cargarAviones() {
    try {
        //SE HACE FETCH DEL JSON QUE CONTIENE MODELOS DE AVIONES Y LA PISTA BASE
        const response = await fetch('json/aviones.json')
        if (!response.ok) throw new Error('Error al cargar los datos de aviones')
        // SE PARSEA EL JSON
        const aviones = await response.json()
        return aviones
    } catch (error) {
        // SE MUESTRA ALERTA CON SWEETALERT EN CASO DE ERROR, SE DEVUELVE UN ARRAY VACIO PORQUE SE ME ROMPIA EL RESTO 
        Swal.fire('Error', error.message, 'error')
        return []
    }
}

// SE HACE UNA VARIABLE GLOBAL PARA CONTENER LOS AVIONES
let aviones = []

// FUNCION PARA SELECCIONAR LOS AVIONES 
function cargarOpciones() {
    const selectorModelo = document.getElementById('modelo')
    selectorModelo.innerHTML = '' // SE ELIMINAN LAS OPCIONES PREVIAS POR SI SE LLAMA VARIAS VECES
    aviones.forEach((avion, indice) => {
        const opcion = document.createElement('option') // SE CREA UN ELEMENTO "OPTION"
        opcion.value = indice //COMO VAALUE SE TOMA EL VALOR DEL INDICE 
        opcion.textContent = avion.modelo // SE PASA A TEXTO VISIBLE CON EL MODELO DE AVION
        selectorModelo.appendChild(opcion) // SE CARGA LA AOPCION AL SELECTOR
    })
}

// SE CARGAM LOS ACIONES DESDE JSON Y SE LLENA EL SELECT CON ESTE ARCHIVO
cargarAviones().then(data => {
    aviones = data
    cargarOpciones()
})

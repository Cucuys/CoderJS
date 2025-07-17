//DATOS BASE DE NUMEROS DE MODELOS DE AVIONES CON LA LUNGITUD DE PISTA MINIMA REQUERIDA PARA CADA UNO
const A320 = {longitudBase: 2100}
const B737 = {longitudBase: 2200}
const A350 = {longitudBase: 2600}

//ARRAY DE LOS MODELOS ACTUALES DE AVIONES
const aviones = [
    {modelo: 'A320', pistaBase: 2100},
    {modelo: 'B737', pistaBase: 2200},
    {modelo: 'A350', pistaBase: 2600}
]


const selectorModelo = document.getElementById('modelo') //SE AGREGAN LAS OPCIONES DE AVION
aviones.forEach((avion, indice) => { //RECORRE EL ARRAY, SE UTILIZA EL INDICE DE CADA UNO Y SE MUESTRA EL NOMBRE DEL AVIÓN EN LA OPCIÓN DEL HTML
    const opcion = document.createElement('option') 
    opcion.value = indice
    opcion.textContent = avion.modelo
    selectorModelo.appendChild(opcion)
})

// CALCULAR EXTRA DE PISTA POR PESO
function extraPorPeso(base, peso) {
    if (peso <= 70000) {
        return 0
    } else {
        return base * ((peso - 70000) / 1000) * 0.01
    }
}

// CALCULAR EXTRA DE PISTA POR TEMPERATURA
function extraPorTemperatura(base, temperatura) {
    if (temperatura <= 30) {
        return 0
    } else {
        return base * (temperatura - 30) * 0.01
    }
}

// CALCULAR PISTA EXTRA POR ALTITUD
function extraPorAltitud(base, altitud) {
    return base * 0.04 * (altitud / 300)
}

// CHEQUEAR SI LA PISTA ES SUFICIENTE
function evaluarPista(longitudNecesaria, longitudDisponible) {
    if (longitudDisponible >= longitudNecesaria) {
        return 'Pista suficiente'
    } else {
        return 'Pista insuficiente'
    }
}

// CUADRO DE RESULTADO FINAL CON EL RESUMEN DEL CALCULO
function mostrarResultado(avion, peso, temperatura, altitud, pistaDisponible, pistaTotal) {
    let mensaje = 'Modelo: ' + avion.modelo + '\n'
    mensaje += 'Pista base: ' + avion.pistaBase + ' m\n'
    mensaje += 'Extra por peso: +' + Math.round(extraPorPeso(avion.pistaBase, peso)) + ' m\n'
    mensaje += 'Extra por temperatura: +' + Math.round(extraPorTemperatura(avion.pistaBase, temperatura)) + ' m\n'
    mensaje += 'Extra por altitud: +' + Math.round(extraPorAltitud(avion.pistaBase, altitud)) + ' m\n'
    mensaje += 'Pista necesaria: ' + Math.round(pistaTotal) + ' m\n'
    mensaje += 'Pista disponible: ' + pistaDisponible + ' m\n'
    mensaje += evaluarPista(pistaTotal, pistaDisponible)
    return mensaje
}

// ACÁ SE GUARDA LAS REFERENCIA DEL FORMULARIO Y DEL CUADRO QUE LO CONTIENE PARA MOSTRAR EL RESULTADO
const formulario = document.getElementById('formulario')
const divResultado = document.getElementById('resultado')

formulario.addEventListener('submit', evento => {
    evento.preventDefault() //NO SE SI HAY OTRA FORMA DE HACERLO PERO CADA VEZ QUE LE DABA CALCULAR EN EL FORMULARIO, SE RECARGABA LA PAGINA Y BORRABA LOS DATOS, NO SE SI ES LA FORMA CORRECTA PARA QUE NO SE ACTUALICE O ES HARCODEAR (https://developer.mozilla.org/es/docs/Web/API/Event/preventDefault)

//SE LEEN LOS VALORES INGRESADOS, SE PASAN A NUMERO Y SE UTILIZAN PARA LOS CALCULOS, TAMBIÉN SE SELECCIONA EL AVION Y SE PASA AL INDICE PARA SABER CUAL ELIGIÓ
    const avion = aviones[selectorModelo.value]
    const peso = parseFloat(document.getElementById('peso').value)
    const temperatura = parseFloat(document.getElementById('temperatura').value)
    const altitud = parseFloat(document.getElementById('altitud').value)
    const pista = parseFloat(document.getElementById('pista').value)

// SE CORRIGE LO INDICADO EN LA ENTREGA PASADA PARA QUE EL USUARIO PUEDA INGRESAR DATOS RAZONABLES 
    if (pista < 1000 || pista > 5000) {
        divResultado.textContent = 'La pista debe tener entre 1000 y 5000 metros'
        return
    }

    if (temperatura < -20 || temperatura > 50) {
        divResultado.textContent = 'La temperatura debe estar entre -20°C y 50°C'
        return
    }

    if (altitud < 0 || altitud > 6000) {
        divResultado.textContent = 'La altitud debe estar entre 0 y 6000 metros'
        return
    }

    const base = avion.pistaBase
    const pistaTotal = base + extraPorPeso(base, peso) + extraPorTemperatura(base, temperatura) + extraPorAltitud(base, altitud)

    divResultado.textContent = mostrarResultado(avion, peso, temperatura, altitud, pista, pistaTotal)
})

// BOTON PARA GUARDAR EN EL ALMACENAMIENTO LOCAL (NO SABÍA COMO IMPLEMENTARLO Y SE GUARDA LOS DATOS EN LOCAL Y EN CASO DE ABRIR EN OTRAS PESTAÑA Y DAR CARGAR MUESTRA LOS RESULTADOS GUARDADOS ANTERIORMENTE)
document.getElementById('guardar').addEventListener('click', () => {
    localStorage.setItem('modelo', selectorModelo.value)
    localStorage.setItem('peso', document.getElementById('peso').value)
    localStorage.setItem('temperatura', document.getElementById('temperatura').value)
    localStorage.setItem('altitud', document.getElementById('altitud').value)
    localStorage.setItem('pista', document.getElementById('pista').value)
})

// BOTÓN PARA CARGAR LOS DATOS PREVIAMENTE GUARDADOS DESDE EL ALMACENAMIENTO LOCAL
document.getElementById('cargar').addEventListener('click', () => {
    const modelo = localStorage.getItem('modelo')
    const peso = localStorage.getItem('peso')
    const temperatura = localStorage.getItem('temperatura')
    const altitud = localStorage.getItem('altitud')
    const pista = localStorage.getItem('pista')

//SE VERIFICA SI EN EL ALMACENAMIENTO LOCAL ESTÁ ALOJADO EL DATO, QUE SEA DIFERENTE A NULL, SI ESTÁ EL DATO SE PADA COMO VALOR AL FORMULARIO CON EL BOTÓN CARGAR
    if (modelo !== null) selectorModelo.value = modelo
    if (peso !== null) document.getElementById('peso').value = peso
    if (temperatura !== null) document.getElementById('temperatura').value = temperatura
    if (altitud !== null) document.getElementById('altitud').value = altitud
    if (pista !== null) document.getElementById('pista').value = pista
})

// BORRA LOS DATOS Y BORRA EL FORMULARIO
document.getElementById('borrar').addEventListener('click', () => {
    localStorage.clear()
    divResultado.textContent = ''
})

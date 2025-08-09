// FUNCIONES PARA CALCULAR EL EXTRA DE PISTA SEGUN PESO, TEMPERATURA Y ALTITUD

function extraPorPeso(base, peso) {
    if (peso <= 70000) {
        return 0
    } else {
        return base * ((peso - 70000) / 1000) * 0.007
    }
}

function extraPorTemperatura(base, temperatura) {
    if (temperatura <= 30) {
        return 0
    } else {
        return base * (temperatura - 30) * 0.005
    }
}

function extraPorAltitud(base, altitud) {
    return base * 0.005 * (altitud / 300)
}

// FUNCION PARA EVALUAR SI LA PISTA ES SUFICIENTE O NO SEGUN LA LONGITUD NECESARIA
function evaluarPista(longitudNecesaria, longitudDisponible) {
    if (longitudDisponible >= longitudNecesaria) {
        return 'Pista suficiente'
    } else {
        return 'Pista insuficiente'
    }
}

// FUNCION QUE MUESTRA EL RESULTADO FINAL CON DETALLE Y NOTIFICACIÓN SWEET ALERT
function mostrarResultado(avion, peso, temperatura, altitud, pistaDisponible, pistaTotal) {
    let mensaje = 'Modelo: ' + avion.modelo + '\n'
    mensaje += 'Pista base: ' + avion.pistaBase + ' m\n'
    mensaje += 'Extra por peso: +' + Math.round(extraPorPeso(avion.pistaBase, peso)) + ' m\n'
    mensaje += 'Extra por temperatura: +' + Math.round(extraPorTemperatura(avion.pistaBase, temperatura)) + ' m\n'
    mensaje += 'Extra por altitud: +' + Math.round(extraPorAltitud(avion.pistaBase, altitud)) + ' m\n'
    mensaje += 'Pista necesaria: ' + Math.round(pistaTotal) + ' m\n'
    mensaje += 'Pista disponible: ' + pistaDisponible + ' m\n'
    mensaje += evaluarPista(pistaTotal, pistaDisponible)
    Swal.fire('Resultado', mensaje, 'info')
}

// SE HACE REFERENCIA AL FORMULARIO PARA AGREGAR EL EVENTO SUBMIT
const formulario = document.getElementById('formulario')

// "ESCUCHAMOS" EL SUBMIT DEL FORMULARIO PARA HACER LOS CALCULOS
formulario.addEventListener('submit', async evento => {
    evento.preventDefault() //NO SE SI HAY OTRA FORMA DE HACERLO PERO CADA VEZ QUE LE DABA CALCULAR EN EL FORMULARIO, SE RECARGABA LA PAGINA Y BORRABA LOS DATOS, NO SE SI ES LA FORMA CORRECTA PARA QUE NO SE ACTUALICE O ES HARCODEAR (https://developer.mozilla.org/es/docs/Web/API/Event/preventDefault)
    try {
        // SI NO HAY AVIONES CARGADOS NO SE SIGUE Y CORTA
        if (aviones.length === 0) {
            Swal.fire('Error', 'No hay datos de aviones para calcular', 'error')
            return
        }

        // SE CARGA EL AVION SELECCIONADO Y LOS VALORES NUMERICOS DE LOS INPUTS
        const selectorModelo = document.getElementById('modelo')
        const avion = aviones[selectorModelo.value]
        const peso = parseFloat(document.getElementById('peso').value)
        const temperatura = parseFloat(document.getElementById('temperatura').value)
        const altitud = parseFloat(document.getElementById('altitud').value)
        const pista = parseFloat(document.getElementById('pista').value)

        // SE CHEQUEARN LOS RANGOS PARA PISTA, TEMPERATURA Y ALTITUD, EN CASO DE SER INVALIDOS SE MOSTRARAN ALERTAS CON SWEET ALERT
        if (pista < 1000 || pista > 5000) {
            Swal.fire('Error', 'La pista debe tener entre 1000 y 5000 metros', 'error')
            return
        }

        if (temperatura < -20 || temperatura > 50) {
            Swal.fire('Error', 'La temperatura debe estar entre -20°C y 50°C', 'error')
            return
        }

        if (altitud < 0 || altitud > 6000) {
            Swal.fire('Error', 'La altitud debe estar entre 0 y 6000 metros', 'error')
            return
        }

        //SE CALCULA PISTA TOTAL NECESARIA SUMANDO PISTA BASE MAS EXTRAS 
        const base = avion.pistaBase
        const pistaTotal = base + extraPorPeso(base, peso) + extraPorTemperatura(base, temperatura) + extraPorAltitud(base, altitud)

        //SE MUESTRA RESULTADOS CON SWEET ALERT
        mostrarResultado(avion, peso, temperatura, altitud, pista, pistaTotal)

    } catch (error) {
        // EN CASO DE SUCEDER ALGO NO CONTEMPLADO SE MOSTRARÁ ERROR
        Swal.fire('Error inesperado', error.message, 'error')
    }
})

// SE CREA EL EVENTO PARA EL LOCAL STORAGE Y PODER GUARDAR
document.getElementById('guardar').addEventListener('click', () => {
    localStorage.setItem('modelo', document.getElementById('modelo').value)
    localStorage.setItem('peso', document.getElementById('peso').value)
    localStorage.setItem('temperatura', document.getElementById('temperatura').value)
    localStorage.setItem('altitud', document.getElementById('altitud').value)
    localStorage.setItem('pista', document.getElementById('pista').value)
    Swal.fire('Guardado', 'Datos guardados localmente', 'success')
})

// SE CREA EVENTO PARA CARGAR LOS DATOS GUARDADOS EN LOCALSTORAGE AL FORMULARIO
document.getElementById('cargar').addEventListener('click', () => {
    const modelo = localStorage.getItem('modelo')
    const peso = localStorage.getItem('peso')
    const temperatura = localStorage.getItem('temperatura')
    const altitud = localStorage.getItem('altitud')
    const pista = localStorage.getItem('pista')

    // EN CASO DE EXISTIR LOS DATOS SE CARGARAN A LOS IMPUTS
    if (modelo !== null) document.getElementById('modelo').value = modelo
    if (peso !== null) document.getElementById('peso').value = peso
    if (temperatura !== null) document.getElementById('temperatura').value = temperatura
    if (altitud !== null) document.getElementById('altitud').value = altitud
    if (pista !== null) document.getElementById('pista').value = pista

    Swal.fire('Cargado', 'Datos cargados localmente', 'success')
})

//SE CREA EVENTO PARA BORRAR DATOS GUARDADOS Y LIMPIAR FORMULARIO CON CONFIRMACION DESDE SWEET
document.getElementById('borrar').addEventListener('click', async () => {
    const result = await Swal.fire({
        title: '¿Seguro que quieres borrar los datos?',
        showCancelButton: true,
        confirmButtonText: 'Sí borrar',
        cancelButtonText: 'No'
    })

    if (result.isConfirmed) {
        localStorage.clear()
        //SE LIMPIAN LOS CAMPOS
        document.getElementById('modelo').value = ''
        document.getElementById('peso').value = ''
        document.getElementById('temperatura').value = ''
        document.getElementById('altitud').value = ''
        document.getElementById('pista').value = ''
        Swal.fire('Borrado', 'Datos eliminados', 'success')
    }
})

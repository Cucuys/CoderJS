//DATOS BASE DE NUMEROS DE MODELOS DE AVIONES CON LA LUNGITUD DE PISTA MINIMA REQUERIDA PARA CADA UNO
const A320 = {longitudBase: 2100}
const B737 = {longitudBase: 2200}
const A350 = {longitudBase: 2600}

//ARRAY DE LOS MODELOS ACTUALES DE AVIONES
const aviones = [
    {modelo: "A320", longitudBase: 2100},
    {modelo: "B737", longitudBase: 2200},
    {modelo: "A350", longitudBase: 2600}
]

//FUNCIONES
//ESTA FUNCION MUESTRA LOS MODELOS DE AVIONE DISPONIBLE, NO LA HAGO CON SWITCH PORQUE SINO CADA VEZ QUE AGREGO UN AVION NUEVO AL ARRAY TENGO QUE CAMBIAR EL SWITCH TAMBIEN
function mostrarModelos(aviones) {
    let lista = "Modelos disponible:\n"
    for (let i = 0; i < aviones.length; i++)
        lista += i + ". " + aviones[i].modelo + "\n"
        return lista
}

//FUNCION PARA CALCULAR EL EXTRA DE PISTA SEGUN PESO, A PARTIR DE LOS 70.000KG SUMA 0,1% SOBRE PISTA BASE
function ajustarPorPeso(base, peso) {
    const pesoReferencia = 70000
    if (peso <= pesoReferencia)
        return 0
    let exceso = peso - pesoReferencia
    let porcentajeExtra = (exceso / 1000) * 0.01
        return base * porcentajeExtra
}

//FUNCION PARA CALCULAR EXTRA FED PISTA SEGUN TEMPERATURA AMBIENTE, SE TOMA EN CUENTA A PARTIR DE LOS 30°c, A PARTIR DE AHÍ SUMA 1% CADA UN GRADO A LA PISTA BASE
function ajustarPorTemperatura(longitud, temperatura) {
    const tempReferencia = 30
    if (temperatura <= tempReferencia)
        return 0
    let exceso = temperatura - tempReferencia
    let porcentajeExtra = exceso * 0.01
        return longitud * porcentajeExtra
}

//FUNCION PARA CALCULAR EL EXTRA DE PISTA SEGUN LA ALTITUD A LA QUE SE ENCUENTRA LA PISTA SOBRE EL NIVEL DEL MAR, CADA 300M SUMA 4% A LA PISTA BASE
function ajustePorAltitud (longitud, altitud) {
    let factor = 1 + (0.04 * (altitud / 300)) //SE CREA LA VARIABLE FACTOR PARA QUE EN ESTA SE ALOJES EL 100% DE LA PISTA BASE MAS EL % EXTRA (EJEMPLO SE NECESITA EL 114% DE LA PISTA)
        return longitud * (factor - 1) //SE QUITA EL FACTOR 1 PARA QUE SÓLO QUEDE EL EXTRA DE LA PISTA NECESARIO, LUEGO PASARLO A METROS Y PODER PONERLO EN EL DESGLOSE FINAL 
}

//FUNCION PARA EVALUAR SI LA PISTA QUE INGRESAMOS ES SUFICIENTE PARA EL DESPEGUE CON LAS CONDICIONES INGRESADAS
function esPistaSuficiente (longitudRequerida, pistaDisponible) {
    if (pistaDisponible >= longitudRequerida)
        return "La pista cumple con la longitud para el despegue."
    return "La pista no cumple con la longitud. No se puede despegar."
}

//LA BIENVENIDA CON ALERT Y DETALLES 
alert ("Bienvenido al simulador de performance de despegue para los aviones comerciales")

//MOSTRAR AVIONES DISPONIBLE Y PASAR LA OPCION DEL USUARIO AL INDICE PARA SABER CUAL OPCION ELIGIÓ
let seleccion = prompt(mostrarModelos(aviones))
let indice = parseInt(seleccion)
const avionSeleccionado = aviones[indice]

//PROMP PARA QUE EL USUARIO PUEDA INGRESAR LAS VARIABLES DEL AVION Y LA PISTA
let peso = parseInt(prompt("Ingresar el peso actual del avion en KG, por ejemplo: un A320 full carga suele pesar 78000KG"))
let temperatura = parseInt(prompt("Ingrese la temperatura ambiente en °C (La temperatura se toma en consideración a partir de los 30°C)."))
let altitud = parseInt(prompt("Ingrese la altitud del aereopuerto sobre el nivel del mar del cual despegará el avion(EJ: el aereopuerto comercial mas alto está aprox a 4000M sobre nivel de mar"))
let pistaDisponible = parseInt(prompt("Ingresa la longitud de la pista en la cual quieres que despegue el avion (EJ: suelen ir desde los 1500M de longitud a los 4000M)"))

//CLCULOS INDIVIDUALES, CADA EXTRA SE CALCULA SOBRE LA PISTA BASE PARA CADA MODELO DE AVION
let base = avionSeleccionado.longitudBase
let ajustePeso = ajustarPorPeso(base, peso)
let ajusteTemperatura = ajustarPorTemperatura(base, temperatura)
let ajusteAltitud = ajustePorAltitud(base, altitud)
let longitudRequerida = base + ajustePeso + ajusteTemperatura + ajusteAltitud

alert("El avion " + avionSeleccionado.modelo + " necesita aproximadamente " + Math.round(longitudRequerida) + " metros para despegar ")
alert(esPistaSuficiente(longitudRequerida, pistaDisponible))

let mensajeFinal = "Desglose de los calculos:\n" +
                    "-Modelo selecionado:" + avionSeleccionado.modelo + "\n" +
                    "-Pista base minima para el modelo seleccionado: " + base + "m \n" +
                    "-Ajuste por peso: (" + peso + "Kg) " + Math.round(ajustePeso) + "m\n"+
                    "-Ajuste por temperatura: (" + temperatura + "°C): " + Math.round(ajusteTemperatura) + "m\n"+
                    "-Ajuste por altitud: (" + altitud + " m): " + Math.round(ajusteAltitud) + "m\n"+
                    "-Longitud final necesaria: " + Math.round(longitudRequerida) + "m\n"+
                    "-Pista disponible ingresada: " + pistaDisponible + "m"

alert(mensajeFinal)
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda ={
    moneda:'',
    criptomoneda:'',
}

//crear un promise 
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
})


document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCriptomonedas (){
    const url = 'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD'

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCtiptomonedas(criptomonedas))

}

function selectCtiptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    
}


function submitFormulario(e){
    e.preventDefault();

    //validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios')
        return
    }

    //Consultar la API con los resultados
    consultarAPI();
}


function mostrarAlerta(msg){

    const existeError = document.querySelector('.error')

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        //mensaje de error
        divMensaje.textContent = msg;

        formulario.appendChild(divMensaje);

        setTimeout(() =>{
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI(){

    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })

}


function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();
    
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML =  `El precio es: <span> ${PRICE}</span>`;
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio mas alto del día<span>${HIGHDAY}</span></p>`; 
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio mas bajo del día<span>${LOWDAY}</span></p>`; 
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variacion ultimas 24 horas <span>${CHANGEPCT24HOUR}</span></p>`;
    
    const ultimasActualizacion = document.createElement('p');
    ultimasActualizacion.innerHTML = `<p> Ultimas actualizaciones <span>${LASTUPDATE}</span></p>`; 
    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto); 
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimasActualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}
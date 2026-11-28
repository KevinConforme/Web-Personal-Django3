let tableroDatos = [];
let mina = 10;
let totalFila = 8;
let totalColumna = 8;
let juegoTerminado = false;
let juegoIniciado = false;
let conBandera = mina;
let time = 0;
let intervaloTime = null;
const tablero = document.getElementById("tablero");
const marcadorBadnera = document.getElementById("contador-banderas");
const btnReiniciar = document.getElementById("reiniciar");
const tiempo = document.getElementById("time");
const mejorTime = document.getElementById("mejor-time");
const modo = document.getElementById("modo");
//evaluamos el modo escoger para crear el tablero respectivo
modo.addEventListener('change', () =>{
	switch(Number(modo.value)){
		case 8:
			crearTablero(8, 8);
			break;
		case 16:
			crearTablero(16, 16);
			break;
		case 24:
			crearTablero(16, 24);
			break;
	}
});

function crearTablero(f, c){
	juegoIniciado = false;
	juegoTerminado = false;
	tablero.classList.remove("bloqueado");
	reiniciarTime();
	modo.disabled = false;
	conBandera = mina;
	totalFila = f;
	totalColumna = c;
	tablero.innerHTML = '';
	tableroDatos = [];
	tablero.style.gridTemplateColumns = `repeat(${c}, 36px)`;
		//recorremos un arreglo con los parametros ingresado
		for(let fila=0; fila<f; fila++){
			//guardamos cuantas filas creamos
			tableroDatos [fila] = [];
			for(let columna=0; columna<c; columna++){
				//guardamos cuantas filsa y columnas creamos
				tableroDatos [fila][columna] = 0;
				//creamos los div necesario para el tablero 
				const celda = document.createElement("div");
				celda.className = "celda";
				celda.dataset.r = fila;
				celda.dataset.c = columna;	
				//le agregamos eventos a cada celda
				celda.addEventListener("click", descubrirCelda);
				celda.addEventListener("contextmenu", bandera);
				tablero.appendChild(celda);	
		}
	}
//llamos las funciones a usar
colocarMinas(f, c);
actualizaBandera();
calcularNumero(f, c);
mejorTiempo();
//mostamos por consola para verificar que todo salga correcto
console.table(tableroDatos);
console.log("💣: ", mina);
console.log("🚩: ", conBandera);
}

function colocarMinas(f, c){
	let colocadas = 0;
	//validamos cual es el modo para crear las minas respectivas
	if (Number(modo.value) === 8){
		mina = 10;
	}else if(Number(modo.value) === 16){
		mina = 40;
	}else if(Number(modo.value) === 24 ){
		mina = 65;
	}
	conBandera = mina;
	//colocamos las minas de forma aleatoria
	while(colocadas < mina){
		const fila = Math.floor(Math.random() * f);
		const columna = Math.floor(Math.random() * c);
		if(tableroDatos[fila][columna] !== '💣'){
			tableroDatos[fila][columna] = '💣';
			colocadas++;
		}
	}
}

function calcularNumero(f, c){
	//recorremos el array para saber donde estas las minas
	for(let fila=0; fila<f; fila++){
		for(let columna=0; columna<c; columna++){
			if(tableroDatos[fila][columna] === '💣')
				continue;
			let contador = 0;
			//recorremos el array de las 8 celdas vecinas 
			for(let filas=-1; filas<=1; filas++){
				for(let columnas=-1; columnas<=1; columnas++){
					if(filas === 0 && columnas === 0)continue;
					const mf = fila+filas, mc = columna+columnas;
					//contamos cuantas minas tenemos en las 8 posiciones vecinas
					if(mf>=0 && mf<f && mc>=0 && mc<c && tableroDatos[mf][mc] === '💣') {contador++;}
				}
			}
			//colocamos los numero correspondinte en el array 
			tableroDatos[fila][columna] = contador;
		}
	}
}

function mostrar(f, c){
	//verifica las celdas que ya han sido mostrada
	const el = tablero.querySelector(`.celda[data-r="${f}"][data-c="${c}"]`);
	if(!el || el.classList.contains("revelada"))return;
	//evitar abrir casillas con bamdera '🚩'
	if(el.textContent === '🚩')return;
	el.classList.add("revelada");
	//asignamos la posicion a valor y agregamos la clase revelada 
	const valor = tableroDatos[f][c];
	//comparamos para saber si es mina o 0 para cambiar el 0 por espacio vacio
	if(valor === '💣'){
		juegoTerminado = true;
		juegoIniciado = false;
		modo.disabled = false;
        revelarMinas();
		requestAnimationFrame(() => { setTimeout(()=>{alert("💥 !Perdiste¡ pisaste una mina 💀");},250);});
		clearInterval(intervaloTime);
		intervaloTime = null;
		return;
    }
		//mostramos numeros y cambiamos los 0 por espacios vacios
        el.textContent = valor === 0 ? "" : valor;
        el.classList.add(`number-${valor}`);
}
function descubrirCelda(e){
	if(juegoTerminado)return;
	const celda = e.target.closest(".celda");	
	if(!celda)return;
	if(!juegoIniciado){
		juegoIniciado = true;
		iniciarTime();
		modo.disabled = true;
	}
	const fila = Number(celda.dataset.r);
	const columna = Number(celda.dataset.c);
	const valor = tableroDatos[fila][columna];
	//llamamos la funcion mostrar 
	mostrar(fila, columna);
	if(juegoTerminado)return;
	//comparamos para descubrir las celdas vacias
	if(valor === 0){
		descubrirVacias(fila, columna);
	}
	if(!juegoTerminado && verificarWin()){
		juegoTerminado = true;
		juegoIniciado = false;
		modo.disabled = false;
		requestAnimationFrame(() => {(setTimeout(()=>{alert("🏆 !Ganaste¡ Superaste este Nivel 🏅");},250));});
		clearInterval(intervaloTime);
		intervaloTime = null;
	}
}

function descubrirVacias(f, c){
	//comparamos los 8 vecinos
	for(let filas=-1; filas<=1; filas++){
		for(let columnas=-1; columnas<=1; columnas++){
			//comparamos la posicion y la saltamos con continue
			if(filas === 0 && columnas === 0) continue;
				const mf = f+filas, mc = c+columnas;
				//verificamos limites del tablero
			    if(mf<0 || mf>=totalFila || mc<0 || mc>=totalColumna)continue;
				const laVecina = tablero.querySelector(`.celda[data-r="${mf}"][data-c="${mc}"]`);
				const valorVecina = tableroDatos[mf][mc];
				//verificamos si es mina o revelada y la saltamos
				if(!laVecina || laVecina.classList.contains("revelada") || valorVecina === '💣')continue;
				//revelamos la vecina
				mostrar(mf, mc);
				//si la vecina vale 0 se sigue revelando
				if(valorVecina === 0){
					descubrirVacias(mf, mc);
				}
		}
	}
}

function revelarMinas(){
	for(let fila=0; fila<totalFila; fila++){
		for(let columna=0; columna<totalColumna; columna++){
			if(tableroDatos[fila][columna] === '💣'){
				//buscamos las demas minas en el tablero
				const celda = tablero.querySelector(`.celda[data-r="${fila}"][data-c="${columna}"]`);
				celda.classList.add("mina");
				celda.textContent = '💣';
			}
		}
	}
juegoTerminado = true;
tablero.classList.add("bloqueado");
}

function verificarWin(){
	const victoria = (totalFila*totalColumna)-mina;
	let conRevelada =0;
	for(let fila=0; fila<totalFila; fila++){
		for(let columna=0; columna<totalColumna; columna++){
			const celda = tablero.querySelector(`.celda[data-r="${fila}"][data-c="${columna}"]`);
			if(celda.classList.contains("revelada") && !(tableroDatos[fila][columna] === '💣'))conRevelada++;
		}
	}if (conRevelada === victoria){
		tablero.classList.add("bloqueado");
		guardarTiempo(time);
		return true;
	}
	return false;
}

function bandera(e){
	e.preventDefault();
	if(juegoTerminado)return;
	if(!juegoIniciado){
		juegoIniciado = true;
		iniciarTime();
		modo.disabled = true;
	}
	const celda = e.target.closest(".celda") || e.target;
	if(!celda || celda.classList.contains("revelada"))return;
	if(celda.textContent === '🚩' ){
		celda.textContent = '';
		conBandera++;
		actualizaBandera();
		return;
	}
	if(conBandera > 0){
		celda.textContent = '🚩';
		conBandera--;
		actualizaBandera();
	}
}

function actualizaBandera(){
	if(marcadorBadnera){
		marcadorBadnera.textContent = conBandera;
	}

}

function iniciarTime(){
	if(intervaloTime)return;
	intervaloTime = setInterval(() => {
		time++;
		if(tiempo) tiempo.textContent = formatearTime(time);
	}, 1000);
}

function formatearTime(seg){
	const minuto = String(Math.floor(seg/60)).padStart(2, "0");
	const s = String(seg % 60).padStart(2, "0");
	return `${minuto}:${s}`;
}

function reiniciarTime(){
	clearInterval(intervaloTime);
	intervaloTime = null;
	time = 0;
	if(tiempo) tiempo.textContent = "00:00";
}

function tiempoModo(){
	return `buscaminas_mejor_tiempo_${modo.value}`;
}

function mejorTiempo(){
	if(!mejorTime) return;
	const record = localStorage.getItem(tiempoModo());
	mejorTime.textContent= record ? formatearTime(Number(record)) : "--:--";
}

function guardarTiempo(mejorSegundos){
	const clave = tiempoModo();
	const recordTime = localStorage.getItem(clave);
	if(!recordTime || mejorSegundos < Number(recordTime)){
		localStorage.setItem(clave, String(mejorSegundos));
		mejorTiempo();
	}
}
crearTablero(8, 8);
//boton para reiniciar el tablero dependiendo del tipo de dificultad
btnReiniciar.addEventListener("click", () => crearTablero(totalFila, totalColumna));

/* GLOSARIO
filas y columnas / es para el desplasamiento 
fila y columna / es para crear el array 
f y c / son los valores para creacion del tablero
mf y mc / son para marcar la pisicion de las filas y columnas
*/

const celdas = document.querySelectorAll('.tablero-div');
let turnoX = true;
let estadoX = {ganadas: 0, perdidas: 0};
let estadoO = {ganadas: 0, perdidas: 0};

const inputX = document.getElementById('nombreX');
const inputO = document.getElementById('nombreO');
const ganaX = document.getElementById('ganadasX');
const pierdeX = document.getElementById('perdidasX');
const ganaO = document.getElementById('ganadasO');
const pierdeO = document.getElementById('perdidasO');
const panelX = document.getElementById('panelX');
const panelO = document.getElementById('panelO');
const lineaGanadora = document.getElementById('lineaGanadora');
const btnX = document.getElementById('btnX');
const btnO = document.getElementById('btnO');

const combinacionesGanadoras = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];

const estilosLinea = [
    { top: '48px', left: '0', width: '302px', transform: 'none' },
    { top: '150px', left: '0', width: '302px', transform: 'none' },
    { top: '252px', left: '0', width: '302px', transform: 'none' },
    { top: '0', left: '48px', width: '302px', transform: 'rotate(90deg)' },
    { top: '0', left: '150px', width: '302px', transform: 'rotate(90deg)' },
    { top: '0', left: '252px', width: '302px', transform: 'rotate(90deg)' },
    { top: '0', left: '0', width: '427px', transform: 'rotate(45deg)' },
    { top: '0', left: '302px', width: '427px', transform: 'rotate(135deg)' }
];

function actualizarTurno() {
    if (turnoX) {
        panelX.classList.add('activo');
        panelO.classList.remove('activo');
        btnX.classList.add('seleccionado');
        btnO.classList.remove('seleccionado');
    } else {
        panelO.classList.add('activo');
        panelX.classList.remove('activo');
        btnO.classList.add('seleccionado');
        btnX.classList.remove('seleccionado');
    }
}

function cambiarTurnoInicial(esX) {
    const tableroVacio = Array.from(celdas).every(celda => celda.textContent === '');
    if (!tableroVacio) {
        alert("No puedes cambiar quién empieza con una partida en curso. Termina o reinicia el juego.");
        return;
    }
    turnoX = esX;
    actualizarTurno();
}

actualizarTurno();

celdas.forEach(celda =>{
    celda.addEventListener('click',()=>{
        if (celda.textContent === ''){
            const jugador = turnoX ? 'X' : 'O';
            celda.textContent = jugador;
            celda.classList.add(jugador);

            const indiceGanador = obtenerIndiceGanador();
            if (indiceGanador !== -1){
                const nombreGanador = turnoX ? inputX.value : inputO.value;
                
                mostrarLinea(indiceGanador);

                if (turnoX){
                    estadoX.ganadas++;
                    estadoO.perdidas++;
                }else{
                    estadoX.perdidas++;
                    estadoO.ganadas++;
                }
                actualizarMarcador();

                setTimeout(() => {
                    alert(`¡El GANADOR es.. ${nombreGanador}!`);
                    reiniciarJuego();
                }, 350);
                return;
            }

            if (verificarEmpate()){
                setTimeout(() => {
                    alert('¡Empate!');
                    reiniciarJuego();
                }, 100);
                return;
            }

            turnoX = !turnoX;
            actualizarTurno();
        }
    });
});

function obtenerIndiceGanador(){
    for (let i = 0; i < combinacionesGanadoras.length; i++) {
        const [a, b, c] = combinacionesGanadoras[i];
        if (celdas[a].textContent && 
            celdas[a].textContent === celdas[b].textContent &&
            celdas[a].textContent === celdas[c].textContent) {
            return i;
        }
    }
    return -1;
}

function mostrarLinea(indice) {
    const estilo = estilosLinea[indice];
    lineaGanadora.style.top = estilo.top;
    lineaGanadora.style.left = estilo.left;
    lineaGanadora.style.transform = estilo.transform;
    lineaGanadora.style.width = estilo.width;
}

function verificarEmpate(){
    return Array.from(celdas).every(celda => celda.textContent !== '');
}

function actualizarMarcador(){
    ganaX.textContent = estadoX.ganadas;
    pierdeX.textContent = estadoX.perdidas;
    ganaO.textContent = estadoO.ganadas;
    pierdeO.textContent = estadoO.perdidas;
}

function reiniciarJuego(){
    celdas.forEach(celda => {
        celda.textContent = '';
        celda.classList.remove('X', 'O');
    });
    lineaGanadora.style.width = '0';
    actualizarTurno();
}

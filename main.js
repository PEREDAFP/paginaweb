import { conexionFirebase } from './conexion.js';
import { cargaDatosEnElemento } from './controlDelDOM.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCkxoRCkM2uzkOrbYHt3Fd1pv4PxjhZG_Y',
  authDomain: 'jefaturaies-f7a16.firebaseapp.com',
  databaseURL: 'https://jefaturaies-f7a16.firebaseio.com',
  projectId: 'jefaturaies-f7a16',
  storageBucket: 'jefaturaies-f7a16.appspot.com',
  messagingSenderId: '476807907910',
  appId: '1:476807907910:web:7517878cb8e1b287d3d847',
};

const dataBase = new conexionFirebase(firebaseConfig);

// El worker que controla el cambio de sesiones y el tiempo entre ellas
const controlaSesion = new Worker('./controlasesion.js');
controlaSesion.addEventListener('message', (dato) => {
  // Hacemos algo con la hora que nos envía el worker
  console.log('REcibido: ', dato.data.horainicio);
  console.log('Recibido desde el worker');
  // Si hay un error es que se ha parado el control de sesiones....
});

dataBase.leeSesiones() // ESperamos a la promesa de la lectura de Sesiones y lanzamos el mensaje al Worker
  .then((listaSesiones) => {
    controlaSesion.postMessage({ sesiones: listaSesiones });
    for (const i of listaSesiones) {
      cargaDatosEnElemento('selectSesiones', 'option', `${i.sesion}-${i.horainicio}:${i.minutoinicio}`);
    }
  });

cargaDatosEnElemento('profesoresGuardia', 'li', 'profe1', true);
cargaDatosEnElemento('profesoresGuardia', 'li', 'profe2', true);
cargaDatosEnElemento('profesoresGuardia', 'li', 'profe3', false);

/* funciones de prueba
function hola(id,dato){
  console.log(id);
  console.log(dato.nombre);
  console.log(dato.apellidos);
};

function paraAvisos(id, dato){
  console.log(id);
  console.log(dato.fecha);
  console.log(dato.profesor);
  console.log(dato.evento);
} */
// Fin funciones de prueba que quitaremos del proyecto
//  TODO  crearemos un workers para que vaya actualizando

// Obtenemos la hora, creamos el worker y le pasamos el objeto de la hora

// Leeremos las sesiones desde Firebase, no es posible

/*
dataBase.leeProfesoresID('-M7YlOZS6nWL41TvPWcs',hola);
console.log(dataBase.devuelveSesiones());
*/
// dataBase.leeAvisos(paraAvisos);

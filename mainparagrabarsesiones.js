import {conexionFirebase} from './conexion.js';

function obtenerHora(){
  const tiempo = new Date();
  const diaSemana = tiempo.getDay();
  const hora = tiempo.getHours()
  const minutos = tiempo.getSeconds();
  return { hora: hora, minutos: minutos, dia: diaSemana};
}

const firebaseConfig = {
  apiKey: "AIzaSyCkxoRCkM2uzkOrbYHt3Fd1pv4PxjhZG_Y",
  authDomain: "jefaturaies-f7a16.firebaseapp.com",
  databaseURL: "https://jefaturaies-f7a16.firebaseio.com",
  projectId: "jefaturaies-f7a16",
  storageBucket: "jefaturaies-f7a16.appspot.com",
  messagingSenderId: "476807907910",
  appId: "1:476807907910:web:7517878cb8e1b287d3d847"
};

const dataBase = new conexionFirebase(firebaseConfig);


let listaSesiones=[]
let horas = [[12,30,12,35],[12,35,12,40],[12,40,12,45],[12,45,12,50],[12,50,12,55],[12,55,13,0],];

dataBase.borraSesiones();

let sesion = 0;
for (let dia = 0; dia <7; dia++){
   sesion = 0;
    for (let i of horas) {
          dataBase.anadeSesiones({dia:dia,sesion:sesion,horainicio:i[0],minutoinicio:i[1], horafin:i[2] ,minutofin:i[3]});
          sesion++;

    }
  };

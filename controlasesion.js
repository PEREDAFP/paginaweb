function convierteHoraAnumero(hora, minuto) {
  return hora * 60 + minuto;
}

function calculaTiempoSiguiente(actual, siguiente, milisegundos = 1000) {
  // multiplicamos las horas por 60 * 60 para hallar los segundos
  const diferenciaentrehoras = 60 * 60 * (siguiente.hora - actual.hora);
  const diferenciaentreminutos = 60 * (siguiente.minuto - actual.minuto);
  return ((diferenciaentrehoras + diferenciaentreminutos) * milisegundos);
}

function dameLoEnMinutos(milisegundos) {
  return (milisegundos / 1000) / 60;
}

function obtenerHoraSistema() {
  const tiempo = new Date();
  return { dia: tiempo.getDay(), hora: tiempo.getHours(), minuto: tiempo.getMinutes() };
}

class SesionClase {
  constructor(listaSesiones) {
    // TODO cambiarlo a definición de objetos con ..
    const hora = obtenerHoraSistema();
    this.sesion = 0;
    this.error = 0;
    this.hora = hora.hora;
    this.minuto = hora.minuto;
    this.dia = hora.dia;
    this.tiempo = 0;
    this.sesiones = listaSesiones.filter((a) => a.dia === hora.dia).sort((a, b) => a.sesion - b.sesion);
  }

  iniciarSesion() {
    try {
      // Obtenemos la sesión en la que nos encontramos al inicio
      this.sesion = this.sesiones
        .filter((a) => (
          convierteHoraAnumero(this.hora, this.minuto) >= convierteHoraAnumero(a.horainicio, a.minutoinicio)
            && convierteHoraAnumero(this.hora, this.minuto) <= convierteHoraAnumero(a.horafin, a.minutofin)
        ))[0].sesion;

      this.tiempo = calculaTiempoSiguiente(
        { hora: this.hora, minuto: this.minuto },
        { hora: this.sesiones[this.sesion].horafin, minuto: this.sesiones[this.sesion].minutofin },
      );
    } catch {
      // No hay sesión, nos hemos salido del array o hay algún problema para el caso es lo mismo
      this.error = -1;
    }
  }

  siguienteSesion() {
    try {
      this.sesion++;
      this.tiempo = calculaTiempoSiguiente(
        { hora: this.sesiones[this.sesion].horainicio, minuto: this.sesiones[this.sesion].minutoinicio },
        { hora: this.sesiones[this.sesion].horafin, minuto: this.sesiones[this.sesion].minutofin },
      );
      console.log('Sesión siguiente:', this.sesiones[this.sesion]);
    } catch {
      this.sesionActual.error = -1;
      this.tiempo = 0;
    }
  }

  get tiempoHastaFinSesion() {
    return this.tiempo;
  }

  get sesionActual() {
    if (this.error !== 0) {
      return { error: this.error };
    }
    return {
      error: this.error, horainicio: this.sesiones[this.sesion].horainicio, horafin: this.sesiones[this.sesion].horafin, dia: this.dia,
    };
  }
} // Fin definición de clase sesión

self.addEventListener('message', (dato) => {
  // Leemos los datos que nos envía main
  const sesion = new SesionClase(dato.data.sesiones);

  sesion.iniciarSesion();
  if (sesion.error !== 0) {
    console.log('Se terminó');
  } else {
    // Enviaremos la sesión de inicio a main
    self.postMessage(sesion.sesionActual);
    // Lanzamos nuestro cron particular
    let temporizador = setTimeout(function controlaSesion() {
      sesion.siguienteSesion();
      self.postMessage(sesion.sesionActual);
      console.log('Vamos');
      if (sesion.error !== 0) {
        temporizador = () => { console.log('Se ha terminado'); }; // Al llegar aquí la función se lanzará este temporizador y FIN...
      } else {
        console.log('Lanzamos siguiente hasta: ', dameLoEnMinutos(sesion.tiempoHastaFinSesion));
        temporizador = setTimeout(controlaSesion, sesion.tiempoHastaFinSesion); // Volvemos a cargar el temporizador con la siguiente sesión...
      }
    }, sesion.tiempoHastaFinSesion);
  }
});

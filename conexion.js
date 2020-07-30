export class conexionFirebase {
  constructor(Config) {
    firebase.initializeApp(Config);
    this.conexion = firebase.database();
    this.refProfesores = this.conexion.ref('profesores');
    this.refAvisos = this.conexion.ref('avisos');
    this.refSesiones = this.conexion.ref('sesiones');
  }

  // CRUD de la base de datos...cuando pasamos un cb es un callback para realziar distintas acciones DOM
  anadeProfesores(data) {
    this.refProfesores.push(data);
  }

  anadeAvisos(data) {
    this.refAvisos.push(data);
  }

  borraProfesores(id) {
    this.refProfesores.child(id).remove();
  }

  borrarAvisos(id) {
    this.refAvisos.child(id).remmove();
  }

  leeProfesoresID(id, cb) {
    this.refProfesores.child(id).once('value')
      .then((data) => {
        const datos = data.val() || {};
        cb(id, data.val());
      });
  }

  leeAvisos(cb) {
    this.refAvisos.on('child_added', (data) => {
      cb(data.key, data.val());
    });
  }

  borraSesiones() {
    this.refSesiones.remove();
  }

  anadeSesiones(sesion) {
    this.refSesiones.push(sesion);
  }

  leeSesiones() {
    return this.refSesiones.once('value')
      .then((data) => Object.values(data.val() || {}))
      .catch((err) => { console.log('Error en leeSesiones'); });
  }
} // Fin de conexionFirebase

const URL_DATOS = "datos.json";

let datos = [];

async function cargarDatos() {
  try {
    const res = await fetch(URL_DATOS);
    datos = await res.json();

    const departamentos = [...new Set(datos.map(d => d.departamento))];
    const dptoSelect = document.getElementById('departamento');
    dptoSelect.innerHTML = '<option value="">Seleccione...</option>';
    departamentos.forEach(dep => {
      const opt = document.createElement('option');
      opt.value = dep;
      opt.textContent = dep;
      dptoSelect.appendChild(opt);
    });
  } catch (error) {
    alert("Error cargando datos desde el archivo JSON.");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", cargarDatos);

document.getElementById('departamento').addEventListener('change', function () {
  const dep = this.value;
  const aliados = [...new Set(datos.filter(d => d.departamento === dep).map(d => d.aliado))];

  const aliadoSelect = document.getElementById('aliado');
  aliadoSelect.innerHTML = '<option value="">Seleccione...</option>';
  aliadoSelect.disabled = false;

  aliados.forEach(aliado => {
    const opt = document.createElement('option');
    opt.value = aliado;
    opt.textContent = aliado;
    aliadoSelect.appendChild(opt);
  });

  const punto = document.getElementById('punto');
  punto.innerHTML = '<option value="">Seleccione...</option>';
  punto.disabled = true;
});

document.getElementById('aliado').addEventListener('change', function () {
  const dep = document.getElementById('departamento').value;
  const aliado = this.value;
  const puntos = datos.filter(d => d.departamento === dep && d.aliado === aliado).map(d => d.punto);

  const puntoSelect = document.getElementById('punto');
  puntoSelect.innerHTML = '<option value="">Seleccione...</option>';
  puntoSelect.disabled = false;

  puntos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    puntoSelect.appendChild(opt);
  });
});
// ✅ Reemplaza esta URL con la URL de tu aplicación web
const URL_API = "https://script.google.com/macros/s/AKfycbyMP2zG5Rtb2fTAS-tlE0iRFrmnoXbKHpYcGPYGH_HkiIgT5s2g5DCfUGleY1HIQCYa/exec"; // tu URL completa aquí

let datos = [];

// 🔄 Cargar datos desde la API (departamento, aliado, punto)
async function cargarDatos() {
  try {
    const res = await fetch(URL_API);
    if (!res.ok) throw new Error("Error HTTP al cargar datos");

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
    console.error("Error al cargar datos:", error);
    alert("Error al cargar opciones desde la base de datos.");
  }
}

// 🚀 Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarDatos);

// ▶️ Cambia aliados al seleccionar un departamento
document.getElementById('departamento').addEventListener('change', function () {
  const dep = this.value;
  const aliados = [...new Set(datos
    .filter(d => d.departamento === dep)
    .map(d => d.aliado))];

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

// ▶️ Cambia puntos al seleccionar un aliado
document.getElementById('aliado').addEventListener('change', function () {
  const dep = document.getElementById('departamento').value;
  const aliado = this.value;
  const puntos = datos
    .filter(d => d.departamento === dep && d.aliado === aliado)
    .map(d => d.punto);

  const puntoSelect = document.getElementById('punto');
  puntoSelect.innerHTML = '<option value="">Seleccione...</option>';
  puntoSelect.disabled = false;

  puntos.forEach(pv => {
    const opt = document.createElement('option');
    opt.value = pv;
    opt.textContent = pv;
    puntoSelect.appendChild(opt);
  });
});

// 📤 Enviar formulario y guardar en hoja "Respuestas"
document.getElementById('formulario').addEventListener('submit', async function (e) {
  e.preventDefault();

  const datosFormulario = Object.fromEntries(new FormData(this).entries());

  try {
    const res = await fetch(URL_API, {
      method: "POST",
      body: JSON.stringify(datosFormulario),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const respuesta = await res.json();

    if (respuesta.status === "ok") {
      alert("✅ Datos enviados correctamente");
      this.reset();
      document.getElementById('aliado').innerHTML = '<option value="">Seleccione...</option>';
      document.getElementById('aliado').disabled = true;
      document.getElementById('punto').innerHTML = '<option value="">Seleccione...</option>';
      document.getElementById('punto').disabled = true;
    } else {
      alert("⚠️ Error al guardar los datos.");
    }
  } catch (err) {
    console.error("Error al enviar:", err);
    alert("❌ Fallo la conexión al guardar el formulario.");
  }
});
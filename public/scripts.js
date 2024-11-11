document.addEventListener("DOMContentLoaded", () => {
    
    document.querySelector(".tablinks").click();
    document.getElementById("Servicios").style.display = "block";
    generarCategorias();
    cargarMaterias();
    const searchForm = document.getElementById("searchForm");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = document.getElementById("search").value;

        fetch(`/search?query=${encodeURIComponent(query)}`)
            .then((response) => response.text())
            .then((html) => {
                document.getElementById("publicaciones-recientes").innerHTML = html;
            })
            .catch((error) => console.error("Error en la búsqueda:", error));
    });


    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = document.getElementById("search").value;

        // Determina el tipo de tab activo
        const activeTab = document.querySelector(".tablinks.active").textContent.trim().toLowerCase();
        const tipo = activeTab === "servicios" ? "ofrecer" : "solicitar";

        fetch(`/search?query=${encodeURIComponent(query)}&tipo=${tipo}`)
            .then((response) => response.text())
            .then((html) => {
                // Inserta el HTML de resultados en el tab correspondiente
                if (tipo === "ofrecer") {
                    document.getElementById("ultimas-ofrecer").innerHTML = html;
                } else if (tipo === "solicitar") {
                    document.getElementById("ultimas-solicitudes").innerHTML = html;
                }
            })
            .catch((error) => console.error("Error en la búsqueda:", error));
    });

    mostrarSeccion('general');
    fetchPublicacionesUsuario();
    generarOpcionesMaterias();
    cargarPublicacionesUsuario(); // Asegura que esta función esté definida
    cargarAgendamientosUsuario();
    // Lógica para el contenido dinámico y eventos de UI.
    // Mueve aquí las funciones relacionadas con eventos y solicitudes de datos.
});

// Ejemplo de función: abrir y cerrar formularios
function toggleForm() {
    const form = document.getElementById("publicarForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
}

// Función de ejemplo para abrir pestañas
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}



function toggleForm() {
    const form = document.getElementById("publicarForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
}

const categorias = ["Matemáticas", "Física", "Programación", "Idiomas", "Derecho", "Pedagogía", "Comunicación", "Administración", "Estadística", "Otros"];

function generarCategorias() {
    const listaCategorias = document.getElementById("categorias-lista");
    listaCategorias.innerHTML = ""; // Limpiamos la lista antes de agregar las categorías

    categorias.forEach(categoria => {
        const li = document.createElement("li");
        li.textContent = categoria;
        li.className = "categoria";
        li.addEventListener("click", () => filtrarPorCategoria(categoria));
        listaCategorias.appendChild(li);
    });
}


// Lista de materias
const materias = ["Matemáticas", "Física", "Programación", "Idiomas", "Derecho", "Pedagogía", "Comunicación", "Administración", "Estadística", "Otros"];

// Función para cargar las materias en el select
function cargarMaterias() {
    const selectMateria = document.getElementById("materia");
    selectMateria.innerHTML = ""; // Limpiar opciones previas

    // Agregar opción predeterminada
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona una materia";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectMateria.appendChild(defaultOption);

    // Agregar las materias
    materias.forEach(materia => {
        const option = document.createElement("option");
        option.value = materia;
        option.textContent = materia;
        selectMateria.appendChild(option);
    });
}



function verDetalles(publicacion) {
    const detallesContenido = document.getElementById("detallesContenido");
    detallesContenido.innerHTML = `
        <h3>${publicacion.tipo_servicio} - ${publicacion.materia}</h3>
        <p><strong>Publicado por:</strong> ${publicacion.user_data.name} ${publicacion.user_data.lastname}</p>
        <p><strong>Materia:</strong> ${publicacion.materia}</p>
        <p><strong>Tema:</strong> ${publicacion.tema_interes}</p>
        <p><strong>Fecha:</strong> ${new Date(publicacion.fecha_reunion).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> ${publicacion.hora}</p>
    `;
    const agendarButton = document.getElementById("agendarButton");
    agendarButton.onclick = function () {
        agendarServicio(publicacion.solicitud_id);
    };
    document.getElementById("verDetalles").style.display = "block";

}

function agendarServicio(solicitudId) {
    window.location.href = `/users/reservas/${solicitudId}`;
}

function filtrarPorCategoria(categoria) {
    fetch(`/api/publicaciones?categoria=${encodeURIComponent(categoria)}`)
        .then(response => response.json())
        .then(data => {
            const listaPublicaciones = document.getElementById("publicaciones-lista");
            const resultadosTitulo = document.getElementById("resultadosTitulo");

            // Limpia la lista antes de agregar las publicaciones filtradas
            listaPublicaciones.innerHTML = "";

            if (data.length > 0) {
                // Muestra el título si hay resultados
                resultadosTitulo.style.display = "block";

                data.forEach(publicacion => {
                    const div = document.createElement("div");
                    div.className = "publicacion-container";

                    const titulo = document.createElement("h3");
                    titulo.textContent = publicacion.tipo_servicio === "solicitar"
                        ? `Solicitud ${publicacion.materia}`
                        : `Asesoría ${publicacion.materia}`;

                    const info = document.createElement("p");
                    info.textContent = `Fecha: ${new Date(publicacion.fecha_reunion).toLocaleDateString('es-ES')}`;

                    const tema = document.createElement("p");
                    tema.textContent = `Tema: ${publicacion.tema_interes}`;

                    const botonDetalles = document.createElement("button");
                    botonDetalles.textContent = "Ver Detalles";
                    botonDetalles.className = "boton-detalles";
                    botonDetalles.onclick = function () {
                        verDetalles(publicacion);  // Llamada a la función para ver detalles
                    };

                    div.appendChild(titulo);
                    div.appendChild(info);
                    div.appendChild(tema);
                    div.appendChild(botonDetalles);

                    listaPublicaciones.appendChild(div);
                });
            } else {
                // Oculta el título si no hay resultados
                resultadosTitulo.style.display = "none";
                listaPublicaciones.innerHTML = "<p>No hay resultados para esta categoría.</p>";
            }
        })
        .catch(error => console.error("Error al obtener publicaciones por categoría:", error));
}


function cerrarDetalles() {
    document.getElementById("verDetalles").style.display = "none";
}



// scripts.js
document.getElementById('change-btn').addEventListener('click', function () {
    let paymentInput = document.getElementById('payment-input').value;
    document.getElementById('payment-display').textContent = paymentInput;
});
document.getElementById('schedule-btn').addEventListener('click', function () {
    const payment = document.getElementById('payment-display').textContent;
    if (!payment) {
        alert('Por favor, llene el campo de forma de pago.');
        return;
    }

    // Validar y formatear la fecha
    let fechaReunion = null;
    if (solicitud.fecha_reunion) {
        const parsedDate = new Date(solicitud.fecha_reunion);
        if (!isNaN(parsedDate)) {
            fechaReunion = parsedDate.toISOString().split('T')[0];
        } else {
            console.error('Fecha de reunión inválida:', solicitud.fecha_reunion);
            alert('Fecha de reunión inválida.');
            return;
        }
    } else {
        console.error('Fecha de reunión no proporcionada.');
        alert('Fecha de reunión no disponible.');
        return;
    }

    // Hacer la solicitud de reserva
    fetch('/reservas/agendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_data: user,
            tema: solicitud.tema_interes,
            fecha: fechaReunion,
            hora: solicitud.hora,
            tutor: solicitud.tutor,
            pago: payment,
            solicitud_id: solicitud.solicitud_id
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showConfirmationModal('Confirmación de agenda');
            } else if (data.error === 'already_scheduled') {
                showConfirmationModal('Ya has agendado este espacio');
            } else {
                showConfirmationModal('Error al agendar');
            }
        })
        .catch(error => console.error('Error al agendar:', error));
});

function showConfirmationModal(message) {
    const modal = document.createElement('div');
    modal.innerHTML = `<div class="confirmation-modal">
                        <h2>${message}</h2>
                        <button onclick="closeConfirmationModal()">Aceptar</button>
                      </div>`;
    document.body.appendChild(modal);
}


function closeConfirmationModal() {
    const modal = document.querySelector('.confirmation-modal');
    if (modal) {
        modal.remove();
    }
    window.location.href = "/dashboard";
}

const userId = '<%= user.id %>';
const password = '<%= user.password %>';

// Función para cargar publicaciones del usuario
function fetchPublicacionesUsuario() {
    fetch(`/api/publicaciones-usuario/${userId}`)
        .then(response => response.json())
        .then(async data => {
            const solicitadasContainer = document.getElementById('solicitadas');
            const ofrecidasContainer = document.getElementById('ofrecidas');

            data.forEach(async publicacion => {
                const div = crearElementoPublicacion(publicacion);
                if (publicacion.tipo_servicio === 'solicitar') {
                    solicitadasContainer.appendChild(div);
                } else {
                    ofrecidasContainer.appendChild(div);
                }
            });
        })
        .catch(error => console.error("Error al obtener las publicaciones del usuario:", error));
}

// Crear elementos de publicación
function crearElementoPublicacion(publicacion) {
    const div = document.createElement('div');
    div.classList.add('recuadro-publicacion');

    // Elementos de la publicación
    const titulo = document.createElement('h3');
    titulo.textContent = publicacion.tipo_servicio === 'solicitar' ? `Solicitud: ${publicacion.materia}` : `Oferta: ${publicacion.materia}`;

    const materia = document.createElement('p');
    materia.textContent = `Materia: ${publicacion.materia}`;

    const tema = document.createElement('p');
    tema.textContent = `Tema: ${publicacion.tema_interes}`;

    const fecha = document.createElement('p');
    fecha.textContent = `Fecha de reunión: ${formatDate(publicacion.fecha_reunion)}`;

    const agendaUsuarios = document.createElement('p');
    cargarUsuariosAgendados(publicacion.solicitud_id, agendaUsuarios);

    // Botones de edición y eliminación
    const editButton = crearBotonEdicion(publicacion);
    const deleteButton = crearBotonEliminacion(publicacion, div);

    // Añadir elementos al contenedor
    div.append(titulo, materia, tema, fecha, agendaUsuarios, editButton, deleteButton);
    return div;
}

// Formatear fecha
function formatDate(dateString) {
    const fechaReunion = new Date(dateString);
    return fechaReunion.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: '2-digit' });
}

// Cargar usuarios agendados para una publicación específica
async function cargarUsuariosAgendados(solicitudId, elemento) {
    try {
        const response = await fetch(`/api/agendas-publicacion/${solicitudId}`);
        const agendasData = await response.json();
        const usuariosAgendados = agendasData.map(agenda => `${agenda.user_data.name} ${agenda.user_data.lastname}`).join(', ');
        elemento.textContent = `Usuarios que han agendado: ${usuariosAgendados}`;
    } catch (error) {
        console.error("Error al obtener las agendas de la publicación:", error);
        elemento.textContent = "Error al obtener los usuarios que han agendado.";
    }
}

// Crear botón de edición
function crearBotonEdicion(publicacion) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => {
        document.getElementById('tipo').value = publicacion.tipo_servicio;
        document.getElementById('materia').value = publicacion.materia;
        document.getElementById('fecha').value = new Date(publicacion.fecha_reunion).toISOString().split('T')[0];
        document.getElementById('tema').value = publicacion.tema_interes;
        document.getElementById('editForm').action = `/api/publicacion/${publicacion.solicitud_id}`;
        openEditForm();
    });
    return editButton;
}

// Crear botón de eliminación
function crearBotonEliminacion(publicacion, div) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener('click', () => {
        showDeleteConfirmation();
        const confirmDeleteButton = document.querySelector("#modalContainer button:last-child");
        confirmDeleteButton.onclick = async () => {
            try {
                const response = await fetch(`/api/eliminar-publicacion/${publicacion.solicitud_id}`, { method: 'DELETE' });
                if (response.ok) {
                    div.remove();
                    mostrarMensajeExito("¡Publicación eliminada con éxito!");
                } else {
                    console.error("Error al intentar eliminar la publicación");
                }
            } catch (error) {
                console.error("Error en la solicitud de eliminación:", error);
            } finally {
                document.getElementById("modalContainer").style.display = "none";
            }
        };
    });
    return deleteButton;
}

// Mostrar mensaje de éxito al eliminar
function mostrarMensajeExito(mensaje) {
    const mensajeEl = document.getElementById('deleteSuccessMessage');
    mensajeEl.textContent = mensaje;
    mensajeEl.style.display = 'block';
    setTimeout(() => { mensajeEl.style.display = 'none'; }, 3000);
}

// Mostrar secciones del perfil
function mostrarSeccion(seccion) {
    const secciones = ['general', 'publicaciones', 'cambiarContrasena', 'cambiarCorreo', 'agendamientos'];
    secciones.forEach(sec => {
        const elem = document.getElementById(sec);
        const link = document.getElementById(`${sec}Link`);
        elem.style.display = sec === seccion ? 'block' : 'none';
        link.classList.toggle('active', sec === seccion);
    });
}

// Funciones para el manejo de formularios y modales
function openEditForm() {
    const editForm = document.getElementById("editarForm");
    editForm.style.display = editForm.style.display === "none" ? "block" : "none";
}

function showDeleteConfirmation() {
    document.getElementById("modalContainer").style.display = "block";
}

function closeEditForm() {
    document.getElementById('editarUsuarioForm').style.display = 'none';
}

// Validación de cambio de contraseña
document.getElementById("changePasswordForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword !== confirmPassword) {
        mostrarModalErrorContrasena();
    } else {
        this.submit();
    }
});

function mostrarModalErrorContrasena() {
    document.getElementById("modalErrorContrasena").style.display = "block";
}

function cerrarModalErrorContrasena() {
    document.getElementById("modalErrorContrasena").style.display = "none";
}

// Generar opciones de categorías en el select de materias
function generarOpcionesMaterias() {
    const selectMateria = document.getElementById("materia");
    selectMateria.innerHTML = "<option value='' disabled selected>Selecciona una materia</option>";
    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        selectMateria.appendChild(option);
    });
}

// Funciones para manejo de cuenta
function desactivarCuenta() {
    document.getElementById('modalDesactivarCuenta').style.display = 'flex';
}

function cancelarDesactivacion() {
    document.getElementById('modalDesactivarCuenta').style.display = 'none';
}

function confirmarDesactivacion() {
    fetch(`/users/deactivate/${userId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (response.ok) {
                document.getElementById('modalDesactivarCuenta').style.display = 'none';
                document.getElementById('modalConfirmacionDesactivacion').style.display = 'flex';
            } else {
                alert("Error al intentar desactivar tu cuenta. Por favor, intenta nuevamente más tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al intentar desactivar tu cuenta. Por favor, intenta nuevamente más tarde.");
        });
}

function redireccionarLogin() {
    window.location.href = '/users/login';
}

// Función para cargar las publicaciones del usuario
function cargarPublicacionesUsuario() {
    fetch(`/api/publicaciones-usuario/${userId}`)
        .then(response => response.json())
        .then(data => {
            const solicitadasContainer = document.getElementById('solicitadas');
            const ofrecidasContainer = document.getElementById('ofrecidas');

            // Limpiar contenedores
            solicitadasContainer.innerHTML = "";
            ofrecidasContainer.innerHTML = "";

            data.forEach(publicacion => {
                const div = document.createElement('div');
                div.className = "recuadro-publicacion";
                div.innerHTML = `
                        <h3>${publicacion.tipo_servicio === 'solicitar' ? 'Solicitud' : 'Oferta'}: ${publicacion.materia}</h3>
                        <p>Materia: ${publicacion.materia}</p>
                        <p>Tema: ${publicacion.tema_interes}</p>
                        <p>Fecha de reunión: ${new Date(publicacion.fecha_reunion).toLocaleDateString('es-ES')}</p>
                    `;
                if (publicacion.tipo_servicio === 'solicitar') {
                    solicitadasContainer.appendChild(div);
                } else {
                    ofrecidasContainer.appendChild(div);
                }
            });
        })
        .catch(error => console.error("Error al obtener las publicaciones del usuario:", error));
}


// Función para cargar los agendamientos del usuario
function cargarAgendamientosUsuario() {
    fetch(`/api/agendas-publicacion/${userId}`)
        .then(response => response.json())
        .then(data => {
            const agendamientosLista = document.getElementById('agendamientosLista');

            // Limpiar contenedor
            agendamientosLista.innerHTML = "";

            if (data.length === 0) {
                agendamientosLista.innerHTML = '<p>No se encontraron agendas.</p>';
            } else {
                data.forEach(agenda => {
                    const agendaItem = document.createElement('div');
                    agendaItem.className = 'agenda-item';

                    // Formato de fecha
                    const fechaFormateada = new Date(agenda.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    });

                    agendaItem.innerHTML = `
                            <p><strong>Tema:</strong> ${agenda.tema}</p>
                            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                            <p><strong>Tutor:</strong> ${agenda.tutor}</p>
                            <p><strong>Pago:</strong> ${agenda.pago}</p>
                            <p><strong>Hora:</strong> ${agenda.hora}</p>
                        `;
                    agendamientosLista.appendChild(agendaItem);
                });
            }
        })
        .catch(error => console.error('Error fetching profile agendamientos:', error));
}


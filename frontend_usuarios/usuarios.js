const API_URL = "http://localhost:3000/api/usuarios";

let usuariosCargados = [];


// ======================================================
// MENSAJES
// ======================================================

function mostrarMensaje(texto, tipo = "info") {
    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = texto;
    mensaje.className = tipo;
}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ======================================================
// GET - LISTAR USUARIOS
// ======================================================

async function listarUsuarios() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible consultar los usuarios."
            );
        }

        const datos = await respuesta.json();

        usuariosCargados = datos.usuarios;

        mostrarUsuarios(usuariosCargados);

        return true;

    } catch (error) {
        console.error(error);

        mostrarMensaje(
            "Error al consultar los usuarios.",
            "error"
        );
        return false;
    }
}


// ======================================================
// MOSTRAR USUARIOS EN TABLA
// ======================================================

function mostrarUsuarios(lista) {
    const cuerpoTabla =
        document.getElementById("cuerpoTabla");

    const totalUsuarios =
        document.getElementById("totalUsuarios");

    totalUsuarios.textContent =
        `Total usuarios: ${lista.length}`;

    if (lista.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="7" class="sin-resultados">
                    No hay usuarios para mostrar.
                </td>
            </tr>
        `;

        return;
    }

    let filas = "";

    lista.forEach(usuario => {
        filas += `
            <tr>

                <td>
                    ${usuario.id}
                </td>

                <td>
                    ${escaparHTML(usuario.nombre)}
                </td>

                <td>
                    ${escaparHTML(usuario.apellido)}
                </td>

                <td>
                    ${escaparHTML(usuario.correo)}
                </td>

                <td>
                    ${escaparHTML(usuario.telefono)}
                </td>

                <td>
                    ${escaparHTML(usuario.rol)}
                </td>

                <td>
                    <div class="acciones-tabla">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="cargarUsuario(${usuario.id})"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn-eliminar"
                            onclick="eliminarUsuario(${usuario.id})"
                        >
                            Eliminar
                        </button>

                    </div>
                </td>

            </tr>
        `;
    });

    cuerpoTabla.innerHTML = filas;
}


// ======================================================
// GET - BUSCAR USUARIO POR ID
// ======================================================

async function buscarUsuarioPorId() {
    const id =
        document
            .getElementById("buscarId")
            .value
            .trim();

    if (!id) {
        mostrarMensaje(
            "Ingrese un ID para realizar la búsqueda.",
            "error"
        );

        return;
    }

    try {
        const respuesta =
            await fetch(`${API_URL}/${id}`);

        if (respuesta.status === 404) {
            mostrarUsuarios([]);

            mostrarMensaje(
                "Usuario no encontrado.",
                "error"
            );

            return;
        }

        if (!respuesta.ok) {
            throw new Error(
                "Error al buscar el usuario."
            );
        }

        const usuario =
            await respuesta.json();

        mostrarUsuarios([usuario]);

        mostrarMensaje(
            "Usuario encontrado.",
            "exito"
        );

    } catch (error) {
        console.error(error);

        mostrarMensaje(
            "Error al buscar el usuario.",
            "error"
        );
    }
}


// ======================================================
// GUARDAR USUARIO
// DECIDE ENTRE POST Y PUT
// ======================================================

async function guardarUsuario() {
    const idUsuario =
        document
            .getElementById("idUsuario")
            .value;

    const usuario = {
        nombre:
            document
                .getElementById("nombre")
                .value
                .trim(),

        apellido:
            document
                .getElementById("apellido")
                .value
                .trim(),

        correo:
            document
                .getElementById("correo")
                .value
                .trim(),

        telefono:
            document
                .getElementById("telefono")
                .value
                .trim(),

        rol:
            document
                .getElementById("rol")
                .value
    };


    // ==================================================
    // VALIDACIONES OBLIGATORIAS
    // ==================================================

    if (
        !usuario.nombre ||
        !usuario.apellido ||
        !usuario.correo
    ) {
        mostrarMensaje(
            "Nombre, apellido y correo son obligatorios.",
            "error"
        );

        return;
    }


    if (idUsuario === "") {
        await crearUsuario(usuario);
    } else {
        await actualizarUsuario(
            idUsuario,
            usuario
        );
    }
}


// ======================================================
// POST - CREAR USUARIO
// ======================================================

async function crearUsuario(usuario) {
    try {
        const respuesta = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(usuario)
            }
        );

        const datos =
            await respuesta.json();


        if (!respuesta.ok) {
            mostrarMensaje(
                datos.mensaje ||
                "No se pudo registrar el usuario.",
                "error"
            );

            return;
        }


        limpiarFormulario(false);

        if (!(await listarUsuarios())) {
            return;
        }


        mostrarMensaje(
            "Usuario registrado correctamente.",
            "exito"
        );

    } catch (error) {
        console.error(error);

        mostrarMensaje(
            "Error al registrar el usuario.",
            "error"
        );
    }
}


// ======================================================
// GET - CARGAR USUARIO PARA EDITAR
// ======================================================

async function cargarUsuario(id) {
    try {
        const respuesta =
            await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible cargar el usuario."
            );
        }

        const usuario =
            await respuesta.json();


        document.getElementById("idUsuario").value =
            usuario.id;

        document.getElementById("nombre").value =
            usuario.nombre;

        document.getElementById("apellido").value =
            usuario.apellido;

        document.getElementById("correo").value =
            usuario.correo;

        document.getElementById("telefono").value =
            usuario.telefono;

        document.getElementById("rol").value =
            usuario.rol;


        mostrarMensaje(
            `Editando usuario ID ${usuario.id}.`,
            "info"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);

        mostrarMensaje(
            "Error al cargar el usuario.",
            "error"
        );
    }
}


// ======================================================
// PUT - ACTUALIZAR USUARIO
// ======================================================

async function actualizarUsuario(
    id,
    usuario
) {
    try {
        const respuesta = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(usuario)
            }
        );

        const datos =
            await respuesta.json();


        if (!respuesta.ok) {
            mostrarMensaje(
                datos.mensaje ||
                "No se pudo actualizar el usuario.",
                "error"
            );

            return;
        }


        limpiarFormulario(false);

        if (!(await listarUsuarios())) {
            return;
        }


        mostrarMensaje(
            "Usuario actualizado correctamente.",
            "exito"
        );

    } catch (error) {
        console.error(error);

        mostrarMensaje(
            "Error al actualizar el usuario.",
            "error"
        );
    }
}


// ======================================================
// DELETE - ELIMINAR USUARIO
// ======================================================

async function eliminarUsuario(id) {
    const confirmado = confirm(
        "¿Está seguro de eliminar este usuario?"
    );


    if (!confirmado) {
        return;
    }


    try {
        const respuesta = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const datos =
            await respuesta.json();


        if (!respuesta.ok) {
            mostrarMensaje(
                datos.mensaje ||
                "No se pudo eliminar el usuario.",
                "error"
            );

            return;
        }


        if (!(await listarUsuarios())) {
            return;
        }


        mostrarMensaje(
            "Usuario eliminado correctamente.",
            "exito"
        );

    } catch (error) {
        console.error(error);

        mostrarMensaje(
            "Error al eliminar el usuario.",
            "error"
        );
    }
}


// ======================================================
// LIMPIAR FORMULARIO
// ======================================================

function limpiarFormulario(
    limpiarMensaje = true
) {
    document.getElementById("idUsuario").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("rol").value = "";


    if (limpiarMensaje) {
        mostrarMensaje(
            "Formulario limpiado.",
            "info"
        );
    }
}


// ======================================================
// RETO ADICIONAL
// BUSCAR POR NOMBRE Y FILTRAR POR ROL
// ======================================================

function aplicarFiltros() {
    const nombre =
        document
            .getElementById("buscarNombre")
            .value
            .toLowerCase()
            .trim();


    const rol =
        document
            .getElementById("filtroRol")
            .value;


    let lista =
        usuariosCargados.filter(usuario => {
            return usuario.nombre
                .toLowerCase()
                .includes(nombre);
        });


    if (rol !== "Todos") {
        lista = lista.filter(
            usuario =>
                usuario.rol === rol
        );
    }


    mostrarUsuarios(lista);
}


// ======================================================
// EVENTOS
// ======================================================

document
    .getElementById("formUsuario")
    .addEventListener(
        "submit",
        function (evento) {
            evento.preventDefault();

            guardarUsuario();
        }
    );


document
    .getElementById("buscarNombre")
    .addEventListener(
        "input",
        aplicarFiltros
    );


document
    .getElementById("filtroRol")
    .addEventListener(
        "change",
        aplicarFiltros
    );


// ======================================================
// CARGAR USUARIOS AL ABRIR LA PÁGINA
// ======================================================

listarUsuarios();
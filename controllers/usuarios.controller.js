const fs = require("fs");
const path = require("path");

const rutaArchivo = path.join(__dirname, "../datos/usuarios.json");

function leerUsuarios() {
    const datos = fs.readFileSync(rutaArchivo, "utf8");
    return JSON.parse(datos);
}

function guardarUsuarios(usuarios) {
    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(usuarios, null, 2),
        "utf8"
    );
}


// GET /api/usuarios
function listarUsuarios(req, res) {
    try {
        const usuarios = leerUsuarios();

        res.json({
            total: usuarios.length,
            usuarios
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar los usuarios."
        });
    }
}


// GET /api/usuarios/:id
function buscarUsuarioPorId(req, res) {
    try {
        const usuarios = leerUsuarios();
        const id = Number(req.params.id);

        const usuario = usuarios.find(
            usuario => usuario.id === id
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        res.json(usuario);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al buscar el usuario."
        });
    }
}


// POST /api/usuarios
function crearUsuario(req, res) {
    try {
        const usuarios = leerUsuarios();

        const {
            nombre,
            apellido,
            correo,
            telefono,
            rol
        } = req.body;

        if (!nombre || !apellido || !correo) {
            return res.status(400).json({
                mensaje: "Nombre, apellido y correo son obligatorios."
            });
        }

        const correoExiste = usuarios.some(
            usuario =>
                usuario.correo.toLowerCase() === correo.toLowerCase()
        );

        if (correoExiste) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado."
            });
        }

        const nuevoId =
            usuarios.length > 0
                ? Math.max(...usuarios.map(usuario => usuario.id)) + 1
                : 1;

        const nuevoUsuario = {
            id: nuevoId,
            nombre,
            apellido,
            correo,
            telefono: telefono || "",
            rol: rol || "Cliente"
        };

        usuarios.push(nuevoUsuario);

        guardarUsuarios(usuarios);

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            usuario: nuevoUsuario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar el usuario."
        });
    }
}


// PUT /api/usuarios/:id
function actualizarUsuario(req, res) {
    try {
        const usuarios = leerUsuarios();
        const id = Number(req.params.id);

        const indice = usuarios.findIndex(
            usuario => usuario.id === id
        );

        if (indice === -1) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        const {
            nombre,
            apellido,
            correo,
            telefono,
            rol
        } = req.body;

        if (!nombre || !apellido || !correo) {
            return res.status(400).json({
                mensaje: "Nombre, apellido y correo son obligatorios."
            });
        }

        const correoDuplicado = usuarios.some(
            usuario =>
                usuario.id !== id &&
                usuario.correo.toLowerCase() === correo.toLowerCase()
        );

        if (correoDuplicado) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado."
            });
        }

        usuarios[indice] = {
            id,
            nombre,
            apellido,
            correo,
            telefono: telefono || "",
            rol: rol || "Cliente"
        };

        guardarUsuarios(usuarios);

        res.json({
            mensaje: "Usuario actualizado correctamente.",
            usuario: usuarios[indice]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el usuario."
        });
    }
}


// DELETE /api/usuarios/:id
function eliminarUsuario(req, res) {
    try {
        const usuarios = leerUsuarios();
        const id = Number(req.params.id);

        const indice = usuarios.findIndex(
            usuario => usuario.id === id
        );

        if (indice === -1) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        const usuarioEliminado = usuarios[indice];

        usuarios.splice(indice, 1);

        guardarUsuarios(usuarios);

        res.json({
            mensaje: "Usuario eliminado correctamente.",
            usuario: usuarioEliminado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el usuario."
        });
    }
}


module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
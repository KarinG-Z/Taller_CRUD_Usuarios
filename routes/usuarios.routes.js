const express = require("express");

const {
    listarUsuarios,
    buscarUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require("../controllers/usuarios.controller");

const router = express.Router();

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;
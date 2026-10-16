const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API REST de usuarios funcionando correctamente"
    });
});

app.use("/api/usuarios", usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
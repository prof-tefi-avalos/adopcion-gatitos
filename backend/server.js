import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "db.json");


// Helpers
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// GET all cats
app.get("/cats", (req, res) => {
  try {
    const db = readDB();
    res.json(db.cats);
  } catch (error) {
    res.status(500).json({ error: "Error al leer los gatos" });
  }
});

// GET one cat
app.get("/cats/:id", (req, res) => {
  try {
    const db = readDB();
    const cat = db.cats.find((c) => c.id === parseInt(req.params.id));
    if (!cat) return res.status(404).json({ error: "Gato no encontrado" });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: "Error al leer el gato" });
  }
});

// POST create cat
app.post("/cats", (req, res) => {
  try {
    const db = readDB();
    const newCat = { id: Date.now(), ...req.body };
    db.cats.push(newCat);
    writeDB(db);
    res.status(201).json(newCat);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el gato" });
  }
});

// PUT update cat
app.put("/cats/:id", (req, res) => {
  try {
    const db = readDB();
    const index = db.cats.findIndex((c) => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Gato no encontrado" });

    db.cats[index] = { ...db.cats[index], ...req.body };
    writeDB(db);
    res.json(db.cats[index]);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el gato" });
  }
});

// DELETE cat
app.delete("/cats/:id", (req, res) => {
  try {
    const db = readDB();
    db.cats = db.cats.filter((c) => c.id !== parseInt(req.params.id));
    writeDB(db);
    res.json({ message: "Gato eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el gato" });
  }
});

app.listen(4000, () => console.log("🐱 Backend corriendo en http://localhost:4000"));

const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Genero = require('../models/Genero');

const router = Router();

// Registrar un nuevo género
router.post('/', [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  check('imagen').optional().isURL().withMessage('La imagen debe ser una URL válida')  // ← NUEVA LÍNEA
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nombre, descripcion, estado, imagen } = req.body;  // ← AGREGAR imagen
    const existe = await Genero.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ msg: 'El género ya existe' });
    }
    const genero = new Genero({ nombre, descripcion, estado, imagen });  // ← AGREGAR imagen
    await genero.save();
    res.status(201).json(genero);
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar el género', error });
  }
});

// Editar un género existente
router.put('/:id', [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  check('imagen').optional().isURL().withMessage('La imagen debe ser una URL válida') 
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado, imagen } = req.body; 
    const genero = await Genero.findByIdAndUpdate(id, { nombre, descripcion, estado, imagen, fechaActualizacion: new Date() }, { new: true });  // ← AGREGAR imagen
    if (!genero) {
      return res.status(404).json({ msg: 'Género no encontrado' });
    }
    res.json(genero);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar el género', error });
  }
});

// Consultar un género por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const genero = await Genero.findById(id);
    if (!genero) return res.status(404).json({ msg: 'Género no encontrado' });
    res.json(genero);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar el género', error });
  }
});

// Consultar todos los géneros
router.get('/', async (req, res) => {
  try {
    const generos = await Genero.find();
    // Mapear para mostrar el id explícitamente
    const generosConId = generos.map(genero => ({
      id: genero._id,
      nombre: genero.nombre,
      descripcion: genero.descripcion,
      estado: genero.estado,
      imagen: genero.imagen, 
      fechaCreacion: genero.fechaCreacion,
      fechaActualizacion: genero.fechaActualizacion
    }));
    res.json(generosConId);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar los géneros', error });
  }
});

// Eliminar un género
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const genero = await Genero.findByIdAndDelete(id);
    if (!genero) return res.status(404).json({ msg: 'Género no encontrado' });
    res.json({ msg: 'Género eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el género', error });
  }
});

module.exports = router;

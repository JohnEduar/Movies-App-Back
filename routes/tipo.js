const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Tipo = require('../models/Tipo');

const router = Router();

// Registrar un nuevo tipo

router.post('/', [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nombre, descripcion, estado } = req.body;
    const existe = await Tipo.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ msg: 'El tipo ya existe' });
    }
    const tipo = new Tipo({ nombre, descripcion, estado });
    await tipo.save();
    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar el tipo', error });
  }
});

// Editar un tipo existente

router.put('/:id', [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;
    const tipo = await Tipo.findByIdAndUpdate(id, { nombre, descripcion, estado, fechaActualizacion: new Date() }, { new: true });
    if (!tipo) {
      return res.status(404).json({ msg: 'Tipo no encontrado' });
    }
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar el tipo', error });
  }
});

// Consultar todos los tipos
router.get('/', async (req, res) => {
  try {
    const tipos = await Tipo.find();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar los tipos', error });
  }
});

// Consultar un tipo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await Tipo.findById(id);
    if (!tipo) return res.status(404).json({ msg: 'Tipo no encontrado' });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar el tipo', error });
  }
});

// Eliminar un tipo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await Tipo.findByIdAndDelete(id);
    if (!tipo) return res.status(404).json({ msg: 'Tipo no encontrado' });
    res.json({ msg: 'Tipo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el tipo', error });
  }
});

module.exports = router;

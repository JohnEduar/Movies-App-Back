const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Productora = require('../models/Productora');

const router = Router();

// Registrar una nueva productora
router.post('/', [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  check('slogan').notEmpty().withMessage('El slogan es obligatorio'),
  check('descripcion').notEmpty().withMessage('La descripción es obligatoria')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nombre, estado, slogan, descripcion } = req.body;
    const existe = await Productora.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ msg: 'La productora ya existe' });
    }
    const productora = new Productora({ nombre, estado, slogan, descripcion });
    await productora.save();
    res.status(201).json(productora);
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar la productora', error });
  }
});

// Editar una productora existente
router.put('/:id', [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  check('slogan').notEmpty().withMessage('El slogan es obligatorio'),
  check('descripcion').notEmpty().withMessage('La descripción es obligatoria')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { nombre, estado, slogan, descripcion } = req.body;
    const productora = await Productora.findByIdAndUpdate(id, { nombre, estado, slogan, descripcion, fechaActualizacion: new Date() }, { new: true });
    if (!productora) {
      return res.status(404).json({ msg: 'Productora no encontrada' });
    }
    res.json(productora);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar la productora', error });
  }
});


// Consultar todas las productoras
router.get('/', async (req, res) => {
  try {
    const productoras = await Productora.find();
    res.json(productoras);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar las productoras', error });
  }
});

// Consultar una productora por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productora = await Productora.findById(id);
    if (!productora) return res.status(404).json({ msg: 'Productora no encontrada' });
    res.json(productora);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar la productora', error });
  }
});

// Eliminar una productora
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productora = await Productora.findByIdAndDelete(id);
    if (!productora) return res.status(404).json({ msg: 'Productora no encontrada' });
    res.json({ msg: 'Productora eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar la productora', error });
  }
});

module.exports = router;

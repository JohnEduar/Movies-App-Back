const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');

const router = Router();

// Agregar una nueva producción
router.post('/', [
  check('serial').notEmpty().withMessage('El serial es obligatorio'),
  check('titulo').notEmpty().withMessage('El título es obligatorio'),
  check('sinopsis').notEmpty().withMessage('La sinopsis es obligatoria'),
  check('url').notEmpty().withMessage('La URL es obligatoria'),
  check('imagen').notEmpty().withMessage('La imagen es obligatoria'),
  check('anioEstreno').isInt({ min: 1888 }).withMessage('Año de estreno inválido'),
  check('generoPrincipal').notEmpty().withMessage('El género principal es obligatorio'),
  check('directorPrincipal').notEmpty().withMessage('El director principal es obligatorio'),
  check('productora').notEmpty().withMessage('La productora es obligatoria'),
  check('tipo').notEmpty().withMessage('El tipo es obligatorio')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { serial, titulo, sinopsis, url, imagen, anioEstreno, generoPrincipal, directorPrincipal, productora, tipo } = req.body;
    // Validar unicidad de serial y url
    const existeSerial = await Media.findOne({ serial });
    if (existeSerial) return res.status(400).json({ msg: 'El serial ya existe' });
    const existeUrl = await Media.findOne({ url });
    if (existeUrl) return res.status(400).json({ msg: 'La URL ya existe' });
    // Validar género activo
    const genero = await Genero.findOne({ _id: generoPrincipal, estado: 'activo' });
    if (!genero) return res.status(400).json({ msg: 'Género no válido o inactivo' });
    // Validar director activo
    const director = await Director.findOne({ _id: directorPrincipal, estado: 'activo' });
    if (!director) return res.status(400).json({ msg: 'Director no válido o inactivo' });
    // Validar productora activa
    const productoraObj = await Productora.findOne({ _id: productora, estado: 'activo' });
    if (!productoraObj) return res.status(400).json({ msg: 'Productora no válida o inactiva' });
    // Validar tipo activo
    const tipoObj = await Tipo.findOne({ _id: tipo, estado: 'activo' });
    if (!tipoObj) return res.status(400).json({ msg: 'Tipo no válido o inactivo' });
    // Crear media
    const media = new Media({ serial, titulo, sinopsis, url, imagen, anioEstreno, generoPrincipal, directorPrincipal, productora, tipo });
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar la producción', error });
  }
});


// Editar una producción
router.put('/:id', [
  check('serial').notEmpty().withMessage('El serial es obligatorio'),
  check('titulo').notEmpty().withMessage('El título es obligatorio'),
  check('sinopsis').notEmpty().withMessage('La sinopsis es obligatoria'),
  check('url').notEmpty().withMessage('La URL es obligatoria'),
  check('imagen').notEmpty().withMessage('La imagen es obligatoria'),
  check('anioEstreno').isInt({ min: 1888 }).withMessage('Año de estreno inválido'),
  check('generoPrincipal').notEmpty().withMessage('El género principal es obligatorio'),
  check('directorPrincipal').notEmpty().withMessage('El director principal es obligatorio'),
  check('productora').notEmpty().withMessage('La productora es obligatoria'),
  check('tipo').notEmpty().withMessage('El tipo es obligatorio')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { serial, titulo, sinopsis, url, imagen, anioEstreno, generoPrincipal, directorPrincipal, productora, tipo } = req.body;
    // Validar unicidad de serial y url (excluyendo el actual)
    const existeSerial = await Media.findOne({ serial, _id: { $ne: id } });
    if (existeSerial) return res.status(400).json({ msg: 'El serial ya existe' });
    const existeUrl = await Media.findOne({ url, _id: { $ne: id } });
    if (existeUrl) return res.status(400).json({ msg: 'La URL ya existe' });
    // Validar género activo
    const genero = await Genero.findOne({ _id: generoPrincipal, estado: 'activo' });
    if (!genero) return res.status(400).json({ msg: 'Género no válido o inactivo' });
    // Validar director activo
    const director = await Director.findOne({ _id: directorPrincipal, estado: 'activo' });
    if (!director) return res.status(400).json({ msg: 'Director no válido o inactivo' });
    // Validar productora activa
    const productoraObj = await Productora.findOne({ _id: productora, estado: 'activo' });
    if (!productoraObj) return res.status(400).json({ msg: 'Productora no válida o inactiva' });
    // Validar tipo activo
    const tipoObj = await Tipo.findOne({ _id: tipo, estado: 'activo' });
    if (!tipoObj) return res.status(400).json({ msg: 'Tipo no válido o inactivo' });
    // Editar media
    const media = await Media.findByIdAndUpdate(id, { serial, titulo, sinopsis, url, imagen, anioEstreno, generoPrincipal, directorPrincipal, productora, tipo, fechaActualizacion: new Date() }, { new: true });
    if (!media) return res.status(404).json({ msg: 'Producción no encontrada' });
    res.json(media);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar la producción', error });
  }
});

// Borrar una producción
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByIdAndDelete(id);
    if (!media) return res.status(404).json({ msg: 'Producción no encontrada' });
    res.json({ msg: 'Producción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar la producción', error });
  }
});

// Consultar todas las producciones
router.get('/', async (req, res) => {
  try {
    const medias = await Media.find()
      .populate('generoPrincipal')
      .populate('directorPrincipal')
      .populate('productora')
      .populate('tipo');
    res.json(medias);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar las producciones', error });
  }
});

// Consultar una producción por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id)
      .populate('generoPrincipal')
      .populate('directorPrincipal')
      .populate('productora')
      .populate('tipo');
    if (!media) return res.status(404).json({ msg: 'Producción no encontrada' });
    res.json(media);
  } catch (error) {
    res.status(500).json({ msg: 'Error al consultar la producción', error });
  }
});

module.exports = router;


const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Director = require('../models/Director');

const router = Router();

// Consultar todos los directores
router.get('/', async (req, res) => {
    try {
        const directores = await Director.find();
        res.json(directores);
    } catch (error) {
        res.status(500).json({ msg: 'Error al consultar los directores', error });
    }
});

// Consultar un director por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const director = await Director.findById(id);
        if (!director) return res.status(404).json({ msg: 'Director no encontrado' });
        res.json(director);
    } catch (error) {
        res.status(500).json({ msg: 'Error al consultar el director', error });
    }
});

// Eliminar un director
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const director = await Director.findByIdAndDelete(id);
        if (!director) return res.status(404).json({ msg: 'Director no encontrado' });
        res.json({ msg: 'Director eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el director', error });
    }
});

// Registrar un nuevo director
router.post('/', [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { nombre, estado } = req.body;
        const existe = await Director.findOne({ nombre });
        if (existe) {
            return res.status(400).json({ msg: 'El director ya existe' });
        }
        const director = new Director({ nombre, estado });
        await director.save();
        res.status(201).json(director);
    } catch (error) {
        res.status(500).json({ msg: 'Error al registrar el director', error });
    }
});

// Editar un director existente
router.put('/:id', [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('estado').isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { nombre, estado } = req.body;
        const director = await Director.findByIdAndUpdate(id, { nombre, estado, fechaActualizacion: new Date() }, { new: true });
        if (!director) {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }
        res.json(director);
    } catch (error) {
        res.status(500).json({ msg: 'Error al editar el director', error });
    }
});


module.exports = router;


const {Schema, model} = require('mongoose')

const GeneroSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        minlength: [3, 'La descripción debe tener al menos 3 caracteres'],
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    estado: {
        type: String,
        required: [true, 'El estado es obligatorio'],
        trim: true,
        enum: {values: ['activo', 'inactivo'], message: 'El estado debe ser activo o inactivo'},
        default: 'activo'
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }

});

GeneroSchema.pre('save', function(next) {
    if (!this.isNew) {
        this.fechaActualizacion = new Date();
    }
    next();
});

GeneroSchema.statics.getActivos = function() {
    return this.find({ estado: 'activo' }).sort({ nombre: 1 });
}

module.exports = model('Genero', GeneroSchema);
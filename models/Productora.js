const {Schema, model} = require('mongoose')

const ProductoraSchema = new Schema({
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
    slogan: {
        type: String,
        required: [true, 'El slogan es obligatorio'],
        trim: true,
        minlength: [3, 'El slogan debe tener al menos 3 caracteres'],
        maxlength: [100, 'El slogan no puede exceder los 100 caracteres']
    },
    imagen: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true; 
                return /^https?:\/\/.+/.test(v);
            },
            message: 'La imagen debe ser una URL válida'
        }
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

ProductoraSchema.pre('save', function(next) {
    if (!this.isNew) {
        this.fechaActualizacion = new Date();
    }
    next();
});

ProductoraSchema.statics.getActivos = function() {
    return this.find({ estado: 'activo' }).sort({ nombre: 1 });
}

module.exports = model('Productora', ProductoraSchema);
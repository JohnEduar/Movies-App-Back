const {Schema, model} = require('mongoose')

const DirectorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    estado: {
        type: String,
        required: [true, 'El estado es obligatorio'],
        trim: true,
        enum: {values: ['activo', 'inactivo'], message: 'El estado debe ser activo o inactivo'},
        default: 'activo'
    },
    imagen: {                                    
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true; // Si no hay imagen, está bien
                // Validar que sea una URL válida
                return /^https?:\/\/.+/.test(v);
            },
            message: 'La imagen debe ser una URL válida (http:// o https://)'
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

DirectorSchema.pre('save', function(next) {
    if (!this.isNew) {
        this.fechaActualizacion = new Date();
    }
    next();
});

DirectorSchema.statics.getActivos = function() {
    return this.find({ estado: 'activo' }).sort({ nombre: 1 });
}

module.exports = model('Director', DirectorSchema);
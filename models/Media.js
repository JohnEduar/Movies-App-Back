const {Schema, model} = require('mongoose')

const MediaSchema = new Schema({
    serial: {
        type: String,
        required: [true, 'El serial es obligatorio'],
        unique: true,
        trim: true,
        minlength: [3, 'El serial debe tener al menos 3 caracteres'],
        maxlength: [100, 'El serial no puede exceder los 100 caracteres']
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        minlength: [3, 'El título debe tener al menos 3 caracteres'],
        maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    sinopsis: {
        type: String,
        required: [true, 'La sinopsis es obligatoria'],
        trim: true,
        minlength: [3, 'La sinopsis debe tener al menos 3 caracteres'],
        maxlength: [500, 'La sinopsis no puede exceder los 500 caracteres']
    },
    url: {
        type: String,
        required: [true, 'La URL es obligatoria'],
        trim: true,
        minlength: [3, 'La URL debe tener al menos 3 caracteres'],
        maxlength: [500, 'La URL no puede exceder los 500 caracteres']
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
        trim: true,
        minlength: [3, 'La imagen debe tener al menos 3 caracteres'],
        maxlength: [500, 'La imagen no puede exceder los 500 caracteres']
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    },
    anioEstreno: {
        type: Number,
        required: [true, 'El año de estreno es obligatorio'],
        min: [1888, 'El año de estreno debe ser posterior a 1888'],
        max: [new Date().getFullYear(), 'El año de estreno no puede ser mayor que el año actual']
    },
    generoPrincipal: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'Genero',
        required: [true, 'El género principal es obligatorio']
    },
    directorPrincipal: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'Director',
        required: [true, 'El director principal es obligatorio']
    },
    productora: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'Productora',
        required: [true, 'La productora es obligatoria']
    },
    tipo: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'Tipo',
        required: [true, 'El tipo es obligatorio']
    }

});

MediaSchema.pre('save', function(next) {
    if (!this.isNew) {
        this.fechaActualizacion = new Date();
    }
    next();
});


module.exports = model('Media', MediaSchema);
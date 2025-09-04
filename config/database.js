const mongoose = require('mongoose');

// URL de MongoDB Atlas
const url = 'mongodb+srv://estebanosorno:Dracomas12@cluster0.ridyvfo.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0';

const getConnection = async () => {
    try {
        // Usar MongoDB Atlas en lugar de localhost
        await mongoose.connect(url);
        console.log('✅ Conexión a MongoDB Atlas establecida correctamente');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = {
    getConnection
};
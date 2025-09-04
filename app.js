const express = require('express')
const { getConnection } = require('./config/database.js')

const app = express()
const cors = require('cors');

app.use(cors());
app.use(express.json());
require('dotenv').config();



app.use('/api/generos', require('./routes/genero.js'));
app.use('/api/directores', require('./routes/director.js'));
app.use('/api/medias', require('./routes/media.js'));
app.use('/api/productoras', require('./routes/productora.js'));
app.use('/api/tipos', require('./routes/tipo.js'));

const port = process.env.PORT || 4000;


getConnection();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
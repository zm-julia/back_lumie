require('dotenv').config()
const express = require('express')
const cors = require('cors')

const db = require('./db/conn')
require('./models/rel') 

const app = express()

app.use(cors())
app.use(express.json())

app.use(require('./routes/usuarioRoutes'))
app.use(require('./routes/categoriaRoutes'))
app.use(require('./routes/produtoRoutes'))
app.use(require('./routes/estoqueRoutes'))
app.use(require('./routes/pedidoRoutes'))
app.use(require('./routes/relatorioRoutes'))
app.use(require('./routes/cepRoutes'))

app.get('/api', (req, res) => {
    res.json({ mensagem: 'API LUMIÉ Beauty & Professionals no ar!' })
})

const PORT = process.env.PORT || 3000

db.authenticate()
    .then(() => {
        app.listen(PORT, () => {
            console.log('--------------------------------------------------')
            console.log(`Servidor rodando em http://localhost:${PORT}`)
            console.log('--------------------------------------------------')
        })
    })
    .catch((err) => {
        console.error('Não foi possível iniciar o servidor: erro de conexão com o banco.', err)
    })

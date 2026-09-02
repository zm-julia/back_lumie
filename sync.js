const conn = require('./db/conn') 

const { 
    Usuario, 
    Pedido, 
    Produto, 
    ItemPedido, 
    Entrega, 
    Estoque,
    Categoria,
    Profissional,
    Servico,
    Localizacao,
    Agendamento,
    Avaliacao
} = require('./models/rel') 

async function syncDataBase() {
    try {
        await conn.sync({ force: true }) 
        console.log('Banco de Dados sincronizado com sucesso (12 Tabelas)!')
    } catch (err) {
        console.error('ERRO: Não foi possível sincronizar o banco de dados!', err)
    } finally {
        await conn.close()
        console.log('Conexão com o banco de dados fechada.')
    }
}

syncDataBase()
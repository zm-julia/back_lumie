const Usuario = require('./Usuario')
const Pedido = require('./Pedido')
const Produto = require('./Produto')
const ItemPedido = require('./ItemPedido')
const Entrega = require('./Entrega')
const Estoque = require('./Estoque')
const Categoria = require('./Categoria')
const Profissional = require('./Profissional')
const Servico = require('./Servico')
const Localizacao = require('./Localizacao')
const Agendamento = require('./Agendamento')
const Avaliacao = require('./Avaliacao')


// 1. RELACIONAMENTOS CATEGORIA & PRODUTO
Categoria.hasMany(Produto, {
    foreignKey: 'idCategoria',
    as: 'produtosCategoria',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
})

Produto.belongsTo(Categoria, {
    foreignKey: 'idCategoria',
    as: 'categoriaProduto'
})


// 2. RELACIONAMENTOS USUÁRIO & PEDIDO
Usuario.hasMany(Pedido, { 
    foreignKey: 'idUsuario', 
    as: 'pedidosUsuario', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Pedido.belongsTo(Usuario, { 
    foreignKey: 'idUsuario', 
    as: 'usuarioPedido' 
})


// 3. RELACIONAMENTOS PEDIDO (ITEM_PEDIDO E ENTREGA)
Pedido.hasMany(ItemPedido, { 
    foreignKey: 'idPedido', 
    as: 'itensPedido', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

ItemPedido.belongsTo(Pedido, { 
    foreignKey: 'idPedido', 
    as: 'pedidoItem' 
})

Pedido.hasOne(Entrega, { 
    foreignKey: 'idPedido', 
    as: 'entregaPedido', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Entrega.belongsTo(Pedido, { 
    foreignKey: 'idPedido', 
    as: 'pedidoEntrega' 
})


// 4. RELACIONAMENTOS PRODUTO (ITEM_PEDIDO E ESTOQUE)
Produto.hasMany(ItemPedido, { 
    foreignKey: 'idProduto', 
    as: 'itensProduto', 
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE' 
})

ItemPedido.belongsTo(Produto, { 
    foreignKey: 'idProduto', 
    as: 'produtoItem' 
})

Produto.hasOne(Estoque, { 
    foreignKey: 'idProduto', 
    as: 'estoqueProduto', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Estoque.belongsTo(Produto, { 
    foreignKey: 'idProduto', 
    as: 'produtoEstoque' 
})


// 5. RELACIONAMENTOS PROFISSIONAL & SERVIÇO
Profissional.hasMany(Servico, {
    foreignKey: 'idProfissional',
    as: 'servicosProfissional',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Servico.belongsTo(Profissional, {
    foreignKey: 'idProfissional',
    as: 'profissionalServico'
})


// 6. RELACIONAMENTO PROFISSIONAL & LOCALIZAÇÃO (1 para 1, igual Produto/Estoque)
Profissional.hasOne(Localizacao, {
    foreignKey: 'idProfissional',
    as: 'localizacaoProfissional',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Localizacao.belongsTo(Profissional, {
    foreignKey: 'idProfissional',
    as: 'profissionalLocalizacao'
})


// 7. RELACIONAMENTOS AGENDAMENTO (USUÁRIO & SERVIÇO)
Usuario.hasMany(Agendamento, {
    foreignKey: 'idUsuario',
    as: 'agendamentosUsuario',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Agendamento.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuarioAgendamento'
})

Servico.hasMany(Agendamento, {
    foreignKey: 'idServico',
    as: 'agendamentosServico',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
})

Agendamento.belongsTo(Servico, {
    foreignKey: 'idServico',
    as: 'servicoAgendamento'
})


// 8. RELACIONAMENTOS AVALIAÇÃO (USUÁRIO, PROFISSIONAL & AGENDAMENTO)
Usuario.hasMany(Avaliacao, {
    foreignKey: 'idUsuario',
    as: 'avaliacoesUsuario',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Avaliacao.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuarioAvaliacao'
})

Profissional.hasMany(Avaliacao, {
    foreignKey: 'idProfissional',
    as: 'avaliacoesProfissional',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Avaliacao.belongsTo(Profissional, {
    foreignKey: 'idProfissional',
    as: 'profissionalAvaliacao'
})

Agendamento.hasOne(Avaliacao, {
    foreignKey: 'idAgendamento',
    as: 'avaliacaoAgendamento',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Avaliacao.belongsTo(Agendamento, {
    foreignKey: 'idAgendamento',
    as: 'agendamentoAvaliacao'
})


module.exports = { 
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
}

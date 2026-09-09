const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Servico = db.define('servico', {
    codServico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idProfissional: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'profissionais',
            key: 'codProfissional'
        }
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    duracao_minutos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60
    }
}, {
    timestamps: false,
    tableName: 'servicos'
})

module.exports = Servico

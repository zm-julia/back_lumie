const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Profissional = db.define('profissional', {
    codProfissional: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    especialidade: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    preco_base: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: false,
    tableName: 'profissionais'
})

module.exports = Profissional

const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Localizacao = db.define('localizacao', {
    codLocalizacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idProfissional: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'profissionais',
            key: 'codProfissional'
        }
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    logradouro: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    complemento: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    bairro: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    localidade: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    uf: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'localizacoes'
})

module.exports = Localizacao

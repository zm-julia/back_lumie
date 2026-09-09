const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Avaliacao = db.define('avaliacao', {
    codAvaliacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'codUsuario'
        }
    },
    idProfissional: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'profissionais',
            key: 'codProfissional'
        }
    },
    idAgendamento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // um agendamento só pode gerar uma avaliação
        references: {
            model: 'agendamentos',
            key: 'codAgendamento'
        }
    },
    nota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dataAvaliacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'avaliacoes'
})

module.exports = Avaliacao

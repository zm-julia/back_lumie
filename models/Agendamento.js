const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Agendamento = db.define('agendamento', {
    codAgendamento: {
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
    idServico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'servicos',
            key: 'codServico'
        }
    },
    dataHora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('SOLICITADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'),
        allowNull: false,
        defaultValue: 'SOLICITADO'
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'agendamentos'
})

module.exports = Agendamento

import { Sequelize } from 'sequelize'

export const database = new Sequelize({
  dialect: 'postgres',
  host: 'roundhouse.proxy.rlwy.net',
  port: 19232,
  database: 'plataformaCursosDB',
  username: 'postgres',
  password: '*C-5eacee2F*c44A32dfe1Fd*62FDbFF',
	define: {
    underscored: true
  }
})
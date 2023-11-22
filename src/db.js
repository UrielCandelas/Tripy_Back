import {Sequelize} from 'sequelize'

const userName = process.env.USERNAME_MYSQL
const password = process.env.PASSWORD_MYSQL
const database = process.env.DATABASE_MYSQL

const sequelize = new Sequelize({
    host: 'localhost',
    port: '3306',
    username: userName,
    password: password,
    database: database,
    dialect: 'mysql',
    logging: false,
})
export const syncTables = async ()=>{
    try {
        await sequelize.sync()
        console.log(`>>Tablas Sincronizadas`)
    } catch (error) {
        throw new Error(`Occurrio un error: ${error.message}`)
    }
}
export default sequelize

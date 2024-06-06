import { Sequelize } from "sequelize-typescript"
import dotenv from "dotenv"
dotenv.config()

const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [__dirname + "/../models/**/*"],
    //se deshabilita el loggin para poder ejecutar el test del servidor
    logging: false
})

export default db
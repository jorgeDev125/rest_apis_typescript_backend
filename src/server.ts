import express from "express";
import * as bodyParser from "body-parser";
import colors from "colors";
import cors, {CorsOptions} from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express"
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import router from "./router";
import db from "./config/db";


//Conectar a base de datos

export async function connectDB( ) {
    try {
        await db.authenticate()
        db.sync()
        //se desahibilita este console.log para que no interfiera con las pruebas de superTest
        //console.log(colors.blue("conexión exitosa a la BD"))
    } catch (error) {
        //console.log(error)
        console.log(colors.red.bold( "Hubo un error al conectarse a la BD" ))
    }
}



connectDB()

//instancia de Express
const server = express()

//Permitir conexiones
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error("Error de CORS"))
        }
    }
}

server.use(cors(corsOptions))

//leer datos de formularios
server.use(bodyParser.json());
//server.use(express.json())


//morgan sirve para logear todas las interacciones con nuestra API, el tiempo que demora la petición y mas información
server.use(morgan("dev"))


server.use("/api/products", router)



//Documentación con swagger, y personalización de logótipo
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))


export default server



import { exit } from "node:process"
import db from "../config/db"

//se genera esta función para eliminar todos los registros de la base de datos cada que termina el testing
const clearDB = async () => {
    try {
        //se llama la función sync con la bander de force:true para eliminar todos los registros y se termina la ejecución con exit() que siginifica que termono correctamente
        await db.sync({force:true})
        console.log("Datos eliminados correctamente")
        exit()
    } catch (error) {
        //si hay un error se imprime en consola y se termina la ejecución con exit(1) que significa que termino con errores
        console.log(error)
        exit(1)
    }
}

//se ejecuta la función porque en el package.json se configura el pretest para crear el --clear en la posicción 2 del arreglo de process.argv
if (process.argv[2] === "--clear") {
    clearDB()
}

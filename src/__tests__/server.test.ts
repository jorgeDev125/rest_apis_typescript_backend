
import {connectDB} from '../server';
import db from "../config/db";




//pruebas forzando el error del servidor
//importar un mock con la config y la instancia de Sequelize del db para simular la conección a la base de datos
jest.mock("../config/db")

describe("connctDB", () => {
    it("should handle database connection error", async () => {
        //se crea un espía que esepra que se ejecute el método authenticate en db
        jest.spyOn(db, "authenticate")
            //se niega la promesa para forzar el reject para que caiga en el catch del error
            .mockRejectedValueOnce(new Error("Hubo un error al conectarse a la BD"))
        //se crea un espía para que revise el console log y espere a que suceda  
        const consoleSpy = jest.spyOn(console, "log")

        //se manda a llamar la conección
        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Hubo un error al conectarse a la BD")
        )

    })
})
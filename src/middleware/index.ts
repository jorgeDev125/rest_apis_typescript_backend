import { Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"

//se crea esta función middleware para limpiar el código en el econtyrolador de producto
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    //se llama la función dinámica next() para indicar a la función que cuando se ejecute, siga con la siguiente
    next()
}

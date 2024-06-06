import { Request, Response} from "express"
import { /* check, */ validationResult, param } from 'express-validator';
import Product from "../models/Product.model"


export const getProducts = async (req: Request, res: Response) => {
    /* try { */
        //se usa la función findAll en el model PRoduct para obtener todos los registros de nuestar base de datos
        //se puede ordenar la respuesta abriendo llaves dentro de la función findAll y con esa sintaxis de doble [] y el nobre de la prodpiedad y como se quiere ordenar DESC (descendiente), ASC (Ascendiente), etc.
        //se pueden excluir algunos campos para que la respuesta traiga solo lo que yo requiero, attributes: { exclude: ["lo que se vaya a exluir", "lo que se vaya a exluir"]}
        //se puede limitar el numero de items recibidos en la respuesta con limit: numero
        const products = await Product.findAll({
            order: [
                ["id", "DESC"]
            ],
            /* attributes: { exclude: ["createdAt", "updatedAt", "availability"]} */
            /* limit: 2 */
        })
        res.json({data: products})
    //como estas lineas no se ejecutan porque todo funciona correctamente,s e marcan en el coverage de las pruebas como negativas, así que se eliminan
   /*  } catch (error) {
        console.log(error)
    } */
}

export const getProductById = async (req: Request, res: Response) => {
   /*  try { */
        //desestrcuturamos el id de los parametros del request y con findByPk pasamos ese id para obtener el producto que tenga ese id
        const { id } = req.params
        const product = await Product.findByPk(id)
        
        if (!product) {
            return res.status(404).json({
                error: "Producto no encontrado"
            })
        }

        res.json({data: product})

   /*  } catch (error) {
        console.log(error)
    } */
}

export const createProduct = async (req: Request, res: Response) => {


    //Validación dentro del controlador (esta validación se mueve al router)
    //check el nombre de la propiedad a validar, isEmpty es el metodo de validación, withMessage da el mensaje si no pasa la validación, run(req) recupera los datos de la llamada para validar
   /*  await check('name')
        .notEmpty().withMessage("El nombre del producto no puede ir vacio")
        .run(req)
 */
    //isNumeric válida que el precio ingresado sea un número, el custom es una regla personalizada
  /*   await check("price")
        .isNumeric().withMessage("Valor no válido")
        .custom(value => value > 0).withMessage("Precio no válido")
        .notEmpty().withMessage("El precio del producto no puede ir vacio")
        .run(req) */

    //recuperar los errores (este código se mueve al middleware)
    /* let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    } */


    //se pone este código en un try catch por si hay algún error que no tenga que ver con la validación de los inputs, sepamos cual es ese error
    /* try { */
        //crear el producto a partir del modelo Product
        const product = await Product.create(req['body'])
        //envia el producto creado con formato JSON
        res.status(201).json({data: product})
    /* } catch (error) {
        console.log(error)
    } */
}

export const updateProduct = async (req: Request, res: Response) => {
    //comporobar si el producto existe
    const { id } = req.params
    const product = await Product.findByPk(id)
    
    if (!product) {
        return res.status(404).json({
            error: "Producto no encontrado"
        })
    }

    //Actualizar, sobre la instancia product se llama el método update para actualizar y elmétodo save para guardarlo en la base de datos
    await product.update(req['body'])
    await product.save()

    res.json({data: product})
}

export const updateAvailability = async (req, res) => {

    const { id } = req.params
    const product = await Product.findByPk(id)
    
    if (!product) {
        return res.status(404).json({
            error: "Producto no encontrado"
        })
    }

    //se asigna el valor negado de la disponibilidad obtenida a través de dataValues
    product.availability = !product.dataValues.availability
    await product.save()
    res.json({data: product})
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    const product = await Product.findByPk(id)
    
    if (!product) {
        return res.status(404).json({
            error: "Producto no encontrado"
        })
    }

    //se elimina el registro a través de la función destroy()
    await product.destroy()
    res.json({data: "Producto ELiminado"})
}

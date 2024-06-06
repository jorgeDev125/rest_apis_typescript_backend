import { Router } from "express"
import { body, param } from "express-validator"
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"

const router = Router()

/** 
*@swagger
*   components:
*       schemas:
*           Product:
*               type: object
*               properties:
*                   id: 
*                       type: integer
*                       description: The prodcut ID
*                       example: 1
*                   name:
*                       type: string
*                       description: The prodcut name
*                       example: Monitor Curvo 49 Pulgadas
*                   price:
*                       type: number
*                       description: The prodcut price
*                       example: 250
*                   availability:
*                       type: boolean
*                       description: The prodcut availability
*                       example: true
*/

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Returns a list of products
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: "#/components/schemas/Product"
 */



router.get("/", getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Returns a product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of th eproduct to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Product" 
 *              400:
 *                  description: Bad request 
 *              404:
 *                  description: Not found       
 * */

//nombramos el parametro como id para poderlo obetener desde el controlador
router.get("/:id", 
    //la validación se hace con inInt() para saber si lo que se envia en el request es un entero, si no lo es se llama la función del middleware y se ejecuta el error
    param("id").isInt().withMessage("Id no válido"),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products/:
 *      post:
 *          summary: Creates a new product
 *          tags:
 *              - Products
 *          description: Returns a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             name:
 *                                type: string
 *                                example: "Monitor de 49 pulgadas"
 *                             price:
 *                                type: number
 *                                example: 399
 *          responses:
 *              201:
 *                  description: Product created succesfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Product" 
 *              400:
 *                  description: Bad Request - Invalid data
 */

router.post("/", 

    //validación en el router, se cambia la función de check, por body, y no es función asíncrona, no lleva await
    body('name')
        .notEmpty().withMessage("El nombre del producto no puede ir vacio"),
    
    //isNumeric válida que el precio ingresado sea un número, el custom es una regla personalizada
    body("price")
        .isNumeric().withMessage("Valor no válido")
        .custom(value => value > 0).withMessage("Precio no válido")
        .notEmpty().withMessage("El precio del producto no puede ir vacio"),
    //depues de la validación se ejecuta la función del middleware para ver si hay errores, si los hay los valida, sino ejecuta la siguiente función
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Update a product with user input
 *          tags:
 *              - Products
 *          description: Returns the updated product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of th eproduct to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             name:
 *                                type: string
 *                                example: "Monitor de 49 pulgadas"
 *                             price:
 *                                type: number
 *                                example: 399
 *                             availability:
 *                                type: boolean
 *                                example: true
 *          responses: 
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Product"
 *              400:
 *                  description: Bad Request - Invalid ID or Invalid Input Data
 *              404:
 *                  description: Product not found
 */


router.put("/:id", 
    param("id").isInt().withMessage("Id no válido"),
    body('name')
    .notEmpty().withMessage("El nombre del producto no puede ir vacio"),
    body("price")
        .isNumeric().withMessage("Valor no válido")
        .custom(value => value > 0).withMessage("Precio no válido")
        .notEmpty().withMessage("El precio del producto no puede ir vacio"),
    body("availability")
        .isBoolean().withMessage("Valor para disponibilidad no válido"),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update product availability 
 *          tags:
 *              - Products
 *          description: Returns the updated availability
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of th eproduct to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses: 
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Product"
 *              400:
 *                  description: Bad Request - Invalid ID
 *              404:
 *                  description: Product not found
 */

router.patch("/:id", 
    param("id").isInt().withMessage("Id no válido"),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *          summary: Deletes a product by a given ID
 *          tags:
 *              - Products
 *          description: Returns a confirmation message 
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of th eproduct to delete
 *              required: true
 *              schema:
 *                  type: integer
 *          responses: 
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                   data:
 *                                     type: string
 *                                     example: "Producto ELiminado"
 *              400:
 *                  description: Bad Request - Invalid ID
 *              404:
 *                  description: Product not found
 */


router.delete("/:id", 
    param("id").isInt().withMessage("Id no válido"),
    handleInputErrors,
    deleteProduct
)

export default router
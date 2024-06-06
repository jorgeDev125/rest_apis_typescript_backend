import request from "supertest";
import server from "../../server";


describe("POST /api/products", () => {
    it("should display validation errors", async () => {
        const response = await request(server).post("/api/products").send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body.errors).not.toHaveLength(5)
        expect(response.body.errors).not.toHaveLength(3)
    })

    it("should validate that the price is greater than cero", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Ipad - Testing",
            price: 0
          })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Precio no válido")

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(5)
    })

    it("should validate that the price is a number and greater than cero", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Ipad - Testing",
            price: "Hola"
          })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(2)
        //expect(response.body.errors.msg).toBe("Precio no válido")

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(5)
    })

    it("sholud create a new product", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Ipad - Testing",
            price: 450
          })
        expect(response.status).toEqual(201)
        //que en alguna parte de la respuesta tenga la propiedad data
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toEqual(401)
        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("GET /api/products", () => {

    it("Should check if /api/products URL exists", async () => {
        const response = await request(server).get("/api/products")
        expect(response.status).not.toBe(404)
    })

    it("Get a JSON response with products", async () => {
        const response = await request(server).get("/api/products")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveLength(1)
        expect(response.headers["content-type"]).toMatch(/json/)

        expect(response.body).not.toHaveProperty("errors")
        expect(response.body.data).not.toHaveLength(2)
    })
})

describe("GET /api/products/:id", () => {

    it("should return a 404 response for a non-existent product", async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Producto no encontrado")
    })

    it("should check a valid Id in the URL", async () => {
        const response = await request(server).get("/api/products/not-valid-id")
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Id no válido")
    })

    it("should get a JSON response for a single product", async () => {
        const response = await request(server).get("/api/products/1")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
    })
})

describe("PUT /api/products/:id", () =>{
    it("should check a valid Id in the URL", async () => {
        const response = await request(server)
                                .put("/api/products/not-valid-id")
                                .send({
                                    name: "Ipad - Testing",
                                    availability: true  ,     
                                    price: 300
                                })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Id no válido")
    })

    it("should display validation error message when updateing a product", async () => {
        const response = await  request(server).put("/api/products/1").send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should validate that the price is grater than 0", async () => {
        const response = await request(server)
                                .put("/api/products/1")
                                .send({
                                    name: "Ipad - Testing",
                                    availability: true  ,     
                                    price: 0
                                })        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Precio no válido")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should return status 404 for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server)
                                .put(`/api/products/${productId}`)
                                .send({
                                    name: "Ipad - Testing",
                                    availability: true  ,     
                                    price: 300
                                })        
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should update an existing produc with valid data", async () => {
        const response = await request(server)
                                .put("/api/products/1")
                                .send({
                                    name: "Ipad - Testing",
                                    availability: true  ,     
                                    price: 300
                                })        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("PATCH /api/products/:id", () => {
    it("should return a 404 response for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)
                                     
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })
    it("should update the prdocut availability", async () => {
        const response = await request(server).patch(`/api/products/1`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data.availability).toBe(false)


        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("PUT /api/products/:id", () =>{ 
    it("should check a valid ID", async () => {
        const response = await request(server).delete("/api/products/not-valid-id")
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors[0].msg).toBe("Id no válido")
    })
    it("should return a 404 response for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)
                                     
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })
    it("should delete an existing product", async () => {
        const response = await request(server).delete("/api/products/1")

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toBe("Producto ELiminado")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})

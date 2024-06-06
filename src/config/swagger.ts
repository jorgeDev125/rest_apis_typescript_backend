import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";


const options: swaggerJSDoc.Options = {
    swaggerDefinition:{
        openapi: "3.1.0",
        tags: [
            {
                name: "Products",
                description: "API operations related to Products"
            }
        ],
        info:{
            title: "REST API Node.js / Express / Typescript",
            version: "1.0.0",
            description: "API Docs for Products",
        }
    },
    apis: ["./src/router.ts"]
}

const swaggerSpec = swaggerJSDoc(options)

//personalización de logótipo de swagger
const swaggerUiOptions: SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url("https://img.freepik.com/free-vector/modern-conectivity-logo-template_23-2147934058.jpg?t=st=1717201397~exp=1717204997~hmac=546a0447a4a6ecb35999b178f8da2fe2ffb27663e5f57d02c21595f7baf08c1c&w=740");
            height: 120px;
            width: auto,
        }
        .swagger-ui .topbar {
            background-color: #2b3b45
        }
    `,
    customSiteTitle: "Documentación REST API express / Typescript"
}

export default swaggerSpec

//se exporta la personalización y se importa en el archivo de server
export {
    swaggerUiOptions
}



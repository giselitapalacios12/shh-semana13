const express= require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 6;

/**
 * @swagger
 *  components:
 *  schemas:
 *      Id:
 *          type: String
 *          description: ID autogenerado (NanoId)
 *          example: Gis123
 *      Error500:
 *          type: object
 *          required:
 *              - ErrorCode
 *              - MessaggerError
 *      Articulos:
 *          type: object
 *          required:
 *              - id
 *              - nombre
 *              - marca
 *              - precio
 *              - disponibilidad
 *          properties:
 *              id:
 *                  type: string
 *                  description: ID autogenerado (NanoId)
 *              nombre:
 *                  type: string
 *                  description: Nome
 *              marca:
 *                  type: string
 *                  description: Marca
 *              precio:
 *                  type: decimal
 *                  description: Precio
 *              tamanio:
 *                  type: int
 *                  description: Tamaño
 *              color:
 *                  type: string
 *                  description: Color
 *              peso:
 *                  type: decimal
 *                  description: Peso
 *              disponibilidad:
 *                  type: string
 *                  description: Disponibilidad
 *          example:
 *              id: Gis123
 *              nombre: Leche
 *              marca: Gloria
 *              precio: 1
 *              tamanio: 8
 *              color: Celeste
 *              peso: 30
 *              disponibilidad: Si
 */

/**
 * @swagger
 *  /articulos
 *  /tags:
 *  description: Articulos
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          itemName:
 *                              type: string
 *      responses:
 *              description: La solicitud es incorrecta o faltan datos
 *          '500':
 *              description: Error interno en el servidor
 */



/**
 * @swagger
 *  /articulos:
 *  get:
 *      sumary: Devuelve la lista de articulos
 *      tags:   [Articulos]
 *      responses:
 *          200:
 *              description: Lista de los Articulos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Articulos'
 */
router.get("/",(req,res)=>{
    const articulos = req.app.db.get("articulos");
    res.send(articulos);
});


/**
 * @swagger
 *  /articulos/{id}:
 *  get:
 *      sumary: Devuelve un articulos
 *      tags:   [Articulos]
 *      parameters:
 *          name: id
 *          in: path
 *          schema:
 *              type: string
 *          required: true
 *          description: ID autogenerado (NanoId)
 *      responses:
 *          200:
 *              description: Exito al obtener un Articulos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Articulos'
 *          404:
 *              description: No se encontro el Articulo
 */
router.get("/:id",(req,res)=>{
    const articulo = req.app.db.get("articulos").find({id: req.params.id}).value();

    if(!articulo){
        res.sendStatus(404);
    }else{
        res.send(articulo);
    }
});

/**
 * @swagger
 *  /articulos:
 *  post:
 *      sumary: Registra un articulo
 *      tags:   [Articulos]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Articulos'
 *      responses:
 *          200:
 *              description: Registra un articulos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Articulos'
 *          500:
 *              description: Error interno del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          Error:
 *              type: object
 *              properties:
 *                  error:
 *                      type: string
 *              example:
 *                  error: "Ocurrió un error interno del servidor"
 */


router.post("/",(req,res)=>{
    
    try{
        if(!req.body.nombre){
            throw new Error("No se ingreso Nombre");
        }

        const articulo = {
            id: nanoid(idLength),
            ...req.body,
        };
    
        req.app.db.get("articulos").push(articulo).write();
        res.send(articulo);
    }catch(error){
        console.log(res.status(500).send(error));
        return { error: res.status(500).send(error)};
    }
});

/**
 * @swagger
 *  /articulos:
 *  put:
 *      summary: Registra un artículo
 *      tags:
 *          - Articulos
 *      description: Registra un nuevo artículo en el sistema
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Articulos'
 *      responses:
 *          '201':
 *              description: Error en la solicitud o datos de entrada inválidos
 *          '500':
 *              description: Error interno del servidor
 *          Error:
 *              type: object
 *              properties:
 *                  mensaje:
 *                      type: string
 *              example:
 *                  mensaje: "Error interno del servidor"
 */

router.put("/:id",(req,res)=>{
    try{
        req.app.db.get("articulos")
                .find({id: req.params.id})
                .assing(req.body)
                .write();

        res.send(req.app.db.get("articulos").find({id: req.params.id}));

    }catch(error){
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 * /articulos:
 *   delete:
 *     summary: Eliminar un artículo
 *     tags:
 *       - Articulos
 *     description: Elimina un artículo del sistema
 *     responses:
 *       '204':
 *         description: Artículo eliminado correctamente
 *       '404':
 *         description: El artículo no se ha encontrado
 *       '500':
 *         description: Error interno del servidor
 */


router.delete("/:id",(req,res)=>{
    req.app.db.get("articulos").remove({id: req.params.id}).write();

    res.sendStatus(200);
});

module.exports= router;
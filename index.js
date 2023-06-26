const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require ("swagger-jsdoc");

const artRouter = require("./routes/articulos");
const PORT = process.env.PORT || 10003;


//configuracion de base de datos
const FileDB = require("lowdb/adapters/FileSync");
const adapter = new FileDB("db.json");
const db = low(adapter);

db.defaults({articulos:[]}).write();

const app = express();
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/articulos",artRouter)

const options={
    definition:{
        openapi: "3.0.0",
        info:{
            title:"APIs - ventas",
            version:"1.0.0",
            description:"Demo libreria de APIs de ventas"
        },
        servers:[
            {
                url:"http://localhost:"+PORT,
            },
        ]
    },
    apis:["./routes/*.js"]
};
const specs=swaggerJSDoc(options);
app.use("/docs",swaggerUI.serve,swaggerUI.setup(specs));
app.listen(PORT,() => console.log(`El servidor esta es corriendo en el puerto ${PORT}`));



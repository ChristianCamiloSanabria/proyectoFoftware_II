import express from "express";

const router = express.Router();
import Client from "../schema/client.js";

import Student from "../schema/student.js";
import Subject from "../schema/subject.js";
import Inscription from "../schema/inscription.js";


/**
 Get para mostrar las tres colecciones (Estudiantes, Materias e Inscripciones)
 **/
router.get('/showDataClients', async (req, res) => {
    const clients = await Client.find();
    res.send("Clients:" + clients);
});


router.get('/', async (req, res) => {
    res.send("Hola");
});

/**
 * GET:
 *  Obtiene el ultimo cliente guardado en la base de datos usando
 *  la URL /show/last_saved_student
 **/
router.get("/show/last_saved_client", async (req, res) => {
    const listClient = await Client.find();
    let lastClient = "";
    listClient.forEach(function (element) {
        lastClient = element;
        console.log(lastClient);
    });

    res.status(200).send("GET:lastClient:" + lastClient);
});

/***
 * Get Client
 */
router.get('/getClient/', async (req, res) => {
    const client = await Client.find();
    let infoClient = null;
    let cedula = req.body.cedula;
    client.forEach(function (element) {
        if (cedula == element.cedula) {
            infoClient = element.toString();
            res.status(200).json({
                code: 200,
                message: 'Cliente encontrado',
                details: 'Cliente: ' + element.toString()
            });
        }
    });
    if (infoClient == null)
        res.status(404).json({
            code: 404,
            message: 'No se encuentra el Cliente',
            details: 'El Cliente: ' + id_inscription + ' no se encuentra en la base de datos'
        });
});


/***
 * ------------------------------------- END GET ------------------------------
 */


/***
 * Metodos PUT
 */

/***
 * PUT Cliente
 *  Actualiza los datos de un Cliente, a excepcion de la cedula
 */
router.put('/upDate/client/', async (req, res) => {
    try {
        const listClients = await Client.find();
        let paramForSearch = Number(req.body.cedula);
        let newClient = null;
        listClients.forEach(function (element) {
            if (element.cedula == paramForSearch) {
                element.name_client = req.body.name_client;
                element.lastname_client = req.body.lastname_client;
                element.direccion = req.body.direccion;
                console.log(element.toString());
                newClient = new Client(element);
                res.status(200).json({
                    code: 200,
                    message: 'Actualizacacion satisfactoria',
                    details: 'Actualizacion: ' + newClient.toString()
                });
            }
        });
        if (newClient == null)
            res.status(404).json({
                code: 404,
                message: 'No se encontro el cliente',
                details: 'La materia con codigo: ' + paramForSearch + ' no se encuentra en la base de datos'
            });
        else
            await newClient.save();

    } catch (error) {
        res.status(400).json({
            code: 400,
            message: 'No se puede tramitar la solicitud',
            details: error.toString()
        });
    }

});
/***
 * ---------------------------------------- END PUTS------------------------------------------
 */


/***
 * Servicios PATCH
 */


/***
 * Patch Client
 * Actualiza el estado de un Cliente
 */
router.patch("/patch/client", async (req, res) => {
    let body = req.body;
    Client.updateOne({cedula: body.cedula}, {status: {tipo: body.status}},
        function (error, info) {
            if (error) {
                res.json({
                    code: 400,
                    msg: 'Bad request'
                });
            } else if (info.matchedCount >= 1) {
                res.json({
                    code: 200,
                    msg: 'status change',
                    info: info
                });
            } else {
                res.json({
                    code: 404,
                    msg: 'Not Found'
                });
            }
        }
    );

});

/***
 * Patch Client-direccion
 * Actualiza la direcion de un cliente
 */

router.patch("/patch/client/direccion", async (req, res) => {
    let body = req.body;
    Client.updateOne({cedula: body.cedula}, {direccion: body.direccion},
        function (error, info) {
            if (error) {
                res.json({
                    code: 400,
                    msg: 'Bad request'
                });
            } else if (info.matchedCount >= 1) {
                res.json({
                    code: 200,
                    msg: 'direccion change',
                    info: info
                });
            } else {
                res.json({
                    code: 404,
                    msg: 'Not Found'
                });
            }
        }
    );
});


//-----------------------------END PATCH ------------------------


//--------------------------POST---------------------------------- //
/**
 ** POST "/add/client/:id_client/:number_document/:type_document/:name_client/:lastname_client/:code_client"
 ** Servicio de insertar a la DB un cliente.
 **/

router.post("/add/client/:id_client/:cedula/:name_client/:lastname_client/:direccion", async (req, res) => {
    try {
        const infoClient = req.params;
        console.log("Aqui llegan los parametros" + infoClient);
        const listClient = await Client.find();
        if (checkClient(infoClient, listClient)) {
            const client = new Client(infoClient);
            console.log("Aqui se crea el cliente:" + client);
            res.status(200).json({
                code: 200,
                message: 'Saved client' + await client.save(),
                details: 'Cliente registrado: ' + infoClient
            });
        } else {
            res.status(409).json({
                code: 409,
                message: 'El cliente ya se encuantra registrado o el codigo del cliente ya se encuantra asignado',
                details: 'Cliente posiblemente esta registrado: ' + infoClient
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).send("error"); //en caso de error respondemos al cliente con un 500
        res.status(500).json({
            code: 500,
            message: 'error',
            details: 'error Servidor no disponible '
        });
    }
});

/**
 ** POST "/add/client"
 ** Servicio de insertar a la DB un cliente.
 **/

router.post("/add/client", async (req, res) => {
    try {
        const infoClient = req.body;
        console.log("Aqui llegan los parametros" + infoClient);
        const listClient = await Client.find();
        if (checkClient(infoClient, listClient)) {
            const client = new Client(infoClient);
            console.log("Aqui se crea el cliente:" + client);
            res.status(200).json({
                code: 200,
                message: 'Saved client' + await client.save(),
                details: 'Cliente registrado: ' + infoClient
            });
        } else {
            res.status(409).json({
                code: 409,
                message: 'El cliente ya se encuantra registrado o el codigo del cliente ya se encuantra asignado',
                details: 'Cliente posiblemente esta registrado: ' + infoClient
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).json({
            code: 500,
            message: 'error',
            details: 'error Servidor no disponible '
        });
    }
});

/**
 ** function checkStudent:
 ** Verifica si un cliente ya se encuentra registrado en la base de datos.
 ** Return: un boleano que confirma si el cliente se encuentra o no.
 ** Parametros de entrada:
 client: Representa los datos del cliente que se quiere insertar en la DB,
 listClient: Listado de todos lo clientes actuales en la DB.
 **/
function checkClient(client, listClient) {
    let bolean = true;
    listClient.forEach(function (element) {
        if (element.name_client == client.name_client && element.lastname_client == client.lastname_client || element.code_client == client.code_client) {
            bolean = false;
        }
    });
    return bolean;
}


//--------------------------POST- END--------------------------------- //


export default router;
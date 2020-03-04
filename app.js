(async () => {
    const express = require('express');
    const mariadb = require('mariadb');
    const bodyParser = require('body-parser');
    var cpuCount = require('os').cpus().length;
    const DBClass = require('./db.connection.class');
    const config = require('./config');
    const port = config.port;
    const app = express();

    const connection = new DBClass(
        config.tradepro.host,
        config.tradepro.port,
        config.tradepro.user,
        config.tradepro.password,
        config.tradepro.database
    );
    await connection.connect();

    app
        .use((req, res, next) => {
            req.reqTime = Date.now();
            next();
        })
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({
            "extended": false
        }));
    var http = require('http').Server(app);
    const io = require('socket.io')(http);

    io.sockets.on('connection', async function(socket) {
        console.log('SOCKET INITIATED');
    });

    http.listen(port, (error) => {
        if (error) {
            console.error(error)
        } else {
            console.info(`server running ${port}`);
        }
    });
})()
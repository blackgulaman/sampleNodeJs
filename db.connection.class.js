const log = /* require('../functions/logger.fn'); */{
    info: console.info,
    error: console.error,
    warn: console.warn,
    debug: console.debug
}

/**
 * @author 
 * @description db connection class
 * @method constructor 
 * @method connect
 * @method query
 * 11/19/2019
 */
module.exports = class DBClass {

    /**
     * constructor
     * @param {string} host db hostname
     * @param {integer} port db port
     * @param {string} user db user
     * @param {string} pass db password
     * @param {string} database target database name
     */
    constructor(host = "localhost", port = 3306, user = "root", pass = "", database = "") {
        this.host = host;
        this.port = port;
        this.user = user;
        this.pass = pass;
        this.database = database;
        this.connection = null;
        this.error = null;
        this.connected = false;
        this.attempts = 0;
    }

    /**
     * connect
     * @description call connect to create db connection
     * @param {object} opt db connection option
     * @returns {boolean} true if connect is success and false if there's an error
     */
    async connect(opt) {
        let self = this;
        try {
            self.attempts++;
            // create connection
            let create = require('mariadb').createConnection(opt ? opt : {
                host: self.host,
                port: self.port,
                user: self.user,
                // password: self.pass,
                database: self.database,
                connectionLimit: 1
            });
            // get connection
            let connection = await create;
            // event error listener
            connection.on("error", error => {
                log.debug('DB -> db connection error');
                self.connection = null;
                self.error = error;
                self.connected = false;
                setTimeout(() => {
                    log.debug('DB -> attempt to reconnect ', self.attempts);
                    self.connect();
                }, (self.attempts * 100));
            });
            // check if connected
            (await connection.ping() === null) ? self.connected = true : self.connected = false;
            log.debug(`DB -> db connected ${self.connected} ${self.host}:${self.port}`)
            if (self.connected) self.error = null;
            // set connection
            if (self.connected) self.connection = connection;
            return true;
        } catch (error) {
            log.debug('DB -> db connection throw error');
            self.connection = null;
            self.error = error;
            self.connected = false;
            setTimeout(() => {
                log.debug('DB -> attempt to reconnect ', self.attempts);
                self.connect();
            }, (self.attempts * 100));
            return false;
        }
    }

    /**
     * query
     * @param {string} query db query
     * @returns {boolean} result of query
     * @throws {error} if theres a problem in the query of no db connection
     */
    async query(query, args) {
        try {
            if (this.connection) {
                let result = await this.connection.query(query, args)
                return result;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async destroy() {
        try {
            await this.connection.destroy();
            return true;
        } catch (error) {
            log.warn(`DB -> cannot destroy ${process.pid}`);
        }
    }

}
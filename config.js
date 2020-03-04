const ENV 	 = process.env;

module.exports = {
	/**
	 * service connection
	 * 
	 * @param	{string}	NODE_PORT
	 * @param	{string}	NODE_HOST
	 */
	port 	: ENV.NODE_PORT || 2000,
	ip 		: ENV.NODE_HOST || 'localhost',

	/**
	 * mysql database connection
	 * 
	 * @param	{string}	DB_HOST
	 * @param	{string}	DB_PORT
	 * @param	{string}	DB_USER
	 * @param	{string}	DB_PASSWORD
	 */
	tradepro 	: {
		host 		: 'localhost', 
		port 		: 3306,
		user 		: 'root',
		password	: 'asdf1234*',
		database 	: 'tradepro',
	}
};

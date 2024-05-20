process.env.ORA_SDTZ = 'Asia/Seoul';
const oracledb = require('oracledb');
oracledb.autoCommit = true

oracledb.initOracleClient({ libDir: 'C:/Users/smhrd/Desktop/instantclient' });

const dbConfig = {
  user: 'cgi_24IS_IoT3_p2_4', 
  password: 'smhrd4', 
  connectString: 'project-db-cgi.smhrd.com:1524/xe'
}

async function connectToOracle() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
        console.log('Successfully connected to Oracle database');
        await connection.execute(`ALTER SESSION SET TIME_ZONE='UTC'`);
        return connection;

  } catch (err) {
    console.error('Connection failed: ', err);
  }
}

module.exports = {
  connectToOracle: connectToOracle
};

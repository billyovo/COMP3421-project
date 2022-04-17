const sql = require('mssql');
require('dotenv').config();
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
};
 

sql.connect(config,function (err) {
  if(err){ 
    console.log(err);
    process.exit();
  }
});
async function query(query, parameters){
  const request = new sql.PreparedStatement();
  for(const property in parameters){
    request.input(property, Number.isInteger(parameters[property]) || parameters[property] == null? sql.Int : sql.Text);
  }
  await request.prepare(query);
  const result = await request.execute(parameters);
  request.unprepare();
  return result.recordsets[0];
}

module.exports = {
  query: query
}
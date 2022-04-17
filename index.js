const express = require('express')
const db = require("./helpers/database.js");
const bodyParser = require('body-parser');
const app = express();
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/name_availability', async (req, res) => {
    const name = req.body.name;
    try{
      const result = await db.query('EXEC is_duplicate_username @user_name', {user_name: name});
        res.status(result[0].is_duplicate ? 409 : 200).send();
    }
    catch(error){
      res.status(400).send();
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

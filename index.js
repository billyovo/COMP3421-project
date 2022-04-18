const express = require('express')
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const db = require("./helpers/database.js");
const crypto = require("./helpers/crypto.js");
const auth = require("./middleware/auth.js");

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(helmet());

//---------------------------------------auth functions------------------------------------------
app.post('/auth/name_availability', async (req, res) => {
  const name = req.body.name;
  try{
    const result = await db.query('EXEC is_duplicate_username @user_name', {user_name: name});
    res.status(result[0].is_duplicate ? 409 : 200).send();
  }
  catch(error){
    res.status(400).send();
  }
});

app.post('/auth/register',async (req, res)=>{
  const name = req.body.username;
  const password = req.body.password;
  if(name.match(/[!@#$%^&*()+ \-=\[\]{};':"\\|,.<>\/?]/)){
    res.status(400).send("Name cannot contain special character or spect except underscore!");
    return;
  }

  try{
    const salt = crypto.getRandomBytes();
    const hash = crypto.SHA256(password+salt);
    await db.query('EXEC register @user_name, @password, @salt', 
      {
        user_name: name,
        password: hash,
        salt: salt
      }
    );
    res.status(201).send();
  }
  catch(error){
    switch(error.number){
      case 2627:{
        res.status(400).send("duplicate user name found!");
        break;
      }
      default:{
        res.status(400).send("Unknown error occured!");
        break;
      }
    }
  }
})

app.post('/auth/login',async (req, res, next)=>{
  const user_name = req.body.user_name;
  const password = req.body.password;
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  const salt = await db.query('EXEC get_salt_by_username @user_name', {user_name: user_name});
  if(!salt[0]){
    res.status(401).send("Wrong credientials!");
  }
  const hash = crypto.SHA256(password+salt[0].password_salt);
  const result = await db.query('EXEC is_valid_login @user_name, @password_hash',{
    user_name: user_name,
    password_hash: hash
  })
  switch(result.length){
    case 1:{
      const refresh_token = crypto.signRefreshToken(result[0].user_name, result[0].userID);
      res.cookie('refresh_token', refresh_token, 
        { 
          secure: true,
          httpOnly: true,
          maxAge: 1209600000
        }
      );
      res.status(200).send({
        user_name: result[0].user_name,
        userID: result[0].userID
      })
      break;
    }
    case 0:{
      res.status(401).send("Wrong credientials!");
      break;
    }
    default:{
      res.status(400).send("An error occured!");
      break;
    }
  }
})

app.post('/auth/refresh_access',async (req, res)=>{
  const refresh_token = req.cookies.refresh_token;
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  if(!refresh_token || !crypto.verifyToken(refresh_token, 'refresh')){
    res.status(401).send("Please log in!");
  }
  else{
    const access_token = crypto.signAccessToken(refresh_token);
    res.cookie('access_token', access_token, 
        { 
          secure: true,
          httpOnly: true,
          maxAge: 43200000
        }
      );
    if(req.query.referrer){
      res.redirect(307,req.query.referrer);
    }
    else{
      res.status(200).send();
    }
  }
})

//--------------------------------------------------post functions----------------------------------------------------------
app.post('/api/create_post',auth.authMiddleware, async(req,res)=>{
  try{
    await db.query('EXEC create_post @category, @title, @content, @authorID',{
      category: req.body.category,
      title: req.body.title,
      content: req.body.content,
      authorID: req.body.userID
    });
    res.status(201).send();
  }
  catch(error){
    res.status(400).send(error.message);
  }
  })

  app.post('/api/reply_post',auth.authMiddleware, async(req,res)=>{
    try{
      await db.query('EXEC reply_post @content, @authorID, @postID, @reply_to_order',{
          content: req.body.content,
          authorID: req.body.userID,
          postID: req.body.postID,
          reply_to_order: req.body.reply_to_order
      })
      res.status(201).send();
    }
    catch(error){
      res.status(400).send(error.message);
    }
  })

  app.post('/api/vote_post',auth.authMiddleware, async(req,res)=>{
    try{
      await db.query('EXEC vote_reply @replyID, @userID, @voteType',{
          replyID: req.body.replyID,
          userID: req.body.userID,
          voteType: req.body.voteType
      })
      res.status(201).send();
    }
    catch(error){
      res.status(400).send(error.message);
    }
  })
  
//--------------------------------------get functions--------------------------------------
app.get('/api/category',async(req,res)=>{
  try{
    const result = await db.query('EXEC get_category');
    res.status(200).send(result);
  }
  catch(error){
    res.status(400).send(error.message);
  }
})

app.get('/api/category/:category/page/:page',async(req,res)=>{
  try{
    const category = parseInt(req.params.category);
    const page = parseInt(req.params.page);
    const result = await db.query('EXEC get_post_by_category @category, @page',{
      category: category,
      page: page
    });
    res.status(200).send(result);
  }
  catch(error){
    res.status(400).send(error.message);
  }
})
app.get('/api/category/:category/page',(req,res)=>{
  const category = req.params.category;
  res.redirect(302, '/api/category/'+category+'/page/1')
})
app.get('/api/category/:category',(req,res)=>{
  const category = req.params.category;
  res.redirect(302, '/api/category/'+category+'/page/1')
})
app.get('/api/post/:postID/page',(req,res)=>{
  const postID = req.params.postID;
  res.redirect(302, '/api/post/'+postID+'/page/1')
})

app.get('/api/post/:postID',(req,res)=>{
  const postID = req.params.postID;
  res.redirect(302, '/api/post/'+postID+'/page/1')
})

app.get('/api/post/:postID/page/:page',async(req,res)=>{
  try{
    const postID = parseInt(req.params.postID);
    const page = parseInt(req.params.page);
    const result = await db.query('EXEC get_reply_by_postID @postID, @page',{
      postID: postID,
      page: page
    });
    res.status(200).send(result);
  }
  catch(error){
    res.status(400).send(error.message);
  }
})

app.listen(port, () => {
  console.log(`API running on port ${port}`)
})

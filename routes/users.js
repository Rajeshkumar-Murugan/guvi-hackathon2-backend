process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testingforweb01@gmail.com',
    pass: 'Password!23'
  }
});


var express = require('express');
var router = express.Router();

// Authcodes starts
const {hashing,hashcompare,createJWT, authentication} = require('../library/auth')
var router = express.Router();
// Authcodes ends

//Mongodb set starts
const {dbUrl,mongodb,MongoClient,dbName} = require('../dbConfig');

//mongodb set ends

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Authcodes starts*/
router.post('/register', async(req, res, next)=> {
  const client = await MongoClient.connect(dbUrl)

  try {
    const db =await client.db(dbName);
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user){
      res.json({
        message:"User already exist/Account is not activated"
        
      })
    }
    else{
      const hash = await hashing(req.body.password);
      req.body.password = hash;
      //JWT starts
      let account = {
        email:req.body.email,
        password:hash,
        name:req.body.name,
        phone:req.body.phone,
        verify:'N'
      }

      let document = await db.collection('auth').insertOne(account);
      const token = await createJWT({email:req.body.email})
      
      var mailOptions = {
        from: 'testingforweb01@gmail.com',
        to: account.email,
        subject: 'Verification token',
        html: ` 
          <form action="https://ticketbooking-server.herokuapp.com/users/verify-token/${token}" method="POST">
          <input type="submit" name="Click here" value="Click here"> to verify your email ID
          </form>
        `                
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.json({
        message:"Please check your mail to verify your account",
      })
    }
    
  } catch (error) {
    res.send(error);
  }
  finally{
    client.close();
  }
})

router.post('/login', async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db =await client.db(dbName);
    let user = await db.collection('auth').findOne({email:req.body.email})
// check if user is available
    if(user && user.verify == 'Y'){
      const compare = await hashcompare(req.body.password,user.password);
      if(compare===true){
        res.json({
          message:"Login successfully",
          data:user
        })}
      else{
        res.json({
          message:"Invalid password"
        })
        }
      }
        else{
          res.json({
            message:"User doesnot exist/Account Not verified"
          })
          }

  } 
  catch (error) {
    res.send(error);
  }
  finally{
    client.close()
  }
})

router.post('/verify-token/:token', async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {

    const validity =await authentication(req.params.token)
    if(validity.validity==true)
    {
      const db =await client.db(dbName);
      const user = await db.collection('auth').updateOne({email:validity.email},{$set:{verify:'Y'}})
      res.send(`
      <center>
            <img src='https://image.apktoy.com/img/2c/com.bt.bms/icon.png' alt='logo'/>
            </center>
            <h4>Email Verification<h4><br>
     <p> Email verified successfully. Please <a href="https://priceless-ritchie-d27cd9.netlify.app/">Click here</a> to login</p>`);
    }
  else{
    res.send(`
            <center>
            <img src='https://image.apktoy.com/img/2c/com.bt.bms/icon.png' alt='logo'/>
            </center>
            <h4>Token Expired successfully<h4>
  `);
  }
    
  } catch (error) {
    console.log(error)
    res.json({
      message:"Error occured"
    })
  }
})

router.post('/forget-password', async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db =await client.db(dbName);
    let user = await db.collection('auth').findOne({email:req.body.email})
    let keyvalue = (Math.random() + 1).toString(36).substring(7)

    if(user){      
        let data =  await db.collection('auth').updateOne({email:req.body.email}, {$set:{key:keyvalue}})
        
        var mailOptions = {
          from: 'testingforweb01@gmail.com',
          to: user.email,
          subject: 'Password Reset Mail',
          html: ` 
          <center>
            <img src='https://image.apktoy.com/img/2c/com.bt.bms/icon.png' alt='logo'/>
            </center>
            <h4>Password Reset Link<h4><br>
            <p> Please click confirm button to set new password</p><br>
            <form action="https://ticketbooking-server.herokuapp.com/users/forget-password/link/${keyvalue}" method="POST">           
            <input type="submit" name="Confirm" value="Confirm">
            </form>
          ` };
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          res.json({
              message:"Please check mail to reset password",
              data:{
                email:user.email, keyvalue}  
            })                      
    }
  else
  {
    res.json({
      message:"User doesnot exist/Account not verified"
    })
  }
  } 
  catch (error) {
    res.send(error);
  }
  finally{
    client.close()
  }
})

router.post('/forget-password/link/:key', async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db = await client.db(dbName);
    
    let keycheck = await db.collection('auth').findOne({key:req.params.key})

    if(keycheck)
    {
      let keys = req.params.key
       res.send(`
       <!DOCTYPE html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Add icon library-->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
        }
        * {
            box-sizing: border-box;
        }
        .input-container {
            display: -ms-flexbox;
            display: flex;
            width: 100%;
            margin-bottom: 15px;
        }
        .icon {
            padding: 10px;
            background: green;
            color: white;
            min-width: 50px;
            text-align: center;
        }
        .input-field {
            width: 100%;
            padding: 10px;
            outline: none;
        }
        .input-field:focus {
            border: 2px solid dodgerblue;
        }
       
        .btn {
            background-color: grey;
            color: white;
            padding: 15px 20px;
            border: none;
            cursor: pointer;
            width: 100%;
            opacity: 0.9;
        }
        .btn:hover {
            opacity: 1;
        }
        .fa-passwd-reset>.fa-lock {
            font-size: 0.85rem;
        }
    </style>
    <script>
        let check = function() {
            if (document.getElementById('password-1').value == document.getElementById('password-2').value) {
                document.getElementById("formSubmit").disabled = false;
                document.getElementById("formSubmit").style.background = 'blue';
                document.getElementById('message').style.color = 'green';
                document.getElementById('message').innerHTML = 'Password Matched';
            } else {
                document.getElementById("formSubmit").disabled = true;
                document.getElementById("formSubmit").style.background = 'grey';
                document.getElementById('message').style.color = 'red';
                document.getElementById('message').innerHTML = 'Password not matching';
            }
        }
        let validate = function() {
            console.log(document.getElementById('password-1').value)
            console.log(document.getElementById('password-2').value)
            if (document.getElementById('password-1').value.length < 5) {
                document.getElementById('pwd-length-1').innerHTML = 'Minimum 6 characters';
            } else {
                document.getElementById('pwd-length-1').innerHTML = '';
                check();
            }
            if (document.getElementById('password-2').value.length < 5) {
                document.getElementById('pwd-length-2').innerHTML = 'Minimum 6 characters';
            } else {
                document.getElementById('pwd-length-2').innerHTML = '';
                check();
            }
        }
    </script>
</head>
<body>
<form action="https://ticketbooking-server.herokuapp.com/users/forget-password/update/${keys}", method="POST" style="max-width:500px;margin:auto">
<center>
<img src='https://image.apktoy.com/img/2c/com.bt.bms/icon.png' alt='logo'/>
</center>
  <!-- Title  -->
  <center>
      <h2><span class="fa-passwd-reset fa-stack"><i class="fa fa-undo fa-stack-2x"></i><i class="fa fa-lock fa-stack-1x"></i></span>Reset your Password<span class="fa-passwd-reset fa-stack"><i class="fa fa-undo fa-stack-2x"></i><i class="fa fa-lock fa-stack-1x"></i></span></h2>
  </center>
  <!-- First InpuText  -->
  <div class="input-container"><i class="fa fa-key icon"></i>
      <input class="input-field" id="password-1" type="password" placeholder="Type your new password" name="password" oninput='validate();'>
  </div>
  <!-- Length  -->
  <span id="pwd-length-1"></span>
  <!-- Second Input Text  -->
  <div class="input-container"><i class="fa fa-key icon"></i>
      <input class="input-field" id="password-2" type="password" placeholder="Re-type your new password" name="confirmPassword" oninput='validate();'>
  </div>
  <!-- Length  -->
  <span id="pwd-length-2"></span>
  <!-- Validation Message - 1  -->
  <span id="message"></span>
  <button class="btn" id="formSubmit" type="submit" disabled>Register</button>
</form>   
<div class="status"></div>
</body>
</html>
        `)          
  }
  else{
    res.send(`
    <center>
    <img src='https://image.apktoy.com/img/2c/com.bt.bms/icon.png' alt='logo'/>
    </center>
    <p> Link is invalid, Please click on forget password again to generate new link</p>`)
  }
  res.send(hash)
  } 
  catch (error) {
    res.send(error);
  }
  finally{
    client.close()
  }
})

router.post('/forget-password/update/:key', async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db = await client.db(dbName);
    

    let keycheck = await db.collection('auth').findOne({key:req.params.key})

    if(keycheck)
    {
        const hash = await hashing( req.body.password)
        req.body.password = hash;  
        let Verified = await db.collection('auth').updateOne({email:keycheck.email},{$set:{password:hash}})
        res.send(`
        <center>
        <img src='https://image.apktoy.com/img/2c/com.bt.bms/icon.png' alt='logo'/>
        </center>
        <p>Password updated Successfully, Please <a href="https://priceless-ritchie-d27cd9.netlify.app/">Click Here</a> to login</p>`)                   
  }
  else{
        res.send(`
        <center>
        <img src='https://image.apktoy.com/img/2c/com.bt.bms/icon.png' alt='logo'/>
        </center>
        Key is invalid, please click forget password link again to generate new key
        `)
  }
  
  } 
  catch (error) {
    res.send(error);
  }
  finally{
    client.close()
  }
})

router.put('/reset-password', async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db =await client.db('FSD');
    let user = await db.collection('auth').findOne({email:req.body.email})

    if(user){
     const compare = await hashcompare(req.body.OldPassword,user.password);
     if(compare){
      const hash = await hashing(req.body.password);
      let document = await db.collection('auth').updateOne({email:req.body.email},{$set:{password:hash}})
      res.json({
        message:"Password Updated Successfully"
      })
     }
     else{
      res.json({
        message:"Invalid Password"
      })
     }
      
    }
    else{
          res.json({
            message:"User doesnot exist"
          })
          }

  } 
  catch (error) {
    res.send(error);
  }
  finally{
    client.close()
  }
})

// Authcodes ends




module.exports = router;

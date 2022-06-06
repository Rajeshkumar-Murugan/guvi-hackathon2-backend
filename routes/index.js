var express = require('express');
const client = require('nodemon/lib/cli');
var router = express.Router();
const {dbUrl,mongodb,MongoClient,dbName} = require('../dbConfig')


/* GET home page. */
router.get('/', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('business').find().toArray()
     res.json({
       statusCode:200,
       message:"Business Fetched Sucessfully",
       data: business
     })

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});
router.get('/theater/:name', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('business').find({moviename:req.params.name}).toArray()
    if(business){
      res.json({
        statusCode:200,
        message:"BusinessFetched Sucessfully",
        data: business
      })
    }
    else{
      res.json({
        statusCode:500,
        message:"Movie is not Fetched Sucessfully",
      })
    }
    

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"InternalServer Error" 
    })
  }
  finally{
    client.close()
  }

});

router.get('/theater/:name/:thName', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('business').find({moviename:req.params.name, thName:req.params.thName}).toArray()
    if(business){
      res.json({
        statusCode:200,
        message:"Business Fetched Sucessfully",
        data: business
      })
    }
    else{
      res.json({
        statusCode:500,
        message:"Movie is not Fetched Sucessfully",
      })
    }
    

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});

router.get('/user', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('auth').find().toArray()
     res.json({
       statusCode:200,
       message:"Business Fetched Sucessfully",
       data: business
     })

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});

//Get Movies data
router.get('/movies', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('moviesdata').find().toArray()
     res.json({
       statusCode:200,
       message:"Movies Fetched Sucessfully",
       data: business
     })

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});


// Get Request with ID
router.get('/:id', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('business').findOne({_id: mongodb.ObjectId(req.params.id)})
     res.json({
       statusCode:200,
       message:"Theaterdatas Fetched Sucessfully",
       data: business
     })

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});

router.get('/movies/:id', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('moviesdata').findOne({_id: mongodb.ObjectId(req.params.id)})
     res.json({
       statusCode:200,
       message:"Movie data Fetched Sucessfully",
       data: business
     })

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});




// Post Request

router.post('/',async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db = await client.db(dbName)
    let business = await db.collection('business').findOne({thName:req.body.thName,thMovie:req.body.thMovie})
    if(business){
      res.json({
        statusCode:400,
        message:"Theater Already Exists"
      })
    }
    else{
      const business =await db.collection('business').insertOne(req.body)
      res.json({
        statusCode:200,
        message:"Business Created Sucessfully",
        data:business
      })

    }
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
    
  }
  finally{
client.close()

  }
})


// Put Request with ID
router.put('/',async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db = await client.db(dbName)
    
    let business = await db.collection('business').findOneAndReplace({thName:req.body.thName},req.body
    //   {
    //     businessName:req.body.businessName,
    //     email:req.body.email,
    //     mobile:req.body.mobile,
    //     address:req.body.address,
    //     city:req.body.city,
    //     state:req.body.state,
    //     Zipcode:req.body.Zipcode,
    // }
    )
    res.json({
      statusCode:200,
      message:"Bussiness Edited Successfully"
    })
    
   
    
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
    
  }
  finally{
client.close()

  }
})

// Delete Request with ID
router.delete('/:id', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('business').deleteOne({_id:mongodb.ObjectId(req.params.id)})
     res.json({
       statusCode:200,
       message:"Business Deleted Sucessfully",
     })

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});


//Movies set
router.post('/addmovies',async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db = await client.db(dbName)
    let business = await db.collection('moviesdata').findOne({moviename:req.body.moviename,moviedes:req.body.moviedes,movieimg:req.body.movieimg })
    if(business){
      res.json({
        statusCode:400,
        message:"Movie Already Exists"
      })
    }
    else{
      const business =await db.collection('moviesdata').insertOne(req.body)
      res.json({
        statusCode:200,
        message:"Movie added Sucessfully",
        data:business
      })

    }
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
    
  }
  finally{
client.close()

  }
})


// Put Request with ID
router.put('/editmovie',async(req, res)=>{
  const client = await MongoClient.connect(dbUrl)

  try {
    const db = await client.db(dbName)
    
    let business = await db.collection('moviesdata').findOneAndReplace({moviename:req.body.moviename},req.body
   
    )
    res.json({
      statusCode:200,
      message:"Movie data updated Successfully"
    })
    
   
    
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
    
  }
  finally{
client.close()

  }
})

// Delete Request with ID
router.delete('/deleteMovie/:id', async(req, res, next)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const db = await client.db(dbName)
    let business = await db.collection('moviesdata').deleteOne({_id:mongodb.ObjectId(req.params.id)})
     res.json({
       statusCode:200,
       message:"Movie Deleted Sucessfully",
     })

  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error" 
    })
  }
  finally{
    client.close()
  }

});


// });

module.exports = router;

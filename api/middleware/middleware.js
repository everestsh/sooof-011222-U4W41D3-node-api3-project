const User = require('../users/users-model')


function logger(req, res, next) {
  // DO YOUR MAGIC
  const timestamp = new Date().toLocaleString()
  const method = req.method
  const url = req.originalUrl
  console.log(`[${timestamp}] ${method} to ${url}`)
  // console.log("logger midlleware")
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  // console.log("validateUserId midlleware")
  try{
    const user = await User.getById(req.params.id)
    if(!user){
      res.status(404).json({message: "user not found"  })
      // next({message:"user not found", status: 404  })
    }else{
      req.user = user
      next()
    }
  }catch(err){
    res.status(500).json({message: "Wrong"} )
    next()
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  // console.log("validateUser midlleware")
  try{
    const {name} = req.body
    if(!name || !name.trim()){
      res.status(400).json({message: "missing required name field" })
    }else{
      req.name = name.trim()
      next()
    }
  }catch(err){
    res.status(500).json({message: "Wrong"})
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  // console.log("validatePost midlleware")
  try{
    const {text} = req.body
    if(!text || !text.trim()){
      res.status(400).json({message: "missing required text field" })
    }else{
      req.text = text.trim() 
      next()
    }
  }catch(err){
    res.status(500).json({message: "Wrong"})
  } 
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}

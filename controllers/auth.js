// const User=require('../models/User')
// const{StatusCodes}=require('http-status-codes')
// const bcrypt=require('bcryptjs')
// // const register=async(req,res)=>{
// //     const user=await User.create({...req.body})
// //     res.status(StatusCodes.CREATED).json({user})
// // }
// const register = async (req, res) => {
//     const {name, email, password} = req.body
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password,salt)
//     const tempUser = {name, email, password:hashedPassword}
//     const user = await User.create({...tempUser})
//     res.status(StatusCodes.CREATED).json({user})
// }
// const login=async(req,res)=>{
//     res.send('login user')
// }






const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt=require('jsonwebtoken')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
  }


const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports={
    register,login,
}




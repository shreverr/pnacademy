import type { Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import User from '../model/user/User'
import Password from '../model/user/Password'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import RefreshToken from '../model/user/RefreshToken'

const generateAccessToken = async (user: any) => {
  return await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET ?? '', { expiresIn: '15m' })
}

export const registerUser: RequestHandler = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() })
  }

  try {
    let user = await User.findOne({ where: { email: req.body.email } })
    if (user !== null) return res.status(400).json({ error: 'Email already exists' })

    user = await User.create({
      userId: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      jobTitle: req.body.jobTitle,
      department: req.body.department,
      hireDate: req.body.hireDate,
      joiningDate: req.body.joiningDate,
      isAdmin: req.body.isAdmin,
      role: req.body.role
    })

    const hashedPassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
    const password = await Password.create({
      userId: user.dataValues.userId,
      password: hashedPassword
    })

    return res.status(201).json({
      user: { ...user.dataValues },
      status: 'success'
    })
  } catch (error: any) {
    console.log(`Error querying DB while registering user: ${error}`)
    return res.status(500).json({ error: `Error querying DB while registering user: ${error}` })
  }
}

export const updateUserInfo: RequestHandler = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() })
  }

  try {
    const user = await User.findOne({ where: { userId: req.body.userId } })
    if (user === null) {
      return res.status(404)
        .json({ error: 'User not found. Please check userId' })
    }

    await User.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      jobTitle: req.body.jobTitle,
      department: req.body.department,
      hireDate: req.body.hireDate,
      joiningDate: req.body.joiningDate,
      isAdmin: req.body.isAdmin,
      role: req.body.role
    }, {
      where: {
        userId: req.body.userId
      }
    })

    return res.status(200).json({
      status: 'success'
    })
  } catch (error: any) {
    console.log(`Error querying DB while updating user: ${error}`)
    return res.status(500).json({ error: `Error querying DB while updating user: ${error}` })
  }
}

export const findOneUser: RequestHandler = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() })
  }

  try {
    const user = await User.findOne({ where: { userId: req.query.userId } })
    if (user === null) {
      return res.status(404)
        .json({ error: 'User not found. Please check userId' })
    }

    return res.status(200).json({
      user: { ...user.dataValues },
      status: 'success'
    })
  } catch (error: any) {
    console.log(`Error querying DB while finding user: ${error}`)
    return res.status(500).json({ error: `Error querying DB while finding user: ${error}` })
  }
}

export const findAllUsers: RequestHandler = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() })
  }

  try {
    const user = await User.findAll({
      where: {
        ...req.query
      }
    })

    if (user === null) {
      return res.status(404)
        .json({ error: 'User not found. Please check userId' })
    }

    return res.status(200).json({
      user: { ...user },
      status: 'success'
    })
  } catch (error: any) {
    console.log(`Error querying DB while finding users: ${error}`)
    return res.status(500).json({ error: `Error querying DB while finding users: ${error}` })
  }
}

export const deleteUser: RequestHandler = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() })
  }

  try {
    const user = await User.findOne({ where: { userId: req.body.userId } })
    if (user === null) {
      return res.status(404)
        .json({ error: 'User not found. Please check userId' })
    }

    await User.destroy({
      where: {
        userId: req.body.userId
      }
    })

    return res.status(200).json({
      status: 'success'
    })
  } catch (error: any) {
    console.log(`Error querying DB while deleting user: ${error}`)
    return res.status(500).json({ error: `Error querying DB while deleting user: ${error}` })
  }
}

export const loginUser: RequestHandler = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() })
  }

  try {
    //join password and refreshtoken table
    const user = await Password.findOne({
      attributes: ['userId', 'password'],
      include: [{
        model: RefreshToken,
        attributes: ['refreshToken'],
     required: false
       }],
      where: {
        userId: req.body.userId
      }
    })
    
    if (user === null) {
      return res.status(404)
      .json({ error: 'User not found. Please check userId' })
    }

    // const refreshToken = user?.dataValues.RefreshToken.dataValues.refreshToken

    const validPassword = await bcrypt.compare(req.body.password, user.dataValues.password)
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    const accessToken = await generateAccessToken({ userId: user.dataValues.userId })
    const refreshToken = await jwt.sign({ userId: user.dataValues.userId }, process.env.REFRESH_TOKEN_SECRET ?? '', { expiresIn: '7d' })

    await RefreshToken.create({
      userId: user.dataValues.userId,
      refreshToken: refreshToken
    })

    return res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      status: 'success'
    })
  } catch (error: any) {
    console.log(`Error querying DB while Loging in: ${error}`)
    return res.status(500).json({ error: `Error querying DB while Loging in: ${error}` })
  }
}

// export const newAccessToken: RequestHandler = async (req: Request, res: Response) => {
//   const result = validationResult(req)
//   if (!result.isEmpty()) {
//     return res.status(400).send({ errors: result.array() })
//   }

//   try {
//     const refreshToken = req.body.refreshToken
//     jwt.verify(refreshToken as string, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
//       if (err) {
//         return res.status(498).json({ error: 'Invalid token' })
//       }
      
//       req.user = user
//     })
//     return res.status(200).json({
//       // accessToken: accessToken,
//     })
//   } catch (error: any) {
//     console.log(`Error querying DB while Loging in: ${error}`)
//     return res.status(500).json({ error: `Error querying DB while Loging in: ${error}` })
//   }
// }

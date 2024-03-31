import type { Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import User from '../model/user/User'
import Password from '../model/user/Password'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Tests from '../model/tests/Test'
import logger from '../config/logger'
import Questions from '../model/tests/Questions'
import options from '../model/tests/Options'

export const createTest: RequestHandler = async (req: Request, res: Response) => {
  // const data = {
  //   createdBy: "ed0ae55a-8de4-45df-bbf7-f61ef2687156",
  //   testName: "my demo",
  //   status: "active",
  //   questions: [
  //     {
  //       questionText: "What is the capital of India?",
  //       marks: 5,
  //       options: [
  //         {
  //           optionText: "Delhi",
  //           isCorrect: true
  //         },
  //         {
  //           optionText: "haryana",
  //           isCorrect: false
  //         },
  //         {
  //           optionText: "up",
  //           isCorrect: false
  //         },
  //         {
  //           optionText: "bihar",
  //           isCorrect: false
  //         }
  //       ]
  //     },
  //     {
  //       questionText: "jahdfbjkvjdf",
  //       marks: 5,
  //       options: [
  //         {
  //           optionText: "this one is correct",
  //           isCorrect: true
  //         },
  //         {
  //           optionText: "dffdfdfd",
  //           isCorrect: false
  //         },
  //         {
  //           optionText: "dfdf",
  //           isCorrect: false
  //         },
  //         {
  //           optionText: "dfffdfdf",
  //           isCorrect: false
  //         }
  //       ]
  //     }
  //   ]
  // }
  

  try {
    const test = await Tests.create({
      createdBy: req.body.createdBy,
      testName: req.body.testName,
      testId: uuidv4(),
      status: req.body.status
    })

    const testId = test.getDataValue('testId')

    const questions = req.body.questions
    questions.forEach(async (question: any) => {
      const questionId = uuidv4()
      const que = await Questions.create({
        createdBy: req.body.createdBy,
        questionId: questionId,
        testId: testId,
        questionText: question.questionText,
        marks: question.marks
      })

      question.options.forEach(async (option: any) => {
        const optionId = uuidv4()
        await options.create({
          createdBy: req.body.createdBy,
          questionId: questionId,
          optionId: optionId,
          optionText: option.optionText,
          isCorrect: option.isCorrect
        })
      })
    });


    return res.status(201).json({
      status: 'success',
      test: { ...test.dataValues }
    })
  } catch (error: any) {
    console.log(`Error querying DB while registering user: ${error}`)
    return res.status(500).json({ error: `Error querying DB while registering user: ${error}` })
  }
}

// export const updateUserInfo: RequestHandler = async (req: Request, res: Response) => {
//   const result = validationResult(req)
//   if (!result.isEmpty()) {
//     return res.status(400).send({ errors: result.array() })
//   }

//   try {
//     const user = await User.findOne({ where: { userId: req.body.userId } })
//     if (user === null) {
//       return res.status(404)
//         .json({ error: 'User not found. Please check userId' })
//     }

//     await User.update({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       dateOfBirth: req.body.dateOfBirth,
//       gender: req.body.gender,
//       phoneNumber: req.body.phoneNumber,
//       address: req.body.address,
//       jobTitle: req.body.jobTitle,
//       department: req.body.department,
//       hireDate: req.body.hireDate,
//       joiningDate: req.body.joiningDate,
//       isAdmin: req.body.isAdmin,
//       role: req.body.role
//     }, {
//       where: {
//         userId: req.body.userId
//       }
//     })

//     return res.status(200).json({
//       status: 'success'
//     })
//   } catch (error: any) {
//     console.log(`Error querying DB while updating user: ${error}`)
//     return res.status(500).json({ error: `Error querying DB while updating user: ${error}` })
//   }
// }

// export const findOneUser: RequestHandler = async (req: Request, res: Response) => {
//   const result = validationResult(req)
//   if (!result.isEmpty()) {
//     return res.status(400).send({ errors: result.array() })
//   }

//   try {
//     const user = await User.findOne({ where: { userId: req.query.userId } })
//     if (user === null) {
//       return res.status(404)
//         .json({ error: 'User not found. Please check userId' })
//     }

//     return res.status(200).json({
//       user: { ...user.dataValues },
//       status: 'success'
//     })
//   } catch (error: any) {
//     console.log(`Error querying DB while finding user: ${error}`)
//     return res.status(500).json({ error: `Error querying DB while finding user: ${error}` })
//   }
// }

export const findTests: RequestHandler = async (req: Request, res: Response) => {
  // const result = validationResult(req)
  // if (!result.isEmpty()) {
  //   return res.status(400).send({ errors: result.array() })
  // }

  // {
  //   userId: "ed0ae55a-8de4-45df-bbf7-f61ef2687156"
  // }

  try {
    // const user = await User.findAll({
    //   where: {
    //     ...req.query
    //   }
    // })

    // if (user === null) {
    //   return res.status(404)
    //     .json({ error: 'User not found. Please check userId' })
    // }

    // return res.status(200).json({
    //   user: { ...user },
    //   status: 'success'
    // })

    // const tests = await Tests.findAll({
    //   include: [
    //     {
    //       model: Questions,
    //       // as: 'questions',
    //       include: [
    //         {
    //           model: options,
    //           // as: 'options'
    //         }
    //       ]
    //     }
    //   ],
    //   where: { userId: req.query.userId }
    // });

    const tests = await Tests.findAll({
      where: {
        createdBy: req.query.userId // Filter tests based on createdBy field (userId)
      },
      include: [
        {
          model: Questions,
          include: [options]
        }
      ]
    })

    return res.status(200).json({
      tests: tests,
      status: 'success'
    });
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

const request = require('supertest');

jest.mock("../models/User", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../routes/posts', () => {
  const express = require('express');
  return express.Router(); 
});

jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
      req.user = { id: "123" }  
      next()
    },
}))

const app = require('../app')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TestAgent = require('supertest/lib/agent')


beforeEach(() => {
  jest.clearAllMocks()
})

describe("POST /api/users", () => {
  test("should register a user and return 201 with token", async () => {
    User.findOne
      .mockResolvedValueOnce(null)  // email not taken
      .mockResolvedValueOnce(null)  // username not taken

    bcrypt.genSalt.mockResolvedValue("fake-salt")
    bcrypt.hash.mockResolvedValue("hashed-pass")

    User.create.mockResolvedValue({
      _id: "123",
      id: "123",
      username: "test",
      email: "test@test.com",
    })

    jwt.sign.mockReturnValue("fake-token")

    const res = await request(app)
      .post("/api/users")
      .send({
        username: "test",
        firstName: "First",
        lastName: "Last",
        email: "test@test.com",
        password: "password123",
        number: "555",
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({
      _id: "123",
      username: "test",
      email: "test@test.com",
      token: "fake-token",
    })
  })
})

// userd AI as reference, prompt at bottom of file

describe("POST /api/users/login", () => {
    test("should login a user and return 201 with token", async () => {
        const fakeUser = {
            _id: "123",
            id: "123",
            username: "test",
            email: "test@test.com",
            password: "hashed-pass",
        }
        User.findOne.mockResolvedValue(fakeUser)
        bcrypt.compare.mockResolvedValue(true)
        jwt.sign.mockReturnValue("fake-token")

        const res = await request(app).post("/api/users/login")
            .send({
                email: "test@test.com",
                password: "pass"
            })
        expect(User.findOne).toHaveBeenCalledWith({email: "test@test.com"})
        expect(bcrypt.compare).toHaveBeenCalledWith("pass", "hashed-pass")
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            _id: "123",
            username: "test",
            email: "test@test.com",
            token: "fake-token",
        })
    })
})

describe("GET /api/users/me" , () => {
    test("should return status 200 and user info", async () => {
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "123",
                username: "test",
                firstName: "First",
                lastName: "Last",
                email: "test@test.com",
                number: "555",
            })
        })

        const res = await request(app).get("/api/users/me")
        expect(User.findById).toHaveBeenCalledWith("123")
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            _id: "123",
            username: "test",
            firstName: "First",
            lastName: "Last",
            email: "test@test.com",
            number: "555",
        })
        
    })
})



describe("GET /api/users/me", () => {
    test("should return status 200 and user info", async () => {
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({
            _id: "123",
            username: "test",
            }),
        })
  
        const res = await request(app).get("/api/users/me")
  
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            _id: "123",
            username: "test",
        })
    })
})

describe("PATCH /api/users/me", () => {
    test("should return status 200 and updateduser info", async () => {
        const updatedUser = {
            _id: "123",
            username: "test",
            firstName: "Updated",
            lastName: "Last",
            email: "test@test.com",
            number: "555",
        }
        User.findByIdAndUpdate.mockReturnValue({
            select: jest.fn().mockResolvedValue(updatedUser),
        })
  
        const res = await request(app).patch("/api/users/me")
            .send({firstName: "Updated"})
        
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { firstName: "Updated" },
            { new: true, runValidators: true}
        )
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(updatedUser)
    })
})

describe("DELETE /api/users/me", () => {
    test("should delete user and return 204", async () => {

        User.findByIdAndDelete.mockReturnValue({
            _id: "123",
            username: "test"
        })
  
        const res = await request(app).delete("/api/users/me")
        
        expect(User.findByIdAndDelete).toHaveBeenCalledWith("123")
        expect(res.statusCode).toBe(204)
        expect(res.body).toEqual({})
    })
})
  

/*
  
*/

/*
  Response:
*/
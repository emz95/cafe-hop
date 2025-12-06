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


describe("POST /api/users/login", () => { // mostly AI generated function, use AI as reference but ended up being really similar, prompt at bottom of file

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
  how would i use jest to mock a login function that uses jwt, bcrypt, and mongoose
*/

/*
  Response:

  ChatGPT said:

Below is a clear, practical pattern for mocking JWT, bcrypt, and Mongoose when unit-testing a login function with Jest. This approach avoids hitting the database, avoids real hashing/verification, and returns predictable values.

✅ Example Login Function (the target of our test)

Suppose you have something like this:

// authService.js
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return { token, user };
}

module.exports = { login };

✅ How to Mock These Dependencies in Jest

Jest can mock the modules at the top of the file using jest.mock().

1. Mocking bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

2. Mocking jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

3. Mocking a Mongoose Model

For a model like User.findOne, mock its functions:

jest.mock('./models/User', () => ({
  findOne: jest.fn(),
}));

✅ Full Test Example
// authService.test.js
const { login } = require('./authService');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('./models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in a user with correct credentials', async () => {
    // Mock user returned from DB
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      password: 'hashedPassword',
    };
    User.findOne.mockResolvedValue(mockUser);

    // Mock bcrypt.compare result
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt.sign return
    jwt.sign.mockReturnValue('fake-jwt-token');

    const result = await login('test@example.com', 'password123');

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith({ userId: '123' }, process.env.JWT_SECRET);

    expect(result).toEqual({
      token: 'fake-jwt-token',
      user: mockUser,
    });
  });

  it('throws when user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(login('x@y.com', 'pass'))
      .rejects
      .toThrow('User not found');
  });

  it('throws when password is wrong', async () => {
    User.findOne.mockResolvedValue({ password: 'storedHash' });
    bcrypt.compare.mockResolvedValue(false);

    await expect(login('x@y.com', 'wrongpass'))
      .rejects
      .toThrow('Invalid credentials');
  });
});

✅ Important Notes
✔ You do not need to mock Mongoose connection

Mocking the model functions (findOne, create, etc.) is enough.

✔ Always use mockResolvedValue for async functions

Mongoose queries & bcrypt.compare return promises.

✔ Return a simple string for the JWT

The real signing logic isn't needed for unit tests.

Want help adapting this to your project's structure?

Send me your login function or folder layout and I’ll generate a tailored test file.
*/
const request = require('supertest');
const app = require('../app');

jest.mock("../models/Post", () => ({
    create: jest.fn(),
    find: jest.fn()
}));

const Post = require('../models/Post');


describe("POST /api/posts", () => {
    test("should create a new post and return 201", async () => {
        const fakePost = {
            _id: "abc",
            author: "John", 
            title: "Hello World",
            description: "Have fun",
            date: "2024-11-20T00:00:00.000Z",
            location: "Starbucks",
            isOpenToJoin: true

        };
        Post.create.mockResolvedValue(fakePost);
        const response = await request(app)
        .post("/api/posts")
        .send({
            author: "John", 
            title: "Hello World",
            description: "Have fun",
            date: "2024-11-20T00:00:00.000Z",
            location: "Starbucks",
            isOpenToJoin: true
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(fakePost);
        expect(Post.create).toHaveBeenCalledWith({
            author: "John", 
            title: "Hello World",
            description: "Have fun",
            date: "2024-11-20T00:00:00.000Z",
            location: "Starbucks",
            isOpenToJoin: true
        });
    });


})

describe("GET /api/posts", () => {

    test("should return list of all posts", async () => {
        const fakePosts = [
            {
                _id: "abc123",
                author: "John", 
                title: "Hello World",
                description: "Have fun",
                date: "2024-11-20T00:00:00.000Z",
                location: "Starbucks",
                isOpenToJoin: true

            },
            {
                _id: "dragon",
                author: "Jane", 
                title: "Lets get coffee",
                description: "lets do this ",
                date: "2024-01-20T00:00:00.000Z",
                location: "BruinBuzz",
                isOpenToJoin: true
            }
        ]
        const leanMock = jest.fn().mockResolvedValue(fakePosts);
        Post.find.mockReturnValue({ lean: leanMock });
        const response = await request(app).get('/api/posts');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(fakePosts);
        expect(Post.find).toHaveBeenCalledTimes(1);
        expect(leanMock).toHaveBeenCalledTimes(1);


    });


})
const request = require('supertest');

const app = require('../app');

jest.mock('../models/JoinRequest', () =>  ({
    create: jest.fn(),
    findByIdAndUpdate: jest.fn()
}))

jest.mock('../models/GroupChat', () => ({
    findOneAndUpdate: jest.fn()
}))

jest.mock('../models/Post', () => ({
    findById: jest.fn()
}))


const JoinRequest = require('../models/JoinRequest');
const GroupChat = require('../models/GroupChat'); 
const Post = require('../models/Post');


describe('POST /api/joinRequest', () => {
    test('create a join request and return status 201', async () => {

        const fakeJoinRequest = {
            requester: "John",
            post: "Anderson Cafe",
            status: "Pending",
            poster: "Jack"
        }

        JoinRequest.create.mockResolvedValue(fakeJoinRequest);
        const response = await request(app).
        post('/api/joinRequests').
        send({
                requester: "John",
                post: "Anderson Cafe",
                status: "Pending",
                poster: "Jack"
            }
        );
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(fakeJoinRequest); 
        expect(JoinRequest.create).toHaveBeenCalledWith({
            requester: "John",
            post: "Anderson Cafe",
            status: "Pending",
            poster: "Jack"
        });

    });
})

// describe('POST /api/joinRequest/:id/approve', () => {
//     test('approve a join request', async () => {
//         const fakeJoinRequest = {
//             requester: "John",
//             post: "Anderson Cafe",
//             status: "Pending",
//             poster: "Jack"
//         }
//         const fakePost = {
//             id: "abcd123",
//             requester: "Jr Smith",
//             poster: "Lebron James",
//             post: "post123",
//             status: 

//         }


//     });
// })
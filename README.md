## Welcome to CafeHop! The country's premiere app for UCLA students to meet new friends and partake in the wonderful tradition of discovering delicious pastries and refreshing drinks. 

**Group 23** | **TA:** Ziyue Dang

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
  
### How To Run 

1. **Clone the repository** 

```bash
git clone https://github.com/emz95/cafe-hop.git
cd cafe-hop
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
  ```bash
Create .env file in the backend folder
copy env file sent in the email (Group #23)
```


4. **Start the backend server**
```bash
cd backend (must already be inside cafe-hop folder)
npm install
npm start
```


6. **Start the frontend server**

```bash
Open another terminal
cd cafe-hop 
npm run dev
```

7. **Navigate to [http://localhost:5174/](http://localhost:5174/)**

### How To Test
The backend server must be running.

**Jest**
```bash
cd backend
npm test
```

**Cucumber**
```bash
cd backend
npm run test:cucumber
```
**End to End Tests with Cypress**
```bash
npx cypress run
Note: if the above command is run,
curl -X POST http://localhost:3000/test/seed-zootopia
must be subsequently run to restore reset cafe data
```
Running tests resets all data in database.

## Design Diagrams

### Sequence Diagram

This sequence diagram models the interaction flow when users manage cafe trip join requests. User 1 creates a cafe trip post, and User 2 requests to join that trip. The diagram shows two alternative paths: User 1 can either approve the join request (which triggers the creation of a group chat message) or reject the join request. This illustrates one of the core social interaction workflows of CafeHop, where trip creators have control over who joins their cafe trips.

![Sequence Diagram](https://media.discordapp.net/attachments/1439337055682298065/1446738256308731976/Screenshot_2025-12-05_at_9.41.02_PM.png?ex=6935137f&is=6933c1ff&hm=9edb3da190618ce1e85379efcd7c18bd1973d2131be22c094f4b5c284055dd22&=&format=webp&quality=lossless&width=2330&height=1184)

### Entity Relationship Diagram

This ERD models how data is stored in our MongoDB database. The database stores users, cafe trip posts, join requests, cafe reviews, messages, and group chats. Key relationships include:
- Each **User** can create multiple **Posts** (cafe trips) and **Reviews**
- Each **Post** can have multiple **JoinRequests** from different users
- Each **User** can be a member of multiple **GroupChats**, and each chat contains multiple **Messages**
- **CafeReviews** link users to specific cafes with ratings and descriptions
- The **has** relationship connects users to their authored posts, showing ownership

The diagram uses crow's foot notation to indicate cardinality: "1" for one-to-one, "N" for one-to-many, and "M" for many-to-many relationships.

![Entity Relationship Diagram](https://media.discordapp.net/attachments/1439337055682298065/1446738392460038225/Screenshot_2025-12-05_at_9.41.48_PM.png?ex=6935139f&is=6933c21f&hm=14b3e63ee7ca736af3b90f587e8b11e9cbdc42ce0af26b5ac4549e58732c8ad5&=&format=webp&quality=lossless&width=1790&height=1188)


   

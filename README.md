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
**Cucumber**
```bash
cd backend
npm test
```
**End to End Tests with Cypress**
```bash
npx cypress run
Note: if this command is run, curl -X POST http://localhost:3000/test/seed-zootopia must be subsequently run to restore reset cafe data
```
Running tests resets all data in database.


   

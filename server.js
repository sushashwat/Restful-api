import express from "express";

const app = express();

// Allows app to read JSON from request body 
app.use(express.json());


// Array acts as our database

let users = [
    { id:"1", firstName: "Anshika", lastName:"Agarwal", hobby:"Teaching"},
    {id: "2", firstName:"Shashwat", lastName:"Gupta", hobby: "Coding"},
    {id:"3", firstName:"Priya", lastName:"Verma", hobby:"Reading"},
];

//Logs method, URL, status code for every request
app.use((req,res,next)=>{
    const originalJson = res.json.bind(res);
    res.json = (body) =>{
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}  → {res.statusCode}`);
        return originalJson(body);
    };
    next();
});

// Checks required fields for POST and PUT routes 
const validateUser = (req,res,next) => {
    const {firstName, lastName, hobby} = req.body;
    if(!firstName || !lastName || !hobby){
        return res.status(400).json({
            error: "firstName, lastName, and hobby are required fields.",
        });
    } 
    next();
};

// GET /users - fetch all users
app.get("/users", (req,res)=>{
    res.status(200).json({message: "Users fetched successfully", users});
});

// GET/users/:id - fetch user by id 
app.get("/users/:id", (req,res)=>{
    const user = users.find((u)=> u.id === req.params.id);
    if(!user){
        return res.status(404).json({error: `User with id ${req.params.id} not found.`});
    }
    res.status(200).json({message: "User fetched successfully", user});
});

// POST /user - add new user (with validation)
app.post("/user", validateUser, (req,res)=>{
    const {firstName, lastName, hobby} = req.body;
    const newUser = {id: Date.now().toString(), firstName,lastName,hobby};
    users.push(newUser);
    res.status(201).json({message: "User created successfully", user: newUser});
});



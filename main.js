const express = require("express")
const usersmod = require("./server")
const methodoverride = require("method-override")
const app = express()
const port = 4000


app.use(methodoverride('_method'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")


app.post("/signup", async (req, res) => {
    
    try {
        const {name, email, password} = req.body
        const user = await usersmod.findOne({name: name, email: email})
        if (user) {
            res.send("User already exist")
            console.log("nope");
            
        } else {
            const users = await usersmod.insertMany({name: name, email: email, password: password})
            res.render("register")

            console.log(users);
        }
 
    } catch (error) { 
        res.status(500).send("Failed") 
        console.log(error); 
        
    }

})



app.get("/api/read", async (req, res) => {
     
    try {
        const user = await usersmod.find()
        res.render("read", {user})

    } catch (err) {
        res.status(500).send("Failed to retrieve data")
        console.log(err);
    }

})

app.get("/api/read/:value", async (req, res) => {
     
    try {
        const {value} = req.params
        const user = await usersmod.find({
            $or:  [{name: value}, {email: value}] 
        })

        // const user = await usersmod.find({value})

        if (user.length === 0) {   
            res.render("404") 
        }
        res.render("read2", {user})

    } catch (err) {
        res.status(500).send("Failed to retrieve data")
        console.log(err);
    }

})

app.put("/update/:id", async (req, res) => {

    try {
        const {id} = req.params
        const {name, email, password} = req.body
        const usered = await usersmod.findByIdAndUpdate(id, {name, email, password}, {new: true})

        if (!usered) {
            res.status(404).send("User not found")
        } else {
            res.render("update", {usered})
        }

    } catch (error) {
        res.status(500).send("Failed to update")
        console.log(err);
    }
})

app.delete("/delete/:id", async (req, res) => {

    try {
        const {id} = req.params
        const users = await usersmod.findByIdAndDelete(id, req.body)

        if (users) {
            const user = await usersmod.find()
            res.render("read", {user})
        } else {
            res.send("Deleted UnSuccessfully")
        } 


    } catch (error) {
        res.status(500).send("Failed to delete")
        console.log(error);
    }
})

app.get("/", (req, res) => {
    res.send("CONNECTION STARTED")
})

app.get("/signup", (req, res) => {
    res.render("register")
})

app.get("/update/:id", async (req, res) => { 

    try {
        const id = req.params.id
        const usered = await usersmod.findById(id)

        if (!usered) {
            console.log("user does not exist");
        } else {
            res.render("update", {usered})
        }
    } catch (error) {
        res.status(500).send("Failed")
        console.log(error);
    }


})

app.listen(port, () => {
    console.log(`Your browser is running on https://localhost:${port}`);
})
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./authentication/routes/AuthRoutes')
const connectDb = require('./utils/db')

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());

app.get('/',  (req, res) => {
    res.send('welcome home')
})
app.use('/auth', authRoute)

connectDb();
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})
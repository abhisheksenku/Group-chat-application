const express = require('express');
const app = express();
require('dotenv').config();
require('./models/association');
const port = process.env.PORT || 3000;
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');
const databse = require('./utilities/sql');
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);
app.use(cors({
  origin: 'http://127.0.0.1:5500',                 
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS']
}));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
const userRoutes = require('./routes/userRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');

//Root Handler
app.use('/user', userRoutes);
app.use('/password',forgotPasswordRoutes);

// Root path
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'signup.html');
    // fs.access(filePath, fs.constants.F_OK, (err) => {
    //     if (err) {
    //         return res.status(404).send('File not found');
    //     }
        // res.sendFile(filePath);
    // });
    res.sendFile(filePath);
});
app.get('/password/resetpassword/:token', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'resetPassword.html'));
});

(async ()=>{
    try {
        await databse.sync({force:false});
        app.listen(port,()=>{
            //this console.log will be visible in terminal
            console.log(`Server is running at http://localhost:${port}`);
        })
    } catch (error) {
        console.error('Unable to connect to database')    
    }
})();

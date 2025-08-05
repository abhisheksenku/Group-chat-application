const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// Root handler
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'signup.html');
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.sendFile(filePath);
    });
});

const databse = require('./utilities/sql');
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

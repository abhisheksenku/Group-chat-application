const userModel = require('../models/users');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../utilities/sql');
require('dotenv').config();
function generateAccessToken(id) {
    return jwt.sign({ UserId: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
const fetchUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error while retrieving users:', error);
    res.status(500).send('Error while fetching users');
  }
};
const postUsers = async (req,res)=>{
    const t = await sequelize.transaction();
    const {name,email,phone,password} = req.body;
    if(!name||!email||!phone||!password){
        return res.status(400).json({error:'Name,email,phone number,password are required'})
    }
    try {
        const existingUser = await userModel.findOne({
            where:{email},
            transaction:t
        });
        if(existingUser){
            await t.rollback();
            return res.status(409).json({ error: 'User with this email already exists' }); 
        }
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const user = await userModel.create({
            name,
            email,
            phone,
            password:hashedPassword
        },{transaction:t});
        await t.commit();
        res.status(200).json({
            message: `User ${user.name} is added successfully`,
            user:user
        }); 
    } catch (error) {
        await t.rollback();
        console.error('Error while adding the user',error),
        res.status(500).send('Error while adding the user')
    }
};
const loginUser = async(req,res)=>{
    const{email,password} = req.body;
    try {
        const emailValidation = await userModel.findOne({
            where:{email}
        });
        if (!emailValidation) {
            return res.status(404).json({ error: 'Unauthorized user' });
        }
        else if(!await bcrypt.compare(password,emailValidation.password)){
            return res.status(401).json({error:'Invalid password'});
        }
        const token = generateAccessToken(emailValidation.id);
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: emailValidation.id, email: emailValidation.email },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });   
    }
}
module.exports={
    fetchUsers,
    postUsers,
    loginUser
}

// //example case
// const fetchUsers = async (req, res) => {
//     try {
//         // Simulate an async database call
//         const users = await someDatabaseQuery(); // Replace with actual async function
//         if (!users || users.length === 0) {
//             res.status(200).json({ message: 'No users found', users: [] });
//         } else {
//             res.status(200).json({ message: 'Users found', users });
//         }
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Example async function (for demonstration)
// async function someDatabaseQuery() {
//     return new Promise((resolve) => {
//         setTimeout(() => resolve([]), 1000); // Simulate delay
//     });
// }
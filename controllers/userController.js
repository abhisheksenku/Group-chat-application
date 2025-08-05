const userModel = require('../models/users');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const sequelize = require('../utilities/sql');
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
module.exports={
    fetchUsers,
    postUsers
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
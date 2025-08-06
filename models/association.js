const User = require('../models/users');
const PasswordResetRequest = require('../models/passwordResetRequest');

User.hasMany(PasswordResetRequest);
PasswordResetRequest.belongsTo(User);

module.exports = {
    User,PasswordResetRequest
};
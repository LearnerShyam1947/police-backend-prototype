const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {    
    const { username, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ username });
    
    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {        
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    // After validating the user credentials, create a JWT
    const token = jwt.sign(
        { 
            id: user._id, 
            username: user.username 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
  
    // Set the token in an HTTP-only cookie
    res.cookie('authToken', token, { httpOnly: true, secure: false, maxAge: 3600000 }); // 1 hour expiration
    res.json({ message: 'Logged in successfully' });
  
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword, reEnterPassword } = req.body;

    // Ensure current password, new password, and re-entered password are provided
    if (!currentPassword || !newPassword || !reEnterPassword) {
        return res.status(400).json({ error: 'Current password, new password, and re-entered password are required' });
    }

    // Ensure new password and re-entered password match
    if (newPassword !== reEnterPassword) {
        return res.status(400).json({ error: 'New password and re-entered password must match' });
    }

    try {
        // Find the user in the database
        const user = await User.findById(req.user.id);

        // Check if current password is correct
        const isMatch = await user.isPasswordMatch(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error changing password', error });
    }
};


module.exports = {
    login,
    changePassword
}
  
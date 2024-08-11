const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);

mongoose.connect('mongodb://localhost:27017/JWt', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Connection error', error.message);
});

import { Router } from "express";

const authRoutes = Router();

authRoutes.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).send({ error: 'Email and Password are required' });
    }
    if(email === 'admin@gmail.com' && password === 'password1234') {
        res.status(200).send({ message: 'login successfully' });
    } else {
        res.status(403).send({message: 'Invalid email or password'});
    }
});

authRoutes.post('/register', (req, res) => {

});

//?
authRoutes.post('/logout', (req, res) => {

});

export default authRoutes;
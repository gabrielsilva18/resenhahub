import { Router, Request, Response } from "express";
import { genSaltSync, hashSync } from 'bcrypt';
import { checkLogin, checkHasUser, generateToken, createUser } from "../controllers/user.controller";
import session from 'express-session'
import path from "path";

const router = Router();

router.use(session({
    secret: "kHDF346Dshd34",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));

router.get("/login", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public/login.html"));
});

router.get("/cadastro", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public/cadastro.html"));
});

router.post("/login", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const loginValidation = await checkLogin(email, password);

        if (loginValidation) {
            const tokenJWT = generateToken(email);

            // req.session.id = tokenJWT;

            res.json({
                "message": "login success",
                "acessToken": tokenJWT
            })
        } else {
            res.status(401).json({ error: "Email ou senha inválidos" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/cadastro", async (req: Request, res: Response) => {
    const email = req.body.email;
    const nome = req.body.name;
    const password = req.body.password;

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    try {
        const registerValidation = await checkHasUser(email);
        if (registerValidation) {
            return res.status(409).json({ error: "Usuário já existe" }); // 409 Conflict
        }

        createUser(nome, email, hashedPassword)
        return res.status(201).json({ message: "Usuário criado com sucesso!" }); // 201 Created
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

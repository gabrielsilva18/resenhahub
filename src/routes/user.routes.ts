import { Router, Request, Response } from "express";
import { checkLogin, checkHasUser, generateToken, createUser } from "../controllers/user.controller";
import { genSaltSync, hashSync } from 'bcrypt';
import { userAuth } from '../middlewere/user-auth.middlewere'
import { z, ZodError } from 'zod'
import path from "path";
const router = Router();

// validação do input de usuário
const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(2)
})

type userSchema = z.infer<typeof userSchema>

router.get("/login", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public/login.html"));
});

router.get("/cadastro", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public/cadastro.html"));
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const loginValidation = await checkLogin(email, password);

        if (loginValidation) {
            const tokenJWT = generateToken(email);
            req.session.user = tokenJWT
            res.redirect("/dashboard")
        } else {
            res.status(401).json({ error: "Email ou senha inválidos" });
        }
    } catch (error) {

        if (error instanceof ZodError) {
            res.json({
                "error": error.message
            })
        }

        res.status(500).json({ error: "Erro interno no servidor." });

    }
});

router.get("/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao encerrar a sessão.");
        }
        res.redirect("/");
    });
});


router.post("/cadastro", async (req: Request, res: Response) => {

    try {
        const { name, email, password } = userSchema.parse(req.body)
        console.log("Email:", email, "Password:", password);


        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);

        const registerValidation = await checkHasUser(email);
        if (registerValidation) {
            return res.status(409).json({ error: "Usuário já existe" }); // 409 Conflict
        }

        createUser(name, email, hashedPassword)
        return res.redirect("/login")
    } catch (error) {

        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados de entrada inválidos" });
        }
        return res.status(500).json({ error: "Ocorreu um erro interno do servidor." });
    }
});


router.get("/dashboard", userAuth, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public/dashboard.html"));
})

export default router;

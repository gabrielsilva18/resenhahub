import { Router, Request, Response } from "express";
import { createReview, getAllReviewOfUser, formatReviews } from "../controllers/review.controller";
import { userAuth } from "../middlewere/user-auth.middlewere";
import { getIdUser } from "../controllers/user.controller";
import path from "path";

const router = Router();

router.get("/criar-resenha", userAuth, (req: Request, res: Response) => {
    const caminho = path.join(__dirname, '../../public/criar-resenha.html');
    res.sendFile(caminho); // Envia o arquivo HTML
});


// criação de resenha
router.post("/api/resenha", userAuth, async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;

        const userId = req.session?.user ? await getIdUser(req.session.user) : null

        if (!title || !content || !userId) {
            return res.status(400).json({ error: "Ocorreu algum erro." });
        }

        createReview(title, content, userId)

        // Retorna uma resposta de sucesso
        res.status(201).json({ message: "Resenha criada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Não foi possível criar a resenha." });
    }
});

// lista as resenhas do usuário
router.get("/api/resenhas-usuario", userAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.session?.user ? await getIdUser(req.session.user) : null

        if (!userId) {
            return res.status(400).json({ error: "Ocorreu algum erro." });
        }

        const allReviews = await getAllReviewOfUser(userId);

        const formattedReviews = await formatReviews(allReviews);
        res.status(200).send(formattedReviews);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Não foi possível listar as resenhas do usuário." });
    }
});


router.delete("/resenha/:id", (req: Request, res: Response) => {
    // Implementar lógica para deletar uma resenha
});

router.put("/resenha/:id", (req: Request, res: Response) => {
    // Implementar lógica para editar uma resenha
});


export default router;

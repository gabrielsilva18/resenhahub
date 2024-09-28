import { Router, Request, Response } from "express";
import { getReview } from "../controllers/review.controller";
import { v4 as uuidv4 } from 'uuid'; // Utilizando a função uuidv4 para gerar um nome único para cada resenha
import path from "path";

const router = Router();

router.post("/resenha", (req: Request, res: Response) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
    }

    const fileName = `${uuidv4()}.md`;
    const filePath = path.join(path.join(__dirname, '../../data/reviews'), fileName);

    // Retorna uma resposta de sucesso
    res.status(201).json({ message: "Resenha recebida com sucesso" });

});


router.get("/criar-resenha", (req: Request, res: Response) => {
    // Usando path.join para construir o caminho corretamente
    const caminho = path.join(__dirname, '../../public/criar-resenha.html');
    console.log(caminho); // Para depuração, se necessário
    res.sendFile(caminho); // Envia o arquivo HTML
});

router.get("/resenha/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id.trim()); // Converte o id para um número
        const review = await getReview(id); // Aguarda a resposta da função getReview
        // Retorna a resenha encontrada
        res.status(200).send(review);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Um erro ocorreu ao buscar a resenha" });
    }
});

router.post("/resenha", (req: Request, res: Response) => {
    // Implementar lógica para criar uma nova resenha
});

router.delete("/resenha/:id", (req: Request, res: Response) => {
    // Implementar lógica para deletar uma resenha
});

export default router;

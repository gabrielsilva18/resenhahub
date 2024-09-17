import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const listarComentarios = async (id: number) => {
    try {
        const comentarios = await prisma.comentario.findMany({
            where: { resenhaId: Number(id) },
            include: {
                usuario: true, //detalhes do usuario
                respostas: true //respostas ao comentario
            }
        });
        if (!comentarios) {
            throw new Error(`Os comentários da resenha ${id} não foram encontrados.`);
        }
        return comentarios;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const criarComentario = async (texto: string, usuarioId: number, resenhaId: number, respostaAId: number) => {
    try {
        const novoComentario = await prisma.comentario.create({
            data:
            {
                texto,
                usuarioId,
                resenhaId,
                respostaAId,
            },
        });

        return novoComentario;
    } catch (error) {
        console.log(error);
        throw new Error('Erro ao criar comentário.');
    }
};

const atualizarComentario = async (id: number, texto: string) => {
    try {
        const comentariosExistente = await prisma.comentario.findUnique({
            where: { id: Number(id) }
        });

        if (!comentariosExistente) {
            throw new Error(`Comentário não encontrado.`);
        }

        const comentarioAtulizado = await prisma.comentario.update({
            where: { id: Number(id) },
            data: { texto }
        });

        return comentarioAtulizado;
    } catch (error) {
        throw new Error('Erro ao atualizar comentário.');
    }
};

const deletarComentario = async (id: number) => {
    try {
        const comentario = await prisma.comentario.findUnique({
            where: { id: Number(id) },
        });

        if (!comentario) {
            throw new Error(`Comentário não encontrado.`);
        }

        await prisma.comentario.delete({
            where: { id: Number(id) },
        });

        return comentario;
    } catch (error) {
        console.error(error);
        throw error;
    }
};




export { listarComentarios, criarComentario, atualizarComentario, deletarComentario };
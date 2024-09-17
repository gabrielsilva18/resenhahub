import { PrismaService } from "../services/database.service";
const prisma = new PrismaService(); 


// pegando uma resenha especifica usando ID
const getReview = async (id: number) => {
    try {
        const review = await prisma.resenha.findUnique({
            where: {
                id: id, 
            },
        });

        if (!review) {
            throw new Error(`Resenha com o ${id} não foi encontrada.`);
        }

        return review;
    } catch (error) {
        console.error(error);
        throw error; 
    }
};

export { getReview };

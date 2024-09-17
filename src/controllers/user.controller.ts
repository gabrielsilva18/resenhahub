import { PrismaService } from "../services/database.service";
import { sign } from "jsonwebtoken"
import { compare } from 'bcrypt';

const prisma = new PrismaService();

// Validação do login
export async function checkLogin(email: string, password: string): Promise<boolean> {
    try {
        // Simulação de consulta ao banco de dados (por exemplo, usando Prisma ou outra ferramenta)
        const user = await prisma.usuario.findUnique({ where: { email } });

        // Checar se o usuário existe e se a senha está correta
        if (user && (await compare(password, user.senha))) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Erro na validação de login:", error);
        throw error; // Isso vai cair no bloco catch do router e causar o "internal server error"
    }
}



// Checa se o usuário existe
export async function checkHasUser(email: string) {
    const user = await prisma.usuario.findUnique({
        where: { email: email },  // Busca o usuário pelo email
    });

    return !!user;  // Retorna true se o usuário existir, false se não existir
}


//cria um novo usuario 
export const createUser = async (nome: string, email: string, senha: string) => {
    await prisma.usuario.create({
        data: {
            nome: nome,
            email: email,
            senha: senha,
        },
    })

}


// geração do token
export const generateToken = (email: string) => {
    const token = sign({ email }, 'sdfsdfsdf', { expiresIn: '1h' });
    return token;

}


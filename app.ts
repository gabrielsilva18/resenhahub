import express, { Response, Request } from 'express'
import path from 'path'
const app = express()

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

// Rota principal
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

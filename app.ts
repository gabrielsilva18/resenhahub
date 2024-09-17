import express, { Response, Request } from 'express'
import bodyParser from 'body-parser';
import reviewRoutes from './src/routes/review.routes'
import userRoutes from './src/routes/user.routes'
import commentRoutes from './src/routes/comment.routes'

import path from 'path'
const app = express()

// const SECRET_KEY = process.env.JWT_SECRET; 
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Rota principal
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

app.use(reviewRoutes, userRoutes, commentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

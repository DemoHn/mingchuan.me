// app.ts
// This is the main file for `api-main` for local deploy
import express from 'express'
import { register } from './controllers/accountController'

const app = express()

app.use(express.json())
app.post('/accounts/register', register)
const port = process.env.PORT || 3000
app.listen(port)

console.log('listen to server port', port)

// app.ts
// This is the main file for `api-main` for local deploy

import express from 'express'

const app = express()
app.listen(process.env.PORT || 3000)

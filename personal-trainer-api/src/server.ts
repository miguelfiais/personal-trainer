import express from 'express'

const app = express()
app.use(express.json())
const port = process.env.PORT ?? 3333

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`Server started on ${port}`)
})

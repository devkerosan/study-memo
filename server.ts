import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { extractOgp, extractTitle } from './ExtractOgp'
require('dotenv').config();

const app = express()
const PORT = process.env.PORT;
const CONNECT_URL = process.env.DB_CONNECT

const itemSchema = new mongoose.Schema({
    title: String,
    date: String,
    done: Boolean,
    url: String,
    tag: [String]
})
const Item = mongoose.model('Item', itemSchema)

app.use(
    cors({
        origin: 'http://localhost:5173'
    })
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    mongoose.connect(
        CONNECT_URL || ""
    )
    Item.find({}, (err: any, result: any) => {
        if (err) throw err
        res.send(result)
    })
})

app.post('/', async (req, res) => {
    mongoose.connect(
        CONNECT_URL || ""
    )
    const title = await extractTitle(req.body.a)
    if (title === 'error') {
        res.send('error')
        return
    }
    const i = new Item({
        title: title,
        date: new Date(),
        done: false,
        url: req.body.a,
        tag: []
    })
    i.save(err => {
        if (err) throw err
    })
    res.send('complete')
})

app.put('/:id', (req, res) => {
    mongoose.connect(
        CONNECT_URL || ""
    )
    Item.updateOne(
        { _id: req.params.id },
        { $set: req.body },
        (err: any) => {
            if (err) throw err;
        });
    res.send("complete")
})

app.delete('/:id', (req, res) => {
    mongoose.connect(CONNECT_URL || "");
    Item.deleteOne(
        { _id: req.params.id },
        (err: any) => {
            if (err) throw err;
        }
    )
    res.send("complete")
})

app.listen(PORT, () => {
    console.log('hello')
})

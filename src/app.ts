import express from 'express'
import { expressErrorHandler } from './lib/errorHandling'
import { loadEvents, saveEvents } from './lib/events'
import { IBankAccount } from './types'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import { readDir } from './utils/fs'

export const app = express()
const router = express.Router();

app.use(express.json())
app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (req, res, next) => {
  try {
    const accounts = await readDir();
    res.render(`index`, {accounts});
  } catch(err) {
    next(err)
  }
})

// TODO: Complete the implementation of this route!
app.get('/accounts/:id', async (req, res, next) => {
  try {
    // This `loadEvents` function currently just returns an empty array.
    // Take a look at the function and complete the implementation.
    const event = await loadEvents(req.params.id)

    // @ts-expect-error: Derive the state of the account from `events`
    const account: IBankAccount = { message: 'Not yet implemented.' }

    res.render('event', {event})
  } catch (err) {
    next(err)
  }
})

app.get('/accounts/update/:id', async(req, res, next) => {
  try {
    res.render('update', {id: req.params.id})
  } catch (err) {
    next(err);
  }
})

app.post('/accounts/update/:id', async (req, res, next) => {
  try {
    // This `loadEvents` function currently just returns an empty array.
    // Take a look at the function and complete the implementation.
    await saveEvents(req.body.name, req.params.id)
    const event = await loadEvents(req.params.id)

    // @ts-expect-error: Derive the state of the account from `events`
    const account: IBankAccount = { message: 'Not yet implemented.' }

    res.render('event', {event})
  } catch (err) {
    next(err)
  }
})

app.use(expressErrorHandler)
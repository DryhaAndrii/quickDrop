/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { DB_URL, DB_NAME } = process.env

console.log('envs:', DB_URL)

const client = new Client({
  connectionString: DB_URL,
})

client
  .connect()
  .then(() => {
    return client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME])
  })
  .then((res) => {
    if (res.rowCount === 0) {
      console.log('Database does not exist. Creating...')
      return client.query(`CREATE DATABASE "${DB_NAME}"`)
    } else {
      console.log('Database already exists.')
    }
  })
  .then(() => {
    console.log('Database is ready!')
    client.end()
  })
  .catch((err) => {
    console.error('Error while creating database:', err)
    client.end()
  })

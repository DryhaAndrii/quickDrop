import { Client } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { DB_URL, DB_NAME } = process.env

console.log('envs:', DB_URL)

const adminClient = new Client({
  connectionString: DB_URL,
})

adminClient
  .connect()
  .then(async () => {
    console.log(`Dropping database "${DB_NAME}" if it exists...`)
    await adminClient.query(`DROP DATABASE IF EXISTS "${DB_NAME}"`)
    console.log(`Database "${DB_NAME}" dropped.`)

    console.log(`Creating database "${DB_NAME}"...`)
    await adminClient.query(`CREATE DATABASE "${DB_NAME}"`)
    console.log(`Database "${DB_NAME}" created.`)
  })
  .then(async () => {
    await adminClient.end()
    console.log('Operation complete.')
  })
  .catch(async (err) => {
    console.error('Error while recreating database:', err)
    await adminClient.end()
  })

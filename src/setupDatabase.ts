import Logger from 'bunyan'
import mongoose from 'mongoose'
import { config } from './config'
const log: Logger = config.createLogger('setupdatabase')

export default () => {
  const connect = () => {
    mongoose.set('strictQuery', true)
    mongoose.connect(config.DATABASE_URL!)
      .then(() => {
        log.info('succesfully connected to database')
      })
      .catch((error) => {
        log.info('error connecting to database', error)
        return process.exit(1)
      })
  }
  connect()
  mongoose.connection.on('disconnected', connect)
}

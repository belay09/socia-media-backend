import Logger from 'bunyan'
import mongoose from 'mongoose'
import { config } from '@root/config'
const log: Logger = config.createLogger('setupdatabase')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const connect = () => {
    mongoose.set('strictQuery', true)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

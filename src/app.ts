import { srv } from '@root/setupServer'
import express, { Express } from 'express'
import dbCon from '@root/setupDatabase'
import { config } from '@root/config'
import { } from 'dotenv'
class Application {
  public initialize (): void {
    this.loadConfig()
    dbCon()
    const app: Express = express()
    // eslint-disable-next-line new-cap
    const server: srv = new srv(app)
    server.start()
  }

  private loadConfig (): void {
    config.validateConfig()
  }
}
const application: Application = new Application()
application.initialize()

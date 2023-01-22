import { srv } from './setupServer'
import express, { Express } from 'express'
import dbCon from './setupDatabase'
import { config } from './config'
import { } from 'dotenv'
class Application {
  public initialize (): void {
    this.loadConfig()
    dbCon()
    const app: Express = express()
    const server: srv = new srv(app)
    server.start()
  }

  private loadConfig (): void {
    config.validateConfig()
  }
}
const application: Application = new Application()
application.initialize()

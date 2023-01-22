import { Application, json, urlencoded, Response, Request, NextFunction } from 'express'
import http from 'http'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import Logger from 'bunyan'
import compression from 'compression'
import cookieSession from 'cookie-session'
import HTTP_STATUS from 'http-status-codes'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Server, Socket } from 'socket.io'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'
import 'express-async-errors'
import routee from '@root/routes'
import { config } from '@root/config'
import { CustomeErrors, IErrorResponse } from '@globals/helpers/error-handler'
const log: Logger = config.createLogger('server')

export class srv {
  private readonly app: Application
  constructor (app: Application) {
    this.app = app
  }

  public start (): void {
    this.securityMiddleware(this.app)
    this.standardMiddleware(this.app)
    this.routeMiddleware(this.app)

    this.globalErrorHandler(this.app)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.startServer(this.app)
  }

  private securityMiddleware (app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: false
      })
    )
    app.use(hpp())
    app.use(helmet())
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION']
      })
    )
  }

  private standardMiddleware (app: Application): void {
    app.use(compression())
    app.use(json({ limit: '50mb' }))
    app.use(urlencoded({ extended: true, limit: '50mb' }))
  }

  private routeMiddleware (app: Application): void {
    routee(app)
  }

  private globalErrorHandler (app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` })
    })
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error)
      if (error instanceof CustomeErrors) {
        return res.status(error.statusCode).json(error.serializeErrors())
      }
      next()
    })
  }

  private async startServer (app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app)
      const socketIO: Server = await this.createSocketIO(httpServer)
      this.startHtttpServer(httpServer)
      this.socketIOConnection(socketIO)
    } catch (error) {
      log.error(error)
    }
  }

  private async createSocketIO (httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION']
      }
    })
    const pubClient = createClient({ url: config.REDIS_HOST })
    const subClient = pubClient.duplicate()
    await Promise.all([pubClient.connect(), subClient.connect()])
    io.adapter(createAdapter(pubClient, subClient))
    return io
  }

  private startHtttpServer (httpServer: http.Server): void {
    console.log(`server has started ${process.pid}`)
    httpServer.listen(config.SERVER_PORT, () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`server running on port ${config.SERVER_PORT}`)
    })
  }

  socketIOConnection (io: Server): void {

  }
}

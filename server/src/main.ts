import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const clientUrls = [process.env.CLIENT, process.env.CLIENT2]
  console.log('clientUrls', clientUrls)
  app.enableCors({
    origin: clientUrls,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe())

  app.use(cookieParser())

  const port = process.env.PORT ?? 8080

  await app.listen(port)

  console.log(`Server started on port ${port}`)
}
void bootstrap()

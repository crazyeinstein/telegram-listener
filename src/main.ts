import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import * as config from 'config';
import * as _ from 'lodash';
import { AppModule } from './modules/app/app.module';
import { createLogger } from './components/logger';
import { rid } from './components/middlewares/rid';
import { current, run } from './components/context';
import { timing } from './components/middlewares/timing';
import { requestLogger } from './components/middlewares/requestLogger';

const logger = createLogger(module);

const WEB_SERVER_PORT: number = config.get<number>('webServer.port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  app.getHttpAdapter().get('/ready', (req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  app.use(rid);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const data = _.pick(req, ['rid', 'tid', 'method', 'path']);

    run('http', data, () => {
      current().bindEmitter(req);

      next();
    });
  });

  app.use(timing);
  app.use(requestLogger);

  await app.listen(WEB_SERVER_PORT, () => {
    logger.info(`Application listening on port ${WEB_SERVER_PORT}`);
  });
}

bootstrap();

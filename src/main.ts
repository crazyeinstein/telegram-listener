import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as config from 'config';

const WEB_SERVER_PORT: number = config.get<number>('webServer.port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(WEB_SERVER_PORT, () => {
    console.log(`Application listening on port ${WEB_SERVER_PORT}`);
  });
}

bootstrap();

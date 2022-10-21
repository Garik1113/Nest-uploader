require('dotenv');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT));
  console.log('Uploader service started on port ', Number(process.env.PORT));
}
bootstrap();

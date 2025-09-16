import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './nest/app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidUnknownValues: false,
    }));
    app.enableCors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    // No global prefix; controllers include 'api/*' paths to preserve routes

    const port = Number(process.env.PORT || process.env.port) || 3000;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Nest app running on port ${port}`);
}

bootstrap();



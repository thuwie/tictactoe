import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './appGateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'static'),
    exclude: ['/api*'],
  }), SharedModule],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {
}

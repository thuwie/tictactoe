import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './appGateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SharedModule } from './shared/shared.module';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'static'),
    exclude: ['/api*'],
  }), SharedModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {
}

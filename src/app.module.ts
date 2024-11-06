import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PosPrintModule } from './pos-print/pos-print.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), PosPrintModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

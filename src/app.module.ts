import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PosPrintModule } from './pos-print/pos-print.module';

@Module({
  imports: [PosPrintModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PosPrintController } from './pos-print.controller';
import { PosPrintService } from './pos-print.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PosPrintController],
  providers: [PosPrintService],
})
export class PosPrintModule {}

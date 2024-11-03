import { Module } from '@nestjs/common';
import { PosPrintController } from './pos-print.controller';
import { PosPrintService } from './pos-print.service';

@Module({
  imports: [],
  controllers: [PosPrintController],
  providers: [PosPrintService],
})
export class PosPrintModule {}

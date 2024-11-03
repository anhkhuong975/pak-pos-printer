import { Module } from '@nestjs/common';
import { ThermalPrinterService } from './thermal-printer.service';

@Module({
  providers: [ThermalPrinterService],
})
export class ThermalPrinterModule {}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PosPrintService } from './pos-print.service';
import { PrintingReceiptDto } from './models/printing-receipt.dto';

@ApiTags('Pos print')
@Controller({
  version: '1.0',
  path: 'pos-print',
})
export class PosPrintController {
  constructor(private readonly posPrintService: PosPrintService) {}

  @ApiOperation({ summary: 'Print pos bill' })
  @Post('print')
  print(@Body() payload: PrintingReceiptDto) {
    return this.posPrintService.printReceipt(payload);
  }

  @ApiOperation({ summary: 'Ping to printer' })
  @Get('ping')
  ping() {
    return this.posPrintService.ping();
  }
}

import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PosPrintService } from './pos-print.service';

@ApiTags('Pos print')
@Controller({
  version: '1.0',
  path: 'pos-print',
})
export class PosPrintController {
  constructor(private readonly posPrintService: PosPrintService) {}

  @ApiOperation({ summary: 'Print pos bill' })
  @Post('print')
  print() {
    return this.posPrintService.printReceipt();
  }
}

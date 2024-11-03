import { Injectable } from '@nestjs/common';

@Injectable()
export class PosPrintService {
  /**
   * Print the receipt bill
   */
  async printReceipt() {
    return 'print receipt bill';
  }
}

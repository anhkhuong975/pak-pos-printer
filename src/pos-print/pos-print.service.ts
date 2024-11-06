import { Injectable } from '@nestjs/common';
import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { PrintingReceiptDto } from './models/printing-receipt.dto';
import * as sharp from 'sharp';
import { Buffer } from 'buffer';

@Injectable()
export class PosPrintService {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    const printerIp = this.configService.get('PRINTER_IP');
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: printerIp,
        port: 9100,
      },
    });
  }

  /**
   * Print the receipt bill
   *
   * @param payload
   */
  async printReceipt(payload: PrintingReceiptDto) {
    const printerIp = this.configService.get('PRINTER_IP');
    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${printerIp}`,
    });
    try {
      const imageBuffer = Buffer.from(
        payload.imageBase64.replace('data:image/png;base64,', ''),
        'base64',
      );
      const preparedImg = await this.preparePrintingImg(imageBuffer);
      await printer.printImageBuffer(preparedImg);
      printer.cut();
      await printer.execute();
      console.log('[Print jon completed] ');
    } catch (error) {
      console.error('[Print failed] ', error);
    } finally {
      printer.clear();
    }
  }

  /**
   * Prepare printing image
   *
   * @param inputImg
   * @param dpi
   * @protected
   */
  protected preparePrintingImg(inputImg: Buffer, dpi = 180): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      sharp(inputImg)
        .resize(Math.round((80 / 25.4) * dpi))
        .threshold(128)
        .toColourspace('b-w')
        .withMetadata({
          density: 203,
        })
        .toBuffer((err: Error, buffer: Buffer) => {
          if (err) {
            console.error('Error processing image:', err);
            reject(err);
          }
          resolve(buffer);
        });
    });
  }
}

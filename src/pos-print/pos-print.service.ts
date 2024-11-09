import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
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
import { PrintingReceiptRo } from './models/printing-receipt.ro';

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
   * Ping to printer
   */
  async ping() {
    const printerIp = this.configService.get('PRINTER_IP');
    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${printerIp}`,
    });
    console.log(`Printer: ${printerIp}`);
    try {
      await printer.print(`${printerIp} PING PING PING`);
      await printer.cut();
      await printer.beep();
      await printer.execute();
    } catch (e) {
      console.error(e);
      throw new BadGatewayException(e);
    } finally {
      printer.clear();
    }
  }

  /**
   * Print the receipt bill
   *
   * @param payload
   */
  async printReceipt(payload: PrintingReceiptDto): Promise<PrintingReceiptRo> {
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
      await printer.cut();
      await printer.beep(1);
      await printer.execute({ waitForResponse: true });
      console.log(`[Printer: ${printerIp}] Print job completed`);
      return {
        status: HttpStatus.OK,
        message: 'Successful',
      };
    } catch (error) {
      await printer.beep(2, 3);
      console.error(`[Printer: ${printerIp}] Print failed: `, error);
      throw new BadGatewayException(error);
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
      const width = Math.round((80 / 25.4) * dpi);
      sharp(inputImg)
        .resize(width)
        .threshold(128)
        .toColourspace('b-w')
        .raw()
        .toBuffer({ resolveWithObject: true }) // Nhận thông tin về buffer
        .then(({ data, info }) => {
          sharp(data, {
            raw: {
              width: info.width,
              height: info.height,
              channels: 1, // 1-bit ảnh trắng đen
            },
          })
            .png({
              compressionLevel: 9,
              colors: 2,
            })
            .toBuffer((err: Error, buffer: Buffer) => {
              if (err) {
                console.error('Error processing image:', err);
                reject(err);
              }
              resolve(buffer);
            });
        })
        .catch((err) => {
          console.error('Error processing image:', err);
          reject(err);
        });
    });
  }
}

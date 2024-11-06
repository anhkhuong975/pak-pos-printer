import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PrintingReceiptDto {
  @ApiProperty({ description: 'Base64 encoded image string', type: 'string' })
  @IsString()
  imageBase64: string;

  @ApiProperty({ description: 'DPI (Dots Per Inch)', example: 300 })
  @IsNumber()
  dpi: number;

  @ApiProperty({ description: 'Minimum width in millimeters', example: 100 })
  @IsNumber()
  widthMn: number;
}

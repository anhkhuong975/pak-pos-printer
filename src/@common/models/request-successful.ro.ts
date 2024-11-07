import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RequestSuccessfulRo {
  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  message: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: Array, description: 'Shoe category' })
  items: Array<number>;
}

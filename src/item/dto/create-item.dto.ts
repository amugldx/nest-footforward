import { ApiProperty } from '@nestjs/swagger';
import { Brand, Category } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'fullname' })
  fullname: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({ type: Array, description: 'size array' })
  size: number[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'description' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'description' })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: Category, description: 'Shoe category' })
  category: Category;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: Brand, description: 'Shoe category' })
  brand: Brand;
}

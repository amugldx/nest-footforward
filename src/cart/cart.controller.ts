import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { AdminGuard } from 'src/common/guards';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';

@ApiTags('Cart routes')
@UseGuards(AdminGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Cart Created' })
  @ApiBody({ type: CreateCartDto })
  @Post()
  create(@Body() dto: CreateCartDto, @GetCurrentUserId() userId: number) {
    return this.cartService.create(userId, dto);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All cart items recieved' })
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Cart with given id recieved' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Cart with given id deleted' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}

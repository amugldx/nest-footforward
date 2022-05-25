import { Injectable, HttpException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateCartDto) {
    const itemsArray = dto.items.map(async (item) => {
      const itemValue = await this.prisma.item
        .findUnique({
          where: {
            id: item,
          },
        })
        .catch(() => {
          throw new HttpException('Item with wrong id sent', 400);
        });
      return itemValue;
    });
    const cart = await this.prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: true,
      },
    });
    itemsArray.forEach(async (item) => {
      if (cart) {
        console.log(await item);
        cart.items.push(await item);
      }
    });
    return cart;
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  // update(id: number, updateCartDto: UpdateCartDto) {
  //   return `This action updates a #${id} cart`;
  // }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}

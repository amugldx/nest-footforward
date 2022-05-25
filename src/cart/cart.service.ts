import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    const allCarts = await this.prisma.cart.findMany();
    if (allCarts.length === 0) {
      throw new NotFoundException('cart is empty');
    }
    return allCarts;
  }

  async findOne(id: number) {
    const cartItem = await this.prisma.cart.findUnique({
      where: {
        id,
      },
    });
    if (!cartItem) {
      throw new NotFoundException('No cart item found with given id');
    }
    return cartItem;
  }

  async remove(id: number) {
    await this.prisma.cart
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Cart with given id does not exists');
        }
      });
    return true;
  }
}

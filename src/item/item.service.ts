import {
  BadRequestException,
  HttpException,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Item, Brand } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadPicture(
    file: Express.Multer.File,
    itemId: number,
  ): Promise<void | Item> {
    await this.findOne(itemId);
    const imageExists = await this.findOne(itemId);
    if (imageExists.imageId !== null) {
      await this.cloudinary.deleteImage(imageExists.imageId);
    }
    const picture = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type');
    });
    const item = await this.prisma.item
      .update({
        where: {
          id: itemId,
        },
        data: {
          imageId: picture.public_id,
          imageUrl: picture.secure_url,
        },
      })
      .catch((error) => {
        if (error) throw new HttpException('Unable to upload picture', 400);
      });
    return item;
  }
  async create(dto: CreateItemDto) {
    const itemExists = await this.prisma.item.findUnique({
      where: { name: dto.name },
    });
    if (itemExists) {
      throw new HttpException('Item already exists', 400);
    }
    const item = await this.prisma.item
      .create({
        data: {
          name: dto.name,
          fullname: dto.fullname,
          description: dto.description,
          size: dto.size,
          price: dto.price,
          category: dto.category,
          brand: dto.brand,
        },
      })
      .catch((error) => {
        if (error) {
          throw new ForbiddenException('Unable to create new Item');
        }
      });
    return item;
  }

  async findAll() {
    const items = await this.prisma.item.findMany();
    if (items.length === 0) {
      throw new NotFoundException('No items found');
    }
    return items;
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findUnique({
      where: {
        id,
      },
    });
    if (!item) {
      throw new NotFoundException('Item does not exists');
    }
    return item;
  }

  async findCategory(category: Category) {
    const categoryItems = await this.prisma.item.findMany({
      where: {
        category,
      },
    });
    if (categoryItems.length === 0) {
      throw new NotFoundException('Items does not exists');
    }
    return categoryItems;
  }

  async findSearch(name: string) {
    const categoryItems = await this.prisma.item
      .findUnique({
        where: {
          name,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Item with given name does not found');
        }
      });
    return categoryItems;
  }

  async findBrand(brand: Brand) {
    const brandItems = await this.prisma.item.findMany({
      where: {
        brand,
      },
    });
    if (brandItems.length === 0) {
      throw new NotFoundException('Items does not exists');
    }
    return brandItems;
  }

  async update(id: number, dto: Partial<CreateItemDto>) {
    await this.findOne(id);
    const item = await this.prisma.item
      .update({
        where: {
          id,
        },
        data: {
          name: dto.name,
          fullname: dto.fullname,
          description: dto.description,
          size: dto.size,
          price: dto.price,
          category: dto.category,
          brand: dto.brand,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to update item', 400);
        }
      });
    return item;
  }

  async remove(id: number) {
    const itemExists = await this.findOne(id);
    if (!itemExists) {
      throw new NotFoundException('Item does not exists');
    }
    if (itemExists.imageId !== null) {
      await this.cloudinary.deleteImage(itemExists.imageId);
    }
    await this.prisma.item
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to delete Item', 400);
        }
      });
    return true;
  }
}

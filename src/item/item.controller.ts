import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiConsumes,
  ApiBody,
  ApiFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Item, Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';
import { AdminGuard } from 'src/common/guards';
import { CreateItemDto } from './dto';
import { ItemService } from './item.service';

@ApiTags('Items Routes')
@UseGuards(AdminGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Picture Uploaded' })
  @Post(':id/picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadPicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) itemId: number,
  ): Promise<void | Item> {
    return this.itemService.uploadPicture(file, itemId);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Item Created' })
  @ApiBody({ type: CreateItemDto })
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All items recieved' })
  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Item with given id recieved' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'hotel with given id updated' })
  @ApiBody({ type: CreateItemDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateItemDto>,
  ) {
    return this.itemService.update(id, dto);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Item with given id deleted' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateListDto } from './dto/createList.dto';

@Injectable()
export class ListService {
  constructor(private prismaService: PrismaService) {}

  async createList(createListDto: CreateListDto, userId: number): Promise<any> {
    return this.prismaService.list.create({
      data: {
        name: createListDto.name,
        userId: userId,
      },
    });
  }

  async findAllLists(userId: number): Promise<any[]> {
    return this.prismaService.list.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findOneList(id: number): Promise<any> {
    return this.prismaService.list.findUnique({
      where: {
        id: id,
      },
    });
  }

  async addTaskToList(
    listId: number,
    taskId: number,
    userId: number,
  ): Promise<any> {
    // First verify the list belongs to the user
    const list = await this.prismaService.list.findFirst({
      where: {
        id: listId,
        userId: userId,
      },
    });

    if (!list) {
      throw new Error('List not found or unauthorized');
    }

    // Update the list to include the task
    return this.prismaService.list.update({
      where: {
        id: listId,
      },
      data: {
        Tasks: {
          connect: {
            id: taskId,
          },
        },
      },
    });
  }
}

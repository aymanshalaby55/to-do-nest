import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddTaskDto } from './dto/addTask.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: AddTaskDto, userId: number) {
    return await this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getAllTasks(userId: number) {
    return await this.prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    });
  }

  async getTaskById(id: number, userId: number) {
    return await this.prisma.task.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });
  }

  async updateTask(id: number, userId: number, data: Partial<AddTaskDto>) {
    return await this.prisma.task.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  async deleteTask(id: number, userId: number) {
    return await this.prisma.task.update({
      where: {
        id,
        userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async permanentDeleteTask(id: number, userId: number) {
    return await this.prisma.task.delete({
      where: {
        id,
        userId,
      },
    });
  }
}

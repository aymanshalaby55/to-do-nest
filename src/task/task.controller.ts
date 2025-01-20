import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AddTaskDto } from './dto/addTask.dto';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/decorator/getUser.decorator';
import { UserIdDto } from './dto/userID.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createTask(@Body() data: AddTaskDto, @getUser() userId: UserIdDto) {
    return this.taskService.createTask(data, userId.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllTasks(@getUser() userId: UserIdDto) {
    return this.taskService.getAllTasks(userId.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @getUser() userId: UserIdDto,
  ) {
    return this.taskService.getTaskById(id, userId.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @getUser() userId: UserIdDto,
    @Body() data: Partial<AddTaskDto>,
  ) {
    return this.taskService.updateTask(id, userId.id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @getUser() userId: UserIdDto,
  ) {
    return this.taskService.deleteTask(id, userId.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/permanent')
  permanentDeleteTask(
    @Param('id', ParseIntPipe) id: number,
    @getUser() userId: UserIdDto,
  ) {
    return this.taskService.permanentDeleteTask(id, userId.id);
  }
}

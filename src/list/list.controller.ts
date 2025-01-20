import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/createList.dto';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from '../auth/decorator/getUser.decorator';
import { UserIdDto } from 'src/task/dto/userID.dto';

@Controller('list')
export class ListController {
  constructor(private listService: ListService) {}

  @Post('/createList')
  @UseGuards(AuthGuard('jwt'))
  createList(@Body() createListDto: CreateListDto, @getUser() user: UserIdDto) {
    const userId = user.id;
    return this.listService.createList(createListDto, userId);
  }

  @Get('/getlists')
  @UseGuards(AuthGuard('jwt'))
  findAllLists(@getUser() userId: number) {
    return this.listService.findAllLists(userId);
  }

  @Get('getlist/:id')
  @UseGuards(AuthGuard('jwt'))
  findOneList(@Param('id') id: string) {
    return this.listService.findOneList(+id);
  }
  @Post('/:listId/addTask/:taskId')
  @UseGuards(AuthGuard('jwt'))
  async addTaskToList(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @getUser() userId: number,
  ) {
    return this.listService.addTaskToList(+listId, +taskId, userId);
  }
}

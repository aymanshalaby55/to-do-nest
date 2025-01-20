import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class AddTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDone?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsNotEmpty()
  userId: number;
}

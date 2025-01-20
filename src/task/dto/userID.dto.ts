import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

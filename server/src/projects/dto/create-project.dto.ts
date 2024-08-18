import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  cover?: string;

  @IsString()
  description?: string;
}

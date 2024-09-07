import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  description?: string;

  ownereId: number;

  @IsBoolean()
  published: boolean;
}

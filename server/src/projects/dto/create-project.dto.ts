import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Page } from 'src/pages/entities/page.entity';

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

  @IsOptional()
  pages?: Page[];
}

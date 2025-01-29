import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Page } from 'src/pages/entities/page.entity';

export class CreateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  description?: string;

  ownereId: number;

  @IsBoolean()
  @IsOptional()
  publish?: boolean;

  @IsOptional()
  pages?: Page[];
}

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  projectId: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}

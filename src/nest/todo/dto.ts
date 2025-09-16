import { IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, Min, IsInt } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    task!: string;
}

export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    task?: string;

    @IsOptional()
    @IsIn(['pending', 'completed'])
    status?: string;
}

export class TodoQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 5;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsIn(['pending', 'completed'])
    status?: string;

    @IsOptional()
    @IsIn(['latest', 'oldest'])
    sort?: string = 'latest';
}



import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}

export class RefreshResponseDto {
    @IsString()
    accessToken!: string;
}



import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './dto';
import { Request, Response } from 'express';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.userService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.userService.login(dto);
    }

    @Post('refresh')
    async refresh(@Req() req: Request) {
        const refreshToken = (req as any).cookies?.refreshToken;
        return this.userService.refresh(refreshToken);
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = (req as any).cookies?.refreshToken;
        const result = await this.userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return result;
    }
}



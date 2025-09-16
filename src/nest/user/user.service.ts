import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RegisterDto, LoginDto } from './dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async register(dto: RegisterDto): Promise<{ message: string }> {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists) {
            throw new ConflictException('Email already in use');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        await this.userModel.create({ name: dto.name, email: dto.email, password: hashed });
        return { message: 'User registered successfully' };
    }

    async login(dto: LoginDto): Promise<{ token: string; refreshToken: string }> {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const pass = await bcrypt.compare(dto.password, user.password);
        if (!pass) throw new UnauthorizedException('Invalid credentials');

        const token = jwt.sign(
            { userId: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '10m' },
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' },
        );
        user.refreshToken = refreshToken;
        await user.save();
        return { token, refreshToken };
    }

    async refresh(refreshToken?: string): Promise<{ accessToken: string }> {
        if (!refreshToken) throw new UnauthorizedException('No refresh token provided');
        const user = await this.userModel.findOne({ refreshToken });
        if (!user) throw new UnauthorizedException('Invalid refresh token');

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
            const accessToken = jwt.sign(
                { userId: user._id, name: user.name, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '10m' },
            );
            return { accessToken };
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async logout(refreshToken?: string): Promise<{ message: string }> {
        if (!refreshToken) throw new UnauthorizedException('No refresh token found');
        await this.userModel.updateOne({ refreshToken }, { $unset: { refreshToken: '' } });
        return { message: 'Logged out successfully' };
    }
}



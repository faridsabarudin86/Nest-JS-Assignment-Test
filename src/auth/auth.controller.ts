import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    async signInLocal(@Body() authDto: AuthDto) {

        return this.authService.signInLocal(authDto);
    }

    @Post('register')
    async registerNewUser(@Body() authDto: AuthDto): Promise<AuthDto> {

        return this.authService.registerNewUser(authDto);
    }
}

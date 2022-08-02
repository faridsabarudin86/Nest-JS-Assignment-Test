import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signincustomer')
    async signInCustomer(@Body() authDto: AuthDto) {

        return this.authService.signInCustomer(authDto);
    }

    @Post('signincorporate')
    async signInCorporate(@Body() authDto: AuthDto) {

        return this.authService.signInCorporate(authDto);
    }
}

import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signincustomer')
    async signInCustomer(@Body() signInDto: SignInDto): Promise<any> {

        return this.authService.signInCustomer(signInDto);
    }

    @Post('signincorporate')
    async signInCorporate(@Body() signInDto: SignInDto): Promise<any> {

        return this.authService.signInCorporate(signInDto);
    }

    @Post('signinsystemadmin')
    async signInSystemAdmin(@Body() signInDto: SignInDto): Promise<any> {
        
        return this.authService.signInCorporate(signInDto);
    }
}

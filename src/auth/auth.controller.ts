import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dtos/user.dto';
import { SignInCorporateDto } from './dtos/signInCorporate.dto';
import { SignInCustomerDto } from './dtos/signInCustomer.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signincustomer')
    async signInCustomer(@Body() signInCustomerDto: SignInCustomerDto): Promise<any> {

        return this.authService.signInCustomer(signInCustomerDto);
    }

    @Post('signincorporate')
    async signInCorporate(@Body() signInCorporateDto: SignInCorporateDto): Promise<any> {

        return this.authService.signInCorporate(signInCorporateDto);
    }
}

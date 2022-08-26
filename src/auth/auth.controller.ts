import { Body, Controller, Post} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('signincustomer')
    async signInCustomer(@Body() signInDto: SignInDto): Promise<any> {

        return this.authService.signInCustomer(signInDto);
    }

    @Public()
    @Post('signincorporate')
    async signInCorporate(@Body() signInDto: SignInDto): Promise<any> {

        return this.authService.signInCorporate(signInDto);
    }
}

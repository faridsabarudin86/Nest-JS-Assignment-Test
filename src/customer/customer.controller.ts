import { Controller, Delete, Get, Post, Put, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { UserRoles } from 'src/common/config/userRoles';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { AddAlternateDriverDto } from './dtos/addAlternateDriver.dto';
import { AddVehicleDto } from './dtos/addVehicle.dto';
import { DeleteVehicleDto } from './dtos/deleteVehicle.dto';
import { RegisterCustomerDto } from './dtos/registerCustomer.dto';
import { RemoveAlternateDriverDto } from './dtos/removeAlternateDriver.dto';
import { UpdateCustomerDto } from './dtos/updateCustomer.dto';
import { UpdateVehicleDto } from './dtos/updateVehicle.dto';

@Controller('customer')
export class CustomerController 
{
    constructor(
        private customerService: CustomerService,
        private authService: AuthService,
        ) {}

    @Public()
    @Post('signincustomer')
    async signInCustomer(@Body() body: SignInDto): Promise<any> 
    {    
        return this.authService.signInCustomer(body);
    }

    @Public()
    @Post('registercustomer')
    async registerCustomer(@Body() body: RegisterCustomerDto): Promise<any>
    {
        return this.customerService.registerCustomer(body);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Get('getcustomer')
    async getCustomer(@Request() body: any): Promise<any>
    {
        return this.customerService.getCustomer(body.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('updatecustomer')
    async updateCustomer(@Body() body: UpdateCustomerDto, @Request() request: any): Promise<any>
    {
        return this.customerService.updateCustomer(body, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Get('getcustomervehicles')
    async getCustomerVehicles(@Request() request: any): Promise<any>
    {
        return this.customerService.getCustomerVehicles(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Post('addvehicle')
    async addVehicle(@Body() body: AddVehicleDto, @Request() request: any): Promise<any>
    {
        return this.customerService.addVehicle(body, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('updatevehicle')
    async updateVehicle(@Body() body: UpdateVehicleDto, @Request() request: any): Promise<any>
    {
        return this.customerService.updateVehicle(body, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('removevehicle')
    async removeVehicle(@Body() body: DeleteVehicleDto, @Request() request: any): Promise<any>
    {
        return this.customerService.removeVehicle(body, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('addalternatedriver')
    async addAlternateDriver(@Body() body: AddAlternateDriverDto, @Request() request: any): Promise<any>
    {
        return this.customerService.addAlternateDriver(body, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('removealternatedriver')
    async removeAlternateDriver(@Body() body: RemoveAlternateDriverDto, @Request() request: any): Promise<any>
    {
        return this.customerService.removeAlternateDriver(body, request.user);
    }
}


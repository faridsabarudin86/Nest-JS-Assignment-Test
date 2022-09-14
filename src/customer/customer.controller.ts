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
    async signInCustomer(@Body() signInDto: SignInDto): Promise<any> 
    {    
        return this.authService.signInCustomer(signInDto);
    }

    @Public()
    @Post('registercustomer')
    async registerCustomer(@Body() registerCustomerDto: RegisterCustomerDto): Promise<any>
    {
        return this.customerService.registerCustomer(registerCustomerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Get('getcustomer')
    async getCustomer(@Request() request: any): Promise<any>
    {
        return this.customerService.getCustomer(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('updatecustomer')
    async updateCustomer(@Body() updateCustomerDto: UpdateCustomerDto, @Request() request: any): Promise<any>
    {
        return this.customerService.updateCustomer(updateCustomerDto, request.user);
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
    async addVehicle(@Body() addVehicleDto: AddVehicleDto, @Request() request: any): Promise<any>
    {
        return this.customerService.addVehicle(addVehicleDto, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('updatevehicle')
    async updateVehicle(@Body() updateVehicleDto: UpdateVehicleDto, @Request() request: any): Promise<any>
    {
        return this.customerService.updateVehicle(updateVehicleDto, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('removevehicle')
    async removeVehicle(@Body() deleteVehicleDto: DeleteVehicleDto, @Request() request: any): Promise<any>
    {
        return this.customerService.removeVehicle(deleteVehicleDto, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('addalternatedriver')
    async addAlternateDriver(@Body() addAlternateDriverDto: AddAlternateDriverDto, @Request() request: any): Promise<any>
    {
        return this.customerService.addAlternateDriver(addAlternateDriverDto, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.customer)
    @Put('removealternatedriver')
    async removeAlternateDriver(@Body() removeAlternateDriverDto: RemoveAlternateDriverDto, @Request() request: any): Promise<any>
    {
        return this.customerService.removeAlternateDriver(removeAlternateDriverDto, request.user);
    }
}


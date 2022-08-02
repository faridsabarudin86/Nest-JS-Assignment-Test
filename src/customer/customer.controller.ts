import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from 'src/auth/dtos/auth.dto';
import { CustomerService } from './customer.service';
import { AlternateDriverDto } from './dtos/alternate-driver.dto';
import { CustomerVehicleDto } from './dtos/customer-vehicle.dto';

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Post('register')
    async registerNewCustomer(@Body() authDto: AuthDto): Promise<AuthDto> {

        return this.customerService.registerNewCustomer(authDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('addVehicle')
    async addNewVehicle(@Body() customerVehicleDto: CustomerVehicleDto, @Request() request: any): Promise<CustomerVehicleDto> {

        return this.customerService.addVehicle(customerVehicleDto, request.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('addAlternateDriver')
    async addNewAlternateDrivers(@Body() alternateDriverDto: AlternateDriverDto, @Body() customerVehicleDto: CustomerVehicleDto, @Request() request: any): Promise<CustomerVehicleDto> {
        return this.customerService.addAlternateDrivers(alternateDriverDto, customerVehicleDto, request.user);
    }
}
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerService } from './customer.service';
import { AddAlternateDriverDto } from './dtos/addAlternateDrivers.dto';
import { AddVehicleDto } from './dtos/addVehicle.dto';
import { RegisterNewCustomerDto } from './dtos/registerNewCustomer.dto';

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Post('register')
    async registerNewCustomer(@Body() registerNewCustomerDto: RegisterNewCustomerDto): Promise<any> {

        return this.customerService.registerNewCustomer(registerNewCustomerDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('addvehicle')
    async addNewVehicle(@Body() addVehicleDto: AddVehicleDto, @Request() request: any): Promise<any> {

        return this.customerService.addVehicle(addVehicleDto, request.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('addalternatedriver')
    async addNewAlternateDrivers(@Body() addAlternateDriverDto: AddAlternateDriverDto, @Request() request: any): Promise<any> {
        
        return this.customerService.addAlternateDrivers(addAlternateDriverDto, request.user);
    }
}
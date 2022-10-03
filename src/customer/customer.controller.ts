import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { BookingService } from 'src/booking/booking.service';
import { AddBookingDto } from 'src/booking/dtos/addBooking.dto';
import { GetAvailableBookingSlotsDto } from 'src/booking/dtos/getAvailableBookingSlots.dto';
import { UserRoles } from 'src/common/config/userRoles';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { AddAlternateDriverDto } from './dtos/addAlternateDriver.dto';
import { AddVehicleDto } from './dtos/addVehicle.dto';
import { RegisterCustomerDto } from './dtos/registerCustomer.dto';
import { UpdateCustomerDto } from './dtos/updateCustomer.dto';
import { UpdateVehicleDto } from './dtos/updateVehicle.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private bookingService: BookingService,
  ) {}

  @Public()
  @Post('signin')
  async signInCustomer(@Body() body: SignInDto): Promise<any> {
    return this.authService.signInCustomer(body);
  }

  @Public()
  @Post('register')
  async registerCustomer(@Body() body: RegisterCustomerDto): Promise<any> {
    return this.customerService.registerCustomer(body);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Get('customerinformation')
  async getCustomer(@Request() body: any): Promise<any> {
    return this.customerService.getCustomer(body.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Put('customerinformation')
  async updateCustomer(
    @Body() body: UpdateCustomerDto,
    @Request() request: any,
  ): Promise<any> {
    return this.customerService.updateCustomer(body, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Get('vehicles')
  async getCustomerVehicles(@Request() request: any): Promise<any> {
    return this.customerService.getCustomerVehicles(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Post('vehicles')
  async addVehicle(
    @Body() body: AddVehicleDto,
    @Request() request: any,
  ): Promise<any> {
    return this.customerService.addVehicle(body, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Get('vehicles/:vehicleId')
  async getVehicleInfo(
    @Param('vehicleId') paramVehicleId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.customerService.getVehicleInfo(paramVehicleId, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Put('vehicles/:vehicleId')
  async updateVehicle(
    @Param('vehicleId') paramVehicleId: string,
    @Body() body: UpdateVehicleDto,
    @Request() request: any,
  ): Promise<any> {
    return this.customerService.updateVehicle(
      paramVehicleId,
      body,
      request.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Delete('vehicles/:vehicleId')
  async removeVehicle(
    @Param('vehicleId') paramVehicleId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.customerService.removeVehicle(paramVehicleId, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Put('vehicles/:vehicleId/alternatedriver')
  async addAlternateDriver(
    @Param('vehicleId') paramVehicleId: string,
    @Body() body: AddAlternateDriverDto,
    @Request() request: any,
  ): Promise<any> {
    return this.customerService.addAlternateDriver(
      paramVehicleId,
      body,
      request.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.customer)
  @Put('vehicles/:vehicleId/alternatedriver/:alternatedriverId')
  async removeAlternateDriver(
    @Param('vehicleId') paramVehicleId: string,
    @Param('alternatedriverId') paramAlternateDriverId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.customerService.removeAlternateDriver(
      paramVehicleId,
      paramAlternateDriverId,
      request.user,
    );
  }

  @Roles(UserRoles.customer)
  @UseGuards(JwtAuthGuard)
  @Get('schedule/booking')
  async getAllAvailableBookingSlots(
    @Query('day') day: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @Body() body: GetAvailableBookingSlotsDto,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.getAllAvailableBookingSlots(
      day,
      month,
      year,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.customer)
  @UseGuards(JwtAuthGuard)
  @Put('schedule/booking/:bookingSlotId')
  async addBooking(
    @Param('bookingSlotId') paramBookingSlotId: string,
    @Body() body: AddBookingDto,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.addBooking(
      paramBookingSlotId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.customer)
  @UseGuards(JwtAuthGuard)
  @Get('schedule')
  async getAllBookingCustomer(@Request() request: any): Promise<any> {
    return this.bookingService.getAllBookingCustomer(request.user);
  }

  @Roles(UserRoles.customer)
  @UseGuards(JwtAuthGuard)
  @Get('schedule/:scheduleSlotId')
  async getBookingInfoCustomer(
    @Param('scheduleSlotId') paramScheduleId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.getBookingInfoCustomer(
      paramScheduleId,
      request.user,
    );
  }

  @Roles(UserRoles.customer)
  @UseGuards(JwtAuthGuard)
  @Put('schedule/:scheduleSlotId')
  async cancelBooking(
    @Param('scheduleSlotId') paramScheduleSlotId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.cancelBooking(paramScheduleSlotId, request.user);
  }
}

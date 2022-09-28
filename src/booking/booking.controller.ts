import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { BookingService } from './booking.service';
import { SetDailyScheduleDto } from './dtos/setDailySchedule.dto';
import { AssignTechnicianToDailyScheduleDto } from './dtos/assignedTechnicianToDailySchedule.dto';
import { AddBookingDto } from './dtos/addBooking.dto';
import { GetAllBookingCorporateDto } from './dtos/getAllBookingCorporate.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { TestCreateUserDto } from './dtos/testCreateUser.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get('getallbookingcorporate')
  async getAllBookingCorporate(
    @Body() body: GetAllBookingCorporateDto,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.getAllBookingCorporate(body, request.user);
  }

//   @Roles(UserRoles.customer)
//   @UseGuards(JwtAuthGuard)
//   @Get('getallbookingcustomer')
//   async getAllBookingCustomer(
//     @Request() request: any,
//   ): Promise<any> {
//     return this.bookingService.getAllBookingCustomer(request.user);
//   }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Post('setdailyschedule')
  async setDailySchedule(
    @Body() body: SetDailyScheduleDto,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.setDailySchedule(body, request.user);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Post('assigntechniciantodailyschedule')
  async assignTechnicianToDailySchedule(
    @Body() body: AssignTechnicianToDailyScheduleDto,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.assignTechnicianToDailySchedule(
      body,
      request.user,
    );
  }

  // @Public()
  // @Post('testcreateuser')
  // async testCreateUser(@Body() body: TestCreateUserDto)
  // {
  //     return this.bookingService.testCreateUser(body);
  // }
}

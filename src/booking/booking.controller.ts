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
import { Public } from 'src/common/decorators/public.decorator';
import { TestCreateUserDto } from './dtos/testCreateUser.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  // @Public()
  // @Post('testcreateuser')
  // async testCreateUser(@Body() body: TestCreateUserDto)
  // {
  //     return this.bookingService.testCreateUser(body);
  // }
}

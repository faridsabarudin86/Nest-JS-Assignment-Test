import { Body, Controller, Post, UseGuards, Request, Put, Get, Delete } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { BookingService } from './booking.service';
import { SetDailyScheduleDto } from './dtos/setDailySchedule.dto';
import { AssignTechnicianToDailyScheduleDto } from './dtos/assignedTechnicianToDailySchedule.dto';

@Controller('booking')
export class BookingController 
{
    constructor(private bookingService: BookingService) {}

    @Get()
    async getAllBooking(): Promise<any>
    {

    }

    @Get()
    async getBookingInformation(): Promise<any>
    {

    }

    @Post()
    async addBooking(): Promise<any>
    {

    }

    @Put()
    async cancelBooking(): Promise<any>
    {

    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('setdailyschedule')
    async setDailySchedule(@Body() setDailyScheduleDto: SetDailyScheduleDto, @Request() request: any): Promise<any>
    {
        return this.bookingService.setDailySchedule(setDailyScheduleDto, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('assigntechniciantodailyschedule')
    async assignTechnicianToDailySchedule(@Body() assignTechnicianToDailyScheduleDto: AssignTechnicianToDailyScheduleDto, @Request() request: any): Promise<any> {
        return this.bookingService.assignTechnicianToDailySchedule(assignTechnicianToDailyScheduleDto, request.user);
    }
}

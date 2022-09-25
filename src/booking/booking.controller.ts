import { Body, Controller, Post, UseGuards, Request, Put, Get, Delete } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { BookingService } from './booking.service';
import { SetDailyScheduleDto } from './dtos/setDailySchedule.dto';
import { AssignTechnicianToDailyScheduleDto } from './dtos/assignedTechnicianToDailySchedule.dto';
import { AddBookingDto } from './dtos/addBooking.dto';
import { GetAllBookingCorporateDto } from './dtos/getAllBookingCorporate.dto';

@Controller('booking')
export class BookingController 
{
    constructor(private bookingService: BookingService) {}

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Get('getallbookingcorporate')
    async getAllBookingCorporate(@Body() getAllBookingCorporateDto: GetAllBookingCorporateDto, @Request() request: any): Promise<any>
    {
        return this.bookingService.getAllBookingCorporate(getAllBookingCorporateDto, request.user);
    }

    @Get()
    async getBookingInformation(): Promise<any>
    {

    }

    @Roles(UserRoles.customer)
    @UseGuards(JwtAuthGuard)
    @Put('addbooking')
    async addBooking(@Body() addBookingDto: AddBookingDto, @Request() request: any): Promise<any>
    {
        return this.bookingService.addBooking(addBookingDto, request.user);
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

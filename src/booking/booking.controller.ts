import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingService } from './booking.service';
import { AddServiceBookingScheduleDto } from './dtos/addServiceBookingSchedule.dto';

@Controller('booking')
export class BookingController {
    constructor(private bookingService: BookingService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('addservicebookingschedule')
    async addServiceBookingSchedule(addServiceBookingScheduleDto: AddServiceBookingScheduleDto, response: any) {

        return this.bookingService.addServiceBookingSchedule(addServiceBookingScheduleDto, response.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async bookServiceSchedule() {
        
    }

}

import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
    constructor(bookingService: BookingService) {}

    

}

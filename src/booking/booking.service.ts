import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/auth/dtos/user.dto';
import { CorporateBranchesDto } from 'src/corporate/dtos/corporate-branches.dto';
import { CorporateDto } from 'src/corporate/dtos/corporate.dto';
import { CustomerVehicleDto } from 'src/customer/dtos/customer-vehicle.dto';
import { ServiceBookingScheduleDto } from './dtos/service-booking-schedule.dto';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
        @InjectModel('CorporateBranches') private readonly corporateBranchesModel: Model<CorporateBranchesDto>,
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        @InjectModel('CustomerVehicle') private readonly customerVehicleModel: Model<CustomerVehicleDto>,
        @InjectModel('ServiceBookingSchedule') private readonly serviceBookingScheduleModel: Model<ServiceBookingScheduleDto>,
    ) {}

    async addServiceBookingSchedule(serviceBookingScheduleDto: ServiceBookingScheduleDto): Promise<any> {

        
    }

    async bookServiceSchedule(serviceBookingScheduleDto: ServiceBookingScheduleDto): Promise<any> {


    }
}
 
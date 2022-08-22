import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/auth/dtos/user.dto';
import { CorporateBranchesDto } from 'src/corporate/dtos/corporate-branches.dto';
import { CorporateDto } from 'src/corporate/dtos/corporate.dto';
import { CustomerVehicleDto } from 'src/customer/dtos/customer-vehicle.dto';
import { ServiceBookingScheduleDto } from './dtos/service-booking-schedule.dto';
import { v4 as uuid } from 'uuid';
import { response } from 'express';
import { AddServiceBookingScheduleDto } from './dtos/addServiceBookingSchedule.dto';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
        @InjectModel('CorporateBranches') private readonly corporateBranchesModel: Model<CorporateBranchesDto>,
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        @InjectModel('CustomerVehicle') private readonly customerVehicleModel: Model<CustomerVehicleDto>,
        @InjectModel('ServiceBookingSchedule') private readonly serviceBookingScheduleModel: Model<ServiceBookingScheduleDto>,
    ) {}

    async addServiceBookingSchedule(addServiceBookingScheduleDto: AddServiceBookingScheduleDto, response: any): Promise<any> {

        const checkUser = await this.userModel.findOne({ 
            uuid: response.userId,
            corporateUuid: addServiceBookingScheduleDto.corporateUuid, 
            branchCorporateUuid: addServiceBookingScheduleDto.branchCorporateUuid,
        });

        if(!checkUser) throw new BadRequestException('User is not authorized');
        
        // Check for inserted technicians
        

        addServiceBookingScheduleDto.uuid = uuid();
    
        const newServiceBookingSchedule = new this.serviceBookingScheduleModel(addServiceBookingScheduleDto);
        
        return newServiceBookingSchedule.save();
    }

    async bookServiceSchedule(serviceBookingScheduleDto: ServiceBookingScheduleDto): Promise<any> {


    }
}
 
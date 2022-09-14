import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { request } from 'http';
import { Model } from 'mongoose';
import { CorporateBranchDto } from 'src/common/dtos/corporate-branch.dto';
import { CorporateDto } from 'src/common/dtos/corporate.dto';
import { ServiceBookingDto } from 'src/common/dtos/service-booking.dto';
import { UserDto } from 'src/common/dtos/user.dto';
import { VehicleDto } from 'src/common/dtos/vehicle.dto';
import { SetDailyScheduleDto } from './dtos/setDailySchedule.dto';
import { v4 as uuid } from 'uuid';
import { UserRoles } from 'src/common/config/userRoles';
import { AssignTechnicianToDailyScheduleDto } from './dtos/assignedTechnicianToDailySchedule.dto';
import { AddBookingDto } from './dtos/addBooking.dto';
import e from 'express';

@Injectable()
export class BookingService {
    constructor
        (
            @InjectModel('User') private readonly userModel: Model<UserDto>,
            @InjectModel('Vehicle') private readonly vehicleModel: Model<VehicleDto>,
            @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
            @InjectModel('CorporateBranch') private readonly corporateBranchModel: Model<CorporateBranchDto>,
            @InjectModel('ServiceBooking') private readonly serviceBookingModel: Model<ServiceBookingDto>,
        ) { }

    async getAllBooking(): Promise<any> {

    }

    async getBookingInformation(): Promise<any> {

    }

    async addBooking(addBookingDto: AddBookingDto, request: any): Promise<any> {

        const verifyUser = await this.userModel.findOne({
                uuid: request.userId,
            })
        if (!verifyUser) throw new BadRequestException('User is not authorized');

        const findVehicle = await this.vehicleModel.findOne(
            {
                ownerUuid: request.userId,
            },
            {
                information: { $elemMatch: { uuid: addBookingDto.vehicleUuid } },
            }
            )
        if (!findVehicle) throw new BadRequestException('User is not authorized');

        const updatedInformation =
        {
            'slots.0.customerUuid': request.userId,
            'slots.0.assignedTechnician': addBookingDto.assignedTechnician,
            'slots.0.vehicleUuid': addBookingDto.vehicleUuid,
            'slots.0.alternateDriverUuid': addBookingDto.alternateDriverUuid,
        }

        const updateBooking = await this.serviceBookingModel.updateOne(
            { uuid: addBookingDto.uuid },
            { $set: {'slots.0.customerUuid': request.userId,
            'slots.0.assignedTechnician': addBookingDto.assignedTechnician,
            'slots.0.vehicleUuid': addBookingDto.vehicleUuid,
            'slots.0.alternateDriverUuid': addBookingDto.alternateDriverUuid,} },
            { select: { slots: { $elemMatch: { uuid: addBookingDto.slotsUuid }}}, new: true },
        )

        return updateBooking;
        // Object.keys(updatedInformation).forEach
        //     (key => {
5
        //         if (updatedInformation['slots.alternateDriverUuid'] !== null || '')
        //         {
        //             const findAlternateDriver = this.vehicleModel.findOne({
        //                 ownerUuid: request.userId,
        //                 'information': { $elemMatch: { 'uuid': addBookingDto.vehicleUuid } },
        //                 'information.alternateDrivers': addBookingDto.alternateDriverUuid,
        //             })
        //             if (!findAlternateDriver) throw new BadRequestException('User is not authorized');
        //         }

        //         if (updatedInformation[key] === null || updatedInformation[key] === '') {
        //             delete updatedInformation[key];
        //         }
        //     });

        // Check If vehicle is SUV (Insert ). If Yes then requries to have 2 Technician to update. If not then only requires 1 update.
        // if (findVehicle.information[0].type == 'SUV') {

        // }
        // else {

        // for(let i = 0; i < findBooking.slots.length; i++)
        // {
    }

    async cancelBooking(): Promise<any> {

    }

    async setDailySchedule(setDailyScheduleDto: SetDailyScheduleDto, request: any): Promise<any> {
        const verifyUser = await this.userModel.findOne({
            uuid: request.userId,
            $or: [
                {
                    role: UserRoles.superAdmin
                },
                {
                    role: UserRoles.corporate,
                    'corporate.uuid': setDailyScheduleDto.corporateUuid,
                    'corporate.role': UserRoles.corporateAdmin,
                },
                {
                    role: UserRoles.corporate,
                    'corporate.uuid': setDailyScheduleDto.corporateUuid,
                    'corporate.branch.uuid': setDailyScheduleDto.branchUuid,
                    'corporate.branch.role': UserRoles.branchAdmin,
                }
            ],
        })

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        setDailyScheduleDto.date = new Date(Date.UTC(setDailyScheduleDto.dateYear, setDailyScheduleDto.dateMonth - 1, setDailyScheduleDto.dateDay));

        const checkTime = await this.corporateBranchModel.findOne({
            corporateUuid: setDailyScheduleDto.corporateUuid,
            uuid: setDailyScheduleDto.branchUuid,
        })

        if (!checkTime) throw new BadRequestException('User is not authorized');

        const startWorkingHours = new Date(checkTime.startWorkingHours);
        const endWorkingHours = new Date(checkTime.endWorkingHours);

        for (let i = 0; i < setDailyScheduleDto.slots.length; i++) {
            if (
                (
                    (setDailyScheduleDto.slots[i].startTimeHour > startWorkingHours.getUTCHours() && setDailyScheduleDto.slots[i].startTimeMinutes > startWorkingHours.getUTCMinutes())
                    &&
                    (setDailyScheduleDto.slots[i].endTimeHour < endWorkingHours.getUTCHours() && setDailyScheduleDto.slots[i].endTimeMinutes < endWorkingHours.getUTCMinutes())
                )
            ) throw new BadRequestException('User is not authorized1');
        }

        for (let i = 0; i < checkTime.offDays.length; i++) {
            if (setDailyScheduleDto.date.getUTCDay() === checkTime.offDays[i]) throw new BadRequestException('User is not authorized1');
        }

        for (let i = 0; i < setDailyScheduleDto.slots.length; i++) {
            setDailyScheduleDto.slots[i].uuid = uuid();
        }

        setDailyScheduleDto.uuid = uuid();

        for (let i = 0; i < setDailyScheduleDto.slots.length; i++) {

            setDailyScheduleDto.slots[i].startTime = new Date
                (
                    setDailyScheduleDto.dateYear, setDailyScheduleDto.dateMonth,
                    setDailyScheduleDto.dateDay,
                    setDailyScheduleDto.slots[i].startTimeHour,
                    setDailyScheduleDto.slots[i].startTimeMinutes
                );

            setDailyScheduleDto.slots[i].endTime = new Date
                (
                    setDailyScheduleDto.dateYear,
                    setDailyScheduleDto.dateMonth, setDailyScheduleDto.dateDay,
                    setDailyScheduleDto.slots[i].endTimeHour,
                    setDailyScheduleDto.slots[i].endTimeMinutes
                );
        }

        const newDailySchedule = new this.serviceBookingModel(setDailyScheduleDto);
        return await newDailySchedule.save();
    }

    async assignTechnicianToDailySchedule(assignTechnicianToDailyScheduleDto: AssignTechnicianToDailyScheduleDto, request: any): Promise<any> {

        const verifyUser = await this.userModel.findOne({
            uuid: request.userId,
            $or: [
                {
                    role: UserRoles.superAdmin
                },
                {
                    role: UserRoles.corporate,
                    'corporate.uuid': assignTechnicianToDailyScheduleDto.corporateUuid,
                    'corporate.role': UserRoles.corporateAdmin,
                },
                {
                    role: UserRoles.corporate,
                    'corporate.uuid': assignTechnicianToDailyScheduleDto.corporateUuid,
                    'corporate.branch.uuid': assignTechnicianToDailyScheduleDto.branchUuid,
                    'corporate.branch.role': UserRoles.branchAdmin,
                }
            ],
        })
        if (!verifyUser) throw new BadRequestException('User is not authorized');

        for (let i = 0; i < assignTechnicianToDailyScheduleDto.techniciansOfTheDay.length; i++) {

            const findTechnician = await this.userModel.findOne({
                emailAddress: assignTechnicianToDailyScheduleDto.techniciansOfTheDay[i],
                'corporate.branch.role': UserRoles.technician,
                'corporate.uuid': assignTechnicianToDailyScheduleDto.corporateUuid,
                'corporate.branch.uuid': assignTechnicianToDailyScheduleDto.branchUuid
            })

            if (!findTechnician) throw new BadRequestException('User does not exist');

            assignTechnicianToDailyScheduleDto.techniciansOfTheDay[i] = findTechnician.uuid;
        }

        for (let i = 0; i < assignTechnicianToDailyScheduleDto.techniciansOfTheDay.length; i++) {
            const findSchedule = await this.serviceBookingModel.findOneAndUpdate(
                {
                    uuid: assignTechnicianToDailyScheduleDto.uuid,
                    corporateUuid: assignTechnicianToDailyScheduleDto.corporateUuid,
                    branchUuid: assignTechnicianToDailyScheduleDto.branchUuid,
                },
                {
                    $push: { techniciansOfTheDay: assignTechnicianToDailyScheduleDto.techniciansOfTheDay[i] }
                },
                {
                    new: true
                },
            )
            if (!findSchedule) throw new BadRequestException('User is not authorized');

            return await findSchedule.save();
        }
    }
}

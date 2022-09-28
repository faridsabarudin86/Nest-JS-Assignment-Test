import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
import { BookingStatus } from 'src/common/config/bookingStatus';
import { GetAllBookingCorporateDto } from './dtos/getAllBookingCorporate.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TestCreateUserEvent } from './events/testCreateUser.event';
import { AppService } from 'src/app.service';
import { TestCreateUserDto } from './dtos/testCreateUser.dto';
import { resolve } from 'path';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDto>,
    @InjectModel('Vehicle') private readonly vehicleModel: Model<VehicleDto>,
    @InjectModel('Corporate')
    private readonly corporateModel: Model<CorporateDto>,
    @InjectModel('CorporateBranch')
    private readonly corporateBranchModel: Model<CorporateBranchDto>,
    @InjectModel('ServiceBooking')
    private readonly serviceBookingModel: Model<ServiceBookingDto>,
    private eventEmitter: EventEmitter2,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  private readonly logger = new Logger(BookingService.name);

  async getAllBookingCorporate(
    body: GetAllBookingCorporateDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const findAllBookings = await this.serviceBookingModel.find({
      corporateUuid: body.corporateUuid,
      branchUuid: body.branchUuid,
      date: body.date,
    });
    if (!findAllBookings)
      throw new BadRequestException('User is not authorized');

    return findAllBookings;
  }

//   async getAllBookingCustomer(request: any): Promise<any> {
//     const verifyUser = await this.userModel.find({
//       uuid: request.userId,
//     });
//     if (!verifyUser) throw new BadRequestException('User is not authorized');

//     const findAllBookings = await this.serviceBookingModel
//       .aggregate([
//         {$match: {'slots.customerUuid': request.userId}},
//         {$project: {
//             input: '$slots',

//         }}
//       ])

//     if (!findAllBookings)
//       throw new BadRequestException('User is not authorized');

//     return findAllBookings;
//   }

  async addBooking(body: AddBookingDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const findVehicle = await this.vehicleModel.findOne(
      {
        ownerUuid: request.userId,
      },
      {
        information: { $elemMatch: { uuid: body.vehicleUuid } },
      },
    );
    if (!findVehicle) throw new BadRequestException('User is not authorized');

    const updatedInformation = {
      'slots.0.customerUuid': request.userId,
      'slots.0.assignedTechnician': body.assignedTechnician,
      'slots.0.vehicleUuid': body.vehicleUuid,
      'slots.0.alternateDriverUuid': body.alternateDriverUuid,
      'slots.0.status': BookingStatus.booked,
    };

    const objKeys = Object.keys(updatedInformation);
    objKeys.forEach((key) => {
      if (updatedInformation[key] === null || updatedInformation[key] === '') {
        delete updatedInformation[key];
      }
    });

    if (findVehicle.information[0].type == 'SUV') {
      if (body.assignedTechnician.length == 2) {
        const updateBooking = await this.serviceBookingModel.findOneAndUpdate(
          { uuid: body.uuid },
          { $set: updatedInformation },
          {
            select: { slots: { $elemMatch: { uuid: body.slotsUuid } } },
            new: true,
          },
        );

        return updateBooking.save();
      }
      throw new BadRequestException('User is not authorized');
    } else {
      const updateBooking = await this.serviceBookingModel.findOneAndUpdate(
        { uuid: body.uuid },
        { $set: updatedInformation },
        {
          select: { slots: { $elemMatch: { uuid: body.slotsUuid } } },
          new: true,
        },
      );

      return updateBooking.save();
    }
  }

  async cancelBooking(): Promise<any> {}

  async setDailySchedule(
    body: SetDailyScheduleDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    body.date = new Date(
      Date.UTC(body.dateYear, body.dateMonth - 1, body.dateDay),
    );

    const checkTime = await this.corporateBranchModel.findOne({
      corporateUuid: body.corporateUuid,
      uuid: body.branchUuid,
    });

    if (!checkTime) throw new BadRequestException('User is not authorized');

    const startWorkingHours = new Date(checkTime.startWorkingHours);
    const endWorkingHours = new Date(checkTime.endWorkingHours);

    for (let i = 0; i < body.slots.length; i++) {
      if (
        body.slots[i].startTimeHour > startWorkingHours.getUTCHours() &&
        body.slots[i].startTimeMinutes > startWorkingHours.getUTCMinutes() &&
        body.slots[i].endTimeHour < endWorkingHours.getUTCHours() &&
        body.slots[i].endTimeMinutes < endWorkingHours.getUTCMinutes()
      )
        throw new BadRequestException('User is not authorized1');
    }

    for (let i = 0; i < checkTime.offDays.length; i++) {
      if (body.date.getUTCDay() === checkTime.offDays[i])
        throw new BadRequestException('User is not authorized1');
    }

    for (let i = 0; i < body.slots.length; i++) {
      body.slots[i].uuid = uuid();
    }

    body.uuid = uuid();
    body.status = BookingStatus.open;

    for (let i = 0; i < body.slots.length; i++) {
      body.slots[i].startTime = new Date(
        body.dateYear,
        body.dateMonth,
        body.dateDay,
        body.slots[i].startTimeHour,
        body.slots[i].startTimeMinutes,
      );

      body.slots[i].endTime = new Date(
        body.dateYear,
        body.dateMonth,
        body.dateDay,
        body.slots[i].endTimeHour,
        body.slots[i].endTimeMinutes,
      );
    }

    const newDailySchedule = new this.serviceBookingModel(body);
    return await newDailySchedule.save();
  }

  async assignTechnicianToDailySchedule(
    body: AssignTechnicianToDailyScheduleDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    for (let i = 0; i < body.techniciansOfTheDay.length; i++) {
      const findTechnician = await this.userModel.findOne({
        emailAddress: body.techniciansOfTheDay[i],
        'corporate.branch.role': UserRoles.technician,
        'corporate.uuid': body.corporateUuid,
        'corporate.branch.uuid': body.branchUuid,
      });

      if (!findTechnician) throw new BadRequestException('User does not exist');

      body.techniciansOfTheDay[i] = findTechnician.uuid;
    }

    for (let i = 0; i < body.techniciansOfTheDay.length; i++) {
      const findSchedule = await this.serviceBookingModel.findOneAndUpdate(
        {
          uuid: body.uuid,
          corporateUuid: body.corporateUuid,
          branchUuid: body.branchUuid,
        },
        {
          $push: { techniciansOfTheDay: body.techniciansOfTheDay[i] },
        },
        {
          new: true,
        },
      );
      if (!findSchedule)
        throw new BadRequestException('User is not authorized');

      return await findSchedule.save();
    }
  }

  // async testCreateUser (body: TestCreateUserDto)
  // {
  //     this.logger.log('Creating user...', body);
  //     const userId = '123';

  //     // this.evenEmitter.emit doesnt stop the code. It will trigger and send to another function with a onEvent Decorator
  //     this.eventEmitter.emit(
  //         'user.created',
  //         new TestCreateUserEvent(userId, body.email)
  //     )

  //     const establishedWSTimeout = setTimeout
  //     (
  //         () => this.establishWebSocketConnection(userId),
  //         500,
  //     );

  //     this.schedulerRegistry.addTimeout(
  //         '$(userId)_establish_ws',
  //         establishedWSTimeout,
  //     )
  // }

  // // This is the place where do send emails to the user and stuff like that. The function which triggered this event will still work without waiting the event to finish.
  // // And will activate this function on another thread.
  // @OnEvent('user.created')
  // welcomeUser(payload: TestCreateUserEvent)
  // {
  //     this.logger.log("Welcome new User...", payload.email);
  // }

  // // This is to ensure that more than one event could be fired at the same time
  // @OnEvent('user.created', {async: true})
  // async sendWelcomeGift(payload: TestCreateUserEvent)
  // {
  //     this.logger.log("Sending Welcome gift ...", payload.email);

  //     await new Promise<void> ((resolve) => setTimeout(() => resolve(), 3000));

  //     this.logger.log("Welcome gift sent.", payload.email);
  // }

  // private establishWebSocketConnection(userId: string) {
  //     this.logger.log("Establishing WS connection with user...", userId);
  // }

  // @Cron(CronExpression.EVERY_10_SECONDS, {name: 'delete_expired_users'})
  // deleteExpiredUsers() {
  //     this.logger.log('Delete expired users ...');
  // }
}

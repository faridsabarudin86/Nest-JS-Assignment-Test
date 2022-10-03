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
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TestCreateUserEvent } from './events/testCreateUser.event';
import { AppService } from 'src/app.service';
import { TestCreateUserDto } from './dtos/testCreateUser.dto';
import { resolve } from 'path';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { GetAvailableBookingSlotsDto } from './dtos/getAvailableBookingSlots.dto';

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

  async getDailyBookingCorporateBranch(
    paramCorporateId: string,
    paramBranchId: string,
    day: string,
    month: string,
    year: string,
    request: any,
  ): Promise<any> {
    let parseDay = parseInt(day);
    let parseMonth = parseInt(month);
    let parseYear = parseInt(year);

    const date = new Date(Date.UTC(parseYear, parseMonth, parseDay));

    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const findAllBookings = await this.serviceBookingModel.find({
      corporateUuid: paramCorporateId,
      branchUuid: paramBranchId,
      date: date,
    });
    if (!findAllBookings)
      throw new BadRequestException('User is not authorized');

    return findAllBookings;
  }

  async setDailySchedule(
    paramCorporateId: string,
    paramBranchId: string,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    body.date = new Date(Date.UTC(body.dateYear, body.dateMonth, body.dateDay));

    const getWorkingHours = await this.corporateBranchModel.findOne({
      corporateUuid: paramCorporateId,
      uuid: paramBranchId,
    });
    if (!getWorkingHours)
      throw new BadRequestException('User is not authorized');

    const startWorkingHours = new Date(getWorkingHours.startWorkingHours);
    const endWorkingHours = new Date(getWorkingHours.endWorkingHours);

    for (let i = 0; i < body.slots.length; i++) {
      if (
        body.slots[i].startTimeHour > startWorkingHours.getUTCHours() &&
        body.slots[i].startTimeMinutes > startWorkingHours.getUTCMinutes() &&
        body.slots[i].endTimeHour < endWorkingHours.getUTCHours() &&
        body.slots[i].endTimeMinutes < endWorkingHours.getUTCMinutes()
      )
        throw new BadRequestException(
          'Time set is before the working hours or/and after the working hours',
        );
    }

    for (let i = 0; i < getWorkingHours.offDays.length; i++) {
      if (body.date.getUTCDay() === getWorkingHours.offDays[i])
        throw new BadRequestException('Time set is during offdays');
    }

    for (let i = 0; i < body.slots.length; i++) {
      body.slots[i].uuid = uuid();
    }

    body.uuid = uuid();
    body.corporateUuid = paramCorporateId;
    body.branchUuid = paramBranchId;

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

      body.slots[i].status = BookingStatus.open;
    }

    const newDailySchedule = new this.serviceBookingModel(body);
    return await newDailySchedule.save();
  }

  async assignTechnicianToDailySchedule(
    paramCorporateId: string,
    paramBranchId: string,
    paramScheduleId: string,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    for (let i = 0; i < body.techniciansOfTheDay.length; i++) {
      const findTechnician = await this.userModel.findOne({
        emailAddress: body.techniciansOfTheDay[i],
        'corporate.uuid': paramCorporateId,
        'corporate.branch.uuid': paramBranchId,
        'corporate.branch.role': UserRoles.technician,
      });
      if (!findTechnician) throw new BadRequestException('User does not exist');

      body.techniciansOfTheDay[i] = findTechnician.uuid;
    }

    for (let i = 0; i < body.techniciansOfTheDay.length; i++) {
      const findSchedule = await this.serviceBookingModel.findOneAndUpdate(
        {
          uuid: paramScheduleId,
          corporateUuid: paramCorporateId,
          branchUuid: paramBranchId,
        },
        {
          $push: { techniciansOfTheDay: body.techniciansOfTheDay[i] },
        },
        {
          new: true,
        },
      );
      if (!findSchedule) throw new BadRequestException('No schedule found');

      findSchedule.save();
    }
  }

  async getAllAvailableBookingSlots(
    day: string,
    month: string,
    year: string,
    body: GetAvailableBookingSlotsDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.find({
      uuid: request.userId,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const parseDay = parseInt(day);
    const parseMonth = parseInt(month);
    const parseYear = parseInt(year);

    const date = new Date(Date.UTC(parseYear, parseMonth, parseDay));

    const findAllBookings = await this.serviceBookingModel.find(
      {
        corporateUuid: body.corporateUuid,
        branchUuid: body.branchUuid,
        date: date,
      },
      {
        slots: { $elemMatch: { status: BookingStatus.open } },
      },
    );
    if (!findAllBookings)
      throw new BadRequestException('User is not authorized');

    return findAllBookings;
  }

  async addBooking(
    paramBookingSlotId: string,
    body: AddBookingDto,
    request: any,
  ): Promise<any> {
    const checkBookingStatus = await this.serviceBookingModel.findOne(
      { 'slots.uuid': paramBookingSlotId },
      { slots: { $elemMatch: { uuid: paramBookingSlotId } } },
    );
    if (!(checkBookingStatus.slots[0].status === BookingStatus.open))
      throw new BadRequestException(
        'Schedule Slot that has been chosen is not Opened Status',
      );

    const checkDate = await this.serviceBookingModel.findOne({
      'slots.uuid': paramBookingSlotId,
    });

    const todayDate = new Date().toLocaleString();
    const scheduleDate = checkDate.date.toLocaleString();

    if (todayDate === scheduleDate)
      throw new BadRequestException('User cannot book on the same day');

    const verifyUser = await this.userModel.findOne({ uuid: request.userId });
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
      'slots.$.customerUuid': request.userId,
      'slots.$.assignedTechnician': body.assignedTechnician,
      'slots.$.vehicleUuid': body.vehicleUuid,
      'slots.$.alternateDriverUuid': body.alternateDriverUuid,
      'slots.$.status': BookingStatus.booked,
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
          { slots: { $elemMatch: { status: BookingStatus.open } } },
          { $set: updatedInformation },
          {
            select: { slots: { $elemMatch: { uuid: paramBookingSlotId } } },
            new: true,
          },
        );

        return updateBooking.save();
      }
      throw new BadRequestException(
        'User must choose 2 Technicians for SUV Vehicles',
      );
    } else {
      const updateBooking = await this.serviceBookingModel.findOneAndUpdate(
        { slots: { $elemMatch: { status: BookingStatus.open } } },
        { $set: updatedInformation },
        {
          select: { slots: { $elemMatch: { uuid: paramBookingSlotId } } },
          new: true,
        },
      );

      return updateBooking.save();
    }
  }

  async updateBookingToInProgress(
    paramScheduleSlotsId: string,
    request: any,
  ): Promise<any> {
    const checkBookingStatus = await this.serviceBookingModel.findOne(
      { 'slots.uuid': paramScheduleSlotsId },
      { slots: { $elemMatch: { uuid: paramScheduleSlotsId } } },
    );
    if (!(checkBookingStatus.slots[0].status === BookingStatus.booked))
      throw new BadRequestException(
        'Schedule Slot that has been chosen is not Booked Status',
      );

    const verifyUser = await this.userModel.find({ uuid: request.userId });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const updateBookingStatus = await this.serviceBookingModel.findOneAndUpdate(
      { slots: { $elemMatch: { status: BookingStatus.booked } } },
      { $set: { 'slots.$.status': BookingStatus.inProgress } },
      {
        select: { slots: { $elemMatch: { uuid: paramScheduleSlotsId } } },
        new: true,
      },
    );
    if (!updateBookingStatus)
      throw new BadRequestException('Was not able to cancel the Booking');

    return updateBookingStatus.save();
  }

  async updateBookingToCompleted(
    paramScheduleSlotsId: string,
    request: any,
  ): Promise<any> {
    const checkBookingStatus = await this.serviceBookingModel.findOne(
      { 'slots.uuid': paramScheduleSlotsId },
      { slots: { $elemMatch: { uuid: paramScheduleSlotsId } } },
    );
    if (!(checkBookingStatus.slots[0].status === BookingStatus.inProgress))
      throw new BadRequestException(
        'Schedule Slot that has been chosen is not In-Progress Status',
      );

    const verifyUser = await this.userModel.find({ uuid: request.userId });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const updateBookingStatus = await this.serviceBookingModel.findOneAndUpdate(
      { slots: { $elemMatch: { status: BookingStatus.inProgress } } },
      { $set: { 'slots.$.status': BookingStatus.completed } },
      {
        select: { slots: { $elemMatch: { uuid: paramScheduleSlotsId } } },
        new: true,
      },
    );
    if (!updateBookingStatus)
      throw new BadRequestException('Was not able to cancel the Booking');

    return updateBookingStatus.save();
  }

  async getAllBookingCustomer(request: any): Promise<any> {
    const verifyUser = await this.userModel.find({
      uuid: request.userId,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const findAllBookings = await this.serviceBookingModel.find(
      { 'slots.customerUuid': request.userId },
      { slots: { $elemMatch: { customerUuid: request.userId } } },
    );
    if (!findAllBookings)
      throw new BadRequestException('User is not authorized');

    return findAllBookings;
  }

  async getBookingInfoCustomer(
    paramScheduleId: string,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.find({
      uuid: request.userId,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const findBookingInfo = await this.serviceBookingModel.findOne(
      { slots: { $elemMatch: { uuid: paramScheduleId } } },
      { slots: { $elemMatch: { uuid: paramScheduleId } } },
    );
    if (!findBookingInfo)
      throw new BadRequestException('Cannot get the Booking Info');

    return findBookingInfo;
  }

  async cancelBooking(paramScheduleSlotId: string, request: any): Promise<any> {
    const verifyUser = await this.userModel.find({ uuid: request.userId });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const cancelBookingStatus = await this.serviceBookingModel.findOneAndUpdate(
      { slots: { $elemMatch: { customerUuid: request.userId } } },
      { $set: { 'slots.$.status': BookingStatus.canceled } },
      {
        select: { slots: { $elemMatch: { uuid: paramScheduleSlotId } } },
        new: true,
      },
    );
    if (!cancelBookingStatus)
      throw new BadRequestException('Was not able to cancel the Booking');

    return cancelBookingStatus.save();
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

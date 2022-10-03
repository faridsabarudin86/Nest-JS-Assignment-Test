import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/common/dtos/user.dto';
import { VehicleDto } from 'src/common/dtos/vehicle.dto';
import { UpdateCustomerDto } from './dtos/updateCustomer.dto';
import * as bcrypt from 'bcrypt';
import { RegisterCustomerDto } from './dtos/registerCustomer.dto';
import { v4 as uuid } from 'uuid';
import { UserRoles } from 'src/common/config/userRoles';
import { AddVehicleDto } from './dtos/addVehicle.dto';
import { UpdateVehicleDto } from './dtos/updateVehicle.dto';
import { AddAlternateDriverDto } from './dtos/addAlternateDriver.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDto>,
    @InjectModel('Vehicle') private readonly vehicleModel: Model<VehicleDto>,
  ) {}

  async registerCustomer(body: RegisterCustomerDto): Promise<any> {
    const hash = await bcrypt.hash(body.password, 10);

    body.uuid = uuid();
    body.password = hash;
    body.role = UserRoles.customer;

    const registerUser = new this.userModel(body);

    return registerUser.save();
  }

  async getCustomer(request: any): Promise<any> {
    const findUser = await this.userModel.findOne({
      uuid: request.userId,
      role: UserRoles.customer,
    });
    if (!findUser)
      throw new BadRequestException('User doesnt exists or Authorized');

    return findUser;
  }

  async updateCustomer(body: UpdateCustomerDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      role: UserRoles.customer,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    if (body.password !== null || '') {
      const hash = await bcrypt.hash(body.password, 10);
      body.password = hash;
    }

    const updatedInformation = {
      emailAddress: body.emailAddress,
      password: body.password,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
    };

    Object.keys(updatedInformation).forEach((key) => {
      if (updatedInformation[key] === null || updatedInformation[key] === '') {
        delete updatedInformation[key];
      }
    });

    const updateUser = await this.userModel.findOneAndUpdate(
      { uuid: request.userId },
      updatedInformation,
      { new: true },
    );

    return await updateUser.save();
  }

  async getCustomerVehicles(request: any): Promise<any> {
    const findVehicles = await this.vehicleModel.find({
      ownerUuid: request.userId,
    });
    if (!findVehicles) throw new BadRequestException('No Vehicles Found');

    return findVehicles;
  }

  async addVehicle(body: AddVehicleDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      role: UserRoles.customer,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const checkUserVehicleList = await this.vehicleModel.findOne({
      ownerUuid: request.userId,
    });

    if (!checkUserVehicleList) {
      body.uuid = uuid();
      body.ownerUuid = request.userId;

      for (let i = 0; i < body.information.length; i++) {
        body.information[i].uuid = uuid();
      }

      const addVehicle = new this.vehicleModel(body);

      return await addVehicle.save();
    } else {
      for (let i = 0; i < body.information.length; i++) {
        const updatedInformation = {
          uuid: uuid(),
          brand: body.information[i].brand,
          model: body.information[i].model,
          type: body.information[i].type,
          colour: body.information[i].colour,
          plateNumber: body.information[i].plateNumber,
          chassisNumber: body.information[i].chassisNumber,
        };

        const addNewVehicle = await this.vehicleModel.findOneAndUpdate(
          { ownerUuid: request.userId },
          { $push: { information: updatedInformation } },
          { new: true },
        );

        return await addNewVehicle.save();
      }
    }
  }

  async getVehicleInfo(paramVehicleId: string, request: any): Promise<any> {
    const findVehicles = await this.vehicleModel.findOne(
      { ownerUuid: request.userId },
      { information: { $elemMatch: { uuid: paramVehicleId } } },
    );

    if (!findVehicles) throw new BadRequestException('No Vehicles Found');

    return findVehicles;
  }

  async updateVehicle(
    paramVehicleId: string,
    body: UpdateVehicleDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.vehicleModel.findOne({
      ownerUuid: request.userId,
      'information.uuid': paramVehicleId,
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const updatedInformation = {
      'information.$.colour': body.colour,
      'information.$.plateNumber': body.plateNumber,
      'infromation.$.chassisNumber': body.chassisNumber,
    };

    Object.keys(updatedInformation).forEach((key) => {
      if (updatedInformation[key] === null || updatedInformation[key] === '') {
        delete updatedInformation[key];
      }
    });

    const updateVehicle = await this.vehicleModel.findOneAndUpdate(
      { ownerUuid: request.userId, 'information.uuid': paramVehicleId },
      updatedInformation,
      { new: true },
    );

    return await updateVehicle.save();
  }

  async removeVehicle(paramVehicleId: string, request: any): Promise<any> {
    const verifyUser = await this.vehicleModel.findOne({
      ownerUuid: request.userId,
      'information.uuid': paramVehicleId,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    console.log(paramVehicleId);
    console.log('yes');

    const deleteVehicle = await this.vehicleModel.findOneAndUpdate(
      { ownerUuid: request.userId },
      { $pull: { information: { uuid: paramVehicleId } } },
      { new: true },
    );

    return await deleteVehicle.save();
  }

  async addAlternateDriver(
    paramVehicleId: string,
    body: AddAlternateDriverDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.vehicleModel.findOne({
      ownerUuid: request.userId,
      'information.uuid': paramVehicleId,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const findAlternateUser = await this.userModel.findOne({
      emailAddress: body.email,
    });
    if (!findAlternateUser)
      throw new BadRequestException('No User Exist with that Email Address');

    const addDriver = await this.vehicleModel.findOneAndUpdate(
      { ownerUuid: request.userId, 'information.uuid': paramVehicleId },
      { $push: { 'information.$.alternateDrivers': findAlternateUser.uuid } },
      { new: true },
    );

    return await addDriver.save();
  }

  async removeAlternateDriver(
    paramVehicleId: string,
    paramAlternateDriverId: string,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.vehicleModel.findOne({
      ownerUuid: request.userId,
      'information.uuid': paramVehicleId,
    });
    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const removeDriver = await this.vehicleModel.findOneAndUpdate(
      { ownerUuid: request.userId, 'information.uuid': paramVehicleId },
      { $pull: { 'information.$.alternateDrivers': paramAlternateDriverId } },
      { new: true },
    );

    return await removeDriver.save();
  }
}

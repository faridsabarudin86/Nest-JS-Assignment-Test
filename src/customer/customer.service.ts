import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/auth/dtos/user.dto';
import { AddVehicleDto } from './dtos/addVehicle.dto';
import { v4 as uuid } from 'uuid';
import { AddAlternateDriverDto } from './dtos/addAlternateDrivers.dto';
import { RegisterNewCustomerDto } from './dtos/registerNewCustomer.dto';
import { CustomerVehicleDto } from './dtos/customer-vehicle.dto';
import { UserRoles } from 'src/config/userRoles';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        @InjectModel('CustomerVehicle') private readonly customerVehicleModel: Model<CustomerVehicleDto>,
        ) {}

        async registerNewCustomer(registerNewCustomerDto: RegisterNewCustomerDto) {
            
            registerNewCustomerDto.uuid = uuid();

            registerNewCustomerDto.userType = UserRoles.customer;

            const newUser = new this.userModel(registerNewCustomerDto);

            return await newUser.save();
        }

        async addVehicle(addVehicleDto: AddVehicleDto, request: any) {

            const findUserType = await this.userModel.findOne( { uuid: request.userId, userType: UserRoles.customer } );

            if(!findUserType) throw new BadRequestException('User does not have permission to use this feature');

            addVehicleDto.uuid = uuid();

            addVehicleDto.ownerUuid = request.userId;

            const newVehicle = new this.customerVehicleModel(addVehicleDto);

            return await newVehicle.save();
        }

        async addAlternateDrivers(addAlternateDriverDto: AddAlternateDriverDto, request: any) {

            const findVehicle = await this.customerVehicleModel.findOne({ ownerUuid: request.userId, chassisNumber: addAlternateDriverDto.chassisNumber});
            if (!findVehicle) throw new BadRequestException('Searched Vehicle is not found');
            const vehicleOwner = findVehicle.ownerUuid;
            const chassisNumber = findVehicle.chassisNumber;

            const findAlternateDriver = await this.userModel.findOne( {emailAddress : addAlternateDriverDto.emailAddress, userType: UserRoles.customer} );
            if (!findAlternateDriver) throw new BadRequestException( 'User does not exists' );
            const alternateDriver = findAlternateDriver.uuid;

            if (alternateDriver === request.userId ) throw new BadRequestException( 'User cannot assign self as Alternate Driver' );

            const checkVehicleAlternateDrivers = await this.customerVehicleModel.findOne( { alternateDriversUuid: alternateDriver, chassisNumber: chassisNumber } );
            if (checkVehicleAlternateDrivers) throw new BadRequestException( 'Alternate Driver already assigned to this vehicle');

            const newVehicle = this.customerVehicleModel.findOneAndUpdate(
                { ownerUuid: vehicleOwner, chassisNumber: chassisNumber },
                { $push: {alternateDriversUuid: alternateDriver} },
            );

            return (await newVehicle).save();
        }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from 'src/auth/dtos/auth.dto';
import { CustomerVehicleDto } from './dtos/customer-vehicle.dto';
import { v4 as uuid } from 'uuid';
import { AlternateDriverDto } from './dtos/alternate-driver.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<AuthDto>,
        @InjectModel('CustomerVehicle') private readonly customerVehicleModel: Model<CustomerVehicleDto>,
        ) {}

        async registerNewCustomer(authDto: AuthDto): Promise<AuthDto> {
            
            authDto.uuid = uuid();
            authDto.userType = 'Customer';
            authDto.corporate_uuid = null;
            authDto.corporateBranch_uuid = null;

            const newUser = new this.userModel(authDto);

            return await newUser.save();
        }

        async addVehicle(customerVehicleDto: CustomerVehicleDto, request): Promise<CustomerVehicleDto> {

            customerVehicleDto.uuid = uuid();
            customerVehicleDto.owner_uuid = request.userId;

            const newVehicle = new this.customerVehicleModel(customerVehicleDto);

            return await newVehicle.save();
        }

        async addAlternateDrivers(alternateDriverDto: AlternateDriverDto, customerVehicleDto: CustomerVehicleDto, request): Promise<CustomerVehicleDto> {

            // Search for the vehicle related to the current userid and chassis number
            const findVehicle = await this.customerVehicleModel.findOne({ owner_uuid: request.userId, vehicleChassisNumber: customerVehicleDto.vehicleChassisNumber});
            if (!findVehicle) throw new BadRequestException('Searched Vehicle is not found');
            const vehicleOwner = findVehicle.owner_uuid;
            const chassisNumber = findVehicle.vehicleChassisNumber;

            // Insert alternate driver's email address to check for uuid if the alternate driver has an account
            const findAlternateDriver = await this.userModel.findOne( {emailAddress : alternateDriverDto.emailAddress, userType: 'Customer'} );
            if (!findAlternateDriver) throw new BadRequestException( 'User does not exists' );
            const alternateDriver = findAlternateDriver.uuid;

            // Check if alternate driver's uuid is already attached to the vehicle or not
            const checkVehicleAlternateDrivers = await this.customerVehicleModel.findOne( { alternateDrivers_uuid: alternateDriver, vehicleChasisNumber: chassisNumber } );
            if (checkVehicleAlternateDrivers) throw new BadRequestException( 'Alternate Driver already assigned to this vehicle');

            // Push the alternate drivers uuid to the top of the list in the database
            const newVehicle = this.customerVehicleModel.findOneAndUpdate(
                { owner_uuid: vehicleOwner, vehicleChasisNumber: chassisNumber },
                { $push: {alternateDrivers_uuid: alternateDriver} },
            );

            // Return save database
            return (await newVehicle).save();
        }

        
}

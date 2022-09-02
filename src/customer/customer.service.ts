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
import { DeleteVehicleDto } from './dtos/deleteVehicle.dto';
import { AddAlternateDriverDto } from './dtos/addAlternateDriver.dto';
import { RemoveAlternateDriverDto } from './dtos/removeAlternateDriver.dto';

@Injectable()
export class CustomerService 
{
    constructor
    (
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        @InjectModel('Vehicle') private readonly vehicleModel: Model<VehicleDto>,
    ) {}

    async registerCustomer(registerCustomerDto: RegisterCustomerDto): Promise<any>
    {
        const hash = await bcrypt.hash(registerCustomerDto.password, 10);

        registerCustomerDto.uuid = uuid();
        registerCustomerDto.password = hash;
        registerCustomerDto.role = UserRoles.customer;

        const registerUser = new this.userModel(registerCustomerDto);

        return registerUser.save();
    }

    async getCustomer(request: any): Promise<any>
    {
        const findUser = await this.userModel.findOne({uuid: request.userId, role: UserRoles.customer})
        if(!findUser) throw new BadRequestException('User is not authorized');

        return findUser;
    }

    // Add validation, user cannot change email address to an email address that already assigned
    async updateCustomer(updateCustomerDto: UpdateCustomerDto, request: any): Promise<any>
    {
        const verifyUser = await this.userModel.findOne({uuid: request.userId, role: UserRoles.customer})
        if(!verifyUser) throw new BadRequestException('User is not authorized');

        if(updateCustomerDto.password !== null || '')
        {
            const hash = await bcrypt.hash(updateCustomerDto.password, 10);
            updateCustomerDto.password = hash;
        }

        const updatedInformation = 
        {
            emailAddress: updateCustomerDto.emailAddress,
            password: updateCustomerDto.password,
            fullName: updateCustomerDto.fullName,
            phoneNumber: updateCustomerDto.phoneNumber,
        }

        Object.keys(updatedInformation).forEach
        (key => 
            {
                if (updatedInformation[key] === null || updatedInformation[key] === '') 
                {
                    delete updatedInformation[key];
                }
            });

        const updateUser = await this.userModel.findOneAndUpdate
        (
            {uuid: request.userId},
            updatedInformation,
            {new: true},
        )
        
        return await updateUser.save();
    }

    async getCustomerVehicles(request: any): Promise<any>
    {
        const findVehicles = await this.vehicleModel.find({ownerUuid: request.userId});
        if(!findVehicles) throw new BadRequestException('No Vehicles Found');

        return findVehicles;
    }

    // Validation needs to be added, check the plateNumber. Wont insert if plateNumber exists.
    async addVehicle(addVehicleDto: AddVehicleDto, request: any): Promise<any>
    {   
        const verifyUser = await this.userModel.findOne({uuid: request.userId, role: UserRoles.customer});
        if(!verifyUser) throw new BadRequestException('User is not authorized');

        const checkUserVehicleList = await this.vehicleModel.findOne({ownerUuid: request.userId});

        if(!checkUserVehicleList)
        {
            addVehicleDto.uuid = uuid();
            addVehicleDto.ownerUuid = request.userId;
            addVehicleDto.information[addVehicleDto.information.length - 1].uuid = uuid();
            const addVehicle = new this.vehicleModel(addVehicleDto);

            return await addVehicle.save();
        }
        else
        {
            const updatedInformation = 
            {
                uuid: uuid(),
                brand: addVehicleDto.information[addVehicleDto.information.length - 1].brand,
                model: addVehicleDto.information[addVehicleDto.information.length - 1].model,
                type: addVehicleDto.information[addVehicleDto.information.length - 1].type,
                colour: addVehicleDto.information[addVehicleDto.information.length - 1].colour,
                plateNumber: addVehicleDto.information[addVehicleDto.information.length - 1].plateNumber,
                chassisNumber: addVehicleDto.information[addVehicleDto.information.length - 1].chassisNumber,
            }

            const addNewVehicle = await this.vehicleModel.findOneAndUpdate
            (
                {ownerUuid: request.userId},
                {$push: {information: updatedInformation}},
                {new: true},
            );

            return await addNewVehicle.save();
        }
    }

    // Have to be looked back, only updating the first one.
    async updateVehicle(updateVehicleDto: UpdateVehicleDto, request: any): Promise<any>
    {
        const verifyUser = await this.vehicleModel.findOne
        ({
            ownerUuid: request.userId,
            'information.uuid': updateVehicleDto.uuid ,
        });

        if(!verifyUser) throw new BadRequestException('User is not authorized');

        const updatedInformation = 
            {
                'information.0.colour': updateVehicleDto.colour,
                'information.0.plateNumber': updateVehicleDto.plateNumber,
                'infromation.0.chassisNumber': updateVehicleDto.chassisNumber,
            }

            Object.keys(updatedInformation).forEach
            (key => {

                    if (updatedInformation[key] === null || updatedInformation[key] === '') 
                    {
                        delete updatedInformation[key];
                    }
                });

            const updateVehicle = await this.vehicleModel.findOneAndUpdate
            (
                {ownerUuid: request.userId, 'information.uuid': updateVehicleDto.uuid},
                updatedInformation,
                { new: true }
            );

            return await updateVehicle.save();
    }

    async removeVehicle(deleteVehicleDto: DeleteVehicleDto, request: any): Promise<any>
    {
        const verifyUser = await this.vehicleModel.findOne
        ({
            ownerUuid: request.userId,
            'information.uuid': deleteVehicleDto.uuid,
        });

        if(!verifyUser) throw new BadRequestException('User is not authorized');

        const deleteVehicle = await this.vehicleModel.findOneAndUpdate
        (
            { ownerUuid: request.userId },
            { $pull: { information: { uuid: deleteVehicleDto.uuid } }},
            { new: true },
        )

        return await deleteVehicle.save();
    }

    async addAlternateDriver(addAlternateDriverDto: AddAlternateDriverDto, request: any): Promise<any>
    {
        const verifyUser = await this.vehicleModel.findOne
        ({
            ownerUuid: request.userId,
            'information.uuid': addAlternateDriverDto.uuid,
        });

        if(!verifyUser) throw new BadRequestException('User is not authorized');

        const findAlternateUser = await this.userModel.findOne({emailAddress: addAlternateDriverDto.email})
        if(!findAlternateUser) throw new BadRequestException('No User Exist with that Email Address');

        const addDriver = await this.vehicleModel.findOneAndUpdate
        (
            { ownerUuid: request.userId, 'information.uuid': addAlternateDriverDto.uuid },
            { $push: { 'information.0.alternateDrivers': findAlternateUser.uuid } },
            { new: true },
        )

        return await addDriver.save();
    }

    async removeAlternateDriver(removeAlternateDriverDto: RemoveAlternateDriverDto, request: any): Promise<any>
    {
        const verifyUser = await this.vehicleModel.findOne
        ({
            ownerUuid: request.userId,
            'information.uuid': removeAlternateDriverDto.uuid,
        });

        if(!verifyUser) throw new BadRequestException('User is not authorized');

        const removeDriver = await this.vehicleModel.findOneAndUpdate
        (
            { ownerUuid: request.userId, 'information.uuid': removeAlternateDriverDto.uuid },
            { $pull: {'information.0.alternateDrivers': removeAlternateDriverDto.customerUuid } },
            { new: true },
        )

        return await removeDriver.save();
    }
}

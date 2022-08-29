import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CorporateBranchDto } from 'src/common/dtos/corporate-branch.dto';
import { CorporateDto } from 'src/common/dtos/corporate.dto';
import { UserDto } from 'src/common/dtos/user.dto';
import { VehicleDto } from 'src/common/dtos/vehicle.dto';

@Injectable()
export class CustomerService 
{
    constructor
    (
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
        @InjectModel('CorporateBranch') private readonly corporateBranchModel: Model<CorporateBranchDto>,
        @InjectModel('Vehicle') private readonly vehicleModel: Model<VehicleDto>,
    ) {}
}

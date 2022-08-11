import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/auth/dtos/user.dto';
import { UserRoles } from 'src/config/userRoles';
import { v4 as uuid } from 'uuid';
import { CorporateBranchesDto } from './dtos/corporate-branches.dto';
import { CorporateDto } from './dtos/corporate.dto';
import { EditOffDaysDto } from './dtos/edit-off-days.dto';

@Injectable()
export class CorporateService {
    constructor(
        @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
        @InjectModel('CorporateBranches') private readonly corporateBranchesModel: Model<CorporateBranchesDto>,
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        ) {}

        async createNewCorporate(corporateDto: CorporateDto, response: any): Promise<any> {

            const checkSystemAdmin = await this.userModel.findOne({ uuid: response.userId, userType: UserRoles.systemAdmin })
            if(!checkSystemAdmin) throw new BadRequestException('User is not authorized');

            corporateDto.uuid = uuid();
            
            const newCorporate = new this.corporateModel(corporateDto);

            return await newCorporate.save();
        }

        async createNewCorporateBranch(corporateBranchesDto: CorporateBranchesDto, response: any): Promise<any> {

            const checkAdmin = await this.userModel.findOne({ uuid: response.userId, userType: UserRoles.superAdmin, corporateUuid: corporateBranchesDto.corporateUuid });
            if(!checkAdmin) throw new BadRequestException('User is not authorized');

            corporateBranchesDto.uuid = uuid();

            const newBranch = new this.corporateBranchesModel(corporateBranchesDto);

            return await newBranch.save();
        }

        async createNewCorporateSuperUser(userDto: UserDto, response: any): Promise<any> {

            const checkSystemAdmin = await this.userModel.findOne({ uuid: response.userId, userType: UserRoles.systemAdmin })
            if(!checkSystemAdmin) throw new BadRequestException('User is not authorized');

            if(userDto.corporateUuid[0] === "" || null) throw new BadRequestException('Corporate uuid cannot be left empty');

            userDto.uuid = uuid();
            userDto.userType = UserRoles.superAdmin;

            const newUser = new this.userModel(userDto);

            return await newUser.save();
        }

        async createNewCorporateUser(userDto: UserDto, response: any): Promise<any> {

            const checkCorporateAdmin = await this.userModel.findOne({ uuid: response.userId, $or: [{userType: UserRoles.admin}, {userType: UserRoles.superAdmin}] })
            if(!checkCorporateAdmin) throw new BadRequestException('User is not authorized');

            userDto.uuid = uuid();

            switch(userDto.userType) {

                case UserRoles.admin:
                    break;

                case UserRoles.technician:
                    break;

                case UserRoles.sales:
                    break;

                default:
                    throw new BadRequestException('Incorrect User Role');
            }

            const newUser = new this.userModel(userDto);

            return await newUser.save();
        }

        async editOffDays(editOffDaysDto: EditOffDaysDto, response: any): Promise<any> {

            const checkCorporateAdmin = await this.userModel.findOne({ uuid: response.userId, $or: [{userType: UserRoles.admin},{userType: UserRoles.superAdmin}], corporateUuid: editOffDaysDto.corporateUuid });
            if(!checkCorporateAdmin) throw new BadRequestException('User is not authorized');


            // For Checking if the Date exists or not.
            // const checkOffDays = await this.corporateBranchesModel.findOne({ 
            //     uuid: editOffDaysDto.corporateBranchUuid, corporateUuid: editOffDaysDto.corporateUuid, 'workingHours.dayOff': editOffDaysDto.workingHours.dayOff } );
            // if(!checkOffDays) throw new BadRequestException('Off Days already existed');

            const editOffDays = await this.corporateBranchesModel.findOneAndUpdate( 
                { uuid: editOffDaysDto.corporateBranchUuid, corporateUuid: editOffDaysDto.corporateUuid }, 
                { $push: { 'workingHours.dayOff': { $each: editOffDaysDto.workingHours.dayOff } } },
                { new: true } );

            if(!editOffDays) throw new BadRequestException('Corporate Branch Not Found');

            return editOffDays;
        }

        async editStartingWorkingHours(corporateBranchesDto: CorporateBranchesDto, response: any): Promise<any> {

            const checkCorporateAdmin = await this.userModel.findOne({ uuid: response.userId, $or: [{userType: UserRoles.admin},{userType: UserRoles.superAdmin}], corporateUuid: corporateBranchesDto.corporateUuid });
            if(!checkCorporateAdmin) throw new BadRequestException('User is not authorized');

            const editStartingWorkingHours = await this.corporateBranchesModel.findOneAndUpdate( 
                { uuid: corporateBranchesDto.uuid, corporateUuid: corporateBranchesDto.corporateUuid }, 
                { 'workingHours.startWorkingHours': corporateBranchesDto.workingHours.startWorkingHours },
                { new: true } );

            if(!editStartingWorkingHours) throw new BadRequestException('Corporate Branch Not Found');

            return editStartingWorkingHours;
        }

        async editEndWorkingHours(corporateBranchesDto: CorporateBranchesDto, response: any): Promise<any> {

            const checkCorporateAdmin = await this.userModel.findOne({ uuid: response.userId, $or: [{userType: UserRoles.admin},{userType: UserRoles.superAdmin}], corporateUuid: corporateBranchesDto.corporateUuid });
            if(!checkCorporateAdmin) throw new BadRequestException('User is not authorized');

            const editEndWorkingHours = await this.corporateBranchesModel.findOneAndUpdate( 
                { uuid: corporateBranchesDto.uuid, corporateUuid: corporateBranchesDto.corporateUuid }, 
                { 'workingHours.endWorkingHours': corporateBranchesDto.workingHours.endWorkingHours },
                { new: true } );

            if(!editEndWorkingHours) throw new BadRequestException('Corporate Branch Not Found');

            return editEndWorkingHours;
        }
}

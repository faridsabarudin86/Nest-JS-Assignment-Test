import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/auth/dtos/user.dto';
import { UserRoles } from 'src/config/userRoles';
import { v4 as uuid } from 'uuid';
import { CorporateBranchesDto } from './dtos/corporate-branches.dto';
import { CorporateDto } from './dtos/corporate.dto';

@Injectable()
export class CorporateService {
    constructor(
        @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
        @InjectModel('CorporateBranches') private readonly corporateBranchesModel: Model<CorporateBranchesDto>,
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        ) {}

        async createNewCorporate(corporateDto: CorporateDto): Promise<any> {
            
            corporateDto.uuid = uuid();
            
            const newCorporate = new this.corporateModel(corporateDto);

            return await newCorporate.save();
        }

        async createNewCorporateBranch(corporateBranchesDto: CorporateBranchesDto, response: any): Promise<any> {
            
            const checkUser = await this.userModel.findOne({ uuid: response.userId, userType: UserRoles.superAdmin, corporateUuid: response.userCorporateUuid });

            if(!checkUser) throw new BadRequestException('User is not authorized');

            corporateBranchesDto.uuid = uuid();
            corporateBranchesDto.corporateUuid = checkUser.corporateUuid;

            const newBranch = new this.corporateBranchesModel(corporateBranchesDto);

            return await newBranch.save();
        }

        async createNewCorporateSuperUser(userDto: UserDto): Promise<any> {

            if(userDto.corporateUuid === "" || null) throw new BadRequestException('Corporate uuid cannot be left empty');

            userDto.uuid = uuid();
            userDto.userType = UserRoles.superAdmin;

            const newUser = new this.userModel(userDto);

            return await newUser.save();
        }

        async createNewCorporateUser(userDto: UserDto): Promise<any> {

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

        async editOffDays(corporateBranchesDto: CorporateBranchesDto): Promise<any> {

            return null;
        }

        async editStartingWorkingHours(corporateBranchesDto: CorporateBranchesDto): Promise<any> {

            return null;
        }

        async editEndWorkingHours(corporateBranchesDto: CorporateBranchesDto): Promise<any> {

            return null;
        }
}

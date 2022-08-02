import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from 'src/auth/dtos/auth.dto';
import { v4 as uuid } from 'uuid';
import { CorporateBranchesDto } from './dtos/corporate-branches.dto';
import { CorporateDto } from './dtos/corporate.dto';

@Injectable()
export class CorporateService {
    constructor(
        @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
        @InjectModel('CorporateBranches') private readonly corporateBranchesModel: Model<CorporateBranchesDto>,
        @InjectModel('User') private readonly userModel: Model<AuthDto>,
        ) {}


        async createNewCorporate(corporateDto: CorporateDto): Promise<CorporateDto> {
            corporateDto.uuid = uuid();
            
            const newCorporate = new this.corporateModel(corporateDto);

            return await newCorporate.save();
        }

        async createNewCorporateBranch(authDto: AuthDto, corporateBranchesDto: CorporateBranchesDto, response): Promise<CorporateBranchesDto> {
            
            // Check if user is superadmin and of the same corporate
            const checkUser = await this.userModel.findOne({ uuid: authDto.uuid });

            if(!checkUser) throw new BadRequestException();

            const checkCorporate = await this.corporateModel.findOne({ uuid: authDto.corporate_uuid,});

            if(!checkCorporate) throw new BadRequestException();
            
            corporateBranchesDto.uuid = uuid();
            corporateBranchesDto.corporate_uuid = checkCorporate.uuid;

            const newBranch = new this.corporateBranchesModel(corporateBranchesDto);

            return await newBranch.save();
        }

        async createNewCorporateSuperUser(authDto: AuthDto): Promise<AuthDto> {
            authDto.uuid = uuid();
            authDto.userType = 'Super Admin';

            const newUser = new this.userModel(authDto);

            return await newUser.save();
        }

        async createNewCorporateUser(authDto: AuthDto): Promise<AuthDto> {
            authDto.uuid = uuid();

            const newUser = new this.userModel(authDto);

            return await newUser.save();
        }

}

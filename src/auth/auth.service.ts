import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dtos/user.dto';
import { SignInCustomerDto } from './dtos/signInCustomer.dto';
import { SignInCorporateDto } from './dtos/signInCorporate.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<UserDto>) {}

    async signInCustomer(signInCustomerDto: SignInCustomerDto) {

        const findUser = await this.userModel.findOne({emailAddress: signInCustomerDto.emailAddress});
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        if (findUser.password !== signInCustomerDto.password) throw new UnauthorizedException('Credentials did not match');

        return this.userSignedInCustomer(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName);
    }

    async signInCorporate(signInCorporateDto: SignInCorporateDto) {

        const findUser = await this.userModel.findOne({emailAddress: signInCorporateDto.emailAddress, corporateUuid: signInCorporateDto.corporateUuid});
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        if (findUser.password !== signInCorporateDto.password) throw new UnauthorizedException('Credentials did not match');

        return this.userSignedInCorporate(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName, findUser.corporateUuid, findUser.corporateBranchUuid);
    }

    userSignedInCustomer(userId: string, emailAddress: string, userType: string, fullName: string) {
        
        return this.jwtService.sign({
            userId: userId,
            userType: userType,
            userEmail: emailAddress,
            userFullName: fullName,
        })
    }

    userSignedInCorporate(userId: string, emailAddress: string, userType: string, fullName: string, corporateUuid: string, corporateBranchUuid: string) {
        
        return this.jwtService.sign({
            userId: userId,
            userType: userType,
            userEmail: emailAddress,
            userFullName: fullName,
            userCorporateUuid: corporateUuid,
            userCorporateBranchUuid: corporateBranchUuid,
        })
    }
}

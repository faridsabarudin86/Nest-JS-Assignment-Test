import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dtos/user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UserRoles } from 'src/config/userRoles';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<UserDto>) {}

    async signInCustomer(signInDto: SignInDto): Promise<any> {

        const findUser = await this.userModel.findOne({emailAddress: signInDto.emailAddress, userType: UserRoles.customer});
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        if (findUser.password !== signInDto.password) throw new UnauthorizedException('Credentials did not match');

        return this.userSignedIn(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName);
    }

    async signInCorporate(signInDto: SignInDto): Promise<any> {

        const findUser = await this.userModel.findOne({emailAddress: signInDto.emailAddress, corporateUuid: { $ne: null }});
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        if (findUser.password !== signInDto.password) throw new UnauthorizedException('Credentials did not match');

        return this.userSignedIn(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName);
    }

    async signInSystemAdmin(signInDto: SignInDto): Promise<any> {

        const findUser = await this.userModel.findOne({emailAddress: signInDto.emailAddress, userType: UserRoles.systemAdmin});
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        if (findUser.password !== signInDto.password) throw new UnauthorizedException('Credentials did not match');

        return this.userSignedIn(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName);
    }

    userSignedIn(userId: string, emailAddress: string, userType: string, fullName: string) {
        
        return this.jwtService.sign({
            userId: userId,
            userType: userType,
            userEmail: emailAddress,
            userFullName: fullName,
        })
    }
}

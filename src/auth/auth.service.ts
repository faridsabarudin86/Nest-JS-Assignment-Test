import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<AuthDto>) {}

    async signInCustomer(authDto: AuthDto) {

        // Retrieve User
        const findUser = await this.userModel.findOne({emailAddress: authDto.emailAddress});

        // Check if user exists, if not throw exception
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        // Check if user's password matches, if not throw error
        if (findUser.password !== authDto.password) throw new UnauthorizedException('Credentials did not match');

        // called in userSignedIn() function with the parameters needed for the Server to create a JWT token to 
        // indicate that the user has been signed and authemthicated
        return this.userSignedInCustomer(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName);
    }

    async signInCorporate(authDto: AuthDto) {
        // Retrieve User
        const findUser = await this.userModel.findOne({emailAddress: authDto.emailAddress});

        // Check if user exists, if not throw exception
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        // Check if their corporate matches
        const checkCorporate = await this.userModel.findOne({ corporate_uuid: authDto.corporate_uuid });
        if (!checkCorporate) throw new UnauthorizedException('User does not exists.');

        // Check if their corporate branch matches
        const checkBranch = await this.userModel.findOne({ corporateBranch_uuid: authDto.corporateBranch_uuid });
        if (!checkCorporate) throw new UnauthorizedException('User does not exists.');

        // Check if user's password matches, if not throw error
        if (findUser.password !== authDto.password) throw new UnauthorizedException('Credentials did not match');

        // called in userSignedIn() function with the parameters needed for the Server to create a JWT token to 
        // indicate that the user has been signed and authemthicated
        return this.userSignedInCorporate(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName, findUser.corporate_uuid, findUser.corporateBranch_uuid);
    }

    userSignedInCustomer(userId: string, emailAddress: string, userType: string, fullName: string) {
        
        // Returns a JWT (User is now signed by the servers)
        return this.jwtService.sign({
            userId: userId,
            userType: userType,
            userEmail: emailAddress,
            userFullName: fullName,
        })
    }

    userSignedInCorporate(userId: string, emailAddress: string, userType: string, fullName: string, corporate_uuid: string, corporateBranch_uuid: string) {
        
        // Returns a JWT (User is now signed by the servers)
        return this.jwtService.sign({
            userId: userId,
            userType: userType,
            userEmail: emailAddress,
            userFullName: fullName,
            userCorporate_uuid: corporate_uuid,
            userCorporateBranch_uuid: corporateBranch_uuid,
        })
    }
}

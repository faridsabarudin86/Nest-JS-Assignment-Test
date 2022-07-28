import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dtos/auth.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, @InjectModel('User') private readonly userModel: Model<AuthDto>) {}

    async signInLocal(authDto: AuthDto) {

        // Retrieve User
        const findUser = await this.userModel.findOne({emailAddress: authDto.emailAddress});

        // Check if user exists, if not throw exception
        if (!findUser) throw new UnauthorizedException('User does not exists.');

        // Check if user's password matches, if not throw error
        if (findUser.password !== authDto.password) throw new UnauthorizedException('Credentials did not match');

        // Return userSignedIn() function with the parameters needed for the Server to create a JWT token to 
        // indicate that the user has been signed and authemthicated
        return this.userSignedIn(findUser.uuid, findUser.emailAddress, findUser.userType, findUser.fullName);
    }

    userSignedIn(userId: string, emailAddress: string, userType: string, fullName: string) {
        
        // Returns a JWT (User is now signed by the servers)
        return this.jwtService.sign({
            userId: userId,
            userType: userType,
            userEmail: emailAddress,
            userFullName: fullName,
        })
    }

    async registerNewUser(authDto: AuthDto): Promise<AuthDto> {
        authDto.uuid = uuid();
        const newUser = new this.userModel(authDto);
        return await newUser.save();
    }
}

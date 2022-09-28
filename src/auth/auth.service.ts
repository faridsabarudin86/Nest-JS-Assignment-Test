import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../common/dtos/user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UserRoles } from 'src/common/config/userRoles';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<UserDto>,
  ) {}

  async signInCustomer(body: SignInDto): Promise<any> {
    const findUser = await this.userModel.findOne({
      emailAddress: body.emailAddress,
      role: UserRoles.customer,
    });

    if (!findUser) throw new UnauthorizedException('User does not exists.');

    const isPasswordMatch = await bcrypt.compare(
      body.password,
      findUser.password,
    );

    if (isPasswordMatch === false)
      throw new UnauthorizedException('Credentials did not match');

    return this.userSignedIn(
      findUser.uuid,
      findUser.emailAddress,
      findUser.role,
    );
  }

  async signInCorporate(body: SignInDto): Promise<any> {
    const findUser = await this.userModel.findOne({
      emailAddress: body.emailAddress,
      $or: [{ role: UserRoles.corporate }, { role: UserRoles.superAdmin }],
    });

    if (!findUser) throw new UnauthorizedException('User does not exists.');

    const isPasswordMatch = await bcrypt.compare(
      body.password,
      findUser.password,
    );

    if (isPasswordMatch === false)
      throw new UnauthorizedException('Credentials did not match');

    return this.userSignedIn(
      findUser.uuid,
      findUser.emailAddress,
      findUser.role,
    );
  }

  userSignedIn(userId: string, emailAddress: string, userRole: string) {
    return this.jwtService.sign({
      userId: userId,
      userEmailAddress: emailAddress,
      userRole: userRole,
    });
  }
}

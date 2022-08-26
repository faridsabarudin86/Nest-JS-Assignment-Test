import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import config from 'src/common/config/defaults';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { UserSchema } from 'src/common/schemas/user.schema';

@Module
({
  imports: 
  [
    MongooseModule.forFeature
    ([
      {name: 'User', schema: UserSchema}
    ]),
    
    JwtModule.register
    ({
      secret: config.jwtSecretKey,
    }),

    JwtStrategy,
    JwtService,
],

controllers: [AuthController],
providers: [AuthService],
exports: [AuthService],
})

export class AuthModule {}

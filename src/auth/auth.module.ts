import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schemas/user.schema';
import config from 'src/config/defaults';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'User', schema: UserSchema}
  ]),

  JwtModule.register({
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

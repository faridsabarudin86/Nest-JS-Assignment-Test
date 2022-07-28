import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSchema } from './schemas/auth.schema';
import config from 'src/config/defaults';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'User', schema: AuthSchema}
  ]),

  JwtModule.register({
    secret: config.jwtSecretKey,
  })
],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

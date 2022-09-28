import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CorporateModule } from './corporate/corporate.module';
import config from 'src/common/config/defaults';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CustomerModule } from './customer/customer.module';
import { BookingModule } from './booking/booking.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SuperuserController } from './superuser/superuser.controller';
import { SuperuserModule } from './superuser/superuser.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(config.mongoURI),
    AuthModule,
    CorporateModule,
    CustomerModule,
    BookingModule,
    SuperuserModule,
  ],
  controllers: [AppController, SuperuserController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

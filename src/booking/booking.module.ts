import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { CorporateBranchesSchema } from 'src/corporate/schemas/corporate-branches.schema';
import { CorporateSchema } from 'src/corporate/schemas/corporate.schema';
import { CustomerVehicleSchema } from 'src/customer/schemas/customer-vehicle.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ServiceBookingScheduleSchema } from './schemas/service-booking-schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Corporate', schema: CorporateSchema}]),
    MongooseModule.forFeature([{name: 'CorporateBranches', schema: CorporateBranchesSchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'CustomerVehicle', schema: CustomerVehicleSchema}]),
    MongooseModule.forFeature([{name: 'ServiceBookingSchedule', schema: ServiceBookingScheduleSchema}]),
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}

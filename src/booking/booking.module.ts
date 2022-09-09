import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CorporateBranchSchema } from 'src/common/schemas/corporate-branch.schema';
import { CorporateSchema } from 'src/common/schemas/corporate.schema';
import { ServiceBookingSchema } from 'src/common/schemas/service-booking.schema';
import { UserSchema } from 'src/common/schemas/user.schema';
import { VehicleSchema } from 'src/common/schemas/vehicle.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module
({
    imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'Vehicle', schema: VehicleSchema}]),
    MongooseModule.forFeature([{name: 'Corporate', schema: CorporateSchema}]),
    MongooseModule.forFeature([{name: 'CorporateBranch', schema: CorporateBranchSchema}]),
    MongooseModule.forFeature([{name: 'ServiceBooking', schema: ServiceBookingSchema}]),
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule 
{}

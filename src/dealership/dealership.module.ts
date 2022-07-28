import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthSchema } from 'src/auth/schemas/auth.schema';
import { DealershipController } from './dealership.controller';
import { DealershipService } from './dealership.service';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'User', schema: AuthSchema}
  ]), AuthModule],
  controllers: [DealershipController],
  providers: [DealershipService],
  exports: [DealershipService],
})
export class DealershipModule {}

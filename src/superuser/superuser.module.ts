import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CorporateBranchSchema } from 'src/common/schemas/corporate-branch.schema';
import { CorporateSchema } from 'src/common/schemas/corporate.schema';
import { UserSchema } from 'src/common/schemas/user.schema';
import { SuperuserController } from './superuser.controller';
import { SuperuserService } from './superuser.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Corporate', schema: CorporateSchema }]),
    MongooseModule.forFeature([
      { name: 'CorporateBranch', schema: CorporateBranchSchema },
    ]),
    AuthModule,
  ],
  providers: [SuperuserService],
  controllers: [SuperuserController],
  exports: [SuperuserService],
})
export class SuperuserModule {}

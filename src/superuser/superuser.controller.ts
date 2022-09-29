import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRoles } from 'src/common/config/userRoles';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CorporateService } from 'src/corporate/corporate.service';
import { AddCorporateDto } from 'src/corporate/dtos/addCorporate.dto';
import { AddCorporateAdminDto } from 'src/corporate/dtos/addCorporateAdmin.dto';

@Controller('superuser')
export class SuperuserController {
  constructor(private corporateService: CorporateService) {}

  @Roles(UserRoles.superAdmin)
  @UseGuards(JwtAuthGuard)
  @Get('corporate')
  async getAllCorporate(@Request() request: any): Promise<any> {
    return this.corporateService.getAllCorporate(request.user);
  }

  @Roles(UserRoles.superAdmin)
  @UseGuards(JwtAuthGuard)
  @Get('corporate/:corporateId')
  async getCorporateInfo(
    @Param('corporateId') paramCorporateId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getCorporateInfo(
      paramCorporateId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin)
  @UseGuards(JwtAuthGuard)
  @Post('corporate/:corporateId/admin')
  async addCorporateAdmin(
    @Body() body: AddCorporateAdminDto,
    @Param('corporateId') paramCorporateId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addCorporateAdmin(
      paramCorporateId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin)
  @UseGuards(JwtAuthGuard)
  @Post('corporate')
  async addCorporate(
    @Body() body: AddCorporateDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addCorporate(body, request.user);
  }
}

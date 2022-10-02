import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  Get,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { CorporateService } from './corporate.service';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetAllEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';
import { UpdateEmployeeInfoDto } from './dtos/updateEmployeeInfo.dto';
import { UpdateSelfAccountDto } from './dtos/updateSelfAccount.dto';
import { UpdateCorporateDto } from './dtos/updateCorporate.dto';
import { DeleteEmployeeDto } from './dtos/deleteEmployee.dto';
import { UpdateCorporateBranchDto } from './dtos/updateCorporateBranch.dto';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { BookingService } from 'src/booking/booking.service';
import { AssignTechnicianToDailyScheduleDto } from 'src/booking/dtos/assignedTechnicianToDailySchedule.dto';
import { SetDailyScheduleDto } from 'src/booking/dtos/setDailySchedule.dto';

@Controller('corporate')
export class CorporateController {
  constructor(
    private corporateService: CorporateService,
    private authService: AuthService,
    private bookingService: BookingService,
  ) {}

  @Public()
  @Post('signin')
  async signInCorporate(@Body() body: SignInDto): Promise<any> {
    return this.authService.signInCorporate(body);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/employee')
  async getBranchEmployees(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getBranchEmployees(
      paramCorporateId,
      paramBranchId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/employee/:employeeId')
  async getEmployeeInfo(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Param('employeeId') paramEmployeeId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getEmployeeInfo(
      paramCorporateId,
      paramBranchId,
      paramEmployeeId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Post(':corporateId/:branchId/employee')
  async addEmployee(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Body() body: AddEmployeeDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addEmployee(
      paramCorporateId,
      paramBranchId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/:branchId/employee/:employeeId')
  async updateEmployeeInfo(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Param('employeeId') paramEmployeeId: string,
    @Body() body: UpdateEmployeeInfoDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateEmployeeInfo(
      paramCorporateId,
      paramBranchId,
      paramEmployeeId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get('account')
  async getSelfAccount(@Request() request: any): Promise<any> {
    return this.corporateService.getSelfAccount(request.user);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put('account')
  async updateSelfAccount(
    @Body() body: UpdateSelfAccountDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateSelfAccount(body, request.user);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/corporateinfo')
  async getCorporateInfo(
    @Param('corporateId') paramCorporateId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getCorporateInfo(
      paramCorporateId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/corporateinfo')
  async updateCorporate(
    @Param('corporateId') paramCorporateId: string,
    @Body() body: UpdateCorporateDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateCorporate(
      paramCorporateId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/branches')
  async getAllBranches(
    @Param('corporateId') paramCorporateId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getAllBranches(paramCorporateId, request.user);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Post(':corporateId/branches')
  async addBranch(
    @Param('corporateId') paramCorporateId: string,
    @Body() body: AddBranchDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addBranch(
      paramCorporateId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/branches/:branchId')
  async getCorporateBranchInfo(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getCorporateBranchInfo(
      paramCorporateId,
      paramBranchId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/:branchId/branches/:branchId')
  async updateCorporateBranch(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Body() body: UpdateCorporateBranchDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateCorporateBranch(
      paramCorporateId,
      paramBranchId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/schedule')
  async getDailyBookingCorporateBranch(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Query('day') day: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.getDailyBookingCorporateBranch(
      paramCorporateId,
      paramBranchId,
      day,
      month,
      year,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Post(':corporateId/:branchId/schedule')
  async setDailySchedule(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Body() body: SetDailyScheduleDto,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.setDailySchedule(
      paramCorporateId,
      paramBranchId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/:branchId/schedule/:scheduleId')
  async assignTechnicianToDailySchedule(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Param('scheduleId') paramScheduleId: string,
    @Body() body: AssignTechnicianToDailyScheduleDto,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.assignTechnicianToDailySchedule(
      paramCorporateId,
      paramBranchId,
      paramScheduleId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/:branchId/schedule/:scheduleSlotsId/inProgress')
  async updateBookingToInProgress(
    @Param('scheduleSlotsId') paramScheduleSlotsId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.updateBookingToInProgress(
      paramScheduleSlotsId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/:branchId/schedule/:scheduleSlotsId/completed')
  async updateBookingToCompleted(
    @Param('scheduleSlotsId') paramScheduleSlotsId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.bookingService.updateBookingToCompleted(
      paramScheduleSlotsId,
      request.user,
    );
  }
}

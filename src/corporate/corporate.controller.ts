import { Body, Controller, Post, UseGuards, Request, Put, Get, Delete } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { CorporateService } from './corporate.service';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetAllEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';
import { GetEmployeeDto } from './dtos/getEmployee.dto';
import { UpdateEmployeeDto } from './dtos/updateEmployee.dto';
import { UpdateSelfAccountDto } from './dtos/updateSelfAccount.dto';
import { UpdateCorporateDto } from './dtos/updateCorporate.dto';
import { DeleteEmployeeDto } from './dtos/deleteEmployee.dto';
import { UpdateCorporateBranchDto } from './dtos/updateCorporateBranch.dto';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';

@Controller('corporate')
export class CorporateController {
    constructor(
        private corporateService: CorporateService,
        private authService: AuthService,
    ) {}

    @Public()
    @Post('signincorporate')
    async signInCorporate(@Body() body: SignInDto): Promise<any> 
    {
        return this.authService.signInCorporate(body);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Get('getallemployees')
    async getAllEmployees(@Body() body: GetAllEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.getAllEmployees(body, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Get('getemployee')
    async getEmployee(@Body() body: GetEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.getEmployee(body, request.user);
    }
    
    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('addemployee')
    async addEmployee(@Body() body: AddEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addEmployee(body, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updateemployee')
    async updateEmployee(@Body() body: UpdateEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.updateEmployee(body, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updateselfaccount')
    async updateSelfAccount(@Body() body: UpdateSelfAccountDto, @Request() request: any): Promise <any>
    {
        return this.corporateService.updateSelfAccount(body, request.user);
    }

    // @Roles(UserRoles.superAdmin, UserRoles.corporate)
    // @UseGuards(JwtAuthGuard)
    // @Delete('deleteemployee')
    // async deleteEmployee(@Body() deleteEmployeeDto: DeleteEmployeeDto, @Request() request: any): Promise<any>
    // {
    //     return this.corporateService.deleteEmployee(deleteEmployeeDto, request.user);
    // }

    @Roles(UserRoles.superAdmin)
    @UseGuards(JwtAuthGuard)
    @Post('addcorporateadmin')
    async addCorporateAdmin(@Body() body: AddCorporateAdminDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addCorporateAdmin(body, request.user);
    }

    @Roles(UserRoles.superAdmin)
    @UseGuards(JwtAuthGuard)
    @Post('addcorporate')
    async addCorporate(@Body() body: AddCorporateDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addCorporate(body, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updatecorporate')
    async updateCorporate(@Body() body: UpdateCorporateDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.updateCorporate(body, request.user)
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updatecorporatebranch')
    async updateCorporateBranch(@Body() body: UpdateCorporateBranchDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.updateCorporateBranch(body, request.user)
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('addbranch')
    async addBranch(@Body() body: AddBranchDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addBranch(body, request.user);
    }
}

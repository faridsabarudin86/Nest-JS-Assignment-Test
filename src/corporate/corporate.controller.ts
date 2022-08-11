import { Body, Controller, Post, UseGuards, Request, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/auth/dtos/user.dto';
import { CorporateService } from './corporate.service';
import { CorporateBranchesDto } from './dtos/corporate-branches.dto';
import { CorporateDto } from './dtos/corporate.dto';
import { EditOffDaysDto } from './dtos/edit-off-days.dto';

@Controller('corporate')
export class CorporateController {
    constructor(private corporateService: CorporateService,) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('createnewcorporate')
    async createNewCorporate(@Body() corporateDto: CorporateDto, @Request() request: any): Promise<any> {

        return this.corporateService.createNewCorporate(corporateDto, request.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createnewcorporatebranch')
    async createNewCorporateBranch(@Body() corporateBranchesDto: CorporateBranchesDto, @Request() request: any): Promise<any> {

        return this.corporateService.createNewCorporateBranch(corporateBranchesDto, request.user);
    }

    @Post('createnewcorporatesuperuser')
    async createNewCorporateSuperUser(@Body() userDto: UserDto, @Request() request: any): Promise<any> {

        return this.corporateService.createNewCorporateSuperUser(userDto, request.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createnewcorporateuser')
    async createNewCorporateUser(@Body() userDto: UserDto, @Request() request: any): Promise<any> {

        return this.corporateService.createNewCorporateUser(userDto, request.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('editoffdays')
    async editOffDays(@Body() editOffDaysDto: EditOffDaysDto, @Request() request: any): Promise<any> {

        return this.corporateService.editOffDays(editOffDaysDto, request.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('editstartingworkinghours')
    async editStartingWorkingHours(@Body() corporateBranchesDto: CorporateBranchesDto, @Request() request: any): Promise<any> {

        return this.corporateService.editStartingWorkingHours(corporateBranchesDto, request.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('editendworkinghours')
    async editEndWorkingHours(@Body() corporateBranchesDto: CorporateBranchesDto, @Request() request: any): Promise<any> {

        return this.corporateService.editEndWorkingHours(corporateBranchesDto, request.user);
    }
}

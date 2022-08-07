import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/auth/dtos/user.dto';
import { UserRoles } from 'src/config/userRoles';
import { CorporateService } from './corporate.service';
import { CorporateBranchesDto } from './dtos/corporate-branches.dto';
import { CorporateDto } from './dtos/corporate.dto';

@Controller('corporate')
export class CorporateController {
    constructor(private corporateService: CorporateService,) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('createnewcorporate')
    async createNewCorporate(@Body() corporateDto: CorporateDto): Promise<any> {

        return this.corporateService.createNewCorporate(corporateDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createnewcorporatebranch')
    async createNewCorporateBranch(@Body() corporateBranchesDto: CorporateBranchesDto, @Request() request: any): Promise<any> {

        return this.corporateService.createNewCorporateBranch(corporateBranchesDto, request.user);
    }

    @Post('createnewcorporatesuperuser')
    async createNewCorporateSuperUser(@Body() userDto: UserDto): Promise<any> {

        return this.corporateService.createNewCorporateSuperUser(userDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('createnewcorporateuser')
    async createNewCorporateUser(@Body() userDto: UserDto): Promise<any> {

        return this.corporateService.createNewCorporateUser(userDto);
    }
}

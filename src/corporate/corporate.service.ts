import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/common/dtos/user.dto';
import { UserRoles } from 'src/common/config/userRoles';
import { v4 as uuid } from 'uuid';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetAllEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { CorporateDto } from 'src/common/dtos/corporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';
import { CorporateBranchDto } from 'src/common/dtos/corporate-branch.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';
import { GetEmployeeDto } from './dtos/getEmployee.dto';
import { UpdateEmployeeDto } from './dtos/updateEmployee.dto';
import { UpdateSelfAccountDto } from './dtos/updateSelfAccount.dto';
import { UpdateCorporateDto } from './dtos/updateCorporate.dto';
import { DeleteEmployeeDto } from './dtos/deleteEmployee.dto';
import { UpdateCorporateBranchDto } from './dtos/updateCorporateBranch.dto';
import { GetBranchesDto } from './dtos/getBranches.dto';

@Injectable()
export class CorporateService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDto>,
    @InjectModel('Corporate')
    private readonly corporateModel: Model<CorporateDto>,
    @InjectModel('CorporateBranch')
    private readonly corporateBranchModel: Model<CorporateBranchDto>,
  ) {}

  async getAllBranches(body: GetBranchesDto): Promise<any> {
    const getBranches = await this.corporateBranchModel.find({
      corporateUuid: body.corporateUuid,
    });

    if (!getBranches) throw new BadRequestException('User is not authorized');

    return getBranches;
  }

  async getAllEmployees(body: GetAllEmployeeDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const getEmployees = await this.userModel.find({
      'corporate.uuid': body.corporateUuid,
      'corporate.branch.uuid': body.branchUuid,
    });

    return getEmployees;
  }

  async getEmployee(body: GetEmployeeDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const getEmployees = await this.userModel.find({
      uuid: body.uuid,
      'corporate.uuid': body.corporateUuid,
      'corporate.branch.uuid': body.branchUuid,
    });

    return getEmployees;
  }

  async addEmployee(body: AddEmployeeDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const hash = await bcrypt.hash(body.password, 10);

    body.uuid = uuid();
    body.password = hash;
    body.role = UserRoles.corporate;

    for (let i = 0; i < body.corporate.length; i++) {
      body.corporate[i].uuid = body.corporateUuid;
      body.corporate[i].role = UserRoles.employee;
      body.corporate[i].branch[i].uuid = body.branchUuid;
    }

    const newEmployee = new this.userModel(body);
    return await newEmployee.save();
  }

  async updateEmployee(body: UpdateEmployeeDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    if (body.password !== null || '') {
      const hash = await bcrypt.hash(body.password, 10);
      body.password = hash;
    }

    const updatedInformation = {
      emailAddress: body.emailAddress,
      password: body.password,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
    };

    Object.keys(updatedInformation).forEach((key) => {
      if (updatedInformation[key] === null || updatedInformation[key] === '') {
        delete updatedInformation[key];
      }
    });

    const updateUser = await this.userModel.findOneAndUpdate(
      {
        uuid: body.uuid,
        'corporate.uuid': body.corporateUuid,
        'corporate.branch.uuid': body.branchUuid,
      },
      updatedInformation,
      { new: true },
    );

    return await updateUser.save();
  }

  async updateSelfAccount(
    body: UpdateSelfAccountDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    if (body.password !== null || '') {
      const hash = await bcrypt.hash(body.password, 10);
      body.password = hash;
    }

    const updatedInformation = {
      emailAddress: body.emailAddress,
      password: body.password,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
    };

    Object.keys(updatedInformation).forEach((key) => {
      if (updatedInformation[key] === null || updatedInformation[key] === '') {
        delete updatedInformation[key];
      }
    });

    const updateUser = await this.userModel.findOneAndUpdate(
      { uuid: request.userId },
      updatedInformation,
      { new: true },
    );

    return await updateUser.save();
  }

  async addCorporateAdmin(
    body: AddCorporateAdminDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      role: UserRoles.superAdmin,
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const hash = await bcrypt.hash(body.password, 10);

    body.uuid = uuid();
    body.password = hash;
    body.role = UserRoles.corporate;

    for (let i = 0; i < body.corporate.length; i++) {
      body.corporate[i].role = UserRoles.corporateAdmin;
    }

    const newCorporateAdmin = new this.userModel(body);
    return await newCorporateAdmin.save();
  }

  async addCorporate(body: AddCorporateDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      role: UserRoles.superAdmin,
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    body.uuid = uuid();

    const newCorporate = new this.corporateModel(body);
    return await newCorporate.save();
  }

  async updateCorporate(body: UpdateCorporateDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.uuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const updatedInformation = {
      emailAddress: body.emailAddress,
      headquartersAddress: body.headquartersAddress,
      name: body.name,
      country: body.country,
    };

    Object.keys(updatedInformation).forEach((key) => {
      if (updatedInformation[key] === null || updatedInformation[key] === '') {
        delete updatedInformation[key];
      }
    });

    const updateCorporate = await this.corporateModel.findOneAndUpdate(
      { uuid: body.uuid },
      updatedInformation,
      { new: true },
    );

    return await updateCorporate.save();
  }

  async updateCorporateBranch(
    body: UpdateCorporateBranchDto,
    request: any,
  ): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    let startWorkingHours = new Date();
    startWorkingHours.setUTCHours(
      body.startWorkingHours_Hours,
      body.startWorkingHours_Minutes,
    );

    let endWorkingHours = new Date();
    endWorkingHours.setUTCHours(
      body.endWorkingHours_Hours,
      body.endWorkingHours_Minutes,
    );

    body.startWorkingHours = startWorkingHours;
    body.endWorkingHours = endWorkingHours;

    const updatedInformation = {
      emailAddress: body.emailAddress,
      branchAddress: body.branchAddress,
      name: body.name,
      offDays: body.offDays,
      startWorkingHours: body.startWorkingHours,
      endWorkingHours: body.endWorkingHours,
      startWorkingHours_Hours: body.startWorkingHours_Hours,
      startWorkingHours_Minutes: body.startWorkingHours_Minutes,
      endWorkingHours_Hours: body.endWorkingHours_Hours,
      endWorkingHours_Minutes: body.endWorkingHours_Minutes,
    };

    const objKeys = Object.keys(updatedInformation);
    objKeys.forEach((key) => {
      if (
        updatedInformation.startWorkingHours_Hours === null ||
        updatedInformation.startWorkingHours_Minutes === null ||
        updatedInformation.endWorkingHours_Hours === null ||
        updatedInformation.endWorkingHours_Minutes === null
      ) {
        delete updatedInformation.startWorkingHours;
        delete updatedInformation.endWorkingHours;
      }

      if (
        updatedInformation.startWorkingHours === undefined &&
        updatedInformation.endWorkingHours === undefined &&
        (updatedInformation[key] === null || updatedInformation[key] === '')
      ) {
        delete updatedInformation[key];
      }
    });

    const updateCorporateBranch =
      await this.corporateBranchModel.findOneAndUpdate(
        { uuid: body.branchUuid, corporateUuid: body.corporateUuid },
        updatedInformation,
        { new: true },
      );

    return await updateCorporateBranch.save();
  }

  async addBranch(body: AddBranchDto, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': body.corporateUuid,
          'corporate.branch.uuid': body.branchUuid,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
        {
          role: UserRoles.superAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    body.uuid = uuid();

    const newCorporateBranch = new this.corporateBranchModel(body);
    return await newCorporateBranch.save();
  }
}

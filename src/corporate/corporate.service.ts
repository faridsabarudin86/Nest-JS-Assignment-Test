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
import { UpdateEmployeeInfoDto } from './dtos/updateEmployeeInfo.dto';
import { UpdateSelfAccountDto } from './dtos/updateSelfAccount.dto';
import { UpdateCorporateDto } from './dtos/updateCorporate.dto';
import { DeleteEmployeeDto } from './dtos/deleteEmployee.dto';
import { UpdateCorporateBranchDto } from './dtos/updateCorporateBranch.dto';

@Injectable()
export class CorporateService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDto>,
    @InjectModel('Corporate')
    private readonly corporateModel: Model<CorporateDto>,
    @InjectModel('CorporateBranch')
    private readonly corporateBranchModel: Model<CorporateBranchDto>,
  ) {}

  async getBranchEmployees(
    paramCorporateId: string,
    paramBranchId: string,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const getEmployees = await this.userModel.find({
      'corporate.uuid': paramCorporateId,
      'corporate.branch.uuid': paramBranchId,
    });

    return getEmployees;
  }

  async getEmployeeInfo(
    paramCorporateId: string,
    paramBranchId: string,
    paramEmployeeId: string,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const getEmployees = await this.userModel.findOne({
      uuid: paramEmployeeId,
      'corporate.uuid': paramCorporateId,
    });

    return getEmployees;
  }

  async addEmployee(
    paramCorporateId: string,
    paramBranchId: string,
    body: AddEmployeeDto,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
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
      body.corporate[i].uuid = paramCorporateId;
      body.corporate[i].role = UserRoles.employee;
      body.corporate[i].branch[i].uuid = paramBranchId;
    }

    const newEmployee = new this.userModel(body);
    return await newEmployee.save();
  }

  async updateEmployeeInfo(
    paramCorporateId: string,
    paramBranchId: string,
    paramEmployeeId: string,
    body: UpdateEmployeeInfoDto,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
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
        uuid: paramEmployeeId,
        'corporate.uuid': paramCorporateId,
      },
      updatedInformation,
      { new: true },
    );

    return await updateUser.save();
  }

  async getSelfAccount(request: any): Promise<any> {
    const getUser = await this.userModel.findOne({
      uuid: request.userId,
    });

    return await getUser;
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

  async getCorporateInfo(paramCorporateId: string, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const findCorporate = await this.corporateModel.findOne({
      uuid: paramCorporateId,
    });

    return findCorporate;
  }

  async updateCorporate(
    paramCorporateId: string,
    body: UpdateCorporateDto,
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
          'corporate.uuid': paramCorporateId,
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
      { uuid: paramCorporateId },
      updatedInformation,
      { new: true },
    );

    return await updateCorporate.save();
  }

  async getAllBranches(paramCorporateId: string, request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      $or: [
        {
          role: UserRoles.superAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const getBranches = await this.corporateBranchModel.find({
      corporateUuid: paramCorporateId,
    });

    if (!getBranches) throw new BadRequestException('User is not authorized');

    return getBranches;
  }

  async addBranch(
    paramCorporateId: string,
    body: AddBranchDto,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    body.uuid = uuid();
    body.branchUuid = uuid();

    const newCorporateBranch = new this.corporateBranchModel(body);
    return await newCorporateBranch.save();
  }

  async getCorporateBranchInfo(
    paramCorporateId: string,
    paramBranchId: string,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
          'corporate.branch.role': UserRoles.branchAdmin,
        },
      ],
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const getBranches = await this.corporateBranchModel.findOne({
      corporateUuid: paramCorporateId,
      uuid: paramBranchId,
    });

    if (!getBranches) throw new BadRequestException('User is not authorized');

    return getBranches;
  }

  async updateCorporateBranch(
    paramCorporateId: string,
    paramBranchId: string,
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
          'corporate.uuid': paramCorporateId,
          'corporate.role': UserRoles.corporateAdmin,
        },
        {
          role: UserRoles.corporate,
          'corporate.uuid': paramCorporateId,
          'corporate.branch.uuid': paramBranchId,
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
        { uuid: paramBranchId, corporateUuid: paramCorporateId },
        updatedInformation,
        { new: true },
      );

    return await updateCorporateBranch.save();
  }

  // Being used in the Super User Module
  async getAllCorporate(request: any): Promise<any> {
    const verifyUser = await this.userModel.findOne({
      uuid: request.userId,
      role: UserRoles.superAdmin,
    });

    if (!verifyUser) throw new BadRequestException('User is not authorized');

    const getAllCorporate = await this.corporateModel.find({});

    return getAllCorporate;
  }

  // Being used in the Super User Module
  async addCorporateAdmin(
    paramCorporateId: string,
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
      body.corporate[i].uuid = paramCorporateId;
      body.corporate[i].role = UserRoles.corporateAdmin;
    }

    const newCorporateAdmin = new this.userModel(body);
    return await newCorporateAdmin.save();
  }

  // Being used in the Super User Module
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
}

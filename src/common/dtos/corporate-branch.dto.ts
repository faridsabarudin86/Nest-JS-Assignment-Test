import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CorporateBranchDto
{
    uuid?: string;
    corporateUuid?: string;
    name?: string;
    emailAddress?: string;
    branchAddress?: string;
    startWorkingHours?: string;
    endWorkingHours?: string;
    offDays?: [string];
}
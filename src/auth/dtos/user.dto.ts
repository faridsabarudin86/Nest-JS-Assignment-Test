export class UserDto {
    uuid?: string;
    emailAddress: string;
    password: string;
    fullName: string;
    userType: string;
    corporateUuid: string[];
    corporateBranchUuid: string[];
}
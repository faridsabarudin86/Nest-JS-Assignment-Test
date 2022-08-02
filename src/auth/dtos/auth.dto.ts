export class AuthDto {
    uuid?: string;
    emailAddress: string;
    password: string;
    fullName?: string;
    userType?: string;
    corporate_uuid: string;
    corporateBranch_uuid: string;
}
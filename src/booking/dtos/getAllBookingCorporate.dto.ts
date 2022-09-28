import { IsDate, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class GetAllBookingCorporateDto 
{
    @IsUUID()
    @IsNotEmpty()
    corporateUuid: string;

    @IsUUID()
    @IsNotEmpty()
    branchUuid: string;

    @IsNotEmpty()
    date: Date;
}
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class CorporateDto 
{
    uuid?: string;
    name?: string;
    emailAddress?: string;
    headquartersAddress?: string;
    country?: string;
}
import { Type } from "class-transformer";
import { ArrayMaxSize, isArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";

class SlotsProperties
{
    uuid: string;

    @IsNotEmpty()
    @IsNumber()
    startTimeHour: number;

    @IsNotEmpty()
    @IsNumber()
    startTimeMinutes: number;

    startTime: Date;

    @IsNotEmpty()
    @IsNumber()
    endTimeHour: number;

    @IsNotEmpty()
    @IsNumber()
    endTimeMinutes: number;

    endTime: Date;
}

export class SetDailyScheduleDto 
{
    uuid: string;

    status: string;

    @IsUUID()
    @IsNotEmpty()
    corporateUuid: string;

    @IsUUID()
    @IsNotEmpty()
    branchUuid: string;

    date: Date;
    
    @IsNumber()
    @IsNotEmpty()
    dateDay: number;

    @IsNumber()
    @IsNotEmpty()
    dateMonth: number;

    @IsNumber()
    @IsNotEmpty()
    dateYear: number;
    
    @ValidateNested({each: true})
    @Type(() => SlotsProperties)
    @ArrayMaxSize(10)
    slots: SlotsProperties[]
}
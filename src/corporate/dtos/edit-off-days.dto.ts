export class EditOffDaysDto {
    corporateUuid: string;
    corporateBranchUuid: string;
    workingHours?: {
        startWorkingHours?: number,
        endWorkingHours?: number,
        dayOff?: string[],
    }
}
export class CorporateBranchesDto {
    uuid?: string;
    corporateUuid?: string;
    name?: string;
    address?: string;
    workingHours?: {
        startWorkingHours?: number,
        endWorkingHours?: number,
        dayOff?: [string],
    }
}
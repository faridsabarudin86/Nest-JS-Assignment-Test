export class AddServiceBookingScheduleDto {
    uuid: string;
    corporateUuid: string;
    branchCorporateUuid: string;
    date: string;
    Technicians: [{
        uuid: string;
        status: string;
    }];
}
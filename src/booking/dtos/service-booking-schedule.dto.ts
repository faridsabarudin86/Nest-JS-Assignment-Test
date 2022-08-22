export class ServiceBookingScheduleDto {
    uuid: string;
    corporateUuid: string;
    branchCorporateUuid: string;
    date: string;
    bookingSlots: [{
        uuid: string;
        customerUuid: string;
        vehicleUuid: string;
        status: string;
        startTime: string;
        endTime: string;
        assignedTechnicianUuid: [string];
    }];
    Technicians: [{
        uuid: string;
        status: string;
    }];
}
export class ServiceBookingDto 
{
    uuid?: string;
    corporateUuid?: string;
    branchUuid?: string;
    date?: Date;
    techniciansOfTheDay?: string[];
    slots:
    [{
        uuid?: string,
        status?: string,
        startTime?: number,
        endTime?: number,
        customerUuid?: string,
        alternateDriverUuid?: string,
        vehicleUuid?: string,
        assignedTechnician?: string[],
    }]
}
import { Controller } from '@nestjs/common';
import { DealershipService } from './dealership.service';

@Controller('dealership')
export class DealershipController {
    constructor(private dealershipService: DealershipService) {}
}

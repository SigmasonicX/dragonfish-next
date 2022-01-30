import { Controller } from '@nestjs/common';
import { ApprovalQueueService } from '../../services';

@Controller('approval-queue')
export class ApprovalQueueController {
    constructor(private readonly queue: ApprovalQueueService) {}
}

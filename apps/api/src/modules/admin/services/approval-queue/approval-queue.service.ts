import { Injectable, Logger } from '@nestjs/common';
import { ApprovalQueueStore } from '../../db/stores';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OnEvent } from '@nestjs/event-emitter';
import {
    SubmitToQueuePayload,
    SubmitToQueueJob,
    ApprovalQueueEventsKind,
} from '$shared/models/admin/approval-queue';

@Injectable()
export class ApprovalQueueService {
    private logger = new Logger(`ApprovalQueue`);

    constructor(
        @InjectQueue('approval-queue') private readonly queue: Queue,
        private readonly store: ApprovalQueueStore,
    ) {}

    //#region ---EVENT HANDLERS---

    @OnEvent(ApprovalQueueEventsKind.SubmitToQueue, { async: true })
    private async handleSubmitToQueue(payload: SubmitToQueuePayload) {
        this.logger.log(`Received payload of type ${ApprovalQueueEventsKind.SubmitToQueue}`);

        const job: SubmitToQueueJob = {
            content: payload.content,
        };

        this.logger.log(`Adding new job to queue...`);
        await this.queue.add(ApprovalQueueEventsKind.SubmitToQueue, job);
    }

    //#endregion
}

import { http } from './http';
import { baseUrl } from '$lib/util';
import type { QueueItem } from '$lib/models/admin/approval-queue';

//#region ---APPROVAL QUEUE---

export async function getQueue(profileId: string): Promise<QueueItem[]> {
    return http
        .get<QueueItem[]>(`${baseUrl}/approval-queue/get-queue?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function claimContent() {}

export async function approveContent() {}

export async function rejectContent() {}

//#endregion

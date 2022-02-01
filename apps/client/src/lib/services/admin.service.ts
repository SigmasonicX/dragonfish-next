import { http } from './http';
import { baseUrl } from '$lib/util';
import type { QueueItem } from '$lib/models/admin/approval-queue';
import type { Decision } from '$lib/models/admin/approval-queue';

//#region ---APPROVAL QUEUE---

export async function getQueue(profileId: string): Promise<QueueItem[]> {
    return http
        .get<QueueItem[]>(`${baseUrl}/approval-queue/get-queue?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function claimContent(profileId: string, docId: string): Promise<QueueItem> {
    return http
        .patch<QueueItem>(
            `${baseUrl}/approval-queue/claim-content?pseudId=${profileId}&docId=${docId}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

export async function approveContent(profileId: string, decision: Decision): Promise<void> {
    return http
        .patch<void>(`${baseUrl}/approval-queue/approve-content?pseudId=${profileId}`, decision)
        .then(() => {
            return;
        });
}

export async function rejectContent(profileId: string, decision: Decision): Promise<void> {
    return http
        .patch<void>(`${baseUrl}/approval-queue/reject-content?pseudId=${profileId}`, decision)
        .then(() => {
            return;
        });
}

//#endregion

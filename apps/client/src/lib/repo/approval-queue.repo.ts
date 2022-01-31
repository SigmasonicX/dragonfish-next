import { writable } from 'svelte/store';
import type { QueueItem } from '$lib/models/admin/approval-queue';
import { getQueue } from '$lib/services/admin.service';

interface ApprovalQueueState {
    queue: QueueItem[];
    currItem: QueueItem;
}

export const approvalQueue = writable<ApprovalQueueState>({
    queue: [],
    currItem: null,
});

//#region ---HELPERS---

export async function setQueue(): Promise<void> {
    return getQueue().then((res) => {
        approvalQueue.update((state) => ({
            ...state,
            queue: res,
            currItem: null,
        }));
        return;
    });
}

export function setCurrItem(docId: string): void {
    approvalQueue.update((state) => {
        state.currItem = state.queue.find((item) => item._id === docId);
        return state;
    });
}

export function resetCurrItem(): void {
    approvalQueue.update((state) => ({
        ...state,
        currItem: null,
    }));
}

//#endregion

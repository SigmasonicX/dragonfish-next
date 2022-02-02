import { http } from './http';
import { baseUrl } from '$lib/util';
import type { ContentLibrary } from '$lib/models/content/library';

//#region ---CONTENT LIBRARY---

export async function fetchLibrary(profileId: string): Promise<ContentLibrary[]> {
    return http
        .get<ContentLibrary[]>(`${baseUrl}/content-library/fetch?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function addToLibrary(profileId: string, contentId: string): Promise<ContentLibrary> {
    return http
        .put<ContentLibrary>(
            `${baseUrl}/content-library/add-to?pseudId=${profileId}&contentId=${contentId}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

export async function removeFromLibrary(profileId: string, contentId: string): Promise<void> {
    return http
        .deleteReq<void>(
            `${baseUrl}/content-library/remove?pseudId=${profileId}&contentId=${contentId}`,
        )
        .then((res) => {
            return res.data;
        });
}

//#endregion

//#region ---BOOKSHELVES---

export async function fetchShelves() {}

export async function fetchShelf() {}

export async function createShelf() {}

export async function editShelf() {}

export async function addToShelf() {}

export async function removeFromShelf() {}

export async function toggleVisibility() {}

export async function deleteShelf() {}

//#endregion

//#region ---SHELF ITEMS---

export async function fetchShelfItems() {}

export async function checkShelfItem() {}

//#endregion

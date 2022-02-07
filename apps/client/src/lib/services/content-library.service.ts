import { http } from './http';
import { baseUrl } from '$lib/util';
import type { BookshelfForm, ContentLibrary } from '$lib/models/content/library';
import type { Bookshelf } from '$lib/models/content/library';

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

export async function fetchShelves(profileId: string): Promise<Bookshelf[]> {
    return http
        .get<Bookshelf[]>(`${baseUrl}/bookshelves/fetch-bookshelves?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function fetchShelf(profileId: string, shelfId: string): Promise<Bookshelf> {
    return http
        .get<Bookshelf>(
            `${baseUrl}/bookshelves/fetch-one-bookshelf?pseudId=${profileId}&shelfId=${shelfId}`,
        )
        .then((res) => {
            return res.data;
        });
}

export async function createShelf(profileId: string, shelfForm: BookshelfForm): Promise<Bookshelf> {
    return http
        .post<Bookshelf>(`${baseUrl}/bookshelves/create-bookshelf?pseudId=${profileId}`, shelfForm)
        .then((res) => {
            return res.data;
        });
}

export async function editShelf(
    profileId: string,
    shelfId: string,
    shelfForm: BookshelfForm,
): Promise<Bookshelf> {
    return http
        .patch<Bookshelf>(
            `${baseUrl}/bookshelves/edit-bookshelf?pseudId=${profileId}&shelfId=${shelfId}`,
            shelfForm,
        )
        .then((res) => {
            return res.data;
        });
}

export async function toggleVisibility(profileId: string, shelfId: string): Promise<Bookshelf> {
    return http
        .patch<Bookshelf>(
            `${baseUrl}/bookshelves/toggle-visibility?pseudId=${profileId}&shelfId=${shelfId}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

export async function deleteShelf(profileId: string, shelfId: string): Promise<void> {
    return http
        .deleteReq<void>(
            `${baseUrl}/bookshelves/delete-bookshelf?pseudId=${profileId}&shelfId=${shelfId}`,
        )
        .then(() => {
            return;
        });
}

//#endregion

//#region ---SHELF ITEMS---

export async function addToShelf() {}

export async function removeFromShelf() {}

export async function fetchShelfItems() {}

export async function checkShelfItem() {}

//#endregion

import { writable } from 'svelte/store';
import { comments as commentsService } from '$lib/services';
import type { Comment, CommentForm } from '$lib/models/comments';
import { CommentKind } from '$lib/models/comments';
import * as lodash from 'lodash';
import type { PaginateResult } from '$lib/models/util';

interface CommentsState {
    threadId: string;
    kind: CommentKind;
    comments: Comment[];
    currPage: number;
    totalComments: number;
    perPage: number;
    totalPages: number;
}

const defaultCommentsState: CommentsState = {
    threadId: null,
    kind: CommentKind.ContentComment,
    comments: [],
    currPage: 1,
    totalComments: 0,
    perPage: 50,
    totalPages: 1,
};

export const comments = writable<CommentsState>(defaultCommentsState);

//#region ---HELPERS---

export async function getPage(
    itemId: string,
    kind: CommentKind,
    page: number,
): Promise<PaginateResult<Comment>> {
    return await commentsService.fetchComments(itemId, kind, page).then((res) => {
        comments.set({
            threadId: itemId,
            kind: kind,
            comments: res.docs,
            currPage: res.page,
            totalComments: res.totalDocs,
            perPage: res.limit,
            totalPages: res.totalPages,
        });
        return res;
    });
}

export async function addComment(
    profileId: string,
    itemId: string,
    kind: CommentKind,
    formData: CommentForm,
): Promise<void> {
    return await commentsService.addComment(profileId, itemId, kind, formData).then((res) => {
        comments.update((state) => ({
            ...state,
            comments: [...state.comments, res],
        }));
    });
}

export async function editComment(
    profileId: string,
    commentId: string,
    formData: CommentForm,
): Promise<void> {
    return await commentsService.editComment(profileId, commentId, formData).then((res) => {
        comments.update((state) => ({
            ...state,
            comments: state.comments.splice(
                lodash.findIndex(state.comments, { _id: res._id }),
                1,
                res,
            ),
        }));
    });
}

/*

public editComment(commentId: string, formInfo: CommentForm) {
  return this.network.editComment(this.pseudQuery.currentId, commentId, formInfo).pipe(
    tap(() => {
      this.comments.update(commentId, {
        body: formInfo.body,
      });
    }),
    catchError((err) => {
      this.alerts.error(`Something went wrong editing this comment!`);
      return throwError(err);
    }),
  );
}*/

//#endregion
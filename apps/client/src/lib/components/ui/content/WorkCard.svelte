<script lang="ts">
    import type { Content } from '$lib/models/content';
    import { ContentKind } from '$lib/models/content';
    import { TagKind } from '$lib/models/content/works';
    import { abbreviate, localeDate } from '$lib/util';
    import { CardSize } from '$lib/models/site';
    import TagBadge from './TagBadge.svelte';
    import {
        Calendar2Line,
        DiscussLine,
        HeartLine,
        PenNibLine,
        RhythmFill,
    } from 'svelte-remixicon';

    export let content: Content;
    export let size: CardSize = CardSize.Medium;

    let contentUrl = `/prose`;

    const calculateApprovalRating = (likes: number, dislikes: number): number => {
        const totalVotes = likes + dislikes;
        if (totalVotes === 0) {
            return 0;
        } else {
            return Math.ceil((likes / totalVotes) * 100);
        }
    };

    if (content) {
        switch (content.kind) {
            case ContentKind.ProseContent:
                contentUrl = `/prose/${content._id}`;
                break;
            case ContentKind.PoetryContent:
                contentUrl = `/poetry/${content._id}`;
        }
    }
</script>

<a
    class="card border border-gray-600 dark:border-white group hover:bg-gray-100 hover:dark:bg-zinc-700"
    href={contentUrl}
>
    <div class="flex flex-wrap items-center">
        <h3 class="title">
            {content.title}
        </h3>
        <TagBadge kind={TagKind.Rating} rating={content.meta.rating} hasIcon={false} />
    </div>
    <div
        class="flex flex-wrap items-center pb-0.5 pt-0.5 text-xs border-b border-gray-600 dark:border-white group-active:border-white"
    >
        <div class="flex-1">
            by {content.author.screenName}
        </div>
        <div class="flex items-center">
            <HeartLine size="16px" />
            <span>{calculateApprovalRating(content.stats.likes, content.stats.dislikes)}%</span>
        </div>
    </div>
    <div class="flex items-center flex-wrap mb-2">
        <TagBadge kind={TagKind.Type} type={content.kind} size={'medium'} />
        <TagBadge kind={TagKind.Category} category={content.meta.category} size={'medium'} />
        {#each content.meta.genres as genre}
            <TagBadge kind={TagKind.Genre} {genre} size={'medium'} />
        {/each}
    </div>
    <!--<ng-container *ngIf="content.tags !== null && content.tags.length > 0">
      <div class="card-tags flex flex-wrap items-center">
          <ng-container *ngIf="content.tags.length === 1; else multipleTags">
                  <a
          class="tags"
          [routerLink]="['/tag', content.tags[0]._id, content.tags[0].name | slugify]"
          [innerHtml]="content.tags[0] | displayTags | safeHtml"
        ></a>
          </ng-container>
          <ng-template #multipleTags>
              <ng-container *ngIf="showAllTags; else showOneTag">
                      <ng-container *ngFor="let tag of content.tags; let i = index">
                          <a
              class="tags"
              [routerLink]="['/tag', tag._id, tag.name | slugify]"
              [innerHtml]="tag | displayTags | safeHtml"
            ></a>
                          <ng-container *ngIf="i < content.tags.length - 1">
                              ,&nbsp;
                          </ng-container>
                      </ng-container>
                  <rmx-icon name="arrow-up-s-line" (click)="toggleShowAllTags()"></rmx-icon>
              </ng-container>
              <ng-template #showOneTag>
                      <a
            class="tags"
            [routerLink]="['/tag', content.tags[0]._id, content.tags[0].name | slugify]"
            [innerHtml]="content.tags[0] | displayTags | safeHtml"
          ></a>
                  <rmx-icon name="arrow-down-s-line" (click)="toggleShowAllTags()"></rmx-icon>
              </ng-template>
          </ng-template>
      </div>
  </ng-container>-->
    <div class="work-body">
        {#if content.meta.coverArt}
            <div class="cover">
                <img src={content.meta.coverArt} alt="cover" />
            </div>
        {/if}
        <div class="desc">
            {content.desc}
        </div>
    </div>
    <div class="work-meta bg-gray-200 dark:bg-gray-600">
        <div class="flex items-center">
            <RhythmFill size="16px" />
            <span>{abbreviate(content.stats.views)}</span>
        </div>
        <div class="text-sm mx-0.5 relative -top-0.5">•</div>
        <div class="flex items-center">
            <PenNibLine size="16px" />
            <span>{abbreviate(content.stats.words)}</span>
        </div>
        <div class="text-sm mx-0.5 relative -top-0.5">•</div>
        <div class="flex items-center">
            <DiscussLine size="16px" />
            <span>{abbreviate(content.stats.comments)}</span>
        </div>
        <div class="text-sm mx-0.5 relative -top-0.5">•</div>
        <div>
            {content.meta.status}
        </div>
        <div class="flex-1" />
        <div class="flex items-center">
            <Calendar2Line size="16px" />
            <span>
                {#if content.audit.publishedOn}
                    {localeDate(content.audit.publishedOn, 'shortDate')}
                {:else}
                    {localeDate(content.createdAt, 'shortDate')}
                {/if}
            </span>
        </div>
    </div>
</a>

<style lang="scss">
    a.card {
        @apply block flex flex-col p-2 transition transform select-none cursor-pointer h-full rounded-md;
        color: var(--text-color);
        h3.title {
            @apply relative top-0.5 font-medium flex-1 text-xl overflow-hidden overflow-ellipsis whitespace-nowrap;
        }
        &:hover {
            @apply scale-105 no-underline z-30;
            box-shadow: var(--dropshadow);
            div.work-meta {
                @apply bg-gray-300;
            }
        }
        div.work-body {
            @apply flex-1 mb-2;
            div.cover {
                @apply mr-2;
                img {
                    @apply object-contain rounded-lg float-left mr-2 mb-0.5;
                    max-width: 6.5rem;
                    max-height: 6.5rem;
                }
            }
            div.desc {
                @apply text-sm;
            }
        }
        div.work-meta {
            @apply rounded-md px-1 text-xs flex items-center;
            :global(svg) {
                @apply mr-0.5;
            }
        }
        &:active {
            @apply scale-100 text-white;
            background: var(--accent);
            h3.title {
                color: white !important;
            }
            div.work-meta {
                background: var(--accent-light);
            }
        }
        &.active {
            @apply scale-105 text-white bg-gray-100;
            box-shadow: var(--dropshadow);
            h3.title {
                @apply text-white;
            }
            div.work-meta {
                @apply bg-gray-300;
            }
        }
    }
</style>

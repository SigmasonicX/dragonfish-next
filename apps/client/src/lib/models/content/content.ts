import type { Pseudonym } from '$lib/models/accounts';
import type { ContentRating } from './content-rating';
import type { ContentKind } from './content-kind';
import type { PubStatus } from './pub-status';
import type { Section } from '$lib/models/content/works';

export interface Content {
	readonly _id: string;
	readonly author: Pseudonym;
	title: string;
	desc: string;
	body: string;
	meta: {
		rating: ContentRating;
		warnings: string[];
	};
	readonly stats: {
		words: number;
		readonly views: number;
		likes: number;
		dislikes: number;
		readonly comments: number;
	};
	sections?: Section[];
	audit: {
		published: PubStatus;
		publishedOn: Date;
		hasComments: boolean;
		isDeleted: boolean;
	};
	readonly kind: ContentKind;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

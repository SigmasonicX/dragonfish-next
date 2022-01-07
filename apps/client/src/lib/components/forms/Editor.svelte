<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import {
        Bold as BoldIcon,
        Italic as ItalicIcon,
        Underline as UnderlineIcon,
        Strikethrough,
        AlignLeft,
        ImageAddLine,
        FilmLine,
        DoubleQuotesR,
        Separator,
        ListUnordered,
        Emotion2Line,
        ArrowGoBackLine,
        ArrowGoForwardLine,
    } from 'svelte-remixicon';
    import { Editor } from '@tiptap/core';
    import Underline from '@tiptap/extension-underline';
    import Typography from '@tiptap/extension-typography';
    import Image from '@tiptap/extension-image';
    import Link from '@tiptap/extension-link';
    import Blockquote from '@tiptap/extension-blockquote';
    import Code from '@tiptap/extension-code';
    import TextAlign from '@tiptap/extension-text-align';
    import Placeholder from '@tiptap/extension-placeholder';
    import Dropcursor from '@tiptap/extension-dropcursor';
    import BubbleMenu from '@tiptap/extension-bubble-menu';
    import FloatingMenu from '@tiptap/extension-floating-menu';
    import Bold from '@tiptap/extension-bold';
    import BulletList from '@tiptap/extension-bullet-list';
    import Document from '@tiptap/extension-document';
    import Gapcursor from '@tiptap/extension-gapcursor';
    import HardBreak from '@tiptap/extension-hard-break';
    import Heading from '@tiptap/extension-heading';
    import History from '@tiptap/extension-history';
    import HorizontalRule from '@tiptap/extension-horizontal-rule';
    import Italic from '@tiptap/extension-italic';
    import ListItem from '@tiptap/extension-list-item';
    import OrderedList from '@tiptap/extension-ordered-list';
    import Paragraph from '@tiptap/extension-paragraph';
    import Strike from '@tiptap/extension-strike';
    import Text from '@tiptap/extension-text';

    let element;
    let editor: Editor;
    export let label;
    export let value;

    onMount(() => {
        editor = new Editor({
            element: element,
            extensions: [
                Bold,
                Italic,
                Underline,
                Strike,
                Paragraph,
                Text,
                BulletList,
                ListItem,
                OrderedList,
                Document,
                Gapcursor,
                HardBreak,
                Heading,
                History.configure({ levels: [2, 3, 4] } as any),
                HorizontalRule,
                Typography,
                Image.configure({
                    inline: true,
                }),
                Link.configure({ openOnClick: false }),
                Blockquote,
                Code,
                TextAlign.configure({
                    types: ['paragraph', 'heading', 'image'],
                }),
                Placeholder.configure({
                    placeholder: 'Write something here...',
                }),
                Dropcursor,
                BubbleMenu.configure({ element: document.querySelector('.menu') }),
                FloatingMenu.configure({ element: document.querySelector('.menu') }),
            ],
            content: value,
            onTransaction: () => {
                editor = editor;
            },
        });
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });
</script>

{#if label}
    <label
        for="offprint-editor"
        class="text-[0.625rem] relative z-20 top-[0.15rem] left-1 py-0.5 px-1 rounded-t-lg font-semibold tracking-wider uppercase"
    >
        {label}
    </label>
{/if}
<div
    id="offprint-editor"
    class="w-full flex flex-col rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed"
>
    {#if editor}
        <div class="editor-bar">
            <button class="no-icon">
                <span class="text">Heading</span>
            </button>
            <span class="text-lg mx-0.5">|</span>
            <button on:click={() => editor.chain().focus().toggleBold().run()}>
                <BoldIcon />
            </button>
            <button on:click={() => editor.chain().focus().toggleItalic().run()}>
                <ItalicIcon />
            </button>
            <button on:click={() => editor.chain().focus().toggleBold().run()}>
                <UnderlineIcon />
            </button>
            <button on:click={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough />
            </button>
            <span class="text-lg mx-0.5">|</span>
            <button>
                <AlignLeft class="mr-1.5" />
                <span class="text">Align</span>
            </button>
            <span class="text-lg mx-0.5">|</span>
            <button>
                <ImageAddLine />
            </button>
            <button>
                <FilmLine />
            </button>
            <span class="text-lg mx-0.5">|</span>
            <button>
                <DoubleQuotesR />
            </button>
            <button>
                <Separator />
            </button>
            <button>
                <ListUnordered />
            </button>
            <span class="text-lg mx-0.5">|</span>
            <button>
                <Emotion2Line />
            </button>
            <div class="flex-1" />
            <button>
                <ArrowGoBackLine />
            </button>
            <button>
                <ArrowGoForwardLine />
            </button>
        </div>
    {/if}
    <div class="editing-area" bind:this={element} />
</div>

<style lang="scss">
    div.editor-bar {
        @apply flex items-center p-1;
        button {
            @apply p-3 rounded-lg transition transform flex items-center;
            &:hover {
                background: var(--accent);
            }
            span.text {
                @apply uppercase text-xs font-bold tracking-widest;
            }
            &.no-icon {
                @apply px-3 py-3;
            }
        }
    }
    div.editing-area {
        min-height: 10rem;
        max-height: 85vh;
        overflow-y: scroll;
        @apply block relative;
        color: var(--text-color);
    }

    :global(div.ProseMirror) {
        @apply py-0.5 px-3 bg-transparent mb-0 focus:outline-none border-t-2 border-transparent transition transform border-zinc-500;
        min-height: 10rem !important;
        max-height: 85vh !important;

        &:focus {
            border-color: var(--borders);
        }

        p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: rgb(97, 103, 116);
            pointer-events: none;
            height: 0;
        }

        // Headers and default image style
        h1 {
            font-size: 3em;
        }
        h2 {
            font-size: 2em;
        }
        h3 {
            font-size: 1.5em;
        }
        h4 {
            font-size: 1.25em;
        }
        h5 {
            font-size: 1em;
            font-weight: bold;
            text-transform: uppercase;
        }
        h6 {
            font-size: 1em;
            text-transform: uppercase;
        }
        img {
            max-width: 100%;
            display: inline;
        }

        blockquote {
            margin-left: 0.75rem;
            padding-left: 0.75rem;
            border-left: 2px solid var(--borders);
        }

        // CKEditor-generated image styles
        .image {
            display: table;
            clear: both;
            text-align: center;
            margin: 1em auto;
        }

        .image-style-align- {
            &left {
                float: left;
                margin-right: 1.5em;
            }
            &center {
                margin-left: auto;
                margin-right: auto;
            }
            &right {
                float: right;
                margin-left: 1.5em;
            }
        }

        // A little CSS hack to force images at the bottom of content bodies to not break out of their containers.
        // More details here: http://bonrouge.com/br.php?page=floats
        > :last-child:after {
            content: '.';
            display: block;
            height: 0;
            overflow: hidden;
            clear: both;
            visibility: hidden;
        }

        // CKEditor-generated font sizes
        span.text- {
            &tiny {
                font-size: 0.7em;
            }
            &small {
                font-size: 0.85em;
            }
            &big {
                font-size: 1.4em;
            }
            &huge {
                font-size: 1.85em;
            }
        }
        ul,
        ol {
            margin-left: 2.5rem;
        }
        ul {
            list-style-type: disc;
        }
        ol {
            list-style-type: decimal;
        }
        li {
            @apply my-1;
        }
    }

    :global(.ProseMirror p.is-editor-empty:first-child::before) {
        content: attr(data-placeholder);
        float: left;
        @apply text-zinc-400;
        pointer-events: none;
        height: 0;
    }
</style>

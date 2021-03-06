import { IOptions } from 'sanitize-html';

export const sanitizeOptions: IOptions = {
    allowedTags: [
        'address',
        'article',
        'aside',
        'footer',
        'header',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hgroup',
        'main',
        'nav',
        'section',
        'blockquote',
        'dd',
        'div',
        'dl',
        'dt',
        'figcaption',
        'figure',
        'hr',
        'li',
        'main',
        'ol',
        'p',
        'pre',
        'ul',
        'a',
        'abbr',
        'b',
        'bdi',
        'bdo',
        'br',
        'cite',
        'code',
        'data',
        'dfn',
        'em',
        'i',
        'kbd',
        'mark',
        'q',
        'rb',
        'rp',
        'rt',
        'rtc',
        'ruby',
        's',
        'samp',
        'small',
        'span',
        'strong',
        'sub',
        'sup',
        'time',
        'u',
        'var',
        'wbr',
        'caption',
        'col',
        'colgroup',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'tr',
        'img',
        'iframe',
    ],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
        div: ['style'],
        p: ['style'],
        ul: ['style'],
        ol: ['style', 'type', 'start', 'reversed'],
        a: ['href', 'name', 'target', 'style'],
        h1: ['style'],
        h2: ['style'],
        h3: ['style'],
        h4: ['style'],
        h5: ['style'],
        h6: ['style'],
        figure: ['style'],
        img: ['src', 'style'],
        span: ['style'],
        iframe: ['src'],
    },
    allowedClasses: {
        figure: [
            'image',
            'image_resized',
            'image-style-align-left',
            'image-style-align-center',
            'image-style-align-right',
        ],
        span: ['text-small', 'text-tiny', 'text-big', 'text-huge'],
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
    // URL schemes we permit
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false,
};

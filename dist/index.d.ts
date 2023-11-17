import { Stats, Compiler } from 'webpack';

interface WabpackBotNotifyPluginOptions {
    channel: string;
    key: string;
    content: Content;
}
interface Content {
    msgtype: string;
    text?: Text;
    markdown?: Markdown;
    image?: Image;
    news?: News;
}
interface Text {
    content: string;
    mentioned_list?: string[];
    mentioned_mobile_list?: string[];
}
interface Markdown {
    content: string;
}
interface Image {
    base64: string;
    md5: string;
}
interface News {
    articles: NewsItem[];
}
interface NewsItem {
    title: string;
    description?: string;
    url: string;
    picurl?: string;
}
interface CompilerExt extends Compiler {
    plugin: (name: string, fn: (state: Stats, cb: any) => void) => void;
}
declare class WabpackBotNotifyPlugin {
    config: WabpackBotNotifyPluginOptions;
    url: string;
    constructor(config: WabpackBotNotifyPluginOptions);
    apply(compiler: CompilerExt): void;
    pluginDoneFn(state: Stats, cb: any): void;
    sendWecomNotify(data: any): Promise<unknown>;
}

export { Content, Image, Markdown, News, NewsItem, Text, WabpackBotNotifyPlugin, WabpackBotNotifyPluginOptions };

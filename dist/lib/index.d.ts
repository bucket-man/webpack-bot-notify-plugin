import { Compiler, Stats } from 'webpack';
export interface WabpackBotNotifyPluginOptions {
    channel: string;
    key: string;
    content: Content;
}
export interface Content {
    msgtype: string;
    text?: Text;
    markdown?: Markdown;
    image?: Image;
    news?: News;
}
export interface Text {
    content: string;
    mentioned_list?: string[];
    mentioned_mobile_list?: string[];
}
export interface Markdown {
    content: string;
}
export interface Image {
    base64: string;
    md5: string;
}
export interface News {
    articles: NewsItem[];
}
export interface NewsItem {
    title: string;
    description?: string;
    url: string;
    picurl?: string;
}
interface CompilerExt extends Compiler {
    plugin: (name: string, fn: (state: Stats, cb: any) => void) => void;
}
export declare class WabpackBotNotifyPlugin {
    config: WabpackBotNotifyPluginOptions;
    url: string;
    constructor(config: WabpackBotNotifyPluginOptions);
    apply(compiler: CompilerExt): void;
    pluginDoneFn(state: Stats, cb: any): void;
    sendWecomNotify(data: any): Promise<unknown>;
}
export {};

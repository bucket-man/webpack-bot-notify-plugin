import { Compiler, Stats } from 'webpack'
import axios from 'axios'

const wecom_notify_url = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send'

export interface WabpackBotNotifyPluginOptions {
  channel: string,
  key: string,
  content: Content
}

export interface Content {
  msgtype: string,
  text?: Text,
  markdown?: Markdown,
  image?: Image,
  news?: News
}

export interface Text {
  content: string,
  mentioned_list?: string[],
  mentioned_mobile_list?: string[]
}

export interface Markdown {
  content: string
}

export interface Image {
  base64: string,
  md5: string
}

export interface News {
  articles: NewsItem[] 
}

export interface NewsItem {
  title: string,
  description?: string,
  url: string,
  picurl?: string,
}

interface CompilerExt extends Compiler {
  plugin: (name: string, fn: (state: Stats, cb: any) => void) => void
}

export class WabpackBotNotifyPlugin {
  config: WabpackBotNotifyPluginOptions
  url: string

  constructor(config: WabpackBotNotifyPluginOptions) {
    const { channel, key } = config
    if (channel == 'wecom') {
      this.url = `${wecom_notify_url}?key=${key}`
    }
    this.config = config
  }

  apply(compiler: CompilerExt) {
    if (compiler.hooks && compiler.hooks.done) {

      compiler.hooks.done.tapAsync('WabpackBotNotifyPlugin', (state: Stats, cb) => {
        this.pluginDoneFn(state, cb)
      })
    } else {
      if (typeof compiler.plugin === 'undefined') return

      compiler.plugin('done', (state: Stats, cb) => {
        this.pluginDoneFn(state, cb)
      })
    }
  }

  pluginDoneFn(state: Stats, cb) {
    const { channel, content } = this.config
    
    if (!channel) {
      console.warn('未填写通知渠道。')
      return
    }
    if (!content) {
      console.warn('未填写通知内容。')
      return
    }
    if (channel == 'wecom') {
      const { msgtype } = content
      
      let params = {
        msgtype,
      }
      params[msgtype] = content[msgtype]

      this.sendWecomNotify(params).then(response => {
        cb()
      }).catch(error => {
        cb()
      })
    } else {
      console.warn('不支持当前渠道，请根据文档设置。')
    }
  }

  sendWecomNotify(data: any) {
    return new Promise((resolve, reject) => {
      axios.post(this.url, data).then(response => {
        const { status, data } = response
        if (status == 200) {
          const { errcode, errmsg } = data
          if (errcode == 0) {
            resolve(data)
          } else {
            console.error(errmsg)
            reject(data)
          }
        } else {
          reject(data)
        }
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  }
}
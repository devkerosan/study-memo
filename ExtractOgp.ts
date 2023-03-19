import { JSDOM } from 'jsdom';
import axios from 'axios';
import * as chardet from 'chardet';
import * as iconv from 'iconv-lite'

export const extractOgp = async (url: string) => {
    const res = await axios.get(encodeURI(url), {
        responseType: 'arraybuffer',
        transformResponse: data => {
            const encoding = chardet.detect(data);
            if (!encoding) {
                throw new Error('chardet failed to detect encoding');
            }
            return iconv.decode(data, encoding);
        }
    }).catch(err => "error");
    const html = typeof res === "string" ? res : res.data;
    if (html === "error") return "error";
    const dom = new JSDOM(html);
    const meta = dom.window.document.head.querySelectorAll("meta");
    const ogp = [...meta]
        .filter((element: Element) => element.hasAttribute("property"))
        .reduce((previous: any, current: Element) => {
            const property = current.getAttribute("property")?.trim();
            if (!property) return;
            const content = current.getAttribute("content");
            previous[property] = content;
            return previous;
        }, {});
    return Promise.resolve(ogp);
}

export const extractTitle = async (url: string) => {
    const res = await axios.get(encodeURI(url), {
        responseType: 'arraybuffer',
        transformResponse: data => {
            const encoding = chardet.detect(data);
            if (!encoding) {
                throw new Error('chardet failed to detect encoding');
            }
            return iconv.decode(data, encoding);
        }
    }).catch(err => "error");
    const html = typeof res === "string" ? res : res.data;
    if (html === "error") return "error";
    const dom = new JSDOM(html);
    const meta = dom.window.document.head.querySelectorAll("title");
    return Promise.resolve(meta[0].innerHTML);
}
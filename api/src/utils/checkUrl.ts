import { URL } from 'url';

function isUrl(url: string) {
    try {
        // eslint-disable-next-line no-new
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

export { isUrl };

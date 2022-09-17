export function jsonbuf(object: any): Buffer {
    return Buffer.from(JSON.stringify(object));
}

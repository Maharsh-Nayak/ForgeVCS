import crypto from 'crypto';

export function hashFile(type, contentBuf){
    let header = Buffer.from(`${type} ${contentBuf.length}\0`, 'utf8');
    let storeBuf = Buffer.concat([header, contentBuf]);
    let hash = crypto.createHash('sha1').update(storeBuf).digest('hex');
    return hash;
}
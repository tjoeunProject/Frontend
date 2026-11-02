import Hashids from 'hashids';

let codec;
function configuredCodec() {
  if (!codec) {
    const salt = import.meta.env.VITE_SALT;
    const length = Number(import.meta.env.VITE_HASHIDS_MIN_LENGTH ?? 8);
    if (!salt || !Number.isInteger(length) || length < 1) throw new Error('Configure VITE_SALT and VITE_HASHIDS_MIN_LENGTH to match the backend');
    codec = new Hashids(salt, length);
  }
  return codec;
}
// URL obfuscation only; server ownership checks remain mandatory.
export const encodeId = id => id == null ? id : configuredCodec().encode(id);
export const decodeId = hash => configuredCodec().decode(hash)[0];

import Hashids from 'hashids';

// 백엔드 application.properties에 설정한 값과 '완벽히' 똑같아야 합니다!
const SALT = import.meta.SALT; 
const MIN_LENGTH = import.meta.MIN_LENGTH;

const hashids = new Hashids(SALT, MIN_LENGTH);

export const encodeId = (id) => hashids.encode(id);
export const decodeId = (hash) => hashids.decode(hash)[0]; // 결과가 배열이라 [0] 선택
export interface TokenModel {
  accessToken: string;
  refreshToken: string;
  userId: string;
  isOwner: number;
}

export function mapTokenFromJson(json: any): TokenModel {
  if (!json) {
    throw new Error('JSON 응답이 유효하지 않습니다.');
  }
  
  return {
    accessToken: json.accessToken, 
    refreshToken: json.refreshToken, 
    userId: json.user_id,
    isOwner: json.isOwner,         
  } as TokenModel;
}

// 필요할 때 클라이언트 객체를 백엔드 전송용 JSON 구조로 변환합니다.
export function mapTokenToJson(model: TokenModel): any {
  return {
    'accessToken': model.accessToken,
    'refreshToken': model.refreshToken,
    'user_id': model.userId,
    'isOwner': model.isOwner
  };
}
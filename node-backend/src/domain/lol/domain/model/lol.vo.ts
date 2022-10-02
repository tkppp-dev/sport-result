export type MatchProgress =
  | '예정'
  | '1세트'
  | '2세트'
  | '3세트'
  | '4세트'
  | '5세트'
  | '종료'
  | '취소'
  | '경기취소'

export const LoLProgress = [
  '예정',
  '1세트',
  '2세트',
  '3세트',
  '4세트',
  '5세트',
  '종료',
  '취소',
  '경기취소',
]

const lckTeam = {
  T1: 'T1',
  젠지: '젠지',
  '담원 기아': '담원 기아',
  DRX: 'DRX',
  '리브 샌박': '리브 샌드박스',
  KT: 'kt 롤스터',
  한화생명: '한화생명e스포츠',
  광동: '광동 프릭스',
  농심: '농심 레드포스',
  프레딧: '프레딧 브리온',
}

const lckTeamAlias = {
  T1: 'T1',
  젠지: '젠지',
  '담원 기아': '담원 기아',
  DRX: 'DRX',
  '리브 샌드박스': '리브 샌박',
  'kt 롤스터': 'KT',
  한화생명e스포츠: '한화생명',
  '광동 프릭스': '광동',
  '농심 레드포스': '농심',
  '프레딧 브리온': '프레딧',
}

const lplTeam = {
  RNG: 'Royal Never Give Up',
  JDG: 'JD Gaming',
  EDG: 'Edward Gaming',
  TES: 'Top Esports',
}

const lplTeamAlias = {
  'Royal Never Give Up': 'RNG',
  'JD Gaming': 'JDG',
  'Edward Gaming': 'EDG',
  'Top Esports': 'TES',
}

const lecTeam = {
  G2: 'G2 Esports',
  FNC: 'Fnatic',
  RGE: 'Rogue',
  MAD: 'MAD Lions',
}

const lecTeamAlias = {
  'G2 Esports': 'G2',
  Fnatic: 'FNC',
  Rogue: 'RGE',
  'MAD Lions': 'MAD',
}

const lcsTeam = {
  EG: 'Evil Geniuses',
  C9: 'Cloud9',
  '100': '100 Thieves',
}

const lcsTeamAlias = {
  'Evil Geniuses': 'EG',
  Cloud9: 'C9',
  '100 Thieves': '100',
}

const elseTeam = {
  TBD: 'TBD',
  CFO: 'CTBC Flying Oyster',
  GAM: 'GAM eSports',
  SGB: 'Saigon Buffalo',
  Isurus: 'Isurus Gaming',
  DFM: 'DetonatioN FocusMe',
  CHF: 'Chiefs Esports Club',
  BYG: 'Beyond Gaming',
  LLL: 'LOUD',
  IW: 'istanbul Wildcats',
}

const elseTeamAlias = {
  TBD: 'TBD',
  'CTBC Flying Oyster': 'CFO',
  'GAM eSports': 'GAM',
  'Saigon Buffalo': 'SGB',
  'Isurus Gaming': 'Isurus',
  'DetonatioN FocusMe': 'DFM',
  'Chiefs Esports Club': 'CHF',
  'Beyond Gaming': 'BYG',
  LOUD: 'LLL',
  'istanbul Wildcats': 'IW',
}

export const lolTeam: { [team: string]: string } = {
  ...lckTeam,
  ...lplTeam,
  ...lecTeam,
  ...lcsTeam,
  ...elseTeam,
}
export const lolTeamAlias: { [team: string]: string } = {
  ...lckTeamAlias,
  ...lplTeamAlias,
  ...lecTeamAlias,
  ...lcsTeamAlias,
  ...elseTeamAlias,
}

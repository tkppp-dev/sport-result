export type MatchProgress = '1회초' | "1회말" | "2회초" | "2회말" |"3회초" | "3회말" | "4회초" | "4회말" 
| "5회초" | "5회말" | "6회초" | "6회말"| "7회초" | "7회말" | "8회초" | "8회말" | "9회초" | "9회말" | "10회초" 
| "10회말" | "11회초" | "11회말" | "12회초" | "12회말" | "경기전" | "종료" | "경기취소"

export const matchProgressEnum: ReadonlyArray<MatchProgress> = ['1회초' , "1회말" , "2회초" , "2회말" 
,"3회초" , "3회말" , "4회초" , "4회말", "5회초" , "5회말" , "6회초" , "6회말", "7회초" , "7회말" , "8회초"
, "8회말" , "9회초" , "9회말" , "10회초" , "10회말" , "11회초" , "11회말" , "12회초" , "12회말" , "경기전"
, "종료" , "경기취소"]

export type Team = '삼성' | 'SSG' | '키움' | '롯데' | 'LG' | '한화' | 'NC' | '두산' | 'KT' | 'KIA'
export const teamEnum: ReadonlyArray<Team> = ['삼성', 'SSG', '키움', '롯데', 'LG', '한화', 'NC', '두산', 'KT', 'KIA']

enum TeamCode {
  '삼성' = 'SS',
  'SSG' = 'SK',
  '키움' = 'WO',
  '롯데' = 'LT',
  'LG' = 'LG',
  '한화' = 'HH',
  'NC' = 'NC',
  '두산' = 'OB',
  'KIA' = 'HT',
  'KT' = 'KT'
}

export function getTeamCode(team: Team) {
  return TeamCode[team]
}
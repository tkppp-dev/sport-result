# 스포츠 결과 확인하기 웹

**목적**: 내가 좋아하는 스포츠에 대해 경기 결과 및 기록을 빠르고 쉽게 확인하기 위해

**URL**
KBO Page: http://13.209.36.27:8080/
LCK Page: http://13.209.36.27:8080/lck

# 구현 범위
1. KBO - 완료
2. LCK - 당일 경기 및 주간 경기 일정 완료
3. NBA

현재 관심있는 스포츠 3가지에 대해 구현 예정

# 각 카테고리에서 확인할 수 있는 내용
1. 가장 최근 경기 결과 및 기록
2. 순위
3. 일정 및 결과


# 사용 기술
**Backend(Main Server)** - Kotlin, SpringBoot, JPA, MySQL   
**Backend(Crawling Server)** - Node.js, Express, Cheerio, puppeteer   
**Frontend** - Vue.js   
**DevOps** - AWS EC2, RDS   

# 구현 방식
구현을 위한 api가 따로 존재하진 않기 때문에 크롤링에 의존

## 국내야구
- 최근 경기 결과
db에 저장한 결과를 받아오지만 스케줄링을 통해 일정 시간 간격마다 경기 진행 상황 및 결과 업데이트
	- 조회(back) : 완료
	- 당일 경기 결과 업데이트 : 완료
	- 당일 경기 결과 크롤링(crawling) : 완료
- 최근 경기 기록
	- 네이버 경기 기록 화면으로 리다이렉트 되도록 할 예정 : 완료
- 순위
	 - 크롤링 : 완료
- 일정
 
- 관리자 페이지에서 일정 수집할 경우 크롤링
  - 연도별 일정 추가(back) : 완료
  - 연도별 일정 크롤링(crawling) : 완료
  - 관리자 페이지 : 미완료

## LCK
구현 완료  
- 당일 경기 결과
- 주간 경기 일정
- 월별 일정 가져오기

미구현
- 팀 순위

버그
- 주간 경기 일정을 가져올때 달의 끝이 포함된 주일 경우 해당 달의 끝날까지만 조회됨

# 추후 목표
- Travis CI를 활용한 배포 자동화를 구현해 다른 기능 구현시 배포 편의성 증대
- 곧 시작하는 LCK Summer 순위, 일정 구현
- NBA는 시즌 마무리가 얼마 남지 않아 구현 필요성을 느끼기 어려워 잠정 중단


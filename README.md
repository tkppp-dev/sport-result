# 스포츠 결과 확인하기 웹

**목적**: 좋아하는 스포츠의 경기 결과 및 기록을 빠르고 쉽게 확인하기 위해

**URL**  
- KBO Page: http://tkppp-server.tk
- LCK Page: http://tkppp-server.tk/lck  
  
cf) 해외 도메인이기 때문에 특정 통신사에서는 접속이 안될 수 있음. 그럴 경우 http://158.247.218.216/ 로 접속

# 사용 기술 
**Backend** - Typescript, Express, Typeorm, Cheerio, puppeteer  
**Frontend** - Vue.js   
**DevOps** - Vultr

## 마이그레이션 전 사용 기술
**마이그레이션 전 소스** : regacy 브랜치  
**Backend(Main Server)** - Kotlin, SpringBoot, JPA, MySQL   
**Backend(Crawling Server)** - Node.js, Express, Cheerio, puppeteer


# 패치 노트
**2022-10-03**
  - LCK 도메인을 모든 리그오브레전드 대회(LOL World Championship, MSI)에 작동하도록 변경하고 도메인 명을 LOL로 변경
  - LOL 도메인에 DDD 적용

**2022-09-13**
  - KBO 도메인 테스트 코드 작성
  - KBO 도메인에 DDD 적용

**2022-07-10**
  - 메모리 누수로 인한 서버 다운 문제 수정

**2022-06-27**
  - LCK 도메인 개발 완료 및 서비스 배포

**2022-06-14**
  - KBO 도메인 개발 완료 및 서비스 배포

# 서버 마이그레이션
## 마이그레이션 결정 이유
- LCK 관련 서비스 업데이트 후 EC2 서버가 지속적으로 다운되는 현상이 발생했지만 원인을 찾지 못해 낮은 성능의 EC2 서버가 버티지 못하는 것으로 추정. 실제로 애플리케이션 실행 시 메모리 스왑 없이는 돌아가지 않는 상황
- AWS 프리티어가 끝나는 7월 이후 `AWS Ligthsail` 과 같은 가상 서버로 이전할 계획을 가지고 있어 DB도 함께 서버에서 사용해야되는 상황이기 때문에 무거운 SpringBoot 기반 메인 서버와 Express 기반 크롤링 서버에 DB 까지 하나의 인스턴스에 올려야하는 상황이기에 모든 기능을 Express 기반으로 마이그레이션 하기로 결정하고 프로젝트 진행

## 마이그레이션 결과 및 장애 원인
- EC2 서버의 성능은 1 Core, 1GB Memory 의 t2.micro
- 애플리케이션 실행시 메모리 부족으로 인해 메모리 스왑없이 돌아가지 않았던 기존 프로젝트와 달리 기능 통합 및 마이그레이션을 완료한 현재 프로젝트는 메모리 스왑 없이 약350MB 가량의 메모리 여유 공간을 가짐
- 마이그레이션 완료후 메모리는 여유가 생겼지만 여전히 서버가 다운되는 현상 발생. 메모리 사용 상황을 보니 애플리케이션 실행 초기보다 더 많은 메모리를 사용하는 것이 확인. 하여 메모리 사용 프로세스 확인 해보니 여러개의 크롬 프로세스가 메모리를 점유하는 것을 확인
- 결국 장애 원인은 `puppeteer` 를 사용해 크롤링 후 크롬 브라우저의 메모리를 해제하지 않아 메모리 누수 발생했기 때문으로 확인. 결국 크롤링 후 브라우저 메모리 해제 메소드를 호출 하는 것으로  문제 해결

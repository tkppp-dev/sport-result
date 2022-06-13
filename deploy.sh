#!bin/bash

BASE_PATH = /home/ec2-user/sport-result
CRAWLING_PATH = /home/ec2-user/sport-result/crawling-server
BACKEND_PATH = /home/ec2-user/sport-result/backend
BUILD_PATH = $BACKEND_PATH/build/libs

# 변경 사항 받아오기
cd $BASE_PATH
echo "GIT PULL"
git pull

# 서버가 실행 중이면 종료
NODE_PID = $(pgrep -f node)
if [ -z "$NODE_PID" ]; then
    echo "현재 크롤링 서버 동작 X"
else
    echo "크롤링 서버 중단"
    pm2 kill
fi

BACKEND_PID = $(pgep -f java)
if [ -z "$BACKEND_PID" ]; then
    echo "현재 메인 서버 동작 X"
else
    echo "메인 서버 중단"
    kill -9 $BACKEND_PID
fi

# 크롤링 서버 배포
cd $CRAWLING_PATH
echo "크롤링 서버 의존성 확인"
npm install

echo "크롤링 서버 배포"
pm2 start $CRAWLING_PATH/app.js

NEW_NODE_PID = $(pgrep -f node)
if [ -z "$NEW_NODE_PID" ]; then
    echo "크롤링 서버 배포 실패"
else
    echo "크롤링 서버 배포 성공"
fi

# 메인 서버 배포
cd $BACKEND_PATH
echo "메인 서버 빌드"
rm -rf BUILD_PATH
./gradlew build

BUILD_FILE = $(find $BUILD_PATH -type f -name '*SNAPSHOT.jar' | grep *.jar)
if [ -z $BUILD_FILE ]; then
    echo "메인 서버 빌드 실패"
else
    echo "메인 서버 빌드 성공"
    echo "메인 서버 배포"
    nohup java -jar $BUILD_FILE /dev/null &

    NEW_BACKEND_PID = $(pgrep -f java)
    if [ -z $NEW_BACKEND_PID ]; then
        echo "메인 서버 배포 실패"
    else
        echo "메인 서버 배포 성공"
    fi
fi


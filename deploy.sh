#!/bin/bash

BASE_PATH=/home/ec2-user/sport-result/node-backend

# 변경 사항 받아오기
cd $BASE_PATH
echo "GIT PULL"
git pull

# 서버가 실행 중이면 종료
NODE_PID=$(pgrep -f ts-node)
if [ -z "$NODE_PID" ]; then
    echo "메인 서버 동작 X"
else
    pm2 kill
    echo "PID [$NODE_PID] - 메인 서버 중단"
fi

# 메인 서버 배포
cd $MAIN_PATH
echo "메인 서버 의존성 확인"
npm install

echo "메인 서버 배포 시작"
npm start

sleep 1
NEW_NODE_PID=$(pgrep -f ts-node)
if [ -z $NEW_NODE_PID ]; then
    echo "메인 서버 배포 실패"
else
    echo "PID [$NEW_NODE_PID] - 메인 서버 배포 성공"
fi
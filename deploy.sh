#!/bin/bash

BASE_PATH=/home/ec2-user/sport-result
BACKEND_PATH=$BASE_PATH/node-backend

# 변경 사항 받아오기
cd $BASE_PATH
echo "GIT PULL"
git pull

# 서버가 실행 중이면 종료
echo "[PM2] 프로세스 매니저 종료"
pm2 kill


# 메인 서버 배포
cd $BACKEND_PATH
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
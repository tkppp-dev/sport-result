"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamCode = exports.teamEnum = exports.matchProgressEnum = void 0;
exports.matchProgressEnum = ['1회초', "1회말", "2회초", "2회말",
    "3회초", "3회말", "4회초", "4회말", "5회초", "5회말", "6회초", "6회말", "7회초", "7회말", "8회초",
    "8회말", "9회초", "9회말", "10회초", "10회말", "11회초", "11회말", "12회초", "12회말", "경기전",
    "종료", "경기취소"];
exports.teamEnum = ['삼성', 'SSG', '키움', '롯데', 'LG', '한화', 'NC', '두산', 'KT', '기아'];
var TeamCode;
(function (TeamCode) {
    TeamCode["\uC0BC\uC131"] = "SS";
    TeamCode["SSG"] = "SK";
    TeamCode["\uD0A4\uC6C0"] = "WO";
    TeamCode["\uB86F\uB370"] = "LT";
    TeamCode["LG"] = "LG";
    TeamCode["\uD55C\uD654"] = "HH";
    TeamCode["NC"] = "NC";
    TeamCode["\uB450\uC0B0"] = "OB";
    TeamCode["\uAE30\uC544"] = "HT";
    TeamCode["KT"] = "KT";
})(TeamCode || (TeamCode = {}));
function getTeamCode(team) {
    return TeamCode[team];
}
exports.getTeamCode = getTeamCode;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlingKboSchedule = exports.crawlingKboTeamRanking = exports.crawlingKboMatchDetail = void 0;
const date_1 = require("@/utils/date");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
function crawlingKboMatchDetail(next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = 'https://sports.news.naver.com/kbaseball/index';
            const html = yield axios_1.default.get(url);
            const $ = cheerio.load(html.data);
            const matches = $('#_tab_box_kbo .hmb_list ul').children()
                .map((idx, node) => {
                const home = $(node).find('.vs_list1 .inner .name').text();
                const homeScore = $(node).find('.vs_list1 .inner .score').text().trim();
                const away = $(node).find('.vs_list2 .inner .name').text();
                const awayScore = $(node).find('.vs_list2 .inner .score').text().trim();
                const matchProgress = $(node).find('.state .inner em').text();
                return {
                    home,
                    away,
                    homeScore: homeScore === '' ? 0 : parseInt(homeScore),
                    awayScore: awayScore === '' ? 0 : parseInt(awayScore),
                    matchProgress: matchProgress.split(':').length > 1 ? '경기전' : matchProgress
                };
            }).toArray();
            return matches;
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    });
}
exports.crawlingKboMatchDetail = crawlingKboMatchDetail;
function crawlingKboTeamRanking(next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = 'https://sports.news.naver.com/kbaseball/index';
            const html = yield axios_1.default.get(url);
            const $ = cheerio.load(html.data);
            const teamRankHtml = $('#rank_template1').children();
            const rankData = $(teamRankHtml).find('.kbo tbody').children()
                .map((idx, node) => {
                const name = $(node).find('.name').text();
                const played = $(node).find('td:nth-child(3) span').text();
                const win = $(node).find('td:nth-child(4) span').text();
                const draw = $(node).find('td:nth-child(5) span').text();
                const defeat = $(node).find('td:nth-child(6) span').text();
                const winRate = $(node).find('td:nth-child(7) span').text();
                const gameDiff = $(node).find('td:nth-child(8) span').text();
                return {
                    rank: idx + 1,
                    name,
                    played: parseInt(played),
                    win: parseInt(win),
                    draw: parseInt(draw),
                    defeat: parseInt(defeat),
                    winRate: parseFloat(winRate),
                    gameDiff: parseFloat(gameDiff)
                };
            }).toArray();
            return rankData;
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    });
}
exports.crawlingKboTeamRanking = crawlingKboTeamRanking;
function crawlingKboSchedule(year, month, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://sports.news.naver.com/kbaseball/schedule/index?month=${(0, date_1.parseMonthString)(month)}&year=${year}`;
            const html = yield axios_1.default.get(url);
            const $ = cheerio.load(html.data);
            const matchSchedule = $('#calendarWrap')
                .children()
                .map((i, node) => {
                const matchDate = [year, month, i + 1];
                const matchInfo = $(node).find('div table tbody').children()
                    .map((idx, tr) => {
                    let startTime = $(tr).find('.td_hour').text();
                    if (startTime === '-')
                        return;
                    const home = $(tr).find('.team_lft').text();
                    const away = $(tr).find('.team_rgt').text();
                    let score = $(tr).find('.td_score').text();
                    let matchProgress, homeScore = 0, awayScore = 0;
                    if ($(tr).find('.suspended').text() == '경기취소') {
                        matchProgress = '경기취소';
                    }
                    else {
                        if (score == 'VS') {
                            matchProgress = '경기전';
                        }
                        else {
                            const temp = score.split(':');
                            matchProgress = '종료';
                            homeScore = parseInt(temp[0]);
                            awayScore = parseInt(temp[1]);
                        }
                    }
                    return {
                        startTime: startTime.split(':'),
                        home,
                        away,
                        matchProgress,
                        homeScore,
                        awayScore,
                    };
                }).toArray();
                return {
                    matchDate,
                    matchInfo,
                };
            }).toArray();
            return matchSchedule;
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    });
}
exports.crawlingKboSchedule = crawlingKboSchedule;

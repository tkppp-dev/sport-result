"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayMatchPatchReqDto = void 0;
class DayMatchPatchReqDto {
    constructor(body) {
        this.home = body.home;
        this.away = body.away;
        this.homeScore = body.homeScore;
        this.awayScore = body.awayScore;
        this.matchProgress = body.matchProgress;
    }
}
exports.DayMatchPatchReqDto = DayMatchPatchReqDto;

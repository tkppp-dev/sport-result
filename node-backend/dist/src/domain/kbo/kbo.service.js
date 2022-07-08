"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchKboMatch = void 0;
const date_1 = require("@/utils/date");
const kboMatch_1 = require("./kboMatch");
function patchKboMatch(dtos) {
    return __awaiter(this, void 0, void 0, function* () {
        const matches = yield kboMatch_1.KboMatch.findBy({ matchDate: (0, date_1.localDate)() });
        for (let match of matches) {
            if (match.matchProgress === '경기취소' || match.matchProgress === '종료') {
                continue;
            }
            else {
                for (let dto of dtos) {
                    if (dto.home == match.home && dto.away == match.away) {
                        match.homeScore = dto.homeScore;
                        match.awayScore = dto.awayScore;
                        match.matchProgress = dto.matchProgress;
                        yield kboMatch_1.KboMatch.save(match);
                        break;
                    }
                }
            }
        }
    });
}
exports.patchKboMatch = patchKboMatch;

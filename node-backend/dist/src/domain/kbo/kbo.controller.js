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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loggers_1 = require("@/utils/loggers");
const kbo_crawling_1 = require("./kbo.crawling");
const kbo_service_1 = require("./kbo.service");
const kbo_dto_1 = require("./kbo.dto");
const router = express_1.default.Router();
const logger = (0, loggers_1.getLogger)('KBO_ROUTE');
router.get('/day', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        throw new Error('Throw Error!');
    }
    catch (err) {
        next(err);
    }
}));
router.put('/day', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req.body instanceof (Array))) {
        next(new Error('Express.Request.body: Type mismatched'));
    }
    else {
        const dtos = req.body.map(dto => new kbo_dto_1.DayMatchPatchReqDto(dto));
        yield (0, kbo_service_1.patchKboMatch)(dtos);
    }
}));
router.get('/schedule', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);
    const result = yield (0, kbo_crawling_1.crawlingKboSchedule)(year, month, next);
    res.json(result);
}));
exports.default = router;

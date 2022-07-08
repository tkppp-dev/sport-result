"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KboMatch = void 0;
const typeorm_1 = require("typeorm");
const kbo_utils_1 = require("./kbo.utils");
let KboMatch = class KboMatch extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KboMatch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], KboMatch.prototype, "matchDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: false }),
    __metadata("design:type", Date)
], KboMatch.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: kbo_utils_1.matchProgressEnum,
        nullable: false,
    }),
    __metadata("design:type", String)
], KboMatch.prototype, "matchProgress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: kbo_utils_1.teamEnum,
        nullable: false,
    }),
    __metadata("design:type", String)
], KboMatch.prototype, "home", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: kbo_utils_1.teamEnum,
        nullable: false,
    }),
    __metadata("design:type", String)
], KboMatch.prototype, "away", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
        nullable: false,
    }),
    __metadata("design:type", Number)
], KboMatch.prototype, "homeScore", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
        nullable: false,
    }),
    __metadata("design:type", Number)
], KboMatch.prototype, "awayScore", void 0);
KboMatch = __decorate([
    (0, typeorm_1.Entity)()
], KboMatch);
exports.KboMatch = KboMatch;

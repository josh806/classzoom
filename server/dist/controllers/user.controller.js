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
exports.createUser = void 0;
const database_1 = require("../database");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Creating user');
    const { firstName, lastName, email, username, student, schoolId } = req.body;
    try {
        const newUser = yield database_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                username,
                student,
                schoolId
            }
        });
        res.status(201);
        res.send(newUser);
    }
    catch (error) {
        console.log(error);
        res.status(300);
    }
});
exports.createUser = createUser;
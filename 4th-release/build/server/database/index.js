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
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
class Database {
    constructor() {
        this.root = `./data`;
        this.data = new Map();
        const dataTables = fs_1.default.readdirSync(this.root);
        dataTables.forEach(dataTable => {
            const table = new Map();
            this.data.set(dataTable, table);
            dataTable = `${this.root}/${dataTable}`;
            const tableFiles = fs_1.default.readdirSync(dataTable);
            tableFiles.forEach(tableFile => {
                const fileText = fs_1.default.readFileSync(`${dataTable}/${tableFile}`, 'utf8');
                const obj = JSON.parse(fileText);
                table.set(obj.id, obj);
            });
        });
    }
    table(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.data.has(name) ? this.data.get(name) : null;
        });
    }
    list(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.table(table);
            return t ? Array(...t.values()) : [];
        });
    }
    get(table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data.has(table))
                return this.data.get(table).get(id);
            else
                return undefined;
        });
    }
    select(table, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const array = yield this.list(table);
            //console.log(`Array ${table} \n`, array);
            //const atts = Object.keys(attributes);
            return array.filter(element => {
                for (const key in attributes) {
                    if (element[key] != attributes[key])
                        return false;
                }
                return true;
            }) || [];
        });
    }
    insert(table, object) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            object.id = id;
            if (!this.data.has(table)) {
                this.data.set(table, new Map());
            }
            this.data.get(table).set(id, object);
            const p = `${this.root}/${table}`;
            if (!fs_1.default.existsSync(p)) {
                promises_1.default.mkdir(p);
            }
            promises_1.default.writeFile(`${p}/${id}.json`, JSON.stringify(object, null, '\t'));
            return object;
        });
    }
    update(table, id, info) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.data.has(table)) {
                this.data.set(table, new Map());
            }
            const obj = yield this.get(table, id);
            for (const k in info) {
                obj[k] = info[k];
            }
            const p = `${this.root}/${table}`;
            if (!fs_1.default.existsSync(p)) {
                promises_1.default.mkdir(p);
            }
            promises_1.default.writeFile(`${p}/${id}.json`, JSON.stringify(obj, null, '\t'));
            return obj;
        });
    }
    remove(table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.table(table);
            if (t) {
                t.delete(id);
            }
            const p = `${this.root}/${table}`;
            promises_1.default.rm(`${p}/${id}.json`);
        });
    }
}
exports.default = new Database();

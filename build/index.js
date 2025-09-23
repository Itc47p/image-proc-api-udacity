var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
var app = express();
var port = 3000;
app.use(express.static('images'));
app.get("/api/filename={}", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var width, height, color, imgPLacholder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                width = parseInt(req.query.width) || 300;
                height = parseInt(req.query.height) || 300;
                color = req.query.color || 'grey';
                return [4 /*yield*/, sharp({
                        create: {
                            width: width,
                            height: height,
                            channels: 4,
                            background: color
                        }
                    })
                        .png()
                        .toBuffer()];
            case 1:
                imgPLacholder = _a.sent();
                res.set('Content-Type', 'image/png');
                res.send(imgPLacholder);
                return [2 /*return*/];
        }
    });
}); });
app.get("/api/action/resize", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, widthParam, heightParam, inputPath, outputPath, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = req.query.fileName;
                widthParam = parseInt(req.query.width);
                heightParam = parseInt(req.query.height);
                console.log("CALLING RESIZE API");
                console.log("RESIZE PARAMS:", fileName, widthParam, heightParam);
                if (!fileName || !widthParam || !heightParam) {
                    return [2 /*return*/, res.status(400).send('Missing required query parameters: fileName, width, height')];
                }
                ;
                inputPath = path.join(__dirname, 'images', fileName);
                outputPath = path.join(__dirname, 'images', 'resized', "".concat(path.parse(fileName).name, "_").concat(widthParam, "x").concat(heightParam).concat(path.parse(fileName).ext));
                if (!fs.existsSync(inputPath)) {
                    return [2 /*return*/, res.status(404).send('File not found')];
                }
                if (fs.existsSync(outputPath)) {
                    return [2 /*return*/, res.sendFile(outputPath)];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sharp(inputPath)
                        .resize(widthParam, heightParam)
                        .toFile(outputPath)];
            case 2:
                _a.sent();
                res.sendFile(outputPath);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).send('Error processing image');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
var Greeting = "Hello User";
console.log(Greeting);
//# sourceMappingURL=index.js.map
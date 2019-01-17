var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
/**
 * 主游戏入口
 */
var guess;
(function (guess) {
    var BaseWindow = (function (_super) {
        __extends(BaseWindow, _super);
        function BaseWindow(pkgName, windowName) {
            if (pkgName === void 0) { pkgName = "guess"; }
            var _this = _super.call(this) || this;
            var self = _this;
            self.registerComponents(); // 要在窗体创建(initUI)之前
            self.initUI(pkgName, windowName); // UI初始化
            self.addEventListeners(); // 事件监听
            return _this;
        }
        // 释放
        BaseWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.removeEventListeners();
            utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
        };
        BaseWindow.prototype.initUI = function (pkgName, windowName) {
            var self = this;
            if (!windowName || windowName == "") {
                windowName = egret.getQualifiedClassName(self);
                if (windowName.indexOf(".") != -1)
                    windowName = windowName.split(".")[1];
            }
            self.contentPane = fairygui.UIPackage.createObject(pkgName, windowName).asCom;
        };
        BaseWindow.prototype.addEventListeners = function () {
            var self = this;
            utils.StageUtils.addEventListener(egret.Event.RESIZE, self.setResolution, self); // 监听屏幕大小改变
        };
        BaseWindow.prototype.removeEventListeners = function () {
            var self = this;
            utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
        };
        /**
         * 注册组件的拓展类
         */
        BaseWindow.prototype.registerComponents = function () {
        };
        BaseWindow.prototype.registerComponent = function (compName, userClass, pkgName) {
            var url = fairygui.UIPackage.getItemURL(pkgName, compName);
            fairygui.UIObjectFactory.setPackageItemExtension(url, userClass);
        };
        /**
         * 初始化完成
         */
        BaseWindow.prototype.onInit = function () {
            console.log("onInit");
        };
        /**
         * 显示完成
         */
        BaseWindow.prototype.onShown = function () {
            console.log("onShown");
        };
        // 动态调整窗口分辨率
        BaseWindow.prototype.setResolution = function () {
            var self = this;
            self.height = utils.StageUtils.stageHeight;
            self.width = utils.StageUtils.stageWidth;
        };
        return BaseWindow;
    }(fairygui.Window));
    guess.BaseWindow = BaseWindow;
    __reflect(BaseWindow.prototype, "guess.BaseWindow");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var WordItem = (function (_super) {
        __extends(WordItem, _super);
        function WordItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WordItem.prototype.constructFromResource = function () {
            _super.prototype.constructFromResource.call(this);
            var self = this;
            self.txtChar = self.getChild("txtChar").asTextField;
            self.colorMask = self.getChild("color").asGraph;
        };
        Object.defineProperty(WordItem.prototype, "word", {
            get: function () {
                return this.txtChar.text;
            },
            enumerable: true,
            configurable: true
        });
        WordItem.prototype.setChar = function (world) {
            var self = this;
            self.txtChar.text = world;
            self.show();
        };
        WordItem.prototype.hide = function () {
            var self = this;
            self.txtChar.alpha = 0;
            self.removeColorAni();
        };
        WordItem.prototype.show = function () {
            var self = this;
            self.txtChar.alpha = 1;
        };
        WordItem.prototype.isEmpty = function () {
            return this.txtChar.text == "" || this.txtChar.alpha == 0;
        };
        WordItem.prototype.showColorAni = function (color) {
            if (color === void 0) { color = -1; }
            var self = this;
            if (color >= 0)
                self.colorMask.color = color;
            self.colorMask.alpha = 0;
            egret.Tween.get(self.colorMask, { loop: true }).to({ alpha: 1 }, 500, egret.Ease.sineInOut).to({ alpha: 0 }, 500, egret.Ease.sineInOut);
        };
        WordItem.prototype.removeColorAni = function () {
            var self = this;
            self.colorMask.alpha = 0;
            egret.Tween.removeTweens(self.colorMask);
        };
        return WordItem;
    }(fairygui.GComponent));
    guess.WordItem = WordItem;
    __reflect(WordItem.prototype, "guess.WordItem");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var LackGoldWindow = (function (_super) {
        __extends(LackGoldWindow, _super);
        function LackGoldWindow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // 释放
        LackGoldWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnTask.removeClickListener(self.onbtnTask, self);
            self.btnClose.removeClickListener(self.onClose, self);
        };
        LackGoldWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "LackGoldWindow").asCom;
        };
        /**
         * 初始化完成
         */
        LackGoldWindow.prototype.onInit = function () {
            var self = this;
            self.btnTask = self.contentPane.getChild("btnTask").asButton;
            self.btnTask.addClickListener(self.onbtnTask, self);
            self.btnClose = self.contentPane.getChild("btnClose").asButton;
            self.btnClose.addClickListener(self.onClose, self);
            self.txtTip = self.contentPane.getChild("txtTip").asTextField;
        };
        LackGoldWindow.prototype.initData = function () {
            var self = this;
            if (utils.Singleton.get(guess.AdMgr).adEnable)
                self.txtTip.text = "观看视频广告可解锁答案";
            else
                self.txtTip.text = "分享到群可解锁答案";
        };
        LackGoldWindow.prototype.onbtnTask = function (e) {
            var self = this;
            if (utils.Singleton.get(guess.AdMgr).adEnable) {
                utils.Singleton.get(guess.AdMgr).watchAd(function () {
                    self.hide();
                    utils.EventDispatcher.getInstance().dispatchEvent("watchAdOk");
                }, function () {
                });
            }
            else {
                utils.EventDispatcher.getInstance().dispatchEvent("shareGroupOk");
                self.hide();
            }
        };
        LackGoldWindow.prototype.onClose = function (e) {
            var self = this;
            self.hide();
        };
        return LackGoldWindow;
    }(guess.BaseWindow));
    guess.LackGoldWindow = LackGoldWindow;
    __reflect(LackGoldWindow.prototype, "guess.LackGoldWindow");
})(guess || (guess = {}));
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        if (platform.isRunInWX())
            wx.loadFont("resource/RubikOne-Regular.ttf");
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
            utils.EventDispatcher.getInstance().dispatchEvent('onAppPause');
            //console.log("pause");
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, setting, userInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, platform.login()];
                    case 2:
                        _b.sent();
                        // 读取设备信息
                        _a = Main;
                        return [4 /*yield*/, platform.getSystemInfo()];
                    case 3:
                        // 读取设备信息
                        _a.systemInfo = _b.sent();
                        return [4 /*yield*/, platform.getSetting()];
                    case 4:
                        setting = _b.sent();
                        Main.isScopeUserInfo = setting["authSetting"]["scope.userInfo"];
                        this.createGameScene();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 5:
                        userInfo = _b.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        //加载排行榜资源
                        platform.openDataContext && platform.openDataContext.postMessage({
                            command: "loadRes"
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        if (!Main.isScopeUserInfo && platform.isRunInWX()) {
            var btnWidth = Main.systemInfo.windowWidth / utils.StageUtils.stageWidth * 376;
            var btnHeight = Main.systemInfo.windowHeight / utils.StageUtils.stageHeight * 178;
            Main.userInfoBtn = wx.createUserInfoButton({
                type: 'image',
                image: 'resource/assets/startBtn.png',
                style: {
                    left: Main.systemInfo.windowWidth * 0.5 - btnWidth * 0.5,
                    top: Main.systemInfo.windowHeight * 0.5,
                    width: btnWidth,
                    height: btnHeight,
                }
            });
            Main.userInfoBtn.onTap(function (res) {
                if (res.errMsg == "getUserInfo:ok") {
                    Main.isScopeUserInfo = true;
                    Main.userInfoBtn.hide();
                    utils.EventDispatcher.getInstance().dispatchEvent("onClickStartBtn");
                }
            });
        }
        fairygui.UIPackage.addPackage("guess");
        this.stage.addChild(fairygui.GRoot.inst.displayObject);
        this.stage.removeChild(this);
        var wnd = new guess.MainWindow("guess");
        wnd.show();
        if (platform.isRunInWX()) {
            wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                return {
                    title: '转发标题'
                };
            });
        }
        // 显示转发分享菜单
        //wx.showShareMenu();
        //调用广告
        //  wx.createBannerAd({ adUnitId: "adunit-549b2e8b53ad8e21", style: { left: 0, top: 1280 - 150, width: 720, height: 150} })
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    DebugPlatform.prototype.isRunInWX = function () {
        return false;
    };
    DebugPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DebugPlatform.prototype.getSetting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var setting;
            return __generator(this, function (_a) {
                setting = {};
                setting["authSetting"] = {};
                return [2 /*return*/, setting];
            });
        });
    };
    DebugPlatform.prototype.getSystemInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
var guess;
(function (guess) {
    var GameMgr = (function () {
        function GameMgr() {
        }
        GameMgr.prototype.onCreate = function () {
            var self = this;
            self.data = {};
            self.data.gold = 0;
            self.data.reachLevel = 1;
            self.data.passLevels = [];
            self.data.money = 0;
            self.data.toDayWatchAdCount = 0;
            self.testMgr = new guess.TestMgr();
        };
        GameMgr.prototype.onDestroy = function () {
            var self = this;
            self.testMgr.dispose();
            self.testMgr = null;
        };
        GameMgr.prototype.startPlay = function (lv) {
            var self = this;
            lv = lv || self.getReachMaxLevel();
            if (!self.checkStage(lv))
                return;
            self.testMgr.setCurTest(lv);
        };
        GameMgr.prototype.checkStage = function (lv) {
            var self = this;
            if (lv < 1 || lv > 200)
                return false;
            return self.canStartLevel(lv);
        };
        GameMgr.prototype.nextTest = function () {
            var self = this;
            var curLv = self.testMgr.curTest.level;
            // 存储达到的最高关卡
            if (self.isFirstPassLevel(curLv))
                self.data.passLevels.push(curLv);
            self.testMgr.setCurTest(curLv + 1);
        };
        // 是否第一次达到
        GameMgr.prototype.isFirstPassLevel = function (lv) {
            var self = this;
            return self.data.passLevels.indexOf(lv) == -1;
        };
        // 是否可以开始某关
        GameMgr.prototype.canStartLevel = function (lv) {
            var self = this;
            if (lv == 1)
                return true;
            // 上一关必须通过
            return self.data.passLevels.indexOf(lv - 1) != -1;
        };
        GameMgr.prototype.getReachMaxLevel = function () {
            var self = this;
            var curMaxLv = self.data.passLevels[self.data.passLevels.length - 1] || 0;
            return curMaxLv + 1;
        };
        GameMgr.prototype.modifyGold = function (count) {
            var self = this;
            count = count || 0;
            if (count == 0)
                return;
            self.data.gold += count;
            utils.EventDispatcher.getInstance().dispatchEvent("goldChanged");
        };
        GameMgr.prototype.costGold = function (count) {
            var self = this;
            if (count <= 0)
                return;
            if (self.data.gold < count)
                return;
            self.modifyGold(-count);
        };
        GameMgr.prototype.checkGoldEnough = function (count) {
            var self = this;
            return self.data.gold >= count;
        };
        GameMgr.prototype.modifyMoney = function (count) {
            var self = this;
            count = count || 0;
            if (count == 0)
                return;
            self.data.money += count;
            utils.EventDispatcher.getInstance().dispatchEvent("moneyChanged");
        };
        // 转盘抽奖
        GameMgr.prototype.draw = function () {
            var self = this;
            // TODO 判断每日抽奖上限
            return self.drawOnce();
        };
        // 抽一次
        GameMgr.prototype.drawOnce = function () {
            var items = guess.GameCfg.getCfg().LotteryCfg;
            var totalWeight = 0;
            for (var i = 0; i < items.length; i++)
                totalWeight += items[i].weight;
            var rand = Math.random() * totalWeight;
            var result;
            for (var i = 0; i < items.length; i++) {
                var info = items[i];
                if (info.weight <= 0)
                    continue;
                if (rand <= info.weight) {
                    result = info;
                    break;
                }
                rand -= info.weight;
            }
            return result;
        };
        GameMgr.prototype.drawTest = function (testCount) {
            var self = this;
            var results = {};
            for (var i = 0; i < testCount; i++) {
                var tmp = self.drawOnce();
                if (results[tmp.idx])
                    results[tmp.idx]++;
                else
                    results[tmp.idx] = 1;
            }
            console.log("\u62BD\u5956" + testCount + "\u6B21\u7684\u7ED3\u679C\u5982\u4E0B:");
            for (var i = 0; i < guess.GameCfg.getCfg().LotteryCfg.length; i++) {
                if (results[i])
                    console.log("\u5956\u54C1" + i + ":" + (results[i] || 0) + "\u6B21");
            }
        };
        return GameMgr;
    }());
    guess.GameMgr = GameMgr;
    __reflect(GameMgr.prototype, "guess.GameMgr", ["utils.ISingleton"]);
})(guess || (guess = {}));
var guess;
(function (guess) {
    /**
     * 答题管理
     */
    var TestMgr = (function () {
        function TestMgr() {
        }
        TestMgr.prototype.dispose = function () {
        };
        TestMgr.prototype.setCurTest = function (lv) {
            var self = this;
            self.curTest = self.getTestInfo(lv);
        };
        TestMgr.prototype.getTestInfo = function (lv) {
            var self = this;
            return guess.GameCfg.getTestInfo(lv);
        };
        TestMgr.prototype.checkAnswer = function (answer) {
            var self = this;
            if (!self.curTest)
                return false;
            var right = answer === self.curTest.answer;
            return right;
        };
        return TestMgr;
    }());
    guess.TestMgr = TestMgr;
    __reflect(TestMgr.prototype, "guess.TestMgr");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var AdMgr = (function () {
        function AdMgr() {
        }
        AdMgr.prototype.onCreate = function () {
        };
        AdMgr.prototype.onDestroy = function () {
        };
        AdMgr.prototype.watchAd = function (success, err) {
            var self = this;
            if (!self.adEnable) {
                err("广告不可用！");
                return;
            }
            success();
        };
        Object.defineProperty(AdMgr.prototype, "adEnable", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return AdMgr;
    }());
    guess.AdMgr = AdMgr;
    __reflect(AdMgr.prototype, "guess.AdMgr", ["utils.ISingleton"]);
})(guess || (guess = {}));
var guess;
(function (guess) {
    var CashWindow = (function (_super) {
        __extends(CashWindow, _super);
        function CashWindow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // 释放
        CashWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnClose.removeClickListener(self.onClose, self);
        };
        CashWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "CashWindow").asCom;
        };
        /**
         * 初始化完成
         */
        CashWindow.prototype.onInit = function () {
            var self = this;
            self.txtTip = self.contentPane.getChild("txtTip").asTextField;
            self.btnClose = self.contentPane.getChild("btnClose").asButton;
            self.btnClose.addClickListener(self.onClose, self);
        };
        CashWindow.prototype.initData = function () {
            var self = this;
            var count = utils.Singleton.get(guess.GameMgr).data.money;
            if (count >= guess.GameCfg.getCfg().CashNeedMoney)
                self.txtTip.text = "\u6DFB\u52A0\u5BA2\u670D\u5FAE\u4FE1\uFF1A" + guess.GameCfg.getCfg().OfficialWeChat + "\uFF0C\u5373\u53EF\u63D0\u73B0\u3002";
            else
                self.txtTip.text = "\u9700\u8981\u8FBE\u5230" + guess.GameCfg.getCfg().CashNeedMoney + "\u5143\u624D\u53EF\u63D0\u73B0\u54E6~";
        };
        CashWindow.prototype.onClose = function (e) {
            var self = this;
            self.hide();
        };
        return CashWindow;
    }(guess.BaseWindow));
    guess.CashWindow = CashWindow;
    __reflect(CashWindow.prototype, "guess.CashWindow");
})(guess || (guess = {}));
/**
 * 转盘抽奖界面
 */
var guess;
(function (guess) {
    var DrawWindow = (function (_super) {
        __extends(DrawWindow, _super);
        function DrawWindow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // 释放
        DrawWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnDraw.removeClickListener(self.onBtnDrawClick, self);
            self.btnClose.removeClickListener(self.onBtnClose, self);
        };
        DrawWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "DrawWindow").asCom;
        };
        /**
         * 注册组件的拓展类
         */
        DrawWindow.prototype.registerComponents = function () {
            var self = this;
        };
        /**
         * 初始化完成
         */
        DrawWindow.prototype.onInit = function () {
            var self = this;
            self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
            self.btnDraw.addClickListener(self.onBtnDrawClick, self);
            self.btnClose = self.contentPane.getChild("btnClose").asButton;
            self.btnClose.addClickListener(self.onBtnClose, self);
            self.wheel = self.contentPane.getChild("wheel").asCom;
        };
        DrawWindow.prototype.onBtnDrawClick = function (e) {
            var self = this;
            if (self.isDraw)
                return;
            // TODO console.log("观看广告抽奖~");
            // 模拟观看成功
            var item = utils.Singleton.get(guess.GameMgr).draw();
            console.log("\u606D\u559C\uFF0C\u62BD\u5230\uFF1A" + (item.gifts.money ? '红包' : '金币') + " x" + (item.gifts.money || item.gifts.gold));
            // 获得奖励
            utils.Singleton.get(guess.GameMgr).modifyGold(item.gifts.gold);
            utils.Singleton.get(guess.GameMgr).modifyMoney(item.gifts.money);
            var itemCount = guess.GameCfg.getCfg().LotteryCfg.length;
            var pieceAngle = 360 / itemCount;
            var offsetAngle = 5; // 为了不贴边界
            var angleRange = [item.idx * pieceAngle + offsetAngle, (item.idx + 1) * pieceAngle - offsetAngle];
            var randAngle = Math.floor(angleRange[0] + Math.random() * (angleRange[1] - angleRange[0]));
            var turns = 10; // 转10圈	
            var toAngle = turns * 360 + randAngle;
            self.isDraw = true;
            self.btnClose.enabled = false;
            self.btnDraw.enabled = false;
            egret.Tween.get(self.wheel).set({ rotation: self.wheel.rotation %= 360 })
                .to({ rotation: toAngle - 720 }, 4000, egret.Ease.sineIn)
                .to({ rotation: toAngle }, 3000, egret.Ease.sineOut)
                .call(function () {
                self.isDraw = false;
                self.btnClose.enabled = true;
                self.btnDraw.enabled = true;
            });
        };
        DrawWindow.prototype.initData = function (data) {
            var self = this;
            self.wheel.rotation = 0;
        };
        DrawWindow.prototype.onBtnClose = function (e) {
            var self = this;
            if (self.isDraw)
                return;
            self.hide();
            egret.Tween.removeTweens(self.wheel);
        };
        return DrawWindow;
    }(guess.BaseWindow));
    guess.DrawWindow = DrawWindow;
    __reflect(DrawWindow.prototype, "guess.DrawWindow");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var FirstShareGroupWindow = (function (_super) {
        __extends(FirstShareGroupWindow, _super);
        function FirstShareGroupWindow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // 释放
        FirstShareGroupWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnShare.removeClickListener(self.onbtnShare, self);
            self.btnClose.removeClickListener(self.onClose, self);
        };
        FirstShareGroupWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "FirstShareGroupWindow").asCom;
        };
        /**
         * 初始化完成
         */
        FirstShareGroupWindow.prototype.onInit = function () {
            var self = this;
            self.btnShare = self.contentPane.getChild("btnShare").asButton;
            self.btnShare.addClickListener(self.onbtnShare, self);
            self.btnClose = self.contentPane.getChild("btnClose").asButton;
            self.btnClose.addClickListener(self.onClose, self);
            self.txtGold = self.contentPane.getChild("txtGold").asTextField;
        };
        FirstShareGroupWindow.prototype.initData = function () {
            var self = this;
            self.txtGold.text = "+" + guess.GameCfg.getCfg().FirstShareGroupGold + "\u91D1\u5E01";
        };
        FirstShareGroupWindow.prototype.onbtnShare = function (e) {
            var self = this;
            // 分享到群
            utils.EventDispatcher.getInstance().dispatchEvent("shareGroupOk");
            self.hide();
        };
        FirstShareGroupWindow.prototype.onClose = function (e) {
            var self = this;
            self.hide();
        };
        return FirstShareGroupWindow;
    }(guess.BaseWindow));
    guess.FirstShareGroupWindow = FirstShareGroupWindow;
    __reflect(FirstShareGroupWindow.prototype, "guess.FirstShareGroupWindow");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var GameCfg = (function () {
        function GameCfg() {
        }
        GameCfg.getCfg = function () {
            if (!GameCfg.cfg)
                GameCfg.cfg = RES.getRes('guessConfig_json');
            return GameCfg.cfg;
        };
        GameCfg.getTestCfg = function () {
            if (!GameCfg.testCfg)
                GameCfg.testCfg = RES.getRes('testConfig_json');
            return GameCfg.testCfg;
        };
        GameCfg.getTestInfo = function (lv) {
            return GameCfg.getTestCfg()[lv - 1] || null;
        };
        GameCfg.cfg = null;
        GameCfg.testCfg = null;
        return GameCfg;
    }());
    guess.GameCfg = GameCfg;
    __reflect(GameCfg.prototype, "guess.GameCfg");
})(guess || (guess = {}));
/**
 * 主游戏入口
 */
var guess;
(function (guess) {
    var MainWindow = (function (_super) {
        __extends(MainWindow, _super);
        function MainWindow(pkgName, windowName) {
            var _this = _super.call(this, pkgName, windowName) || this;
            _this.isShowRank = false;
            MainWindow.instance = _this;
            return _this;
        }
        MainWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnStart.removeClickListener(self.onBtnStart, self);
            self.btnStage.removeClickListener(self.onBtnStage, self);
            self.btnDraw.removeClickListener(self.onBtnDraw, self);
            self.btnRank.removeClickListener(self.onBtnRank, self);
            self.btnCloseRank.removeClickListener(self.onBtnRank, self);
            utils.EventDispatcher.getInstance().removeEventListener("startStage", self.onStartStage, self);
            utils.EventDispatcher.getInstance().removeEventListener("onClickStartBtn", self.onBtnStart, self);
        };
        MainWindow.prototype.addEventListeners = function () {
            _super.prototype.addEventListeners.call(this);
            var self = this;
            utils.EventDispatcher.getInstance().addEventListener("startStage", self.onStartStage, self);
        };
        /**
         * 注册组件的拓展类
         */
        MainWindow.prototype.registerComponents = function () {
            var self = this;
        };
        /**
         * 初始化完成
         */
        MainWindow.prototype.onInit = function () {
            _super.prototype.onInit.call(this);
            var self = this;
            var isRunWeb = (platform instanceof DebugPlatform) ? true : false;
            utils.EventDispatcher.getInstance().addEventListener("onClickStartBtn", self.onBtnStart, self);
            self.scopeCtrl = self.contentPane.getController("scopeCtrl");
            self.scopeCtrl.setSelectedIndex(isRunWeb || Main.isScopeUserInfo ? 1 : 0);
            self.btnStart = self.contentPane.getChild("btnStart").asButton;
            self.btnStart.visible = isRunWeb || Main.isScopeUserInfo;
            self.btnStart.addClickListener(self.onBtnStart, self);
            self.btnStage = self.contentPane.getChild("btnStage").asButton;
            self.btnStage.addClickListener(self.onBtnStage, self);
            self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
            self.btnDraw.addClickListener(self.onBtnDraw, self);
            self.btnRank = self.contentPane.getChild("btnRank").asButton;
            self.btnRank.addClickListener(self.onBtnRank, self);
            self.btnCloseRank = self.contentPane.getChild("btnCloseRank").asButton;
            self.btnCloseRank.addClickListener(self.onBtnRank, self);
        };
        MainWindow.prototype.onBtnStart = function (e) {
            var self = this;
            self.scopeCtrl.setSelectedIndex(1);
            self.setBtnStartState();
            self.startPlay();
        };
        MainWindow.prototype.setBtnStartState = function () {
            var self = this;
            var isRunWeb = (platform instanceof DebugPlatform) ? true : false;
            self.btnStart.visible = isRunWeb || Main.isScopeUserInfo;
        };
        MainWindow.prototype.onBtnStage = function (e) {
            var self = this;
            self.showStageWindow();
        };
        MainWindow.prototype.onBtnDraw = function (e) {
            var self = this;
            self.showDrawWindow();
        };
        MainWindow.prototype.onBtnRank = function (e) {
            var self = this;
            self.showOrHideRankWnd();
        };
        MainWindow.prototype.showOrHideRankWnd = function () {
            var self = this;
            if (!platform.isRunInWX())
                return;
            if (!self.isShowRank) {
                Main.userInfoBtn && Main.userInfoBtn.hide();
                //处理遮罩,避免开放域数据影响主域
                self.rankingListMask = new egret.Shape();
                self.rankingListMask.graphics.beginFill(0x000000);
                self.rankingListMask.graphics.drawRect(0, 0, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);
                self.rankingListMask.graphics.endFill();
                self.rankingListMask.alpha = 0.8;
                //设置为true,以免触摸到下面的按钮
                self.rankingListMask.touchEnabled = true;
                self.parent.displayListContainer.addChildAt(self.rankingListMask, 999);
                //显示开放域数据
                self.rankBitmap = platform.openDataContext.createDisplayObject(null, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);
                self.parent.displayListContainer.addChild(self.rankBitmap);
                //让关闭排行榜按钮显示在容器内
                self.btnCloseRank.visible = true;
                self.parent.displayListContainer.addChild(self.btnCloseRank.displayObject);
                //主域向子域发送数据
                self.isShowRank = true;
                platform.openDataContext.postMessage({
                    isRanking: self.isShowRank,
                    text: "egret",
                    year: (new Date()).getFullYear(),
                    command: "open"
                });
            }
            else {
                self.rankBitmap.parent && self.rankBitmap.parent.removeChild(self.rankBitmap);
                self.rankingListMask.parent && self.rankingListMask.parent.removeChild(self.rankingListMask);
                self.isShowRank = false;
                self.btnCloseRank.visible = false;
                (self.testWnd && !self.testWnd.isShowing) && Main.userInfoBtn && Main.userInfoBtn.show();
                platform.openDataContext.postMessage({
                    isRanking: self.isShowRank,
                    text: "egret",
                    year: (new Date()).getFullYear(),
                    command: "close"
                });
            }
        };
        MainWindow.prototype.showStageWindow = function () {
            var self = this;
            if (!self.stageWnd)
                self.stageWnd = new guess.StageWindow("guess");
            self.stageWnd.show();
            self.stageWnd.initData(true);
        };
        MainWindow.prototype.onStartStage = function (lv) {
            var self = this;
            self.startPlay(lv);
        };
        MainWindow.prototype.startPlay = function (lv) {
            var self = this;
            utils.Singleton.get(guess.GameMgr).startPlay(lv);
            self.showTestWindow();
        };
        MainWindow.prototype.showTestWindow = function () {
            var self = this;
            if (!self.testWnd)
                self.testWnd = new guess.TestWindow("guess");
            self.testWnd.show();
            self.testWnd.initData();
        };
        MainWindow.prototype.showRedBagWindow = function (money, title) {
            var self = this;
            if (!self.redbag)
                self.redbag = new guess.RedBagWindow("guess");
            self.redbag.show();
            self.redbag.initData(money || utils.Singleton.get(guess.GameMgr).data.money, title || "您当前共有红包");
        };
        MainWindow.prototype.showDrawWindow = function () {
            var self = this;
            if (!self.drawWnd)
                self.drawWnd = new guess.DrawWindow("guess");
            self.drawWnd.show();
            self.drawWnd.initData({});
        };
        return MainWindow;
    }(guess.BaseWindow));
    guess.MainWindow = MainWindow;
    __reflect(MainWindow.prototype, "guess.MainWindow");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var QuestionPanel = (function (_super) {
        __extends(QuestionPanel, _super);
        function QuestionPanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        QuestionPanel.prototype.constructFromResource = function () {
            _super.prototype.constructFromResource.call(this);
            var self = this;
            self.tip1 = self.getChild("tip1");
            self.tip2 = self.getChild("tip2");
            self.tip3 = self.getChild("tip3");
            self.tip4 = self.getChild("tip4");
        };
        // 初始化题目
        QuestionPanel.prototype.initTest = function (info) {
            var self = this;
            if (!info) {
                self.tip1.initInfo("1", "题库已答完~");
                self.tip2.initInfo("2");
                self.tip3.initInfo("3");
                self.tip4.initInfo("4");
                return;
            }
            self.tip1.initInfo("1", info.tips[0]);
            self.tip2.initInfo("2", info.tips[1]);
            self.tip3.initInfo("3", info.tips[2]);
            self.tip4.initInfo("4", info.tips[3]);
        };
        return QuestionPanel;
    }(fairygui.GComponent));
    guess.QuestionPanel = QuestionPanel;
    __reflect(QuestionPanel.prototype, "guess.QuestionPanel");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var QuestionPanelDM = (function (_super) {
        __extends(QuestionPanelDM, _super);
        function QuestionPanelDM() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        QuestionPanelDM.prototype.constructFromResource = function () {
            _super.prototype.constructFromResource.call(this);
            var self = this;
            self.txtDMTip1 = self.getChild("txtDMTip1").asTextField;
            self.txtDMTip2 = self.getChild("txtDMTip2").asTextField;
            self.txtDMTip3 = self.getChild("txtDMTip3").asTextField;
        };
        // 初始化题目
        QuestionPanelDM.prototype.initTest = function (info) {
            var self = this;
            if (!info) {
                self.txtDMTip1.text = "题库已答完~";
                self.txtDMTip2.text = "";
                self.txtDMTip3.text = "";
                return;
            }
            self.txtDMTip1.text = "" + info.tips[0];
            self.txtDMTip2.text = "" + info.tips[1];
            self.txtDMTip3.text = "" + info.tips[2];
        };
        return QuestionPanelDM;
    }(fairygui.GComponent));
    guess.QuestionPanelDM = QuestionPanelDM;
    __reflect(QuestionPanelDM.prototype, "guess.QuestionPanelDM");
})(guess || (guess = {}));
/**
 * 答题界面
 */
var guess;
(function (guess) {
    var RedBagWindow = (function (_super) {
        __extends(RedBagWindow, _super);
        function RedBagWindow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // 释放
        RedBagWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnContact.removeClickListener(self.onContaceClick, self);
            self.btnClose.removeClickListener(self.onBtnClose, self);
            self.btnDraw.removeClickListener(self.onBtnDraw, self);
        };
        RedBagWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "RedBagWindow").asCom;
        };
        /**
         * 注册组件的拓展类
         */
        RedBagWindow.prototype.registerComponents = function () {
            var self = this;
            self.registerComponent("TipItem", guess.TipItem, "guess");
            self.registerComponent("WordItem", guess.WordItem, "guess");
        };
        /**
         * 初始化完成
         */
        RedBagWindow.prototype.onInit = function () {
            var self = this;
            self.txtMoney = self.contentPane.getChild("txtMoney").asTextField;
            self.txtTip = self.contentPane.getChild("txtTip").asTextField;
            self.txtTitle = self.contentPane.getChild("txtTitle").asTextField;
            self.btnContact = self.contentPane.getChild("btnContact").asButton;
            self.btnContact.addClickListener(self.onContaceClick, self);
            self.btnClose = self.contentPane.getChild("btnClose").asButton;
            self.btnClose.addClickListener(self.onBtnClose, self);
            self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
            self.btnDraw.addClickListener(self.onBtnDraw, self);
        };
        RedBagWindow.prototype.onContaceClick = function (e) {
            var self = this;
            if (!self.cashWnd)
                self.cashWnd = new guess.CashWindow();
            self.cashWnd.show();
            self.cashWnd.initData();
        };
        RedBagWindow.prototype.initData = function (money, title) {
            var self = this;
            self.txtMoney.text = "" + utils.Singleton.get(guess.GameMgr).data.money;
            self.txtTitle.text = title;
            self.txtTip.text = "\u6EE1" + guess.GameCfg.getCfg().CashNeedMoney + "\u5143\u53EF\u4EE5\u63D0\u73B0";
        };
        RedBagWindow.prototype.onBtnDraw = function (e) {
            var self = this;
            self.hide();
            guess.MainWindow.instance.showDrawWindow();
        };
        RedBagWindow.prototype.onBtnClose = function (e) {
            var self = this;
            self.hide();
        };
        RedBagWindow.prototype.onBtnStage = function (e) {
            var self = this;
            guess.MainWindow.instance.showStageWindow();
        };
        return RedBagWindow;
    }(guess.BaseWindow));
    guess.RedBagWindow = RedBagWindow;
    __reflect(RedBagWindow.prototype, "guess.RedBagWindow");
})(guess || (guess = {}));
/**
 * 答题界面
 */
var guess;
(function (guess) {
    var ResultWindow = (function (_super) {
        __extends(ResultWindow, _super);
        function ResultWindow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // 释放
        ResultWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnNext.removeClickListener(self.onBtnNext, self);
            self.btnInvite.removeClickListener(self.onBtnInv, self);
        };
        ResultWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "ResultWindow").asCom;
        };
        /**
         * 注册组件的拓展类
         */
        ResultWindow.prototype.registerComponents = function () {
            var self = this;
            self.registerComponent("TipItem", guess.TipItem, "guess");
            self.registerComponent("WordItem", guess.WordItem, "guess");
        };
        /**
         * 初始化完成
         */
        ResultWindow.prototype.onInit = function () {
            var self = this;
            self.btnNext = self.contentPane.getChild("btnNext").asButton;
            self.btnNext.addClickListener(self.onBtnNext, self);
            self.btnInvite = self.contentPane.getChild("btnInvite").asButton;
            self.btnInvite.addClickListener(self.onBtnInv, self);
            self.rankPre = self.contentPane.getChild("rankPre").asCom;
            self.rankMe = self.contentPane.getChild("rankMe").asCom;
            self.rankNxt = self.contentPane.getChild("rankNxt").asCom;
            self.txtGold = self.contentPane.getChild("txtGold").asTextField;
            self.txtTip = self.contentPane.getChild("txtTip").asTextField;
        };
        ResultWindow.prototype.onShown = function () {
            var self = this;
        };
        ResultWindow.prototype.initData = function (gainGold) {
            var self = this;
            self.txtGold.text = "+" + gainGold + "\u91D1\u5E01";
            self.txtTip.text = gainGold <= 0 ? "(已答对的题不再获得)" : "";
        };
        ResultWindow.prototype.onBtnNext = function (e) {
            var self = this;
            self.hide();
            utils.EventDispatcher.getInstance().dispatchEvent("onNextTest");
        };
        ResultWindow.prototype.onBtnInv = function (e) {
            var self = this;
        };
        return ResultWindow;
    }(guess.BaseWindow));
    guess.ResultWindow = ResultWindow;
    __reflect(ResultWindow.prototype, "guess.ResultWindow");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var StageItem = (function (_super) {
        __extends(StageItem, _super);
        function StageItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StageItem.prototype.constructFromResource = function () {
            _super.prototype.constructFromResource.call(this);
            var self = this;
            self.txtLv = self.getChild("txtLv").asTextField;
            self.lockCtrl = self.getController("lockCtrl");
            self.hasRedbagCtrl = self.getController("hasRedbagCtrl");
        };
        StageItem.prototype.initInfo = function (lv, lock) {
            var self = this;
            self.level = lv;
            self.txtLv.text = lv + "";
            var testInfo = guess.GameCfg.getTestInfo(self.level);
            self.lockCtrl.setSelectedIndex((lock || !testInfo) ? 1 : 0);
            self.hasRedbagCtrl.setSelectedIndex((testInfo && testInfo.money >= 0) ? 1 : 0);
        };
        return StageItem;
    }(fairygui.GComponent));
    guess.StageItem = StageItem;
    __reflect(StageItem.prototype, "guess.StageItem");
})(guess || (guess = {}));
/**
 * 关卡选择界面
 */
var guess;
(function (guess) {
    var StageWindow = (function (_super) {
        __extends(StageWindow, _super);
        function StageWindow() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pageIdx = 0;
            return _this;
        }
        // 释放
        StageWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnClose.removeClickListener(self.onBtnClose, self);
            self.btnPre.addClickListener(self.onBtnPre, self);
            self.btnNext.addClickListener(self.onBtnNext, self);
            self.lstLevel.removeEventListener(fairygui.ItemEvent.CLICK, self.onLevelLstClick, self);
        };
        StageWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "StageWindow").asCom;
        };
        /**
         * 注册组件的拓展类
         */
        StageWindow.prototype.registerComponents = function () {
            var self = this;
            self.registerComponent("StageItem", guess.StageItem, "guess");
        };
        /**
         * 初始化完成
         */
        StageWindow.prototype.onInit = function () {
            var self = this;
            self.btnClose = self.contentPane.getChild("btnClose").asButton;
            self.btnClose.addClickListener(self.onBtnClose, self);
            self.btnPre = self.contentPane.getChild("btnPre").asButton;
            self.btnPre.addClickListener(self.onBtnPre, self);
            self.btnNext = self.contentPane.getChild("btnNext").asButton;
            self.btnNext.addClickListener(self.onBtnNext, self);
            self.lstLevel = self.contentPane.getChild("lstLevel").asList;
            self.lstLevel.addEventListener(fairygui.ItemEvent.CLICK, self.onLevelLstClick, self);
            self.txtRank = self.contentPane.getChild("txtRank").asTextField;
        };
        StageWindow.prototype.onLevelLstClick = function (e) {
            var self = this;
            var item = e.itemObject;
            if (!utils.Singleton.get(guess.GameMgr).canStartLevel(item.level)) {
                return console.log("请先通过上一关！");
            }
            utils.EventDispatcher.getInstance().dispatchEvent("startStage", item.level);
            self.hide();
        };
        StageWindow.prototype.prePage = function () {
            var self = this;
            self.btnNext.enabled = true;
            self.pageIdx--;
            self.initData();
        };
        StageWindow.prototype.nextPage = function () {
            var self = this;
            self.btnPre.enabled = true;
            self.pageIdx++;
            self.initData();
        };
        StageWindow.prototype.initData = function (reset) {
            var self = this;
            if (reset)
                self.pageIdx = 0;
            var maxLv = utils.Singleton.get(guess.GameMgr).getReachMaxLevel();
            var pageIdx = self.pageIdx || Math.floor(maxLv / 20);
            var level = pageIdx * 20 + 1;
            for (var i = 0, len = self.lstLevel.numItems; i < len; i++) {
                var item = self.lstLevel.getChildAt(i);
                item.initInfo(level, level > maxLv);
                level++;
            }
            self.txtRank.text = self.getRankDesc(maxLv);
            self.setPageBtnState();
        };
        StageWindow.prototype.setPageBtnState = function () {
            var self = this;
            if (self.pageIdx <= 0) {
                self.pageIdx = 0;
                self.btnPre.enabled = false;
            }
            if (self.pageIdx >= 9) {
                self.pageIdx = 9;
                self.btnNext.enabled = false;
            }
        };
        StageWindow.prototype.getRankDesc = function (reachLv) {
            var self = this;
            var stage = reachLv / 40; // 40关一个段位
            // 大段位名
            var stageName = "小学生";
            if (stage > 1)
                stageName = "中等生";
            if (stage > 2)
                stageName = "优等生";
            if (stage > 3)
                stageName = "学霸";
            if (stage > 4)
                stageName = "超级学霸";
            // 小段位星数 10关一个小等级
            var star = Math.ceil((reachLv % 40) / 10);
            var desc = "" + stageName + star + "\u661F";
            return desc;
        };
        StageWindow.prototype.onBtnClose = function (e) {
            var self = this;
            self.hide();
        };
        StageWindow.prototype.onBtnPre = function (e) {
            var self = this;
            self.prePage();
        };
        StageWindow.prototype.onBtnNext = function (e) {
            var self = this;
            self.nextPage();
        };
        return StageWindow;
    }(guess.BaseWindow));
    guess.StageWindow = StageWindow;
    __reflect(StageWindow.prototype, "guess.StageWindow");
})(guess || (guess = {}));
/**
 * 答题界面
 */
var guess;
(function (guess) {
    var TestWindow = (function (_super) {
        __extends(TestWindow, _super);
        function TestWindow() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isFillAnswer = false;
            return _this;
        }
        // 释放
        TestWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.btnBack.removeClickListener(self.onBtnBack, self);
            self.btnStage.removeClickListener(self.onBtnStage, self);
            self.btnRedBag.removeClickListener(self.onBtnRedBag, self);
            self.btnUnlock.removeClickListener(self.onBtnUnlock, self);
            self.btnUnlock.removeClickListener(self.onBtnRank, self);
            self.goldComp.removeClickListener(self.onClickGold, self);
            self.lstSelect.removeEventListener(fairygui.ItemEvent.CLICK, self.onSelectLstClick, self);
            self.lstOption.removeEventListener(fairygui.ItemEvent.CLICK, self.onOptionLstClick, self);
            utils.EventDispatcher.getInstance().removeEventListener("goldChanged", self.refreshGold, self);
        };
        TestWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "TestWindow").asCom;
        };
        /**
         * 注册组件的拓展类
         */
        TestWindow.prototype.registerComponents = function () {
            var self = this;
            self.registerComponent("TipItem", guess.TipItem, "guess");
            self.registerComponent("WordItem", guess.WordItem, "guess");
            self.registerComponent("WordItemSmall", guess.WordItemSmall, "guess");
            self.registerComponent("QuestionPanel", guess.QuestionPanel, "guess");
            self.registerComponent("QuestionPanelDM", guess.QuestionPanelDM, "guess");
        };
        /**
         * 初始化完成
         */
        TestWindow.prototype.onInit = function () {
            var self = this;
            //self.themCtrl = self.contentPane.getController("themCtrl");
            self.questionPanel = self.contentPane.getChild("questionPanel");
            self.questionPanelDM = self.contentPane.getChild("questionPanelDM");
            self.goldComp = self.contentPane.getChild("goldComp").asCom;
            self.txtGold = self.goldComp.getChild("txtGold").asTextField;
            self.goldComp.addClickListener(self.onClickGold, self);
            self.btnBack = self.contentPane.getChild("btnBack").asButton;
            self.btnStage = self.contentPane.getChild("btnStage").asButton;
            self.btnRedBag = self.contentPane.getChild("btnRedBag").asButton;
            self.btnUnlock = self.contentPane.getChild("btnUnlock").asButton;
            self.btnRank = self.contentPane.getChild("btnRank").asButton;
            self.btnBack.addClickListener(self.onBtnBack, self);
            self.btnStage.addClickListener(self.onBtnStage, self);
            self.btnRedBag.addClickListener(self.onBtnRedBag, self);
            self.btnUnlock.addClickListener(self.onBtnUnlock, self);
            self.btnRank.addClickListener(self.onBtnRank, self);
            self.lstSelect = self.contentPane.getChild("lstSelect").asList;
            self.lstOption = self.contentPane.getChild("lstOption").asList;
            self.lstSelect.addEventListener(fairygui.ItemEvent.CLICK, self.onSelectLstClick, self);
            self.lstOption.addEventListener(fairygui.ItemEvent.CLICK, self.onOptionLstClick, self);
            utils.EventDispatcher.getInstance().addEventListener("goldChanged", self.refreshGold, self);
            self.wrongTip = self.contentPane.getChild("wrongTip").asCom;
            self.txtLevel = self.contentPane.getChild("txtLevel").asTextField;
        };
        TestWindow.prototype.onSelectLstClick = function (e) {
            var self = this;
            var word = e.itemObject;
            if (word.isEmpty())
                return;
            var tmp = word.word;
            word.setChar("");
            for (var i = 0; i < self.lstOption.numItems; i++) {
                var item = self.lstOption.getChildAt(i);
                if (item.word === tmp) {
                    item.setChar(tmp);
                    break;
                }
            }
            self.isFillAnswer = false;
        };
        TestWindow.prototype.onOptionLstClick = function (e) {
            var self = this;
            if (self.isFillAnswer)
                return;
            var word = e.itemObject;
            if (word.isEmpty())
                return;
            word.hide();
            for (var i = 0; i < self.lstSelect.numItems; i++) {
                var item = self.lstSelect.getChildAt(i);
                if (item.isEmpty()) {
                    item.setChar(word.word);
                    break;
                }
            }
            // 填满后检测答案
            self.checkAnswer();
        };
        TestWindow.prototype.checkAnswer = function () {
            var self = this;
            var answer = "";
            self.isFillAnswer = true;
            for (var i = 0; i < self.lstSelect.numItems; i++) {
                var item = self.lstSelect.getChildAt(i);
                answer += item.word;
                if (item.isEmpty()) {
                    self.isFillAnswer = false;
                    return;
                }
            }
            var gameMgr = utils.Singleton.get(guess.GameMgr);
            var isRight = gameMgr.testMgr.checkAnswer(answer);
            if (isRight) {
                // 首次答对加金币/红包
                var gainGold = 0;
                var isFirstRight = gameMgr.isFirstPassLevel(gameMgr.testMgr.curTest.level);
                if (isFirstRight) {
                    gainGold = guess.GameCfg.getCfg().TestRewardGold;
                    gameMgr.modifyGold(gainGold);
                    gameMgr.modifyMoney(gameMgr.testMgr.curTest.money);
                }
                // 显示结果界面
                if (!self.resultWnd)
                    self.resultWnd = new guess.ResultWindow("guess");
                self.resultWnd.show();
                self.resultWnd.initData(gainGold);
                // 显示获得红包
                if (isFirstRight && gameMgr.testMgr.curTest.money > 0) {
                    guess.MainWindow.instance.showRedBagWindow(gameMgr.testMgr.curTest.money, "恭喜您获得红包");
                }
                utils.EventDispatcher.getInstance().once("onNextTest", function () {
                    self.nextTest();
                }, self);
            }
            else {
                // 错误提示
                self.wrongTip.visible = true;
                egret.Tween.get(self.wrongTip).set({ alpha: 0 })
                    .to({ alpha: 1 }, 500, egret.Ease.sineInOut).wait(500)
                    .to({ alpha: 0 }, 500, egret.Ease.sineInOut)
                    .call(function () {
                    self.wrongTip.visible = false;
                });
            }
        };
        TestWindow.prototype.onShown = function () {
            var self = this;
        };
        TestWindow.prototype.nextTest = function () {
            var self = this;
            utils.Singleton.get(guess.GameMgr).nextTest();
            self.initData();
        };
        TestWindow.prototype.initData = function () {
            var self = this;
            self.refreshGold();
            var testInfo = utils.Singleton.get(guess.GameMgr).testMgr.curTest;
            self.questionPanelDM.initTest(testInfo);
            self.questionPanel.initTest(testInfo);
            self.initTest(testInfo);
            self.txtLevel.text = testInfo ? "\u7B2C " + testInfo.level + " \u5173" : "没有题目";
            // 不同题目类型显示控制
            //if(testInfo)		
            //	self.themCtrl.setSelectedIndex(testInfo.type == "people" ? 0 : 1);
        };
        TestWindow.prototype.refreshGold = function () {
            var self = this;
            self.txtGold.text = "" + utils.Singleton.get(guess.GameMgr).data.gold;
        };
        TestWindow.prototype.initTest = function (test) {
            var self = this;
            self.lstOption.removeChildrenToPool(0, self.lstOption.numItems - 1);
            self.lstSelect.removeChildrenToPool(0, self.lstSelect.numItems - 1);
            if (!test)
                return;
            self.isFillAnswer = false;
            var ops = test.option.split("、");
            for (var i = 0, len = ops.length; i < len; i++) {
                var item = self.lstOption.addItemFromPool(fairygui.UIPackage.getItemURL("guess", "WordItem"));
                item.setChar(ops[i]);
            }
            for (var i = 0; i < test.answer.length; i++) {
                var item = self.lstSelect.addItemFromPool(fairygui.UIPackage.getItemURL("guess", "WordItemSmall"));
                item.setChar("");
            }
        };
        TestWindow.prototype.onBtnBack = function (e) {
            var self = this;
            self.hide();
        };
        TestWindow.prototype.onBtnStage = function (e) {
            var self = this;
            guess.MainWindow.instance.showStageWindow();
        };
        TestWindow.prototype.onBtnRedBag = function (e) {
            var self = this;
            guess.MainWindow.instance.showRedBagWindow();
        };
        TestWindow.prototype.onBtnUnlock = function (e) {
            var self = this;
            var curTest = utils.Singleton.get(guess.GameMgr).testMgr.curTest;
            if (!curTest)
                return;
            // 扣金币
            var cost = guess.GameCfg.getCfg().UnlockAnswerCost;
            if (!utils.Singleton.get(guess.GameMgr).checkGoldEnough(cost)) {
                if (!self.lackWnd)
                    self.lackWnd = new guess.LackGoldWindow("guess");
                self.lackWnd.show();
                self.lackWnd.initData();
                // 监听观看成功
                utils.EventDispatcher.getInstance().removeEventListener("watchAdOk", self.showAnswerTip, self);
                utils.EventDispatcher.getInstance().once("watchAdOk", self.showAnswerTip, self);
                // 监听分享到群成功
                utils.EventDispatcher.getInstance().removeEventListener("shareGroupOk", self.showAnswerTip, self);
                utils.EventDispatcher.getInstance().once("shareGroupOk", self.showAnswerTip, self);
                return;
            }
            utils.Singleton.get(guess.GameMgr).costGold(cost);
            // 提示答案
            self.showAnswerTip();
        };
        TestWindow.prototype.onBtnRank = function (e) {
            guess.MainWindow.instance.showOrHideRankWnd();
        };
        TestWindow.prototype.showAnswerTip = function () {
            var self = this;
            var answer = utils.Singleton.get(guess.GameMgr).testMgr.curTest.answer;
            for (var i = 0, len = self.lstOption.numItems; i < len; i++) {
                var item = self.lstOption.getChildAt(i);
                if (answer.indexOf(item.word) != -1)
                    item.showColorAni();
            }
        };
        TestWindow.prototype.onClickGold = function (e) {
            var self = this;
            // 判断是不是首次点击
            var isFirstClick = true;
            if (isFirstClick) {
                var wnd = new guess.FirstShareGroupWindow();
                wnd.show();
                wnd.initData();
                utils.EventDispatcher.getInstance().removeEventListener("shareGroupOk", self.onShareOk, self);
                utils.EventDispatcher.getInstance().once("shareGroupOk", self.onShareOk, self);
            }
        };
        TestWindow.prototype.onShareOk = function () {
            // 分享成功加金币
            utils.Singleton.get(guess.GameMgr).modifyGold(guess.GameCfg.getCfg().FirstShareGroupGold);
        };
        return TestWindow;
    }(guess.BaseWindow));
    guess.TestWindow = TestWindow;
    __reflect(TestWindow.prototype, "guess.TestWindow");
})(guess || (guess = {}));
var guess;
(function (guess) {
    var TipItem = (function (_super) {
        __extends(TipItem, _super);
        function TipItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TipItem.prototype.constructFromResource = function () {
            _super.prototype.constructFromResource.call(this);
            var self = this;
            self.txtId = self.getChild("txtId").asTextField;
            self.txtDesc = self.getChild("txtDesc").asTextField;
        };
        TipItem.prototype.initInfo = function (id, desc) {
            if (desc === void 0) { desc = ""; }
            var self = this;
            self.txtId.text = id;
            self.txtDesc.text = desc;
        };
        return TipItem;
    }(fairygui.GComponent));
    guess.TipItem = TipItem;
    __reflect(TipItem.prototype, "guess.TipItem");
})(guess || (guess = {}));
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var guess;
(function (guess) {
    var WordItemSmall = (function (_super) {
        __extends(WordItemSmall, _super);
        function WordItemSmall() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WordItemSmall;
    }(guess.WordItem));
    guess.WordItemSmall = WordItemSmall;
    __reflect(WordItemSmall.prototype, "guess.WordItemSmall");
})(guess || (guess = {}));

;window.Main = Main;
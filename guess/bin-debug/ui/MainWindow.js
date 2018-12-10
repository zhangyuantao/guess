var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 主游戏入口
 */
var guess;
(function (guess) {
    var MainWindow = (function (_super) {
        __extends(MainWindow, _super);
        function MainWindow() {
            var _this = _super.call(this) || this;
            var self = _this;
            MainWindow.instance = self;
            self.registerComponents(); // 要在窗体创建(initUI)之前
            self.initUI(); // UI初始化
            self.addEventListeners(); // 事件监听
            return _this;
        }
        // 释放
        MainWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var self = this;
            self.removeEventListeners();
            utils.Singleton.destroy(utils.SoundMgr);
            utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
            //console.log("game dispose");
        };
        MainWindow.prototype.initUI = function () {
            var self = this;
            self.contentPane = fairygui.UIPackage.createObject("guess", "MainWindow").asCom;
        };
        MainWindow.prototype.addEventListeners = function () {
            var self = this;
            utils.StageUtils.addEventListener(egret.Event.RESIZE, self.setResolution, self); // 监听屏幕大小改变
        };
        MainWindow.prototype.removeEventListeners = function () {
            var self = this;
            utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
        };
        /**
         * 注册组件的拓展类
         */
        MainWindow.prototype.registerComponents = function () {
            var self = this;
        };
        MainWindow.prototype.registerComponent = function (compName, userClass, pkgName) {
            if (pkgName === void 0) { pkgName = "leap"; }
            var url = fairygui.UIPackage.getItemURL(pkgName, compName);
            fairygui.UIObjectFactory.setPackageItemExtension(url, userClass);
        };
        /**
         * 初始化完成
         */
        MainWindow.prototype.onInit = function () {
            console.log("onInit");
        };
        // 动态调整窗口分辨率
        MainWindow.prototype.setResolution = function () {
            var self = this;
            self.height = utils.StageUtils.stageHeight;
            self.width = utils.StageUtils.stageWidth;
        };
        // 创建游戏
        MainWindow.prototype.createGame = function () {
            var self = this;
        };
        return MainWindow;
    }(fairygui.Window));
    guess.MainWindow = MainWindow;
    __reflect(MainWindow.prototype, "guess.MainWindow");
})(guess || (guess = {}));
//# sourceMappingURL=MainWindow.js.map
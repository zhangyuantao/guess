var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var guess;
(function (guess) {
    var GameCfg = (function () {
        function GameCfg() {
        }
        GameCfg.getCfg = function () {
            if (!GameCfg.cfg)
                GameCfg.cfg = RES.getRes('leapConfig_json');
            return GameCfg.cfg;
        };
        GameCfg.getLevelCfg = function (lv) {
            if (lv > 8)
                lv = 8;
            return GameCfg.getCfg().LevelCfg[lv];
        };
        GameCfg.frameTime = 33;
        GameCfg.cfg = null;
        return GameCfg;
    }());
    guess.GameCfg = GameCfg;
    __reflect(GameCfg.prototype, "guess.GameCfg");
})(guess || (guess = {}));
//# sourceMappingURL=GameCfg.js.map
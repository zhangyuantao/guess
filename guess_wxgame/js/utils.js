var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    /**
     * 自定义事件分发
     */
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.listeners = {};
        }
        EventDispatcher.getInstance = function () {
            if (!EventDispatcher.instance)
                EventDispatcher.instance = new EventDispatcher();
            return EventDispatcher.instance;
        };
        EventDispatcher.prototype.addEventListener = function (type, listener, thisObj, refObj) {
            var self = this;
            var pair = self._addEventListener(type, listener, thisObj, refObj);
            self.listeners[type].push(pair);
        };
        EventDispatcher.prototype.once = function (type, listener, thisObj, refObj) {
            var self = this;
            var pair = self._addEventListener(type, listener, thisObj, refObj, true);
            self.listeners[type].push(pair);
        };
        EventDispatcher.prototype._addEventListener = function (type, listener, thisObj, refObj, once) {
            if (once === void 0) { once = false; }
            var self = this;
            if (!self.listeners)
                self.listeners = {};
            if (!self.listeners[type])
                self.listeners[type] = [];
            var pair = {};
            pair.listener = listener;
            pair.thisObj = thisObj;
            pair.refObj = refObj;
            pair.once = once;
            return pair;
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener, thisObj) {
            var self = this;
            if (!self.listeners[type] || !self.listeners[type].length)
                return;
            var listenerArr = self.listeners[type];
            for (var i = 0; i < listenerArr.length; i++) {
                var pair = listenerArr[i];
                if (pair.listener == listener && pair.thisObj == thisObj) {
                    listenerArr.splice(i--, 1);
                }
            }
            if (!listenerArr.length)
                delete self.listeners[type];
        };
        EventDispatcher.prototype.removeAllEventListener = function (type) {
            var self = this;
            if (!self.listeners[type])
                return;
            self.listeners[type] = null;
            delete self.listeners[type];
        };
        EventDispatcher.prototype.removeAll = function () {
            var self = this;
            self.listeners = {};
        };
        EventDispatcher.prototype.dispatchEvent = function (type, args, refObj) {
            var self = this;
            if (!self.listeners[type] || !self.listeners[type].length)
                return;
            var listenerArr = self.listeners[type];
            for (var i = 0; i < listenerArr.length; i++) {
                var pair = listenerArr[i];
                if (refObj && refObj != pair.refObj)
                    continue;
                if (pair.once)
                    listenerArr.splice(i--, 1);
                pair.listener.call(pair.thisObj, args);
            }
            if (!listenerArr.length)
                delete self.listeners[type];
        };
        EventDispatcher.prototype.dispose = function () {
            var self = this;
            self.listeners = null;
            EventDispatcher.instance = null;
        };
        return EventDispatcher;
    }());
    utils.EventDispatcher = EventDispatcher;
    __reflect(EventDispatcher.prototype, "utils.EventDispatcher");
})(utils || (utils = {}));
var utils;
(function (utils) {
    //----------------------------------------------//
    //---------- Function.ts 功能函数集合 -----------//
    //----------------------------------------------//
    /**
     * 灰色滤镜
     */
    utils.grayFilters = function () {
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        return [colorFlilter];
    };
})(utils || (utils = {}));
var utils;
(function (utils) {
    /**
     * 对象池
     * Created by zhangyuantao
     * 使用方法：
     *  1.使用对象池创建的对象需实现此接口实现IGameObject接口
     * 	2.一般对象创建：	 let bg = objectPool.ObjectPool.getInstance().createObject(Background);
     *  3.fairyGUI对象创建：let spike = objectPool.ObjectPool.getInstance().createFairyUIObject(Spike, "leap");
     */
    var ObjectPool = (function () {
        function ObjectPool() {
            this.pause = false;
            var self = this;
            self.pool = {};
            self.list = [];
            egret.MainContext.instance.stage.addEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
        }
        ObjectPool.getInstance = function () {
            if (ObjectPool.instance == null)
                ObjectPool.instance = new ObjectPool();
            return ObjectPool.instance;
        };
        // 帧循环
        ObjectPool.prototype.onEnterFrame = function () {
            var self = this;
            if (self.pause)
                return;
            var now = egret.getTimer();
            self.lastEnterFrameTime = self.lastEnterFrameTime || now;
            var deltaTime = now - self.lastEnterFrameTime;
            var list = self.list.concat();
            for (var i = 0, length_1 = list.length; i < length_1; i++) {
                var obj = list[i];
                obj.onEnterFrame(deltaTime);
            }
            self.lastEnterFrameTime = egret.getTimer();
        };
        /**
         * 创建对象
         * @param classFactory 具体对象类
         */
        ObjectPool.prototype.createObject = function (classFactory) {
            var self = this;
            var result;
            var key = egret.getQualifiedClassName(classFactory); // 代码混淆后要用这个取
            key = key.split(".")[1]; // 去除命名空间
            var arr = self.pool[key];
            if (arr != null && arr.length)
                result = arr.shift();
            else {
                result = new classFactory();
                result.key = key;
            }
            result.onCreate();
            self.list.push(result);
            return result;
        };
        /**
         * 创建fairyGUI对象
         * @param 具体UI对象类
         * @param packageName 包名
         */
        ObjectPool.prototype.createFairyUIObject = function (classFactory, packageName) {
            var self = this;
            var result;
            var key = egret.getQualifiedClassName(classFactory);
            key = key.split(".")[1]; // 去除命名空间
            var arr = self.pool[key];
            if (arr != null && arr.length)
                result = arr.shift();
            else {
                result = fairygui.UIPackage.createObject(packageName, key, classFactory);
                result.key = key;
            }
            result.onCreate();
            self.list.push(result);
            return result;
        };
        /**
         * 移除已创建对象
         */
        ObjectPool.prototype.destroyObject = function (obj) {
            var self = this;
            obj.onDestroy();
            var key = obj.key;
            if (self.pool[key] == null)
                self.pool[key] = [];
            self.pool[key].push(obj);
            var parent = obj.parent;
            if (parent)
                parent.removeChild(obj);
            var index = self.list.indexOf(obj);
            if (index != -1)
                self.list.splice(index, 1);
        };
        /**
         * 释放对象池
         */
        ObjectPool.prototype.dispose = function () {
            var self = this;
            egret.MainContext.instance.stage.removeEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
            // 销毁移除所有已创建对象
            for (var i = 0; i < self.list.length; i++) {
                var obj = self.list[i];
                obj.onDestroy();
                var parent_1 = obj.parent;
                if (parent_1)
                    parent_1.removeChild(obj);
                else if (obj.displayObject && obj.displayObject.parent) {
                    parent_1 = obj.displayObject.parent;
                    parent_1.removeChild(obj.displayObject);
                }
            }
            self.list = null;
            self.pool = null;
            ObjectPool.instance = null;
        };
        return ObjectPool;
    }());
    utils.ObjectPool = ObjectPool;
    __reflect(ObjectPool.prototype, "utils.ObjectPool");
})(utils || (utils = {}));
var utils;
(function (utils) {
    /**
     * 通用单例模板
     * Created by zhangyuantao
     * 目标需要实现ISingleton接口
     * 注意：这不是严格的单例模式，依然允许new出不同实例，只是为了方便达到单例目的
     * 可以自行加私有构造函数private constructor(){}来避免误使用new()创建
     * 使用方法： let instance = Singleton.get(Class);
     */
    var Singleton = (function () {
        function Singleton() {
        }
        /**
         * 获取、创建单例
         */
        Singleton.get = function (classFactory) {
            var Class = classFactory;
            if (!Class.instance) {
                Class.instance = new Class();
                if (Class.instance.onCreate)
                    Class.instance.onCreate();
            }
            return Class.instance;
        };
        /**
         * 销毁单例
         */
        Singleton.destroy = function (classFactory) {
            var instance = Singleton.get(classFactory);
            if (instance.onDestroy)
                instance.onDestroy();
            classFactory.instance = null;
        };
        return Singleton;
    }());
    utils.Singleton = Singleton;
    __reflect(Singleton.prototype, "utils.Singleton");
})(utils || (utils = {}));
var utils;
(function (utils) {
    /**
     * 声音管理
     */
    var SoundMgr = (function () {
        function SoundMgr() {
            this.lastBgmPos = 0;
            this.bgmLoops = 0;
            this.isMuteBgm = false;
            this.isMuteSound = false;
        }
        // 实例化
        SoundMgr.prototype.onCreate = function () {
            var self = this;
            self.sounds = {};
            // 是否静音存储
            var a = egret.localStorage.getItem("isMuteBgm");
            self.isMuteBgm = a && a == "1";
            var b = egret.localStorage.getItem("isMuteSound");
            self.isMuteSound = b && b == "1";
        };
        // 销毁
        SoundMgr.prototype.onDestroy = function () {
            var self = this;
            self.disposeBgm();
            self.disposeAllSound();
        };
        /** 背景音乐 */
        SoundMgr.prototype.playBgm = function (url, startTime, loops, volume) {
            if (startTime === void 0) { startTime = 0; }
            if (loops === void 0) { loops = 0; }
            if (volume === void 0) { volume = 1; }
            var self = this;
            // 正在播放
            // if(self.bgmSoundChannel && self.bgmSoundChannel.position > 0)
            // 	return;
            if (self.bgmSoundChannel)
                self.bgmSoundChannel.stop();
            if (!self.bgm)
                self.bgm = RES.getRes(url);
            self.bgmLoops = loops;
            if (self.isMuteBgm)
                return;
            self.bgmSoundChannel = self.bgm.play(startTime || self.lastBgmPos, loops);
            self.bgmSoundChannel.volume = volume;
        };
        // 暂停背景音乐
        SoundMgr.prototype.pauseBgm = function () {
            var self = this;
            if (self.bgmSoundChannel) {
                self.lastBgmPos = self.bgmSoundChannel.position;
                self.bgmSoundChannel.stop();
            }
        };
        // 恢复背景音乐
        SoundMgr.prototype.resumeBgm = function () {
            var self = this;
            if (self.bgm) {
                self.bgmSoundChannel = self.bgm.play(self.lastBgmPos, self.bgmLoops);
            }
        };
        // 释放背景音乐
        SoundMgr.prototype.disposeBgm = function () {
            var self = this;
            self.bgmSoundChannel.stop();
            self.bgmSoundChannel = null;
            self.bgm.close();
            self.bgm = null;
        };
        // 设置背景音乐静音状态
        SoundMgr.prototype.setBgmMute = function (mute) {
            var self = this;
            if (self.isMuteBgm == mute)
                return;
            if (mute)
                self.pauseBgm();
            else
                self.resumeBgm();
            self.isMuteBgm = mute;
            egret.localStorage.setItem("isMuteBgm", mute ? "1" : "0");
        };
        /** 音效 */
        SoundMgr.prototype.playSound = function (url, startTime, loops, volume) {
            if (startTime === void 0) { startTime = 0; }
            if (loops === void 0) { loops = 1; }
            if (volume === void 0) { volume = 1; }
            var self = this;
            if (self.isMuteSound)
                return;
            var info = self.sounds[url];
            var sound;
            if (!info) {
                sound = RES.getRes(url);
                self.sounds[url] = { sound: sound };
            }
            else
                sound = info.sound;
            self.sounds[url].loops = loops;
            var channel = sound.play(startTime, loops);
            channel.volume = volume;
            self.sounds[url].channel = channel;
        };
        // 暂停声音
        SoundMgr.prototype.pauseSound = function (url) {
            var self = this;
            var sound = self.sounds[url];
            if (sound)
                sound.channel.stop();
        };
        SoundMgr.prototype.pauseAllSound = function () {
            var self = this;
            for (var url in self.sounds) {
                var info = self.sounds[url];
                var channel = info.channel;
                info.lastSoundPos = channel.position;
                channel.stop();
            }
        };
        // 恢复声音
        SoundMgr.prototype.resumeSound = function (url) {
            var self = this;
            var info = self.sounds[url];
            if (info) {
                var channel = info.channel;
                info.channel = info.sound.play(info.lastSoundPos, info.loops);
            }
        };
        // 设置全局音效静音
        SoundMgr.prototype.setSoundMute = function (mute) {
            var self = this;
            if (self.isMuteSound == mute)
                return;
            if (mute)
                self.pauseAllSound();
            self.isMuteSound = mute;
            egret.localStorage.setItem("isMuteSound", mute ? "1" : "0");
        };
        // 释放某个声音
        SoundMgr.prototype.disposeSound = function (url) {
            var self = this;
            var info = self.sounds[url];
            if (!info)
                return;
            var sound = info.sound;
            sound.close();
            var channel = info.channel;
            channel.stop();
            self.sounds[url] = null;
            delete self.sounds[url];
        };
        // 释放所有声音
        SoundMgr.prototype.disposeAllSound = function () {
            var self = this;
            for (var url in self.sounds) {
                self.disposeSound(url);
            }
            self.sounds = null;
        };
        return SoundMgr;
    }());
    utils.SoundMgr = SoundMgr;
    __reflect(SoundMgr.prototype, "utils.SoundMgr", ["utils.ISingleton"]);
})(utils || (utils = {}));
var utils;
(function (utils) {
    /**
     * 舞台工具类
     */
    var StageUtils = (function () {
        function StageUtils() {
        }
        Object.defineProperty(StageUtils, "stage", {
            get: function () {
                return egret.MainContext.instance.stage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageUtils, "stageWidth", {
            get: function () {
                return egret.MainContext.instance.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageUtils, "stageHeight", {
            get: function () {
                return egret.MainContext.instance.stage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageUtils, "halfStageWidth", {
            get: function () {
                return egret.MainContext.instance.stage.stageWidth * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageUtils, "halfStageHeight", {
            get: function () {
                return egret.MainContext.instance.stage.stageHeight * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        StageUtils.dispatchEvent = function (type, bubbles, data, cancelable) {
            StageUtils.stage.dispatchEventWith(type, bubbles, data, cancelable);
        };
        StageUtils.addEventListener = function (type, listener, thisObj) {
            StageUtils.stage.addEventListener(type, listener, thisObj);
        };
        StageUtils.removeEventListener = function (type, listener, thisObj) {
            StageUtils.stage.removeEventListener(type, listener, thisObj);
        };
        return StageUtils;
    }());
    utils.StageUtils = StageUtils;
    __reflect(StageUtils.prototype, "utils.StageUtils");
})(utils || (utils = {}));
;window.utils = utils;
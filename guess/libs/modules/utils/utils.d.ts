declare module utils {
    /**
     * 自定义事件分发
     */
    class EventDispatcher {
        private static instance;
        static getInstance(): EventDispatcher;
        private listeners;
        addEventListener(type: string, listener: Function, thisObj: any, refObj?: any): void;
        once(type: string, listener: Function, thisObj: any, refObj?: any): void;
        private _addEventListener(type, listener, thisObj, refObj?, once?);
        removeEventListener(type: string, listener: Function, thisObj: any): void;
        removeAllEventListener(type: string): void;
        removeAll(): void;
        dispatchEvent(type: string, args?: any, refObj?: any): void;
        dispose(): void;
    }
    interface IEventListenerVO {
        listener: Function;
        thisObj: any;
        refObj: any;
        once: boolean;
    }
}
declare module utils {
    /**
     * 灰色滤镜
     */
    let grayFilters: () => egret.ColorMatrixFilter[];
}
declare module utils {
    /**
     * 对象池
     * Created by zhangyuantao
     * 使用方法：
     *  1.使用对象池创建的对象需实现此接口实现IGameObject接口
     * 	2.一般对象创建：	 let bg = objectPool.ObjectPool.getInstance().createObject(Background);
     *  3.fairyGUI对象创建：let spike = objectPool.ObjectPool.getInstance().createFairyUIObject(Spike, "leap");
     */
    class ObjectPool {
        pause: boolean;
        private pool;
        private list;
        private lastEnterFrameTime;
        constructor();
        /** 单例 */
        private static instance;
        static getInstance(): ObjectPool;
        private onEnterFrame();
        /**
         * 创建对象
         * @param classFactory 具体对象类
         */
        createObject<T>(classFactory: {
            new (): T;
        }): T;
        /**
         * 创建fairyGUI对象
         * @param 具体UI对象类
         * @param packageName 包名
         */
        createFairyUIObject<T>(classFactory: {
            new (): T;
        }, packageName: string): T;
        /**
         * 移除已创建对象
         */
        destroyObject(obj: any): void;
        /**
         * 释放对象池
         */
        dispose(): void;
    }
    /**
     * 对象接口
     * 使用对象池创建的对象需实现此接口
     */
    interface IGameObject {
        key: string;
        onCreate(): any;
        onDestroy(): any;
        onEnterFrame(deltaTime: number): any;
    }
}
declare module utils {
    interface ISingleton {
        onCreate(): any;
        onDestroy(): any;
    }
    /**
     * 通用单例模板
     * Created by zhangyuantao
     * 目标需要实现ISingleton接口
     * 注意：这不是严格的单例模式，依然允许new出不同实例，只是为了方便达到单例目的
     * 可以自行加私有构造函数private constructor(){}来避免误使用new()创建
     * 使用方法： let instance = Singleton.get(Class);
     */
    class Singleton {
        /**
         * 获取、创建单例
         */
        static get<T>(classFactory: {
            new (): T;
        }): T;
        /**
         * 销毁单例
         */
        static destroy(classFactory: any): void;
    }
}
declare module utils {
    /**
     * 声音管理
     */
    class SoundMgr implements utils.ISingleton {
        private sounds;
        private bgm;
        private bgmSoundChannel;
        private lastBgmPos;
        private bgmLoops;
        isMuteBgm: boolean;
        isMuteSound: boolean;
        onCreate(): void;
        onDestroy(): void;
        /** 背景音乐 */
        playBgm(url: string, startTime?: number, loops?: number, volume?: number): void;
        pauseBgm(): void;
        resumeBgm(): void;
        disposeBgm(): void;
        setBgmMute(mute: boolean): void;
        /** 音效 */
        playSound(url: string, startTime?: number, loops?: number, volume?: number): void;
        pauseSound(url: string): void;
        private pauseAllSound();
        resumeSound(url: string): void;
        setSoundMute(mute: boolean): void;
        disposeSound(url: string): void;
        disposeAllSound(): void;
    }
}
declare module utils {
    /**
     * 舞台工具类
     */
    class StageUtils {
        static readonly stage: egret.Stage;
        static readonly stageWidth: number;
        static readonly stageHeight: number;
        static readonly halfStageWidth: number;
        static readonly halfStageHeight: number;
        static dispatchEvent(type: string, bubbles?: boolean, data?: any, cancelable?: boolean): void;
        static addEventListener(type: string, listener: any, thisObj: any): void;
        static removeEventListener(type: string, listener: any, thisObj: any): void;
    }
}

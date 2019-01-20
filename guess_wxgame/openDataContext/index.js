/**
 * 微信开放数据域
 * 使用 Canvas2DAPI 在 SharedCanvas 渲染一个排行榜，
 * 并在主域中渲染此 SharedCanvas
 */







/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
const assetsUrl = {
  icon: "openDataContext/assets/icon.png",
  box: "openDataContext/assets/box.png",
  panel: "openDataContext/assets/panel.png",
  button: "openDataContext/assets/button.png",
  title: "openDataContext/assets/rankingtitle.png"
};

/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
let assets = {};
console.log();
/**
 * canvas 大小
 * 这里暂时写死
 * 需要从主域传入
 */
let canvasWidth;
let canvasHeight;



//获取canvas渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";


/**
 * 所有头像数据
 * 包括姓名，头像图片，得分
 * 排位序号i会根据parge*perPageNum+i+1进行计算
 */
let totalGroup = [
    { seq:0, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 100, time: 1000 }] },
    { seq: 1, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 101, time: 100 }] },
    { seq: 2, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 102, time: 1700 }] },
    { seq: 3, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 103, time: 1800 }] },
    { seq: 4, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 104, time: 1900 }] },
    { seq: 5, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 105, time: 1070 }] },
    { seq: 6, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 106, time: 1030 }] },
    { seq: 7, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 107, time: 1010 }] },
    { seq: 8, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 108, time: 1020 }] },
    { seq: 9, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 109, time: 1030 }] },
    { seq: 10, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 111, time: 1040 }] },
    { seq: 11, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 112, time: 1050 }] },
    { seq: 12, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 123, time: 1060 }] },
    { seq: 13, openId: '', avatarUrl: '', nickName: 'peony', KVDataList: [{ level: 167, time: 1080 }] }
];


/**
 * 创建排行榜
 */
function drawRankPanel() {
  //绘制背景
  context_drawImage(assets.panel, offsetX_rankToBorder, offsetY_rankToBorder, rankWidth, rankHeight);
  //绘制标题
  const title = assets.title;
  //根据title的宽高计算一下位置;
  const titleW = title.width / 720 * stageWidth;
  const titleH = title.height / 1280 * stageHeight;
  const titleX = offsetX_rankToBorder + (rankWidth - titleW) * 0.5;
  const titleY = offsetY_rankToBorder - 100;
  context_drawImage(title, titleX, titleY, titleW, titleH);
  
  //获取当前要渲染的数据组
   wx.getFriendCloudStorage({
        keys: ["level"],
        success: function (res) {
           // console.log("好友数据",res);
            totalGroup = res.data;
            // 排序
            totalGroup.sort((a, b) => {
                let a_level = 0;
                for (let i = 0; i < a.KVDataList.length; i++) {
                    if (a.KVDataList[i]["level"]) {
                        a_level = a.KVDataList[i]["level"];
                        break;
                    }
                }
                let b_level = 0;
                for (let i = 0; i < b.KVDataList.length; i++) {
                    if (b.KVDataList[i]["level"]) {
                        b_level = b.KVDataList[i]["level"];
                        break;
                    }
                }
                if(a_level > b_level) return -1;
                else if (a_level == b_level) return 0;
                else return 1;
            });

            // 预加载头像
            let urls = [];
            for(let i = 0, len = res.data.length; i < len; i++){
                urls.push(res.data[i].avatarUrl);
            }
            preloadAvatars(urls, () => {
                //起始id
                const startID = perPageMaxNum * page;
                currentGroup = totalGroup.slice(startID, startID + perPageMaxNum);
                //创建头像Bar
                drawRankByGroup(currentGroup);
                //创建按钮
                drawButton()
            })            
        },
        fail: function (res) {
            
        },
        complete: function (res) {
           
        },
    })
}
/**
 * 根据屏幕大小初始化所有绘制数据
 */
function init() {
  //排行榜绘制数据初始化,可以在此处进行修改
  rankWidth = stageWidth * 4 / 5;
  rankHeight = stageHeight * 4 / 5;
  barWidth = rankWidth * 4 / 5;
  barHeight = rankWidth / perPageMaxNum;
  offsetX_rankToBorder = (stageWidth - rankWidth) / 2;
  offsetY_rankToBorder = (stageHeight - rankHeight) / 2;
  preOffsetY = (rankHeight - barHeight) / (perPageMaxNum + 1);
  fontSize = Math.floor(stageWidth / 25);
  startX = offsetX_rankToBorder + (rankWidth - barWidth) / 2;
  startY = offsetY_rankToBorder + preOffsetY;
  avatarSize = barHeight - 10;
  intervalX = barWidth / 20;
  textOffsetY = (barHeight + fontSize) / 2;
  textMaxSize = barWidth / 3;
  indexWidth = context.measureText("99").width;

  //按钮绘制数据初始化
  buttonWidth = barWidth / 3;
  buttonHeight = barHeight / 2;
  buttonOffset = rankWidth / 3;
  lastButtonX = offsetX_rankToBorder + buttonOffset - buttonWidth;
  nextButtonX = offsetX_rankToBorder + 2 * buttonOffset;
  nextButtonY = lastButtonY = offsetY_rankToBorder + rankHeight - 50 - buttonHeight;  
  let data = wx.getSystemInfoSync();
  canvasWidth = data.windowWidth;
  canvasHeight = data.windowHeight;
}

/**
 * 创建两个点击按钮
 */
function drawButton() {
  context_drawImage(assets.button, nextButtonX, nextButtonY, buttonWidth, buttonHeight);
  context_drawImage(assets.button, lastButtonX, lastButtonY, buttonWidth, buttonHeight);
}


/**
 * 根据当前绘制组绘制排行榜
 */
function drawRankByGroup(currentGroup) {
  for (let i = 0; i < currentGroup.length; i++) {
    const data = currentGroup[i];
    drawByData(data, i);
  }
}

/**
 * 根据绘制信息以及当前i绘制元素
 */
function drawByData(data, i) {
  let x = startX;
  //绘制底框
  context_drawImage(assets.box, startX, startY + i * preOffsetY, barWidth, barHeight);
  x += 10;
  //设置字体
  context.font = fontSize + "px Arial";
  //绘制序号
  context.fillText(i + 1 + "", x, startY + i * preOffsetY + textOffsetY, textMaxSize);
  x += indexWidth + intervalX;
  //绘制头像  
    context_drawImage(assets[data.avatarUrl] || assets.icon, x, startY + i * preOffsetY + (barHeight - avatarSize) / 2, avatarSize, avatarSize);
  x += avatarSize + intervalX;

  //绘制名称
  context.fillText(data.nickname + "", x, startY + i * preOffsetY + textOffsetY, textMaxSize);
  x += textMaxSize + intervalX;
  //绘制分数
  let level = 0;
  for(let i = 0; i < data.KVDataList.length; i++){
      if(data.KVDataList[i]["level"]){
          level = data.KVDataList[i]["level"];
          break;
      }
  }
    context.fillText(level + "", x, startY + i * preOffsetY + textOffsetY, textMaxSize);
}

/**
 * 点击处理
 */
function onTouchEnd(event) {
  let x = event.clientX * sharedCanvas.width / canvasWidth;
  let y = event.clientY * sharedCanvas.height / canvasHeight;
  if (x > lastButtonX && x < lastButtonX + buttonWidth &&
    y > lastButtonY && y < lastButtonY + buttonHeight) {
    //在last按钮的范围内
    if (page > 0) {
      buttonClick(0);

    }
  }
  if (x > nextButtonX && x < nextButtonX + buttonWidth &&
    y > nextButtonY && y < nextButtonY + buttonHeight) {
    //在next按钮的范围内
    if ((page + 1) * perPageMaxNum < totalGroup.length) {
      buttonClick(1);
    }
  }
}
/**
 * 根据传入的buttonKey 执行点击处理
 * 0 为上一页按钮
 * 1 为下一页按钮
 */
function buttonClick(buttonKey) {
  let old_buttonY;
  if (buttonKey == 0) {
    //上一页按钮
    old_buttonY = lastButtonY;
    lastButtonY += 10;
    page--;
    renderDirty = true;
    console.log('上一页' + page);
    let id = setTimeout(() => {
      clearTimeout(id);
      lastButtonY = old_buttonY;
      //重新渲染必须标脏
      renderDirty = true;
    }, 100);
  } else if (buttonKey == 1) {
    //下一页按钮
    old_buttonY = nextButtonY;
    nextButtonY += 10;
    page++;
    renderDirty = true;
    console.log('下一页' + page);
    let id = setTimeout(() => {
      clearTimeout(id);
      nextButtonY = old_buttonY;
      //重新渲染必须标脏
      renderDirty = true;
    }, 100);
  }
}

/////////////////////////////////////////////////////////////////// 相关缓存数据

///////////////////////////////////数据相关/////////////////////////////////////

/**
 * 渲染标脏量
 * 会在被标脏（true）后重新渲染
 */
let renderDirty = true;

/**
 * 当前绘制组
 */
let currentGroup = [];
/**
 * 每页最多显示个数
 */
let perPageMaxNum = 5;
/**
 * 当前页数,默认0为第一页
 */
let page = 0;
///////////////////////////////////绘制相关///////////////////////////////
/**
 * 舞台大小
 */
let stageWidth;
let stageHeight;
/**
 * 排行榜大小
 */
let rankWidth;
let rankHeight;

/**
 * 每个头像条目的大小
 */
let barWidth;
let barHeight;
/**
 * 条目与排行榜边界的水平距离
 */
let offsetX_barToRank
/**
 * 绘制排行榜起始点X
 */
let startX;
/**
 * 绘制排行榜起始点Y
 */
let startY;
/**
 * 每行Y轴间隔offsetY
 */
let preOffsetY;
/**
 * 按钮大小
 */
let buttonWidth;
let buttonHeight;
/**
 * 上一页按钮X坐标
 */
let lastButtonX;
/**
 * 下一页按钮x坐标
 */
let nextButtonX;
/**
 * 上一页按钮y坐标
 */
let lastButtonY;
/**
 * 下一页按钮y坐标
 */
let nextButtonY;
/**
 * 两个按钮的间距
 */
let buttonOffset;

/**
 * 字体大小
 */
let fontSize;
/**
 * 文本文字Y轴偏移量
 * 可以使文本相对于图片大小居中
 */
let textOffsetY;
/**
 * 头像大小
 */
let avatarSize;
/**
 * 名字文本最大宽度，名称会根据
 */
let textMaxSize;
/**
 * 绘制元素之间的间隔量
 */
let intervalX;
/**
 * 排行榜与舞台边界的水平距离
 */
let offsetX_rankToBorder;
/**
 * 排行榜与舞台边界的竖直距离
 */
let offsetY_rankToBorder;
/**
 * 绘制排名的最大宽度
 */
let indexWidth;

//////////////////////////////////////////////////////////
/**
 * 监听点击
 */
wx.onTouchEnd((event) => {
  const l = event.changedTouches.length;
  for (let i = 0; i < l; i++) {
    onTouchEnd(event.changedTouches[i]);
  }
});


/**
 * 是否加载过资源的标记量
 */
let hasLoadRes;

/**
 * 资源加载
 */
function preloadAssets() {
  let preloaded = 0;
  let count = 0;
  for (let asset in assetsUrl) {
    count++;
    const img = wx.createImage();
    img.onload = () => {
      preloaded++;
      if (preloaded == count) {
        // console.log("加载完成");
        hasLoadRes = true;
      }

    }
    img.src = assetsUrl[asset];
    assets[asset] = img;
  }
}

/**
 * 预加载头像
 */
function preloadAvatars(assetsUrl, cb) {
    let preloaded = 0;
    let count = 0;
    for (let asset in assetsUrl) {
        count++;
        const img = wx.createImage();
        img.onload = () => {
            preloaded++;
            if (preloaded == count) {
                cb();
            }
        }
        img.src = assetsUrl[asset];
        assets[assetsUrl[asset]] = img;
    }
}


/**
 * 绘制屏幕
 * 这个函数会在加载完所有资源之后被调用
 */
function createScene() {
  if (sharedCanvas.width && sharedCanvas.height) {
    // console.log('初始化完成')
    stageWidth = sharedCanvas.width;
    stageHeight = sharedCanvas.height;
    init();
    return true;
  } else {
    console.log('创建开放数据域失败，请检查是否加载开放数据域资源');
    return false;
  }
}


//记录requestAnimationFrame的ID
let requestAnimationFrameID;
let hasCreateScene;

/**
 * 增加来自主域的监听函数
 */
function addOpenDataContextListener() {
  console.log('增加监听函数')
  wx.onMessage((data) => {
    console.log(data);
    if (data.command == 'open') {
      if (!hasCreateScene) {
        //创建并初始化
        hasCreateScene = createScene();
      }
      requestAnimationFrameID = requestAnimationFrame(loop);
    } else if (data.command == 'close' && requestAnimationFrameID) {
      cancelAnimationFrame(requestAnimationFrameID);
      requestAnimationFrameID = null
    } else if (data.command == 'loadRes' && !hasLoadRes) {
      /**
       * 加载资源函数
       * 只需要加载一次
       */
      // console.log('加载资源')
      preloadAssets();
    }
  });
}

addOpenDataContextListener();

/**
 * 循环函数
 * 每帧判断一下是否需要渲染
 * 如果被标脏，则重新渲染
 */
function loop() {
  if (renderDirty) {
    // console.log(`stageWidth :${stageWidth}   stageHeight:${stageHeight}`)
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
    drawRankPanel();
    renderDirty = false;
  }
  requestAnimationFrameID = requestAnimationFrame(loop);
}

/**
 * 图片绘制函数
 */
function context_drawImage(image, x, y, width, height) {
  if (image.width != 0 && image.height != 0 && context) {
    if (width && height) {
      context.drawImage(image, x, y, width, height);
    } else {
        context.drawImage(image, x, y, image.width, image.height);
    }
  }
}

function getUserCloudStorage(keyArr){
    return new Promise((resolve, reject) => {
        wx.getUserCloudStorage({
            keys: keyArr,
            success: function (res) {
                resolve(res);
            },
            fail: function (res) {
                reject(res);
            },
            complete: function (res) {
                reject(res);
            },
        })
    })
}
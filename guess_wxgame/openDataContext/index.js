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
  line: "openDataContext/assets/line.png",
  panel: "openDataContext/assets/panel.png",
  preBtn: "openDataContext/assets/preBtn.png",
  nextBtn: "openDataContext/assets/nextBtn.png",
  title: "openDataContext/assets/rankingtitle.png",
  top1: "openDataContext/assets/top1.png",
  top2: "openDataContext/assets/top2.png",
  top3: "openDataContext/assets/top3.png",
  star: "openDataContext/assets/star.png",
  rankback: "openDataContext/assets/rankback.png",
  box: "openDataContext/assets/box.png",
};

/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
let assets = {};

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
  { openid: '', avatarUrl: '', nickname: 'MY', KVDataList: [{ level: 200, time: 1000 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 101, time: 1000 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 102, time: 1700 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 103, time: 1800 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 104, time: 1900 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 105, time: 1070 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 106, time: 1030 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 107, time: 1010 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 108, time: 1020 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 109, time: 1030 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 121, time: 1040 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 112, time: 1050 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 130, time: 1060 }] },
  { openid: '', avatarUrl: '', nickname: 'peony', KVDataList: [{ level: 167, time: 1080 }] }
];

/**我的排行数据 */
let myRankInfo;
let myRank;

/**
 * 创建排行榜
 */
function drawRankPanel() {
  //绘制背景
  context_drawImage(assets.panel, offsetX_rankToBorder, offsetY_rankToBorder, rankWidth, rankHeight);

  //绘制标题
  const title = assets.title;
  //根据title的宽高计算一下位置;
  const titleW = getRightWidth(title.width);
  const titleH = getRightHeight(title.height, title.width);
  const titleX = offsetX_rankToBorder + (rankWidth - titleW) * 0.5;
  const titleY = offsetY_rankToBorder - titleH * 0.48;
  context_drawImage(title, titleX, titleY, titleW, titleH);
  
  //获取当前要渲染的数据组
   wx.getFriendCloudStorage({
      keyList: ["level"],
        success: function (res) {
            //console.log("好友数据",res);
            totalGroup = res.data;

            // 排序
            totalGroup.sort((a, b) => {
              let a_level = getLevelFromKVList(a.KVDataList);                
              let b_level = getLevelFromKVList(b.KVDataList);            
              if(a_level > b_level) return -1;
              else if (a_level == b_level) return 0;
              else return 1;
            });

            // 找到我的数据
            for (let i = 0, len = totalGroup.length; i < len; i++) {
             let info = totalGroup[i];
              if (info.avatarUrl == myAvatarUrl) {
                myRankInfo = info;
                myRank = i + 1;
              }
            }

            // 取前20
            totalGroup.slice(0, 20);

            // 预加载头像
            let urls = [];
            for (let i = 0, len = totalGroup.length; i < len; i++){
              urls.push(totalGroup[i].avatarUrl);
            }
            preloadAvatars(urls, () => {
                //起始id
                const startID = perPageMaxNum * page;
                currentGroup = totalGroup.slice(startID, startID + perPageMaxNum);
                // 列表
                drawRankByGroup(currentGroup);

                // 创建玩家自己排行条目         
                if(myRankInfo)     
                  drawByData(myRankInfo, perPageMaxNum, myRank);

                //创建按钮
                drawButton();
            })            
        },
        fail: function (res) {
            console.error("好友数据获取失败：", res);
        }
    })
}

/**
 * 绘制水平排行榜
 */
function drawRankByType(rankType){
  let dataArr;

  //获取当前要渲染的数据组
  wx.getFriendCloudStorage({
    keyList: ["level"],
    success: function (res) {
      dataArr = res.data;

      // 排序
      dataArr.sort((a, b) => {
        let a_level = getLevelFromKVList(a.KVDataList);
        let b_level = getLevelFromKVList(b.KVDataList);
        if (a_level > b_level) return -1;
        else if (a_level == b_level) return 0;
        else return 1;
      });

      // 找到我以及周围两个玩家
      let users = findUserArroundMe(dataArr);

      // 预加载头像
      let urls = [];
      for (let key in users) {
        urls.push(users[key].avatarUrl);
      }
      preloadAvatars(urls, () => {
        if(rankType == "horizontal")  
          drawRankHGroup(users);
        else if(rankType == "vertical")
          drawRankVGroup(users);
      });
    },
    fail: function (res) {
      console.error("好友数据获取失败：", res);
    }
  })
}


/**
 * 绘制垂直排行榜
 */
function drawRankHGroup(users) {
  let ds = avatarSize * 1.55; // 间距
  let middleX = (stageWidth - avatarSize) * 0.5;
  let startX = middleX;
  if(users.length > 1)
    startX = middleX - ds * 0.5;
  if (users.length > 2)
    startX = middleX - avatarSize * 1.55;

  let avatarY = stageHeight * 0.49;
  let txtY = avatarY + avatarSize * 1.4;

  context.textAlign = 'center';
  context.fillStyle = '#363636';
  context.font = "Bold " + getRightWidth(30) + "px Simhei";

  for(let i = 0; i < users.length; i++){
    drawRoundImage(assets[users[i].avatarUrl] || assets.icon, startX + ds * i, avatarY, avatarSize * 0.5, avatarSize, avatarSize);

    let level = getLevelFromKVList(users[i].KVDataList);
    context.fillText(level + ``, startX + ds * i + avatarSize * 0.5, txtY, avatarSize);
  }
}

/**
 * 绘制垂直排行榜
 */
function drawRankVGroup(users) {
  let startX = stageWidth * 0.84;
  let startY = stageHeight * 0.2;
  let avatarSize = getRightWidth(42);
  let ds = avatarSize * 1.4; // 间距

  context.textBaseline = "middle";
  context.textAlign = "left";
  context.fillStyle = '#FFFFFF';
  context.font = "Bold " + getRightWidth(26) + "px Simhei";

  for (let i = 0; i < users.length; i++) {
    context.drawImage(assets.rankback, startX - getRightWidth(3), startY + ds * i - getRightWidth(4), getRightWidth(150), getRightHeight(50, 150));
    drawRoundImage(assets[users[i].avatarUrl] || assets.icon, startX, startY + ds * i, avatarSize * 0.5, avatarSize, avatarSize);

    let level = getLevelFromKVList(users[i].KVDataList);
    context.fillText(level + ``, startX + avatarSize * 1.1, startY + ds * i + avatarSize * 0.5, avatarSize);

    startX += avatarSize * 0.2;
  }
}

// 找到我以及周围两个玩家
function findUserArroundMe(rankDatas){
  let result = [];
  for (let i = 0, len = rankDatas.length; i < len; i++) {
    let info = rankDatas[i];
    if (info.avatarUrl == myAvatarUrl) {
      if (rankDatas[i - 1])
        result.push(rankDatas[i - 1]);

      result.push(info);

      if (rankDatas[i + 1])
        result.push(rankDatas[i + 1]);
    }
  }
  return result;
}

function getRightWidth(w){
  return w / 720 * stageWidth;
}

function getRightHeight(h, refWidth){
  let rW = getRightWidth(refWidth);
  return rW / refWidth * h;
}

/**
 * 根据屏幕大小初始化所有绘制数据
 */
function init() {
  //排行榜绘制数据初始化,可以在此处进行修改
  rankWidth = getRightWidth(assets.panel.width);
  rankHeight = getRightHeight(assets.panel.height, assets.panel.width);
  offsetX_rankToBorder = (stageWidth - rankWidth) / 2;
  offsetY_rankToBorder = (stageHeight - rankHeight) / 2;
  preOffsetY = getRightWidth(102);
  textOffsetY = getRightWidth(20);
  lineOffsetY = getRightWidth(60);
  startX = offsetX_rankToBorder + getRightWidth(40);
  startY = offsetY_rankToBorder + preOffsetY;
  avatarSize = getRightWidth(71);
  intervalX = getRightWidth(50);
  textMaxSize = getRightWidth(150);
  indexWidth = context.measureText("998").width;

  //按钮绘制数据初始化
  buttonWidth = getRightWidth(236);
  buttonHeight = getRightHeight(88, 36);
  lastButtonX = offsetX_rankToBorder;
  nextButtonX = offsetX_rankToBorder + rankWidth - buttonWidth;
  nextButtonY = lastButtonY = offsetY_rankToBorder + rankHeight + buttonHeight * 0.15;  
  let data = wx.getSystemInfoSync();
  canvasWidth = data.windowWidth;
  canvasHeight = data.windowHeight;
}

/**
 * 创建两个点击按钮
 */
function drawButton() {
  context_drawImage(assets.nextBtn, nextButtonX, nextButtonY, buttonWidth, buttonHeight);
  context_drawImage(assets.preBtn, lastButtonX, lastButtonY, buttonWidth, buttonHeight);
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
function drawByData(data, i, myRank) {
  let x = startX;
  context.textBaseline = "alphabetic"; // 恢复默认垂直对其
  if(myRank){
    context_drawImage(assets.box, x - getRightWidth(13), startY + i * preOffsetY - avatarSize * 0.46, getRightWidth(505), getRightHeight(98, assets.box.width));
  }
  else{
    //绘制分割线
    context_drawImage(assets.line, x, startY + i * preOffsetY + lineOffsetY, getRightWidth(480), getRightHeight(2,assets.line.width));    
  }
  x += 10;

  //设置字体
  context.fillStyle = '#0084FF';
  context.font = "Bold " + getRightWidth(36) + "px Simhei";
  //绘制排名
  let num = page * perPageMaxNum + i + 1;
  if (num <= 3 || myRank <= 3){
    // 绘制奖牌
    let medalW = getRightWidth(50);
    context_drawImage(assets[`top${myRank || num}`], x - medalW * 0.26, startY + i * preOffsetY - medalW / 3, medalW, getRightHeight(60, medalW));
  }
  else{
    // 绘制序号
    context.fillText(`${myRank ? myRank : page * perPageMaxNum + i + 1}`, x, startY + i * preOffsetY + textOffsetY, textMaxSize);
  }
  x += indexWidth + intervalX;
  //绘制头像  
  drawRoundImage(assets[data.avatarUrl] || assets.icon, x, startY + i * preOffsetY - avatarSize / 3, avatarSize * 0.5, avatarSize, avatarSize);
  x += avatarSize + intervalX;

  //绘制名称
  context.fillStyle = '#0084FF';
  context.font = getRightWidth(30) + "px Simhei";
  context.fillText(data.nickname + "", x, startY + i * preOffsetY, textMaxSize);

  // 绘制段位
  let level = getLevelFromKVList(data.KVDataList);

  // 绘制段位名
  context.fillStyle = '#B7B7B7';
  context.font = getRightWidth(26) + "px Simhei";
  let info = getRankInfo(level);
  let rankOffsetY = getRightWidth(42);
  let rankW = context.measureText(info.desc).width;
  context.fillText(info.desc, x, startY + i * preOffsetY + rankOffsetY, rankW);
  // 绘制星星
  let starSize = getRightWidth(20);
  let starX = x + rankW;
  let starOffsetY = getRightWidth(23);
  for(let j = 0; j < info.star; j++){
    context_drawImage(assets.star, starX, startY + i * preOffsetY + starOffsetY, starSize, starSize);
    starX += starSize;
  } 

  x += textMaxSize + intervalX * 2;

  //绘制分数
  context.textAlign = "right";
  context.fillStyle = '#FFBB17';
  context.font = "Bold " + getRightWidth(36) + "px Simhei";  
  context.fillText(`${level}`, x, startY + i * preOffsetY + rankOffsetY, textMaxSize);
  context.fillStyle = '#B7B7B7';
  context.font = getRightWidth(24) + "px Simhei";
  x += getRightWidth(35);
  context.fillText(`题`, x, startY + i * preOffsetY + rankOffsetY, textMaxSize);
  context.textAlign = "left";
}

function getLevelFromKVList(data){
  let level = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].key == "level") {
      level = data[i].value;
      break;
    }
  }
  return parseInt(level);
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
  if (buttonKey == 0) {
    page--;
    renderDirty = true;
  } else if (buttonKey == 1) {
    page++;
    renderDirty = true;
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
 * 文本文字Y轴偏移量
 * 可以使文本相对于图片大小居中
 */
let textOffsetY;
let lineOffsetY;
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
    for (let idx in assetsUrl) {
      // 加载过
      if (assets[assetsUrl[idx]])
        continue;
       
      count++;
      const img = wx.createImage();
      img.onload = () => {
          preloaded++;
          if (preloaded == count) {
              cb();
          }
      }
      img.src = assetsUrl[idx];
      assets[assetsUrl[idx]] = img;
    }

    if(count == 0)
      cb();
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

/** 我的用户信息 */
let myAvatarUrl;
let myUserInfo;

/** 当前排行榜类型 */
let curRankType;


/*function getMyUserInfo(cb){
  wx.getUserInfo({
    withCredentials: true,
    success: function (res) {
      var userInfo = res.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender //性别 0：未知、1：男、2：女
      var province = userInfo.province
      var city = userInfo.city
      var country = userInfo.country
      resolve(userInfo);
    }
  })
}*/

/**
 * 增加来自主域的监听函数
 */
function addOpenDataContextListener() {
  console.log('增加监听函数')
  wx.onMessage((data) => {
    if (data.command == 'open') {
      if (data.rankType){
        curRankType = data.rankType;
        renderDirty = true;
        page = 0;
      }
      if (!myAvatarUrl && data.myAvatarUrl)
        myAvatarUrl = data.myAvatarUrl;
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
    if(curRankType == "list")
      drawRankPanel();
    else
      drawRankByType(curRankType);
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

// 获取段位
function getRankInfo(level){
  let self = this;
  let stage = 0;

  //40关一个段位
  let tmp = level / 40;   

  // 大段位名
  let stageName = "小学生";
  if (tmp > 1){
    stageName = "中等生";
    stage = 1;
  }
  if (tmp > 2){
    stageName = "优等生";
    stage = 2;
  }
  if (tmp > 3){
    stageName = "学霸";
    stage = 3;
  }
  if (tmp > 4){
    stageName = "超级学霸";
    stage = 4;
  }

  // 小段位星数 10关一个小等级
  let star = Math.ceil((level - stage * 40) / 10);
  return { star: star, desc: stageName};
}

// 画圆形图片
function drawRoundImage(image, x, y, r, width, height){
  context.save(); //保存上下文
  context.beginPath();//开始绘制

  //画一个圆
  context.arc(x + r, y + r, r, 0, 2 * Math.PI, false);

  context.clip();//裁剪这个圆
  
  //将图片绘制进圆
  context.drawImage(image, x, y, width, height);

  context.restore();//恢复上下文  接下来可以进行其他绘制操作
}
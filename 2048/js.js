var btn = $(".btn");
var mask = $(".mask");
btn[0].ontouchstart = function() {
    mask.animate({
        transform: "translateY(-700px)"
    }, 1000, 'linear', function() {
        mask[0].style.display = "none";
    })
}
var obj = {
    main: $(".main"),
    center: $(".center"),
    footer: $(".footer"),
    gameOverEl: $(".gameOver"),
    giveUp: $(".giveUp"),
    reGiveUp: $(".reGiveUp"),
    info: {
        2: [2, "#95a5a5"],
        4: [4, "#f1c40f"],
        8: [8, "#e67f22"],
        16: [16, "#e84c3d"],
        32: [32, "#2dcc70"],
        64: [64, "#9a59b5"],
        128: [128, "#01aaf9"],
        256: [256, "#0113f9"],
        512: [512, "ea00ff"],
        1024: [1024, "b0f901"]
    },
    arr: [2, 4, 8, 16, 32, 64],
    corse: 0, //分数
    over: true, //是否结束游戏
    giveUpNum: 0, //弃牌的数量
    init: function() {
        this.render();
        this.drag();
        this.corseFn();
    },
    //渲染结构
    render: function() {
        // 生成两个span
        var ul = this.main.children();


        this.center[0].appendChild(this.production("span").span);

        var el = this.production("span");
        el.span.className = "second";
        this.center[0].appendChild(el.span);

    },
    drag: function() {
        var span = this.center.children();
        this.dragFn(span[1]);
    },
    dragFn: function(el) {
        var iw = window.innerWidth;
        var iH = window.innerHeight;
        var self = this; //保存当前的this

        var ul = this.main.children();

        el.addEventListener("touchstart", function(e) {
                e.preventDefault();
                e.cancelBubble = true;
                e = e.targetTouches[0];
                // 到边距的距离
                var startLeft = el.getBoundingClientRect().left;
                var startTop = el.getBoundingClientRect().top;
                // 获取元素的left值和top值
                var leftDis = el.offsetLeft;
                var topDis = el.offsetTop;
                // 记录手指按下时的坐标
                var x = e.pageX;
                var y = e.pageY;
                //手指移动
                el.addEventListener("touchmove", function(e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    e = e.targetTouches[0];
                    // 手指按下时的坐标减去手指移动的坐标
                    var disx = (e.pageX - x) + leftDis;
                    var disy = e.pageY - y;

                    // 判断x方向是否越界
                    el.style.left = disx + "px";

                    if (el.getBoundingClientRect().left <= 20) {
                        disx = -(startLeft - el.clientWidth) - 20;

                    } else if (el.getBoundingClientRect().left >= (iw - el.offsetWidth - 20)) {
                        // 总宽度 - 开始时元素到左边的距离 - 自身的宽度 + 自身的left值
                        disx = iw - startLeft - el.offsetWidth + leftDis - 20;
                    }
                    // 判断y方向是否越界
                    if (disy < -self.main[0].offsetHeight) {
                        //是否小于main盒子的高度
                        disy = -self.main[0].offsetHeight;
                    } else if (disy > 0) {
                        disy = 0;
                    }
                    // 根据坐标给left top 赋值
                    el.style.left = disx + "px";
                    el.style.top = (disy + topDis) + "px";

                    // 碰撞
                    ul.each(function(i, data) {
                        var result = self.collision(el, data);
                        data.lastElementChild.className = "";
                        // 碰到的元素加上边框
                        if (result) {
                            result.className = "border";
                        }
                    })
                })
            })
            // 手指抬起
        el.addEventListener("touchend", function(e) {
            e.preventDefault();
            e.cancelBubble = true;
            var onoff = false;
            var li = [];
            // 鼠标抬起时，是否碰撞ul里的li
            ul.each(function(i, data) {
                var result = self.collision(el, data);
                if (result) {
                    li.push(result);
                    onoff = true;
                }
            });
            // 是否碰撞弃牌区
            var isGiveUp = self.collision(el, self.footer[0]);
            if (isGiveUp) {
                // 碰到了弃牌区
                if (self.giveUpNum <= 2) {
                    // 还没有丢弃三张牌

                    // 删除自己
                    $(el).remove();
                    // 操作span
                    self.operateSpan();
                    // 再次调用拖拽
                    self.drag();

                    // 弃牌下面的span
                    var span = $(".giveUp").children("span");
                    span.eq(self.giveUpNum).css({
                        height: "33.333%"
                    });
                    // 丢弃一张加一
                    self.giveUpNum++;

                } else {
                    // 超出了三张
                    self.reGiveUp.css({ //显示一个页面
                        display: "block",
                        opacity: 1
                    });
                    // 获取button按钮
                    var btn = self.reGiveUp.find("button");
                    btn.singleTap(function() {
                        var val = self.reGiveUp.find("input").val();
                        // 获取文本框输入的值
                        if (val == "帅") {
                            // 输入帅 ，就清空弃牌框
                            self.reGiveUp.css({
                                display: "none",
                            });
                            $(".giveUp").children("span").each(function(i, data) {
                                $(data).css("height", "0");
                                self.giveUpNum = 0;
                            })
                        } else {
                            //结束游戏
                            self.reGiveUp.css({
                                display: "none",
                            });
                            console.log(self.gameOver);
                            self.gameOverEl.css({
                                display: "block",
                                opacity: 0
                            })
                            self.gameOverEl.animate({
                                opacity: 1
                            }, 500, 'linear');

                        }
                    });
                }
            }

            if (li.length == 1 && onoff) { // 元素在元素上
                //判断当前ul是否已经有8个元素了
                if (li[0].parentNode.children.length == 8) {
                    // span回到原来的位置
                    $(el).css({
                            left: "93px",
                            top: "0px"
                        })
                        // 函数执行完毕
                    return;
                }
                var obj = self.production("span");

                // 生成新的span
                self.operateSpan();
                // 再调用拖拽函数
                self.drag();

                // 判断碰到的元素元素是否有值
                var firstEl = li[0].parentNode.firstElementChild;
                if (firstEl.innerHTML) { // 有值

                    var newli = self.production("li").li; //生成li
                    li[0].parentNode.appendChild(newli); //li插入到页面
                    //通过它在li里的位置给自己设置顶部距离
                    newli.style.top = $(newli).index() * 54 + "px";
                    //添加li的内容
                    newli.style.background = self.info[self.arr[el.n]][1];
                    //添加里的颜色
                    newli.innerHTML = self.info[self.arr[el.n]][0];

                    // 找到最后一个子元素
                    var lastEle = li[0].parentNode.lastElementChild;

                    check(lastEle)

                    function check(lastEl) {
                        var on = false;
                        // 如果有下一个
                        if (lastEl.previousElementSibling) {
                            var prev = lastEl.previousElementSibling; //找到它的上一个兄弟

                            // 如果它自己和它上一个兄弟的值相等
                            if (lastEl.innerHTML == prev.innerHTML) {
                                self.corse++; //分数
                                self.corseFn(); //调用添加分数的函数
                                lastEl.remove(); //把自己给删除
                                //上一个兄弟的值*2
                                prev.innerHTML = parseInt(prev.innerHTML) * 2;

                                // 改变颜色
                                prev.style.background = self.info[prev.innerHTML][1];

                                // 添加动画效果 
                                prev.style.transform = "scale(0)";
                                $(prev).animate({
                                    transform: "scale(1)"
                                }, 200, 'linear');
                                // 如果有到了1024则弹出奖励
                                if (prev.innerHTML == "1024") {
                                    self.reward();
                                }
                            }
                            check(prev); //再次调用

                        }
                    }

                } else {
                    // 没有值
                    firstEl.innerHTML = self.info[self.arr[el.n]][0];
                    firstEl.style.background = self.info[self.arr[el.n]][1];
                }
                // 删除自己
                $(el).animate({
                    transform: "scale(0.5)",
                    opacity: ".5"
                }, 200, 'linear')

                setTimeout(function() {
                    $(el).remove();
                }, 200)


                // 把li添加进去了，再看是否结束游戏
                self.gameOver();

            } else if (li.length > 1) {
                // 元素有多个返回到原来的位置
                $.each(li, function(i, data) {
                    data.className = "";
                })
                $(el).css({
                    left: "93px",
                    top: "0px"
                })
            } else {
                //没有在元素上 : 返回到原来的位置
                $(el).css({
                    left: "93px",
                    top: "0px"
                })
            }
        })
    },
    // 碰撞  origin : 当前元素    target: 目标元素   返回值:碰撞到的元素，或者false
    collision: function(obj, target) {
        var obj1 = target.lastElementChild;
        // 拿到量个元素的位置信息
        var pos_box = obj.getBoundingClientRect();
        var pos_box1 = obj1.getBoundingClientRect();

        // 绿色
        var l1 = pos_box.left;
        var r1 = pos_box.right;
        var t1 = pos_box.top;
        var b1 = pos_box.bottom;

        // 红色
        var l = pos_box1.left;
        var t = pos_box1.top;
        var r = pos_box1.right;
        var b = pos_box1.bottom;
        if (r >= l1 && b >= t1 && r1 >= l && t <= b1) {
            return obj1;
        } else {
            // 没有
            return false;
        }
    },
    // 生成元素
    production: function(el) {
        var self = this;

        var n = parseInt(Math.floor(Math.random() * 6));

        function El(el) {
            if (el == "span") {
                // 创建span标签
                var span = document.createElement("span");
                // 加内容
                span.innerHTML = self.info[self.arr[n]][0];
                // 加背景颜色
                span.style.background = self.info[self.arr[n]][1];
                //  添加一个自定义属性，保存数字
                span.n = n;
                // 挂载到对象上
                this.span = span;

            } else if (el == "li") {
                // 创建li标签
                var li = document.createElement("li");
                //  添加一个自定义属性，保存数字
                li.n = n;
                this.li = li;

            }
        }
        var obj = new El(el);
        return obj;
    },
    // 抬起的时候操作span
    operateSpan: function() {
        var one = this.center[0].children;
        one[0].className = "second trans";

        one[0].addEventListener("transitionend", function(e) {
            one[1].className = "second";
        })
        one[0].addEventListener("WebkitTransitionend", function(e) {
            one[1].className = "second";
        })

        this.center[0].insertBefore(this.production("span").span, one[0]);


    },
    //生成分数
    corseFn: function() {
        var corse = $(".corse");
        corse.html(this.corse);
    },
    // 游戏结束
    gameOver: function() {
        var ul = this.main.children();
        var onoff = true;

        ul.each(function(i, data) {
            // 判断每一个ul中的子元素是否都是8个

            if (data.children.length != 8) {
                onoff = false; // 结束游戏的标志
            }
        })
        if (onoff) {
            this.gameOverEl.css({
                display: "block",
                opacity: 0
            })
            this.gameOverEl.animate({
                opacity: 1
            }, 500, 'linear')
        }
    },
    // 奖励
    reward: function() {
        var reward = $(".reward");
        var pig = reward.children(".pig");
        reward.css({
            display: "block",
        })
        pig.css({
            animation: " bg 1s"
        })
        setTimeout(function() {
            pig.css({
                background: "url(./img/pig.jpg)",
                animation: " pig 1s infinite alternate"
            })
            pig.children().css({
                display: "block"
            })

        }, 1500)

        setTimeout(function() {
            reward.css({
                display: "none",
            })
            pig.css({
                background: "url(./img/bg.jpeg)",
                animation: ""
            })
            pig.children().css({
                display: "none"
            })
        }, 2500)
    }
}
obj.init();
var obj = {
    audio: document.querySelector("audio"),
    box: document.querySelector(".box"),
    sing: document.querySelector(".sing"),
    begin: document.querySelector(".begin"),
    timer: null,
    corse: 0,
    init: function() {
        this.beginGame();
        this.setHeight();
        this.start();
    },
    setHeight: function() {
        var ih = window.innerHeight;
        this.box.style.height = ih + "px";
    },
    beginGame: function() {
        var boxHeight = this.box.offsetHeight;
        var self = this;
        var child = self.box.children;
        var num = 0;
        var item = document.querySelectorAll(".item");
        for (var i = 0; i < item.length; i++) {
            item[i].ontouchstart = function(e) {
                // 点击调用
                self.clickSpan(e.target);
            }
        }

        this.start = function() {
            // 放音乐,给开始按钮添加监听，
            this.begin.addEventListener('touchend', function() {
                self.playMusic();
            })
        };
        // 点击开始游戏
        this.begin.ontouchstart = function() {
            var n = 0;
            var spend = 8; //速度
            self.timer = setInterval(function() {
                n = n + spend;
                for (var i = 0; i < child.length; i++) {
                    // 每一个元素平移
                    child[i].style.transform = "translateY(" + n + "px)";
                    if (child[i].getBoundingClientRect().top >= (boxHeight - 28)) { // 删除满足条件的
                        // 删除当前满足条件的
                        child[i].remove();
                        // n重新赋值为0
                        n = 0;
                        var first = self.box.firstElementChild;
                        var div = self.pruduce();
                        // 生成元素插入到第一个
                        self.box.insertBefore(div, first);
                        // // 重新获取里面的子元素
                        child = self.box.children;
                        // 把重新获取到的子元素平移改为0
                        for (var j = 0; j < child.length; j++) {
                            child[j].style.transform = "translateY(" + n + "px)";
                        }
                        //速度在自身的基础上加0.1
                        spend += 0.1;
                    }
                }
            }, 20)
        }
    },
    // 播放音乐
    playMusic: function() {
        if (this.audio.paused) {
            this.audio.play();
        }
    },
    // 判断点击的是什么
    clickSpan: function(el) {
        var that = this;
        // 点到黑块
        if (el.className == "bg" || el.className == "begin") {
            el.className = "hide";
            this.corse++;
            this.sing.firstElementChild.innerHTML = "分数：" + this.corse
        } else {

            //不是黑快，结束游戏
            clearInterval(this.timer);
            // 关闭音乐
            el.addEventListener("touchend", function() {
                that.audio.pause();
            })
        }
    },
    // 生成出div
    pruduce: function() {
        var self = this;
        var n = Math.floor(Math.random() * 4);
        var div = document.createElement("div");
        div.className = "item";
        for (var i = 0; i < 4; i++) {
            var span = document.createElement("span");
            div.appendChild(span);
        }
        div.children[n].className = "bg";
        // 给每一个div添加点击事件
        div.ontouchstart = function(e) {
            self.clickSpan(e.target)
        }
        return div;
    }

}
obj.init();
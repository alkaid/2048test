/**
 * Created by huangyi03 on 2014/10/9.
 */

var GPBackgroundLayer = cc.LayerColor.extend({

    ctor: function (color) {

        this._super(color);

        this.initBackground();

    },

    initBackground: function () {
        var menuBg, gridBg, tileBg,
            size = GC.size, // 每行tile个数
            gridWidth = GC.w - GC.gridMargin, //网格宽度
            tileWidth = GC.tileWidth, // tile的宽度
            gap = GC.gap, //tile间距是16
            gridY = GC.h - 140, //网格Y坐标
            texSource = cc.textureCache.addImage(res.soucre_png),
            texSourceBatch = new cc.SpriteBatchNode(texSource);

        //menu背景
        menuBg = new cc.Sprite("#menu.png");
        menuBg.attr({
            x: GC.centerX,
            y: GC.h-60.5
        });
        this.addChild(menuBg);

        //游戏区背景
        gridBg = new cc.Scale9Sprite("background.png");
        gridBg.attr({
            x:  GC.centerX,
            y: gridY - gridWidth / 2,
            width: gridWidth,
            height: gridWidth
        });
        this.addChild(gridBg);


        //创建tile背景
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                tileBg = new cc.Sprite("#backtile.png");
                tileBg.attr({
                    x: (tileWidth + gap) * x + gap + tileWidth / 2+ GC.centerX-gridWidth/2,
                    y: gridY - (tileWidth + gap) * y - gap - tileWidth / 2,
                    scale:GC.wscale
                });
                texSourceBatch.addChild(tileBg);
            }
        }
        this.addChild(texSourceBatch);

    }
});
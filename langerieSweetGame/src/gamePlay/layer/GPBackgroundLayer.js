/**
 * Created by huangyi03 on 2014/10/9.
 */

var GPBackgroundLayer = cc.LayerColor.extend({

    ctor: function (color) {

        this._super(color);

        this.initBackground();

    },

    initBackground: function () {
        var bg,menuBg, gridBg, tileBg,
            size = GC.size, // 每行tile个数
            //gridWidth = GC.gridWidth, //网格宽度
            tileWidth = GC.tileWidth, // tile的宽度
            gap = GC.gap, //tile间距是16
            //gridY = 0, //网格Y坐标
            texSource = cc.textureCache.addImage(res.soucre_png),
            texSourceBatch = new cc.SpriteBatchNode(texSource);

        //整体背景
        //bg = new cc.Scale9Sprite("res/source/bgcell.png");
        //bg.attr({
        //    x:  GC.centerX,
        //    y:  GC.centerY,
        //    width: GC.w,
        //    height: GC.h
        //});
        //this.addChild(bg);
        bg = cc.Sprite.create("res/source/bg.png");
        bg.attr({
            x:  GC.centerX,
            y:  GC.centerY
        });
        this.addChild(bg);
        //GC.spriteTileRepeat(bg);


        //menu背景
        menuBg = new cc.Sprite("#menu.png");
        menuBg.attr({
            x: GC.centerX,
            y: GC.h-60.5
        });
        this.addChild(menuBg);

        //游戏区背景
        gridBg = cc.Scale9Sprite.create("background.png");
        gridBg.attr({
            x:  GC.centerX,
            y:  GC.gridMarginBottom + GC.gridWidth / 2,
            width: GC.gridWidth,
            height: GC.gridWidth
        });
        this.addChild(gridBg);


        //创建tile背景
        var i=0;
        var tileIndexs=new Array(1,2,1,2, 2,3,2,3, 1,2,1,2,  2,3,2,3);
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                //tileBg = new cc.Sprite("#backtile.png");
                tileBg = new cc.Sprite("#backtile"+tileIndexs[i++]+".png");
                tileBg.attr({
                    x: (tileWidth + gap) * x + gap + tileWidth / 2+ GC.tileStartX,
                    y: GC.tileStartY - (tileWidth + gap) * y - gap - tileWidth / 2
                });
                texSourceBatch.addChild(tileBg);
                //this.addChild(tileBg);
            }
        }
        this.addChild(texSourceBatch);

    }
});
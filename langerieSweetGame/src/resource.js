var res = {
    source_plist : "res/source/source.plist",
    soucre_png : "res/source/source.png",

    nums_plist : "res/nums/nums.plist",
    nums_png : "res/nums/nums.png",

    welcome_bg : "res/source/welcome_bg.jpg",
    main_bg : "res/source/bg.png",

    fnt_numbers : "res/fonts/numbers.fnt",

    audio_loop : "res/audio/loop.mp3",
    audio_appear1 : "res/audio/appear1.mp3",
    audio_appear2 : "res/audio/appear2.mp3",
    audio_UI_Click : "res/audio/UI_Click.mp3",
    audio_slide : "res/audio/slide.mp3",
    audio_starappear : "res/audio/starappear.mp3",
    audio_lost : "res/audio/lost.mp3",
    audio_star : "res/audio/star.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
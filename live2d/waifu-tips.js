/*
 * https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02
 * https://www.fghrsh.net/post/123.html
 */

function initWidget(waifuPath, apiPath) {
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	$("body").append(`<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="300" height="300"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-info-circle"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);
	$("#waifu").show().animate({bottom: 0}, 3000);
	$("#waifu-tool .fa-comment").click(showHitokoto);
	$("#waifu-tool .fa-paper-plane").click(function () {
		var s = document.createElement("script");
		document.body.appendChild(s);
		s.src = "https://galaxymimi.com/js/asteroids.js";
	});
	$("#waifu-tool .fa-user-circle").click(loadOtherModel);
	$("#waifu-tool .fa-street-view").click(loadRandModel);
	$("#waifu-tool .fa-camera-retro").click(function () {
		showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
		window.Live2D.captureName = "photo.png";
		window.Live2D.captureFrame = true;
	});
	$("#waifu-tool .fa-info-circle").click(function () {
		window.open("https://www.cnblogs.com/zouwangblog/p/11194299.html");
	});
	$("#waifu-tool .fa-times").click(function () {
		localStorage.setItem("waifu-display", new Date().getTime());
		showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
		$("#waifu").animate({bottom: -500}, 3000, function () {
			$("#waifu").hide();
			$("#waifu-toggle").show().animate({"margin-left": -50}, 1000);
		});
	});
	var re = /x/;
	console.log(re);
	re.toString = function () {
		showMessage("哈哈，你打开了控制台，是想要看看我的秘密吗？", 6000, 9);
		return "";
	};
	$(document).on("copy", function () {
		showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
	});
	$(document).on("visibilitychange", function () {
		if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
	});
	(function () {
		// var SiteIndexUrl = location.port ? `${location.protocol}//${location.hostname}:${location.port}/` : `${location.protocol}//${location.hostname}/`,//自动获取主页

		var SiteIndexUrl = 'https://www.cnblogs.com/zouwangblog/',
				text;// 手动指定主页
		if (location.href == SiteIndexUrl) { //如果是主页
			var now = new Date().getHours();
			if (now > 23 || now <= 5) text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
			else if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
			else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
			else if (now > 11 && now <= 14) text = "中午了，工作了一个上午，现在是午餐时间！";
			else if (now > 14 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
			else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
			else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";
			else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
			else text = "好久不见，日子过得好快呢……";
		}
		else if (document.referrer !== "") {
			var referrer = document.createElement("a");
			referrer.href = document.referrer;
			var domain = referrer.hostname.split(".")[1];
			if (location.hostname == referrer.hostname) text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
			else if (domain == 'baidu') text = 'Hello！来自 百度搜索 的朋友<br/>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？';
			else if (domain == 'so') text = 'Hello！来自 360搜索 的朋友<br/>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？';
			else if (domain == 'google') text = 'Hello！来自 谷歌搜索 的朋友<br/>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
			else text = 'Hello！来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友';
		}
		else text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
		showMessage(text, 7000, 8);
	})();
	//检测用户活动状态，并在空闲时定时显示一言
	var userAction = false,
			hitokotoTimer = null,
			messageTimer = null,
			messageArray = ["已经过了这么久了呀，日子过得好快呢……", "使用Chrome可以获得最佳浏览体验哦！", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"],
			apiURL = "";
	if ($(".fa-share-alt").is(":hidden")) messageArray.push("记得把小家加入Adblock白名单哦！");
	$(document).mousemove(function () {
		userAction = true;
	}).keydown(function () {
		userAction = true;
	});
	setInterval(function () {
		if (!userAction) {
			if (!hitokotoTimer) hitokotoTimer = setInterval(showHitokoto, 25000);
		}
		else {
			userAction = false;
			clearInterval(hitokotoTimer);
			hitokotoTimer = null;
		}
	}, 1000);

	function showHitokoto() {
		//增加 hitokoto.cn 的 API
		if (Math.random() < 0.6 && messageArray.length > 0) showMessage(messageArray[Math.floor(Math.random() * messageArray.length)], 6000, 9);
		else $.getJSON("https://v1.hitokoto.cn", function (result) {
			var text = `这句一言来自 <span style="color:#0099cc;">『${result.from}』</span>，是 <span style="color:#0099cc;">${result.creator}</span> 在 hitokoto.cn 投稿的。`;
			showMessage(result.hitokoto, 6000, 9);
			setTimeout(function () {
				showMessage(text, 4000, 9);
			}, 6000);
		});
	}

	function showMessage(text, timeout, priority) {
		//console.log(text, timeout, priority);
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
			//console.log(text);
			sessionStorage.setItem("waifu-text", priority);
			$("#waifu-tips").stop().html(text).fadeTo(200, 1);
			messageTimer = setTimeout(function () {
				sessionStorage.removeItem("waifu-text");
				$("#waifu-tips").fadeTo(1000, 0);
			}, timeout);
		}
	}

	var waifuPath = {
		"waifu": {
			"console_open_msg": ["哈哈，你打开了控制台，是想要看看我的秘密吗？"],
			"copy_message": ["你都复制了些什么呀，转载要记得加上出处哦"],
			"screenshot_message": ["照好了嘛，是不是很可爱呢？"],
			"hidden_message": ["我们还能再见面的吧…"],
			"load_rand_textures": ["我还没有其他衣服呢", "我的新衣服好看嘛"],
			"hour_tips": {
				"t5-7": ["早上好！一日之计在于晨，美好的一天就要开始了"],
				"t7-11": ["上午好！工作顺利嘛，不要久坐，多起来走动走动哦！"],
				"t11-14": ["中午了，工作了一个上午，现在是午餐时间！"],
				"t14-17": ["午后很容易犯困呢，今天的运动目标完成了吗？"],
				"t17-19": ["傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~"],
				"t19-21": ["晚上好，今天过得怎么样？"],
				"t21-23": ["已经这么晚了呀，早点休息吧，晚安~"],
				"t23-5": ["你是夜猫子呀？这么晚还不睡觉，明天起的来嘛"],
				"default": ["嗨~ 快来逗我玩吧！"]
			},
			"referrer_message": {
				"localhost": ["欢迎阅读<span style=\"color:#0099cc;\">『", "』</span>", " - "],
				"baidu": ["Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style=\"color:#0099cc;\">", "</span> 找到的我吗？"],
				"so": ["Hello! 来自 360搜索 的朋友<br>你是搜索 <span style=\"color:#0099cc;\">", "</span> 找到的我吗？"],
				"google": ["Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style=\"color:#0099cc;\">『", "』</span>", " - "],
				"default": ["Hello! 来自 <span style=\"color:#0099cc;\">", "</span> 的朋友"],
				"none": ["欢迎阅读<span style=\"color:#0099cc;\">『", "』</span>", " - "]
			},
			"referrer_hostname": {
				"example.com": ["示例网站"],
				"www.fghrsh.net": ["FGHRSH 的博客"]
			},
			"model_message": {
				"1": ["来自 Potion Maker 的 Pio 酱 ~"],
				"2": ["来自 Potion Maker 的 Tia 酱 ~"]
			},
			"hitokoto_api_message": {
				"lwl12.com": ["这句一言来自 <span style=\"color:#0099cc;\">『{source}』</span>", "，是 <span style=\"color:#0099cc;\">{creator}</span> 投稿的", "。"],
				"fghrsh.net": ["这句一言出处是 <span style=\"color:#0099cc;\">『{source}』</span>，是 <span style=\"color:#0099cc;\">FGHRSH</span> 在 {date} 收藏的！"],
				"jinrishici.com": ["这句诗词出自 <span style=\"color:#0099cc;\">《{title}》</span>，是 {dynasty}诗人 {author} 创作的！"],
				"hitokoto.cn": ["这句一言来自 <span style=\"color:#0099cc;\">『{source}』</span>，是 <span style=\"color:#0099cc;\">{creator}</span> 在 hitokoto.cn 投稿的。"]
			}
		},
		"mouseover": [
			{
				"selector": "#waifu-tool .fa-paper-plane",
				"text": ["要不要来玩飞机大战？", "这个按钮上写着“不要点击”。", "怎么，你想来和我玩个游戏？", "听说这样可以蹦迪！"]
			},
			{"selector": ".postTitle a[href^='http']", "text": ["要看看 <span style=\"color:#0099cc;\">{text}</span> 么？"]},
			{"selector": ".fui-home", "text": ["点击前往首页，想回到上一页可以使用浏览器的后退功能哦"]},
			{"selector": "#waifu-tool .fa-comment", "text": ["猜猜我要说些什么？", "我从青蛙王子那里听到了不少人生经验。"]},
			{"selector": "#waifu-tool .fa-user-circle", "text": ["嗯··· 要切换 看板娘 吗？"]},
			{"selector": "#waifu-tool .fa-street-view", "text": ["喜欢换装 Play 吗？"]},
			{"selector": "#waifu-tool .fa-camera-retro", "text": ["要拍张纪念照片吗？"]},
			{"selector": "#waifu-tool .fa-info-circle", "text": ["这里有关于我的信息呢"]},
			{"selector": ".fui-cross", "text": ["你不喜欢我了吗..."]},
			{ "selector": ".esa-profile-avatar", "text": ["这是主人的宝贝呢"] },
			{ "selector": "#blog_nav_myhome", "text": ["想要回首页看看么"] },
			{ "selector": "#blog_nav_contact", "text": ["这里可以联系到主人呢"] },
			{ "selector": "#blog_nav_myguanyu", "text": ["这里可以详细了解主人哦"] },
			{ "selector": "#blog_nav_myyoulian", "text": ["想要添加个<span style=\"color:#0099cc;\">友链</span>嘛"] },
			{"selector": "#comment_go", "text": ["想要去评论些什么吗？"]},
			{"selector": "#night_mode", "text": ["深夜时要爱护眼睛呀"]},
			{ "selector": ".esa-toolbar .esa-toolbar-follow", "text": ["你抓到我了哦嘻嘻嘻ψ(｀∇´)ψ"] },
			{"selector": "#div_digg .favorite", "text": ["喜欢就收藏吧，不要被主人发现了"]},
			{"selector": ".comment_reply", "text": ["要吐槽些什么呢"]},
			{"selector": "#div_digg .buryit", "text": ["不要哇,不要点反对鸭(哭哭)"]},
			{"selector": "#author", "text": ["该怎么称呼你呢"]},
			{"selector": "#div_digg .diggit", "text": ["如果觉得我家主人写的不错的话，点个赞鸭"]},
			{"selector": "#div_digg .reward", "text": ["哇,你要给我买糖果吗"]},
			{"selector": "div.commentform textarea", "text": ["认真填写哦，窝家主人会认真看哒"]},
			{"selector": ".aplayer.aplayer-fixed.aplayer-narrow .aplayer-body", "text": ["想要听点音乐吗？"]},
			{"selector": ".aplayer.aplayer-fixed .aplayer-lrc", "text": ["有歌词的话，窝家主人说你也可以跟着唱~"]},
			{"selector": ".av", "text": ["快把你的小爪子拿开！"]},
			{"selector": "input[name=s]", "text": ["找不到想看的内容？搜索看看吧"]},
			{"selector": ".previous", "text": ["去上一页看看吧"]},
			{"selector": ".next", "text": ["去下一页看看吧"]},
			{"selector": "#cnblogs_post_body img", "text": ["点击图片可以放大呢"]},
			{"selector": ".aplayer-pic", "text": ["想要听点音乐吗"]},
			{ "selector": ".aplayer-bar-wrap", "text": ["在这里可以调整<span style=\"color:#0099cc;\">播放进度</span>呢"] },
			{ "selector": ".aplayer-icon-back", "text": ["在这里可以切换到<span style=\"color:#0099cc;\">上一首</span>呢"] },
			{ "selector": ".aplayer-icon-forward", "text": ["在这里可以切换到<span style=\"color:#0099cc;\">下一首</span>呢"] },
			{ "selector": ".aplayer-volume-wrap", "text": ["在这里可以调整<span style=\"color:#0099cc;\">音量</span>呢"] },
			{ "selector": ".aplayer-icon-menu", "text": ["<span style=\"color:#0099cc;\">播放列表</span>里都有什么呢"] },
			{ "selector": ".aplayer .aplayer-fixed .aplayer-lrc", "text": ["有歌词的话，窝家主人说你也可以跟着唱~"] },
			{"selector": "#waifu #live2d", "text": ["干嘛呢你，快把手拿开", "鼠…鼠标放错地方了！"]}
		],
		"click": [
			{
				"selector": "#waifu #live2d",
				"text": [
					"是…是不小心碰到了吧",
					"萝莉控是什么呀",
					"你看到我的小熊了吗",
					"再摸的话我可要报警了！⌇●﹏●⌇",
					"110吗，这里有个变态一直在摸我(ó﹏ò｡)"
				]
			}
		],
		"seasons": [
			{"date": "01/01", "text": ["<span style=\"color:#0099cc;\">元旦</span>了呢，新的一年又开始了，今年是{year}年~"]},
			{"date": "02/14", "text": ["又是一年<span style=\"color:#0099cc;\">情人节</span>，{year}年找到对象了嘛~"]},
			{"date": "03/08", "text": ["今天是<span style=\"color:#0099cc;\">妇女节</span>！"]},
			{"date": "03/12", "text": ["今天是<span style=\"color:#0099cc;\">植树节</span>，要保护环境呀"]},
			{"date": "04/01", "text": ["悄悄告诉你一个秘密~<span style=\"background-color:#34495e;\">今天是愚人节，不要被骗了哦~</span>"]},
			{"date": "05/01", "text": ["今天是<span style=\"color:#0099cc;\">五一劳动节</span>，计划好假期去哪里了吗~"]},
			{"date": "06/01", "text": ["<span style=\"color:#0099cc;\">儿童节</span>了呢，快活的时光总是短暂，要是永远长不大该多好啊…"]},
			{"date": "09/03", "text": ["<span style=\"color:#0099cc;\">中国人民抗日战争胜利纪念日</span>，铭记历史、缅怀先烈、珍爱和平、开创未来。"]},
			{"date": "09/10", "text": ["<span style=\"color:#0099cc;\">教师节</span>，在学校要给老师问声好呀~"]},
			{"date": "10/01", "text": ["<span style=\"color:#0099cc;\">国庆节</span>，新中国已经成立69年了呢"]},
			{"date": "11/05-11/12", "text": ["今年的<span style=\"color:#0099cc;\">双十一</span>是和谁一起过的呢~"]},
			{"date": "12/20-12/31", "text": ["这几天是<span style=\"color:#0099cc;\">圣诞节</span>，主人肯定又去剁手买买买了~"]}
		]
	};

	function initModel() {
		//waifuPath = waifuPath || "/waifu-tips.json";
		waifuPath = waifuPath;

		apiURL = apiPath || "";
		var modelId = localStorage.getItem("modelId"),
				modelTexturesId = localStorage.getItem("modelTexturesId");
		if (modelId == null) {
			//首次访问加载 指定模型 的 指定材质
			var modelId = 25, //模型 ID
					modelTexturesId = 0; //材质 ID
		}
		loadModel(modelId, modelTexturesId);

		$.each(waifuPath.mouseover, function (index, tips) {
			$(document).on("mouseover", tips.selector, function () {
				var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
				text = text.replace("{text}", $(this).text());
				showMessage(text, 4000, 8);
			});
		});
		$.each(waifuPath.click, function (index, tips) {
			$(document).on("click", tips.selector, function () {
				var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
				text = text.replace("{text}", $(this).text());
				showMessage(text, 4000, 8);
			});
		});
		$.each(waifuPath.seasons, function (index, tips) {
			var now = new Date(),
					after = tips.date.split("-")[0],
					before = tips.date.split("-")[1] || after;
			if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
				var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
				text = text.replace("{year}", now.getFullYear());
				//showMessage(text, 7000, true);
				messageArray.push(text);
			}
		});

	}

	function loadModel(modelId, modelTexturesId) {
		localStorage.setItem("modelId", modelId);
		if (modelTexturesId === undefined) modelTexturesId = 0;
		localStorage.setItem("modelTexturesId", modelTexturesId);
		loadlive2d("live2d", `${apiURL}/get/?id=${modelId}-${modelTexturesId}`, console.log("live2d", `模型 ${modelId}-${modelTexturesId} 加载完成`));
	}

	function loadRandModel() {
		var modelId = localStorage.getItem("modelId"),
				modelTexturesId = localStorage.getItem("modelTexturesId");
		//可选 "rand"(随机), "switch"(顺序)
		$.ajax({
			cache: false,
			url: `${apiURL}/rand_textures/?id=${modelId}-${modelTexturesId}`,
			dataType: "json",
			success: function (result) {
				if (result.textures["id"] == 1 && (modelTexturesId == 1 || modelTexturesId == 0)) showMessage("我还没有其他衣服呢！", 4000, 10);
				else showMessage("我的新衣服好看嘛？", 4000, 10);
				loadModel(modelId, result.textures["id"]);
			}
		});
	}

	function loadOtherModel() {
		var modelId = localStorage.getItem("modelId");
		$.ajax({
			cache: false,
			url: `${apiURL}/switch/?id=${modelId}`,
			dataType: "json",
			success: function (result) {
				loadModel(result.model["id"]);
				showMessage(result.model["message"], 4000, 10);
			}
		});
	}

	initModel();
}

function loadWidget(config) {
	if (screen.width <= 768) return;
	$("body").append(`<div id="waifu-toggle" style="margin-left: -100px;">
			<span>看板娘</span>
		</div>`);
	$("#waifu-toggle").hover(function () {
		$("#waifu-toggle").animate({"margin-left": -30}, 500);
	}, function () {
		$("#waifu-toggle").animate({"margin-left": -50}, 500);
	}).click(function () {
		$("#waifu-toggle").animate({"margin-left": -100}, 1000, function () {
			$("#waifu-toggle").hide();
		});
		if ($("#waifu-toggle").attr("first-time")) {
			initWidget.apply(null, config);
			$("#waifu-toggle").attr("first-time", false);
		}
		else {
			localStorage.removeItem("waifu-display");
			$("#waifu").show().animate({bottom: 0}, 3000);
		}
	});
	if (localStorage.getItem("waifu-display")) {
		if (new Date().getTime() - localStorage.getItem("waifu-display") <= 86400000) {
			$("#waifu-toggle").attr("first-time", true).css({"margin-left": -50});
			//var s = document.createElement("script");
			//document.body.appendChild(s);
			//s.src = "https://galaxymimi.com/js/balloon.min.js";
			return;
		}
	}
	setTimeout(function () {
		initWidget.apply(null, config);
	}, 5000);
}

window.addEventListener("load", function () {
	//loadWidget(["/lib/waifu/waifu-tips.json", "https://api.galaxymimi.com/live2d"]);
	loadWidget(["", "https://api.galaxymimi.com/live2d"]);
	//https://live2d.fghrsh.net/api
});
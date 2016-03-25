var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

function Animation(context)
{
	var ctx = context;
	var sprites = Array();
	var current = -1;
	this.x = 0;
	this.y = 0;
	this.AddSprite = function(path)
	{
		var img = new Image();
		img.onload = function()
		{
			sprites.push(img);
			if(current < 0){ current = 0; }
		}
		img.src = path;
	}
	this.Step = function()
	{
		if(current < 0) return;
		if(current < (sprites.length - 1))
		{
			current++;
		}
		else
		{
			current = 0;
		}
	}
	var _x = 0;
	var _y = 0;
	this.Render = function()
	{
		if(current >= 0)
		{
			var sp = sprites[current];
			_x = Math.min(_x+1, this.x);
			_y = Math.min(_y+1, this.y);
			ctx.drawImage(sp, _x, _y);
		}
	}
	this.SetPosition = function(pos_x, pos_y)
	{
		_x = this.x = pos_x;
		_y = this.y = pos_y;
	}
	this.GetPosX = function(){ return _x; }
	this.GetPosY = function(){ return _y; }
}

var Reset = function()
{
	score = 0;
	p.x = 30;
	p.SetPosition(30, p.y);
	for(var i = 0; i < 4; i++)
	{
		var bot = bots[i];
		bot.SetPosition(30, bot.y);
	}
	isStart = 0;
	txt = "按‘E’可赛艇";
}

var timeLast = 0;
var Update = function()
{
	var timeNow = new Date().getTime() / 1000;
	if((timeNow - timeLast) > 0.1)
	{
		if(isStart == 1)
		{
			for(var i = 0; i < 4; i++)
			{
				var bot = bots[i];
				var num= Math.random() * 10;
				if(num > 5)
				{
					bot.x = Math.min(bot.x + 10, 600);
					bot.Step();
					if(bot.GetPosX() >= 600)
					{
						End(false);
					}
				}
			}
		}
		
		timeLast = timeNow;
	}
}

var Render = function()
{
	bg.Render();
	p.Render();
	for(var i = 0; i < 4; i++)
	{
		var bot = bots[i];
		bot.Render();
	}
	ctx.fillStyle = "#FFD84F";  
    ctx.font = "25px 微软雅黑";  
    ctx.textAlign = "center";  
    ctx.textBaseline = "top";  
    ctx.fillText(txt, 350, 520);  
}

var End = function(isWin)
{
	isStart = 2;
	for(var i = 0; i < 4; i++)
	{
		var bot = bots[i];
	}
	if(isWin)
	{
		if(score < 30)
		{
			txt = "一个基佬，怎么就拿了第一呢。"
		}
		else if(score >= 30 && score < 50)
		{
			txt = "已经研究决定了，由你得第一。"
		}
		else if(score >= 50 && score < 70)
		{
			txt = "Exciting!"
		}
		else if(score >= 70)
		{
			txt = "你比香港记者划得还要快！"
		}
	}
	else
	{
		if(score < 10)
		{
			txt = "拙计啊。";
		}
		else if(score >= 10 && score < 30)
		{
			txt = "图样图森破。"
		}
		else if(score >= 30 && score < 50)
		{
			txt = "美国的运动员比你不知道要高到哪里去了。";
		}
		else if(score >= 50)
		{
			txt = "你们划水界还是要多学习一个。";
		}
	}
	txt += "请按回车重新开始";
}

var score = 0;
addEventListener("keydown", function (e) 
{
	if(isStart == 1)
	{
		if(e.keyCode == 69)
		{
			p.x = Math.min(p.x + 10, 600);
			score++;
			p.Step();
			if(p.GetPosX() >= 600)
			{
				End(true);
			}
		}
	}
	else if(isStart == 0)
	{
		// start game
		if(e.keyCode == 69)
		{
			isStart = 1;
			txt = "'E'前进";
			for(var i = 0; i < 4; i++)
			{
				var bot = bots[i];
			}
		}
	}
	else if(isStart == 2)
	{
		if(e.keyCode == 13)
		{
			Reset();
		}
	}
}, false);

var main = function () 
{
	Update();
	Render();

	requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var bg = new Animation(ctx);
bg.AddSprite("images/bg.png");

var p = new Animation(ctx);
p.AddSprite("images/player1.png");
p.AddSprite("images/player2.png");
p.SetPosition(p.x, 30);
var bots = new Array();
for(var i = 0; i < 4; i++)
{
	var sp = new Animation(ctx);
	sp.AddSprite("images/bot1.png");
	sp.AddSprite("images/bot2.png");
	sp.SetPosition(sp.x, 100 * i + 130);
	bots.push(sp);
}

var isStart = 0; // 0 - 未开始，1 - 开始，2 - 结束
var txt = "\0";

Reset();
main();

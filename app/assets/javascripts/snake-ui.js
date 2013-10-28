console.log("Think this is cool? Get in touch at jhamon@gmail.com");

(function () {
  var SnakeGame = window.SnakeGame = (window.SnakeGame || {});

  var View = SnakeGame.View = function ($el) {
    this.$el = $el;
  };

  var adjustCSS = function () {
    var width = window.innerWidth;
    var tileSize = (window.innerHeight-200)/30;
    var marginTop = (window.innerHeight - tileSize*30-60)/2
    var $board = $('.board');
    var $tile = $('.tile');
    $board.css('margin-top', marginTop);
    $board.css('margin-left', marginTop);
    $board.css('margin-right', marginTop);
    $board.css('width', tileSize*30+60);
    $board.css('height', tileSize*30+31);
    $tile.css('width', tileSize);
    $tile.css('height', tileSize);
    $('.sidebar').css('margin-top', marginTop);
    $('.score').css('margin-top', marginTop);
    if (parseInt($('.board').css('width')) > 0.6*width) {
      $('.sidebar').hide();
    } else {
      $('.sidebar').show();
    }
  }

  window.onresize = adjustCSS;

  var start = View.prototype.start = function () {
    var that = this;

    this.buildBoard();
    this.setup();
    adjustCSS();

    var that = this;

    $('body').on("keydown", function (event) {
      that.board.turn(event.keyCode);
    });

    $(".reset").on("click", that.tryAgain.bind(that))
  };


  View.prototype.tryAgain = function () {
      this.toggleModal();
      window.clearInterval(this.timer)
      this.setup();
  }

  View.prototype.setup = function () {
    var that = this;
    this.board = new SnakeGame.Board();
    this.board.makeApples(2);
    that.timer = window.setInterval(that.animate.bind(that), 70);
  }

  View.prototype.animate = function () {
    if (!this.board.gameOver) {
      this.board.step();
      this.redraw();
    } else {
      this.gameOver();
    }
  }

  View.prototype.gameOver = function () {
    window.clearInterval(this.timer);
    this.toggleModal();

    var taunts = ["My grandmother could do better than that.",
                  "If at first you don't succeed...",
                  "Are you even trying?",
                  "It works better if you don't crash."];

    var congratulations = ["Nicely done.", "You rock."]

    if (this.board.score < 10) {
      $('#gameover-box .message').html(_.sample(taunts))
    } else {
      $('#gameover-box .message').html(_.sample(congratulations))
    }
  }

  View.prototype.toggleModal = function () {
    var currentVal = $('#gameover-box').css("visibility")
    if (currentVal === "hidden") {
      $('#gameover-box').css('visibility', 'visible');
    } else {
      $('#gameover-box').css('visibility', 'hidden');
    }
  }

  View.prototype.buildBoard = function () {
    for(var i = 0; i < SnakeGame.Board.BOARD_SIZE; i++) {
      for(var j = 0; j < SnakeGame.Board.BOARD_SIZE; j++) {
        var $tile = $("<div class='tile'></div>");
        $tile.attr("data-row", i);
        $tile.attr("data-col", j);
        this.$el.append($tile);
        $('#gameover-box').css("visibility", "hidden")
      }
    }
  }

  View.prototype.redraw = function () {
    $(".snake").removeClass("snake");
    $(".apple").removeClass("apple");
    $(".score").html("Score: " + this.board.score)

    this.board.apples.forEach( function(apple, idx, apples) {
      var $appleTile = $('div[data-row='+apple.ypos+'][data-col='+apple.xpos+']');
      $appleTile.addClass('apple');
    })

    this.board.snake.segments.forEach( function (segment, idx, segments) {
      var $snakeTile = $('div[data-row='+segment.ypos+'][data-col='+segment.xpos+']');
      $snakeTile.addClass('snake');
      $snakeTile.removeClass('apple');
    });
  }


})();
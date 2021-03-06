(function () {
  'use strict';

  var SnakeGame = window.SnakeGame = (window.SnakeGame || {});

  SnakeGame.Collections.cells = Backbone.Collection.extend({
    model: SnakeGame.Models.cell,

    initialize: function(models, options) {
      this.size = options.size || 25;
    },

    populate: function () {
      var cell, cellAttr;
      for (var y = 0; y < this.size; y++) {
        for (var x = this.size - 1; x >= 0; x--) {
          cellAttr = {'x': x,'y': y};
          cell = new SnakeGame.Models.cell(cellAttr);
          cell.collection = this;
          this.add(cell);
        }
      }
      return this;
    },

    sample: function () {
      return _.sample(this.where({'status': 'empty'}));
    },

    center: function () {
      var middleIndex = this.size / 2 | 0;
      return this.cellAtXY(middleIndex, middleIndex);
    },

    cellAtXY: function (x,y) {
      var cell = this.findWhere({'x': x, 'y': y});
      return (Object.prototype.toString.apply(cell) === '[object Object]') ? cell : false;
    },

    randomAdjacent: function (cell) {
      var direction = _.sample(['x', 'y']);
      var delta = _.sample([1, -1]);
      var adjCell;

      if (direction === 'x') {
        var newX = cell.get(direction) + delta;
        var Y = cell.get('y');
        adjCell = this.cellAtXY(newX, Y);
      } else {
        var newY = cell.get(direction) + delta;
        var X = cell.get('x');
        adjCell = this.cellAtXY(X, newY);
      }

      return adjCell ? adjCell : this.randomAdjacent(cell);
    }

  });
})();
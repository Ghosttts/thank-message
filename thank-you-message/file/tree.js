(function (window) {

  /* ---------- Utilities ---------- */

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Point.prototype.add = function (p) {
    return new Point(this.x + p.x, this.y + p.y);
  };

  /* ---------- Shooting Star ---------- */

  function ShootingStar(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-4, 4);
    this.vy = random(-8, -4);
    this.life = random(40, 80);
    this.size = random(1, 2);
  }

  ShootingStar.prototype.update = function (ctx) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = this.size;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
    ctx.stroke();
    ctx.restore();

    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  };

  /* ---------- Tree ---------- */

  function Tree(canvas, width, height, opt) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;

    this.stars = [];
    this.frame = 0;

    this.drawTree();
  }

  /* ---------- Draw Normal Tree ---------- */

  Tree.prototype.drawTree = function () {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(this.width / 2, this.height);
    ctx.strokeStyle = "#4a2e19";
    ctx.lineWidth = 10;
    this.branch(0, 0, -120, -Math.PI / 2, 8);
    ctx.restore();
  };

  Tree.prototype.branch = function (x, y, len, angle, depth) {
    if (depth === 0) return;

    const ctx = this.ctx;
    const x2 = x + len * Math.cos(angle);
    const y2 = y + len * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    this.branch(x2, y2, len * 0.75, angle - random(0.2, 0.4), depth - 1);
    this.branch(x2, y2, len * 0.75, angle + random(0.2, 0.4), depth - 1);
  };

  /* ---------- Shooting Star System ---------- */

  Tree.prototype.emitStar = function () {
    // emit near the top of the tree so stars look like they come from it
    const x = this.width / 2 + random(-50, 50);
    const y = this.height - 200 + random(-40, 40);
    this.stars.push(new ShootingStar(x, y));
  };

  Tree.prototype.updateStars = function () {
    const ctx = this.ctx;

    for (let i = this.stars.length - 1; i >= 0; i--) {
      const s = this.stars[i];
      s.update(ctx);
      if (s.life <= 0) {
        this.stars.splice(i, 1);
      }
    }
  };

  /* ---------- Main Animation Loop ---------- */

  Tree.prototype.update = function () {
    this.frame++;

    // Clear to a night sky background
    this.ctx.fillStyle = "#000016";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw the tree
    this.drawTree();

    // Emit stars occasionally from the tree canopy
    if (this.frame % 10 === 0) {
      this.emitStar();
    }

    // Update and draw stars
    this.updateStars();
  };

  /* ---------- Expose ---------- */

  window.Point = Point;
  window.Tree = Tree;

})(window);

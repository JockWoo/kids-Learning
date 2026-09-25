/**
 * Zhuyin Stroke Order Engine (米字格動態筆劃與描紅引擎)
 * Handles animated stroke playback, interactive touch/mouse multi-stroke tracing, and Mandarin speech synthesis.
 */

class ZhuyinStrokeEngine {
  constructor(canvasContainer, options = {}) {
    this.container = canvasContainer;
    this.currentSymbol = 'ㄅ';
    this.currentData = null;
    this.animationTimer = null;
    this.currentStepIndex = 0;
    this.isTracing = false;
    this.tracedStrokes = []; // Array of completed stroke point arrays
    this.activeStroke = [];  // Points for current active stroke

    this.onStepChange = options.onStepChange || null;
    this.onComplete = options.onComplete || null;

    this.initCanvas();
  }

  initCanvas() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const width = this.container.clientWidth || 320;
    const height = width; // Square Rice Grid

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.borderRadius = '24px';
    this.canvas.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)';
    this.ctx = this.canvas.getContext('2d');

    this.container.appendChild(this.canvas);
    this.bindTouchTracing();
  }

  loadSymbol(symbol) {
    this.currentSymbol = symbol;
    this.currentData = STROKE_DATA[symbol] || STROKE_DATA['ㄅ'];
    this.currentStepIndex = 0;
    this.clearTraced();
    this.stopAnimation();

    this.drawRiceGrid();
    this.drawFullGuideOutline();

    // Voice Explanation
    const text = `${this.currentData.symbol}，${this.currentData.word}，一共 ${this.currentData.strokeCount} 筆。`;
    this.speak(text);

    if (this.onStepChange) {
      this.onStepChange(1, this.currentData.strokeCount, this.currentData.steps[0].name);
    }
  }

  clearTraced() {
    this.tracedStrokes = [];
    this.activeStroke = [];
    this.redrawTraced();
  }

  drawRiceGrid() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background Rice-grid paper color
    this.ctx.fillStyle = '#FFFDF5';
    this.ctx.fillRect(0, 0, w, h);

    // Rice grid lines (Red Guidelines)
    this.ctx.save();
    this.ctx.strokeStyle = '#FCA5A5';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([6, 6]);

    // Border
    this.ctx.strokeRect(10, 10, w - 20, h - 20);

    // Center Cross
    this.ctx.beginPath();
    this.ctx.moveTo(w / 2, 10); this.ctx.lineTo(w / 2, h - 10);
    this.ctx.moveTo(10, h / 2); this.ctx.lineTo(w - 10, h / 2);
    this.ctx.stroke();

    // Diagonals
    this.ctx.beginPath();
    this.ctx.moveTo(10, 10); this.ctx.lineTo(w - 10, h - 10);
    this.ctx.moveTo(w - 10, 10); this.ctx.lineTo(10, h - 10);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawFullGuideOutline() {
    if (!this.currentData || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Taiwan Education Standard KaiTi Font Watermark Guide (教育部標準標楷體字帖)
    this.ctx.save();
    this.ctx.font = `900 ${h * 0.62}px "DFKai-SB", "BiauKai", "教育部標準楷書", "標楷體", "TW-Kai", "Noto Serif TC", serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'rgba(148, 163, 184, 0.45)'; // Soft KaiTi guide font
    this.ctx.fillText(this.currentSymbol, w / 2, h / 2 + (h * 0.02));
    this.ctx.restore();

    // 2. Draw Number Badges ① ② ③ & Directional Arrows ↘ ↙ ⤵
    this.drawStrokeNumberBadges();
  }

  drawStrokeNumberBadges() {
    if (!this.currentData || !this.currentData.steps || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.currentData.steps.forEach((step) => {
      const bx = (step.badgePos.x / 100) * w;
      const by = (step.badgePos.y / 100) * h;
      const radius = Math.max(14, w * 0.045);

      // Circle Badge
      this.ctx.save();
      this.ctx.shadowColor = 'rgba(255, 82, 82, 0.4)';
      this.ctx.shadowBlur = 8;
      this.ctx.fillStyle = '#FF5252';
      this.ctx.beginPath();
      this.ctx.arc(bx, by, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Number Text
      this.ctx.save();
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = `900 ${radius * 1.3}px "Outfit", system-ui, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(step.num, bx, by + 1);
      this.ctx.restore();

      // Directional Arrow Symbol
      if (step.arrow && step.arrowPos) {
        const ax = (step.arrowPos.x / 100) * w;
        const ay = (step.arrowPos.y / 100) * h;

        this.ctx.save();
        this.ctx.font = `900 ${radius * 1.5}px system-ui, sans-serif`;
        this.ctx.fillStyle = '#0984E3';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(step.arrow, ax, ay);
        this.ctx.restore();
      }
    });
  }

  drawKaiTiStrokeMask(pathPoints, color, width = 45) {
    if (!pathPoints || pathPoints.length < 2 || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.save();

    // 1. Create stroke directional corridor clipping mask
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.moveTo((pathPoints[0].x / 100) * w, (pathPoints[0].y / 100) * h);
    for (let i = 1; i < pathPoints.length; i++) {
      this.ctx.lineTo((pathPoints[i].x / 100) * w, (pathPoints[i].y / 100) * h);
    }
    this.ctx.stroke();
    this.ctx.clip(); // Mask strictly to genuine KaiTi font glyph contours!

    // 2. Render solid vibrant Ministry of Education KaiTi font stroke!
    this.ctx.font = `900 ${h * 0.62}px "DFKai-SB", "BiauKai", "教育部標準楷書", "標楷體", "TW-Kai", "Noto Serif TC", serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = color;
    this.ctx.fillText(this.currentSymbol, w / 2, h / 2 + (h * 0.02));

    this.ctx.restore();
  }

  playStrokeSequence() {
    if (!this.currentData) return;
    this.stopAnimation();
    this.clearTraced();

    let stepIdx = 0;

    const playNextStep = () => {
      if (stepIdx >= this.currentData.steps.length) {
        this.speak(`${this.currentData.symbol} 筆順寫完囉！好棒！`);
        if (this.onComplete) this.onComplete();
        return;
      }

      this.currentStepIndex = stepIdx;
      const step = this.currentData.steps[stepIdx];

      if (this.onStepChange) {
        this.onStepChange(stepIdx + 1, this.currentData.strokeCount, step.name);
      }

      this.speak(step.name);

      // Animate current step using KaiTi Mask
      this.animateStep(step.path, () => {
        stepIdx++;
        this.animationTimer = setTimeout(playNextStep, 800);
      });
    };

    playNextStep();
  }

  animateStep(pathPoints, onFinished) {
    let progress = 0;
    const speed = 0.03;

    const renderFrame = () => {
      progress += speed;
      this.drawRiceGrid();
      this.drawFullGuideOutline();

      // Draw previously completed strokes in genuine KaiTi font color
      for (let i = 0; i < this.currentStepIndex; i++) {
        this.drawKaiTiStrokeMask(this.currentData.steps[i].path, '#4A90E2', 50);
      }

      // Draw current stroke progressively in genuine KaiTi font color
      if (progress < 1) {
        const partial = this.getPartialPath(pathPoints, progress);
        this.drawKaiTiStrokeMask(partial, '#FF5252', 50);
        this.drawArrowHead(partial);
        requestAnimationFrame(renderFrame);
      } else {
        this.drawKaiTiStrokeMask(pathPoints, '#4A90E2', 50);
        if (onFinished) onFinished();
      }
    };

    renderFrame();
  }

  getPartialPath(pathPoints, progress) {
    if (pathPoints.length < 2) return pathPoints;
    const totalSegs = pathPoints.length - 1;
    const currentSegIdx = Math.min(totalSegs - 1, Math.floor(progress * totalSegs));
    const segProgress = (progress * totalSegs) - currentSegIdx;

    const result = [];
    for (let i = 0; i <= currentSegIdx; i++) {
      result.push(pathPoints[i]);
    }

    const p1 = pathPoints[currentSegIdx];
    const p2 = pathPoints[currentSegIdx + 1];
    result.push({
      x: p1.x + (p2.x - p1.x) * segProgress,
      y: p1.y + (p2.y - p1.y) * segProgress
    });

    return result;
  }

  drawArrowHead(points) {
    if (points.length < 2) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const last = points[points.length - 1];
    const prev = points[points.length - 2];

    const lx = (last.x / 100) * w;
    const ly = (last.y / 100) * h;
    const px = (prev.x / 100) * w;
    const py = (prev.y / 100) * h;

    const angle = Math.atan2(ly - py, lx - px);

    this.ctx.save();
    this.ctx.fillStyle = '#FF5252';
    this.ctx.translate(lx, ly);
    this.ctx.rotate(angle);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-18, -10);
    this.ctx.lineTo(-18, 10);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  stopAnimation() {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
  }

  bindTouchTracing() {
    if (!this.canvas) return;

    const getPos = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100
      };
    };

    const startDraw = (pos) => {
      this.isTracing = true;
      this.stopAnimation();
      this.activeStroke = [pos];
      this.redrawTraced();
    };

    const moveDraw = (pos) => {
      if (!this.isTracing) return;
      this.activeStroke.push(pos);
      this.redrawTraced();
    };

    const endDraw = () => {
      if (!this.isTracing) return;
      this.isTracing = false;
      if (this.activeStroke.length > 0) {
        this.tracedStrokes.push([...this.activeStroke]);
      }
      this.activeStroke = [];
      this.redrawTraced();
    };

    // Touch Event Handlers
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        startDraw(getPos(e.touches[0].clientX, e.touches[0].clientY));
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        moveDraw(getPos(e.touches[0].clientX, e.touches[0].clientY));
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      endDraw();
    }, { passive: false });

    // Mouse Event Handlers
    let isMouseDown = false;
    this.canvas.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      startDraw(getPos(e.clientX, e.clientY));
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      moveDraw(getPos(e.clientX, e.clientY));
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      endDraw();
    });

    this.canvas.addEventListener('mouseleave', () => {
      if (isMouseDown) {
        isMouseDown = false;
        endDraw();
      }
    });
  }

  redrawTraced() {
    this.drawRiceGrid();
    this.drawFullGuideOutline();

    // Draw all accumulated completed strokes
    this.tracedStrokes.forEach(stroke => {
      this.drawUserStrokePath(stroke, '#FF3B30', 22);
    });

    // Draw active stroke currently being drawn
    if (this.activeStroke.length > 0) {
      this.drawUserStrokePath(this.activeStroke, '#FF3B30', 22);
    }
  }

  drawUserStrokePath(points, color, width) {
    if (!points || points.length === 0) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (points.length === 1) {
      const px = (points[0].x / 100) * w;
      const py = (points[0].y / 100) * h;
      this.ctx.beginPath();
      this.ctx.arc(px, py, width / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo((points[0].x / 100) * w, (points[0].y / 100) * h);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo((points[i].x / 100) * w, (points[i].y / 100) * h);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  speak(text) {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'zh-TW';
        utter.rate = 0.7;
        window.speechSynthesis.speak(utter);
      } catch (e) {}
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZhuyinStrokeEngine };
}

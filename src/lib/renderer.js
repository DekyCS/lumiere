import { EASING_FUNCTIONS } from './easing';

/**
 * Draws a single animation frame on a canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} progress - 0 to 1
 * @param {object} settings
 * @param {HTMLImageElement|null} bgImageEl - pre-loaded background image element
 */
export function drawFrame(ctx, width, height, progress, settings, bgImageEl) {
  const easingEntry = EASING_FUNCTIONS[settings.easing] || EASING_FUNCTIONS.easeOut;
  const easedProgress = easingEntry.fn(progress);

  // 1. Background
  if (bgImageEl) {
    const imgRatio = bgImageEl.width / bgImageEl.height;
    const canvasRatio = width / height;
    let drawW, drawH, drawX, drawY;
    if (imgRatio > canvasRatio) {
      drawH = height;
      drawW = height * imgRatio;
      drawX = (width - drawW) / 2;
      drawY = 0;
    } else {
      drawW = width;
      drawH = width / imgRatio;
      drawX = 0;
      drawY = (height - drawH) / 2;
    }
    ctx.drawImage(bgImageEl, drawX, drawY, drawW, drawH);
  } else {
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Calculate current number
  const currentNumber =
    settings.startNumber + (settings.endNumber - settings.startNumber) * easedProgress;

  // 3. Format text
  const text =
    settings.prefix + currentNumber.toFixed(settings.decimals) + settings.suffix;

  // 4. Font size (auto or manual)
  let fontSize = settings.fontSize;
  if (fontSize === 0) {
    fontSize = height * 0.4;
    ctx.font = `bold ${fontSize}px "${settings.fontFamily}"`;
    while (ctx.measureText(text).width > width * 0.85 && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px "${settings.fontFamily}"`;
    }
  } else {
    ctx.font = `bold ${fontSize}px "${settings.fontFamily}"`;
  }

  // 5. Draw text centered
  ctx.save();
  ctx.fillStyle = settings.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  ctx.restore();
}

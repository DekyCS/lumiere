import { EASING_FUNCTIONS } from './easing';

/**
 * Draws a single animation frame on a canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} progress - 0 to 1
 * @param {object} settings
 * @param {HTMLImageElement|null} bgImageEl - pre-loaded background image element
 * @param {HTMLImageElement|null} prefixIconEl - pre-loaded prefix icon element
 */
export function drawFrame(ctx, width, height, progress, settings, bgImageEl, prefixIconEl) {
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

  // 5. Draw text (and optional prefix icon) centered
  ctx.save();
  ctx.fillStyle = settings.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const showIcon = settings.prefixIcon === 'tiktok-play' && prefixIconEl;

  if (showIcon) {
    const iconSize = fontSize * 0.9;
    const gap = fontSize * 0.08;
    const cy = height / 2;

    // Use the END number text to calculate a stable layout that won't shift
    const endText =
      settings.prefix + settings.endNumber.toFixed(settings.decimals) + settings.suffix;
    const stableWidth = ctx.measureText(endText).width;
    const totalWidth = iconSize + gap + stableWidth;
    const startX = (width - totalWidth) / 2;

    // Measure once with the end text to get stable font metrics
    const endMetrics = ctx.measureText(endText);
    const ascent = endMetrics.actualBoundingBoxAscent || fontSize * 0.7;
    const descent = endMetrics.actualBoundingBoxDescent || fontSize * 0.1;
    const glyphCenter = cy - (ascent - descent) / 2;

    // Fixed icon position — never changes between frames
    const iconX = Math.round(startX);
    const iconY = Math.round(glyphCenter - iconSize / 2);
    const textX = Math.round(startX + iconSize + gap);

    ctx.drawImage(prefixIconEl, iconX, iconY, iconSize, iconSize);

    ctx.textAlign = 'left';
    ctx.fillText(text, textX, cy);
  } else {
    ctx.fillText(text, width / 2, height / 2);
  }

  ctx.restore();
}

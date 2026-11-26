/**
 * A laboratory cart as the textbooks draw one: a flat-topped body on two wheels. Shared by
 * the energy track and the collision track. (cx, cy) is the point where the wheels touch the
 * rail; the cart is drawn rotated by `angle` (radians, screen sense) about that point.
 */
export function drawCart(ctx, cx, cy, w, h, c, angle = 0, fill = c.track, stroke = c.body) {
  const r = Math.max(3, h * 0.26);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  // body, resting on the axles
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(-w / 2, -r - h, w, h);
  ctx.fill();
  ctx.stroke();
  // wheels
  for (const x of [-w / 2 + r * 1.2, w / 2 - r * 1.2]) {
    ctx.fillStyle = c.body;
    ctx.beginPath();
    ctx.arc(x, -r, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.surface;
    ctx.beginPath();
    ctx.arc(x, -r, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

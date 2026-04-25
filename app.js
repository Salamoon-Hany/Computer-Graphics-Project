const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const titleEl = document.getElementById("title");
const descEl = document.getElementById("desc");
const logEl = document.getElementById("log");
const buttons = [...document.querySelectorAll(".controls button")];
const sec6OnlyButtons = [...document.querySelectorAll(".sec6-only")];
const sec6Panel = document.getElementById("sec6-panel");
const examplesPanel = document.getElementById("examples-panel");
const examplesTitleEl = document.getElementById("examples-title");
const stepsActionsEl = document.getElementById("steps-actions");
const stepsInputEl = document.getElementById("steps-input");
const generateRandomStepsBtn = document.getElementById("generate-random-steps");
const exampleButtons = [
  document.getElementById("example-1"),
  document.getElementById("example-2"),
  document.getElementById("example-3")
];
const shapeTypeEl = document.getElementById("shape-type");
const shapeHelpEl = document.getElementById("shape-help");
const verticesInputEl = document.getElementById("vertices-input");
const clipWindowEl = document.getElementById("clip-window");
const runCustomSec6Btn = document.getElementById("run-custom-sec6");

let runToken = 0;
let activeExamplesSection = null;
let activeExampleIndex = 1;
const finishText = "اتمني يكون عجب حضرتك ممكن بونص بقي👀❤️ ";
const finishImageCandidates = ["finish.jpg", "finish.png", "bonus.jpg", "bonus.png", "assets/finish.jpg"];

const SECTION_EXAMPLES = {
  sec2: [
    { center: [490, 280], radius: 130, lineStart: [120, 100], lineEnd: [860, 470] },
    { center: [360, 280], radius: 95, lineStart: [80, 490], lineEnd: [900, 80] },
    { center: [540, 300], radius: 150, lineStart: [200, 70], lineEnd: [760, 530] }
  ],
  sec3: [
    { p: [1, 1, 1], scale: [2, 2, 2], angle: 45, translate: [5, 0, 0] },
    { p: [2, 1, -1], scale: [1.5, 2.5, 1], angle: 30, translate: [3, 1, -2] },
    { p: [-1, 2, 1], scale: [2, 1, 2], angle: 60, translate: [4, -1, 1] }
  ],
  sec4: [
    { start: [0, 0], end: [30, 20] },
    { start: [3, 2], end: [33, 7] },
    { start: [6, 4], end: [18, 34] }
  ],
  sec5: [
    { start: [20, 10], end: [30, 18] },
    { start: [12, 26], end: [36, 8] },
    { start: [5, 5], end: [35, 30] }
  ]
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setInfo(title, desc, logText = "") {
  titleEl.textContent = title;
  descEl.textContent = desc;
  logEl.textContent = logText;
}

function setActive(section) {
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === section);
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackgroundGrid();
}

function setSec6ControlsVisible(visible) {
  sec6OnlyButtons.forEach((btn) => {
    btn.classList.toggle("show", visible);
  });
  sec6Panel.classList.toggle("show", visible);
}

function setExamplesPanelVisible(visible, section = "") {
  examplesPanel.classList.toggle("show", visible);
  if (visible) {
    examplesTitleEl.textContent = `${section.toUpperCase()} Examples`;
  }
  const stepsMode = visible && (section === "sec4" || section === "sec5");
  stepsActionsEl.classList.toggle("show", stepsMode);
}

function setExampleActive(index) {
  exampleButtons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx + 1 === index);
  });
}

function drawBackgroundGrid() {
  ctx.save();
  ctx.fillStyle = "#fffdf9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(20, 35, 59, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function beginRun(section, title, desc) {
  runToken += 1;
  const token = runToken;
  setActive(section);
  const sec6Mode = section === "sec6" || section === "sec6-example1" || section === "sec6-new";
  setSec6ControlsVisible(sec6Mode);
  const examplesMode = ["sec2", "sec3", "sec4", "sec5"].includes(section);
  setExamplesPanelVisible(examplesMode, section);
  clearCanvas();
  setInfo(title, desc);
  return token;
}

function checkRun(token) {
  return token === runToken;
}

function drawPixel(x, y, color = "#111", size = 16) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, canvas.height - (y + 1) * size, size, size);
  ctx.strokeStyle = "rgba(10, 10, 10, 0.2)";
  ctx.strokeRect(x * size, canvas.height - (y + 1) * size, size, size);
}

function drawAxes(originX, originY, scale = 1) {
  ctx.save();
  ctx.strokeStyle = "#20314f";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(originX - 220 * scale, originY);
  ctx.lineTo(originX + 220 * scale, originY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(originX, originY + 220 * scale);
  ctx.lineTo(originX, originY - 220 * scale);
  ctx.stroke();

  ctx.restore();
}

function section2(example, exampleIndex = 1) {
  const token = beginRun("sec2", "Sec 2", `Circle and line (Example ${exampleIndex})`);
  setExampleActive(exampleIndex);
  const center = { x: example.center[0], y: example.center[1] };
  const radius = example.radius;
  let progress = 0;

  const animate = () => {
    if (!checkRun(token)) {
      return;
    }

    clearCanvas();

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2 * Math.min(progress, 1));
    ctx.stroke();

    const x0 = example.lineStart[0];
    const y0 = example.lineStart[1];
    const x1 = example.lineEnd[0];
    const y1 = example.lineEnd[1];
    const t = Math.min(progress, 1);
    const cx = x0 + (x1 - x0) * t;
    const cy = y0 + (y1 - y0) * t;

    ctx.strokeStyle = "#11a567";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    setInfo(
      `Sec 2 - Example ${exampleIndex}`,
      "Circle + animated line draw.",
      `center=(${center.x},${center.y}) radius=${radius}\nline=(${x0},${y0})->(${x1},${y1})`
    );

    progress += 0.012;
    if (progress <= 1.02) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}

function scalePoint(p, sx, sy, sz) {
  return [p[0] * sx, p[1] * sy, p[2] * sz];
}

function rotateY(p, angleDeg) {
  const rad = (Math.PI / 180) * angleDeg;
  const x = p[0] * Math.cos(rad) + p[2] * Math.sin(rad);
  const z = -p[0] * Math.sin(rad) + p[2] * Math.cos(rad);
  return [x, p[1], z];
}

function translatePoint(p, tx, ty, tz) {
  return [p[0] + tx, p[1] + ty, p[2] + tz];
}

async function section3(example, exampleIndex = 1) {
  const token = beginRun("sec3", "Sec 3", `3D scale, rotate(Y), translate (Example ${exampleIndex})`);
  setExampleActive(exampleIndex);

  const original = example.p;
  const scaled = scalePoint(original, example.scale[0], example.scale[1], example.scale[2]);
  const rotated = rotateY(scaled, example.angle);
  const translated = translatePoint(rotated, example.translate[0], example.translate[1], example.translate[2]);

  const points = [original, scaled, rotated, translated];
  const labels = ["Original", "Scaled x2", "RotateY 45", "Translate +5x"];

  const originX = canvas.width / 2 - 100;
  const originY = canvas.height / 2 + 80;
  const s = 42;

  for (let i = 0; i < points.length; i += 1) {
    if (!checkRun(token)) {
      return;
    }

    clearCanvas();
    drawAxes(originX, originY);

    for (let j = 0; j <= i; j += 1) {
      const p = points[j];
      const px = originX + p[0] * s;
      const py = originY - p[1] * s;

      ctx.fillStyle = ["#c54444", "#2a7f62", "#2f5db5", "#cf7a20"][j];
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#14233b";
      ctx.font = '600 14px "Space Grotesk", sans-serif';
      ctx.fillText(`${labels[j]}: [${p.map((n) => n.toFixed(2)).join(", ")}]`, 20, 26 + j * 24);
    }

    setInfo(
      `Sec 3 - Example ${exampleIndex}`,
      "Transformation pipeline animation.",
      `p=[${original.join(",")}]\nscale(${example.scale.join(",")}) -> [${scaled.map((n) => n.toFixed(2)).join(", ")}]\nrotateY(${example.angle}) -> [${rotated.map((n) => n.toFixed(2)).join(", ")}]\ntranslate(${example.translate.join(",")}) -> [${translated.map((n) => n.toFixed(2)).join(", ")}]`
    );

    await sleep(950);
  }
}

function ddaLine(x0, y0, xEnd, yEnd) {
  const dx = xEnd - x0;
  const dy = yEnd - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xInc = dx / steps;
  const yInc = dy / steps;

  let x = x0;
  let y = y0;
  const points = [];

  for (let k = 0; k <= steps; k += 1) {
    points.push({
      k,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      xr: Math.round(x),
      yr: Math.round(y)
    });
    x += xInc;
    y += yInc;
  }

  return points;
}

async function section4(example, exampleIndex = 1) {
  const token = beginRun("sec4", "Sec 4", `DDA line algorithm (Example ${exampleIndex})`);
  setExampleActive(exampleIndex);
  const points = ddaLine(example.start[0], example.start[1], example.end[0], example.end[1]);

  const lines = ["k    x      y      (round x, round y)"];

  clearCanvas();
  for (let i = 0; i < points.length; i += 1) {
    if (!checkRun(token)) {
      return;
    }

    const p = points[i];
    drawPixel(p.xr + 6, p.yr + 6, "#cc4039", 15);
    lines.push(`${String(p.k).padEnd(4)} ${p.x.toFixed(2).padEnd(6)} ${p.y.toFixed(2).padEnd(6)} (${p.xr}, ${p.yr})`);
    setInfo(
      `Sec 4 (DDA) - Example ${exampleIndex}`,
      `Animating one rounded pixel per DDA step from (${example.start.join(",")}) to (${example.end.join(",")}).`,
      lines.slice(-18).join("\n")
    );
    await sleep(95);
  }
}

function bresenhamLine(x0, y0, x1, y1) {
  const pixels = [];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;

  let err = dx - dy;
  while (true) {
    pixels.push([x0, y0]);
    if (x0 === x1 && y0 === y1) {
      break;
    }
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return pixels;
}

async function section5(example, exampleIndex = 1) {
  const token = beginRun("sec5", "Sec 5", `Bresenham's line algorithm (Example ${exampleIndex})`);
  setExampleActive(exampleIndex);
  const start = example.start;
  const end = example.end;
  const pixels = bresenhamLine(start[0], start[1], end[0], end[1]);

  const logRows = [`start=${start.join(",")} end=${end.join(",")}`];

  clearCanvas();
  for (let i = 0; i < pixels.length; i += 1) {
    if (!checkRun(token)) {
      return;
    }

    const [x, y] = pixels[i];
    drawPixel(x + 15, y + 8, "#101010", 16);
    logRows.push(`step ${String(i + 1).padStart(2, "0")} -> (${x}, ${y})`);
    setInfo(`Sec 5 (Bresenham) - Example ${exampleIndex}`, "Integer-only incremental plotting.", logRows.join("\n"));
    await sleep(170);
  }
}

function clipPolygon(polygon, boundary, axis, isMax) {
  const clipped = [];

  const inside = (p) => (isMax ? p[axis] <= boundary : p[axis] >= boundary);

  const intersect = (p1, p2) => {
    if (axis === 0) {
      const t = (boundary - p1[0]) / (p2[0] - p1[0]);
      const y = p1[1] + t * (p2[1] - p1[1]);
      return [boundary, y];
    }
    const t = (boundary - p1[1]) / (p2[1] - p1[1]);
    const x = p1[0] + t * (p2[0] - p1[0]);
    return [x, boundary];
  };

  for (let i = 0; i < polygon.length; i += 1) {
    const current = polygon[i];
    const previous = polygon[(i - 1 + polygon.length) % polygon.length];

    if (inside(current)) {
      if (!inside(previous)) {
        clipped.push(intersect(previous, current));
      }
      clipped.push(current);
    } else if (inside(previous)) {
      clipped.push(intersect(previous, current));
    }
  }

  return clipped;
}

function insideBoundary(point, boundary, axis, isMax) {
  return isMax ? point[axis] <= boundary : point[axis] >= boundary;
}

function boundaryIntersection(p1, p2, boundary, axis) {
  if (axis === 0) {
    const t = (boundary - p1[0]) / (p2[0] - p1[0]);
    return [boundary, p1[1] + t * (p2[1] - p1[1])];
  }
  const t = (boundary - p1[1]) / (p2[1] - p1[1]);
  return [p1[0] + t * (p2[0] - p1[0]), boundary];
}

function getCutSegments(polygon, boundarySpec) {
  const cuts = [];

  for (let i = 0; i < polygon.length; i += 1) {
    const current = polygon[i];
    const previous = polygon[(i - 1 + polygon.length) % polygon.length];
    const currInside = insideBoundary(current, boundarySpec.boundary, boundarySpec.axis, boundarySpec.isMax);
    const prevInside = insideBoundary(previous, boundarySpec.boundary, boundarySpec.axis, boundarySpec.isMax);

    if (!prevInside && !currInside) {
      cuts.push([previous, current]);
      continue;
    }

    if (prevInside && !currInside) {
      const hit = boundaryIntersection(previous, current, boundarySpec.boundary, boundarySpec.axis);
      cuts.push([hit, current]);
      continue;
    }

    if (!prevInside && currInside) {
      const hit = boundaryIntersection(previous, current, boundarySpec.boundary, boundarySpec.axis);
      cuts.push([previous, hit]);
    }
  }

  return cuts;
}

function drawBoundaryLine(clippingWindow, boundarySpec, color = "#2f5db5") {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();

  if (boundarySpec.axis === 0) {
    ctx.moveTo(boundarySpec.boundary, clippingWindow[2]);
    ctx.lineTo(boundarySpec.boundary, clippingWindow[3]);
  } else {
    ctx.moveTo(clippingWindow[0], boundarySpec.boundary);
    ctx.lineTo(clippingWindow[1], boundarySpec.boundary);
  }

  ctx.stroke();
  ctx.restore();
}

function drawScissor(x, y, openRatio = 0.5, angle = 0) {
  const blade = 18;
  const spread = 0.35 + openRatio * 0.55;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#4b5563";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(blade * Math.cos(spread), blade * Math.sin(spread));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(blade * Math.cos(-spread), blade * Math.sin(-spread));
  ctx.stroke();

  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(-8, -4, 4, 0, Math.PI * 2);
  ctx.arc(-8, 4, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function lerpPoint(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function drawPolygon(vertices, color, fillAlpha = 0.15, width = 3, offsetX = 0, offsetY = 0) {
  if (!vertices.length) {
    return;
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(vertices[0][0] + offsetX, vertices[0][1] + offsetY);
  for (let i = 1; i < vertices.length; i += 1) {
    ctx.lineTo(vertices[i][0] + offsetX, vertices[i][1] + offsetY);
  }
  ctx.closePath();

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.fillStyle = color.replace(")", `, ${fillAlpha})`).replace("rgb", "rgba");
  ctx.fill();
  ctx.restore();
}

async function section6(subjectPolygon, clippingWindow, modeLabel = "Example 1", activeSection = "sec6-example1") {
  const token = beginRun(activeSection, "Sec 6", `Sutherland-Hodgman polygon clipping (${modeLabel})`);

  let polygon = [...subjectPolygon];

  const boundaries = [
    { name: "Left x>=100", boundary: clippingWindow[0], axis: 0, isMax: false },
    { name: "Right x<=300", boundary: clippingWindow[1], axis: 0, isMax: true },
    { name: "Bottom y>=100", boundary: clippingWindow[2], axis: 1, isMax: false },
    { name: "Top y<=300", boundary: clippingWindow[3], axis: 1, isMax: true }
  ];

  for (let step = 0; step <= boundaries.length; step += 1) {
    if (!checkRun(token)) {
      return;
    }

    clearCanvas();

    ctx.save();
    ctx.translate(220, 110);

    ctx.strokeStyle = "#2f5db5";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      clippingWindow[0],
      clippingWindow[2],
      clippingWindow[1] - clippingWindow[0],
      clippingWindow[3] - clippingWindow[2]
    );

    drawPolygon(subjectPolygon, "rgb(210, 72, 57)", 0.16, 2.5, 0, 0);
    drawPolygon(polygon, "rgb(0, 141, 127)", 0.2, 3, 0, 0);

    ctx.restore();

    const stepText =
      step === 0
        ? "Original polygon shown"
        : `After clipping with ${boundaries[step - 1].name}`;

    setInfo(
      `Sec 6 (Clipping) - ${modeLabel}`,
      "Applying one clipping boundary per animation step.",
      `${stepText}\nVertices:\n${polygon.map((p) => `(${p[0].toFixed(2)}, ${p[1].toFixed(2)})`).join("\n")}`
    );

    await sleep(520);

    if (step < boundaries.length) {
      const b = boundaries[step];

      const cutSegments = getCutSegments(polygon, b);
      if (cutSegments.length) {
        for (let frame = 0; frame <= 24; frame += 1) {
          if (!checkRun(token)) {
            return;
          }

          const progress = frame / 24;
          clearCanvas();

          ctx.save();
          ctx.translate(220, 110);

          ctx.strokeStyle = "#2f5db5";
          ctx.lineWidth = 3;
          ctx.strokeRect(
            clippingWindow[0],
            clippingWindow[2],
            clippingWindow[1] - clippingWindow[0],
            clippingWindow[3] - clippingWindow[2]
          );

          drawBoundaryLine(clippingWindow, b, "#1d4ed8");
          drawPolygon(subjectPolygon, "rgb(210, 72, 57)", 0.12, 2.2, 0, 0);
          drawPolygon(polygon, "rgb(0, 141, 127)", 0.2, 3, 0, 0);

          let scissorPosition = null;
          let scissorAngle = 0;

          cutSegments.forEach((seg, idx) => {
            const localProgress = Math.min(1, Math.max(0, progress * cutSegments.length - idx));
            if (localProgress <= 0) {
              return;
            }

            const end = lerpPoint(seg[0], seg[1], localProgress);
            ctx.strokeStyle = "rgba(220, 38, 38, 0.95)";
            ctx.lineWidth = 3;
            ctx.setLineDash([7, 6]);
            ctx.beginPath();
            ctx.moveTo(seg[0][0], seg[0][1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (idx === Math.min(cutSegments.length - 1, Math.floor(progress * cutSegments.length))) {
              scissorPosition = end;
              scissorAngle = Math.atan2(seg[1][1] - seg[0][1], seg[1][0] - seg[0][0]);
            }
          });

          if (scissorPosition) {
            drawScissor(scissorPosition[0], scissorPosition[1], 0.5 + 0.5 * Math.sin(frame * 0.7), scissorAngle);
          }

          ctx.restore();

          setInfo(
            `Sec 6 (Clipping) - ${modeLabel}`,
            `Scissor cut animation on ${b.name}.`,
            `Cut segments: ${cutSegments.length}\nAnimating removed edge parts before clipping result.`
          );

          await sleep(28);
        }
      }

      polygon = clipPolygon(polygon, b.boundary, b.axis, b.isMax);
      await sleep(340);
    }
  }
}

function parseVertices(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const vertices = lines.map((line) => {
    const [xStr, yStr] = line.split(",").map((v) => v.trim());
    const x = Number(xStr);
    const y = Number(yStr);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid vertex line: ${line}`);
    }
    return [x, y];
  });

  if (vertices.length < 3) {
    throw new Error("At least 3 vertices are required.");
  }

  return vertices;
}

function parseClipWindow(raw) {
  const parts = raw.split(",").map((v) => Number(v.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
    throw new Error("Clipping window must be: x_min,x_max,y_min,y_max");
  }

  const [xMin, xMax, yMin, yMax] = parts;
  if (xMin >= xMax || yMin >= yMax) {
    throw new Error("Window must satisfy x_min<x_max and y_min<y_max");
  }

  return parts;
}

function shapeHintVertices(shape) {
  if (shape === "triangle") {
    return "50,150\n200,50\n350,150";
  }
  if (shape === "rectangle") {
    return "80,90\n340,90\n340,220\n80,220";
  }
  return "60,120\n180,60\n300,110\n320,220\n200,280\n90,220";
}

function shapeHelpMessage(shape) {
  if (shape === "triangle") {
    return "Triangle: write exactly 3 vertices. Format: x,y on each line.";
  }
  if (shape === "rectangle") {
    return "Square / Rectangle: write exactly 4 vertices in order around the shape.";
  }
  return "Polygon: write 3 or more vertices in order around the shape (clockwise or counter-clockwise).";
}

function updateShapeHelp() {
  const shape = shapeTypeEl.value;
  shapeHelpEl.textContent = `${shapeHelpMessage(shape)} Example:\n${shapeHintVertices(shape)}`;
  verticesInputEl.placeholder = shapeHintVertices(shape);
}

function validateShapeVertices(shape, vertices) {
  if (shape === "triangle" && vertices.length !== 3) {
    throw new Error("Triangle needs exactly 3 vertices.");
  }
  if (shape === "rectangle" && vertices.length !== 4) {
    throw new Error("Rectangle needs exactly 4 vertices.");
  }
}

function clearAll() {
  runToken += 1;
  setActive("clear");
  setSec6ControlsVisible(false);
  setExamplesPanelVisible(false);
  clearCanvas();
  setInfo("Ready", "Pick a section to start animation.", "");
}

function drawMissingFinishImagePlaceholder() {
  ctx.save();
  const boxW = Math.min(canvas.width - 120, 420);
  const boxH = Math.min(canvas.height - 180, 300);
  const x = (canvas.width - boxW) / 2;
  const y = (canvas.height - boxH) / 2 + 40;

  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(x, y, boxW, boxH);
  ctx.setLineDash([]);

  ctx.fillStyle = "#7c2d12";
  ctx.font = '600 18px "Space Grotesk", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("Add your image file as finish.jpg", canvas.width / 2, y + boxH / 2 - 4);
  ctx.font = '500 14px "Space Grotesk", sans-serif';
  ctx.fillText("(or finish.png / bonus.jpg / bonus.png)", canvas.width / 2, y + boxH / 2 + 20);
  ctx.restore();
}

function drawFinishHeader() {
  ctx.save();
  ctx.fillStyle = "#7f1d1d";
  ctx.font = '700 34px "Space Grotesk", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(finishText, canvas.width / 2, 54);
  ctx.restore();
}

function loadImageFromCandidates(candidates) {
  const tryLoad = (index) =>
    new Promise((resolve, reject) => {
      if (index >= candidates.length) {
        reject(new Error("no-image-found"));
        return;
      }

      const img = new Image();
      img.onload = () => resolve({ img, src: candidates[index] });
      img.onerror = () => {
        tryLoad(index + 1).then(resolve).catch(reject);
      };
      img.src = candidates[index];
    });

  return tryLoad(0);
}

async function showFinishScreen() {
  runToken += 1;
  const token = runToken;
  activeExamplesSection = null;
  setActive("finish");
  setSec6ControlsVisible(false);
  setExamplesPanelVisible(false);
  clearCanvas();
  drawFinishHeader();
  setInfo("Finish", "Showing your final message and image.", "Trying to load: finish.jpg");

  try {
    const loaded = await loadImageFromCandidates(finishImageCandidates);
    if (!checkRun(token)) {
      return;
    }

    clearCanvas();
    drawFinishHeader();

    const maxW = canvas.width - 120;
    const maxH = canvas.height - 140;
    const ratio = Math.min(maxW / loaded.img.width, maxH / loaded.img.height, 1);
    const drawW = loaded.img.width * ratio;
    const drawH = loaded.img.height * ratio;
    const x = (canvas.width - drawW) / 2;
    const y = 70 + (maxH - drawH) / 2;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 20;
    ctx.drawImage(loaded.img, x, y, drawW, drawH);
    ctx.restore();

    setInfo("Finish", "Message + image displayed.", `Loaded image: ${loaded.src}`);
  } catch (_err) {
    if (!checkRun(token)) {
      return;
    }
    clearCanvas();
    drawFinishHeader();
    drawMissingFinishImagePlaceholder();
    setInfo(
      "Finish",
      "Message shown. Image file is missing.",
      "Add finish.jpg in Computer-Graphics-Project-remote folder and press Finish again."
    );
  }
}

function runExampleForSection(section, exampleIndex = 1) {
  const examples = SECTION_EXAMPLES[section];
  if (!examples || !examples[exampleIndex - 1]) {
    return;
  }

  activeExamplesSection = section;
  activeExampleIndex = exampleIndex;
  const selected = examples[exampleIndex - 1];

  if (section === "sec2") {
    section2(selected, exampleIndex);
  } else if (section === "sec3") {
    section3(selected, exampleIndex);
  } else if (section === "sec4") {
    section4(selected, exampleIndex);
  } else if (section === "sec5") {
    section5(selected, exampleIndex);
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildRandomLineForSteps(section, steps) {
  const dx = randomInt(0, steps);
  const dy = steps - dx;
  const sx = Math.random() < 0.5 ? -1 : 1;
  const sy = Math.random() < 0.5 ? -1 : 1;

  let x0 = randomInt(4, 34);
  let y0 = randomInt(4, 30);
  let x1 = x0 + sx * dx;
  let y1 = y0 + sy * dy;

  const clamp = (v, low, high) => Math.min(high, Math.max(low, v));
  x1 = clamp(x1, 2, 38);
  y1 = clamp(y1, 2, 34);

  if (section === "sec4") {
    while (Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) !== steps) {
      x0 = randomInt(4, 34);
      y0 = randomInt(4, 30);
      const pickX = Math.random() < 0.5;
      if (pickX) {
        x1 = clamp(x0 + (Math.random() < 0.5 ? -steps : steps), 2, 38);
        y1 = clamp(y0 + randomInt(-steps, steps), 2, 34);
      } else {
        y1 = clamp(y0 + (Math.random() < 0.5 ? -steps : steps), 2, 34);
        x1 = clamp(x0 + randomInt(-steps, steps), 2, 38);
      }
      if (x0 === x1 && y0 === y1) {
        x1 = clamp(x0 + steps, 2, 38);
      }
    }
  } else {
    while (Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) + 1 !== steps) {
      x0 = randomInt(4, 34);
      y0 = randomInt(4, 30);
      const d = Math.max(1, steps - 1);
      const pickX = Math.random() < 0.5;
      if (pickX) {
        x1 = clamp(x0 + (Math.random() < 0.5 ? -d : d), 2, 38);
        y1 = clamp(y0 + randomInt(-d, d), 2, 34);
      } else {
        y1 = clamp(y0 + (Math.random() < 0.5 ? -d : d), 2, 34);
        x1 = clamp(x0 + randomInt(-d, d), 2, 38);
      }
      if (x0 === x1 && y0 === y1) {
        x1 = clamp(x0 + d, 2, 38);
      }
    }
  }

  return { start: [x0, y0], end: [x1, y1] };
}

function runRandomBySteps(section) {
  const raw = Number(stepsInputEl.value);
  if (!Number.isFinite(raw)) {
    setInfo("Input Error", "Steps must be a number.", "Try a value between 2 and 40.");
    return;
  }

  const steps = Math.max(2, Math.min(40, Math.round(raw)));
  stepsInputEl.value = String(steps);
  const line = buildRandomLineForSteps(section, steps);

  activeExamplesSection = section;
  setExampleActive(0);

  if (section === "sec4") {
    section4(line, 0);
    setInfo(
      "Sec 4 (DDA) - Random",
      `Random line generated with ${steps} DDA steps.`,
      `start=(${line.start.join(",")}) end=(${line.end.join(",")})`
    );
  } else {
    section5(line, 0);
    setInfo(
      "Sec 5 (Bresenham) - Random",
      `Random line generated with ${steps} plotted points.`,
      `start=(${line.start.join(",")}) end=(${line.end.join(",")})`
    );
  }
}

const runners = {
  sec2: () => runExampleForSection("sec2", 1),
  sec3: () => runExampleForSection("sec3", 1),
  sec4: () => runExampleForSection("sec4", 1),
  sec5: () => runExampleForSection("sec5", 1),
  sec6: () => {
    runToken += 1;
    activeExamplesSection = null;
    setActive("sec6");
    setSec6ControlsVisible(true);
    setExamplesPanelVisible(false);
    setInfo("Sec 6", "Choose Example 1 or New to continue.", "Tip: New lets you type your own vertices.");
    clearCanvas();
  },
  "sec6-example1": () =>
    section6(
      [
        [50, 150],
        [200, 50],
        [350, 150]
      ],
      [100, 300, 100, 300],
      "Example 1",
      "sec6-example1"
    ),
  "sec6-new": () => {
    beginRun("sec6-new", "Sec 6 - New", "Enter custom shape vertices and run clipping.");
    updateShapeHelp();
    setInfo(
      "Sec 6 - New",
      "Type vertices and clipping window, then click Run Custom Clipping.",
      "Format:\nVertices: x,y per line\nWindow: x_min,x_max,y_min,y_max"
    );
  },
  finish: () => showFinishScreen(),
  clear: () => clearAll()
};

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;
    const run = runners[section];
    if (run) {
      run();
    }
  });
});

exampleButtons.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    if (!activeExamplesSection) {
      return;
    }
    runExampleForSection(activeExamplesSection, idx + 1);
  });
});

generateRandomStepsBtn.addEventListener("click", () => {
  if (activeExamplesSection !== "sec4" && activeExamplesSection !== "sec5") {
    setInfo("Info", "Open Sec 4 or Sec 5 first.", "Then enter steps and click Generate Random.");
    return;
  }
  runRandomBySteps(activeExamplesSection);
});

shapeTypeEl.addEventListener("change", () => {
  updateShapeHelp();
});

runCustomSec6Btn.addEventListener("click", () => {
  try {
    const shape = shapeTypeEl.value;
    const vertices = parseVertices(verticesInputEl.value);
    validateShapeVertices(shape, vertices);
    const clipWindow = parseClipWindow(clipWindowEl.value);
    section6(vertices, clipWindow, `New (${shape})`, "sec6-new");
  } catch (err) {
    setInfo("Sec 6 - Input Error", "Please fix your values and try again.", String(err.message || err));
  }
});

clearAll();
updateShapeHelp();

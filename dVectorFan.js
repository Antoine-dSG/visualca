(() => {
      'use strict';

      const GREEDY_MAX_LEVEL = 100;
      const GREEDY_MAX_DISPLAY_TERMS = 350;

      function coefficientKey(p, q) {
        return p + ',' + q;
      }

      function binomialBig(n, k) {
        if (k < 0n || n < k) return 0n;
        let choose = k;
        if (n - choose < choose) choose = n - choose;
        let result = 1n;
        for (let index = 1n; index <= choose; index += 1n) {
          result = result * (n - choose + index) / index;
        }
        return result;
      }

      function greedyCoefficient(support, p, q, a1, a2, b, c) {
        let first = 0n;
        for (let k = 1; k <= p; k += 1) {
          const earlier = support.get(coefficientKey(p - k, q)) || 0n;
          const upper = a2 - c * BigInt(q) + BigInt(k) - 1n;
          const contribution = earlier * binomialBig(upper, BigInt(k));
          first += k % 2 === 1 ? contribution : -contribution;
        }

        let second = 0n;
        for (let k = 1; k <= q; k += 1) {
          const earlier = support.get(coefficientKey(p, q - k)) || 0n;
          const upper = a1 - b * BigInt(p) + BigInt(k) - 1n;
          const contribution = earlier * binomialBig(upper, BigInt(k));
          second += k % 2 === 1 ? contribution : -contribution;
        }
        return first > second ? first : second;
      }

      function computeGreedyPointedCoefficients(a1, a2, b, c) {
        const largest = a1 > a2 ? a1 : a2;
        const level = largest > 0n ? largest : 0n;
        if (level > BigInt(GREEDY_MAX_LEVEL)) {
          throw new RangeError(
            'This pointed degree requires ' + level.toString() +
            ' recurrence levels. The interactive exact-arithmetic limit is ' +
            GREEDY_MAX_LEVEL + '; select an earlier ray.'
          );
        }

        const support = new Map([[coefficientKey(0, 0), 1n]]);
        const terms = [{ coefficient: 1n, p: 0, q: 0 }];
        const numericLevel = Number(level);
        for (let total = 1; total <= numericLevel; total += 1) {
          for (let q = 0; q <= total; q += 1) {
            const p = total - q;
            const coefficient = greedyCoefficient(support, p, q, a1, a2, b, c);
            support.set(coefficientKey(p, q), coefficient);
            if (coefficient !== 0n) terms.push({ coefficient: coefficient, p: p, q: q });
          }
        }
        return { a1: a1, a2: a2, b: b, c: c, terms: terms, level: numericLevel };
      }

      if (typeof document === 'undefined') {
        if (typeof module !== 'undefined') {
          module.exports = { binomialBig, computeGreedyPointedCoefficients, greedyTeX };
        }
        return;
      }

      const MATHJAX_URL = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js';
      let mathJaxPromise = null;

      function ensureMathJax() {
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
          return Promise.resolve(window.MathJax);
        }
        if (mathJaxPromise) return mathJaxPromise;

        const priorConfiguration = window.MathJax || {};
        window.MathJax = {
          ...priorConfiguration,
          tex: {
            ...(priorConfiguration.tex || {}),
            inlineMath: [['\\(', '\\)']],
            displayMath: [['\\[', '\\]']]
          },
          startup: {
            ...(priorConfiguration.startup || {}),
            typeset: false
          }
        };

        mathJaxPromise = new Promise((resolve, reject) => {
          const finishLoading = () => {
            const startup = window.MathJax && window.MathJax.startup;
            Promise.resolve(startup && startup.promise).then(() => {
              if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                resolve(window.MathJax);
              } else {
                reject(new Error('MathJax loaded without a typesetting API.'));
              }
            }).catch(reject);
          };

          let script = document.getElementById('rank-two-mathjax') ||
            document.getElementById('MathJax-script');
          if (script) {
            script.addEventListener('load', finishLoading, { once: true });
            script.addEventListener('error', () => reject(new Error('MathJax could not be loaded.')), { once: true });
            return;
          }

          script = document.createElement('script');
          script.id = 'rank-two-mathjax';
          script.src = MATHJAX_URL;
          script.async = true;
          script.referrerPolicy = 'no-referrer';
          script.addEventListener('load', finishLoading, { once: true });
          script.addEventListener('error', () => reject(new Error('MathJax could not be loaded.')), { once: true });
          document.head.appendChild(script);
        });
        return mathJaxPromise;
      }

      const root = document.getElementById('rank-two-dvector-lab');
      const superimposeButton = root.querySelector('#dvector-superimpose');
      const mInput = root.querySelector('#dvector-m');
      const nInput = root.querySelector('#dvector-n');
      const countInput = root.querySelector('#dvector-count');
      const rangeInput = root.querySelector('#dvector-range');
      const error = root.querySelector('#dvector-error');
      const seriesList = root.querySelector('#dvector-series-list');
      const plotPanel = root.querySelector('.plot-panel');
      const svg = root.querySelector('#dvector-lab-svg');
      const layer = root.querySelector('#dvector-lab-rays');
      const detail = root.querySelector('#dvector-lab-detail');
      const zoomInButton = root.querySelector('#dvector-zoom-in');
      const zoomOutButton = root.querySelector('#dvector-zoom-out');
      const resetButton = root.querySelector('#dvector-reset');
      const zoomStatus = root.querySelector('#dvector-zoom-status');
      const angleInput = root.querySelector('#dvector-angle-lens');
      const angleStatus = root.querySelector('#dvector-angle-status');
      const greedyPopover = root.querySelector('#greedy-popover');
      const greedySelection = root.querySelector('#greedy-selection');
      const greedyButton = root.querySelector('#greedy-compute');
      const greedyOutput = root.querySelector('#greedy-output');
      const NS = 'http://www.w3.org/2000/svg';
      const origin = { x: 340, y: 285 };
      const baseView = { x: 0, y: 0, width: 680, height: 570 };
      const maxZoom = 8192;
      const maxSeries = 6;
      const shapes = ['circle', 'square', 'diamond', 'triangle', 'cross', 'hexagon'];
      let nextId = 4;
      let view = { ...baseView };
      let drag = null;
      let angleScale = 1;
      let focus = null;
      let selected = null;
      let popoverAnchor = null;
      let renderedSeries = [];
      let series = [
        { id: 1, slot: 0, m: 3, n: 3, count: 8, range: 'both' },
        { id: 2, slot: 1, m: 3, n: 2, count: 8, range: 'both' },
        { id: 3, slot: 2, m: 3, n: 1, count: 8, range: 'both' }
      ];

      function absBig(value) {
        return value < 0n ? -value : value;
      }

      function gcdBig(a, b) {
        a = absBig(a);
        b = absBig(b);
        while (b !== 0n) {
          const remainder = a % b;
          a = b;
          b = remainder;
        }
        return a === 0n ? 1n : a;
      }

      function positivePart(vector) {
        return [vector[0] > 0n ? vector[0] : 0n, vector[1] > 0n ? vector[1] : 0n];
      }

      function subtract(left, right) {
        return [left[0] - right[0], left[1] - right[1]];
      }

      function scaleVector(multiplier, vector) {
        return [multiplier * vector[0], multiplier * vector[1]];
      }

      function degreeAt(index, m, n) {
        return index % 2 === 0 ? BigInt(m) : BigInt(n);
      }

      function primitiveKey(vector) {
        const divisor = gcdBig(vector[0], vector[1]);
        return (vector[0] / divisor).toString() + ',' + (vector[1] / divisor).toString();
      }

      function computeOccurrences(item) {
        const d0 = [-1n, 0n];
        const d1 = [0n, -1n];
        const occurrences = [];
        if (item.range !== 'backward') {
          const forward = [d0, d1];
          for (let index = 1; forward.length < item.count; index += 1) {
            const next = subtract(scaleVector(degreeAt(index, item.m, item.n), positivePart(forward[index])), forward[index - 1]);
            forward.push(next);
          }
          forward.slice(0, item.count).forEach((vector, index) => {
            occurrences.push({ index: index, vector: vector });
          });
        }
        if (item.range !== 'forward') {
          const backward = [];
          let right = d1;
          let current = d0;
          for (let index = 0; index > -item.count; index -= 1) {
            const previous = subtract(scaleVector(degreeAt(index, item.m, item.n), positivePart(current)), right);
            backward.push({ index: index - 1, vector: previous });
            right = current;
            current = previous;
          }
          occurrences.push(...backward);
        }
        return occurrences;
      }

      function deduplicate(item) {
        const rays = new Map();
        computeOccurrences(item).forEach(occurrence => {
          const key = primitiveKey(occurrence.vector);
          if (!rays.has(key)) {
            const divisor = gcdBig(occurrence.vector[0], occurrence.vector[1]);
            rays.set(key, {
              key: key,
              vector: occurrence.vector,
              primitive: [occurrence.vector[0] / divisor, occurrence.vector[1] / divisor],
              indices: []
            });
          }
          rays.get(key).indices.push(occurrence.index);
        });
        return [...rays.values()];
      }

      function scaledPair(vector) {
        const maximum = absBig(vector[0]) > absBig(vector[1]) ? absBig(vector[0]) : absBig(vector[1]);
        const bits = maximum === 0n ? 1 : maximum.toString(2).length;
        const shift = BigInt(Math.max(0, bits - 52));
        const convert = value => {
          const sign = value < 0n ? -1 : 1;
          return sign * Number(absBig(value) >> shift);
        };
        return [convert(vector[0]), convert(vector[1])];
      }

      function vectorAngle(vector) {
        const pair = scaledPair(vector);
        return Math.atan2(pair[1], pair[0]);
      }

      function bigRatio(numerator, denominator) {
        if (numerator === 0n) return 0;
        const sign = (numerator < 0n) !== (denominator < 0n) ? -1 : 1;
        const a = absBig(numerator).toString();
        const b = absBig(denominator).toString();
        const digitsA = Math.min(15, a.length);
        const digitsB = Math.min(15, b.length);
        const leadingA = Number(a.slice(0, digitsA));
        const leadingB = Number(b.slice(0, digitsB));
        const exponent = (a.length - digitsA) - (b.length - digitsB);
        return sign * (leadingA / leadingB) * Math.pow(10, exponent);
      }

      function relativeAngle(reference, vector) {
        const determinant = reference[0] * vector[1] - reference[1] * vector[0];
        const dot = reference[0] * vector[0] + reference[1] * vector[1];
        if (dot === 0n) return determinant >= 0n ? Math.PI / 2 : -Math.PI / 2;
        const acute = Math.atan(Math.abs(bigRatio(determinant, dot)));
        if (dot > 0n) return determinant >= 0n ? acute : -acute;
        return determinant >= 0n ? Math.PI - acute : -Math.PI + acute;
      }

      function displayAngle(vector) {
        if (angleScale === 1 || !focus) return vectorAngle(vector);
        const delta = relativeAngle(focus.vector, vector);
        if (Math.abs(delta * angleScale) > Math.PI) return null;
        return vectorAngle(focus.vector) + delta * angleScale;
      }

      function formatIndex(index) {
        return index < 0 ? 'd_−' + Math.abs(index) : 'd_' + index;
      }

      function rangeLabel(value) {
        if (value === 'forward') return 'forward';
        if (value === 'backward') return 'backward';
        return 'two-sided';
      }

      function selectedIdentity(item, ray) {
        return [item.id, item.m, item.n, ray.vector[0].toString(), ray.vector[1].toString()].join(':');
      }

      function setGreedyMessage(message, className) {
        greedyOutput.replaceChildren();
        greedyOutput.hidden = false;
        const text = document.createElement('span');
        text.className = className || 'greedy-message';
        text.textContent = message;
        greedyOutput.appendChild(text);
        window.requestAnimationFrame(positionGreedyPopover);
      }

      function updateGreedySelection(item, ray) {
        const indices = [...ray.indices].sort((a, b) => a - b).map(formatIndex).join(', ');
        const identity = selectedIdentity(item, ray);
        greedySelection.textContent =
          '(' + item.m + ',' + item.n + ') · ' + indices + ' · d = (' +
          ray.vector[0].toString() + ', ' + ray.vector[1].toString() + ')';
        greedyButton.disabled = false;
        if (greedyOutput.dataset.selection !== identity) {
          greedyOutput.dataset.selection = identity;
          greedyOutput.replaceChildren();
          greedyOutput.hidden = true;
        }
      }

      function hideGreedyPopover() {
        greedyPopover.hidden = true;
        popoverAnchor = null;
      }

      function positionGreedyPopover() {
        if (greedyPopover.hidden || !popoverAnchor) return;
        const panelRect = plotPanel.getBoundingClientRect();
        const popoverRect = greedyPopover.getBoundingClientRect();
        const margin = 8;
        const gap = 12;
        const maximumLeft = Math.max(margin, panelRect.width - popoverRect.width - margin);
        const maximumTop = Math.max(margin, panelRect.height - popoverRect.height - margin);
        let left = Math.max(margin, Math.min(maximumLeft, popoverAnchor.x + gap));
        let top = popoverAnchor.y + gap;
        if (top + popoverRect.height > panelRect.height - margin && popoverAnchor.y - popoverRect.height - gap >= margin) {
          top = popoverAnchor.y - popoverRect.height - gap;
        }
        top = Math.max(margin, Math.min(maximumTop, top));
        greedyPopover.style.left = left + 'px';
        greedyPopover.style.top = top + 'px';
      }

      function showGreedyPopover(item, ray, clientX, clientY) {
        const panelRect = plotPanel.getBoundingClientRect();
        popoverAnchor = { x: clientX - panelRect.left, y: clientY - panelRect.top };
        updateGreedySelection(item, ray);
        greedyPopover.hidden = false;
        positionGreedyPopover();
      }

      function clearGreedySelection() {
        greedySelection.textContent = '';
        greedyButton.disabled = true;
        greedyOutput.removeAttribute('data-selection');
        greedyOutput.replaceChildren();
        greedyOutput.hidden = true;
        hideGreedyPopover();
      }

      function texVariable(index, exponent) {
        if (exponent === 0n) return '';
        if (exponent === 1n) return 'x_{' + index + '}';
        return 'x_{' + index + '}^{' + exponent.toString() + '}';
      }

      function texMonomial(coefficient, exponent1, exponent2) {
        const absoluteCoefficient = coefficient < 0n ? -coefficient : coefficient;
        const hasVariables = exponent1 !== 0n || exponent2 !== 0n;
        const scalar = absoluteCoefficient !== 1n || !hasVariables
          ? absoluteCoefficient.toString()
          : '';
        return scalar + texVariable(1, exponent1) + texVariable(2, exponent2);
      }

      function greedyTeX(result) {
        const factor1 = -result.a1;
        const factor2 = -result.a2;
        const hasFactor = factor1 !== 0n || factor2 !== 0n;
        const hasNonconstantPointedPart = result.terms.length > 1;
        let rightHandSide = hasFactor ? texMonomial(1n, factor1, factor2) : '';

        if (hasNonconstantPointedPart) {
          const pointedPart = result.terms.map((term, index) => {
            const sign = index === 0
              ? (term.coefficient < 0n ? '-' : '')
              : (term.coefficient < 0n ? ' - ' : ' + ');
            return sign + texMonomial(
              term.coefficient,
              result.b * BigInt(term.p),
              result.c * BigInt(term.q)
            );
          }).join('');
          rightHandSide += hasFactor
            ? '\\left(' + pointedPart + '\\right)'
            : pointedPart;
        } else if (!hasFactor) {
          rightHandSide = '1';
        }

        return 'x\\!\\left[' + result.a1.toString() + ',' + result.a2.toString() +
          '\\right] = ' + rightHandSide;
      }

      function renderGreedyExpression(result) {
        if (window.MathJax && typeof window.MathJax.typesetClear === 'function') {
          window.MathJax.typesetClear([greedyOutput]);
        }
        greedyOutput.replaceChildren();
        greedyOutput.hidden = false;
        const expression = document.createElement('div');
        expression.className = 'math-expression';
        const tex = greedyTeX(result);
        expression.textContent = '\\[' + tex + '\\]';

        const summary = document.createElement('div');
        summary.className = 'greedy-message text-small';
        summary.textContent =
          result.terms.length + ' nonzero pointed coefficient' +
          (result.terms.length === 1 ? '' : 's') +
          ' · exact integer arithmetic · recurrence levels 0–' + result.level;
        greedyOutput.append(expression, summary);
        window.requestAnimationFrame(positionGreedyPopover);

        ensureMathJax().then(mathJax => {
          if (!expression.isConnected) return;
          return mathJax.typesetPromise([expression]).then(() => {
            window.requestAnimationFrame(positionGreedyPopover);
          });
        }).catch(() => {
          if (!expression.isConnected) return;
          expression.textContent = tex;
          summary.textContent += ' · MathJax unavailable; showing TeX source';
          window.requestAnimationFrame(positionGreedyPopover);
        });
      }

      function setDetail(item, ray, commitSelection) {
        if (commitSelection) {
          selected = { seriesId: item.id, key: ray.key };
        }
        const indices = [...ray.indices].sort((a, b) => a - b).map(formatIndex).join(', ');
        const angle = vectorAngle(ray.vector) * 180 / Math.PI;
        detail.innerHTML =
          '<strong>(' + item.m + ',' + item.n + ')</strong> &nbsp; ' +
          indices + ' &nbsp; primitive direction (' +
          ray.primitive[0].toString() + ', ' + ray.primitive[1].toString() +
          ') <span class="muted">&nbsp; angle ' + angle.toFixed(8) + '°</span>';
      }

      function chooseFocus(data) {
        if (focus) {
          const owner = data.find(entry => entry.item.id === focus.seriesId);
          if (owner) {
            const sameRay = owner.rays.find(ray => ray.key === focus.key);
            if (sameRay) {
              focus = { seriesId: owner.item.id, key: sameRay.key, vector: sameRay.vector };
              return;
            }
          }
        }
        if (data.length === 0 || data[0].rays.length === 0) {
          focus = null;
          return;
        }
        const item = data[0].item;
        const preferred = data[0].rays.find(ray => ray.indices.includes(item.count - 1)) || data[0].rays[data[0].rays.length - 1];
        focus = { seriesId: item.id, key: preferred.key, vector: preferred.vector };
      }

      function createMarker(group, point, item) {
        const shape = shapes[item.slot];
        let mark;
        if (shape === 'circle') {
          mark = document.createElementNS(NS, 'circle');
          mark.setAttribute('cx', point.x);
          mark.setAttribute('cy', point.y);
          mark.setAttribute('r', '4.5');
        } else if (shape === 'triangle' || shape === 'hexagon' || shape === 'cross') {
          mark = document.createElementNS(NS, 'polygon');
          if (shape === 'triangle') {
            mark.setAttribute('points', point.x + ',' + (point.y - 5) + ' ' + (point.x + 5) + ',' + (point.y + 4) + ' ' + (point.x - 5) + ',' + (point.y + 4));
          } else if (shape === 'hexagon') {
            mark.setAttribute('points', (point.x - 5) + ',' + point.y + ' ' + (point.x - 2.5) + ',' + (point.y - 4.3) + ' ' + (point.x + 2.5) + ',' + (point.y - 4.3) + ' ' + (point.x + 5) + ',' + point.y + ' ' + (point.x + 2.5) + ',' + (point.y + 4.3) + ' ' + (point.x - 2.5) + ',' + (point.y + 4.3));
          } else {
            mark.setAttribute('points', (point.x - 5) + ',' + (point.y - 2) + ' ' + (point.x - 2) + ',' + (point.y - 2) + ' ' + (point.x - 2) + ',' + (point.y - 5) + ' ' + (point.x + 2) + ',' + (point.y - 5) + ' ' + (point.x + 2) + ',' + (point.y - 2) + ' ' + (point.x + 5) + ',' + (point.y - 2) + ' ' + (point.x + 5) + ',' + (point.y + 2) + ' ' + (point.x + 2) + ',' + (point.y + 2) + ' ' + (point.x + 2) + ',' + (point.y + 5) + ' ' + (point.x - 2) + ',' + (point.y + 5) + ' ' + (point.x - 2) + ',' + (point.y + 2) + ' ' + (point.x - 5) + ',' + (point.y + 2));
          }
        } else {
          mark = document.createElementNS(NS, 'rect');
          mark.setAttribute('x', point.x - 4);
          mark.setAttribute('y', point.y - 4);
          mark.setAttribute('width', '8');
          mark.setAttribute('height', '8');
          if (shape === 'diamond') mark.setAttribute('transform', 'rotate(45 ' + point.x + ' ' + point.y + ')');
        }
        mark.dataset.cx = point.x;
        mark.dataset.cy = point.y;
        mark.dataset.shape = shape;
        mark.setAttribute('class', 'mark s' + (item.slot + 1));
        group.appendChild(mark);
      }

      function addRay(item, ray, radius) {
        const angle = displayAngle(ray.vector);
        if (angle === null) return;
        const point = {
          x: origin.x + radius * Math.cos(angle),
          y: origin.y - radius * Math.sin(angle)
        };
        const group = document.createElementNS(NS, 'g');
        group.setAttribute('class', 'ray-group s' + (item.slot + 1));
        if (selected && selected.seriesId === item.id && selected.key === ray.key) {
          group.classList.add('is-selected');
        }
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', origin.x);
        line.setAttribute('y1', origin.y);
        line.setAttribute('x2', point.x);
        line.setAttribute('y2', point.y);
        line.setAttribute('class', 'ray s' + (item.slot + 1));
        group.appendChild(line);
        createMarker(group, point, item);
        group.addEventListener('pointerdown', event => {
          if (event.button === 0) event.stopPropagation();
        });
        group.addEventListener('pointerenter', () => setDetail(item, ray, false));
        group.addEventListener('click', event => {
          event.stopPropagation();
          focus = { seriesId: item.id, key: ray.key, vector: ray.vector };
          setDetail(item, ray, true);
          showGreedyPopover(item, ray, event.clientX, event.clientY);
          renderRays();
        });
        layer.appendChild(group);
      }

      function renderSeriesList() {
        seriesList.innerHTML = '';
        renderedSeries.forEach(entry => {
          const item = entry.item;
          const wrapper = document.createElement('span');
          wrapper.setAttribute('class', 'series-item');
          const dot = document.createElement('span');
          dot.setAttribute('class', 'dot s' + (item.slot + 1) + ' shape-' + shapes[item.slot]);
          const label = document.createElement('span');
          label.textContent = '(' + item.m + ',' + item.n + ') · N=' + item.count + ' · ' + rangeLabel(item.range) + ' · ' + entry.rays.length + ' unique rays';
          const remove = document.createElement('button');
          remove.type = 'button';
          remove.setAttribute('class', 'btn btn-ghost');
          remove.textContent = 'Remove';
          remove.setAttribute('aria-label', 'Remove computation (' + item.m + ',' + item.n + ')');
          remove.addEventListener('click', () => {
            series = series.filter(candidate => candidate.id !== item.id);
            if (focus && focus.seriesId === item.id) focus = null;
            render();
          });
          wrapper.append(dot, label, remove);
          seriesList.appendChild(wrapper);
        });
      }

      function renderRays() {
        layer.replaceChildren();
        renderedSeries.forEach(entry => {
          const radius = 245 - entry.item.slot * 14;
          entry.rays.forEach(ray => addRay(entry.item, ray, radius));
        });
        if (selected) {
          const owner = renderedSeries.find(entry => entry.item.id === selected.seriesId);
          const ray = owner && owner.rays.find(candidate => candidate.key === selected.key);
          if (owner && ray) setDetail(owner.item, ray, false);
        }
        updateMarkers(baseView.width / view.width);
      }

      function render() {
        renderedSeries = series.map(item => ({ item: item, rays: deduplicate(item) }));
        chooseFocus(renderedSeries);
        if (selected) {
          const owner = renderedSeries.find(entry => entry.item.id === selected.seriesId);
          const ray = owner && owner.rays.find(candidate => candidate.key === selected.key);
          if (!owner || !ray) selected = null;
        }
        renderSeriesList();
        renderRays();
        if (renderedSeries.length === 0) {
          detail.textContent = 'Add a computation to display its denominator-vector rays.';
          selected = null;
          clearGreedySelection();
        } else if (!selected) {
          detail.textContent = 'Click a ray to select its d-vector.';
          clearGreedySelection();
        }
      }

      function clampView() {
        view.x = Math.max(baseView.x, Math.min(baseView.x + baseView.width - view.width, view.x));
        view.y = Math.max(baseView.y, Math.min(baseView.y + baseView.height - view.height, view.y));
      }

      function updateMarkers(zoom) {
        layer.querySelectorAll('.mark').forEach(mark => {
          const cx = Number(mark.dataset.cx);
          const cy = Number(mark.dataset.cy);
          const shape = mark.dataset.shape;
          if (shape === 'circle') {
            mark.setAttribute('r', 4.5 / zoom);
          } else if (shape === 'square' || shape === 'diamond') {
            mark.setAttribute('x', cx - 4 / zoom);
            mark.setAttribute('y', cy - 4 / zoom);
            mark.setAttribute('width', 8 / zoom);
            mark.setAttribute('height', 8 / zoom);
            if (shape === 'diamond') mark.setAttribute('transform', 'rotate(45 ' + cx + ' ' + cy + ')');
          } else {
            mark.setAttribute('transform', 'translate(' + cx + ' ' + cy + ') scale(' + (1 / zoom) + ') translate(' + (-cx) + ' ' + (-cy) + ')');
          }
        });
      }

      function applyView() {
        clampView();
        svg.setAttribute('viewBox', view.x + ' ' + view.y + ' ' + view.width + ' ' + view.height);
        const zoom = baseView.width / view.width;
        zoomStatus.textContent = 'Zoom ' + (zoom < 10 ? zoom.toFixed(1) : Math.round(zoom)) + '×';
        updateMarkers(zoom);
        zoomOutButton.disabled = zoom <= 1.0001;
        zoomInButton.disabled = zoom >= maxZoom - 0.1;
      }

      function zoomAt(factor, clientX, clientY) {
        const rect = svg.getBoundingClientRect();
        const anchorX = view.x + (clientX - rect.left) * view.width / rect.width;
        const anchorY = view.y + (clientY - rect.top) * view.height / rect.height;
        const ratioX = (anchorX - view.x) / view.width;
        const ratioY = (anchorY - view.y) / view.height;
        const width = Math.max(baseView.width / maxZoom, Math.min(baseView.width, view.width * factor));
        const height = width * baseView.height / baseView.width;
        view = {
          x: anchorX - ratioX * width,
          y: anchorY - ratioY * height,
          width: width,
          height: height
        };
        applyView();
      }

      function zoomAroundCenter(factor) {
        const rect = svg.getBoundingClientRect();
        zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }

      superimposeButton.addEventListener('click', () => {
        hideGreedyPopover();
        error.textContent = '';
        const m = Number(mInput.value);
        const n = Number(nInput.value);
        const count = Number(countInput.value);
        const range = rangeInput.value;
        if (![m, n, count].every(Number.isInteger) || m < 1 || n < 1 || m > 20 || n > 20 || count < 1 || count > 40) {
          error.textContent = 'Use integers 1–20 for m and n, and 1–40 for N.';
          return;
        }
        const existing = series.find(item => item.m === m && item.n === n && item.range === range);
        if (existing) {
          existing.count = count;
          focus = null;
          selected = null;
        } else {
          if (series.length >= maxSeries) {
            error.textContent = 'Remove a computation before adding another; at most six can be shown at once.';
            return;
          }
          const usedSlots = new Set(series.map(item => item.slot));
          let slot = 0;
          while (usedSlots.has(slot)) slot += 1;
          series.push({ id: nextId, slot: slot, m: m, n: n, count: count, range: range });
          nextId += 1;
        }
        render();
      });

      greedyButton.addEventListener('click', () => {
        const owner = selected && renderedSeries.find(entry => entry.item.id === selected.seriesId);
        const ray = owner && owner.rays.find(candidate => candidate.key === selected.key);
        if (!owner || !ray) {
          clearGreedySelection();
          return;
        }

        const identity = selectedIdentity(owner.item, ray);
        greedyButton.disabled = true;
        greedyButton.textContent = 'Computing…';
        setGreedyMessage('Computing the Lee–Li–Zelevinsky recurrence with exact integers…');

        window.setTimeout(() => {
          try {
            const result = computeGreedyPointedCoefficients(
              ray.vector[0],
              ray.vector[1],
              BigInt(owner.item.m),
              BigInt(owner.item.n)
            );
            if (result.terms.length > GREEDY_MAX_DISPLAY_TERMS) {
              throw new RangeError(
                'The exact expansion has ' + result.terms.length +
                ' nonzero pointed coefficients, which is too large for the ray popover. Select an earlier ray.'
              );
            }
            if (greedyOutput.dataset.selection === identity) renderGreedyExpression(result);
          } catch (calculationError) {
            if (greedyOutput.dataset.selection === identity) {
              setGreedyMessage(calculationError.message || 'The greedy element could not be computed.', 'greedy-error');
            }
          } finally {
            greedyButton.textContent = 'Compute greedy element';
            greedyButton.disabled = !selected;
          }
        }, 0);
      });

      angleInput.addEventListener('input', () => {
        hideGreedyPopover();
        angleScale = Math.pow(10, Number(angleInput.value));
        angleStatus.textContent = angleScale === 1 ? '1×' : '10^' + angleInput.value + '×';
        renderRays();
      });

      svg.addEventListener('wheel', event => {
        event.preventDefault();
        hideGreedyPopover();
        zoomAt(Math.exp(event.deltaY * 0.002), event.clientX, event.clientY);
      }, { passive: false });

      svg.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        hideGreedyPopover();
        svg.setPointerCapture(event.pointerId);
        drag = { x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y };
        svg.classList.add('is-dragging');
      });

      svg.addEventListener('pointermove', event => {
        if (!drag) return;
        const rect = svg.getBoundingClientRect();
        view.x = drag.viewX - (event.clientX - drag.x) * view.width / rect.width;
        view.y = drag.viewY - (event.clientY - drag.y) * view.height / rect.height;
        applyView();
      });

      function stopDrag(event) {
        if (!drag) return;
        if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
        drag = null;
        svg.classList.remove('is-dragging');
      }

      svg.addEventListener('pointerup', stopDrag);
      svg.addEventListener('pointercancel', stopDrag);
      svg.addEventListener('click', hideGreedyPopover);
      zoomInButton.addEventListener('click', () => {
        hideGreedyPopover();
        zoomAroundCenter(0.25);
      });
      zoomOutButton.addEventListener('click', () => {
        hideGreedyPopover();
        zoomAroundCenter(4);
      });
      resetButton.addEventListener('click', () => {
        hideGreedyPopover();
        view = { ...baseView };
        angleScale = 1;
        angleInput.value = '0';
        angleStatus.textContent = '1×';
        applyView();
        renderRays();
      });
      window.addEventListener('resize', positionGreedyPopover);
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') hideGreedyPopover();
      });

      render();
      applyView();
      ensureMathJax().catch(() => {});
    })();

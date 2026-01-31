/***************************
 * Commands and Operators.
 **************************/

// Scale function for scaling delimiters
// Uses CSS 2D transform to scale HTML elements
let scale: (jQ: DOMFragment, x: number, y: number) => void;

(() => {
  const div = document.createElement('div');
  const div_style = div.style;
  const transformPropNames: { [key: string]: number } = {
    transform: 1,
    WebkitTransform: 1,
    MozTransform: 1,
    OTransform: 1,
    msTransform: 1
  };
  let transformPropName: string | undefined;

  for (const prop in transformPropNames) {
    if (prop in div_style) {
      transformPropName = prop;
      break;
    }
  }

  if (transformPropName) {
    const prop = transformPropName;
    scale = function (jQ: DOMFragment, x: number, y: number) {
      jQ.eachElement((el) => {
        (el.style as any)[prop] = 'scale(' + x + ',' + y + ')';
      });
    };
  } else {
    // Fallback: just scale fontSize
    scale = function (jQ: DOMFragment, x: number, y: number) {
      jQ.eachElement((el) => {
        el.style.fontSize = y + 'em';
      });
    };
  }
})();

var SVG_SYMBOLS = {
  sqrt: {
    width: '',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '0 0 32 54' }, [
        h('path', {
          d: 'M0 33 L7 27 L12.5 47 L13 47 L30 0 L32 0 L13 54 L11 54 L4.5 31 L0 33'
        })
      ])
  },
  '|': {
    width: '.4em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '0 0 10 54' }, [
        h('path', { d: 'M4.4 0 L4.4 54 L5.6 54 L5.6 0' })
      ])
  },
  '[': {
    width: '.55em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '0 0 11 24' }, [
        h('path', { d: 'M8 0 L3 0 L3 24 L8 24 L8 23 L4 23 L4 1 L8 1' })
      ])
  },
  ']': {
    width: '.55em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '0 0 11 24' }, [
        h('path', { d: 'M3 0 L8 0 L8 24 L3 24 L3 23 L7 23 L7 1 L3 1' })
      ])
  },
  '(': {
    width: '.55em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '3 0 106 186' }, [
        h('path', {
          d: 'M85 0 A61 101 0 0 0 85 186 L75 186 A75 101 0 0 1 75 0'
        })
      ])
  },
  ')': {
    width: '.55em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '3 0 106 186' }, [
        h('path', {
          d: 'M24 0 A61 101 0 0 1 24 186 L34 186 A75 101 0 0 0 34 0'
        })
      ])
  },
  '{': {
    width: '.7em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '10 0 210 350' }, [
        h('path', {
          d: 'M170 0 L170 6 A47 52 0 0 0 123 60 L123 127 A35 48 0 0 1 88 175 A35 48 0 0 1 123 223 L123 290 A47 52 0 0 0 170 344 L170 350 L160 350 A58 49 0 0 1 102 301 L103 220 A45 40 0 0 0 58 180 L58 170 A45 40 0 0 0 103 130 L103 49 A58 49 0 0 1 161 0'
        })
      ])
  },
  '}': {
    width: '.7em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '10 0 210 350' }, [
        h('path', {
          d: 'M60 0 L60 6 A47 52 0 0 1 107 60 L107 127 A35 48 0 0 0 142 175 A35 48 0 0 0 107 223 L107 290 A47 52 0 0 1 60 344 L60 350 L70 350 A58 49 0 0 0 128 301 L127 220 A45 40 0 0 1 172 180 L172 170 A45 40 0 0 1 127 130 L127 49 A58 49 0 0 0 70 0'
        })
      ])
  },
  '&#8741;': {
    width: '.7em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '0 0 10 54' }, [
        h('path', { d: 'M3.2 0 L3.2 54 L4 54 L4 0 M6.8 0 L6.8 54 L6 54 L6 0' })
      ])
  },
  '&lang;': {
    width: '.55em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '0 0 10 54' }, [
        h('path', { d: 'M6.8 0 L3.2 27 L6.8 54 L7.8 54 L4.2 27 L7.8 0' })
      ])
  },
  '&rang;': {
    width: '.55em',
    html: () =>
      h('svg', { preserveAspectRatio: 'none', viewBox: '0 0 10 54' }, [
        h('path', { d: 'M3.2 0 L6.8 27 L3.2 54 L2.2 54 L5.8 27 L2.2 0' })
      ])
  }
};

const ArrowText = '\u27A4';

class Style extends MathCommand {
  shouldNotSpeakDelimiters: boolean | undefined;

  constructor(
    ctrlSeq: string,
    tagName: HTMLTagName,
    attrs: { class: string },
    ariaLabel?: string,
    opts?: {
      shouldNotSpeakDelimiters?: boolean;
      beforeChild?: () => HTMLElement;
      afterChild?: () => HTMLElement;
    }
  ) {
    super(
      ctrlSeq,
      new DOMView(1, (blocks) => {
        return h.block(tagName, attrs, blocks[0], {
          beforeChild: opts?.beforeChild?.(),
          afterChild: opts?.afterChild?.()
        });
      })
    );

    this.ariaLabel = ariaLabel || ctrlSeq.replace(/^\\/, '');
    this.mathspeakTemplate = [
      'Start' + this.ariaLabel + ',',
      'End' + this.ariaLabel
    ];
    // In most cases, mathspeak should announce the start and end of style blocks.
    // There is one exception currently (mathrm).
    this.shouldNotSpeakDelimiters = opts && opts.shouldNotSpeakDelimiters;
  }
  mathspeak(opts?: MathspeakOptions) {
    if (!this.shouldNotSpeakDelimiters || (opts && opts.ignoreShorthand)) {
      return super.mathspeak();
    }
    return this.foldChildren('', function (speech, block) {
      return speech + ' ' + block.mathspeak(opts);
    }).trim();
  }
}

//fonts
LatexCmds.mathrm = class extends Style {
  constructor() {
    super('\\mathrm', 'span', { class: 'mq-roman mq-font' }, 'Roman Font', {
      shouldNotSpeakDelimiters: true
    });
  }
  isTextBlock() {
    return true;
  }
};
LatexCmds.mathit = () =>
  new Style('\\mathit', 'i', { class: 'mq-font' }, 'Italic Font');
LatexCmds.mathbf = () =>
  new Style('\\mathbf', 'b', { class: 'mq-font' }, 'Bold Font');
LatexCmds.mathsf = () =>
  new Style(
    '\\mathsf',
    'span',
    { class: 'mq-sans-serif mq-font' },
    'Serif Font'
  );
LatexCmds.mathtt = () =>
  new Style('\\mathtt', 'span', { class: 'mq-monospace mq-font' }, 'Math Text');
//text-decoration
LatexCmds.underline = () =>
  new Style(
    '\\underline',
    'span',
    { class: 'mq-non-leaf mq-underline' },
    'Underline'
  );
LatexCmds.overline = LatexCmds.bar = () =>
  new Style(
    '\\overline',
    'span',
    { class: 'mq-non-leaf mq-overline' },
    'Overline'
  );
LatexCmds.overrightarrow = () =>
  new Style(
    '\\overrightarrow',
    'span',
    { class: 'mq-non-leaf mq-overarrow' },
    'Over Right Arrow',
    {
      afterChild: () =>
        h('span', { class: 'mq-arrow-right-content' }, [h.text(ArrowText)])
    }
  );
LatexCmds.overleftarrow = () =>
  new Style(
    '\\overleftarrow',
    'span',
    { class: 'mq-non-leaf mq-overarrow' },
    'Over Left Arrow',
    {
      beforeChild: () =>
        h('span', { class: 'mq-arrow-left-content' }, [h.text(ArrowText)])
    }
  );
LatexCmds.overleftrightarrow = () =>
  new Style(
    '\\overleftrightarrow ',
    'span',
    { class: 'mq-non-leaf mq-overarrow' },
    'Over Left and Right Arrow',
    {
      beforeChild: () =>
        h('span', { class: 'mq-arrow-left-content' }, [h.text(ArrowText)]),
      afterChild: () =>
        h('span', { class: 'mq-arrow-right-content' }, [h.text(ArrowText)])
    }
  );
LatexCmds.underrightarrow = () =>
  new Style(
    '\\underrightarrow',
    'span',
    { class: 'mq-non-leaf mq-underarrow' },
    'Under Right Arrow',
    {
      afterChild: () =>
        h('span', { class: 'mq-arrow-right-content' }, [h.text(ArrowText)])
    }
  );
LatexCmds.underleftarrow = () =>
  new Style(
    '\\underleftarrow',
    'span',
    { class: 'mq-non-leaf mq-underarrow' },
    'Under Left Arrow',
    {
      beforeChild: () =>
        h('span', { class: 'mq-arrow-left-content' }, [h.text(ArrowText)])
    }
  );
LatexCmds.underleftrightarrow = () =>
  new Style(
    '\\underleftrightarrow',
    'span',
    { class: 'mq-non-leaf mq-underarrow' },
    'Under Left and Right Arrow',
    {
      beforeChild: () =>
        h('span', { class: 'mq-arrow-left-content' }, [h.text(ArrowText)]),
      afterChild: () =>
        h('span', { class: 'mq-arrow-right-content' }, [h.text(ArrowText)])
    }
  );
LatexCmds.overarc = () =>
  new Style(
    '\\overarc',
    'span',
    { class: 'mq-non-leaf mq-overarc' },
    'Over Arc'
  );
LatexCmds.dot = () => {
  return new MathCommand(
    '\\dot',
    new DOMView(1, (blocks) =>
      h('span', { class: 'mq-non-leaf' }, [
        h('span', { class: 'mq-dot-recurring-inner' }, [
          h('span', { class: 'mq-dot-recurring' }, [h.text(U_DOT_ABOVE)]),
          h.block('span', { class: 'mq-empty-box' }, blocks[0])
        ])
      ])
    )
  );
};

// Harpoons command - handles both one-argument and two-argument variants
class Harpoons extends MathCommand {
  constructor(numBlocks: 1 | 2 = 1) {
    const domView = new DOMView(numBlocks, (blocks) => {
      const children: VNode[] = [];

      if (numBlocks === 2) {
        // Two-argument variant: \xrightleftharpoons[below]{above}
        children.push(h.block('span', { class: 'mq-harpoons-numerator' }, blocks[1]));
      } else {
        // One-argument variant: \xrightleftharpoons{above}
        children.push(h.block('span', { class: 'mq-harpoons-numerator' }, blocks[0]));
      }

      children.push(h('span', { class: 'mq-harpoons-harpoons' }, [h.text('\u21cc')]));
      children.push(h('span', { class: 'mq-harpoons-harpoons-helper' }, [h.text('\u21cc')]));

      if (numBlocks === 2) {
        children.push(h.block('span', { class: 'mq-harpoons-denominator' }, blocks[0]));
      }

      return h('span', { class: 'mq-harpoons mq-harpoons-rightleft mq-non-leaf' }, children);
    });

    super('\\xrightleftharpoons', domView);
  }

  parser() {
    return latexMathParser.optBlock
      .then(function (optBlock: MathBlock) {
        return latexMathParser.block.map(function (block: MathBlock) {
          const harpoons = new Harpoons(2);
          harpoons.blocks = [optBlock, block];
          optBlock.adopt(harpoons, 0, 0);
          block.adopt(harpoons, optBlock, 0);
          return harpoons;
        });
      })
      .or(
        latexMathParser.block.map(function (block: MathBlock) {
          const harpoons = new Harpoons(1);
          harpoons.blocks = [block];
          block.adopt(harpoons, 0, 0);
          return harpoons;
        })
      );
  }

  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    if (this.blocks.length === 2) {
      // Two-argument variant
      ctx.latex += this.ctrlSeq + '[';
      this.ends[L].latexRecursive(ctx);
      ctx.latex += ']{';
      this.ends[R].latexRecursive(ctx);
      ctx.latex += '}';
    } else {
      // One-argument variant
      ctx.latex += this.ctrlSeq + '{';
      this.ends[L].latexRecursive(ctx);
      ctx.latex += '}';
    }

    this.checkCursorContextClose(ctx);
  }
}

LatexCmds.xrightleftharpoons = () => new Harpoons();

// `\textcolor{color}{math}` will apply a color to the given math content, where
// `color` is any valid CSS Color Value (see [SitePoint docs][] (recommended),
// [Mozilla docs][], or [W3C spec][]).
//
// [SitePoint docs]: http://reference.sitepoint.com/css/colorvalues
// [Mozilla docs]: https://developer.mozilla.org/en-US/docs/CSS/color_value#Values
// [W3C spec]: http://dev.w3.org/csswg/css3-color/#colorunits
LatexCmds.textcolor = class extends MathCommand {
  color: string | undefined;

  setColor(color: string) {
    this.color = color;
    this.domView = new DOMView(1, (blocks) =>
      h.block(
        'span',
        { class: 'mq-textcolor', style: 'color:' + color },
        blocks[0]
      )
    );
    this.ariaLabel = color.replace(/^\\/, '');
    this.mathspeakTemplate = [
      'Start ' + this.ariaLabel + ',',
      'End ' + this.ariaLabel
    ];
  }
  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);
    var blocks0 = this.blocks![0];
    ctx.uncleanedLatex += '\\textcolor{' + this.color + '}{';
    blocks0.latexRecursive(ctx);
    ctx.uncleanedLatex += '}';
    this.checkCursorContextClose(ctx);
  }
  parser() {
    var optWhitespace = Parser.optWhitespace;
    var string = Parser.string;
    var regex = Parser.regex;

    return optWhitespace
      .then(string('{'))
      .then(regex(/^[#\w\s.,()%-]*/))
      .skip(string('}'))
      .then((color) => {
        this.setColor(color);
        return super.parser();
      });
  }
  isStyleBlock() {
    return true;
  }
};

// Very similar to the \textcolor command, but will add the given CSS class.
// Usage: \class{classname}{math}
// Note regex that whitelists valid CSS classname characters:
// https://github.com/mathquill/mathquill/pull/191#discussion_r4327442
var Class = (LatexCmds['class'] = class extends MathCommand {
  cls: string | undefined;

  parser() {
    var string = Parser.string,
      regex = Parser.regex;
    return Parser.optWhitespace
      .then(string('{'))
      .then(regex(/^[-\w\s\\\xA0-\xFF]*/))
      .skip(string('}'))
      .then((cls) => {
        this.cls = cls || '';
        this.domView = new DOMView(1, (blocks) =>
          h.block('span', { class: `mq-class ${cls}` }, blocks[0])
        );
        this.ariaLabel = cls + ' class';
        this.mathspeakTemplate = [
          'Start ' + this.ariaLabel + ',',
          'End ' + this.ariaLabel
        ];
        return super.parser();
      });
  }
  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    var blocks0 = this.blocks![0];
    ctx.uncleanedLatex += '\\class{' + this.cls + '}{';
    blocks0.latexRecursive(ctx);
    ctx.uncleanedLatex += '}';

    this.checkCursorContextClose(ctx);
  }
  isStyleBlock() {
    return true;
  }
});

// This test is used to determine whether an item may be treated as a whole number
// for shortening the verbalized (mathspeak) forms of some fractions and superscripts.
var intRgx = /^[\+\-]?[\d]+$/;

// Traverses the top level of the passed block's children and returns the concatenation of their ctrlSeq properties.
// Used in shortened mathspeak computations as a block's .text() method can be potentially expensive.
//
function getCtrlSeqsFromBlock(block: NodeRef): string {
  if (!block) return '';

  let chars = '';
  block.eachChild((child) => {
    if (child.ctrlSeq !== undefined) chars += child.ctrlSeq;
  });

  return chars;
}

Options.prototype.charsThatBreakOutOfSupSub = '';

/**
 * A SupSub node is a superscript, subscript, or both. It is possible to edit a SupSub node
 * from being a superscript to a subscript without deleting the node by adding a subscript
 * then deleting the superscript.
 */
class SupSub extends MathCommand {
  sub?: MathBlock;
  sup?: MathBlock;
  /**
   * `supsub` is the current or planned shape of the SupSub node.
   *
   * It is set before intializing to know where to put the first block seen in parsing,
   * either in the superscript or subscript. This is necessary e.g. because the SupSub
   * in both `x_2` and `x^2` have a single MathBlock child, but the child goes to the
   * subscript in one and the exponent in the other.
   *
   * After initialization, either the `sub` or `sup` properties of the `SubSub` are set
   * at all times. If only one is set, the `supsub` property says which one is set.
   * If both are set, the `supsub` property could be either 'sup' or 'sub' (it happens
   * to be whichever state the SupSub was in before the second child block was added).
   */
  supsub: 'sup' | 'sub';

  protected ends: Ends<MathBlock>;

  constructor(supsub: 'sup' | 'sub') {
    const ctrlSeq = '_{...}^{...}';

    let domView;

    // Note this.domView doesn't change if the SupSub is edited to something that has both
    // superscript and subscript. This is correct, since domView is only used for the initial
    // creation of the HTML node, not for any updates.
    if (supsub === 'sub') {
      domView = new DOMView(1, (blocks) =>
        h('span', { class: 'mq-supsub mq-non-leaf' }, [
          h.block('span', { class: 'mq-sub' }, blocks[0]),
          h('span', { style: 'display:inline-block;width:0' }, [
            h.text(U_ZERO_WIDTH_SPACE)
          ])
        ])
      );
    } else {
      domView = new DOMView(1, (blocks) =>
        h('span', { class: 'mq-supsub mq-non-leaf mq-sup-only' }, [
          h.block('span', { class: 'mq-sup' }, blocks[0])
        ])
      );
    }

    super(ctrlSeq, domView);

    // Note the ariaLabel doesn't change if the SupSub is edited between subscript and superscript.
    // That may be a bug, though I don't know where the ariaLabel is actually used; the mathspeak
    // method doesn't reference it.
    this.ariaLabel = supsub === 'sub' ? 'subscript' : 'superscript';
    this.supsub = supsub;
  }

  setEnds(ends: Ends<MathBlock>) {
    pray(
      'SupSub ends must be MathBlocks',
      ends[L] instanceof MathBlock && ends[R] instanceof MathBlock
    );
    this.ends = ends;
  }

  getEnd(dir: Direction): MathBlock {
    return this.ends[dir];
  }

  createLeftOf(cursor: Cursor) {
    if (
      !this.replacedFragment &&
      !cursor[L] &&
      cursor.options.supSubsRequireOperand
    )
      return;
    return super.createLeftOf(cursor);
  }
  contactWeld(cursor: Cursor) {
    // Look on either side for a SupSub, if one is found compare my
    // .sub, .sup with its .sub, .sup. If I have one that it doesn't,
    // then call .addBlock() on it with my block; if I have one that
    // it also has, then insert my block's children into its block,
    // unless my block has none, in which case insert the cursor into
    // its block (and not mine, I'm about to remove myself) in the case
    // I was just typed.
    // TODO: simplify

    // equiv. to [L, R].forEach(function(dir) { ... });
    for (var dir: L | R | false = L; dir; dir = dir === L ? R : false) {
      const thisDir = this[dir];
      let pt;
      if (thisDir instanceof SupSub) {
        // equiv. to 'sub sup'.split(' ').forEach(function(supsub) { ... });
        for (
          var supsub: 'sub' | 'sup' | false = 'sub';
          supsub;
          supsub = supsub === 'sub' ? 'sup' : false
        ) {
          var src = this[supsub],
            dest = thisDir[supsub];
          if (!src) continue;
          if (!dest) thisDir.addBlock(src.disown());
          else if (!src.isEmpty()) {
            // ins src children at -dir end of dest
            src
              .domFrag()
              .children()
              .insAtDirEnd(-dir as Direction, dest.domFrag().oneElement());
            var children = src.children().disown();
            pt = new Point(dest, children.getEnd(R), dest.getEnd(L));
            if (dir === L) children.adopt(dest, dest.getEnd(R), 0);
            else children.adopt(dest, 0, dest.getEnd(L));
          } else {
            pt = new Point(dest, 0, dest.getEnd(L));
          }
          this.placeCursor = (function (dest, src) {
            // TODO: don't monkey-patch
            return function (cursor: Cursor) {
              cursor.insAtDirEnd(-dir as Direction, dest || src);
            };
          })(dest, src);
        }
        this.remove();
        if (cursor && cursor[L] === this) {
          if (dir === R && pt) {
            if (pt[L]) {
              cursor.insRightOf(pt[L] as MQNode);
            } else {
              cursor.insAtLeftEnd(pt.parent);
            }
          } else cursor.insRightOf(thisDir);
        }
        break;
      }
    }
  }
  finalizeTree() {
    if (this.supsub === 'sub') {
      this.downInto = this.sub = this.getEnd(L);
      this.sub.upOutOf = insLeftOfMeUnlessAtEnd;
    } else if (this.supsub === 'sup') {
      this.upInto = this.sup = this.getEnd(R);
      this.sup.downOutOf = insLeftOfMeUnlessAtEnd;
    }
    var endsL = this.getEnd(L);
    endsL.write = function (cursor: Cursor, ch: string) {
      if (
        cursor.options.autoSubscriptNumerals &&
        this === (this.parent as SupSub).sub &&
        '0123456789'.indexOf(ch) >= 0
      ) {
        var cmd = this.chToCmd(ch, cursor.options);
        if (cmd instanceof MQSymbol) cursor.deleteSelection();
        else cursor.clearSelection().insRightOf(this.parent);
        cmd.createLeftOf(cursor.show());
        cursor.controller.aria
          .queue('Baseline')
          .alert(cmd.mathspeak({ createdLeftOf: cursor }));
        return;
      }
      if (
        cursor[L] &&
        !cursor[R] &&
        !cursor.selection &&
        cursor.options.charsThatBreakOutOfSupSub.indexOf(ch) > -1
      ) {
        cursor.insRightOf(this.parent);
        cursor.controller.aria.queue('Baseline');
      }
      MathBlock.prototype.write.call(this, cursor, ch);
    };
  }
  moveTowards(dir: Direction, cursor: Cursor, updown?: 'up' | 'down') {
    if (cursor.options.autoSubscriptNumerals && !this.sup) {
      cursor.insDirOf(dir, this);
    } else super.moveTowards(dir, cursor, updown);
  }
  deleteTowards(dir: Direction, cursor: Cursor) {
    if (cursor.options.autoSubscriptNumerals && this.sub) {
      var cmd = this.sub.getEnd(-dir as Direction);
      if (cmd instanceof MQSymbol) cmd.remove();
      else if (cmd)
        cmd.deleteTowards(dir, cursor.insAtDirEnd(-dir as Direction, this.sub));

      // TODO: factor out a .removeBlock() or something
      if (this.sub.isEmpty()) {
        this.sub.deleteOutOf(L, cursor.insAtLeftEnd(this.sub));
        if (this.sup) cursor.insDirOf(-dir as Direction, this);
        // Note `-dir` because in e.g. x_1^2| want backspacing (leftward)
        // to delete the 1 but to end up rightward of x^2; with non-negated
        // `dir` (try it), the cursor appears to have gone "through" the ^2.
      }
    } else super.deleteTowards(dir, cursor);
  }
  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    if (this.sub) {
      ctx.uncleanedLatex += '_{';
      const beforeLength = ctx.uncleanedLatex.length;
      this.sub.latexRecursive(ctx);
      const afterLength = ctx.uncleanedLatex.length;
      if (beforeLength === afterLength) {
        // nothing was written. so we write a space
        ctx.uncleanedLatex += ' ';
      }

      ctx.uncleanedLatex += '}';
    }

    if (this.sup) {
      ctx.uncleanedLatex += '^{';
      const beforeLength = ctx.uncleanedLatex.length;
      this.sup.latexRecursive(ctx);
      const afterLength = ctx.uncleanedLatex.length;
      if (beforeLength === afterLength) {
        // nothing was written. so we write a space
        ctx.uncleanedLatex += ' ';
      }

      ctx.uncleanedLatex += '}';
    }

    this.checkCursorContextClose(ctx);
  }
  mathspeak(opts?: MathspeakOptions) {
    // Simplify basic exponent speech for common whole numbers.
    if (this.sup !== undefined) {
      // Calculate this item's inner text to determine whether to shorten the returned speech.
      // Do not calculate its inner mathspeak now until we know that the speech is to be truncated.
      // Since the mathspeak computation is recursive, we want to call it only once in this function to avoid performance bottlenecks.
      var innerText = getCtrlSeqsFromBlock(this.sup);
      // If the superscript is a whole number, shorten the speech that is returned.
      if ((!opts || !opts.ignoreShorthand) && intRgx.test(innerText)) {
        let prefix = '';
        if (this.sub) {
          prefix =
            subMathspeakTemplate[0] +
            ' ' +
            this.sub.mathspeak() +
            ' ' +
            subMathspeakTemplate[1] +
            ' ';
        }
        return prefix + wholeNumberPower(this.sup, innerText);
      }
    }
    this.mathspeakTemplate = this.getMathspeakTemplate();
    return super.mathspeak();
  }
  private getMathspeakTemplate() {
    if (this.sub && this.sup) {
      return supSubMathspeakTemplate;
    } else if (this.sup) {
      return supMathspeakTemplate;
    } else {
      return subMathspeakTemplate;
    }
  }
  text() {
    function text(prefix: string, block: NodeRef | undefined) {
      var l = (block && block.text()) || '';
      return block
        ? prefix + (l.length === 1 ? l : '(' + (l || ' ') + ')')
        : '';
    }
    return text('_', this.sub) + text('^', this.sup);
  }
  // This function is called, for example, when parsing `x_1^2`.
  // In that case, first a `SupSub("sup")` is created (i.e. a superscript) representing `x^2`,
  // (with the superscript `2` being added in `finalizeTree`), then the subscript `1` is added
  // with `addBlock`.
  addBlock(block: MathBlock) {
    if (this.supsub === 'sub') {
      this.sup = this.upInto = (this.sub as MQNode).upOutOf = block;
      block.adopt(this, this.sub as MQNode, 0).downOutOf = this.sub;
      block.setDOM(
        domFrag(h('span', { class: 'mq-sup' }))
          .append(block.domFrag().children())
          .prependTo(this.domFrag().oneElement())
          .oneElement()
      );
      NodeBase.linkElementByBlockNode(block.domFrag().oneElement(), block);
    } else {
      this.sub = this.downInto = (this.sup as MQNode).downOutOf = block;
      block.adopt(this, 0, this.sup as MQNode).upOutOf = this.sup;
      this.domFrag().removeClass('mq-sup-only');
      block.setDOM(
        domFrag(h('span', { class: 'mq-sub' }))
          .append(block.domFrag().children())
          .appendTo(this.domFrag().oneElement())
          .oneElement()
      );
      NodeBase.linkElementByBlockNode(block.domFrag().oneElement(), block);
      this.domFrag().append(
        domFrag(
          h('span', { style: 'display:inline-block;width:0' }, [
            h.text(U_ZERO_WIDTH_SPACE)
          ])
        )
      );
    }

    for (let i = 0; i < 2; i += 1) {
      const cmd: SupSub = this;
      const supsub = (['sub', 'sup'] as const)[i];
      const oppositeSupsub = (['sup', 'sub'] as const)[i];
      const updown = (['down', 'up'] as const)[i];
      const cmdSubSub = cmd[supsub]!;

      cmdSubSub.deleteOutOf = function (dir: Direction, cursor: Cursor) {
        cursor.insDirOf(this[dir] ? (-dir as Direction) : dir, this.parent);
        if (!this.isEmpty()) {
          const end = this.getEnd(dir);
          this.children()
            .disown()
            .withDirAdopt(
              dir,
              cursor.parent,
              cursor[dir],
              cursor[-dir as Direction]
            )
            .domFrag()
            .insDirOf(-dir as Direction, cursor.domFrag());
          cursor[-dir as Direction] = end;
        }
        cmd.supsub = oppositeSupsub;
        delete cmd[supsub];
        delete cmd[`${updown}Into`];
        const cmdOppositeSupsub = cmd[oppositeSupsub]!;
        cmdOppositeSupsub[`${updown}OutOf`] = insLeftOfMeUnlessAtEnd;
        delete (cmdOppositeSupsub as any).deleteOutOf; // TODO - refactor so this method can be optional
        if (supsub === 'sub') {
          cmd.domFrag().addClass('mq-sup-only').children().last().remove();
        }
        this.remove();
      };
    }
  }
}

function insLeftOfMeUnlessAtEnd(this: MQNode, cursor: Cursor) {
  // cursor.insLeftOf(cmd), unless cursor at the end of block, and every
  // ancestor cmd is at the end of every ancestor block
  var cmd = this.parent;
  var ancestorCmd: MQNode | Anticursor | Cursor = cursor;
  do {
    if (ancestorCmd[R]) return cursor.insLeftOf(cmd);
    ancestorCmd = ancestorCmd.parent.parent;
  } while (ancestorCmd !== cmd);
  cursor.insRightOf(cmd);
  return undefined;
}

const subMathspeakTemplate = ['Subscript,', ', Baseline'];
const supMathspeakTemplate = ['Superscript,', ', Baseline'];
const supSubMathspeakTemplate = [
  'Subscript,',
  ', Baseline Superscript,',
  ', Baseline'
];

/** Assumes innerText satisfies the `intRgx` */
function wholeNumberPower(sup: MQNode, innerText: string) {
  // Simple cases
  if (innerText === '0') {
    return 'to the 0 power';
  } else if (innerText === '2') {
    return 'squared';
  } else if (innerText === '3') {
    return 'cubed';
  }

  // More complex cases.
  var suffix = '';
  // Limit suffix addition to exponents < 1000.
  if (/^[+-]?\d{1,3}$/.test(innerText)) {
    if (/(11|12|13|4|5|6|7|8|9|0)$/.test(innerText)) {
      suffix = 'th';
    } else if (/1$/.test(innerText)) {
      suffix = 'st';
    } else if (/2$/.test(innerText)) {
      suffix = 'nd';
    } else if (/3$/.test(innerText)) {
      suffix = 'rd';
    }
  }
  var innerMathspeak = typeof sup === 'object' ? sup.mathspeak() : innerText;
  return 'to the ' + innerMathspeak + suffix + ' power';
}

LatexCmds.subscript = LatexCmds._ = () => new SupSub('sub');

LatexCmds.superscript =
  LatexCmds.supscript =
  LatexCmds['^'] =
    () => new SupSub('sup');

class SummationNotation extends MathCommand {
  constructor(ch: string, symbol: string, ariaLabel?: string) {
    super();

    this.ariaLabel = ariaLabel || ch.replace(/^\\/, '');
    var domView = new DOMView(2, (blocks) =>
      h('span', { class: 'mq-large-operator mq-non-leaf' }, [
        h('span', { class: 'mq-to' }, [h.block('span', {}, blocks[1])]),
        h('big', {}, [h.text(symbol)]),
        h('span', { class: 'mq-from' }, [h.block('span', {}, blocks[0])])
      ])
    );

    MQSymbol.prototype.setCtrlSeqHtmlTextAndMathspeak.call(this, ch, domView);
  }
  createLeftOf(cursor: Cursor) {
    super.createLeftOf(cursor);
    if (cursor.options.sumStartsWithNEquals) {
      new Letter('n').createLeftOf(cursor);
      new Equality().createLeftOf(cursor);
    }
  }
  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    ctx.uncleanedLatex += this.ctrlSeq + '_{';
    let beforeLength = ctx.uncleanedLatex.length;
    this.getEnd(L).latexRecursive(ctx);
    let afterLength = ctx.uncleanedLatex.length;
    if (afterLength === beforeLength) {
      // nothing was written so we write a space
      ctx.uncleanedLatex += ' ';
    }

    ctx.uncleanedLatex += '}^{';
    beforeLength = ctx.uncleanedLatex.length;
    this.getEnd(R).latexRecursive(ctx);
    afterLength = ctx.uncleanedLatex.length;
    if (beforeLength === afterLength) {
      // nothing was written so we write a space
      ctx.uncleanedLatex += ' ';
    }

    ctx.uncleanedLatex += '}';
    this.checkCursorContextClose(ctx);
  }
  mathspeak() {
    return (
      'Start ' +
      this.ariaLabel +
      ' from ' +
      this.getEnd(L).mathspeak() +
      ' to ' +
      this.getEnd(R).mathspeak() +
      ', end ' +
      this.ariaLabel +
      ', '
    );
  }
  parser() {
    var string = Parser.string;
    var optWhitespace = Parser.optWhitespace;
    var succeed = Parser.succeed;
    var block = latexMathParser.block;

    var self = this;
    var blocks = (self.blocks = [new MathBlock(), new MathBlock()]);
    for (var i = 0; i < blocks.length; i += 1) {
      blocks[i].adopt(self, self.getEnd(R), 0);
    }

    return optWhitespace
      .then(string('_').or(string('^')))
      .then(function (supOrSub) {
        var child = blocks[supOrSub === '_' ? 0 : 1];
        return block.then(function (block) {
          block.children().adopt(child, child.getEnd(R), 0);
          return succeed(self);
        });
      })
      .many()
      .result(self);
  }
  finalizeTree() {
    var endsL = this.getEnd(L);
    var endsR = this.getEnd(R);

    endsL.ariaLabel = 'lower bound';
    endsR.ariaLabel = 'upper bound';
    this.downInto = endsL;
    this.upInto = endsR;
    endsL.upOutOf = endsR;
    endsR.downOutOf = endsL;
  }
}

LatexCmds['∑'] =
  LatexCmds.sum =
  LatexCmds.summation =
    () => new SummationNotation('\\sum ', U_NARY_SUMMATION, 'sum');

LatexCmds['∏'] =
  LatexCmds.prod =
  LatexCmds.product =
    () => new SummationNotation('\\prod ', U_NARY_PRODUCT, 'product');

LatexCmds.coprod = LatexCmds.coproduct = () =>
  new SummationNotation('\\coprod ', U_NARY_COPRODUCT, 'co product');

LatexCmds['∫'] =
  LatexCmds['int'] =
  LatexCmds.integral =
    class extends SummationNotation {
      constructor() {
        super('\\int ', '', 'integral');

        this.ariaLabel = 'integral';
        this.domView = new DOMView(2, (blocks) =>
          h('span', { class: 'mq-int mq-non-leaf' }, [
            h('big', {}, [h.text(U_INTEGRAL)]),
            h('span', { class: 'mq-supsub mq-non-leaf' }, [
              h('span', { class: 'mq-sup' }, [
                h.block('span', { class: 'mq-sup-inner' }, blocks[1])
              ]),
              h.block('span', { class: 'mq-sub' }, blocks[0]),
              h('span', { style: 'display:inline-block;width:0' }, [
                h.text(U_ZERO_WIDTH_SPACE)
              ])
            ])
          ])
        );
      }

      createLeftOf(cursor: Cursor) {
        // FIXME: refactor rather than overriding
        MathCommand.prototype.createLeftOf.call(this, cursor);
      }
    };

LatexCmds['∬'] =
  LatexCmds.iint =
    class extends SummationNotation {
      constructor() {
        super('\\iint ', '', 'double integral');

        this.ariaLabel = 'double integral';
        this.domView = new DOMView(2, (blocks) =>
          h('span', { class: 'mq-int mq-non-leaf' }, [
            h('big', {}, [h.text(U_DOUBLE_INTEGRAL)]),
            h('span', { class: 'mq-supsub mq-non-leaf' }, [
              h('span', { class: 'mq-sup' }, [
                h.block('span', { class: 'mq-sup-inner' }, blocks[1])
              ]),
              h.block('span', { class: 'mq-sub' }, blocks[0]),
              h('span', { style: 'display:inline-block;width:0' }, [
                h.text(U_ZERO_WIDTH_SPACE)
              ])
            ])
          ])
        );
      }

      createLeftOf(cursor: Cursor) {
        MathCommand.prototype.createLeftOf.call(this, cursor);
      }
    };

LatexCmds['∭'] =
  LatexCmds.iiint =
    class extends SummationNotation {
      constructor() {
        super('\\iiint ', '', 'triple integral');

        this.ariaLabel = 'triple integral';
        this.domView = new DOMView(2, (blocks) =>
          h('span', { class: 'mq-int mq-non-leaf' }, [
            h('big', {}, [h.text(U_TRIPLE_INTEGRAL)]),
            h('span', { class: 'mq-supsub mq-non-leaf' }, [
              h('span', { class: 'mq-sup' }, [
                h.block('span', { class: 'mq-sup-inner' }, blocks[1])
              ]),
              h.block('span', { class: 'mq-sub' }, blocks[0]),
              h('span', { style: 'display:inline-block;width:0' }, [
                h.text(U_ZERO_WIDTH_SPACE)
              ])
            ])
          ])
        );
      }

      createLeftOf(cursor: Cursor) {
        MathCommand.prototype.createLeftOf.call(this, cursor);
      }
    };

LatexCmds['∮'] =
  LatexCmds.oint =
  LatexCmds.contourintegral =
    class extends SummationNotation {
      constructor() {
        super('\\oint ', '', 'contour integral');

        this.ariaLabel = 'contour integral';
        this.domView = new DOMView(2, (blocks) =>
          h('span', { class: 'mq-int mq-non-leaf' }, [
            h('big', {}, [h.text(U_CONTOUR_INTEGRAL)]),
            h('span', { class: 'mq-supsub mq-non-leaf' }, [
              h('span', { class: 'mq-sup' }, [
                h.block('span', { class: 'mq-sup-inner' }, blocks[1])
              ]),
              h.block('span', { class: 'mq-sub' }, blocks[0]),
              h('span', { style: 'display:inline-block;width:0' }, [
                h.text(U_ZERO_WIDTH_SPACE)
              ])
            ])
          ])
        );
      }

      createLeftOf(cursor: Cursor) {
        MathCommand.prototype.createLeftOf.call(this, cursor);
      }
    };

// Finnish integral substitution sign
// Used in Finnish mathematics education for showing substitution bounds
LatexCmds.bigg = // HACK: \bigg is used as the LaTeX output format
  LatexCmds.intsub =
  LatexCmds.integralsubstitution =
    class extends SummationNotation {
      constructor() {
        super('\\bigg', '', 'integral substitution');

        this.ariaLabel = 'integral substitution';
        this.domView = new DOMView(2, (blocks) =>
          h('span', { class: 'mq-intsub mq-non-leaf' }, [
            h('big', {}, [h.text('/')]),
            h('span', { class: 'mq-supsub mq-non-leaf' }, [
              h('span', { class: 'mq-sup' }, [
                h.block('span', { class: 'mq-sup-inner' }, blocks[1])
              ]),
              h.block('span', { class: 'mq-sub' }, blocks[0]),
              h('span', { style: 'display:inline-block;width:0' }, [
                h.text(U_ZERO_WIDTH_SPACE)
              ])
            ])
          ])
        );
      }

      createLeftOf(cursor: Cursor) {
        // FIXME: refactor rather than overriding
        MathCommand.prototype.createLeftOf.call(this, cursor);
      }

      parser() {
        const self = this;
        const string = Parser.string;
        const optWhitespace = Parser.optWhitespace;
        const succeed = Parser.succeed;

        // Create the two blocks for sub and sup
        self.blocks = [new MathBlock(), new MathBlock()];
        for (let i = 0; i < self.blocks.length; i += 1) {
          self.blocks[i].adopt(self, self.getEnd(R), 0);
        }

        // Parse \bigg/_{...}^{...} format
        // Allow any number of \! for negative space (used for visual adjustment)
        return string('/_{')
          .then(string('\\!').many())
          .then(latexMathParser)
          .then(function (block: MathBlock) {
            block.children().adopt(self.blocks[0], self.blocks[0].getEnd(R), 0);
            return succeed(self);
          })
          .then(optWhitespace)
          .then(string('}'))
          .then(optWhitespace)
          .then(string('^'))
          .then(latexMathParser.block)
          .then(function (block: MathBlock) {
            block.children().adopt(self.blocks[1], self.blocks[1].getEnd(R), 0);
            return succeed(self);
          });
      }

      latexRecursive(ctx: LatexContext) {
        this.checkCursorContextOpen(ctx);

        const simplify = (latex: string) =>
          latex.length === 1 ? latex : '{' + (latex || ' ') + '}';

        // Get LaTeX for both blocks
        const subCtx: LatexContext = { latex: '', uncleanedLatex: '' };
        this.getEnd(L).latexRecursive(subCtx);
        const subLatex = subCtx.latex || subCtx.uncleanedLatex;

        const supCtx: LatexContext = { latex: '', uncleanedLatex: '' };
        this.getEnd(R).latexRecursive(supCtx);
        const supLatex = supCtx.latex || supCtx.uncleanedLatex;

        ctx.uncleanedLatex +=
          '\\bigg/_{\\!\\!\\!\\!\\!' +
          simplify(subLatex) +
          '}^' +
          simplify(supLatex);

        this.checkCursorContextClose(ctx);
      }
    };

var Fraction =
  (LatexCmds.frac =
  LatexCmds.dfrac =
  LatexCmds.cfrac =
  LatexCmds.fraction =
    class FracNode extends MathCommand {
      ctrlSeq = '\\frac';
      domView = new DOMView(2, (blocks) =>
        h('span', { class: 'mq-fraction mq-non-leaf' }, [
          h.block('span', { class: 'mq-numerator' }, blocks[0]),
          h.block('span', { class: 'mq-denominator' }, blocks[1]),
          h('span', { style: 'display:inline-block;width:0' }, [
            h.text(U_ZERO_WIDTH_SPACE)
          ])
        ])
      );
      textTemplate = ['(', ')/(', ')'];
      finalizeTree() {
        const endsL = this.getEnd(L);
        const endsR = this.getEnd(R);
        this.upInto = endsR.upOutOf = endsL;
        this.downInto = endsL.downOutOf = endsR;
        endsL.ariaLabel = 'numerator';
        endsR.ariaLabel = 'denominator';
        if (this.getFracDepth() > 1) {
          this.mathspeakTemplate = [
            'StartNestedFraction,',
            'NestedOver',
            ', EndNestedFraction'
          ];
        } else {
          this.mathspeakTemplate = ['StartFraction,', 'Over', ', EndFraction'];
        }
      }

      mathspeak(opts?: MathspeakOptions) {
        if (opts && opts.createdLeftOf) {
          var cursor = opts.createdLeftOf;
          return cursor.parent.mathspeak();
        }

        var numText = getCtrlSeqsFromBlock(this.getEnd(L));
        var denText = getCtrlSeqsFromBlock(this.getEnd(R));

        // Shorten mathspeak value for whole number fractions whose denominator has a special spoken form.
        if (
          (!opts || !opts.ignoreShorthand) &&
          intRgx.test(numText) &&
          intRgx.test(denText)
        ) {
          var isSingular = numText === '1' || numText === '-1';
          var newDenSpeech = '';
          if (denText === '2') {
            newDenSpeech = isSingular ? 'half' : 'halves';
          } else if (denText === '3') {
            newDenSpeech = isSingular ? 'third' : 'thirds';
          } else if (denText === '4') {
            newDenSpeech = isSingular ? 'fourth' : 'fourths';
          } else if (denText === '5') {
            newDenSpeech = isSingular ? 'fifth' : 'fifths';
          } else if (denText === '6') {
            newDenSpeech = isSingular ? 'sixth' : 'sixths';
          } else if (denText === '7') {
            newDenSpeech = isSingular ? 'seventh' : 'sevenths';
          } else if (denText === '8') {
            newDenSpeech = isSingular ? 'eighth' : 'eighths';
          } else if (denText === '9') {
            newDenSpeech = isSingular ? 'ninth' : 'ninths';
          } else if (denText === '10') {
            newDenSpeech = isSingular ? 'tenth' : 'tenths';
          } else if (denText === '11') {
            newDenSpeech = isSingular ? 'eleventh' : 'elevenths';
          } else if (denText === '12') {
            newDenSpeech = isSingular ? 'twelfth' : 'twelfths';
          } else if (denText === '100') {
            newDenSpeech = isSingular ? 'hundredth' : 'hundredths';
          }
          if (newDenSpeech !== '') {
            var output = '';
            // Handle the case of an integer followed by a simplified fraction such as 1\frac{1}{2}.
            // Such combinations should be spoken aloud as "1 and 1 half."
            // Start at the left sibling of the fraction and continue leftward until something other than a digit or whitespace is found.
            var precededByInteger = false;
            for (
              var sibling: NodeRef | undefined = this[L];
              sibling && sibling[L] !== undefined;
              sibling = sibling[L]
            ) {
              // Ignore whitespace
              if (sibling.ctrlSeq === '\\ ') {
                continue;
              } else if (intRgx.test(sibling.ctrlSeq || '')) {
                precededByInteger = true;
              } else {
                precededByInteger = false;
                break;
              }
            }
            if (precededByInteger) {
              output += 'and ';
            }
            output += this.getEnd(L).mathspeak() + ' ' + newDenSpeech;
            return output;
          }
        }

        return super.mathspeak();
      }

      getFracDepth() {
        var level = 0;
        var walkUp = function (item: NodeRef, level: number): number {
          if (
            item instanceof MQNode &&
            item.ctrlSeq &&
            item.ctrlSeq.toLowerCase().search('frac') >= 0
          )
            level += 1;
          if (item && item.parent) return walkUp(item.parent, level);
          else return level;
        };
        return walkUp(this, level);
      }
    });

var LiveFraction =
  (LatexCmds.over =
  CharCmds['/'] =
    class extends Fraction {
      createLeftOf(cursor: Cursor) {
        if (!this.replacedFragment) {
          var leftward = cursor[L];

          const dontScan =
            cursor.options.typingSlashCreatesNewFraction &&
            this instanceof Fraction;

          if (!dontScan) {
            // The user is typing "/" or "over" or "choose". Scan left to get content inside it.
            while (
              leftward &&
              !(
                nodeEndsBinaryOperator(leftward) ||
                (leftward instanceof DigitGroupingChar &&
                  leftward._groupingClass === 'mq-ellipsis-end') ||
                leftward instanceof (LatexCmds.text || noop) ||
                leftward instanceof SummationNotation ||
                leftward.ctrlSeq === '\\ ' ||
                /^[,;:]$/.test(leftward.ctrlSeq as string)
              ) //lookbehind for operator
            )
              leftward = leftward[L];
          }
          if (
            leftward instanceof SummationNotation &&
            leftward[R] instanceof SupSub
          ) {
            // The previous step scanned too far. `\sum_1^5` looks like [SummationNotation,SupSub],
            // so scan back right
            leftward = leftward[R] as MQNode;
            let leftwardR = leftward[R];
            if (
              leftwardR instanceof SupSub &&
              leftwardR.ctrlSeq != leftward.ctrlSeq
            )
              leftward = leftward[R];
          }

          // `leftward` is the first node (from-right-to-left) that is broken on, so
          // `leftwardR` is the last node (from right-to-left) that should be included in the
          // top of the Fraction or Binomial.
          if (leftward !== cursor[L] && !cursor.isTooDeep(1)) {
            let leftwardR = (leftward as MQNode)[R] as MQNode;
            let cursorL = cursor[L] as MQNode;

            this.replaces(
              new Fragment(leftwardR || cursor.parent.getEnd(L), cursorL)
            );
            cursor[L] = leftward;
          }
        }
        super.createLeftOf(cursor);
      }
    });

const AnsBuilder = () =>
  new MQSymbol(
    '\\operatorname{ans}',
    h('span', { class: 'mq-ans' }, [h.text('ans')]),
    'ans'
  );
LatexCmds.ans = AnsBuilder;

const PercentOfBuilder = () =>
  new MQSymbol(
    '\\%\\operatorname{of}',
    h('span', { class: 'mq-nonSymbola mq-operator-name' }, [h.text('% of ')]),
    'percent of'
  );
LatexCmds.percent = LatexCmds.percentof = PercentOfBuilder;

/** A Token represents a region in typeset math that is designed to be
 * externally styled and which delegates mousedown events to external
 * handlers.
 *
 * LaTeX syntax: `\token{id}`.
 *
 * Token is designed for similar use cases as EmbedNode. Differences:
 *     * Mousedown events on a Token are not handled by MathQuill (they
 *       are expected to be handled externally).
 *     * The API for Tokens is simpler: they don't require registering
 *       handlers with MathQuill.
 *     * The current syntax for embed (`\embed{name}[id]`) gets the order
 *       of optional and required arguments backwards compared to normal
 *       LaTeX syntax. The syntax of Token is simpler and more in line
 *       with LaTeX
 */
class Token extends MQSymbol {
  tokenId = '';
  ctrlSeq = '\\token';
  textTemplate = ['token(', ')'];
  mathspeakTemplate = ['StartToken,', ', EndToken'];
  ariaLabel = 'token';

  html(): Element | DocumentFragment {
    const out = h('span', {
      class: 'mq-token mq-ignore-mousedown',
      'data-mq-token': this.tokenId
    });
    this.setDOM(out);
    NodeBase.linkElementByCmdNode(out, this);
    return out;
  }

  latexRecursive(ctx: LatexContext): void {
    this.checkCursorContextOpen(ctx);

    ctx.uncleanedLatex += '\\token{' + this.tokenId + '}';

    this.checkCursorContextClose(ctx);
  }

  mathspeak() {
    // If the caller responsible for creating this token has set an aria-label attribute for the inner children, use them in the mathspeak calculation.
    let ariaLabelArray: string[] = [];

    this.domFrag()
      .children()
      .eachElement((el) => {
        const label = el.getAttribute('aria-label');
        if (typeof label === 'string' && label !== '')
          ariaLabelArray.push(label);
      });
    return ariaLabelArray.length > 0
      ? ariaLabelArray.join(' ').trim()
      : 'token ' + this.tokenId;
  }

  parser() {
    var self = this;
    return latexMathParser.block.map(function (block) {
      var digit = block.getEnd(L);
      if (digit) {
        self.tokenId += (digit as Digit).ctrlSeq;
        while ((digit = digit[R])) {
          self.tokenId += (digit as Digit).ctrlSeq;
        }
      }

      return self;
    });
  }
}
LatexCmds.token = Token;

class SquareRoot extends MathCommand {
  ctrlSeq = '\\sqrt';
  domView = new DOMView(1, (blocks) =>
    h('span', { class: 'mq-non-leaf mq-sqrt-container' }, [
      h('span', { class: 'mq-scaled mq-sqrt-prefix' }, [
        SVG_SYMBOLS.sqrt.html()
      ]),
      h.block('span', { class: 'mq-non-leaf mq-sqrt-stem' }, blocks[0])
    ])
  );
  textTemplate = ['sqrt(', ')'];
  mathspeakTemplate = ['StartRoot,', ', EndRoot'];
  ariaLabel = 'root';
  parser() {
    return latexMathParser.optBlock
      .then(function (optBlock) {
        return latexMathParser.block.map(function (block) {
          var nthroot = new NthRoot();
          nthroot.blocks = [optBlock, block];
          optBlock.adopt(nthroot, 0, 0);
          block.adopt(nthroot, optBlock, 0);
          return nthroot;
        });
      })
      .or(super.parser());
  }
  deleteTowards(dir: Direction, cursor: Cursor) {
    if (!this.isEmpty() && dir === 1) {
      this.moveTowards(R, cursor);
      cursor.parent.deleteOutOf(L, cursor);
      return;
    }
    // Empty sqrt: delete the sqrt.
    // Delete-left ("Backspace") moves into non-empty sqrts.
    super.deleteTowards(dir, cursor);
  }
}
LatexCmds.sqrt = CharCmds['√'] = SquareRoot;

LatexCmds.hat = class Hat extends MathCommand {
  ctrlSeq = '\\hat';
  domView = new DOMView(1, (blocks) =>
    h('span', { class: 'mq-non-leaf' }, [
      h('span', { class: 'mq-hat-prefix' }, [h.text('^')]),
      h.block('span', { class: 'mq-hat-stem' }, blocks[0])
    ])
  );

  textTemplate = ['hat(', ')'];
};

class NthRoot extends SquareRoot {
  domView = new DOMView(2, (blocks) =>
    h('span', { class: 'mq-nthroot-container mq-non-leaf' }, [
      h.block('sup', { class: 'mq-nthroot mq-non-leaf' }, blocks[0]),
      h('span', { class: 'mq-scaled mq-sqrt-container' }, [
        h('span', { class: 'mq-sqrt-prefix mq-scaled' }, [
          SVG_SYMBOLS.sqrt.html()
        ]),
        h.block('span', { class: 'mq-sqrt-stem mq-non-leaf' }, blocks[1])
      ])
    ])
  );

  textTemplate = ['sqrt[', '](', ')'];
  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    ctx.uncleanedLatex += '\\sqrt[';
    this.getEnd(L).latexRecursive(ctx);
    ctx.uncleanedLatex += ']{';
    this.getEnd(R).latexRecursive(ctx);
    ctx.uncleanedLatex += '}';

    this.checkCursorContextClose(ctx);
  }
  mathspeak() {
    var indexMathspeak = this.getEnd(L).mathspeak();
    var radicandMathspeak = this.getEnd(R).mathspeak();
    this.getEnd(L).ariaLabel = 'Index';
    this.getEnd(R).ariaLabel = 'Radicand';
    if (indexMathspeak === '3') {
      // cube root
      return 'Start Cube Root, ' + radicandMathspeak + ', End Cube Root';
    } else {
      return (
        'Root Index ' +
        indexMathspeak +
        ', Start Root, ' +
        radicandMathspeak +
        ', End Root'
      );
    }
  }
  deleteTowards(dir: Direction, cursor: Cursor) {
    MathCommand.prototype.deleteTowards.call(this, dir, cursor);
  }
}
LatexCmds.nthroot = NthRoot;

LatexCmds.cbrt = class extends NthRoot {
  createLeftOf(cursor: Cursor) {
    super.createLeftOf(cursor);
    new Digit('3').createLeftOf(cursor);
    cursor.controller.moveRight();
  }
};

class DiacriticAbove extends MathCommand {
  constructor(ctrlSeq: string, html: ChildNode, textTemplate?: string[]) {
    var domView = new DOMView(1, (blocks) =>
      h('span', { class: 'mq-non-leaf' }, [
        h('span', { class: 'mq-diacritic-above' }, [html]),
        h.block('span', { class: 'mq-diacritic-stem' }, blocks[0])
      ])
    );
    super(ctrlSeq, domView, textTemplate);
  }
}
LatexCmds.vec = () =>
  new DiacriticAbove('\\vec', h.entityText('&rarr;'), ['vec(', ')']);
LatexCmds.tilde = () =>
  new DiacriticAbove('\\tilde', h.text('~'), ['tilde(', ')']);

class DelimsNode extends MathCommand {
  delimFrags: Ends<DOMFragment>;

  setDOM(el: Element | undefined) {
    super.setDOM(el);
    const children = this.domFrag().children();
    if (!children.isEmpty()) {
      this.delimFrags = {
        [L]: children.first(),
        [R]: children.last()
      };
    }
    return this;
  }
}

// Round/Square/Curly/Angle Brackets (aka Parens/Brackets/Braces)
//   first typed as one-sided bracket with matching "ghost" bracket at
//   far end of current block, until you type an opposing one
class Bracket extends DelimsNode {
  side: BracketSide;
  sides: {
    [L]: { ch: string; ctrlSeq: string };
    [R]: { ch: string; ctrlSeq: string };
  };
  constructor(
    side: BracketSide,
    open: string,
    close: string,
    ctrlSeq: string,
    end: string
  ) {
    super('\\left' + ctrlSeq, undefined, [open, close]);
    this.side = side;
    this.sides = {
      [L]: { ch: open, ctrlSeq: ctrlSeq },
      [R]: { ch: close, ctrlSeq: end }
    };
  }
  numBlocks() {
    return 1 as const;
  }
  html() {
    var leftSymbol = this.getSymbol(L);
    var rightSymbol = this.getSymbol(R);

    // wait until now so that .side may
    this.domView = new DOMView(1, (blocks) =>
      h(
        // be set by createLeftOf or parser
        'span',
        { class: 'mq-non-leaf mq-bracket-container' },
        [
          h(
            'span',
            {
              style: 'width:' + leftSymbol.width,
              class:
                'mq-scaled mq-bracket-l mq-paren' +
                (this.side === R ? ' mq-ghost' : '')
            },
            [leftSymbol.html()]
          ),
          h.block(
            'span',
            {
              style:
                'margin-left:' +
                leftSymbol.width +
                ';margin-right:' +
                rightSymbol.width,
              class: 'mq-bracket-middle mq-non-leaf'
            },
            blocks[0]
          ),
          h(
            'span',
            {
              style: 'width:' + rightSymbol.width,
              class:
                'mq-scaled mq-bracket-r mq-paren' +
                (this.side === L ? ' mq-ghost' : '')
            },
            [rightSymbol.html()]
          )
        ]
      )
    );
    return super.html();
  }
  getSymbol(side: BracketSide) {
    var ch = this.sides[side || R].ch as keyof typeof SVG_SYMBOLS;
    return SVG_SYMBOLS[ch] || { width: '0', html: '' };
  }
  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    ctx.uncleanedLatex += '\\left' + this.sides[L].ctrlSeq;
    this.getEnd(L).latexRecursive(ctx);
    ctx.uncleanedLatex += '\\right' + this.sides[R].ctrlSeq;

    this.checkCursorContextClose(ctx);
  }
  mathspeak(opts?: MathspeakOptions) {
    var open = this.sides[L].ch,
      close = this.sides[R].ch;
    if (open === '|' && close === '|') {
      this.mathspeakTemplate = ['StartAbsoluteValue,', ', EndAbsoluteValue'];
      this.ariaLabel = 'absolute value';
    } else if (opts && opts.createdLeftOf && this.side) {
      var ch = '';
      if (this.side === L) ch = this.textTemplate[0];
      else if (this.side === R) ch = this.textTemplate[1];
      return (
        (this.side === L ? 'left ' : 'right ') +
        BRACKET_NAMES[ch as keyof typeof BRACKET_NAMES]
      );
    } else {
      this.mathspeakTemplate = [
        'left ' + BRACKET_NAMES[open as keyof typeof BRACKET_NAMES] + ',',
        ', right ' + BRACKET_NAMES[close as keyof typeof BRACKET_NAMES]
      ];
      this.ariaLabel =
        BRACKET_NAMES[open as keyof typeof BRACKET_NAMES] + ' block';
    }
    return super.mathspeak();
  }
  matchBrack(
    opts: CursorOptions,
    expectedSide: BracketSide,
    node: NodeRef | undefined
  ) {
    // return node iff it's a matching 1-sided bracket of expected side (if any)
    return (
      node instanceof Bracket &&
      node.side &&
      node.side !== -expectedSide &&
      (!opts.restrictMismatchedBrackets ||
        OPP_BRACKS[
          this.sides[this.side as Direction].ch as keyof typeof BRACKET_NAMES
        ] === node.sides[node.side].ch ||
        // if restrictMismatchedBrackets is "none" instead of true, don't allow mismatched range brackets
        (opts.restrictMismatchedBrackets !== 'none' &&
          { '(': ']', '[': ')' }[this.sides[L].ch] === node.sides[R].ch)) &&
      node
    );
  }
  closeOpposing(brack: Bracket) {
    brack.side = 0;
    brack.sides[this.side as Direction] = this.sides[this.side as Direction]; // copy over my info (may be
    const brackFrag = brack.delimFrags[this.side === L ? L : R] // mismatched, like [a, b))
      .removeClass('mq-ghost');
    this.replaceBracket(brackFrag, this.side);
  }
  createLeftOf(cursor: Cursor) {
    var brack;
    if (!this.replacedFragment) {
      // unless wrapping seln in brackets,
      // check if next to or inside an opposing one-sided bracket
      var opts = cursor.options;
      if (this.sides[L].ch === '|') {
        // check both sides if I'm a pipe
        brack =
          this.matchBrack(opts, R, cursor[R]) ||
          this.matchBrack(opts, L, cursor[L]) ||
          this.matchBrack(opts, 0, cursor.parent.parent);
      } else {
        brack =
          this.matchBrack(
            opts,
            -this.side as BracketSide,
            cursor[-this.side as Direction]
          ) ||
          this.matchBrack(
            opts,
            -this.side as BracketSide,
            cursor.parent.parent
          );
      }
    }
    if (brack) {
      var side = (this.side = -brack.side as BracketSide); // may be pipe with .side not yet set
      this.closeOpposing(brack);
      if (brack === cursor.parent.parent && cursor[side as Direction]) {
        // move the stuff between
        new Fragment(
          cursor[side as Direction],
          cursor.parent.getEnd(side as Direction),
          -side as Direction
        ) // me and ghost outside
          .disown()
          .withDirAdopt(
            -side as Direction,
            brack.parent,
            brack,
            brack[side as Direction]
          )
          .domFrag()
          .insDirOf(side as Direction, brack.domFrag());
      }
      brack.bubble(function (node) {
        node.reflow();
        return undefined;
      });
    } else {
      (brack = this), (side = brack.side);
      if (brack.replacedFragment) brack.side = 0;
      // wrapping seln, don't be one-sided
      else if (cursor[-side as Direction]) {
        // elsewise, auto-expand so ghost is at far end
        brack.replaces(
          new Fragment(
            cursor[-side as Direction],
            cursor.parent.getEnd(-side as Direction),
            side as Direction
          )
        );
        cursor[-side as Direction] = 0;
      }
      super.createLeftOf(cursor);
    }
    if (side === L) cursor.insAtLeftEnd(brack.getEnd(L));
    else cursor.insRightOf(brack);
  }
  placeCursor() {}
  unwrap() {
    this.getEnd(L)
      .children()
      .disown()
      .adopt(this.parent, this, this[R])
      .domFrag()
      .insertAfter(this.domFrag());
    this.remove();
  }
  deleteSide(side: Direction, outward: boolean, cursor: Cursor) {
    var parent = this.parent,
      sib = this[side],
      farEnd = parent.getEnd(side);

    if (side === this.side) {
      // deleting non-ghost of one-sided bracket, unwrap
      this.unwrap();
      sib
        ? cursor.insDirOf(-side as Direction, sib)
        : cursor.insAtDirEnd(side, parent);
      return;
    }

    var opts = cursor.options,
      wasSolid = !this.side;
    this.side = -side as Direction;
    // if deleting like, outer close-brace of [(1+2)+3} where inner open-paren
    if (this.matchBrack(opts, side, this.getEnd(L).getEnd(this.side))) {
      // is ghost,
      this.closeOpposing(
        this.getEnd(L).getEnd(this.side as Direction) as Bracket
      ); // then become [1+2)+3
      var origEnd = this.getEnd(L).getEnd(side);
      this.unwrap();
      if (origEnd) origEnd.siblingCreated(cursor.options, side);
      if (sib) {
        cursor.insDirOf(-side as Direction, sib);
      } else {
        cursor.insAtDirEnd(side, parent);
      }
    } else {
      // if deleting like, inner close-brace of ([1+2}+3) where outer

      if (this.matchBrack(opts, side, this.parent.parent)) {
        // open-paren is

        (this.parent.parent as Bracket).closeOpposing(this); // ghost, then become [1+2+3)
        (this.parent.parent as Bracket).unwrap();
      } // else if deleting outward from a solid pair, unwrap
      else if (outward && wasSolid) {
        this.unwrap();
        sib
          ? cursor.insDirOf(-side as Direction, sib)
          : cursor.insAtDirEnd(side, parent);
        return;
      } else {
        // else deleting just one of a pair of brackets, become one-sided
        this.sides[side] = getOppBracketSide(this);
        this.delimFrags[L].removeClass('mq-ghost');
        this.delimFrags[R].removeClass('mq-ghost');
        const brackFrag = this.delimFrags[side].addClass('mq-ghost');
        this.replaceBracket(brackFrag, side);
      }
      if (sib) {
        // auto-expand so ghost is at far end
        const leftEnd = this.getEnd(L);
        var origEnd = leftEnd.getEnd(side);
        leftEnd.domFrag().removeClass('mq-empty');
        new Fragment(sib, farEnd, -side as Direction)
          .disown()
          .withDirAdopt(-side as Direction, leftEnd, origEnd, 0)
          .domFrag()
          .insAtDirEnd(side, leftEnd.domFrag().oneElement());
        if (origEnd) origEnd.siblingCreated(cursor.options, side);
        cursor.insDirOf(-side as Direction, sib);
      } // didn't auto-expand, cursor goes just outside or just inside parens
      else
        outward
          ? cursor.insDirOf(side, this)
          : cursor.insAtDirEnd(side, this.getEnd(L));
    }
  }
  replaceBracket(brackFrag: DOMFragment, side: BracketSide) {
    var symbol = this.getSymbol(side);
    brackFrag.children().replaceWith(domFrag(symbol.html()));
    brackFrag.oneElement().style.width = symbol.width;

    if (side === L) {
      const next = brackFrag.next();
      if (!next.isEmpty()) {
        next.oneElement().style.marginLeft = symbol.width;
      }
    } else {
      const prev = brackFrag.prev();
      if (!prev.isEmpty()) {
        prev.oneElement().style.marginRight = symbol.width;
      }
    }
  }
  deleteTowards(dir: Direction, cursor: Cursor) {
    this.deleteSide(-dir as Direction, false, cursor);
  }
  finalizeTree() {
    this.getEnd(L).deleteOutOf = function (dir: Direction, cursor: Cursor) {
      (this.parent as Bracket).deleteSide(dir, true, cursor);
    };
    // FIXME HACK: after initial creation/insertion, finalizeTree would only be
    // called if the paren is selected and replaced, e.g. by LiveFraction
    this.finalizeTree = this.intentionalBlur = function () {
      this.delimFrags[this.side === L ? R : L].removeClass('mq-ghost');
      this.side = 0;
    };
  }
  siblingCreated(_opts: CursorOptions, dir: Direction) {
    // if something typed between ghost and far
    if (dir === -this.side) this.finalizeTree(); // end of its block, solidify
  }
}

function getOppBracketSide(bracket: Bracket) {
  var side = bracket.side as Direction;
  var data = bracket.sides[side];
  return {
    ch: OPP_BRACKS[data.ch as keyof typeof OPP_BRACKS],
    ctrlSeq: OPP_BRACKS[data.ctrlSeq as keyof typeof OPP_BRACKS]
  };
}

var OPP_BRACKS = {
  '(': ')',
  ')': '(',
  '[': ']',
  ']': '[',
  '{': '}',
  '}': '{',
  '\\{': '\\}',
  '\\}': '\\{',
  '&lang;': '&rang;',
  '&rang;': '&lang;',
  '\\langle ': '\\rangle ',
  '\\rangle ': '\\langle ',
  '|': '|',
  '\\lVert ': '\\rVert ',
  '\\rVert ': '\\lVert '
};

var BRACKET_NAMES = {
  '&lang;': 'angle-bracket',
  '&rang;': 'angle-bracket',
  '|': 'pipe'
};

function bindCharBracketPair(
  open: keyof typeof OPP_BRACKS,
  ctrlSeq: string,
  name: string
) {
  var ctrlSeq = ctrlSeq || open;
  var close = OPP_BRACKS[open];
  var end = OPP_BRACKS[ctrlSeq as keyof typeof OPP_BRACKS];
  CharCmds[open] = () => new Bracket(L, open, close, ctrlSeq, end);
  CharCmds[close] = () => new Bracket(R, open, close, ctrlSeq, end);
  BRACKET_NAMES[open as keyof typeof BRACKET_NAMES] = BRACKET_NAMES[
    close as keyof typeof BRACKET_NAMES
  ] = name;
}
bindCharBracketPair('(', '', 'parenthesis');
bindCharBracketPair('[', '', 'bracket');
bindCharBracketPair('{', '\\{', 'brace');
LatexCmds.langle = () =>
  new Bracket(L, '&lang;', '&rang;', '\\langle ', '\\rangle ');
LatexCmds.rangle = () =>
  new Bracket(R, '&lang;', '&rang;', '\\langle ', '\\rangle ');
CharCmds['|'] = () => new Bracket(L, '|', '|', '|', '|');
LatexCmds.lVert = () =>
  new Bracket(L, '&#8741;', '&#8741;', '\\lVert ', '\\rVert ');
LatexCmds.rVert = () =>
  new Bracket(R, '&#8741;', '&#8741;', '\\lVert ', '\\rVert ');

LatexCmds.left = class extends MathCommand {
  parser() {
    var regex = Parser.regex;
    var string = Parser.string;
    var optWhitespace = Parser.optWhitespace;

    return optWhitespace
      .then(regex(/^(?:[([|]|\\\{|\\langle(?![a-zA-Z])|\\lVert(?![a-zA-Z]))/))
      .then(function (ctrlSeq) {
        var open = ctrlSeq.replace(/^\\/, '');
        if (ctrlSeq == '\\langle') {
          open = '&lang;';
          ctrlSeq = ctrlSeq + ' ';
        }
        if (ctrlSeq == '\\lVert') {
          open = '&#8741;';
          ctrlSeq = ctrlSeq + ' ';
        }
        return latexMathParser.then(function (block) {
          return string('\\right')
            .skip(optWhitespace)
            .then(
              regex(/^(?:[\])|]|\\\}|\\rangle(?![a-zA-Z])|\\rVert(?![a-zA-Z]))/)
            )
            .map(function (end) {
              var close = end.replace(/^\\/, '');
              if (end == '\\rangle') {
                close = '&rang;';
                end = end + ' ';
              }
              if (end == '\\rVert') {
                close = '&#8741;';
                end = end + ' ';
              }
              var cmd = new Bracket(0, open, close, ctrlSeq, end);
              cmd.blocks = [block];
              block.adopt(cmd, 0, 0);
              return cmd;
            });
        });
      });
  }
};

LatexCmds.right = class extends MathCommand {
  parser() {
    return Parser.fail('unmatched \\right');
  }
};

var leftBinomialSymbol = SVG_SYMBOLS['('];
var rightBinomialSymbol = SVG_SYMBOLS[')'];
class Binomial extends DelimsNode {
  ctrlSeq = '\\binom';
  domView = new DOMView(2, (blocks) =>
    h('span', { class: 'mq-non-leaf mq-bracket-container' }, [
      h(
        'span',
        {
          style: 'width:' + leftBinomialSymbol.width,
          class: 'mq-paren mq-bracket-l mq-scaled'
        },
        [leftBinomialSymbol.html()]
      ),
      h(
        'span',
        {
          style:
            'margin-left:' +
            leftBinomialSymbol.width +
            '; margin-right:' +
            rightBinomialSymbol.width,
          class: 'mq-non-leaf mq-bracket-middle'
        },
        [
          h('span', { class: 'mq-array mq-non-leaf' }, [
            h.block('span', {}, blocks[0]),
            h.block('span', {}, blocks[1])
          ])
        ]
      ),
      h(
        'span',
        {
          style: 'width:' + rightBinomialSymbol.width,
          class: 'mq-paren mq-bracket-r mq-scaled'
        },
        [rightBinomialSymbol.html()]
      )
    ])
  );

  textTemplate = ['choose(', ',', ')'];
  mathspeakTemplate = ['StartBinomial,', 'Choose', ', EndBinomial'];
  ariaLabel = 'binomial';

  finalizeTree() {
    const endsL = this.getEnd(L);
    const endsR = this.getEnd(R);
    this.upInto = endsR.upOutOf = endsL;
    this.downInto = endsL.downOutOf = endsR;
    // https://math.stackexchange.com/a/1617456 cites Knuth as the source of 'upper index' and 'lower index'
    endsL.ariaLabel = 'upper index';
    endsR.ariaLabel = 'lower index';
  }
}

LatexCmds.binom = LatexCmds.binomial = Binomial;

LatexCmds.choose = class extends Binomial {
  createLeftOf(cursor: Cursor) {
    LiveFraction.prototype.createLeftOf.call(this, cursor);
  }
};

class MathFieldNode extends MathCommand {
  name: string;
  ctrlSeq = '\\MathQuillMathField';
  domView = new DOMView(1, (blocks) => {
    return h('span', { class: 'mq-editable-field' }, [
      h.block(
        'span',
        { class: 'mq-root-block', 'aria-hidden': 'true' },
        blocks[0]
      )
    ]);
  });
  parser() {
    var self = this,
      string = Parser.string,
      regex = Parser.regex,
      succeed = Parser.succeed;
    return string('[')
      .then(regex(/^[a-z][a-z0-9]*/i))
      .skip(string(']'))
      .map(function (name) {
        self.name = name;
      })
      .or(succeed(undefined))
      .then(super.parser());
  }
  finalizeTree(options: CursorOptions) {
    var ctrlr = new Controller(
      this.getEnd(L) as ControllerRoot,
      this.domFrag().oneElement(),
      options
    );
    ctrlr.KIND_OF_MQ = 'MathField';
    ctrlr.editable = true;
    ctrlr.createTextarea();
    ctrlr.editablesTextareaEvents();
    ctrlr.cursor.insAtRightEnd(ctrlr.root);
    RootBlockMixin(ctrlr.root);

    // MathQuill applies aria-hidden to .mq-root-block containers
    // because these contain math notation that screen readers can't
    // interpret directly. MathQuill use an aria-live region as a
    // sibling of these block containers to provide an alternative
    // representation for screen readers
    //
    // MathFieldNodes have their own focusable text aria and aria live
    // region, so it is incorrect for any parent of the editable field
    // to have an aria-hidden property
    //
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
    //
    // Handle this by recursively walking the parents of this element
    // until we hit a root block, and if we hit any parent with
    // aria-hidden="true", removing the property from the parent and
    // pushing it down to each of the parents children. This should
    // result in no parent of this node having aria-hidden="true", but
    // should keep as much of what was previously hidden hidden as
    // possible while obeying this constraint
    function pushDownAriaHidden(node: ParentNode) {
      if (node.parentNode && !domFrag(node).hasClass('mq-root-block')) {
        pushDownAriaHidden(node.parentNode);
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.getAttribute('aria-hidden') === 'true') {
          element.removeAttribute('aria-hidden');
          domFrag(node)
            .children()
            .eachElement((child) => {
              child.setAttribute('aria-hidden', 'true');
            });
        }
      }
    }

    pushDownAriaHidden(this.domFrag().parent().oneElement());
    this.domFrag().oneElement().removeAttribute('aria-hidden');
  }
  registerInnerField(innerFields: InnerFields, MathField: InnerMathField) {
    const controller = (this.getEnd(L) as RootMathBlock).controller;
    const newField = new MathField(controller);
    innerFields[this.name] = newField;
    innerFields.push(newField);
  }
  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    this.getEnd(L).latexRecursive(ctx);

    this.checkCursorContextClose(ctx);
  }
  text() {
    return this.getEnd(L).text();
  }
}
LatexCmds.editable = LatexCmds.MathQuillMathField = MathFieldNode; // backcompat with before cfd3620 on #233

// Embed arbitrary things
// Probably the closest DOM analogue would be an iframe?
// From MathQuill's perspective, it's a MQSymbol, it can be
// anywhere and the cursor can go around it but never in it.
// Create by calling public API method .dropEmbedded(),
// or by calling the global public API method .registerEmbed()
// and rendering LaTeX like \embed{registeredName} (see test).
class EmbedNode extends MQSymbol {
  setOptions(options: EmbedOptions) {
    function noop() {
      return '';
    }
    this.text = options.text || noop;
    this.domView = new DOMView(0, () =>
      h('span', {}, [parseHTML(options.htmlString || '')])
    );
    this.latex = options.latex || noop;
    return this;
  }
  latexRecursive(ctx: LatexContext): void {
    this.checkCursorContextOpen(ctx);

    ctx.uncleanedLatex += this.latex();

    this.checkCursorContextClose(ctx);
  }
  parser() {
    var self = this,
      string = Parser.string,
      regex = Parser.regex,
      succeed = Parser.succeed;
    return string('{')
      .then(regex(/^[a-z][a-z0-9]*/i))
      .skip(string('}'))
      .then(function (name) {
        // the chars allowed in the optional data block are arbitrary other than
        // excluding curly braces and square brackets (which'd be too confusing)
        return string('[')
          .then(regex(/^[-\w\s]*/))
          .skip(string(']'))
          .or(succeed(undefined))
          .map(function (data) {
            return self.setOptions(EMBEDS[name](data));
          });
      });
  }
}
LatexCmds.embed = EmbedNode;

// LaTeX environments
// Environments are delimited by an opening \begin{} and a closing
// \end{}. Everything inside those tags will be formatted in a
// special manner depending on the environment type.
type EnvironmentConstructor = { new (): Environment };
const Environments: { [name: string]: EnvironmentConstructor } = {};

class BeginCommand extends MathCommand {
  parser() {
    const string = Parser.string;
    const regex = Parser.regex;
    return string('{')
      .then(regex(/^[a-z]+/i))
      .skip(string('}'))
      .then(function (env) {
        const EnvClass = Environments[env];
        return (
          EnvClass
            ? new EnvClass().parser()
            : Parser.fail('unknown environment type: ' + env)
        ).skip(string('\\end{' + env + '}'));
      });
  }
}
LatexCmds.begin = BeginCommand;

class Environment extends MathCommand {
  environment = 'matrix';
  template = [
    ['\\begin{', '}'],
    ['\\end{', '}']
  ];

  wrappers() {
    return [
      this.template[0].join(this.environment),
      this.template[1].join(this.environment)
    ];
  }
}

interface MatrixParentheses {
  left: string | null;
  right: string | null;
}

const MATRIX_DELIMITERS = {
  column: '&',
  row: '\\\\'
};

const mqBlockId = 'mathquill-block-id';

class Matrix extends Environment {
  parentheses: MatrixParentheses = {
    left: null,
    right: null
  };
  blocks: MatrixCell[] = [];
  hline?: boolean;
  options?: string;

  reflow() {
    const matrixEl = this.domFrag().oneElement();
    const blockjQ = matrixEl.querySelector('table');
    if (!blockjQ) return;

    const fontSize = parseFloat(getComputedStyle(blockjQ).fontSize);
    const height = blockjQ.offsetHeight / fontSize;

    const parens = matrixEl.querySelectorAll('.mq-paren');
    if (parens.length) {
      parens.forEach((paren) => {
        scale(
          domFrag(paren),
          Math.min(1 + 0.2 * (height - 1), 1.2),
          1.05 * height
        );
      });
    }
  }

  latexRecursive(ctx: LatexContext) {
    this.checkCursorContextOpen(ctx);

    let hline = this.hline;
    let latex = '';
    let row: number | undefined;
    const startIndex = ctx.uncleanedLatex.length;

    this.eachChild((cell: MatrixCell) => {
      if (typeof row !== 'undefined') {
        if (row !== cell.row) {
          latex += MATRIX_DELIMITERS.row + '\n';
          if (hline) {
            latex += '\\hline\n';
            hline = false;
          }
        } else {
          latex += MATRIX_DELIMITERS.column;
        }
      }
      row = cell.row;

      const cellStartIndex = ctx.uncleanedLatex.length;
      cell.latexRecursive(ctx);
      const cellLatex = ctx.uncleanedLatex.substring(cellStartIndex);
      latex += cellLatex;
    });

    const wrappers = this.wrappers();
    const options = this.options ? '{' + this.options + '}' : '';
    ctx.uncleanedLatex =
      ctx.uncleanedLatex.substring(0, startIndex) +
      wrappers[0] + options + '\n' + latex + '\n' + wrappers[1];

    this.checkCursorContextClose(ctx);
  }

  domView = new DOMView(0, () => h('span'));

  html() {
    const cells: MatrixCell[][] = [];
    let row: number | undefined;

    const parenHtml = (paren: string | null) => {
      if (!paren) return null;
      return h('span', { class: 'mq-scaled mq-paren' }, [parseHTML(paren)]);
    };

    // Build 2D array of cells
    this.eachChild((cell: MatrixCell) => {
      if (row !== cell.row) {
        row = cell.row;
        cells[row] = [];
      }
      cells[row].push(cell);
    });

    let blockIdx = 0;
    const numBlocks = this.blocks.length;

    this.domView = new DOMView(numBlocks, (blocks) => {
      blockIdx = 0;
      const tableRows = cells.map((rowCells) => {
        const tds = rowCells.map(() => {
          return h('td', {}, [h.block('span', {}, blocks[blockIdx++])]);
        });
        return h('tr', {}, tds);
      });

      const children: (VNode | null)[] = [
        parenHtml(this.parentheses.left),
        h('table', { class: 'mq-non-leaf' }, tableRows),
        parenHtml(this.parentheses.right)
      ];

      return h('span', { class: `mq-matrix mq-matrix-${this.environment} mq-non-leaf` }, children.filter((x) => x !== null) as VNode[]);
    });

    return super.html();
  }

  // Create default 4-cell matrix
  createBlocks() {
    this.blocks = [
      new MatrixCell(0, this),
      new MatrixCell(0, this),
      new MatrixCell(1, this),
      new MatrixCell(1, this)
    ];
    this.ends[L] = this.blocks[0];
    this.ends[R] = this.blocks[this.blocks.length - 1];
  }

  parser() {
    const self = this;
    const optWhitespace = Parser.optWhitespace;
    const string = Parser.string;
    const regex = Parser.regex;

    return regex(/^({[^}]*})?/)
      .then(function (options: string) {
        if (!self.options && options) {
          self.options = options.slice(1, -1);
        }
        return Parser.succeed(self);
      })
      .skip(optWhitespace)
      .then(function () {
        return string(MATRIX_DELIMITERS.column)
          .or(string(MATRIX_DELIMITERS.row))
          .or(optWhitespace.then(string('\\hline')).skip(optWhitespace))
          .or(latexMathParser.block);
      })
      .many()
      .skip(optWhitespace)
      .then(function (items: any[]) {
        let blocks: MathBlock[] = [];
        let row = 0;
        self.blocks = [];

        function addCell() {
          self.blocks.push(new MatrixCell(row, self, blocks));
          blocks = [];
        }

        for (let i = 0; i < items.length; i += 1) {
          if (items[i] instanceof MathBlock) {
            blocks.push(items[i]);
          } else if (items[i] === '\\hline') {
            self.hline = true;
          } else {
            addCell();
            if (items[i] === MATRIX_DELIMITERS.row) row += 1;
          }
        }
        addCell();
        self.autocorrect();
        return Parser.succeed(self);
      });
  }

  // Relink all the cells after parsing
  finalizeTree(options?: CursorOptions) {
    const table = this.domFrag().oneElement().querySelector('table');
    if (table) {
      const trs = table.querySelectorAll('tr');
      domFrag(table).toggleClass('mq-rows-1', trs.length === 1);
    }
    this.relink();
  }

  // Set up directional pointers between cells
  relink() {
    const blocks = this.blocks;
    const rows: MatrixCell[][] = [];
    let row: number | undefined;
    let column: number;
    let cell: MatrixCell;

    // Use a for loop rather than eachChild
    // as we're still making sure children()
    // is set up properly
    for (let i = 0; i < blocks.length; i += 1) {
      cell = blocks[i];
      if (row !== cell.row) {
        row = cell.row;
        rows[row] = [];
        column = 0;
      }
      rows[row][column!] = cell;

      // Set up horizontal linkage
      (cell as any)[R] = blocks[i + 1];
      (cell as any)[L] = blocks[i - 1];

      // Set up vertical linkage
      if (rows[row - 1] && rows[row - 1][column!]) {
        cell.upOutOf = rows[row - 1][column!];
        rows[row - 1][column!].downOutOf = cell;
      }

      column! += 1;
    }

    // set start and end blocks of matrix
    this.ends[L] = blocks[0];
    this.ends[R] = blocks[blocks.length - 1];
  }

  // Ensure consistent row lengths
  autocorrect() {
    const lengths: number[] = [];
    const rows: MatrixCell[][] = [];
    const blocks = this.blocks;
    let maxLength: number, shortfall: number, position: number, row: number, i: number;

    for (i = 0; i < blocks.length; i += 1) {
      row = blocks[i].row;
      rows[row] = rows[row] || [];
      rows[row].push(blocks[i]);
      lengths[row] = rows[row].length;
    }

    maxLength = Math.max(...lengths);
    if (maxLength !== Math.min(...lengths)) {
      // Pad shorter rows to correct length
      for (i = 0; i < rows.length; i += 1) {
        shortfall = maxLength - rows[i].length;
        while (shortfall) {
          position = maxLength * i + rows[i].length;
          blocks.splice(position, 0, new MatrixCell(i, this));
          shortfall -= 1;
        }
      }
      this.relink();
    }
  }

  // Deleting a cell will also delete the current row and
  // column if they are empty, and relink the matrix.
  deleteCell(currentCell: MatrixCell) {
    const rows: MatrixCell[][] = [];
    const columns: MatrixCell[][] = [];
    let myRow: MatrixCell[] = [];
    let myColumn: MatrixCell[] = [];
    const blocks = this.blocks;
    let row: number | undefined;
    let column: number;

    // Create arrays for cells in the current row / column
    this.eachChild((cell: MatrixCell) => {
      if (row !== cell.row) {
        row = cell.row;
        rows[row] = [];
        column = 0;
      }
      columns[column!] = columns[column!] || [];
      columns[column!].push(cell);
      rows[row].push(cell);

      if (cell === currentCell) {
        myRow = rows[row];
        myColumn = columns[column!];
      }

      column! += 1;
    });

    function isEmpty(cells: MatrixCell[]) {
      const empties: MatrixCell[] = [];
      for (let i = 0; i < cells.length; i += 1) {
        if (cells[i].isEmpty()) empties.push(cells[i]);
      }
      return empties.length === cells.length;
    }

    function remove(cells: MatrixCell[]) {
      for (let i = 0; i < cells.length; i += 1) {
        const idx = blocks.indexOf(cells[i]);
        if (idx > -1) {
          cells[i].remove();
          blocks.splice(idx, 1);
        }
      }
    }

    if (isEmpty(myRow) && myColumn.length > 1) {
      row = rows.indexOf(myRow);
      // Decrease all following row numbers
      this.eachChild((cell: MatrixCell) => {
        if (cell.row > row!) cell.row -= 1;
      });
      // Dispose of cells and remove <tr>
      remove(myRow);
      const table = this.domFrag().oneElement().querySelector('table');
      if (table) {
        const tr = table.querySelectorAll('tr')[row!];
        if (tr) tr.remove();
      }
    }
    if (isEmpty(myColumn) && myRow.length > 1) {
      remove(myColumn);
    }
    this.finalizeTree();
  }

  addRow(afterCell: MatrixCell): MatrixCell {
    const previous: MatrixCell[] = [];
    const newCells: MatrixCell[] = [];
    const next: MatrixCell[] = [];
    const row = afterCell.row;
    let columns = 0;
    let block: MatrixCell;

    this.eachChild((cell: MatrixCell) => {
      // Cache previous rows
      if (cell.row <= row) {
        previous.push(cell);
      }
      // Work out how many columns
      if (cell.row === row) {
        columns += 1;
      }
      // Cache cells after new row
      if (cell.row > row) {
        cell.row += 1;
        next.push(cell);
      }
    });

    const newRow = h('tr');

    // Add new cells, one for each column
    for (let i = 0; i < columns; i += 1) {
      block = new MatrixCell(row + 1);
      block.parent = this;
      newCells.push(block);

      // Create cell <td>s and add to new row
      const td = h('td', { class: 'mq-empty' });
      td.setAttribute(mqBlockId, String(block.id));
      block.setDOM(td);
      newRow.appendChild(td);
    }

    // Insert the new row
    const table = this.domFrag().oneElement().querySelector('table');
    if (table) {
      const trs = table.querySelectorAll('tr');
      const targetRow = trs[row];
      if (targetRow && targetRow.nextSibling) {
        table.insertBefore(newRow, targetRow.nextSibling);
      } else {
        table.appendChild(newRow);
      }
    }

    this.blocks = previous.concat(newCells, next);
    return newCells[0];
  }

  addColumn(afterCell: MatrixCell): MatrixCell {
    const rows: MatrixCell[][] = [];
    const newCells: MatrixCell[] = [];
    let column: number | undefined;
    let block: MatrixCell;

    // Build rows array and find new column index
    this.eachChild((cell: MatrixCell) => {
      rows[cell.row] = rows[cell.row] || [];
      rows[cell.row].push(cell);
      if (cell === afterCell) column = rows[cell.row].length;
    });

    // Add new cells, one for each row
    for (let i = 0; i < rows.length; i += 1) {
      block = new MatrixCell(i);
      block.parent = this;
      newCells.push(block);
      rows[i].splice(column!, 0, block);

      const td = h('td', { class: 'mq-empty' });
      td.setAttribute(mqBlockId, String(block.id));
      block.setDOM(td);
    }

    // Add cell <td> elements in correct positions
    const table = this.domFrag().oneElement().querySelector('table');
    if (table) {
      const trs = table.querySelectorAll('tr');
      trs.forEach((tr, i) => {
        const tds = tr.querySelectorAll('td');
        const targetTd = tds[column! - 1];
        const newTd = rows[i][column!].domFrag().oneElement();
        if (targetTd && targetTd.nextSibling) {
          tr.insertBefore(newTd, targetTd.nextSibling);
        } else {
          tr.appendChild(newTd);
        }
      });
    }

    // Flatten the rows array-of-arrays
    this.blocks = ([] as MatrixCell[]).concat(...rows);
    return newCells[afterCell.row];
  }

  insert(method: 'addRow' | 'addColumn', afterCell: MatrixCell) {
    const cellToFocus = this[method](afterCell);
    this.finalizeTree();
    this.bubble((node) => {
      if (node instanceof Matrix) {
        node.reflow();
      }
      return undefined;
    });
    const cursor = this.cursor || (this.parent as Matrix).cursor;
    if (cursor) {
      cursor.insAtRightEnd(cellToFocus);
    }
  }

  backspace(
    cell: MatrixCell,
    dir: Direction,
    cursor: Cursor,
    finalDeleteCallback: () => void
  ) {
    let dirwards: MQNode | undefined = cell[dir] as MQNode | undefined;
    if (cell.isEmpty()) {
      this.deleteCell(cell);
      while (
        dirwards &&
        dirwards[dir] &&
        this.blocks.indexOf(dirwards as MatrixCell) === -1
      ) {
        dirwards = dirwards[dir] as MQNode | undefined;
      }
      if (dirwards) {
        cursor.insAtDirEnd(-dir as Direction, dirwards as MQNode);
      }
      if (this.blocks.length === 1 && this.blocks[0].isEmpty()) {
        finalDeleteCallback();
        this.finalizeTree();
      }
      this.bubble((node) => {
        if (node instanceof Matrix) {
          node.reflow();
        }
        return undefined;
      });
    }
  }
}
Environments.matrix = Matrix;

// Matrix variants with different parentheses
class PMatrix extends Matrix {
  environment = 'pmatrix';
  parentheses = {
    left: '(',
    right: ')'
  };
}
Environments.pmatrix = PMatrix;

class BMatrix extends Matrix {
  environment = 'bmatrix';
  parentheses = {
    left: '[',
    right: ']'
  };
}
Environments.bmatrix = BMatrix;

class CapitalBMatrix extends Matrix {
  environment = 'Bmatrix';
  parentheses = {
    left: '{',
    right: '}'
  };
}
Environments.Bmatrix = CapitalBMatrix;

class VMatrix extends Matrix {
  environment = 'vmatrix';
  parentheses = {
    left: '|',
    right: '|'
  };
}
Environments.vmatrix = VMatrix;

class CapitalVMatrix extends Matrix {
  environment = 'Vmatrix';
  parentheses = {
    left: '&#8214;',
    right: '&#8214;'
  };
}
Environments.Vmatrix = CapitalVMatrix;

class Cases extends Matrix {
  environment = 'cases';
  parentheses = {
    left: '{',
    right: null
  };
}
Environments.cases = Cases;

class ArrayEnv extends Matrix {
  environment = 'array';
  parentheses = {
    left: null,
    right: null
  };
  hline = true;
  options = 'l|l';
}
Environments.array = ArrayEnv;

// Replacement for MathBlock inside matrix cells
// Adds matrix-specific keyboard commands
class MatrixCell extends MathBlock {
  row: number;

  constructor(row: number, parent?: Matrix, replaces?: MathBlock[]) {
    super();
    this.row = row;
    if (parent) {
      const parentEndR = parent.getEnd(R);
      this.adopt(parent, parentEndR, 0);
    }
    if (replaces) {
      for (let i = 0; i < replaces.length; i++) {
        const children = replaces[i].children();
        const thisEndR = this.getEnd(R);
        children.adopt(this, thisEndR, 0);
      }
    }
  }

  keystroke(key: string, e: KeyboardEvent, ctrlr: Controller): void | boolean {
    switch (key) {
      case 'Tab': {
        // Work out how many columns
        const currentCell = this;
        let columns = 0;
        let currentColumn: number | undefined;
        (this.parent as Matrix).eachChild((cell) => {
          const matrixCell = cell as MatrixCell;
          if (matrixCell.row === currentCell.row) {
            if (cell === currentCell) currentColumn = columns;
            columns += 1;
          }
        });
        // Only add new column if this is the rightmost column
        if (currentColumn === columns - 1) {
          e.preventDefault();
          return (this.parent as Matrix).insert('addColumn', this);
        }
        break;
      }
      case 'Enter': {
        // Add a row below the current one, unless the next row is already empty
        const nextRow = this.row + 1;
        let nextRowIsEmpty = true;
        let nextRowFirstCell: MatrixCell | undefined;
        (this.parent as Matrix).eachChild((cell) => {
          const matrixCell = cell as MatrixCell;
          if (matrixCell.row === nextRow) {
            if (!nextRowFirstCell) {
              nextRowFirstCell = matrixCell;
            }
            if (!matrixCell.isEmpty()) {
              nextRowIsEmpty = false;
            }
          }
        });
        e.preventDefault();
        if (nextRowFirstCell && nextRowIsEmpty) {
          ctrlr.cursor.insAtDirEnd(L, nextRowFirstCell);
          break;
        }
        return (this.parent as Matrix).insert('addRow', this);
      }
    }
    return super.keystroke(key, e, ctrlr);
  }

  deleteOutOf(dir: Direction, cursor: Cursor) {
    const parent = this.parent as Matrix;
    parent.backspace(this, dir, cursor, () => {
      // called when last cell gets deleted
      super.deleteOutOf(dir, cursor);
    });
  }
}

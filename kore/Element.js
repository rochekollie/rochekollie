export class Element extends HTMLElement {
  constructor(element) {
    super();
    this.element = element;
    this.margin = {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0
    };
    this.padding = {
      paddingTop: this.paddingTop,
      paddingRight: this.paddingRight,
      paddingBottom: this.paddingBottom,
      paddingLeft: this.paddingLeft
    };
    this.border = {
      borderTop: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0
    };



    // convert to HTMlElement if it's a string
    if (typeof this.element === 'string') {
      this.element = document.createElement(element);
    }
  }

  /**
   * Creates a new HTMLElement.
   * @param tag - the tag name of the element to create.
   * @returns {HTMLElement} - the created HTMLElement.
   */
  static create(tag) {
    const tags = [
      'A',
      'ABBR',
      'ADDRESS',
      'AREA',
      'ARTICLE',
      'ASIDE',
      'AUDIO',
      'B',
      'BASE',
      'BDI',
      'BDO',
      'BLOCKQUOTE',
      'BODY',
      'BR',
      'BUTTON',
      'CANVAS',
      'CAPTION',
      'CITE',
      'CODE',
      'COL',
      'COLGROUP',
      'DATA',
      'DATALIST',
      'DD',
      'DEL',
      'DETAILS',
      'DFN',
      'DIALOG',
      'DIV',
      'DL',
      'DT',
      'EM',
      'EMBED',
      'FIELDSET',
      'FIGCAPTION',
      'FIGURE',
      'FOOTER',
      'FORM',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'HEAD',
      'HEADER',
      'HGROUP',
      'HR',
      'HTML',
      'I',
      'IFRAME',
      'IMG',
      'INPUT',
      'INS',
      'KBD',
      'LABEL',
      'LEGEND',
      'LI',
      'LINK',
      'MAIN',
      'MAP',
      'MARK',
      'META',
      'METER',
      'NAV',
      'NOSCRIPT',
      'OBJECT',
      'OL',
      'OPTGROUP',
      'OPTION',
      'OUTPUT',
      'P',
      'PARAM',
      'PICTURE',
      'PRE',
      'PROGRESS',
      'Q',
      'RB',
      'RP',
      'RT',
      'RTC',
      'RUBY',
      'S',
      'SAMP',
      'SCRIPT',
      'SECTION',
      'SELECT',
      'SLOT',
      'SMALL',
      'SOURCE',
      'SPAN',
      'STRONG',
      'STYLE',
      'SUB',
      'SUMMARY',
      'SUP',
      'TABLE',
      'TBODY',
      'TD',
      'TEMPLATE',
      'TEXTAREA',
      'TFOOT',
      'TH',
      'THEAD',
      'TIME',
      'TITLE',
      'TR',
      'TRACK',
      'U',
      'UL',
      'VAR',
      'VIDEO',
      'WBR',
    ];

    // convert to uppercase and check if it's a valid tag
    if (!tags.includes(tag.toLocaleUpperCase())) {
      throw new Error('Invalid HTML tag.');
    }
    return document.createElement(tag);
  }

  /**
   * Renders a HTMLContent, textContent, or imageContent within a specified HTMLElement.
   * @param content - the data content to display.
   * */
  render = (content) => {
    const imageFormat = /jpg|jpeg|png|gif|svg|webm/;
    const isImageContent = imageFormat.test(content);
    const isImageElement = this.element.tagName === 'IMG';
    const tags = [
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'P',
      'SPAN',
      'DIV',
      'LI',
      'A',
    ];

    const fields = ['INPUT', 'TEXTAREA'];
    const isTextElement = tags.includes(this.element.tagName);
    const isFieldElement = fields.includes(this.element.tagName);

    try {
      if (isImageElement && isImageContent) {
        this.element.src = content;
      } else if (isImageElement && !isImageContent) {
        this.element.style.backgroundImage = `url('${content}')`;
      } else if (isTextElement) {
        this.element.textContent = content;
      } else if (isFieldElement) {
        this.element.value = content;
      } else {
        throw new Error('Invalid HTMLElement');
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetch = (contentType) => {
    const isImageElement = this.element.tagName === 'IMG';
    const isFieldElement = ['INPUT', 'TEXTAREA'].includes(this.element.tagName);
    const isTextElement = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'DIV', 'LI', 'A'].includes(this.element.tagName);

    if (isImageElement) {
      throw new Error('fetch() is not supported for IMG elements. Use getSrc() instead.');
    } else if (isFieldElement) {
      return this.element.value;
    } else if (isTextElement) {
      return this.element.textContent;
    } else {
      throw new Error('Invalid HTMLElement');
    }
  }

  getSrc = () => {
    const isImageElement = this.element.tagName === 'IMG';

    if (isImageElement) {
      return this.element.src;
    } else {
      throw new Error('getSrc() is only supported for IMG elements. Use fetch() instead.');
    }
  }

  // update = (content) => {
  //   this.element.update(content);
  // }

  color = (color) => {
    this.element.style.color = color;
  }

  backgroundColor = (color) => {
    this.element.style.backgroundColor = color;
  }

  background = (img) => {
    this.background = img;
  }

  margin = (unit, ...margin) => {
    const sides  = margin.length;
    if ((sides === 1 && unit === undefined) || (sides === 1 && unit === 'px') ) {
      this.element.style.margin = `${margin[0]}px`;
    }
    //const margins = margin.join(' ');

    console.log(margin.length);
  }




  setMargin(...args) {
    let marginTop = " ";
    let marginTop = " ";
    let marginTop = " ";
    const HTMLElementSides = args.length;
    if (HTMLElementSides == 0){
      this.element.margin = 0;
    } else if (HTMLElementSides === 1){
      this.element.margin = args[0];
    } else if (HTMLElementSides === 2){
      this.element.marginTop = args[0];
      this.element.marginRight = args[1];
      this.element.marginBottom = args[0];
      this.element.marginLeft = args[1];
    } else if (HTMLElementSides === 3){
      this.element.marginTop = args[0];
      this.element.marginRight = args[1];
      this.element.marginBottom = args[2];
      this.element.marginLeft = args[1];
    } else if (HTMLElementSides === 4){
      this.element.marginTop = args[0];
      this.element.marginRight = args[2];
      this.element.marginBottom = args[3];
      this.element.marginLeft = args[4];
    }

// update the private field
    this.margin  = {
      marginTop: this.element.marginTop,
      marginRight: this.element.marginRight,
      marginBottom: this.element.marginBottom,
      marginLeft: this.element.marginLeft
    }

  append = (content) => {
    this.element.append(content);
  }

  remove = () => {
    this.element.remove();
  }


  addContent = (content) => {
    const isTextElement = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'DIV', 'LI', 'A'].includes(this.element.tagName);

    if (isTextElement) {
      this.element.textContent += content;
    } else {
      throw new Error('Invalid HTMLElement');
    }
  }

  /**
   * Sets given class names to the HTMLElement.
   * @param classNames - the class names to set.
   * @returns {HTMLElement} - the HTMLElement with the given class names.
   */
  setClassNames = (...classNames) => {
    this.element.className = classNames.join(' ');
    return this.element;
  }

  /**
   * Sets given attributes to the HTMLElement.
   * @param attributes - the attributes to set.
   * @returns {HTMLElement} - the HTMLElement with the given attributes.
   */
  setAttributes = (...attributes) => {
    attributes.forEach((attribute) => {
      this.element.setAttribute(attribute.name, attribute.value);
    });
    return this.element;
  }

  /**
   * Sets given styles to the HTMLElement.
   * @param styles - the styles to set.
   * @returns {HTMLElement} - the HTMLElement with the given styles.
   */
  setStyles = (...styles) => {
    styles.forEach((style) => {
      this.element.style[style.name] = style.value;
    });
    return this.element;
  }

  /**
   * Add an event listener to the HTMLElement.
   */
  addEvents(event, callback) {
    this.element.addEventListener(event, callback);
  }

  /**
   * Remove an event listener from the HTMLElement.
   */
  removeEvents(event, callback) {
    this.element.removeEventListener(event, callback);
  }

}
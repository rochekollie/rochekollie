/**
 * Display a text or image content within a specified HTMLElement.
 * @param element - The HTMLElement to display the content in.
 * @param content - the data content to display.
 * */
export function render(element, content) {
  const textElements = [
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "P",
    "SPAN",
    "DIV",
    "PRE",
    "LI",
    "DT",
    "DD",
    "BLOCKQUOTE",
    "CAPTION",
    "FIGCAPTION",
    "LABEL",
    "LEGEND",
    "BUTTON",
    "OPTION",
    "TEXTAREA",
    "TITLE"
  ];
  const valueElements = ["INPUT", "SELECT", "TEXTAREA"];
  const srcElements = [
    "IMG",
    "A",
    "IFRAME",
    "VIDEO",
    "AUDIO",
    "SOURCE",
    "TRACK",
    "EMBED",
    "OBJECT",
    "PARAM",
    "SCRIPT",
    "LINK",
    "STYLE",
    "CANVAS",
    "SVG",
    "MATH",
    "FRAME",
    "IFRAME",
    "APPLET",
    "AREA",
    "BASE",
    "BGSOUND",
    "IMAGE"
  ];
  const hrefElements = ["A", "AREA", "BASE"];
  const dataElements = ["OBJECT"];

  if (textElements.includes(element.nodeName)) {
    element.textContent = content;
  } else if (valueElements.includes(element.nodeName)) {
    element.value = content;
  } else if (srcElements.includes(element.nodeName)) {
    element.src = content;
  } else if (hrefElements.includes(element.nodeName)) {
    element.href = content;
  } else if (dataElements.includes(element.nodeName)) {
    element.data = content;
  } else if (element.nodeName === "IMG") {
    element.src = content;
  } else if (element.nodeName === "A") {
    element.href = content;
  } else if (element.nodeName === "LINK") {
    element.href = content;
  } else if (element.nodeName === "STYLE") {
    element.textContent = content;
  } else if (customElements.includes(element.nodeName)) {
    // ... custom element logic here
  } else {
    throw new Error("Element not supported.");
  }
}


const updateView = (view, content) => {
  const imageFormat = /jpg|jpeg|png|gif|svg|webm/;
  const isImageContent = imageFormat.test(content);
  const isImageElement = view.tagName === 'IMG';
  const isInputElement = view.tagName === 'INPUT';
  const textTagNames = [
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'P',
    'SPAN',
    'DIV',
    'TEXTAREA',
    'A',
  ];

  const isTextElement = textTagNames.includes(view.tagName);

  try {
    if (isImageContent && view.tagName === 'IMG') {
      view.src = content;
    } else if (imageFormat.test(content) && view.tagName !== 'IMG') {
      view.style.backgroundImage = `url('${content}')`;
    } else if (view.tagName === 'INPUT') {
      view.value = content;
    } else {
      view.textContent = content;
    }

    // if (imageFormat.test(content)) {
    //   view.style.backgroundImage = `url('${content}')`;
    // } else {
    //   view.innerHTML = content;
    // }
  } catch (error) {
    console.log(error);
  }
};

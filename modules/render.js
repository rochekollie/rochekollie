/**
 * Display a text or image content within a specified HTMLElement.
 * @param element - The HTMLElement to display the content in.
 * @param content - the data content to display.
 * */
export function render(element, content) {
  const HTMLTags = {
    texts: [
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
    ],
    values: ["INPUT", "SELECT", "TEXTAREA"],
    srcs: [
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
    ],
    hrefs: ["A", "AREA", "BASE"],
    data: ["OBJECT"],
    customTags: []
  }

  console.log(Object.values(HTMLTags))

  // if (Object.values(HTMLTags).includes(element.nodeName)){
  //   console.log(element.nodeName)
  // }

//   if (HTMLTags.texts.includes(element.nodeName)){
//     element.textContent = content;
//   } else if (HTMLTags.values.includes(element.nodeName)) {
//     element.value = content;
//   } else if (HTMLTags.srcs.includes(element.nodeName)) {
//     element.src = content;
//   } else if (HTMLTags.hrefs.includes(element.nodeName)) {
//     element.href = content;
//   } else if (HTMLTags.data.includes(element.nodeName)) {
//     element.data = content;
//   } else if (element.nodeName === "IMG") {
//     element.src = content;
//   } else if (element.nodeName === "A") {
//     element.href = content;
//   } else if (element.nodeName === "LINK") {
//     element.href = content;
//   } else if (element.nodeName === "STYLE") {
//     element.textContent = content;
//   } else if (HTMLTags.customTags.includes(element.nodeName)) {
//     // ... custom element logic here
//   } else {
//     throw new Error("Element not supported.");
//   }
}


/**
 * Display a text or image content within a specified HTMLElement.
 * @param element - The HTMLElement to display the content in.
 * @param content - the data content to display.
 * */
export function update(element, callbackFunc, interval) {
  try {
    callbackFunc();
  } catch (error) {
    console.log(error);
  }

  if (interval){
    setInterval(() => {
      try {
        callbackFunc();
        console.log(content);
      } catch (error) {
        console.log(error);
      }
    }, interval)
  }
}
const debugButton = document.createElement('button',);
debugButton.innerHTML = 'Reload';
document.body.appendChild(debugButton);
debugButton.style.position = 'absolute';
debugButton.style.bottom = '10px';
debugButton.style.right = '10px';
debugButton.style.zIndex = '9999';
debugButton.style.backgroundColor = 'red';
debugButton.style.color = 'white';
debugButton.style.border = 'none';
debugButton.style.paddingTop = '5px';
debugButton.style.paddingBottom = '5px';
debugButton.style.paddingLeft = '10px';
debugButton.style.paddingRight = '10px';
debugButton.style.borderRadius = '12px';
debugButton.style.width = 'auto';
debugButton.style.cursor = 'pointer';
debugButton.style.fontSize = '.7rem';
debugButton.style.fontWeight = '600';
debugButton.style.fontFamily = 'Inter sans-serif';
debugButton.style.textTransform = 'uppercase';
debugButton.style.outline = 'none';
debugButton.style.boxShadow = '0 0 20px 0 rgba(0, 0, 0, 0.5)';
debugButton.addEventListener('click', () => {
  localStorage.clear();
  window.location.reload();
});

// const controller = new AbortController();
//
// // Testing eyeDropper API
// const eyeDropper = new EyeDropper();
// try {
//   const result = await eyeDropper.open();
//   // The user selected a pixel, here is its color:
//   const colorHexValue = result.sRGBHex;
//   console.log(`You select this color: ${colorHexValue}`);
// } catch (err) {
//   // The user escaped the eyedropper mode.
// }

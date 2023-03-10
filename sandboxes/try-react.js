const root = ReactDOM.createRoot(document.getElementById("root"));
const greetings = ["Hello World", "Hola Mundo", "你好世界", "Bonjour le monde", "Ndewo Ụwa", "Molo Lizwe"];

const randomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

let newGreeting = randomGreeting();

window.setInterval(newGreeting, 1000);

root.render(<h1>{newGreeting}</h1>);

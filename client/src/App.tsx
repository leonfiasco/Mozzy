import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const App = () => {
  const onClick = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab && tab.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (tab, chrome) => {
            alert("This ting is running in React!");
            console.log("Tab object:", tab);
            console.log("Chrome object:", chrome);
          },
          args: [tab, chrome],
        });
      } else {
        console.error("No active tab found.");
      }
    } catch (error) {
      console.error("Error executing script:", error);
    }
  };

  return (
    <>
      <div className="card">
        <button onClick={onClick}>Translate</button>
      </div>
    </>
  );
};

export default App;

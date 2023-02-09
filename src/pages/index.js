import React, { useRef, useState, useEffect } from "react";
import {
  download,
  uploadToTwitter,
  fetchData,
  downloadJSON,
  cleanUsername,
  share
} from "../utils/export";
import ThemeSelector from "../components/themes";

const App = () => {
  const inputRef = useRef();
  const canvasRef = useRef();
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("standard");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState(7);
  const [columns, setColumns] = useState(7);
  const [padding, setPadding] = useState(75);
  const [size, setSize] = useState(100);

  useEffect(() => {
    if (!data) {
      return;
    }
    draw();
  }, [data, theme, rows, columns, size, padding]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setUsername(cleanUsername(username));
    setLoading(true);
    setError(null);
    setData(null);

    fetchData(cleanUsername(username))
      .then((data) => {
        setLoading(false);

        if (data.years.length === 0) {
          setError("Could not find your profile");
        } else {
          setData(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError("I could not check your profile successfully...");
      });
  };

  const onDownload = (e) => {
    e.preventDefault();
    download(canvasRef.current);
  };

  const onDownloadJson = (e) => {
    e.preventDefault();
    if (data != null) {
      downloadJSON(data);
    }
  };

  const onShareTwitter = (e) => {
    e.preventDefault();
    uploadToTwitter(canvasRef.current);
  };

  const onShare = (e) => {
    e.preventDefault();
    share(canvasRef.current);
  };

  const draw = async () => {
    if (!canvasRef.current || !data) {
      setError("Something went wrong... Check back later.");
      return;
    }

    const { drawContributions } = await import("../utils/customDraw");

    drawContributions(canvasRef.current, {
      data,
      username: username,
      themeName: theme,
      footerText: "Made by @sallar & friends - github-contributions.vercel.app",
      size: size,
      rows: rows,
      columns: columns,
      padding: padding
    });
    contentRef.current.scrollIntoView({
      behavior: "smooth"
    });
  };

  const _renderGithubButton = () => {
    return (
      <div className="App-github-button">
        <a
          className="github-button"
          href="https://github.com/sallar/github-contributions-chart"
          data-size="large"
          data-show-count="true"
          aria-label="Star sallar/github-contribution-chart on GitHub"
        >
          Star
        </a>
      </div>
    );
  };

  const _renderLoading = () => {
    return (
      <div className="App-centered">
        <div className="App-loading">
          <img src={"/loading.gif"} alt="Loading..." width={200} />
          <p>Please wait, I’m visiting your profile...</p>
        </div>
      </div>
    );
  };

  const _renderGraphs = () => {
    return (
      <div
        className="App-result"
        style={{ display: data !== null && !loading ? "flex" : "none" }}
      >
        <p>Your chart is ready!</p>

        {data !== null && (
          <div style={{display: "flex", flexDirection: "column", gap:"2rem"}}>
            <div className="bentoCard">
              <canvas className="preview" ref={canvasRef} />
              {/* <div className="captionBoxContainer">
                <div className="captionBox">
                  my recent github contributions
                </div>
              </div> */}
            </div>
            
            <div className="App-buttons">
              <button className="App-download-button" onClick={onDownload} type="button">
                Download the Image
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const _renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          placeholder="Your GitHub Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          id="username"
          autoCorrect="off"
          autoCapitalize="none"
          autoFocus
        />
        <button className="bentoButton" type="submit" disabled={username.length <= 0 || loading}>
          <span role="img" aria-label="Stars">
            ✨
          </span>{" "}
          {loading ? "Generating..." : "Generate!"}
        </button>
      </form>
    );
  };

  const _renderError = () => {
    return (
      <div className="App-error App-centered">
        <p>{error}</p>
      </div>
    );
  };

  const _renderDownloadAsJSON = () => {
    if (data === null) return;
    return (
      <a href="#" onClick={onDownloadJson}>
        <span role="img" aria-label="Bar Chart">
          📊
        </span>{" "}
        Download data as JSON for your own visualizations
      </a>
    );
  };

  const _renderSliders = (setR, setC, setS, setP) => {
    return (<div style={{display: "flex", flexDirection:"column"}}>
        <label>Rows: {rows}</label>
        <input type="range" min="0" max="10" value={rows} step="1" onChange={(event) => setR(parseInt(event.target.value))}></input>
        <label>Columns: {columns}</label>
        <input type="range" min="0" max="10" value={columns} step="1" onChange={(event) => setC(parseInt(event.target.value))}></input>
        <label>Size: {size}</label>
        <input type="range" min="5" max="200" value={size} step="5" onChange={(event) => setS(parseInt(event.target.value))}></input>
        <label>Padding: {padding}</label>
        <input type="range" min="50" max="150" value={padding} step="25" onChange={(event) => setP(parseInt(event.target.value))}></input>
      </div>)
  }

  return (
    <div className="App">
      <div className="App-center">
        <header className="App-header">
          {/* <div className="App-logo">
            <img src="/topguntocat.png" width={200} alt="Topguntocat" />
            <h1>GitHub Contributions Chart Generator</h1>
            <h4>All your contributions in one image!</h4>
          </div> */}
          {_renderForm()}
          {_renderSliders(setRows, setColumns, setSize, setPadding)}
          <ThemeSelector
            currentTheme={theme}
            onChangeTheme={(themeName) => setTheme(themeName)}
          />
          {/* {_renderGithubButton()} */}
          {/* <footer>
            <p>
              Not affiliated with GitHub Inc. Octocat illustration from{" "}
              <a href="https://octodex.github.com/topguntocat/" target="_blank">
                GitHub Octodex
              </a>
              .
            </p>
            {_renderDownloadAsJSON()}
            <div className="App-powered">
              <a
                href="https://vercel.com/?utm_source=github-contributions-chart&utm_campaign=oss"
                target="_blank"
              >
                <img src="/powered-by-vercel.svg" alt="Powered by Vercel" />
              </a>
            </div>
          </footer> */}
        </header>
        <section className="App-content" ref={contentRef}>
          {loading && _renderLoading()}
          {error !== null && _renderError()}
          {_renderGraphs()}
        </section>
      </div>
    </div>
  );
};

export default App;

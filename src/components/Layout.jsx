import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { MASCOTS } from "../config.js";
import { getSpriteUrl } from "../utils.js";
import Background from "./Background.jsx";

function Layout() {
  const [mascotKey, setMascotKey] = useState(() => {
    try { return localStorage.getItem("mascot") || "pikachu"; } catch { return "pikachu"; }
  });
  const mascot = MASCOTS.find((m) => m.key === mascotKey) || MASCOTS[0];

  useEffect(() => {
    document.documentElement.dataset.theme = mascot.key;
    try { localStorage.setItem("mascot", mascot.key); } catch { /* ignore */ }
  }, [mascot.key]);

  return (
    <>
      <Background mascot={mascot} />
      <div className="app">
        <header className="app-header">
          <span className="lens" aria-hidden="true" />
          <Link to="/" className="app-title-link">
            <h1>PokéDex Mini</h1>
          </Link>
          <div className="mascot-switch" role="group" aria-label="Background Pokémon">
            {MASCOTS.map((m) => (
              <button key={m.key} title={m.label} aria-label={m.label}
                aria-pressed={m.key === mascot.key}
                className={m.key === mascot.key ? "mascot-btn on" : "mascot-btn"}
                onClick={() => setMascotKey(m.key)}>
                <img src={getSpriteUrl(m.id)} alt="" width={30} height={30} />
              </button>
            ))}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        <footer className="app-footer">Data dari PokéAPI</footer>
      </div>
    </>
  );
}
export default Layout;

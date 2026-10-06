import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { ALL_TYPES, capitalize } from "../utils.js";
import { Z_DATA, MAX_MOVES } from "../gimmickData.js";
import TypeBadge from "./TypeBadge.jsx";
import TypeMatchup from "./TypeMatchup.jsx";

const TABS = ["Mega", "Z-Move", "Dynamax", "Gigantamax", "Terastal"];

function Forms({ species, match, empty }) {
  const [forms, setForms] = useState(null);
  const urls = species.varieties.filter((v) => match(v.pokemon.name)).map((v) => v.pokemon);

  useEffect(() => {
    let isCurrent = true;
    setForms(null);
    Promise.all(urls.map((p) => fetch(`${API_BASE_URL}/pokemon/${p.name}`).then((r) => r.json())))
      .then((list) => isCurrent && setForms(list))
      .catch(() => isCurrent && setForms([]));
    return () => { isCurrent = false; };
  }, [species.name]);

  if (urls.length === 0) return <p className="status">{empty}</p>;
  if (!forms) return <p className="status">Loading forms…</p>;
  return (
    <div className="form-grid">
      {forms.map((f) => (
        <Link key={f.name} to={`/pokemon/${f.name}`} className="form-card">
          <img src={f.sprites.other["official-artwork"].front_default || f.sprites.front_default}
            alt={f.name} width={110} height={110} />
          <strong>{capitalize(f.name.replace(/-/g, " "))}</strong>
          <span>{f.types.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}</span>
        </Link>
      ))}
    </div>
  );
}

function Gimmicks({ species, types }) {
  const [tab, setTab] = useState("Mega");
  const [tera, setTera] = useState(types[0]);
  useEffect(() => setTera(types[0]), [types.join(",")]);

  return (
    <div className="gimmicks">
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t}
            className={tab === t ? "tab active" : "tab"} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === "Mega" && (
        <Forms species={species} match={(n) => n.includes("-mega")}
          empty="No Mega Evolution for this Pokémon." />
      )}
      {tab === "Gigantamax" && (
        <Forms species={species} match={(n) => n.includes("-gmax")}
          empty="No Gigantamax form for this Pokémon." />
      )}
      {tab === "Z-Move" && (
        <ul className="gimmick-list">
          {types.map((t) => (
            <li key={t}><TypeBadge type={t} /> <b>{Z_DATA[t][1]}</b> with {Z_DATA[t][0]}</li>
          ))}
          <li className="note">Z-Moves turn one move of the matching type into a one-time powerful attack.</li>
        </ul>
      )}
      {tab === "Dynamax" && (
        <ul className="gimmick-list">
          {types.map((t) => (
            <li key={t}><TypeBadge type={t} /> <b>{MAX_MOVES[t]}</b></li>
          ))}
          <li className="note">Dynamax makes a Pokémon giant for 3 turns, and its moves become Max Moves.</li>
        </ul>
      )}
      {tab === "Terastal" && (
        <div>
          <p className="note">Terastallize into any type and the defenses change. Pick a Tera Type:</p>
          <div className="tera-picker">
            {ALL_TYPES.map((t) => (
              <button key={t} onClick={() => setTera(t)}
                className={t === tera ? "tera-btn on" : "tera-btn"}>
                <TypeBadge type={t} />
              </button>
            ))}
          </div>
          <TypeMatchup types={[tera]} />
        </div>
      )}
    </div>
  );
}
export default Gimmicks;

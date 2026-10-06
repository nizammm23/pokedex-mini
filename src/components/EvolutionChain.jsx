import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getIdFromUrl, capitalize, getSpriteUrl } from "../utils.js";

function trigger(details) {
  const d = details && details[0];
  if (!d) return "";
  if (d.min_level) return `Lv. ${d.min_level}`;
  if (d.item) return capitalize(d.item.name.replace(/-/g, " "));
  if (d.trigger.name === "trade") return "Trade";
  if (d.min_happiness) return "Friendship";
  return capitalize(d.trigger.name.replace(/-/g, " "));
}

function Node({ node, current }) {
  const id = getIdFromUrl(node.species.url);
  return (
    <div className="evo-branch">
      <Link to={`/pokemon/${node.species.name}`}
        className={`evo-card${node.species.name === current ? " evo-current" : ""}`}>
        <img src={getSpriteUrl(id)} alt={node.species.name} width={72} height={72} loading="lazy" />
        <span>{capitalize(node.species.name)}</span>
      </Link>
      {node.evolves_to.length > 0 && (
        <div className="evo-next">
          {node.evolves_to.map((child) => (
            <div key={child.species.name} className="evo-step">
              <span className="evo-arrow">→ {trigger(child.evolution_details)}</span>
              <Node node={child} current={current} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EvolutionChain({ chainUrl, current }) {
  const [chain, setChain] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    setChain(null);
    setError(null);
    fetch(chainUrl)
      .then((r) => { if (!r.ok) throw new Error("Couldn't load evolutions"); return r.json(); })
      .then((d) => isCurrent && setChain(d.chain))
      .catch((e) => isCurrent && setError(e.message));
    return () => { isCurrent = false; };
  }, [chainUrl]);

  if (error) return <p className="status status-error">{error}</p>;
  if (!chain) return <p className="status">Loading evolutions…</p>;
  if (chain.evolves_to.length === 0) return <p className="status">This Pokémon doesn't evolve.</p>;
  return <div className="evo"><Node node={chain} current={current} /></div>;
}
export default EvolutionChain;

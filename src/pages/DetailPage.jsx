import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize } from "../utils.js";
import TypeBadge from "../components/TypeBadge.jsx";
import TypeMatchup from "../components/TypeMatchup.jsx";
import EvolutionChain from "../components/EvolutionChain.jsx";
import Gimmicks from "../components/Gimmicks.jsx";

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [flavor, setFlavor] = useState("");
  const [species, setSpecies] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);
      setFlavor("");
      setSpecies(null);
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }
        const data = await response.json();
        if (isCurrent) setPokemon(data);
        // deskripsi Pokédex (opsional, kalau gagal diabaikan)
        try {
          const sp = await fetch(data.species.url);
          const spData = await sp.json();
          if (isCurrent) setSpecies(spData);
          const entry = spData.flavor_text_entries.find((f) => f.language.name === "en");
          if (isCurrent && entry) setFlavor(entry.flavor_text.replace(/[\n\f]/g, " "));
        } catch { /* ignore */ }
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }
    loadPokemon();
    return () => { isCurrent = false; };
  }, [name]);

  useEffect(() => {
    if (pokemon) document.title = `${capitalize(pokemon.name)} · PokéDex Mini`;
    return () => { document.title = "PokéDex Mini"; };
  }, [pokemon]);

  if (isLoading) return <p className="status">Loading {name}…</p>;
  if (error) {
    return (
      <div className="status">
        <p className="status-error">{error}</p>
        <Link to="/" className="back-link">← Back to list</Link>
      </div>
    );
  }

  const art = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Back to list</Link>
      <img src={art} alt={pokemon.name} width={200} height={200} />
      <h2>{capitalize(pokemon.name)} <small>#{String(pokemon.id).padStart(3, "0")}</small></h2>
      <p className="types">
        {pokemon.types.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
      </p>
      {flavor && <p className="flavor">{flavor}</p>}
      <p className="meta">Height {pokemon.height / 10} m · Weight {pokemon.weight / 10} kg</p>
      <ul className="stat-list">
        {pokemon.stats.map((s) => (
          <li key={s.stat.name}>
            <span className="stat-name">{s.stat.name}</span>
            <span className="stat-value">{s.base_stat}</span>
            <span className="stat-bar">
              <i style={{ width: `${Math.min(100, (s.base_stat / 150) * 100)}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <section className="section">
        <h3>Type matchup</h3>
        <TypeMatchup types={pokemon.types.map((t) => t.type.name)} />
      </section>
      {species && (
        <>
          <section className="section">
            <h3>Evolution</h3>
            <EvolutionChain chainUrl={species.evolution_chain.url} current={species.name} />
          </section>
          <section className="section">
            <h3>Gimmicks</h3>
            <Gimmicks species={species} types={pokemon.types.map((t) => t.type.name)} />
          </section>
        </>
      )}
      <div className="neighbors">
        {pokemon.id > 1 && <Link to={`/pokemon/${pokemon.id - 1}`}>← Previous</Link>}
        <Link to={`/pokemon/${pokemon.id + 1}`}>Next →</Link>
      </div>
    </div>
  );
}
export default DetailPage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, PAGE_SIZE } from "../config.js";
import { getIdFromUrl, capitalize, getSpriteUrl, getArtworkUrl } from "../utils.js";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    async function loadPokemons() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        if (isCurrent) {
          setPokemons(data.results);
          setCount(data.count);
        }
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }
    loadPokemons();
    return () => { isCurrent = false; };
  }, [offset]);

  if (error) {
    return <p className="status status-error">Couldn't load the list: {error}</p>;
  }

  const page = offset / PAGE_SIZE + 1;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <>
      {isLoading ? (
        <p className="status">Loading Pokémon…</p>
      ) : (
        <ul className="pokemon-list">
          {pokemons.map((pokemon) => {
            const id = getIdFromUrl(pokemon.url);
            return (
              <li key={pokemon.name} className="pokemon-list-item">
                <Link to={`/pokemon/${pokemon.name}`} className="pokemon-link">
                  <img
                    className="pokemon-sprite"
                    src={getSpriteUrl(id)}
                    alt={pokemon.name}
                    width={48}
                    height={48}
                    loading="lazy"
                    onError={(e) => {
                      const fallback = getArtworkUrl(id);
                      if (e.target.src !== fallback) e.target.src = fallback;
                    }}
                  />
                  <span className="pokemon-id">#{id.padStart(3, "0")}</span>
                  <span className="pokemon-name">{capitalize(pokemon.name)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <nav className="pager" aria-label="Pagination">
        <button disabled={offset === 0 || isLoading}
          onClick={() => setOffset(offset - PAGE_SIZE)}>Previous</button>
        <span>Page {page}{totalPages ? ` of ${totalPages}` : ""}</span>
        <button disabled={page >= totalPages || isLoading}
          onClick={() => setOffset(offset + PAGE_SIZE)}>Next</button>
      </nav>
    </>
  );
}
export default PokemonList;

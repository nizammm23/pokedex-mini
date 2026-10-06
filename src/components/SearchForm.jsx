import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.js";

function SearchForm() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const name = query.trim().toLowerCase();
    if (name === "") {
      setError("Type a Pokémon name first.");
      return;
    }
    setError(null);
    navigate(`/pokemon/${name}`);
  }

  async function handleRandom() {
    try {
      const res = await fetch(`${API_BASE_URL}/pokemon-species?limit=1`);
      const { count } = await res.json();
      navigate(`/pokemon/${1 + Math.floor(Math.random() * Math.min(count, 1025))}`);
    } catch {
      navigate(`/pokemon/${1 + Math.floor(Math.random() * 151)}`);
    }
  }

  return (
    <div className="search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a Pokémon by name…"
          className="search-input"
          aria-label="Pokémon name"
        />
        <button type="submit" className="search-button">Search</button>
        <button type="button" className="random-button" onClick={handleRandom}>
          Random
        </button>
      </form>
      {error && <p className="status status-error">{error}</p>}
    </div>
  );
}
export default SearchForm;

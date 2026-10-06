import { useState, useEffect } from "react";
import { ALL_TYPES, getTypeData } from "../utils.js";
import TypeBadge from "./TypeBadge.jsx";

const GROUPS = [
  ["4", "Takes 4× damage from"], ["2", "Takes 2× damage from"],
  ["0.5", "Resists (½×)"], ["0.25", "Resists strongly (¼×)"], ["0", "Immune to"],
];

function TypeMatchup({ types }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const key = types.join(",");

  useEffect(() => {
    let isCurrent = true;
    setData(null);
    setError(null);
    Promise.all(types.map(getTypeData))
      .then((list) => {
        const mult = Object.fromEntries(ALL_TYPES.map((t) => [t, 1]));
        const strong = new Set();
        list.forEach((d) => {
          const r = d.damage_relations;
          r.double_damage_from.forEach((t) => (mult[t.name] *= 2));
          r.half_damage_from.forEach((t) => (mult[t.name] *= 0.5));
          r.no_damage_from.forEach((t) => (mult[t.name] *= 0));
          r.double_damage_to.forEach((t) => strong.add(t.name));
        });
        if (isCurrent) setData({ mult, strong: [...strong] });
      })
      .catch((e) => isCurrent && setError(e.message));
    return () => { isCurrent = false; };
  }, [key]);

  if (error) return <p className="status status-error">{error}</p>;
  if (!data) return <p className="status">Loading matchups…</p>;

  return (
    <div className="matchup">
      {GROUPS.map(([m, label]) => {
        const items = ALL_TYPES.filter((t) => String(data.mult[t]) === m);
        if (items.length === 0) return null;
        return (
          <div key={m} className="matchup-row">
            <span className="matchup-label">{label}</span>
            <span>{items.map((t) => <TypeBadge key={t} type={t} />)}</span>
          </div>
        );
      })}
      <div className="matchup-row">
        <span className="matchup-label">Hits super effectively</span>
        <span>{data.strong.map((t) => <TypeBadge key={t} type={t} />)}</span>
      </div>
    </div>
  );
}
export default TypeMatchup;

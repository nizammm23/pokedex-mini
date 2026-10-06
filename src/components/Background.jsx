import { getAnimatedUrl } from "../utils.js";

const LANES = [
  { top: "14%", dur: 24, delay: -6, size: 70 },
  { top: "48%", dur: 32, delay: -20, size: 54 },
  { top: "80%", dur: 28, delay: -12, size: 62 },
];

function Background({ mascot }) {
  return (
    <div className="bg-layer" aria-hidden="true" key={mascot.key}>
      {LANES.map((l, i) => (
        <div key={i} className="bg-mascot"
          style={{ top: l.top, animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}>
          <img src={getAnimatedUrl(mascot.id)} alt=""
            style={{ height: l.size * mascot.scale, animationDelay: `${i * -0.7}s` }} />
        </div>
      ))}
    </div>
  );
}
export default Background;

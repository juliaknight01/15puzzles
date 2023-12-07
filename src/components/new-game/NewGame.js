import "./NewGame.css";

const NewGame = ({ reset }) => (
  <div className="button-wrapper">
    <button className="glowing-btn" onClick={reset}>
      <span className="glowing-txt">
        N<span className="faulty-letter">EW</span> GAME
      </span>
    </button>
  </div>
);

export default NewGame;

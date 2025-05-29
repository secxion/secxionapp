import "./Loader.css";

const Loader = ({ error, onRetry }) => {
  return (
      <div className="loader-container">
            <div className="loader"></div>
            <p className="loading-text"></p>
        </div>
  );
};

export default Loader;

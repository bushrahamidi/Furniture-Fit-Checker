import React from 'react';
import './FitResultPanel.css';

function FitResultPanel({ result, submitError }) {
  return (
    <section className="fit-result" aria-live="polite">
      <h2 className="fit-result__title">Fit Result</h2>

      {submitError && (
        <p className="fit-result__error" role="alert">{submitError}</p>
      )}

      {!submitError && !result && (
        <p className="fit-result__placeholder">
          Fill in the room and furniture details, then select Check Fit to see the result.
        </p>
      )}

      {!submitError && result && (
        <>
          <span className={`fit-result__status fit-result__status--${result.fits ? 'fits' : 'does-not-fit'}`}>
            {result.fits ? 'Fits' : 'Does not fit'}
          </span>

          <div className="fit-result__grid">
            <div className="fit-result__row">
              <span className="fit-result__label">Fit Score</span>
              <span className="fit-result__value fit-result__score">{result.score}</span>
            </div>
            <div className="fit-result__row">
              <span className="fit-result__label">Rating</span>
              <span className="fit-result__value">{result.rating}</span>
            </div>
            <div className="fit-result__row">
              <span className="fit-result__label">Width Percentage</span>
              <span className="fit-result__value">{result.widthPercentage.toFixed(1)}%</span>
            </div>
            <div className="fit-result__row">
              <span className="fit-result__label">Remaining Space</span>
              <span className="fit-result__value">{result.remainingWidth.toFixed(1)} in</span>
            </div>
          </div>

          <h3 className="fit-result__label">Warnings</h3>
          {result.warnings.length > 0 ? (
            <ul className="fit-result__warnings">
              {result.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : (
            <p className="fit-result__placeholder">No warnings.</p>
          )}

          <h3 className="fit-result__label">Designer Recommendation</h3>
          <p className="fit-result__recommendation">{result.recommendation}</p>
        </>
      )}
    </section>
  );
}

export default FitResultPanel;

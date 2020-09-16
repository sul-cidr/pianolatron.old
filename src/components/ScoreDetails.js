import React from "react";
import PropTypes from "prop-types";

const ScoreDetails = ({
  rollMetadata: { TITLE, PERFORMER, COMPOSER, LABEL, PURL, CALLNUM },
}) => (
  <div id="score-details">
    <ul>
      <li>
        <strong>Title:</strong> {TITLE}
      </li>
      <li>
        <strong>Performer:</strong> {PERFORMER}
      </li>
      <li>
        <strong>Composer:</strong> {COMPOSER}
      </li>
      <li>
        <strong>Label:</strong> {LABEL}
      </li>
      <li>
        <strong>PURL:</strong> <a href={PURL}>{PURL}</a>
      </li>
      <li>
        <strong>Call No:</strong> {CALLNUM}
      </li>
    </ul>
  </div>
);

ScoreDetails.propTypes = {
  rollMetadata: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default ScoreDetails;

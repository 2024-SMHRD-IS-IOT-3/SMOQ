import React from 'react';
import { RiCheckLine } from "react-icons/ri";
import { FiChevronsDown } from "react-icons/fi";

function ProgressTimeline({ steps }) {
  return (
    <div className="progress-timeline">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step ${step.status}`}>
            <span className="checkmark">
              {step.status === 'completed' ? <RiCheckLine id='check' /> : step.status === 'current' ? <FiChevronsDown id='down' /> : ''}
            </span>
          </div>
          {index !== steps.length - 1 && <div key={`line-${index}`} className="line"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ProgressTimeline;

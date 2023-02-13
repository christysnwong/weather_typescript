import React from "react";
import "./LoadingSpinner.css";


function LoadingSpinner() {
  return (
    <div className="text-center">
      <span className="LoadingSpinner" data-testid="LoadingSpinner"></span>
    </div>
  );
}

export default LoadingSpinner;

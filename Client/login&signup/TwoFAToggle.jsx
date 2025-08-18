import React from "react";

export default function TwoFAToggle({ enabled, onChange }) {
  return (
    <button className="btn btn--primary mt-1" onClick={onChange}>
      {enabled ? "Disable 2FA" : "Enable 2FA"}
    </button>
  );
}

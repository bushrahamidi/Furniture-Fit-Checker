import React from 'react';
import './FormFields.css';

function RoomForm({ room, errors, touched, onChange, onBlur }) {
  return (
    <fieldset className="form-section">
      <legend className="form-section__title">Room Information</legend>

      <div className="form-field">
        <label className="form-field__label" htmlFor="room-name">Room Name</label>
        <input
          id="room-name"
          className="form-field__control"
          type="text"
          value={room.name}
          onChange={(event) => onChange('name', event.target.value)}
          onBlur={() => onBlur('name')}
          aria-invalid={touched.name && Boolean(errors.name)}
          aria-describedby={errors.name ? 'room-name-error' : undefined}
        />
        {touched.name && errors.name && (
          <span id="room-name-error" className="form-field__error" role="alert">{errors.name}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="room-length">Room Length (in)</label>
        <input
          id="room-length"
          className="form-field__control"
          type="number"
          inputMode="decimal"
          min="1"
          value={room.length}
          onChange={(event) => onChange('length', event.target.value)}
          onBlur={() => onBlur('length')}
          aria-invalid={touched.length && Boolean(errors.length)}
          aria-describedby={errors.length ? 'room-length-error' : undefined}
        />
        {touched.length && errors.length && (
          <span id="room-length-error" className="form-field__error" role="alert">{errors.length}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="room-width">Room Width (in)</label>
        <input
          id="room-width"
          className="form-field__control"
          type="number"
          inputMode="decimal"
          min="1"
          value={room.width}
          onChange={(event) => onChange('width', event.target.value)}
          onBlur={() => onBlur('width')}
          aria-invalid={touched.width && Boolean(errors.width)}
          aria-describedby={errors.width ? 'room-width-error' : undefined}
        />
        {touched.width && errors.width && (
          <span id="room-width-error" className="form-field__error" role="alert">{errors.width}</span>
        )}
      </div>
    </fieldset>
  );
}

export default RoomForm;

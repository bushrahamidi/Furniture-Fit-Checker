import React, { useState } from 'react';
import RoomForm from './components/RoomForm.jsx';
import FurnitureForm from './components/FurnitureForm.jsx';
import FitResultPanel from './components/FitResultPanel.jsx';
import { checkFit, getRequestErrorMessage } from './services/apiClient.js';
import { FURNITURE_TYPES, validateRoomFields, validateFurnitureFields } from './utils/validation.js';
import './styles/tokens.css';
import './App.css';

const initialRoom = { name: '', length: '', width: '' };
const initialFurniture = { name: '', type: '', width: '', depth: '' };
const allTouched = { name: true, length: true, width: true, type: true, depth: true };

function App() {
  const [room, setRoom] = useState(initialRoom);
  const [furniture, setFurniture] = useState(initialFurniture);
  const [roomErrors, setRoomErrors] = useState({});
  const [furnitureErrors, setFurnitureErrors] = useState({});
  const [roomTouched, setRoomTouched] = useState({});
  const [furnitureTouched, setFurnitureTouched] = useState({});
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleRoomChange(field, value) {
    const nextRoom = { ...room, [field]: value };
    setRoom(nextRoom);
    if (roomTouched[field]) {
      setRoomErrors(validateRoomFields(nextRoom));
    }
  }

  function handleRoomBlur(field) {
    setRoomTouched((prev) => ({ ...prev, [field]: true }));
    setRoomErrors(validateRoomFields(room));
  }

  function handleFurnitureChange(field, value) {
    const nextFurniture = { ...furniture, [field]: value };
    setFurniture(nextFurniture);
    if (furnitureTouched[field]) {
      setFurnitureErrors(validateFurnitureFields(nextFurniture));
    }
  }

  function handleFurnitureBlur(field) {
    setFurnitureTouched((prev) => ({ ...prev, [field]: true }));
    setFurnitureErrors(validateFurnitureFields(furniture));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextRoomErrors = validateRoomFields(room);
    const nextFurnitureErrors = validateFurnitureFields(furniture);

    setRoomErrors(nextRoomErrors);
    setFurnitureErrors(nextFurnitureErrors);
    setRoomTouched(allTouched);
    setFurnitureTouched(allTouched);

    if (Object.keys(nextRoomErrors).length > 0 || Object.keys(nextFurnitureErrors).length > 0) {
      setResult(null);
      setSubmitError('');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const data = await checkFit(
        { name: room.name.trim(), length: Number(room.length), width: Number(room.width) },
        {
          name: furniture.name.trim(),
          type: furniture.type,
          width: Number(furniture.width),
          depth: Number(furniture.depth),
        },
      );
      setResult(data.fit);
    } catch (error) {
      setResult(null);
      setSubmitError(getRequestErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>DesignFit</h1>
        <p>Furniture Fit Checker</p>
      </header>

      <main className="app__main">
        <form className="app__form" onSubmit={handleSubmit} noValidate>
          <RoomForm
            room={room}
            errors={roomErrors}
            touched={roomTouched}
            onChange={handleRoomChange}
            onBlur={handleRoomBlur}
          />
          <FurnitureForm
            furniture={furniture}
            errors={furnitureErrors}
            touched={furnitureTouched}
            furnitureTypes={FURNITURE_TYPES}
            onChange={handleFurnitureChange}
            onBlur={handleFurnitureBlur}
          />
          <button type="submit" className="app__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Checking…' : 'Check Fit'}
          </button>
        </form>

        <FitResultPanel result={result} submitError={submitError} />
      </main>
    </div>
  );
}

export default App;
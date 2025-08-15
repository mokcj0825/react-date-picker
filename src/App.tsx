import { useState, useEffect } from 'react';
import Datepicker from "./datepicker/Datepicker.tsx";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [languageCode] = useState<string>('en');

  useEffect(() => {
    // Set initial language code in localStorage
    localStorage.setItem('languageCode', languageCode);
  }, [languageCode]);


  return (
    <>

      <Datepicker
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onDateSelected={(date) => console.log('Date selected:', date)}
        languageCodeKey="key_ui_language"
        weekStartsOn={1}
        isDarkMode={true}
        disabled={false}
      />
      
      <div style={{position: 'fixed', right: '10px', top: '10px'}}>
        <Datepicker
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onDateSelected={(date) => console.log('Date selected from picker 2:', date)}
        languageCodeKey="another_language_code"
        weekStartsOn={1}
        isDarkMode={false}
        disabled={false}/>
      </div>

      <div style={{position: 'fixed', right: '30%', top: '10px'}}>
        <Datepicker
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onDateSelected={(date) => console.log('Date selected from picker middle:', date)}
        languageCodeKey="another_language_code2"
        weekStartsOn={1}
        isDarkMode={false}
        disabled={false}/>
      </div>
    </>
  );
}

export default App;

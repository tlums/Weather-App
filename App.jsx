import { useState, useEffect } from "react"; // import the two hooks we need from React
import WeatherCard from "./WeatherCard";
import ForecastCard from "./ForecastCard";
import "./App.css"; // global styles, no module needed for App-level CSS
import PlasmaWave from "./PlasmaWave";
import GradientText from "./GradientText";
import BorderGlow from "./BorderGlow";
const API_KEY = "32bbe5510120b859c8c076c0cacdf94c"; // our OpenWeatherMap key, stored outside the component so it never changes

export default function App() { // the main component — "export default" means other files can import it

  // --- STATE ---
  const [city, setCity] = useState("Edmonton");   // tracks what's typed in the search box, starts as "Edmonton"
  const [weather, setWeather] = useState(null);   // holds the weather data from the API, starts as nothing
  const [forecast, setForecast] = useState([]);  // array of forecast days, starts empty
  const [loading, setLoading] = useState(false);  // true while waiting for the API, false otherwise
  const [error, setError] = useState("");         // holds an error message if the fetch fails, starts empty






  // --- EFFECT ---
  useEffect(() => {   // useEffect runs code as a side effect of rendering
    fetchWeather();   // call fetchWeather once when the app first loads
  }, []);             // the empty [] means "only run this once" — no dependencies to watch

async function fetchWeather() {
    setLoading(true);
    setError("");
    try {
      // fetch both endpoints at the same time instead of one after the other
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      ]);

      if (!weatherRes.ok) throw new Error("City not found");

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(processForecast(forecastData)); // process the raw forecast into a clean array

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }




  // --- PROCESS FORECAST ---
  function processForecast(data) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = {}; // use an object to group API entries by day

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);     // API gives seconds, JS needs milliseconds
      const key = date.toDateString();            // e.g. "Wed May 21 2026" — unique key per day
      const dayName = dayNames[date.getDay()];   // get "Mon", "Tue" etc.

      if (!days[key]) {
        // first time we see this day — create an entry for it
        days[key] = { day: dayName, temps: [], icon: item.weather[0].icon, description: item.weather[0].description };
      }

      days[key].temps.push(item.main.temp); // collect all temps for this day so we can find hi/lo
    });

    const today = new Date().toDateString(); // we'll skip today since WeatherCard already shows it

    return Object.values(days)
      .filter((d) => {
        // remove today from the forecast
        const key = Object.keys(days).find((k) => days[k] === d);
        return key !== today;
      })
      .slice(0, 5) // take only the next 5 days
      .map((d) => ({
        day: d.day,
        high: Math.round(Math.max(...d.temps)), // spread the temps array into Math.max to find the highest
        low: Math.round(Math.min(...d.temps)),  // same for lowest
        icon: d.icon,
        description: d.description,
      }));
  }







  // --- RENDER ---
  return (
    <>
    {/* background layer — PlasmaWave fills the whole screen behind everything */}
    <div className="background">
      <PlasmaWave
        colors={["#A855F7", "#06B6D4"]}
        speed1={0.05}
        speed2={0.025}
        focalLength={1.3}
        bend1={1}
        bend2={0.4}
        dir2={1}
        rotationDeg={0}
      />
    </div>

    {/* content layer — sits on top of the background */}
    <div className="content">
    <div className='container'>
      <div style={{ width: "100%", textAlign: "center" }}>
        <GradientText
          colors={["#e8e7eb", "#7a09e5"]}
          animationSpeed={20}
          showBorder={false}
          className="luckiest-guy-regular"
          >
          Weather
        </GradientText>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <BorderGlow
          edgeSensitivity={0}
          glowColor="40 80 80"
          backgroundColor="transparent"
          borderRadius={10}
          glowRadius={10}
          glowIntensity={2.5}
          coneSpread={39}
          animated
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <div className="search-row">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
              placeholder="Enter a city..."
            />
            <button onClick={fetchWeather}>Search</button>
          </div>
        </BorderGlow>
      </div>

      {loading && <p>Loading...</p>}  {/* only renders if loading is true */}
      {error && <p>{error}</p>}       {/* only renders if error is a non-empty string */}

      {weather && <WeatherCard weather={weather}/>} {/* pass the weather state down as a prop */}

       {/* map over the forecast array — each day becomes a ForecastCard component */}
      {forecast.length > 0 && (
        <div>
          <h3>5-Day Forecast</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            {forecast.map((day) => (
              // key is required by React whenever you render a list — it helps React track which item is which
              <ForecastCard
                key={day.day}
                day={day.day}
                high={day.high}
                low={day.low}
                icon={day.icon}
                description={day.description}
              />
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
    </>  /* <> is a React Fragment — lets us return two sibling divs without adding an extra wrapper to the DOM */
  );
}

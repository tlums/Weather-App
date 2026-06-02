import styles from "./WeatherCard.module.css";
import ElectricBorder from "./ElectricBorder";
import { WeatherIcon } from "./AnimatedWeatherIcons";

// this is a child component — it doesn't fetch anything, it just displays what it's given
export default function WeatherCard({ weather }) { // "weather" is a prop passed down from App.jsx

  const temp = Math.round(weather.main.temp);           // pull temp out of the prop and round it
  const description = weather.weather[0].description;   // grab the description from the array
  const city = weather.name;                            // city name
  const country = weather.sys.country;                  // country code e.g. "CA"
  const humidity = weather.main.humidity;               // humidity percentage
  const wind = Math.round(weather.wind.speed * 3.6);    // API gives m/s, multiply by 3.6 to get km/h
  const icon = weather.weather[0].icon;                 // icon code e.g. "01d"

  return (
    <ElectricBorder
      color="#4ae0e8"
      speed={1.3}
      chaos={0.02}
      style={{ borderRadius: 16, marginBottom: "1.5rem" }}
    >
    <div className={styles.card}> {/* styles.card maps to .card in the CSS file */}
        <WeatherIcon code={icon} size={80} />
        <div>
            <div className={styles.location}>{city}, {country}</div>
            <div className={styles.temp}>{temp}°C</div>
            <div className={styles.description}>{description}</div>
            <div className={styles.stats}>
            <div>
                <div className={styles["stat-label"]}>Humidity</div> {/* bracket notation for hyphenated class names */}
                <div className={styles["stat-value"]}>{humidity}%</div>
            </div>
            <div>
                <div className={styles["stat-label"]}>Wind</div>
                <div className={styles["stat-value"]}>{wind} km/h</div>
            </div>
            </div>
        </div>
        </div>
    </ElectricBorder>
  );
}
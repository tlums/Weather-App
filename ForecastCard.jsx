import styles from "./ForecastCard.module.css";
import ElectricBorder from "./ElectricBorder";
import { WeatherIcon } from "./AnimatedWeatherIcons";

// this component receives a single day's forecast data and displays it
export default function ForecastCard({ day, high, low, icon, description }) { // each piece of data is its own prop

  return (
    <ElectricBorder
      color="#4ae0e8"
      speed={1.3}
      chaos={0.02}
      style={{ borderRadius: 12, flex: 1 }}
    >
        <div className={styles.card}>
        <div className={styles.day}>{day}</div>
        <WeatherIcon code={icon} size={48} />
        <div className={styles.high}>{high}°C</div>
        <div className={styles.low}>{low}°C</div>
        </div>
    </ElectricBorder>
  );
}
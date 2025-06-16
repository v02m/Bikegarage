// src/utils/bikeCalculations.ts

// Константы
const PI = Math.PI; // Число Пи
const INCHES_PER_MM = 0.0393701; // 1 мм = 0.0393701 дюймов
const METERS_PER_KM = 1000; // 1 км = 1000 метров
const SECONDS_PER_HOUR = 3600; // 1 час = 3600 секунд

// Интерфейс для результатов расчета одной комбинации передач
export interface GearCalculation {
  frontTeeth: number;
  rearTeeth: number;
  gearRatio: number; // Передаточное отношение
  development: number; // Развитие (дистанция за один оборот педалей), метры/оборот
  gearInches: number; // Дюймы за один оборот педалей (Gear Inches)
  speedKmh: number; // Скорость при заданном каденсе, км/ч
  speedMph: number; // Скорость при заданном каденсе, миль/ч
}

// Интерфейс для всех результатов расчета
export interface AllGearCalculations {
  chainrings: number[];
  cassette: number[];
  wheelCircumferenceMm: number; // Окружность колеса в мм
  cadence: number; // Каденс в об/мин
  results: GearCalculation[]; // Массив результатов для всех комбинаций
}

/**
 * Рассчитывает окружность колеса на основе диаметра.
 * @param wheelDiameterMm Диаметр колеса в миллиметрах.
 * @returns Окружность колеса в миллиметрах.
 */
export const calculateWheelCircumference = (
  wheelDiameterMm: number
): number => {
  return wheelDiameterMm * PI;
};

/**
 * Рассчитывает передаточное отношение.
 * @param frontTeeth Количество зубьев передней звезды.
 * @param rearTeeth Количество зубьев задней звезды.
 * @returns Передаточное отношение (front / rear).
 */
export const calculateGearRatio = (
  frontTeeth: number,
  rearTeeth: number
): number => {
  if (rearTeeth === 0) {
    // Избегаем деления на ноль
    return 0; // Или можно бросить ошибку, в зависимости от желаемого поведения
  }
  return frontTeeth / rearTeeth;
};

/**
 * Рассчитывает развитие (Development) - расстояние, пройденное за один оборот педалей.
 * @param gearRatio Передаточное отношение.
 * @param wheelCircumferenceMm Окружность колеса в миллиметрах.
 * @returns Расстояние в метрах за один оборот педалей.
 */
export const calculateDevelopment = (
  gearRatio: number,
  wheelCircumferenceMm: number
): number => {
  // Развитие = (передаточное отношение) * (окружность колеса в мм)
  // Результат в мм, делим на 1000, чтобы получить метры
  return (gearRatio * wheelCircumferenceMm) / 1000;
};

/**
 * Рассчитывает Gear Inches - устаревший, но часто используемый показатель.
 * @param gearRatio Передаточное отношение.
 * @param wheelDiameterMm Диаметр колеса в миллиметрах.
 * @returns Gear Inches (дюймы за один оборот педалей).
 */
export const calculateGearInches = (
  gearRatio: number,
  wheelDiameterMm: number
): number => {
  // Gear Inches = (передаточное отношение) * (диаметр колеса в дюймах)
  // Переводим диаметр из мм в дюймы
  const wheelDiameterInches = wheelDiameterMm * INCHES_PER_MM;
  return gearRatio * wheelDiameterInches;
};

/**
 * Рассчитывает скорость.
 * @param development Расстояние за один оборот педалей в метрах.
 * @param cadence Каденс (оборотов педалей в минуту).
 * @returns Скорость в км/ч.
 */
export const calculateSpeedKmh = (
  development: number,
  cadence: number
): number => {
  // Расстояние за 1 минуту (метры/мин) = development (метры/оборот) * cadence (обороты/мин)
  const speedMetersPerMinute = development * cadence;
  // Расстояние за 1 час (метры/час) = speedMetersPerMinute * 60
  const speedMetersPerHour = speedMetersPerMinute * 60;
  // Скорость в км/ч = speedMetersPerHour / 1000
  return speedMetersPerHour / METERS_PER_KM;
};

/**
 * Рассчитывает скорость в милях/ч.
 * @param speedKmh Скорость в км/ч.
 * @returns Скорость в милях/ч.
 */
export const convertKmhToMph = (speedKmh: number): number => {
  return speedKmh * 0.621371; // 1 км = 0.621371 миль
};

/**
 * Главная функция для выполнения всех расчетов передач.
 * @param chainrings Массив зубьев передних звезд.
 * @param cassette Массив зубьев задних звезд.
 * @param wheelDiameterMm Диаметр колеса в миллиметрах.
 * @param cadence Каденс (оборотов педалей в минуту).
 * @returns Объект AllGearCalculations со всеми результатами.
 */
export const performGearCalculations = (
  chainrings: number[],
  cassette: number[],
  wheelDiameterMm: number,
  cadence: number
): AllGearCalculations => {
  const allResults: GearCalculation[] = [];
  const wheelCircumferenceMm = calculateWheelCircumference(wheelDiameterMm);

  chainrings.forEach((frontTeeth) => {
    cassette.forEach((rearTeeth) => {
      const gearRatio = calculateGearRatio(frontTeeth, rearTeeth);
      const development = calculateDevelopment(gearRatio, wheelCircumferenceMm);
      const gearInches = calculateGearInches(gearRatio, wheelDiameterMm);
      const speedKmh = calculateSpeedKmh(development, cadence);
      const speedMph = convertKmhToMph(speedKmh);

      allResults.push({
        frontTeeth,
        rearTeeth,
        gearRatio: parseFloat(gearRatio.toFixed(2)), // Округляем до 2 знаков после запятой
        development: parseFloat(development.toFixed(2)), // Округляем до 2 знаков
        gearInches: parseFloat(gearInches.toFixed(2)), // Округляем до 2 знаков
        speedKmh: parseFloat(speedKmh.toFixed(1)), // Округляем до 1 знака
        speedMph: parseFloat(speedMph.toFixed(1)), // Округляем до 1 знака
      });
    });
  });

  // Сортируем результаты по передаточному отношению (от самого низкого к самому высокому)
  allResults.sort((a, b) => a.gearRatio - b.gearRatio);

  return {
    chainrings,
    cassette,
    wheelCircumferenceMm: parseFloat(wheelCircumferenceMm.toFixed(2)),
    cadence,
    results: allResults,
  };
};

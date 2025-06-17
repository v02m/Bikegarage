// src/utils/bikeCalculations.ts

export interface GearCalculation {
  frontTeeth: number;
  rearTeeth: number;
  gearRatio: number; // Передаточное отношение (передние/задние)
  development: number; // Развитие (метры за один оборот педалей)
  speedKmh: number; // Скорость в км/ч
  gearInches: number; // Gear Inches
}

export interface AllGearCalculations {
  chainrings: number[];
  cassette: number[];
  wheelDiameter: number; // Диаметр колеса в мм
  wheelCircumferenceMm: number; // Длина окружности колеса в мм
  cadence: number; // Каденс в об/мин
  results: GearCalculation[]; // Массив всех комбинаций передач
}

/**
 * Выполняет расчеты для всех комбинаций передач.
 * @param chainrings Массив чисел зубьев передних звезд.
 * @param cassette Массив чисел зубьев задних звезд.
 * @param wheelDiameterMm Диаметр колеса в миллиметрах (ETRTO диаметр обода + 2 * высота покрышки).
 * @param cadenceRpm Каденс в оборотах в минуту.
 * @returns Объект AllGearCalculations с полной информацией.
 */
export function performGearCalculations(
  chainrings: number[],
  cassette: number[],
  wheelDiameterMm: number,
  cadenceRpm: number
): AllGearCalculations {
  const results: GearCalculation[] = [];

  // Константа PI
  const PI = Math.PI;

  // Длина окружности колеса в мм
  const wheelCircumferenceMm = wheelDiameterMm * PI;

  chainrings.forEach((frontTeeth) => {
    cassette.forEach((rearTeeth) => {
      const gearRatio = frontTeeth / rearTeeth; // Передаточное отношение

      // Развитие (development) в метрах
      // (длина окружности колеса в мм * передаточное отношение) / 1000 для перевода в метры
      const development = (wheelCircumferenceMm * gearRatio) / 1000;

      // Скорость в км/ч
      // (развитие в м/об * каденс об/мин * 60 мин/час) / 1000 м/км
      const speedKmh = (development * cadenceRpm * 60) / 1000;

      // Gear Inches (передаточное отношение * диаметр колеса в дюймах)
      // wheelDiameterMm / 25.4 для перевода мм в дюймы
      const wheelDiameterInches = wheelDiameterMm / 25.4;
      const gearInches = gearRatio * wheelDiameterInches;

      results.push({
        frontTeeth: frontTeeth,
        rearTeeth: rearTeeth,
        gearRatio: parseFloat(gearRatio.toFixed(2)),
        development: parseFloat(development.toFixed(2)),
        speedKmh: parseFloat(speedKmh.toFixed(2)),
        gearInches: parseFloat(gearInches.toFixed(2)),
      });
    });
  });

  // Сортируем результаты по передаточному отношению для лучшего отображения на графике
  results.sort((a, b) => a.gearRatio - b.gearRatio);

  return {
    chainrings: chainrings,
    cassette: cassette,
    wheelDiameter: wheelDiameterMm,
    wheelCircumferenceMm: parseFloat(wheelCircumferenceMm.toFixed(2)),
    cadence: cadenceRpm,
    results: results,
  };
}

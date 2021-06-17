import BigNumber from "bignumber.js";

function findNearest(value: number, keys: number[]) {
  const nearest = keys.reduce((a, b) => {
    const aDiff = Math.abs(a - value);
    const bDiff = Math.abs(b - value);

    if (aDiff === bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
  return nearest;
}

const getBounds = (data: {[key: number]: number}) => {
  const sortedVolumes = Object.values(data).sort((a, b) => a - b);
  return [sortedVolumes[0], sortedVolumes[sortedVolumes.length - 1]];
}

/*
Splits each sample into divisions based on `split` parameter
*/
export const binData = (data: {[key: number]: number}, binCount: number, split = 2) => {
    const [minVolume, maxVolume] = getBounds(data);

    const sampleIntervals = Object.keys(data).map((n) => +n);
    const values = Object.values(data);

    const newData: any = {};
    for (let i=0; i < values.length; i++) {
      newData[sampleIntervals[i]] = values[i];
    }

    const lastSample = Math.max(...sampleIntervals);
    const firstSample = Math.min(...sampleIntervals);

    const sampleRange = lastSample - firstSample;

    const sampleInterval = sampleRange / (sampleIntervals.length - 1);

    const binSize = +((lastSample - firstSample + sampleInterval) / binCount).toFixed(12);
    const s = Math.floor(binSize / sampleInterval);
    const obj: {[key: number]: number} = {};
    for (let i = firstSample; i < lastSample + sampleInterval;) {
      const volumeSamples = [];
      
      const nearest = findNearest(i, sampleIntervals);
      let value;

      if (s === 0) {
        value = (newData[nearest] - minVolume) / (maxVolume - minVolume);
      } else {
        for (let j = i * sampleInterval; j <= i + s * sampleInterval; j += sampleInterval) {
          volumeSamples.push((newData[nearest] - minVolume) / (maxVolume - minVolume));
        }
        value = Math.max(...volumeSamples);
      }
      let z = 0

      for (let k = i; k < +(i + binSize).toFixed(12);) {
        obj[k] = value;
        k = +(k + binSize/split).toFixed(12);
        z++;
      }

      i = +(i + binSize).toFixed(12);
    }
    return obj;
  }
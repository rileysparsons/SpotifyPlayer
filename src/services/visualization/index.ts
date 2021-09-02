import BigNumber from "bignumber.js";

function findNearest(value: BigNumber, keys: BigNumber[]) {
  const nearest = keys.reduce((a, b) => {
    const aDiff = a.minus(value).absoluteValue();
    const bDiff = b.minus(value).absoluteValue();

    if (aDiff.isEqualTo(bDiff)) {
      return a.isLessThan(b) ? a : b;
    } else {
      return bDiff.isLessThan(aDiff) ? b : a;
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
    let [_minVolume, _maxVolume] = getBounds(data);
    const minVolume = new BigNumber(_minVolume);
    const maxVolume = new BigNumber(_maxVolume);

    const sampleIntervals = Object.keys(data).map((n) => new BigNumber(n)).sort((a, b) => a.minus(b) as any);

    const values = Object.values(data);

    const newData: any = {};
    for (let i=0; i < values.length; i++) {
      newData[sampleIntervals[i].toString()] = new BigNumber(values[i]);
    }

    const lastSample = sampleIntervals[sampleIntervals.length - 1];
    const firstSample = sampleIntervals[0];

    const sampleRange = lastSample.minus(firstSample).plus(sampleIntervals[1].minus(firstSample));

    const sampleInterval = sampleRange.dividedBy(sampleIntervals.length);

    const binSize = lastSample.minus(firstSample).plus(sampleInterval).dividedBy(binCount);
    
    const s = binSize.dividedBy(sampleInterval).integerValue(BigNumber.ROUND_FLOOR);
    const obj: {[key: string]: number} = {};

    for (let i = new BigNumber(0); i.isLessThan(binCount);) {

      const binStart = firstSample.plus(binSize.multipliedBy(i));

      const volumeSamples = [];
      
      const nearest = findNearest(binStart, sampleIntervals);

      let value;

      let j = nearest

      while (j.isLessThan(binStart.plus(binSize))) {
        volumeSamples.push(
          (newData[nearest.toString()].minus(minVolume)).dividedBy(maxVolume.minus(minVolume))
        );
        j = sampleIntervals[sampleIntervals.indexOf(j) +  1];

        if (j == null) {
          break;
        }
      }

      value = BigNumber.max(...volumeSamples);

      for (let k = binStart; k.isLessThan(binStart.plus(binSize));) {
        obj[k.toString()] = value.toNumber();
        k = k.plus(binSize.dividedBy(split));
      }
      i = i.plus(1);
    }
    return obj;
  }
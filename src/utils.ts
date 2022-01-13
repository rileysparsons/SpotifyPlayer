import React from "react";

export function isElementOverflowing(element: any) {
    var overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;

    return (overflowX || overflowY);
}

export function convertSecondsToMinutes (seconds: number){

    const pad = (n: number, width: number, z = '0') => {
      const _n =  n + '';
      return _n.length >= width ? _n : new Array(width - _n.length + 1).join(z) + n;
    }

    return `${pad(Math.floor(seconds / 60), 2)}:${pad(Math.round(seconds) % 60, 2)}`
  }

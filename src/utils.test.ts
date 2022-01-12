import { convertSecondsToMinutes } from "./utils";

it('Should provide correct minute notation', () => {
    expect(convertSecondsToMinutes(31)).toEqual('00:31');
    expect(convertSecondsToMinutes(61)).toEqual('01:01');
    expect(convertSecondsToMinutes(45)).toEqual('00:45');
    expect(convertSecondsToMinutes(105)).toEqual('01:45');
    expect(convertSecondsToMinutes(500)).toEqual('08:20');
});
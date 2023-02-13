import {convertTemp, convertPressure, convertVis, convertWindDeg, convertWindSpeed, units} from "./util"

describe("convertTemp", () => {
  it("converts to imperial units correctly", () => {
    expect(convertTemp("imperial", 0)).toEqual(32);
    expect(convertTemp("imperial", 20)).toEqual(68);
  });

  it("converts to metric units correctly", () => {
    expect(convertTemp("metric", 32)).toEqual(32);
    expect(convertTemp("metric", 68)).toEqual(68);
  });
});

describe("convertPressure", () => {
  it("converts to imperial units correctly", () => {
    expect(convertPressure("imperial", 100)).toEqual(3);
    expect(convertPressure("imperial", 500)).toEqual(15);
  });

  it("converts to metric units correctly", () => {
    expect(convertPressure("metric", 3)).toEqual(3);
    expect(convertPressure("metric", 15)).toEqual(15);
  });
});

describe("convertVis", () => {
  it("converts to imperial units correctly", () => {
    expect(convertVis("imperial", 1000)).toEqual(1);
    expect(convertVis("imperial", 5000)).toEqual(3);
  });

  it("converts to metric units correctly", () => {
    expect(convertVis("metric", 500)).toEqual(1);
    expect(convertVis("metric", 3000)).toEqual(3);
  });
});

describe("convertWindSpeed", () => {
  it("converts to imperial units correctly", () => {
    expect(convertWindSpeed("imperial", 10)).toEqual(6);
    expect(convertWindSpeed("imperial", 50)).toEqual(31);
  });

  it("converts to metric units correctly", () => {
    expect(convertWindSpeed("metric", 6.21)).toEqual(6);
    expect(convertWindSpeed("metric", 31.07)).toEqual(31);
  });
});

describe("convertWindDeg", () => {
  it("returns the correct wind direction", () => {
    expect(convertWindDeg("imperial", 0)).toEqual("N");
    expect(convertWindDeg("imperial", 22.5)).toBe("NNE");
    expect(convertWindDeg("imperial", 90)).toEqual("E");
    expect(convertWindDeg("imperial", 112.5)).toBe("ESE");
    expect(convertWindDeg("imperial", 180)).toEqual("S");
    expect(convertWindDeg("imperial", 270)).toEqual("W");
    expect(convertWindDeg("imperial", 292.5)).toBe("WNW");
    expect(convertWindDeg("imperial", 337.5)).toBe("NNW");
    expect(convertWindDeg("imperial", 360)).toBe("N");
    expect(convertWindDeg("imperial", 720)).toBe("N");
  });
});

describe("units", () => {
  it("returns metric units correctly", () => {
    expect(units("metric", "temp")).toEqual("°C");
    expect(units("metric", "pressure")).toEqual("mbar");
    expect(units("metric", "vis")).toEqual("km");
    expect(units("metric", "windSpeed")).toEqual("m/s");
  });

  it("returns imperial units correctly", () => {
    expect(units("imperial", "temp")).toEqual("°F");
    expect(units("imperial", "pressure")).toEqual("inches");
    expect(units("imperial", "vis")).toEqual("miles");
    expect(units("imperial", "windSpeed")).toEqual("mph");
  })
})


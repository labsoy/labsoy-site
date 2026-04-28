const sortUrls = (entries) =>
  Object.entries(entries)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);

const heroGlob = import.meta.glob("../assets/images/hero/*.png", {
  eager: true,
  import: "default"
});

const backgroundGlob = import.meta.glob("../assets/images/background/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default"
});

const computerBgGlob = import.meta.glob("../assets/images/computer-bg/*.png", {
  eager: true,
  import: "default"
});

export const getComputerBgFrameUrls = (count) => {
  const allFrames = Object.entries(computerBgGlob)
    .map(([path, url]) => ({
      path,
      url,
      frame: Number(path.match(/(\d+)\.png$/)?.[1] ?? 0)
    }))
    .sort((a, b) => a.frame - b.frame)
    .map((item) => item.url);
  if (typeof count !== "number" || count <= 0 || count >= allFrames.length) {
    return allFrames;
  }
  return allFrames.slice(0, count);
};

export const getHeroSlideUrls = (count = 4) => {
  const fromHero = sortUrls(heroGlob);
  if (fromHero.length >= count) {
    return fromHero.slice(0, count);
  }
  const fromBg = sortUrls(backgroundGlob);
  const merged = [];
  const seen = new Set();
  const push = (u) => {
    if (u && !seen.has(u)) {
      seen.add(u);
      merged.push(u);
    }
  };
  fromHero.forEach(push);
  fromBg.forEach(push);
  if (merged.length >= count) {
    return merged.slice(0, count);
  }
  const fromCg = sortUrls(computerBgGlob);
  if (fromCg.length === 0) {
    return merged;
  }
  const idxs = [
    0,
    Math.floor(fromCg.length * 0.25),
    Math.floor(fromCg.length * 0.5),
    fromCg.length - 1
  ];
  idxs.forEach((i) => push(fromCg[Math.min(Math.max(0, i), fromCg.length - 1)]));
  let n = 0;
  while (merged.length < count) {
    push(fromCg[n % fromCg.length]);
    n += 1;
  }
  return merged.slice(0, count);
};

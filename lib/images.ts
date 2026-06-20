// ---- Real event imagery (free Unsplash photos) ---------------------------
export const UNSPLASH: Record<string, string> = {
  toast: "1527529482837-4698179dc6ce", // friends toasting
  friends: "1484712401471-05c7215830eb", // friends arms up outdoors
  dj: "1496337589254-7e19d01cec44", // party + DJ smoke
  dance: "1517457373958-b7bdd4587205", // dancing crowd
  crowd: "1471967183320-ee018f6e114a", // colourful party crowd
  hands: "1533174072545-7a4b6ad7a6c3", // hands up, confetti
  concert: "1514525253161-7a46d19cd819", // concert crowd
  balloons: "1530103862676-de8c9debad1d", // colourful balloons
  confetti: "1492684223066-81342ee5ff30", // confetti
  stage: "1506157786151-b8491531f063", // stage lights
  group: "1523580494863-6f3031224c94", // group of people
  vows: "1519741497674-611481863552", // wedding couple
  rings: "1511285560929-80b456fea0bc", // wedding table
  travel: "1488646953014-85cb44e25828", // travel friends
  city: "1503899036084-c55cdd92da26", // city lights
  road: "1501785888041-af3ef285b470", // travel road
};

export function ev(key: string, w = 640): string {
  const id = UNSPLASH[key] || key;
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
}

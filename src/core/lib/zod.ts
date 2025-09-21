import z from "zod";

export const dateToString = z.codec(
  z.coerce.date(), // input schema: Date object
  z.iso.datetime(), // output schema: ISO date string
  {
    decode: (date) => date.toISOString(), // Date → ISO string
    encode: (isoString) => new Date(isoString), // ISO string → Date
  }
);

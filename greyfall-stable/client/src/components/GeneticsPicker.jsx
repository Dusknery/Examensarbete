import React from "react";

// Array-baserad default (matchar AdminPage DEFAULT_GENETICS_TEMPLATE)
const DEFAULT = {
  E: ["e", "e"],
  A: ["a", "a"],
  CrPrl: ["cr", "cr"],
  Z: ["z", "z"],
  D: ["d", "d"],
  Ch: ["ch", "ch"],
  G: ["g", "g"],
  Rn: ["rn", "rn"],
  To: ["to", "to"],
  O: ["o", "o"], // Frame: OO ej tillåten, men här låter vi UI bara ge Oo eller oo
  SB1: ["sb1", "sb1"],
  SW1: ["sw1", "sw1"],
  LP: ["lp", "lp"],
};

function ensure(value) {
  const v = value || {};
  const out = { ...DEFAULT, ...v };

  // Säkerställ att alla loci är arrays med 2
  for (const key of Object.keys(DEFAULT)) {
    const defPair = DEFAULT[key];
    const p = out[key];

    if (!Array.isArray(p) || p.length !== 2) {
      out[key] = [...defPair];
      continue;
    }

    // special: CrPrl får bara innehålla cr/Cr/Prl
    if (key === "CrPrl") {
      out.CrPrl = [
        p?.[0] === "Cr" || p?.[0] === "Prl" ? p[0] : "cr",
        p?.[1] === "Cr" || p?.[1] === "Prl" ? p[1] : "cr",
      ];
    }
  }

  // O: tillåt bara "o/o" eller "O/o" (inte "O/O")
  if (!Array.isArray(out.O) || out.O.length !== 2) out.O = ["o", "o"];
  const OCount = out.O.filter((x) => x === "O").length;
  if (OCount >= 2) out.O = ["O", "o"];

  return out;
}

function creamPearlText(alleles) {
  const a = alleles[0];
  const b = alleles[1];
  const order = (x) => (x === "Cr" ? 0 : x === "Prl" ? 1 : 2);
  const sorted = [a, b].slice().sort((x, y) => order(x) - order(y));
  return `${sorted[0]}${sorted[1]}`;
}

function pairTextFromAlleles([x, y], dom, rec) {
  // För stabil text: dom först om den finns
  const domCount = [x, y].filter((a) => a === dom).length;
  if (domCount === 2) return `${dom}${dom}`;
  if (domCount === 1) return `${dom}${rec}`;
  return `${rec}${rec}`;
}

export function geneticsToString(g) {
  const v = ensure(g);

  return [
    pairTextFromAlleles(v.E, "E", "e"),
    pairTextFromAlleles(v.A, "A", "a"),
    creamPearlText(v.CrPrl),
    pairTextFromAlleles(v.Z, "Z", "z"),
    pairTextFromAlleles(v.D, "D", "d"),
    pairTextFromAlleles(v.Ch, "Ch", "ch"),
    pairTextFromAlleles(v.G, "G", "g"),
    pairTextFromAlleles(v.Rn, "Rn", "rn"),
    pairTextFromAlleles(v.To, "To", "to"),
    v.O.filter((x) => x === "O").length === 1 ? "Oo" : "oo",
    pairTextFromAlleles(v.SB1, "SB1", "sb1"),
    pairTextFromAlleles(v.SW1, "SW1", "sw1"),
    pairTextFromAlleles(v.LP, "LP", "lp"),
  ].join(" / ");
}

function TwoAlleleGene({ label, pair, domLabel, domAllele, recAllele, onChange }) {
  const domCount = pair.filter((x) => x === domAllele).length;
  const a1 = domCount >= 1;
  const a2 = domCount >= 2;

  function setCount(nextCount) {
    const next =
      nextCount === 2
        ? [domAllele, domAllele]
        : nextCount === 1
        ? [domAllele, recAllele]
        : [recAllele, recAllele];
    onChange(next);
  }

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <strong>{label}</strong>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }} title={domLabel}>
          <input
            type="checkbox"
            checked={a1}
            onChange={(e) => {
              const next = (e.target.checked ? 1 : 0) + (a2 ? 1 : 0);
              setCount(next);
            }}
          />
          <span>{domLabel}</span>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }} title={domLabel}>
          <input
            type="checkbox"
            checked={a2}
            onChange={(e) => {
              const next = (a1 ? 1 : 0) + (e.target.checked ? 1 : 0);
              setCount(next);
            }}
          />
          <span>{domLabel}</span>
        </label>
      </div>
    </div>
  );
}

function OneAlleleGene({ label, checked, onChange, boxLabel }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <strong>{label}</strong>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }} title={boxLabel}>
          <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
          <span>{boxLabel}</span>
        </label>
      </div>
    </div>
  );
}

function CrPrlLocus({ alleles, onChange }) {
  const [a1, a2] = alleles;

  function setAllele(index, next) {
    const nextAlleles = [...alleles];
    nextAlleles[index] = next;

    const CrCount = nextAlleles.filter((x) => x === "Cr").length;
    const PrlCount = nextAlleles.filter((x) => x === "Prl").length;

    if (CrCount === 2 && PrlCount > 0) {
      for (let i = 0; i < 2; i++) {
        if (nextAlleles[i] === "Prl") nextAlleles[i] = "cr";
      }
    }

    onChange(nextAlleles);
  }

  function alleleBox(index, kind) {
    const current = index === 0 ? a1 : a2;
    const checked = current === kind;

    return (
      <label style={{ display: "flex", gap: 8, alignItems: "center" }} title={kind}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            if (!e.target.checked) setAllele(index, "cr");
            else setAllele(index, kind);
          }}
        />
        <span>{kind}</span>
      </label>
    );
  }

  const CrCount = alleles.filter((x) => x === "Cr").length;
  const disablePrl = CrCount === 2;

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <strong>Cream / Pearl</strong>

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ minWidth: 70, opacity: 0.8 }}>Allel 1</span>
          {alleleBox(0, "Cr")}
          <label style={{ display: "flex", gap: 8, alignItems: "center" }} title="Prl">
            <input
              type="checkbox"
              checked={a1 === "Prl"}
              disabled={disablePrl}
              onChange={(e) => {
                if (!e.target.checked) setAllele(0, "cr");
                else setAllele(0, "Prl");
              }}
            />
            <span>Prl</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ minWidth: 70, opacity: 0.8 }}>Allel 2</span>
          {alleleBox(1, "Cr")}
          <label style={{ display: "flex", gap: 8, alignItems: "center" }} title="Prl">
            <input
              type="checkbox"
              checked={a2 === "Prl"}
              disabled={disablePrl}
              onChange={(e) => {
                if (!e.target.checked) setAllele(1, "cr");
                else setAllele(1, "Prl");
              }}
            />
            <span>Prl</span>
          </label>
        </div>

        <small style={{ opacity: 0.8 }}>
          Default är crcr. Du kan välja Cr eller Prl per allel.
        </small>
      </div>
    </div>
  );
}

export default function GeneticsPicker({ value, onChange }) {
  const v = ensure(value);

  function update(key, next) {
    onChange?.({ ...v, [key]: next });
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>Genetik</h3>

      <div style={{ display: "grid", gap: 14, padding: 12, border: "1px solid #ddd", borderRadius: 10, background: "white" }}>
        <TwoAlleleGene
          label="Extension (E)"
          pair={v.E}
          domLabel="E"
          domAllele="E"
          recAllele="e"
          onChange={(pair) => update("E", pair)}
        />

        <TwoAlleleGene
          label="Agouti (A)"
          pair={v.A}
          domLabel="A"
          domAllele="A"
          recAllele="a"
          onChange={(pair) => update("A", pair)}
        />
      </div>

      <div style={{ display: "grid", gap: 14, padding: 12, border: "1px solid #ddd", borderRadius: 10, background: "white" }}>
        <CrPrlLocus alleles={v.CrPrl} onChange={(alleles) => update("CrPrl", alleles)} />
      </div>

      <div style={{ display: "grid", gap: 14, padding: 12, border: "1px solid #ddd", borderRadius: 10, background: "white" }}>
        <TwoAlleleGene label="Silver (Z)" pair={v.Z} domLabel="Z" domAllele="Z" recAllele="z" onChange={(pair) => update("Z", pair)} />
        <TwoAlleleGene label="Dun (D)" pair={v.D} domLabel="D" domAllele="D" recAllele="d" onChange={(pair) => update("D", pair)} />
        <TwoAlleleGene label="Champagne (Ch)" pair={v.Ch} domLabel="Ch" domAllele="Ch" recAllele="ch" onChange={(pair) => update("Ch", pair)} />
        <TwoAlleleGene label="Grey (G)" pair={v.G} domLabel="G" domAllele="G" recAllele="g" onChange={(pair) => update("G", pair)} />
        <TwoAlleleGene label="Roan (Rn)" pair={v.Rn} domLabel="Rn" domAllele="Rn" recAllele="rn" onChange={(pair) => update("Rn", pair)} />
        <TwoAlleleGene label="Tobiano (To)" pair={v.To} domLabel="To" domAllele="To" recAllele="to" onChange={(pair) => update("To", pair)} />

        <OneAlleleGene
          label="Frame Overo (O)"
          boxLabel="O"
          checked={v.O.filter((x) => x === "O").length === 1}
          onChange={(checked) => update("O", checked ? ["O", "o"] : ["o", "o"])}
        />

        <TwoAlleleGene label="Sabino 1 (SB1)" pair={v.SB1} domLabel="SB1" domAllele="SB1" recAllele="sb1" onChange={(pair) => update("SB1", pair)} />
        <TwoAlleleGene label="Splash (SW1)" pair={v.SW1} domLabel="SW1" domAllele="SW1" recAllele="sw1" onChange={(pair) => update("SW1", pair)} />
        <TwoAlleleGene label="Leopard (LP)" pair={v.LP} domLabel="LP" domAllele="LP" recAllele="lp" onChange={(pair) => update("LP", pair)} />
      </div>

      <div style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, background: "#fafafa", fontSize: 14 }}>
        {geneticsToString(v)}
      </div>
    </div>
  );
}
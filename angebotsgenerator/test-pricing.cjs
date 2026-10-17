"use strict";
const assert=require("node:assert/strict");
const E=require("./pricing.js");
let n=0;
function test(name,fn){fn();n++;console.log("OK",name);}
const base={company:"Musterwerk Testbetrieb (fiktiv)",contact:"Alex Beispiel (fiktiv)",wishes:"FIKTIVER FUNKTIONSTEST. Kein Auftrag.",hourlyRate:45,extraCost:30,riskPercent:15};
function q(o){return E.calculate({...base,...o});}
test("Elektro Starter 4 Seiten Kontakt entspricht V1",()=>{
 const r=q({package:"starter",trade:"elektro",pages:4,addons:["kontakt"]});
 assert.equal(r.hours,12);assert.equal(r.labor,540);assert.equal(r.directCosts,30);assert.equal(r.bufferAmount,85.5);assert.equal(r.internalBasis,655.5);
});
test("SHK Plus 7 Seiten Galerie und lokale SEO",()=>{
 const r=q({package:"plus",trade:"shk",pages:7,addons:["galerie","lokalseo"]});
 assert.equal(r.hours,27);assert.equal(r.internalBasis,1431.75);
});
test("Dach Starter 5 Seiten mit Terminmodul",()=>{
 const r=q({package:"starter",trade:"dach",pages:5,addons:["termin"]});
 assert.equal(r.hours,19);assert.equal(r.directCosts,60);assert.equal(r.internalBasis,1052.25);
});
test("Maler Premium 4 Seiten Galerie und Texte",()=>{
 const r=q({package:"premium",trade:"maler",pages:4,addons:["galerie","texte"]});
 assert.equal(r.hours,27);assert.equal(r.internalBasis,1431.75);
});
test("Pages=1 behält Paketgrundstruktur",()=>{
 const r=q({package:"starter",trade:"elektro",pages:1,addons:[]});
 assert.equal(r.costHours.extraPages,0);assert.equal(r.hours,10);
});
test("Unbekanntes Gewerk abweisen",()=>{
 assert.throws(()=>q({package:"starter",trade:"xyz",pages:4,addons:[]}),/Ungültige Auswahl/);
});
test("Unbekanntes Modul abweisen",()=>{
 assert.throws(()=>q({package:"starter",trade:"elektro",pages:4,addons:["secret"]}),/Ungültige Auswahl/);
});
test("Doppelte Module abweisen",()=>{
 assert.throws(()=>q({package:"starter",trade:"elektro",pages:4,addons:["kontakt","kontakt"]}),/eindeutig/);
});
test("Ungültige Seitenzahl abweisen",()=>{
 assert.throws(()=>q({package:"starter",trade:"elektro",pages:3.5,addons:[]}),/ganze Zahl/);
 assert.throws(()=>q({package:"starter",trade:"elektro",pages:31,addons:[]}),/Bereich/);
});
test("NaN und negative Werte abweisen",()=>{
 assert.throws(()=>q({package:"starter",trade:"elektro",pages:4,addons:[],hourlyRate:"oops"}),/Bereich/);
 assert.throws(()=>q({package:"starter",trade:"elektro",pages:4,addons:[],extraCost:-1}),/Bereich/);
});
test("Entwurf gibt keinen verbindlichen Verkaufspreis aus",()=>{
 const r=q({package:"starter",trade:"elektro",pages:4,addons:["kontakt"]});
 const s=E.draft(base,r);
 assert.match(s,/FIKTIVER TEST/);assert.match(s,/KEINE E-Mail automatisch versenden/);
 assert.match(s,/Kundenpreis: \[NACH PRÜFUNG UND FREIGABE EINTRAGEN\]/);assert.match(s,/655,50/);
});
console.log("Ergebnis:",n,"Testgruppen bestanden.");
"use strict";
/**
 * Formspree synthetic test submissions only.
 * Default: validate + preview WITHOUT network access.
 * Network sending requires both --send and --confirm-test and an allowlisted endpoint
 * supplied through WERKWEB_TEST_FORMSPREE_ENDPOINT.
 * No real personal details or customer requests are supported.
 */
const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const pricing=require("./pricing.js");

const DEFAULT_MESSAGE="FIKTIVER FUNKTIONSTEST. Gewünscht ist eine Website mit Startseite, Leistungen, Über uns und Kontakt. Kein echter Auftrag. Keine Nachricht an die angegebene Beispieladresse senden.";

const SCENARIOS=Object.freeze({
  elektro:{trade:"Elektrik",style:"Voltwerk – Elektro",package:"starter",pages:4,addons:["kontakt"],expected:655.50,pricingTrade:"elektro"},
  shk:{trade:"Sanitär / Heizung",style:"Wasserwerk – SHK",package:"plus",pages:7,addons:["galerie","lokalseo"],expected:1431.75,pricingTrade:"shk"},
  dach:{trade:"Dachdecker",style:"Dachkante – Dachdecker",package:"starter",pages:5,addons:["termin"],expected:1052.25,pricingTrade:"dach"},
  maler:{trade:"Maler",style:"Farbraum° – Maler",package:"premium",pages:4,addons:["galerie","texte"],expected:1431.75,pricingTrade:"maler"}
});

function assertScenario(name){
  assert.ok(Object.hasOwn(SCENARIOS,name),"Unbekanntes Testszenario");
  const s=SCENARIOS[name];
  assert.equal(pricing.TRADES[s.pricingTrade].label,s.trade);
  assert.equal(pricing.TRADES[s.pricingTrade].design,s.style);
  const r=pricing.calculate({package:s.package,trade:s.pricingTrade,pages:s.pages,addons:s.addons,hourlyRate:45,extraCost:30,riskPercent:15});
  assert.equal(r.internalBasis,s.expected,"Testrechnung inkonsistent");
  return {s,r};
}

function fixture(name){
  const {s,r}=assertScenario(name);
  const ref="WW-TEST-"+name.toUpperCase()+"-"+crypto.randomUUID().slice(0,13);
  assert.match(ref,/^[A-Za-z0-9-]{1,80}$/);
  return {
    payload:{
      company:"Musterwerk Testbetrieb (fiktiv)",
      name:"Alex Beispiel (fiktiv)",
      email:"werkweb-test@example.com",
      trade:s.trade,
      style:s.style,
      package:s.package,
      pages:String(s.pages),
      addons:s.addons.join(","),
      message:DEFAULT_MESSAGE,
      source:"WERKWEB Studio",
      test_only:"true",
      submission_id:ref
    },
    expectedInternalBasis:r.internalBasis
  };
}
async function main(){
  const args=process.argv.slice(2);
  if(args.includes("--validate")){
    for(const name of Object.keys(SCENARIOS)){
      const sample=fixture(name);
      assert.equal(sample.payload.test_only,"true");
      assert.ok(sample.payload.submission_id.startsWith("WW-TEST-"));
      console.log("OK",name,"→",pricing.money(sample.expectedInternalBasis),"interne DEMO-Kostenbasis");
    }
    console.log("Validiert:",Object.keys(SCENARIOS).length,"fiktive Szenarien; KEINE Übertragung.");
    return;
  }
  const name=args.find(x=>!x.startsWith("--"))||"elektro";
  const f=fixture(name);
  if(!args.includes("--send")){
    console.log("VORSCHAU – kein Versand. Testfall:",name);
    console.log(JSON.stringify(f,null,2));
    return;
  }
  if(!args.includes("--confirm-test"))throw new Error("--confirm-test erforderlich.");
  if(process.env.WERKWEB_ALLOW_SYNTHETIC_FORM_POST!=="YES")throw new Error("WERKWEB_ALLOW_SYNTHETIC_FORM_POST=YES erforderlich.");
  const endpoint=process.env.WERKWEB_TEST_FORMSPREE_ENDPOINT||"";
  if(!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,30}$/.test(endpoint))throw new Error("Endpoint fehlt/ist nicht erlaubt. Exakt https://formspree.io/f/<Form-ID> verwenden.");
  const abort=AbortSignal.timeout(25000);
  const res=await fetch(endpoint,{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:new URLSearchParams(f.payload),signal:abort,redirect:"error"});
  console.log("Synthetisches Testszenario:",name,"Referenz:",f.payload.submission_id,"HTTP-Status:",res.status);
  if(!res.ok)throw new Error("Formspree-Testübermittlung nicht bestätigt – Details im Formspree-Dashboard prüfen.");
  console.log("Formspree nahm die fiktive Anfrage an. Gmail-Benachrichtigung und KI-Entwurf sind separat zu verifizieren.");
}
main().catch(err=>{console.error("Test gestoppt:",err.message);process.exitCode=1;});
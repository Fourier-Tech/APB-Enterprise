"use client";

import { useState } from "react";
import styles from "@/app/contact/contact.module.css";

interface QuoteWizardProps {
  whatsappNumber: string;
}

export default function QuoteWizard({ whatsappNumber }: QuoteWizardProps) {
  const [activeTab, setActiveTab] = useState<"harness" | "control">("harness");

  /* ── HARNESS FORM STATES ── */
  const [harnessClientName, setHarnessClientName] = useState("");
  const [harnessCallbackDate, setHarnessCallbackDate] = useState("");
  const [harnessTotalFloors, setHarnessTotalFloors] = useState("");
  const [harnessMrType, setHarnessMrType] = useState("Machine Room");
  const [harnessLop, setHarnessLop] = useState("Single Button");
  const [harnessDoorType, setHarnessDoorType] = useState("Auto Door");
  const [harnessOverHeadHeight, setHarnessOverHeadHeight] = useState("");
  const [harnessPitHeight, setHarnessPitHeight] = useState("");
  const [harnessFloorToFloorHeight, setHarnessFloorToFloorHeight] = useState("");
  const [harnessTotalTravelHeight, setHarnessTotalTravelHeight] = useState("");
  const [harnessPanelDetail, setHarnessPanelDetail] = useState("5 HP / 9 A Integrated MRL panel ARD Type");
  const [harnessLopCopPurchase, setHarnessLopCopPurchase] = useState("");
  const [harnessExtraNote, setHarnessExtraNote] = useState("");

  /* ── CONTROL PANEL FORM STATES (DUMMY DETAILS) ── */
  const [cpClientName, setCpClientName] = useState("");
  const [cpModel, setCpModel] = useState("");
  const [cpControlType, setCpControlType] = useState("Standard");
  const [cpPanelSize, setCpPanelSize] = useState("");
  const [cpHpRating, setCpHpRating] = useState("7.5 HP");
  const [cpPhaseType, setCpPhaseType] = useState("3-Phase (415V)");
  const [cpExtraNote, setCpExtraNote] = useState("");

  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  /* ── HARNESS SUBMIT BUILDER ── */
  const handleHarnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!harnessClientName || !harnessTotalFloors || !harnessOverHeadHeight || !harnessPitHeight || !harnessFloorToFloorHeight || !harnessTotalTravelHeight) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    const callbackRow = harnessCallbackDate ? `📅 CALLBACK: ${harnessCallbackDate}\n` : "";
    const lopCopRow = harnessLopCopPurchase ? `🛒 LOP/COP UNIT: ${harnessLopCopPurchase}\n` : "";
    const noteRow = harnessExtraNote ? `📝 EXTRA NOTES: ${harnessExtraNote}\n` : "";

    const specText = 
`Hi APB Enterprise team, I am interested in requesting a Harness Quote. Here are my project specifications:

════════ HARNESS SPECIFICATION ════════
🏢 CLIENT NAME  : ${harnessClientName}
${callbackRow}📊 TOTAL FLOORS : ${harnessTotalFloors}
⚙️ MACHINE ROOM : ${harnessMrType}
🚪 DOOR TYPE    : ${harnessDoorType}
🎛️ LOP TYPE     : ${harnessLop}
📐 OVERHEAD HGT : ${harnessOverHeadHeight} mm
📐 PIT HEIGHT   : ${harnessPitHeight} mm
📐 FLOOR-TO-FLR : ${harnessFloorToFloorHeight} mm
📐 TOTAL TRAVEL : ${harnessTotalTravelHeight} mm
🖥️ PANEL SPEC   : ${harnessPanelDetail}
${lopCopRow}${noteRow}════════════════════════════════════

Please review these parameters and share a customized quote with me.`;

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(specText)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  /* ── CONTROL PANEL SUBMIT BUILDER ── */
  const handleControlPanelSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cpClientName || !cpPanelSize) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    const modelRow = cpModel ? `📦 CP MODEL    : ${cpModel}\n` : "";
    const noteRow = cpExtraNote ? `📝 EXTRA NOTES: ${cpExtraNote}\n` : "";

    const specText = 
`Hi APB Enterprise team, I am interested in requesting a Control Panel Quote. Here are my project specifications:

════════ CONTROL PANEL SPEC ════════
🏢 CLIENT NAME  : ${cpClientName}
${modelRow}🎛️ CONTROL TYPE : ${cpControlType}
⚡ HP RATING    : ${cpHpRating}
🔋 PHASE TYPE   : ${cpPhaseType}
📐 PANEL SIZE   : ${cpPanelSize} mm
${noteRow}════════════════════════════════════

Please review these parameters and share a customized quote with me.`;

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(specText)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className={styles["wizard-header"]}>
        <div className={styles["wizard-eyebrow"]}>
          <span className={styles["eyebrow-line"]} />
          <span className={styles["wizard-eyebrow-text"]}>Interactive Spec Wizard</span>
        </div>
        <h2>Project Quote Engine</h2>
        <p>Configure details below to compile a custom spec-sheet. Submit to send instantly via WhatsApp.</p>
      </div>

      <div className={styles["quote-wizard-card"]}>

      {/* Wizard toggle control segments */}
      <div className={styles["wizard-tabs"]}>
        <button
          type="button"
          className={`${styles["tab-btn"]} ${activeTab === "harness" ? styles["active"] : ""}`}
          onClick={() => setActiveTab("harness")}
        >
          Harness Specs
        </button>
        <button
          type="button"
          className={`${styles["tab-btn"]} ${activeTab === "control" ? styles["active"] : ""}`}
          onClick={() => setActiveTab("control")}
        >
          Control Panel
        </button>
      </div>

      {/* Tab 1: Harness Form */}
      {activeTab === "harness" && (
        <form onSubmit={handleHarnessSubmit}>
          <div className={styles["form-grid"]}>
            {/* Client Name */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="harnessClientName">
                <i className="fas fa-building" /> Client / Company Name <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-user-tie ${styles["input-icon-prefix"]}`} />
                <input
                  type="text"
                  id="harnessClientName"
                  required
                  placeholder="e.g. Apex Elevators"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]}`}
                  value={harnessClientName}
                  onChange={(e) => setHarnessClientName(e.target.value)}
                />
              </div>
            </div>

            {/* Preferred Callback Date */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="harnessCallbackDate">
                <i className="fas fa-calendar-alt" /> Preferred Callback Date <span className={styles["label-sub"]}>(Optional)</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <input
                  type="date"
                  id="harnessCallbackDate"
                  className={styles["form-input"]}
                  value={harnessCallbackDate}
                  onChange={(e) => setHarnessCallbackDate(e.target.value)}
                />
              </div>
            </div>

            {/* Total Floors */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="harnessTotalFloors">
                <i className="fas fa-layer-group" /> Total Floors <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-building-user ${styles["input-icon-prefix"]}`} />
                <input
                  type="text"
                  id="harnessTotalFloors"
                  required
                  placeholder="e.g. B + G + 7 Floors"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]}`}
                  value={harnessTotalFloors}
                  onChange={(e) => setHarnessTotalFloors(e.target.value)}
                />
              </div>
            </div>

            {/* LOP Details */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="harnessLop">
                <i className="fas fa-list-alt" /> LOP Type <span className={styles["req"]}>*</span> <span className={styles["label-sub"]}>(Landing Panel)</span>
              </label>
              <select
                id="harnessLop"
                required
                className={styles["form-input"]}
                value={harnessLop}
                onChange={(e) => setHarnessLop(e.target.value)}
              >
                <option value="Single Button">Single Button</option>
                <option value="Double Button">Double Button</option>
              </select>
            </div>

            {/* Machine Room */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label>
                <i className="fas fa-cogs" /> Machine Room Configuration <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["radio-capsule-group"]}>
                <label className={styles["radio-capsule"]}>
                  <input
                    type="radio"
                    name="harnessMrType"
                    value="Machine Room"
                    checked={harnessMrType === "Machine Room"}
                    onChange={() => setHarnessMrType("Machine Room")}
                  />
                  <span className={styles["radio-capsule-box"]}>Machine Room</span>
                </label>
                <label className={styles["radio-capsule"]}>
                  <input
                    type="radio"
                    name="harnessMrType"
                    value="Machine Room Less (MRL)"
                    checked={harnessMrType === "Machine Room Less (MRL)"}
                    onChange={() => setHarnessMrType("Machine Room Less (MRL)")}
                  />
                  <span className={styles["radio-capsule-box"]}>MRL Less</span>
                </label>
              </div>
            </div>

            {/* Door Type */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label>
                <i className="fas fa-door-open" /> Door Mechanism <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["radio-capsule-group"]}>
                <label className={styles["radio-capsule"]}>
                  <input
                    type="radio"
                    name="harnessDoorType"
                    value="Auto Door"
                    checked={harnessDoorType === "Auto Door"}
                    onChange={() => setHarnessDoorType("Auto Door")}
                  />
                  <span className={styles["radio-capsule-box"]}>Auto Door</span>
                </label>
                <label className={styles["radio-capsule"]}>
                  <input
                    type="radio"
                    name="harnessDoorType"
                    value="Manual Door"
                    checked={harnessDoorType === "Manual Door"}
                    onChange={() => setHarnessDoorType("Manual Door")}
                  />
                  <span className={styles["radio-capsule-box"]}>Manual Door</span>
                </label>
              </div>
            </div>

            {/* Overhead Height - STRICTLY MM (1 column of twin-row) */}
            <div className={styles["form-group"]}>
              <label htmlFor="harnessOverHeadHeight">
                <i className="fas fa-ruler-vertical" /> Over Head Height <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-arrows-up-down ${styles["input-icon-prefix"]}`} />
                <input
                  type="number"
                  id="harnessOverHeadHeight"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 3800"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]} ${styles["form-input-with-suffix"]}`}
                  value={harnessOverHeadHeight}
                  onChange={(e) => setHarnessOverHeadHeight(e.target.value)}
                />
                <span className={styles["input-mm-suffix"]}>mm</span>
              </div>
            </div>

            {/* Pit Height - STRICTLY MM (2 column of twin-row) */}
            <div className={styles["form-group"]}>
              <label htmlFor="harnessPitHeight">
                <i className="fas fa-arrows-alt-v" /> Pit Height <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-arrows-up-down ${styles["input-icon-prefix"]}`} />
                <input
                  type="number"
                  id="harnessPitHeight"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 1500"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]} ${styles["form-input-with-suffix"]}`}
                  value={harnessPitHeight}
                  onChange={(e) => setHarnessPitHeight(e.target.value)}
                />
                <span className={styles["input-mm-suffix"]}>mm</span>
              </div>
            </div>

            {/* Floor to Floor Height - STRICTLY MM (1 column of twin-row) */}
            <div className={styles["form-group"]}>
              <label htmlFor="harnessFloorToFloorHeight">
                <i className="fas fa-ruler" /> Floor To Floor Height <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-arrows-up-down ${styles["input-icon-prefix"]}`} />
                <input
                  type="number"
                  id="harnessFloorToFloorHeight"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 3100"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]} ${styles["form-input-with-suffix"]}`}
                  value={harnessFloorToFloorHeight}
                  onChange={(e) => setHarnessFloorToFloorHeight(e.target.value)}
                />
                <span className={styles["input-mm-suffix"]}>mm</span>
              </div>
            </div>

            {/* Total Travel Height - STRICTLY MM (2 column of twin-row) */}
            <div className={styles["form-group"]}>
              <label htmlFor="harnessTotalTravelHeight">
                <i className="fas fa-route" /> Total Travel Height <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-arrows-up-down ${styles["input-icon-prefix"]}`} />
                <input
                  type="number"
                  id="harnessTotalTravelHeight"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 24800"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]} ${styles["form-input-with-suffix"]}`}
                  value={harnessTotalTravelHeight}
                  onChange={(e) => setHarnessTotalTravelHeight(e.target.value)}
                />
                <span className={styles["input-mm-suffix"]}>mm</span>
              </div>
            </div>

            {/* Panel Detail */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="harnessPanelDetail">
                <i className="fas fa-desktop" /> Panel Details <span className={styles["req"]}>*</span>
              </label>
              <select
                id="harnessPanelDetail"
                required
                className={styles["form-input"]}
                value={harnessPanelDetail}
                onChange={(e) => setHarnessPanelDetail(e.target.value)}
              >
                <option value="5 HP / 9 A Integrated MRL panel ARD Type">5 HP / 9 A Integrated MRL panel ARD Type</option>
                <option value="5 HP / 9A Integrated MRL Panel UPS Type">5 HP / 9A Integrated MRL Panel UPS Type</option>
                <option value="7.5 HP / 13 A Integrated MRL panel ARD Type">7.5 HP / 13 A Integrated MRL panel ARD Type</option>
                <option value="7.5 HP / 13 A Integrated MRL panel UPS Type">7.5 HP / 13 A Integrated MRL panel UPS Type</option>
                <option value="10 HP / 18 A Integrated MRL panel ARD Type">10 HP / 18 A Integrated MRL panel ARD Type</option>
                <option value="10 HP / 18 A Integrated MRL panel UPS Type">10 HP / 18 A Integrated MRL panel UPS Type</option>
                <option value="15 HP / 26 A Integrated MRL panel ARD Type">15 HP / 26 A Integrated MRL panel ARD Type</option>
                <option value="15 HP / 26 A Integrated MRL panel UPS Type">15 HP / 26 A Integrated MRL panel UPS Type</option>
              </select>
            </div>

            {/* LOP/COP Purchase option */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="harnessLopCopPurchase">
                <i className="fas fa-shopping-cart" /> LOP / COP Purchase <span className={styles["label-sub"]}>(Optional)</span>
              </label>
              <select
                id="harnessLopCopPurchase"
                className={styles["form-input"]}
                value={harnessLopCopPurchase}
                onChange={(e) => setHarnessLopCopPurchase(e.target.value)}
              >
                <option value="">Not required / Self procured</option>
                <option value="Acrylic Type With Button">Acrylic Type With Button</option>
                <option value="SS type Wall mounted">SS type Wall mounted</option>
                <option value="Touch Type Wall Mounted">Touch Type Wall Mounted</option>
              </select>
            </div>

            {/* Extra Note */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="harnessExtraNote">
                <i className="fas fa-pencil-alt" /> Additional Specs / Notes <span className={styles["label-sub"]}>(Optional)</span>
              </label>
              <textarea
                id="harnessExtraNote"
                placeholder="Extra Notes"
                className={styles["form-input"]}
                rows={3}
                value={harnessExtraNote}
                onChange={(e) => setHarnessExtraNote(e.target.value)}
              />
            </div>
          </div>

          <div className={styles["submit-panel"]}>
            <button type="submit" className={styles["submit-btn"]}>
              <i className="fab fa-whatsapp" /> Send on WhatsApp
            </button>
            <p className={styles["privacy-notice"]}>
              * Required fields. All specifications compiled directly on your client browser, secure and encrypted.
            </p>
          </div>
        </form>
      )}

      {/* Tab 2: Control Panel Form (Dummy details) */}
      {activeTab === "control" && (
        <form onSubmit={handleControlPanelSubmit}>
          <div className={styles["form-grid"]}>
            {/* Client Name */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="cpClientName">
                <i className="fas fa-building" /> Client / Company Name <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-user-tie ${styles["input-icon-prefix"]}`} />
                <input
                  type="text"
                  id="cpClientName"
                  required
                  placeholder="e.g. Apex Elevators"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]}`}
                  value={cpClientName}
                  onChange={(e) => setCpClientName(e.target.value)}
                />
              </div>
            </div>

            {/* Model Code */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="cpModel">
                <i className="fas fa-barcode" /> CP Model Number <span className={styles["label-sub"]}>(Optional)</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-tag ${styles["input-icon-prefix"]}`} />
                <input
                  type="text"
                  id="cpModel"
                  placeholder="e.g. APB-MRL-500"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]}`}
                  value={cpModel}
                  onChange={(e) => setCpModel(e.target.value)}
                />
              </div>
            </div>

            {/* Control Type */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="cpControlType">
                <i className="fas fa-gears" /> Control System Profile <span className={styles["req"]}>*</span>
              </label>
              <select
                id="cpControlType"
                required
                className={styles["form-input"]}
                value={cpControlType}
                onChange={(e) => setCpControlType(e.target.value)}
              >
                <option value="Standard">Standard (Geared Control)</option>
                <option value="Premium">Premium (Gearless Control)</option>
                <option value="Monarch Integrated">Monarch Integrated</option>
                <option value="Custom Panel">Bespoke Custom Controller</option>
              </select>
            </div>

            {/* HP Rating (Dummy) */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="cpHpRating">
                <i className="fas fa-bolt" /> HP / Amp Rating <span className={styles["req"]}>*</span>
              </label>
              <select
                id="cpHpRating"
                required
                className={styles["form-input"]}
                value={cpHpRating}
                onChange={(e) => setCpHpRating(e.target.value)}
              >
                <option value="5 HP / 9 A">5 HP / 9 A</option>
                <option value="7.5 HP / 13 A">7.5 HP / 13 A</option>
                <option value="10 HP / 18 A">10 HP / 18 A</option>
                <option value="15 HP / 26 A">15 HP / 26 A</option>
              </select>
            </div>

            {/* Power Phase Type (Dummy) */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="cpPhaseType">
                <i className="fas fa-plug" /> Power System Phase <span className={styles["req"]}>*</span>
              </label>
              <select
                id="cpPhaseType"
                required
                className={styles["form-input"]}
                value={cpPhaseType}
                onChange={(e) => setCpPhaseType(e.target.value)}
              >
                <option value="3-Phase (415V)">3-Phase AC (415V)</option>
                <option value="1-Phase (230V)">1-Phase AC (230V)</option>
                <option value="Low Voltage DC">Low Voltage System (DC)</option>
              </select>
            </div>

            {/* Panel Size - STRICTLY MM */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="cpPanelSize">
                <i className="fas fa-ruler" /> Target Panel Box Size <span className={styles["req"]}>*</span>
              </label>
              <div className={styles["input-wrapper"]}>
                <i className={`fas fa-maximize ${styles["input-icon-prefix"]}`} />
                <input
                  type="number"
                  id="cpPanelSize"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 600"
                  className={`${styles["form-input"]} ${styles["form-input-with-prefix"]} ${styles["form-input-with-suffix"]}`}
                  value={cpPanelSize}
                  onChange={(e) => setCpPanelSize(e.target.value)}
                />
                <span className={styles["input-mm-suffix"]}>mm</span>
              </div>
            </div>

            {/* Notes */}
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label htmlFor="cpExtraNote">
                <i className="fas fa-pencil-alt" /> Custom Panel Requirements <span className={styles["label-sub"]}>(Optional)</span>
              </label>
              <textarea
                id="cpExtraNote"
                placeholder="Extra Notes"
                className={styles["form-input"]}
                rows={3}
                value={cpExtraNote}
                onChange={(e) => setCpExtraNote(e.target.value)}
              />
            </div>
          </div>

          <div className={styles["submit-panel"]}>
            <button type="submit" className={styles["submit-btn"]}>
              <i className="fab fa-whatsapp" /> Send on WhatsApp
            </button>
            <p className={styles["privacy-notice"]}>
              * Required fields. All specifications compiled directly on your client browser, secure and encrypted.
            </p>
          </div>
        </form>
      )}
    </div>
  </div>
  );
}
